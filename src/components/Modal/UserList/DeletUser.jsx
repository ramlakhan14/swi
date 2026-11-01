import { useState } from "react";
import { deleteUser } from "../../../services/userApi";
import { showSuccessToast } from "../../../utils/ToastUtils";
import { useNavigate } from "react-router-dom";

const DeletUser = ({ isOpen, onClose, data }) => {
    const navigate = useNavigate();
    const [isDeleteRow, setIsDeleteRow] = useState(false);
    if (!isOpen) return null;

    const userDelete = async () => {
        try {
            setIsDeleteRow(true);
            const response = await deleteUser(data);
            showSuccessToast(response?.message);
            navigate('/user');
            onClose();
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred while deleting the user data.")
        }finally{
            setIsDeleteRow(false);
        }
    }
    return (
        <div className="modal show d-block modal-md" tabIndex={-1} role="dialog">
            <div
                className="modal-dialog"
                tabIndex="-1"
                role="dialog"
                style={{ paddingRight: '17px' }}
            >
                <div className="modal-content news-delete-modal">

                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">Delete User?</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body text-center">
                        <h4 className="modal-headding-text">Delete “user”?</h4>
                        <p className='modal-para-text'>Are you sure you want to delete this user? This step is irreversible</p>
                        <div className='d-flex justify-content-center align-items-center'>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-dark black-btn-hover-white"
                                    onClick={onClose}
                                    style={{ fontSize: "12px", fontWeight: "700" }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-success green-btn"
                                    style={{ padding: "8px 16px", marginLeft: "12px", fontSize: "12px", fontWeight: "700" }}
                                    onClick={userDelete}
                                    disabled={isDeleteRow}
                                >
                                    {isDeleteRow ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DeletUser;