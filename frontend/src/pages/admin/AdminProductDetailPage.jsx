import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Image as ImageIcon,
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Boxes,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import FileUploadField from '../../components/forms/FileUploadField';
import { PageLoader } from '../../components/common/Loader';
import { ErrorState } from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export function AdminProductDetailPage() {
  const { id } = useParams();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variant Modal
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [variantName, setVariantName] = useState('');
  const [variantColor, setVariantColor] = useState('');
  const [variantStock, setVariantStock] = useState('10');
  const [variantStatus, setVariantStatus] = useState('ACTIVE');
  const [isSavingVariant, setIsSavingVariant] = useState(false);

  // Gallery Image Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [sortOrder, setSortOrder] = useState('1');
  const [galleryFile, setGalleryFile] = useState(null);
  const [isSavingImage, setIsSavingImage] = useState(false);

  // Delete Dialog
  const [deleteAction, setDeleteAction] = useState(null); // { type: 'variant' | 'image' | 'variantImage', id }
  const [isDeleting, setIsDeleting] = useState(false);

  const [imageVariant, setImageVariant] = useState(null);
  const [variantImages, setVariantImages] = useState([]);
  const [variantImagesLoading, setVariantImagesLoading] = useState(false);
  const [variantImagesError, setVariantImagesError] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isUploadingVariantImages, setIsUploadingVariantImages] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const fetchProductData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodRes, varRes, imgRes] = await Promise.all([
        adminApi.getProductById(id),
        adminApi.getVariantsByProductId(id),
        adminApi.getImagesByProductId(id),
      ]);

      const product = prodRes.product || prodRes.data;
      if (prodRes.success && product) {
        setProduct(product);
      }
      const variantList = varRes.variants || varRes.data;
      if (varRes.success && Array.isArray(variantList)) {
        setVariants(variantList);
      }
      const imageList = imgRes.images || imgRes.data;
      if (imgRes.success && Array.isArray(imageList)) {
        setImages(imageList);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product management data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  // Variant Actions
  const openCreateVariantModal = () => {
    setEditingVariant(null);
    setVariantName('');
    setVariantColor('');
    setVariantStock('10');
    setVariantStatus('ACTIVE');
    setIsVariantModalOpen(true);
  };

  const openEditVariantModal = (v) => {
    setEditingVariant(v);
    setVariantName(v.variant_name || '');
    setVariantColor(v.color || '');
    setVariantStock(String(v.stock_quantity || 0));
    setVariantStatus(v.status || 'ACTIVE');
    setIsVariantModalOpen(true);
  };

  const handleSaveVariant = async (e) => {
    e.preventDefault();
    if (!variantName.trim()) {
      toastError('Variant finish name is required.');
      return;
    }

    try {
      setIsSavingVariant(true);
      if (editingVariant) {
        const res = await adminApi.updateVariant(editingVariant.id, {
          variant_name: variantName.trim(),
          color: variantColor.trim(),
          stock_quantity: Number(variantStock),
          status: variantStatus,
        });
        if (res.success) {
          success('Variant updated successfully.');
          setIsVariantModalOpen(false);
          fetchProductData();
        }
      } else {
        const res = await adminApi.createVariant({
          product_id: Number(id),
          variant_name: variantName.trim(),
          color: variantColor.trim(),
          stock_quantity: Number(variantStock),
          status: variantStatus,
        });
        if (res.success) {
          success('Variant created successfully.');
          setIsVariantModalOpen(false);
          fetchProductData();
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to save variant.');
    } finally {
      setIsSavingVariant(false);
    }
  };

  const handleToggleVariantStatus = async (v) => {
    const nextStatus = v.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await adminApi.changeVariantStatus(v.id, nextStatus);
      if (res.success) {
        success(`Variant status updated to ${nextStatus}.`);
        fetchProductData();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update variant status.');
    }
  };

  const loadVariantImages = async (variantId) => {
    setVariantImagesLoading(true);
    setVariantImagesError('');
    try {
      const res = await adminApi.getVariantImages(variantId);
      setVariantImages(Array.isArray(res.images) ? res.images : []);
    } catch (err) {
      setVariantImagesError(err.message || 'Unable to load finish photos.');
    } finally {
      setVariantImagesLoading(false);
    }
  };

  const openVariantGallery = (variant) => {
    setImageVariant(variant);
    setPendingFiles([]);
    setVariantImages([]);
    loadVariantImages(variant.id);
  };

  const closeVariantGallery = () => {
    pendingFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setPendingFiles([]);
    setImageVariant(null);
    setVariantImagesError('');
  };

  const handlePendingFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (selected.length === 0) return;
    const next = selected.slice(0, 8).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setPendingFiles((current) => {
      current.forEach((item) => URL.revokeObjectURL(item.preview));
      return next;
    });
  };

  const handleUploadVariantImages = async () => {
    if (!imageVariant || pendingFiles.length === 0) {
      toastError('Choose at least one photo for this finish.');
      return;
    }
    try {
      setIsUploadingVariantImages(true);
      const payload = new FormData();
      payload.append('variant_id', imageVariant.id);
      pendingFiles.forEach((item) => payload.append('images', item.file));
      const res = await adminApi.addVariantImages(payload);
      if (res.success) {
        success('Finish photos uploaded.');
        pendingFiles.forEach((item) => URL.revokeObjectURL(item.preview));
        setPendingFiles([]);
        setVariantImages(Array.isArray(res.images) ? res.images : []);
        fetchProductData();
      }
    } catch (err) {
      toastError(err.message || 'Unable to upload these photos.');
    } finally {
      setIsUploadingVariantImages(false);
    }
  };

  const moveVariantImage = async (index, direction) => {
    const target = index + direction;
    if (!imageVariant || target < 0 || target >= variantImages.length || isReordering) return;
    const next = [...variantImages];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    try {
      setIsReordering(true);
      const res = await adminApi.reorderVariantImages(imageVariant.id, next.map((image) => image.id));
      if (res.success) {
        setVariantImages(Array.isArray(res.images) ? res.images : next);
      }
    } catch (err) {
      toastError(err.message || 'Unable to reorder these photos.');
    } finally {
      setIsReordering(false);
    }
  };

  // Gallery Image Actions
  const openAddImageModal = () => {
    setEditingImage(null);
    setImageTitle('');
    setSortOrder(String(images.length + 1));
    setGalleryFile(null);
    setIsImageModalOpen(true);
  };

  const openEditImageModal = (img) => {
    setEditingImage(img);
    setImageTitle(img.image_title || '');
    setSortOrder(String(img.sort_order || 1));
    setGalleryFile(null);
    setIsImageModalOpen(true);
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();

    try {
      setIsSavingImage(true);
      if (editingImage) {
        const res = await adminApi.updateImage(editingImage.id, {
          image_title: imageTitle.trim(),
          sort_order: Number(sortOrder),
        });
        if (res.success) {
          success('Gallery image updated successfully.');
          setIsImageModalOpen(false);
          fetchProductData();
        }
      } else {
        if (!galleryFile) {
          toastError('Please select an image file to upload.');
          return;
        }
        const payload = new FormData();
        payload.append('product_id', id);
        payload.append('image', galleryFile);
        payload.append('image_title', imageTitle.trim());
        payload.append('sort_order', Number(sortOrder));

        const res = await adminApi.addImage(payload);
        if (res.success) {
          success('Gallery image uploaded successfully.');
          setIsImageModalOpen(false);
          fetchProductData();
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to save gallery image.');
    } finally {
      setIsSavingImage(false);
    }
  };

  // Delete Confirmation Handler
  const handleDeleteConfirm = async () => {
    if (!deleteAction) return;

    try {
      setIsDeleting(true);
      if (deleteAction.type === 'variant') {
        const res = await adminApi.deleteVariant(deleteAction.id);
        if (res.success) {
          success('Variant deleted successfully.');
          setDeleteAction(null);
          fetchProductData();
        }
      } else if (deleteAction.type === 'image') {
        const res = await adminApi.deleteImage(deleteAction.id);
        if (res.success) {
          success('Gallery image deleted successfully.');
          setDeleteAction(null);
          fetchProductData();
        }
      } else if (deleteAction.type === 'variantImage') {
        const res = await adminApi.deleteVariantImage(deleteAction.id);
        if (res.success) {
          success('Finish photo deleted.');
          setDeleteAction(null);
          if (imageVariant) {
            await loadVariantImages(imageVariant.id);
          }
          fetchProductData();
        }
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete item.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading product details and variant inventory..." />;
  }

  if (error || !product) {
    return <ErrorState message={error || 'Product not found.'} onRetry={fetchProductData} />;
  }

  return (
    <div>
      {/* Header & Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/admin/products"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>{product.name}</h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Category: {product.category_name} • Base Price: {formatCurrency(product.selling_price)}
            </div>
          </div>
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* Grid: Variants Management & Gallery Images */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Section 1: Product Variants & Inventory */}
        <div className="admin-table-card">
          <div className="admin-table-toolbar">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Boxes size={18} color="var(--primary-600)" />
              <span>Product Variants ({variants.length})</span>
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={openCreateVariantModal}
            >
              <Plus size={14} />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Variant Name</th>
                  <th>Color</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No variants added. Customers will not be able to purchase until a variant with stock is created.
                    </td>
                  </tr>
                ) : (
                  variants.map((v) => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        {v.variant_name}
                        <div style={{ fontWeight: 500, fontSize: '0.72rem', color: '#64748b' }}>
                          {Number(v.image_count) > 0 ? `${v.image_count} finish photos` : 'No finish photos'}
                        </div>
                      </td>
                      <td>{v.color || 'Standard'}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: v.stock_quantity <= 0 ? 'var(--danger-500)' : v.stock_quantity <= 5 ? 'var(--warning-500)' : 'var(--success-500)',
                          }}
                        >
                          {v.stock_quantity} units
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleVariantStatus(v)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          title="Toggle variant status"
                        >
                          <StatusBadge status={v.status} />
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="action-btn-sm"
                            onClick={() => openVariantGallery(v)}
                            title="Manage finish photos"
                          >
                            <ImageIcon size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-btn-sm"
                            onClick={() => openEditVariantModal(v)}
                            title="Edit variant & stock"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-btn-sm delete"
                            onClick={() => setDeleteAction({ type: 'variant', id: v.id })}
                            title="Delete variant"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Product Gallery Images */}
        <div className="admin-table-card">
          <div className="admin-table-toolbar">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ImageIcon size={18} color="var(--primary-600)" />
              <span>Product Gallery ({images.length})</span>
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={openAddImageModal}
            >
              <Upload size={14} />
              <span>Upload Angle</span>
            </button>
          </div>

          <p style={{ margin: '0 1.25rem', fontSize: '0.75rem', color: '#64748b' }}>
            Shared product photos. Each finish keeps its own photos, managed from the variant row.
          </p>
          <div style={{ padding: '1.25rem' }}>
            {images.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
                <ImageIcon size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.85rem' }}>
                  No extra gallery angles uploaded. Add side view, lifestyle, and timber close-ups.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                {images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      position: 'relative',
                      background: '#ffffff',
                    }}
                  >
                    <img
                      src={getImageUrl(img.image)}
                      alt={img.image_title || 'Gallery Angle'}
                      style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                    <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {img.image_title || 'Angle View'}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Order: #{img.sort_order || 1}</div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 4,
                        padding: '0.25rem 0.5rem',
                        borderTop: '1px solid #f1f5f9',
                        background: '#f8fafc',
                      }}
                    >
                      <button
                        type="button"
                        className="action-btn-sm"
                        style={{ width: 22, height: 22 }}
                        onClick={() => openEditImageModal(img)}
                        title="Edit title & sort order"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        type="button"
                        className="action-btn-sm delete"
                        style={{ width: 22, height: 22 }}
                        onClick={() => setDeleteAction({ type: 'image', id: img.id })}
                        title="Delete image"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Modal */}
      <Modal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        title={editingVariant ? `Edit Variant: ${editingVariant.variant_name}` : 'Add Furniture Variant'}
      >
        <form onSubmit={handleSaveVariant}>
          <InputField
            label="Variant Name"
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            placeholder="e.g. Natural Teak Polish / Dark Walnut"
            required
          />

          <InputField
            label="Color / Finish Description"
            value={variantColor}
            onChange={(e) => setVariantColor(e.target.value)}
            placeholder="e.g. Honey Oak / Espresso / Natural Grain"
          />

          <InputField
            label="Stock Quantity"
            type="number"
            value={variantStock}
            onChange={(e) => setVariantStock(e.target.value)}
            placeholder="10"
            required
          />

          <SelectField
            label="Status"
            value={variantStatus}
            onChange={(e) => setVariantStatus(e.target.value)}
            options={[
              { value: 'ACTIVE', label: 'ACTIVE' },
              { value: 'INACTIVE', label: 'INACTIVE' },
            ]}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsVariantModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSavingVariant}
            >
              {isSavingVariant ? 'Saving...' : editingVariant ? 'Update Variant' : 'Create Variant'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Gallery Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={editingImage ? 'Edit Gallery Image Metadata' : 'Upload Gallery Image'}
      >
        <form onSubmit={handleSaveImage}>
          <InputField
            label="Image Title / View Angle"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
            placeholder="e.g. Side Profile / Detail Timber Grain / Room Setting"
          />

          <InputField
            label="Display Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="1"
          />

          {!editingImage && (
            <FileUploadField
              label="Gallery Image File"
              onChange={setGalleryFile}
              required
              hint="High resolution photo (PNG, JPG)"
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsImageModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSavingImage}
            >
              {isSavingImage ? 'Saving...' : editingImage ? 'Update Metadata' : 'Upload Photo'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!imageVariant}
        onClose={closeVariantGallery}
        title={imageVariant ? `Photos · ${imageVariant.variant_name}` : 'Finish photos'}
        size="lg"
      >
        {imageVariant && (
          <div>
            <p style={{ marginTop: 0, color: '#64748b', fontSize: '0.85rem' }}>
              {imageVariant.color || 'Standard finish'}. These photos show only when a customer selects this finish.
            </p>

            <label className="form-label" htmlFor="variant-image-files">Add photos</label>
            <input
              id="variant-image-files"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePendingFiles}
            />
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              JPG, PNG, or WEBP. Up to 8 photos at a time, 5MB each, 12 per finish.
            </p>

            {pendingFiles.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
                {pendingFiles.map((item) => (
                  <img
                    key={item.preview}
                    src={item.preview}
                    alt={item.name}
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleUploadVariantImages}
              disabled={isUploadingVariantImages || pendingFiles.length === 0}
            >
              {isUploadingVariantImages ? 'Uploading...' : 'Upload photos'}
            </button>

            <div style={{ marginTop: '1.25rem' }}>
              {variantImagesLoading && <p>Loading finish photos...</p>}
              {variantImagesError && (
                <div>
                  <p style={{ color: 'var(--danger-500)' }}>{variantImagesError}</p>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => loadVariantImages(imageVariant.id)}>
                    Try again
                  </button>
                </div>
              )}
              {!variantImagesLoading && !variantImagesError && variantImages.length === 0 && (
                <p style={{ color: '#64748b' }}>No photos for this finish yet. The store will show the general product photos until you upload some.</p>
              )}
              {!variantImagesLoading && variantImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {variantImages.map((img, index) => (
                    <div key={img.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
                      <img
                        src={getImageUrl(img.image)}
                        alt={img.image_title || imageVariant.variant_name}
                        style={{ width: '100%', height: 100, objectFit: 'cover' }}
                        onError={handleImageError}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem' }}>
                        <button type="button" className="action-btn-sm" disabled={index === 0 || isReordering} onClick={() => moveVariantImage(index, -1)} title="Move earlier">
                          <ChevronLeft size={14} />
                        </button>
                        <button type="button" className="action-btn-sm" disabled={index === variantImages.length - 1 || isReordering} onClick={() => moveVariantImage(index, 1)} title="Move later">
                          <ChevronRight size={14} />
                        </button>
                        <button
                          type="button"
                          className="action-btn-sm delete"
                          onClick={() => setDeleteAction({ type: 'variantImage', id: img.id })}
                          title="Delete photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteAction}
        onClose={() => setDeleteAction(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteAction?.type === 'variant' ? 'Delete Variant' : 'Delete Gallery Image'}
        message="Are you sure you want to delete this record? This action is permanent."
        confirmText="Yes, Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AdminProductDetailPage;
