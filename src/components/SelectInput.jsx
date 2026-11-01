import React from 'react';

const SelectInput = ({
  field,
  register,
  error,
  className = '',
  containerStyle = {},
  ...props
}) => {
  const validationRules = {
    required: field?.required ? `${field.label} is required` : false,
    ...field?.validation
  };

  return (
    <div className="input-box" style={containerStyle}>
      <div className="input-hero-white">
        <select
          {...register(field.name, validationRules)}
          className={`${error ? 'is-invalid' : ''} ${className}`}
          {...props}
        >
          {/* Placeholder Option */}
          <option value="">Select {field.label}</option>

          {/* Dynamic Options */}
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Floating Label */}
        <span className="input-name">{field.label}</span>
      </div>

      {/* Validation Error */}
      {error && (
        <div className="invalid-feedback d-block pt-1">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default SelectInput;
