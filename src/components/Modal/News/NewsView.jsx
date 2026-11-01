import { useForm } from 'react-hook-form';


const NewView = ({ isOpen, onClose, isNewsData, closeNewsView , setIsAddAndEditNews }) => {
    const {
        register,
        handleSubmit,
        formState: {isSubmitting },
        reset
    } = useForm({
        mode: 'onChange'
    });
    const onSubmit = async (data) => {
        onClose();
        reset();
        setIsAddAndEditNews(true);
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
                <div className="modal-content news-modal">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">News</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={() => { onClose(); reset(); }}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <h4 className='modal-headding-text'>{isNewsData?.title}</h4>
                        <p className='modal-para-text'>{isNewsData?.message}</p>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="activeCheckbox"
                                            {...register("status")}
                                            disabled
                                            checked={isNewsData?.status === 1 ? true : false}
                                        />
                                        <label
                                            htmlFor="activeCheckbox"
                                            className="ms-2 modal-para-text mb-0"
                                        >
                                            Active
                                        </label>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-dark black-btn-hover-white"
                                            onClick={() => { closeNewsView(); }}
                                            style={{ fontSize: "12px", fontWeight: "700" }}
                                        >
                                            Delete
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
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Edit'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewView;