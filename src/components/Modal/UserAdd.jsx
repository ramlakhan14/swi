import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import SelectInput from '../SelectInput';
import { addUserModel, getAllRole } from '../../services/userApi';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';
import { useNavigate } from 'react-router-dom';


const UserAdd = ({ isOpen, onClose }) => {
    const [isRoleData, setIsRoleData] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        mode: 'onChange'
    });

    const roleId = watch('role_id');

    const closeModal = () => {
        onClose();
        reset();
    }

    const onSubmit = async (data) => {
        try {
            const response = await addUserModel(data);
            showSuccessToast(response?.message);
            closeModal();
            navigate(`/individual-user/${response?.data?.id}`);
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0]);
            } else {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            }
        }
    };


    const genderField = {
        name: "role_id",
        label: "Role",
        required: true,
        options: isRoleData
    };


    useEffect(() => {
        const fetchRole = async () => {
            try {
                const responseRole = await getAllRole();
                const roleData = responseRole?.data?.map((role) => ({
                    value: role?.id,
                    label: role?.role_name
                }));
                setIsRoleData(roleData);
            } catch (error) {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            }
        }
        if (isOpen) {
            fetchRole();
        }
    }, [isOpen])


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
                        <h5 className="modal-title modal-headding mb-0">Add User</h5>
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

                                <SelectInput
                                    field={genderField}
                                    register={register}
                                    error={errors.gender}
                                    className="form-select-input" // optional
                                    containerStyle={{ marginBottom: "20px" }} // optional
                                />
                                <TextInputWhiteBackground
                                    name="dealer_id"
                                    type="text"
                                    placeholder="Enter your dealer id here"
                                    label="Dealer ID"
                                    register={register}
                                    error={errors.dealer_id}
                                    validation={{
                                        required: Number(roleId) === 1 ? false : "Dealer ID is required",
                                        pattern: {
                                            value: /^[0-9]+$/,   // ⬅ only numbers
                                            message: "Only numbers are allowed"
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "20px" }}
                                />

                                <TextInputWhiteBackground
                                    name="company_name"
                                    type="text"
                                    placeholder="Enter your company name here"
                                    label="Company Name"
                                    register={register}
                                    error={errors.company_name}
                                    validation={{
                                        required: 'Company Name is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Company Name must be at least 6 characters long'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "20px" }}
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
                                                Adding User...
                                            </>
                                        ) : (
                                            'Add User'
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

export default UserAdd;