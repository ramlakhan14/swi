const RadioInput = ({ field, register, error }) => {
  const validationRules = {
    required: field.required ? `${field.label} is required` : false,
    ...field.validation
  };

  return (
    <div className="mb-3">
      <label className="form-label">
        {field.label}
        {field.required && <span className="text-danger ms-1">*</span>}
      </label>
      <div>
        {field.options.map(option => (
          <div key={option.value} className="form-check">
            <input
              type="radio"
              value={option.value}
              {...register(field.name, validationRules)}
              className={`form-check-input ${error ? 'is-invalid' : ''}`}
              id={`${field.name}-${option.value}`}
            />
            <label className="form-check-label" htmlFor={`${field.name}-${option.value}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <div className="invalid-feedback d-block">
          <i className="bi bi-exclamation-circle me-1"></i>
          {error.message}
        </div>
      )}
    </div>
  );
};

export default RadioInput;