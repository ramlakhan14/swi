
const DealerUserDelete = ({ isOpen, onClose, isData, selectedRows,actionDeleteButton, isDeleteRow }) => {
    if (!isOpen) return null;
    
    const multipleDelete = () => {
        actionDeleteButton();
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
                        {selectedRows.length === 0 && !isData ? <h4 className="modal-headding-text">Please select at least one item.</h4> : <h4 className='modal-headding-text'>Delete {!isData ? `${selectedRows.length} item` : `"${isData?.alert_name}"`} ?</h4>}
                        {selectedRows.length === 0 && !isData ? null : <p className='modal-para-text'>Are you sure you want to deleted {!isData ? `these` : `this`} user? This step is irreversible</p>}
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
                                    onClick={multipleDelete}
                                    disabled={isDeleteRow || !isData && selectedRows.length === 0}
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

export default DealerUserDelete;