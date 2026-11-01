import React, { useState } from 'react';

const TextAreaInput = ({
  name,
  type,
  placeholder,
  label,
  register,
  error,
  validation,
  className = '',
  containerStyle = {},
  rows = 4,
  resize = 'none',
  ...props
}) => {


  return (
    <div className='input-box' style={containerStyle}>
      <div className="input-hero-white">
        <textarea
          // id={id}
          placeholder={placeholder}
          rows={rows}
          {...register(name, validation)}
          className={`${error ? "is-invalid" : ""} ${className}`}
          {...props}
          style={{ resize: resize }}
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

export default TextAreaInput;