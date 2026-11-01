import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../../TextInputWhiteBackground';
import MyEditor from "../../MyEditor"
import { createAlert } from '../../../services/alertApi';
import { showSuccessToast } from '../../../utils/ToastUtils';

const AddAlert = ({ isOpen, onClose, isAlertData, fetchGetAllFiles, currentPage }) => {
    const [isAalertMessageData, setIsAalertMessageData] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        const feactch = () => {
            reset(isAlertData);
            setIsAalertMessageData(isAlertData?.alert_message)
        }
        if (isAlertData) {
            feactch();
        }
    }, [isAlertData]);


    const handleClose = () => {
        reset({
            alert_name: ""
        });
        setIsAalertMessageData(null);
        onClose();
    };



    const onSubmit = async (data) => {
        const payload = {
            alert_name: data?.alert_name,
            alert_message: isAalertMessageData
        }
        try {
            if (isAlertData) {
                payload._method = "PUT";
            }
            const response = await createAlert(payload, isAlertData?.id);
            showSuccessToast(response?.message);
            fetchGetAllFiles(currentPage);
            handleClose();
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "An error occurred");
            }
            showErrorToast(error?.response?.data?.messages || "An error occurred");

        }
    };



    if (!isOpen) return null;

    return (
        <div className="modal show d-block modal-lg" tabIndex={-1} role="dialog">
            <div
                className="modal-dialog"
                tabIndex="-1"
                role="dialog"
                style={{ paddingRight: '17px' }}
            >
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">{isAlertData ? "Edit" : "Add"} Alert</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={handleClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div>
                                <TextInputWhiteBackground
                                    name="alert_name"
                                    type="text"
                                    placeholder="Enter your alert name here"
                                    label="Title"
                                    register={register}
                                    error={errors.alert_name}
                                    validation={{
                                        required: 'Title is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Title must be at least 3 characters long'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Title cannot be more than 100 characters'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "20px" }}
                                />
                                <div style={{ paddingBottom: "20px" }}>
                                    <p className='modal-headding-text mb-2' style={{ fontSize: "12px", color: "#18181B", textTransform: "uppercase" }}>Alert Message</p>
                                    <MyEditor value={isAalertMessageData} onChange={setIsAalertMessageData} />
                                </div>


                                <div className='d-flex justify-content-end'>
                                    <button
                                        type="button"
                                        className="btn btn-dark black-btn-hover-white"
                                        onClick={handleClose}
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
                                                {isAlertData ? 'Updating...' : 'Saving...'}
                                            </>
                                        ) : (
                                            isAlertData ? 'Update' : 'Save'
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

export default AddAlert;