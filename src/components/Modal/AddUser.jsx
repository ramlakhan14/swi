import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import { addDealerUser, UpdateDealerUser } from '../../services/dealerUserApi';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';
import { IconEyeClosed } from '../../assets/icons/iconEyeClosed';
import { IconEye } from '../../assets/icons/IconEye';
import SelectInput from '../SelectInput';
import { getAllDealerUserType } from '../../services/adminApi';


const AddUser = ({ isOpen, onClose, isRowData, fetchGetAllFiles, currentPage }) => {
    const [isUserType, setIsUserType] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        const fetch = () => {
            if (isRowData) {
                const { password, ...userData } = isRowData;
                reset({
                    ...isRowData
                });
            }
        }
        if (isRowData) fetch();
    }, [isRowData, isOpen, isUserType]);


    const closeModal = () => {
        onClose();
        reset({
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        });
    }

    const onSubmit = async (data) => {
        try {
            let response;
            const payload = {
                "first_name": data?.first_name,
                "last_name": data?.last_name,
                "email": data?.email,
                "sub_role_id": data?.sub_role_id
            }

            if (isRowData) {
                payload._method = "PUT"; // ✅ if backend needs PUT override
                response = await UpdateDealerUser(payload, isRowData.id); // ✅ update API call
            } else {
                payload.password = data?.password;
                response = await addDealerUser(payload); // ✅ create API call
            }
            showSuccessToast(response?.message);
            fetchGetAllFiles(currentPage);
            closeModal();
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to forget password");
            }
            showErrorToast(error?.response?.data?.message)
        }
    };


    const genderField = {
        name: "sub_role_id",
        label: "Dealer User Type",
        required: true,
        options: isUserType
    };

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const responseRole = await getAllDealerUserType();
                const roleData = responseRole?.data?.map((role) => ({
                    value: role?.id,
                    label: role?.role_name
                }));
                setIsUserType(roleData);
            } catch (error) {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            }
        }
        if (isOpen) {
            fetchRole();
        }
    }, [isOpen]);


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
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">{isRowData ? "Edit" : "Add"} Users</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={closeModal}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div>

                                <TextInputWhiteBackground
                                    name="first_name"
                                    type="text"
                                    placeholder="Enter your first name here"
                                    label="First Name"
                                    register={register}
                                    error={errors.first_name}
                                    validation={{
                                        required: 'First Name is required',
                                        minLength: {
                                            value: 3,
                                            message: 'First Name must be at least 3 characters long'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'First Name cannot be more than 100 characters'
                                        }
                                    }}

                                    containerStyle={{ paddingBottom: "20px" }}
                                />

                                <TextInputWhiteBackground
                                    name="last_name"
                                    type="text"
                                    placeholder="Enter your last name here"
                                    label="Last Name"
                                    register={register}
                                    error={errors.last_name}
                                    validation={{
                                        required: 'Last Name is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Last Name must be at least 3 characters long'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Last Name cannot be more than 100 characters'
                                        }
                                    }}

                                    containerStyle={{ paddingBottom: "20px" }}
                                />


                                <TextInputWhiteBackground
                                    name="email"
                                    type="text"
                                    placeholder="Enter your email address / user here"
                                    label="Email Address / User"
                                    register={register}
                                    error={errors.email}
                                    validation={{
                                        required: 'Email Address / User is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Email Address / User must be at least 6 characters long',
                                        },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "20px" }}
                                />

                                <TextInputWhiteBackground
                                    name="password"
                                    type="password"
                                    placeholder={isRowData ? "Leave empty to keep current password" : "Enter your password here"}
                                    label="Password"
                                    register={register}
                                    error={errors.password}
                                    validation={
                                        isRowData ? {} : {
                                            required: 'Password is required',
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                                                message:
                                                    'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long'
                                            }
                                        }
                                    }

                                    containerStyle={{ paddingBottom: "20px" }}
                                    icon={<IconEyeClosed />}
                                    changeIcon={<IconEye />}
                                    changeType="text"
                                    disabled={isRowData ? true : false}
                                />

                                <SelectInput
                                    field={genderField}
                                    register={register}
                                    error={errors.sub_role_id}
                                    className="form-select-input" // optional
                                    containerStyle={{ marginBottom: "20px" }} // optional
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
                                                {isRowData ? 'Updating...' : 'Saving...'}
                                            </>
                                        ) : (
                                            isRowData ? 'Update' : 'Save'
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

export default AddUser;