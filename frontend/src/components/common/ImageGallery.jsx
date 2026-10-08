import { useRef, useState } from 'react';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import { Modal } from './Modal';
import { ZoomIn } from 'lucide-react';

export function ImageGallery({ mainImage, galleryImages = [], productName = 'Product' }) {
  // Combine main image + gallery images
  const allImages = [];
  if (mainImage) {
    allImages.push({
      id: 'main',
      image: mainImage,
      image_title: 'Main View',
    });
  }

  if (Array.isArray(galleryImages)) {
    galleryImages.forEach((img) => {
      if (img && img.image) {
        allImages.push(img);
      }
    });
  }

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const touchStartX = useRef(null);
  const didSwipe = useRef(false);

  const activeImage = allImages[selectedIndex] || { image: mainImage };

  const showPrevious = () => setSelectedIndex((index) => Math.max(0, index - 1));
  const showNext = () => setSelectedIndex((index) => Math.min(allImages.length - 1, index + 1));

  return (
    <div className="gallery-container">
      <div
        className="gallery-main-display"
        onClick={() => {
          if (didSwipe.current) {
            didSwipe.current = false;
            return;
          }
          setIsZoomOpen(true);
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) {
            didSwipe.current = true;
            if (delta < 0) showNext();
            else showPrevious();
          }
          touchStartX.current = null;
        }}
        title="View a larger furniture image"
      >
        <img
          src={getImageUrl(activeImage.image)}
          alt={activeImage.image_title || productName}
          className="gallery-main-image"
          onError={handleImageError}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <ZoomIn size={14} />
          <span>Zoom</span>
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="gallery-thumbnails">
          {allImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              className={`gallery-thumb-btn ${selectedIndex === idx ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={getImageUrl(img.image)}
                alt={img.image_title || `Thumbnail ${idx + 1}`}
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={productName}
        size="lg"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <img
            src={getImageUrl(activeImage.image)}
            alt={activeImage.image_title || productName}
            style={{ maxHeight: '70vh', width: 'auto', margin: '0 auto', objectFit: 'contain' }}
            onError={handleImageError}
          />
          {activeImage.image_title && (
            <p style={{ marginTop: '0.75rem', color: 'var(--neutral-600)', fontStyle: 'italic' }}>
              {activeImage.image_title}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ImageGallery;
