export function TextAreaField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
  hint,
  disabled = false,
}) {
  const areaId = id || name;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={areaId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      <textarea
        id={areaId}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-textarea ${error ? 'error' : ''}`}
      />

      {error && <div className="form-error">{error}</div>}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  );
}

export default TextAreaField;
