
const FileDelete = ({ isOpen, onClose, isFileData, actionDeleteButton, selectedRows, deleteRow, isDeleteRow }) => {
    if (!isOpen) return null;
    const singleDlete = () => {
        deleteRow(isFileData?.id);
    }

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
                        <h5 className="modal-title modal-headding mb-0">Delete FILE?</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body text-center">
                        {selectedRows.length === 0 && !isFileData ? <h4 className="modal-headding-text">Please select at least one item.</h4> : <h4 className='modal-headding-text'>Delete {!isFileData ? `${selectedRows.length} item` : `"${isFileData?.title}"`} ?</h4>}
                        {selectedRows.length === 0 && !isFileData ? null : <p className='modal-para-text'>Are you sure you want to deleted {!isFileData ? `these` : `this`} files? This step is irreversible</p>}
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
                                    onClick={!isFileData ? multipleDelete : singleDlete}
                                    disabled={isDeleteRow || !isFileData && selectedRows.length === 0}
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

export default FileDelete;