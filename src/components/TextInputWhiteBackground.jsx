import React, { useState } from 'react';

const TextInputWhiteBackground = ({
  name,
  type,
  placeholder,
  label,
  register,
  error,
  validation,
  className = '',
  containerStyle = {},
  icon,
  changeIcon,
  changeType, // Add this prop to specify what type to change to (e.g., 'text' for password fields)
  ...props
}) => {
  const [isDefaultIcon, setIsDefaultIcon] = useState(true);
  const [isDefaultType, setIsDefaultType] = useState(type);

  const toggleIcon = () => {
    if (changeIcon && !props.disabled) {
      setIsDefaultIcon(!isDefaultIcon);

      // Toggle input type if changeType is provided
      if (changeType) {
        setIsDefaultType(isDefaultIcon ? changeType : type);
      }
    }
  };

  return (
    <div className='input-box' style={containerStyle}>
      <div className="input-hero-white">
        <input
          type={isDefaultType}
          placeholder={placeholder}
          {...register(name, validation)}
          className={`${error ? "is-invalid" : ""} ${className}`}
          {...props}
        />
        <span className="input-name">{label}</span>
        {icon && (
          <span
            className="input-icon"
            onClick={toggleIcon}
            role="img"
            aria-label="Toggle visibility"
            style={{ cursor: props.disabled ? 'not-allowed' : 'pointer' }}
          >
            {isDefaultIcon ? icon : changeIcon}
          </span>
        )}
      </div>
      {error && (
        <div className="invalid-feedback d-block pt-1">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default TextInputWhiteBackground;