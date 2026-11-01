import React from 'react';

const TextInputBlackBackground = ({ 
  name,
  type = 'text',
  placeholder,
  label,
  register,
  error,
  validation,
  className = '',
  containerStyle = {},
  ...props 
}) => {
  return (
    <div className='input-box' style={containerStyle}>
      <div className="input-hero">
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
          className={`${error ? "is-invalid" : ""} ${className}`}
          {...props}
        />
        <span className="input-name">{label}</span>
      </div>
      {error && (
        <div className="invalid-feedback d-block pt-1">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default TextInputBlackBackground;