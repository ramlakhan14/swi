import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../../TextInputWhiteBackground';
import TextAreaInput from '../../TextAreaInput';
import { getAllProducts } from '../../../services/ProductsApis';
import { createNews } from '../../../services/newsApi';
import { showErrorToast, showSuccessToast } from '../../../utils/ToastUtils';


const NewsAddAndEdit = ({ isOpen, onClose, isNewsData, setIsNewsData, fetchGetAllNews, currentPage }) => {
    const [isProductLines, setIsProductLines] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        getValues
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            productLines: []
        }
    });

    useEffect(() => {
        const feactch = () => {
            reset(isNewsData);
            setValue("product_dealer_toolbox", isNewsData?.dealer_toolbox_assign)
            if (isNewsData?.product_ids && Array.isArray(isNewsData.product_ids)) {
                isNewsData.product_ids.forEach(productId => {
                    setValue(`product_${productId}`, true);
                });
            }
        }
        if (isNewsData) {
            feactch();
        }
    }, [isNewsData, setValue]);

    const handleClose = () => {
        reset({
            title: '',
            description: '',
            message: ''
        });
        setIsNewsData(null);
        onClose();
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
            } catch (error) {
                showErrorToast("An error occurred while getting the data.")
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
        payload.append("description", data.message);
        payload.append("dealer_toolbox", data.product_dealer_toolbox ? 1 : 0);

        selectedProducts.forEach((id, index) => {
            payload.append(`product_ids[${index}]`, id);
        });

        try {
            if (isNewsData) {
                payload.append("_method", "PUT");
            }
            const response = await createNews(payload, isNewsData?.id);
            showSuccessToast(response?.message);
            fetchGetAllNews(currentPage);
            handleClose();
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
                <div className="modal-content add-news-modal">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title modal-headding mb-0">{isNewsData ? "Edit" : "Add"} News</h5>
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

                                <TextAreaInput
                                    name="message"
                                    placeholder="Enter your message here"
                                    label="Message"
                                    register={register}
                                    error={errors.message}
                                    validation={{
                                        required: 'Message is required',
                                        minLength: {
                                            value: 3,
                                            message: 'Message must be at least 3 characters long'
                                        },
                                        maxLength: {
                                            value: 500,
                                            message: 'Message cannot be more than 500 characters'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "20px" }}
                                    rows={4}
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
                                                {isNewsData ? 'Updating...' : 'Submitting...'}
                                            </>
                                        ) : (
                                            isNewsData ? 'Update' : 'Save'
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

export default NewsAddAndEdit;