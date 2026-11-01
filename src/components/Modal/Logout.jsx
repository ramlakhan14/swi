import { useForm } from "react-hook-form";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtils";
import { destroyCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { logoutWithAdmin } from "../../services/adminApi";
import { useUser } from "../../context/UserContext";

const Logout = ({ isOpen, onClose, data }) => {
    const { setUser, user } = useUser();
    const navigate = useNavigate();
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        mode: 'onChange'
    });



    const logout = async () => {
        try {
            const response = await logoutWithAdmin();
            showSuccessToast(response?.message);
            destroyCookie(null, 'token', { path: '/' });
            localStorage.removeItem('user');
            setUser(null);
            data?.role_id === 1 ? navigate('/login-admin') : navigate('/login');
            onClose();
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
                <div className="modal-content news-delete-modal">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">logout</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={() => { onClose(); }}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmit(logout)} noValidate>
                        <div className="modal-body text-center">

                            <h4 className='modal-headding-text'>Logout "{data?.email}" ?</h4>
                            <p className='modal-para-text'>Are you sure you want to logout? </p>
                            <div className='d-flex justify-content-center align-items-center'>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-dark black-btn-hover-white"
                                        onClick={() => { onClose(); }}
                                        style={{ fontSize: "12px", fontWeight: "700" }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success green-btn"
                                        style={{ padding: "8px 16px", marginLeft: "12px", fontSize: "12px", fontWeight: "700" }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logout...
                                            </>
                                        ) : (
                                            'Logout '
                                        )}

                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Logout;