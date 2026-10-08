import { useState, useEffect } from 'react';
import { Layers, Plus, Edit3, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import SelectField from '../../components/forms/SelectField';
import FileUploadField from '../../components/forms/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function AdminCategoriesPage() {
  const { success, error: toastError } = useToast();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm Dialog
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAllCategories();
      const list = res.categories || res.data;
      if (res.success && Array.isArray(list)) {
        setCategories(list);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setStatus('ACTIVE');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setStatus(cat.status || 'ACTIVE');
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toastError('Category name is required.');
      return;
    }

    const payload = new FormData();
    payload.append('name', name.trim());
    payload.append('description', description.trim());
    payload.append('status', status);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      setIsSaving(true);
      if (editingCategory) {
        const res = await adminApi.updateCategory(editingCategory.id, payload);
        if (res.success) {
          success('Category updated successfully.');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await adminApi.createCategory(payload);
        if (res.success) {
          success('Category created successfully.');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    const nextStatus = cat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminApi.changeCategoryStatus(cat.id, nextStatus);
      if (res.success) {
        success(`Category status updated to ${nextStatus}.`);
        fetchCategories();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update category status.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await adminApi.deleteCategory(deletingId);
      if (res.success) {
        success('Category deleted successfully.');
        setDeletingId(null);
        fetchCategories();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Category',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={getImageUrl(row.image)}
            alt={row.name}
            style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            onError={handleImageError}
          />
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row.description || 'No description provided'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Click to toggle status"
        >
          <StatusBadge status={row.status} />
        </button>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="action-btn-sm"
            onClick={() => openEditModal(row)}
            title="Edit category"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            className="action-btn-sm delete"
            onClick={() => setDeletingId(row.id)}
            title="Delete category"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminDataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        searchPlaceholder="Search categories by name..."
        searchKey="name"
        emptyMessage="No furniture categories found"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        }
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
      >
        <form onSubmit={handleSaveCategory}>
          <InputField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sofas & Lounges"
            required
          />

          <TextAreaField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Living room seating, armchairs, and sectional couches..."
            rows={3}
          />

          <SelectField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
            ]}
          />

          <FileUploadField
            label="Category Banner Image"
            onChange={setImageFile}
            currentPreviewUrl={editingCategory ? getImageUrl(editingCategory.image) : null}
            hint="Upload image representation for the category (PNG, JPG)"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? Associated products may be affected."
        confirmText="Delete Category"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminCategoriesPage;
