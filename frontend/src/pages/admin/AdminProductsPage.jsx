import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Edit3, Trash2, Layers, ExternalLink, Image as ImageIcon } from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminDataTable from '../../components/admin/AdminDataTable';
import StatusBadge from '../../components/common/StatusBadge';
import DimensionsBadge from '../../components/common/DimensionsBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import TextAreaField from '../../components/forms/TextAreaField';
import SelectField from '../../components/forms/SelectField';
import FileUploadField from '../../components/forms/FileUploadField';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function AdminProductsPage() {
  const { success, error: toastError } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    brand: 'WoodCraft',
    short_description: '',
    description: '',
    mrp: '',
    selling_price: '',
    material: 'Solid Wood',
    wood_type: 'Sheesham',
    length: '',
    width: '',
    height: '',
    weight: '',
    seating_capacity: '',
    assembly_required: 'NO',
    delivery_days: '7',
    status: 'ACTIVE',
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm Dialog
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.getAllProducts(),
        adminApi.getAllCategories(),
      ]);

      const productList = prodRes.products || prodRes.data;
      if (prodRes.success && Array.isArray(productList)) {
        setProducts(productList);
      }
      const categoryList = catRes.categories || catRes.data;
      if (catRes.success && Array.isArray(categoryList)) {
        setCategories(categoryList);
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      category_id: categories[0]?.id || '',
      name: '',
      brand: 'WoodCraft',
      short_description: '',
      description: '',
      mrp: '',
      selling_price: '',
      material: 'Solid Wood',
      wood_type: 'Sheesham',
      length: '',
      width: '',
      height: '',
      weight: '',
      seating_capacity: '',
      assembly_required: 'NO',
      delivery_days: '7',
      status: 'ACTIVE',
    });
    setMainImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      category_id: p.category_id || '',
      name: p.name || '',
      brand: p.brand || 'WoodCraft',
      short_description: p.short_description || '',
      description: p.description || '',
      mrp: p.mrp || '',
      selling_price: p.selling_price || '',
      material: p.material || 'Solid Wood',
      wood_type: p.wood_type || 'Sheesham',
      length: p.length || '',
      width: p.width || '',
      height: p.height || '',
      weight: p.weight || '',
      seating_capacity: p.seating_capacity || '',
      assembly_required: p.assembly_required || 'NO',
      delivery_days: String(p.delivery_days || '7'),
      status: p.status || 'ACTIVE',
    });
    setMainImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category_id || !formData.selling_price) {
      toastError('Please fill in product name, category, and selling price.');
      return;
    }

    if (!editingProduct && !mainImageFile) {
      toastError('Main product image is required for new products.');
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        payload.append(key, formData[key]);
      }
    });

    if (mainImageFile) {
      payload.append('main_image', mainImageFile);
    }

    try {
      setIsSaving(true);
      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct.id, payload);
        if (res.success) {
          success('Product updated successfully.');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await adminApi.createProduct(payload);
        if (res.success) {
          success('Product created successfully.');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (p) => {
    const nextStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminApi.changeProductStatus(p.id, nextStatus);
      if (res.success) {
        success(`Product status updated to ${nextStatus}.`);
        fetchProducts();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update product status.');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      const res = await adminApi.deleteProduct(deletingId);
      if (res.success) {
        success('Product deleted successfully.');
        setDeletingId(null);
        fetchProducts();
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src={getImageUrl(row.main_image)}
            alt={row.name}
            style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
            onError={handleImageError}
          />
          <div>
            <Link
              to={`/admin/products/${row.id}`}
              style={{ fontWeight: 700, color: '#0f172a' }}
              title="Manage variants and gallery"
            >
              {row.name}
            </Link>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {row.category_name} • {row.brand || 'WoodCraft'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'selling_price',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>{formatCurrency(row.selling_price)}</div>
          {row.mrp && <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatCurrency(row.mrp)}</div>}
        </div>
      ),
    },
    {
      header: 'Timber & Specs',
      accessor: 'wood_type',
      render: (row) => (
        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
          <div>{row.wood_type || row.material || 'Solid Wood'}</div>
          {(row.length || row.width || row.height) && (
            <DimensionsBadge length={row.length} width={row.width} height={row.height} />
          )}
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
          title="Toggle product status"
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
          <Link
            to={`/admin/products/${row.id}`}
            className="action-btn-sm"
            title="Manage Variants & Gallery Images"
          >
            <Layers size={15} />
          </Link>
          <button
            type="button"
            className="action-btn-sm"
            onClick={() => openEditModal(row)}
            title="Edit product"
          >
            <Edit3 size={15} />
          </button>
          <button
            type="button"
            className="action-btn-sm delete"
            onClick={() => setDeletingId(row.id)}
            title="Delete product"
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
        data={products}
        isLoading={isLoading}
        searchPlaceholder="Search furniture products..."
        searchKey="name"
        emptyMessage="No products found in catalog"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>Add Furniture Product</span>
          </button>
        }
      />

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Furniture Design'}
        size="lg"
      >
        <form onSubmit={handleSaveProduct}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
            <InputField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Royal Sheesham 6-Seater Dining Table"
              required
            />

            <SelectField
              label="Category"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="-- Select Category --"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <InputField
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="WoodCraft"
            />

            <InputField
              label="MRP (₹)"
              name="mrp"
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="45000"
            />

            <InputField
              label="Selling Price (₹)"
              name="selling_price"
              type="number"
              step="0.01"
              value={formData.selling_price}
              onChange={handleChange}
              placeholder="39999"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <InputField
              label="Primary Material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. Solid Wood / Cane"
            />

            <InputField
              label="Wood Type"
              name="wood_type"
              value={formData.wood_type}
              onChange={handleChange}
              placeholder="e.g. Sheesham / Teak / Oak"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            <InputField
              label="Length (in)"
              name="length"
              type="number"
              step="0.01"
              value={formData.length}
              onChange={handleChange}
              placeholder="72"
            />
            <InputField
              label="Width (in)"
              name="width"
              type="number"
              step="0.01"
              value={formData.width}
              onChange={handleChange}
              placeholder="36"
            />
            <InputField
              label="Height (in)"
              name="height"
              type="number"
              step="0.01"
              value={formData.height}
              onChange={handleChange}
              placeholder="30"
            />
            <InputField
              label="Weight (kg)"
              name="weight"
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={handleChange}
              placeholder="45"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <InputField
              label="Seating Capacity"
              name="seating_capacity"
              type="number"
              value={formData.seating_capacity}
              onChange={handleChange}
              placeholder="6"
            />

            <SelectField
              label="Assembly Required"
              name="assembly_required"
              value={formData.assembly_required}
              onChange={handleChange}
              options={[
                { value: 'NO', label: 'NO (Pre-assembled)' },
                { value: 'YES', label: 'YES (Carpenter Needed)' },
              ]}
            />

            <InputField
              label="Estimated Delivery Days"
              name="delivery_days"
              type="number"
              value={formData.delivery_days}
              onChange={handleChange}
              placeholder="7"
            />
          </div>

          <InputField
            label="Short Tagline Description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Six-seater solid seasoned Sheesham dining table..."
          />

          <TextAreaField
            label="Full Description & Craftsmanship Details"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed construction, finish, grain characteristics..."
          />

          <FileUploadField
            label="Main Product Showcase Image"
            onChange={setMainImageFile}
            currentPreviewUrl={editingProduct ? getImageUrl(editingProduct.main_image) : null}
            hint="Primary catalog image for this furniture design (PNG, JPG)"
            required={!editingProduct}
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
              {isSaving ? 'Saving Product...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Furniture Product"
        message="Are you sure you want to delete this product? All gallery images and variants will also be removed."
        confirmText="Delete Product"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminProductsPage;
