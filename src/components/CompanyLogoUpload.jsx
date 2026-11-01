import React, { useEffect, useState } from 'react';
import { IcImageUpload } from '../assets/icons/icImageUpload';
import { IcClose } from '../assets/icons/IcClose';

const CompanyLogoUpload = ({
    name,
    label,
    register,
    error,
    validation,
    className = '',
    containerStyle = {},
    accept = "image/*",
    onChange,
    existingFile = null,
    ...props
}) => {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected');
        }

        // Call the onChange from react-hook-form if register was used
        if (register) {
            const registered = register(name, validation);
            if (registered.onChange) {
                registered.onChange(e);
            }
        }

        // Call custom onChange if provided
        if (onChange) {
            onChange(e);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const input = document.getElementById(name);
            input.files = dataTransfer.files;

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            if (onChange) {
                const event = { target: input };
                onChange(event);
            }
        }
    };

    const handleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
        const input = document.getElementById(name);
        input.value = '';
    };

    useEffect(() => {
        // 👇 set existing file as preview when component loads
        if (existingFile?.url) {
            setPreview(existingFile.url);
        }
    }, [existingFile]);
    return (
        <div className='input-box' style={containerStyle}>
            <div
                className={`logo-upload-container ${isDragging ? 'dragging' : ''} ${error ? 'is-invalid' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    id={name}
                    type="file"
                    accept={accept}
                    {...(register ? register(name, validation) : {})}
                    onChange={handleFileChange}
                    className={`d-none ${className}`}
                    {...props}
                />

                <label htmlFor={name} className={`${preview ? "logo-upload-show-label" : "logo-upload-label"}`}>
                    {preview ? (
                        <div className="preview-container">
                            <img src={preview} alt="Preview" className="preview-image" />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="btn  preview-remove"
                                aria-label="Remove"
                            >
                                <IcClose fill='#fff' width={"20"} height={"20"} />
                            </button>
                        </div>
                    ) : (
                        <div className="upload-placeholder">
                            <div className="placeholder-icon">
                                <IcImageUpload />
                            </div>
                            <div className="placeholder-text">COMPANY LOGO</div>
                        </div>
                    )}
                </label>
            </div>

            {error && (
                <div className="invalid-feedback d-block">
                    {error.message}
                </div>
            )}

        </div>
    );
};

export default CompanyLogoUpload;