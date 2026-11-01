import React, { useState, useImperativeHandle, forwardRef } from 'react';

const FileInputWhiteBackground = forwardRef(({
  name,
  label,
  register,
  error,
  validation,
  className = '',
  containerStyle = {},
  accept,
  multiple = false,
  onChange,
  textData = "No file chosen",
  ...props
}, ref) => {
  const [fileName, setFileName] = useState(textData);

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    resetFileName: () => {
      setFileName("No file chosen");
    }
  }));

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        setFileName(`${files.length} file(s) selected`);
      } else {
        setFileName(files[0].name);
      }
    } else {
      setFileName('No file chosen');
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className='input-box' style={containerStyle}>
      <div className="file-input-wrapper">
        <label htmlFor={name} className="file-input-button">
          Choose File
        </label>
        <span className="file-input-text">{fileName}</span>
        <input
          id={name}
          type="file"
          accept={accept}
          multiple={multiple}
          {...register(name, {
            ...validation,
            onChange: handleFileChange
          })}
          className={`file-input-hidden ${error ? "is-invalid" : ""} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <div className="invalid-feedback d-block pt-1">
          {error.message}
        </div>
      )}
    </div>
  );
});

export default FileInputWhiteBackground;