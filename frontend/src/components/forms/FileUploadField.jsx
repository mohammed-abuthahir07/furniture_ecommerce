import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export function FileUploadField({
  label,
  name,
  onChange,
  accept = 'image/*',
  required = false,
  error,
  hint,
  currentPreviewUrl,
}) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentPreviewUrl || null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  };

  const handleClear = () => {
    setFileName('');
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null);
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <div
        style={{
          border: '2px dashed var(--neutral-300)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          textAlign: 'center',
          backgroundColor: '#faf9f7',
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast)',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {preview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: '140px',
                maxWidth: '100%',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'cover',
                margin: '0 auto',
                border: '1px solid var(--neutral-200)',
              }}
            />
            <button
              type="button"
              className="modal-close-btn"
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'var(--danger-500)',
                color: '#fff',
                width: 24,
                height: 24,
                boxShadow: 'var(--shadow-sm)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
            <div style={{ fontSize: '0.78rem', color: 'var(--neutral-600)', marginTop: 4 }}>
              {fileName || 'Selected Image'} (Click to replace)
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Upload size={20} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--neutral-800)' }}>
              Click or drag image to upload
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--neutral-500)' }}>
              PNG, JPG, WEBP up to 5MB
            </div>
          </div>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  );
}

export default FileUploadField;
