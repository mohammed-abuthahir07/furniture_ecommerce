import { useState, useEffect } from 'react';
import { Percent, Plus, Edit3, Trash2, Calendar } from 'lucide-react';
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
import { formatDate } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function AdminOffersPage() {
  const { success, error: toastError } = useToast();

  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'PERCENTAGE',
    discount_value: '',
    start_date: '',
    end_date: '',
    status: 'ACTIVE',
  });
  const [offerImageFile, setOfferImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAllOffers();
      if (res.success && Array.isArray(res.data)) {
        setOffers(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load offers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      discount_type: 'PERCENTAGE',
      discount_value: '15',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'ACTIVE',
    });
    setOfferImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      discount_type: offer.discount_type || 'PERCENTAGE',
      discount_value: String(offer.discount_value || ''),
      start_date: offer.start_date ? new Date(offer.start_date).toISOString().split('T')[0] : '',
      end_date: offer.end_date ? new Date(offer.end_date).toISOString().split('T')[0] : '',
      status: offer.status || 'ACTIVE',
    });
    setOfferImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.discount_value || !formData.start_date || !formData.end_date) {
      toastError('Please fill in title, discount value, and validity dates.');
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    if (offerImageFile) {
      payload.append('image', offerImageFile);
    }

    try {
      setIsSaving(true);
      if (editingOffer) {
        const res = await adminApi.updateOffer(editingOffer.id, payload);
        if (res.success) {
          success('Offer updated successfully.');
          setIsModalOpen(false);
          fetchOffers();
        }
      } else {
        const res = await adminApi.createOffer(payload);
        if (res.success) {
          success('Offer created successfully.');
          setIsModalOpen(false);
          fetchOffers();
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to save offer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (offer) => {
    const nextStatus = offer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminApi.changeOfferStatus(offer.id, nextStatus);
      if (res.success) {
        success(`Offer status updated to ${nextStatus}.`);
        fetchOffers();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update offer status.');
    }
  };

  const handleDeleteOffer = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await adminApi.deleteOffer(deletingId);
      if (res.success) {
        success('Offer deleted successfully.');
        setDeletingId(null);
        fetchOffers();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete offer.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Offer Campaign',
      accessor: 'title',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {row.image && (
            <img
              src={getImageUrl(row.image)}
              alt={row.title}
              style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              onError={handleImageError}
            />
          )}
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {row.description || 'No description'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount_value',
      render: (row) => (
        <span className="badge badge-primary">
          {row.discount_type === 'PERCENTAGE'
            ? `${row.discount_value}% OFF`
            : `₹${row.discount_value} FLAT`}
        </span>
      ),
    },
    {
      header: 'Validity Period',
      accessor: 'start_date',
      render: (row) => (
        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
          <div>From: {formatDate(row.start_date)}</div>
          <div>To: {formatDate(row.end_date)}</div>
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
          title="Toggle offer status"
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
            title="Edit offer"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            className="action-btn-sm delete"
            onClick={() => setDeletingId(row.id)}
            title="Delete offer"
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
        data={offers}
        isLoading={isLoading}
        searchPlaceholder="Search offers by title..."
        searchKey="title"
        emptyMessage="No promotional offers created yet"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>Create Offer</span>
          </button>
        }
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? `Edit Offer: ${editingOffer.title}` : 'Create Promotional Offer'}
      >
        <form onSubmit={handleSaveOffer}>
          <InputField
            label="Offer Campaign Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Festive WoodCraft Season Sale"
            required
          />

          <TextAreaField
            label="Offer Details / Description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enjoy discounts on all solid teak and oak dining sets..."
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <SelectField
              label="Discount Type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              options={[
                { value: 'PERCENTAGE', label: 'PERCENTAGE (%)' },
                { value: 'FIXED', label: 'FIXED AMOUNT (₹)' },
              ]}
            />

            <InputField
              label="Discount Value"
              name="discount_value"
              type="number"
              value={formData.discount_value}
              onChange={handleChange}
              placeholder="e.g. 15"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />

            <InputField
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <SelectField
            label="Campaign Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
            ]}
          />

          <FileUploadField
            label="Offer Banner Image (Optional)"
            onChange={setOfferImageFile}
            currentPreviewUrl={editingOffer ? getImageUrl(editingOffer.image) : null}
            hint="Campaign promotional artwork (PNG, JPG)"
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
              {isSaving ? 'Saving...' : editingOffer ? 'Update Offer' : 'Publish Offer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteOffer}
        title="Delete Promotional Offer"
        message="Are you sure you want to delete this offer campaign?"
        confirmText="Delete Offer"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminOffersPage;
