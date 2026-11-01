import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../../TextInputWhiteBackground';
import FileInputWhiteBackground from '../../FileInputWhiteBackground';
import SelectInput from '../../SelectInput';
import { getAllProducts } from '../../../services/ProductsApis';
import { getAllCategory } from '../../../services/adminApi';
import { createFile } from '../../../services/fileApis';
import { showErrorToast, showSuccessToast } from '../../../utils/ToastUtils';


const FileAddAndUpdate = ({ isOpen, onClose, isFileData, setIsFileData, fetchGetAllFiles, currentPage }) => {
    const [isProductLines, setIsProductLines] = useState([]);
    const [isCategoryOption, setIsCategoryOption] = useState([]);
    const [existingFileName, setExistingFileName] = useState(null);
    const [isFlieUrl, setIsFileUrl] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        getValues
    } = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        if (isFileData && isCategoryOption.length > 0) {
            reset(isFileData);
            setValue("product_dealer_toolbox", isFileData?.dealer_toolbox_assign);
            setValue("category_id", isFileData?.category_id);
            if (isFileData?.product_ids && Array.isArray(isFileData.product_ids)) {
                isFileData.product_ids.forEach(productId => {
                    setValue(`product_${productId}`, true);
                });
            }
            if (isFileData?.file) {
                setIsFileUrl(isFileData?.file_url)
                setExistingFileName(isFileData?.file);
            }
        }
    }, [isFileData, isCategoryOption, setValue, reset]);

    const handleClose = () => {
        reset({
            title: '',
            description: '',
        });
        setExistingFileName(null);
        setIsFileData(null);
        setIsFileUrl(null);
        onClose();
    };


    const genderField = {
        name: "category_id",
        label: "Category",
        required: true,
        options: isCategoryOption
    };


    useEffect(() => {
        const fetchGetAllProducts = async () => {
            try {
                const responseProductLine = await getAllProducts();
                const productLineData = [
                    ...(responseProductLine?.data?.map(item => ({
                        id: item?.id,
                        name: item?.product_name
                    })) || []),
                    {
                        id: 'dealer_toolbox',
                        name: 'Dealer Toolbox'
                    }
                ];
                setIsProductLines(productLineData);
                const responsCategory = await getAllCategory();
                const categoryData = responsCategory?.data?.map(item => ({
                    value: item?.id,
                    label: item?.category_name
                })) || [];
                setIsCategoryOption(categoryData)
            } catch (error) {
                if (error?.response?.data.responseCode === 422) {
                    return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "An error occurred");
                }
                showErrorToast(error?.response?.data?.messages || "An error occurred");
            }
        }
        if (isOpen) {
            fetchGetAllProducts();
        }
    }, [isOpen]);


    const onSubmit = async (data) => {
        const selectedProducts = isProductLines
            .filter(
                product =>
                    product.id !== 'dealer_toolbox' && data[`product_${product.id}`]
            )
            .map(product => product.id);
        const payload = new FormData();
        payload.append("title", data.title);
        payload.append("description", data.description);
        payload.append("dealer_toolbox_assign", data.product_dealer_toolbox ? 1 : 0);
        payload.append("category_id", data.category_id);
        if (data.myFile && data.myFile.length > 0) {
            payload.append("file", data.myFile[0]);
        }
        selectedProducts.forEach((id, index) => {
            payload.append(`product_ids[${index}]`, id);
        });

        try {
            if (isFileData) {
                payload.append("_method", "PUT");
            }
            const response = await createFile(payload, isFileData?.id);
            showSuccessToast(response?.message);
            fetchGetAllFiles(currentPage);
            handleClose();
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred");
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
                <div className="modal-content add-news-modal">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">{isFileData ? "Edit" : "New"} File</h5>
                        <button
                            type="button"
                            className="btn-close modal-close-btn"
                            onClick={handleClose}
                            aria-label="Close"
                        />
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div>
                                <p className='' style={{ fontSize: '14px', color: '#52525C', marginBottom: "32px" }}>
                                    {isFileData ? "Edit/Replace an existing file on your Dealer toolbox page(s)" : "Upload a file to your Dealer toolbox page(s)"}
                                </p>
                                <TextInputWhiteBackground
                                    name="title"
                                    type="text"
                                    placeholder="Enter your title here"
                                    label="Title"
                                    register={register}
                                    error={errors.title}
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

                                <TextInputWhiteBackground
                                    name="description"
                                    type="text"
                                    placeholder="Enter your description here"
                                    label="Description"
                                    register={register}
                                    error={errors.description}
                                    validation={{
                                        required: 'Description is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Description must be at least 3 characters long'
                                        },
                                        maxLength: {
                                            value: 100,
                                            message: 'Description cannot be more than 100 characters'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "20px" }}
                                />
                                <div className='d-flex align-items-center' style={{ paddingBottom: "20px" }}>
                                    <p className='modal-headding-text mb-0' style={{ marginRight: "12px" }}>File:</p>
                                    <div style={{ flex: 1 }}>
                                        {existingFileName && (
                                            <div style={{
                                                marginBottom: '8px',
                                                fontSize: '13px',
                                                color: '#666',
                                                padding: '8px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '4px'
                                            }}>
                                                Current file: <strong style={{ cursor: 'pointer' }} onClick={() => window.open(isFlieUrl, '_blank')}>{existingFileName}</strong>
                                                <span style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: '#888' }}>
                                                    Upload a new file to replace
                                                </span>
                                            </div>
                                        )}
                                        <FileInputWhiteBackground
                                            name="myFile"
                                            label={existingFileName ? "Replace Document" : "Upload Document"}
                                            register={register}
                                            error={errors.myFile}
                                            accept=".pdf,.doc,.xlsx"
                                            validation={{
                                                required: "Please select a file",
                                                validate: {
                                                    fileSize: (files) =>
                                                        !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
                                                    fileType: (files) =>
                                                        !files[0] ||
                                                        [
                                                            "application/pdf",
                                                            "text/csv",
                                                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                                                            "application/vnd.ms-excel", // .xls
                                                            "application/msword", // .doc
                                                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                                                        ].includes(files[0].type) ||
                                                        "Only PDF, CSV, Excel, or Word files are allowed",
                                                },
                                            }}
                                        />
                                    </div>
                                </div>

                                <SelectInput
                                    field={genderField}
                                    register={register}
                                    error={errors.category_id}
                                    className="form-select-input" // optional
                                    containerStyle={{ marginBottom: "20px" }} // optional
                                />

                                <div style={{ paddingBottom: "20px" }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '12px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#333'
                                    }}>
                                        Product Line:
                                    </label>
                                    <div className="row">
                                        {isProductLines?.map((product) => (
                                            <div key={product.id} className="col-6">
                                                <div className="form-check mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className={`form-check-input ${errors?.product_1 ? "checkbox-error" : ""}`}
                                                        id={`product_${product.id}`}
                                                        {...register(`product_${product.id}`, {
                                                            validate: () => {
                                                                const values = Object.values(getValues()).filter(v => v === true);
                                                                return values.length > 0 || "Please select at least one product line";
                                                            }
                                                        })}
                                                    />

                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`product_${product.id}`}
                                                        style={{ fontSize: '14px', color: '#666' }}
                                                    >
                                                        {product.name}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className='d-flex justify-content-end'>
                                    <button
                                        type="button"
                                        className="btn btn-dark black-btn-hover-white"
                                        style={{ fontSize: "12px", fontWeight: "700" }}
                                        onClick={handleClose}
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
                                                {isFileData ? 'Updating...' : 'Saving...'}
                                            </>
                                        ) : (
                                            isFileData ? 'Update' : 'Save'
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

export default FileAddAndUpdate;