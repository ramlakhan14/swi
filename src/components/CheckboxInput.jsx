const CheckboxInput = ({ field, register, error }) => {
  const validationRules = {
    required: field.required ? `${field.label} is required` : false,
    ...field.validation
  };

  return (
    <div className="mb-3">
      <div className="form-check">
        <input
          type="checkbox"
          {...register(field.name, validationRules)}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
          id={field.name}
        />
        <label className="form-check-label" htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-danger ms-1">*</span>}
        </label>
        {error && (
          <div className="invalid-feedback d-block">
            <i className="bi bi-exclamation-circle me-1"></i>
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxInput;