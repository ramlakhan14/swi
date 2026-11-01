import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import { IconEye } from '../../assets/icons/IconEye';
import { IconEyeClosed } from '../../assets/icons/iconEyeClosed';
import { changePasswordWithAdmin } from '../../services/adminApi';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';


const ChangePassword = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm({
        mode: 'onChange'
    });

    const newPassword = watch('new_password');

    const closeModal = () => {
        onClose();
        reset();
    }


    const onSubmit = async (data) => {
        try {
            const response = await changePasswordWithAdmin(data);
            showSuccessToast(response?.message);
            closeModal();
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to forget password");
            }
            showErrorToast(error?.response?.data?.message)
        }
    };



    if (!isOpen) return null;


    return (
        <div className="modal show d-block modal-md" tabIndex={-1} role="dialog">
            <div
                className="modal-dialog"
                tabIndex="-1"
                role="dialog"
                style={{ paddingRight: '17px' }}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">Change Password</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={closeModal}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div>
                                <TextInputWhiteBackground
                                    name="current_password"
                                    type="password"
                                    placeholder="Enter your old password here"
                                    label="Old Password"
                                    register={register}
                                    error={errors.current_password}
                                    validation={{
                                        required: 'Old password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Old password must be at least 8 characters long'
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: 'Old password cannot be more than 20 characters'
                                        }
                                    }}

                                    containerStyle={{ paddingBottom: "20px" }}
                                    icon={<IconEye />}
                                    changeIcon={<IconEyeClosed />}
                                    changeType="text"
                                />

                                <TextInputWhiteBackground
                                    name="new_password"
                                    type="password"
                                    placeholder="Enter your new password here"
                                    label="New Password"
                                    register={register}
                                    error={errors.new_password}
                                    validation={{
                                        required: 'New password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'New password must be at least 8 characters long'
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: 'New password cannot be more than 20 characters'
                                        },
                                        validate: {
                                            hasUpperCase: (value) =>
                                                /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                                            hasLowerCase: (value) =>
                                                /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                                            hasSpecialChar: (value) =>
                                                /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character'
                                        }
                                    }}

                                    containerStyle={{ paddingBottom: "20px" }}
                                    icon={<IconEye />}
                                    changeIcon={<IconEyeClosed />}
                                    changeType="text"
                                />

                                <TextInputWhiteBackground
                                    name="new_password_confirmation"
                                    type="password"
                                    placeholder="Enter your new confirm new password here"
                                    label="Confirm New Password"
                                    register={register}
                                    error={errors.new_password_confirmation}
                                    validation={{
                                        required: 'Confirm password is required',
                                        maxLength: {
                                            value: 20,
                                            message: 'Confirm password cannot be more than 20 characters'
                                        },
                                        validate: (value) =>
                                            value === newPassword || 'Passwords do not match'
                                    }}

                                    containerStyle={{ paddingBottom: "32px" }}
                                    icon={<IconEye />}
                                    changeIcon={<IconEyeClosed />}
                                    changeType="text"
                                />

                                <div className='d-flex justify-content-end'>
                                    <button
                                        type="button"
                                        className="btn btn-dark black-btn-hover-white"
                                        onClick={closeModal}
                                        style={{ fontSize: "12px", fontWeight: "700" }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success green-btn"
                                        disabled={isSubmitting}
                                        style={{ padding: "8px 16px", marginLeft: "12px", fontSize: "12px", fontWeight: "700" }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating Password...
                                            </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ChangePassword;