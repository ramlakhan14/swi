import React, { useState, useEffect } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { useForm } from 'react-hook-form';
import TextInputWhiteBackground from './TextInputWhiteBackground';
import SelectInput from './SelectInput';
import FileInputWhiteBackground from './FileInputWhiteBackground';
import MyEditor from './MyEditor';
import { getAllProducts } from '../services/ProductsApis';
import { getAllDealerUserType, getAllSalesPerson } from '../services/adminApi';
import { addEmail, getByIdEmail } from '../services/savedEmailApi';
import { useNavigate, useParams } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HelmetComponent from './HelmetComponent';

const EmailDealerContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmittingText, setIsSubmittingText] = useState(null);
    const [isMessageData, setIsMessageData] = useState("");
    const [isSignatureData, setIsSignatureData] = useState("");
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setValue, reset } = useForm({
        defaultValues: {
            selectAllDealers: false,
            selectOwnerType: '',
            productLine: [],
            accountType: [],
            salesModel: [],
            dealUsers: [],
            applyMarketOwner: '',
            emailAddresses: '',
            subject: '',
            attachments: []
        }
    });
    const [isProductLines, setIsProductLines] = useState([]);
    const [isSalesperson, setIsSalesperson] = useState([]);
    const [isUserType, setIsUserType] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [existingFiles, setExistingFiles] = useState({});
    const selectAllDealers = watch("selectAllDealers");
    const selectByProduct = watch("selectByProduct");
    const selectBySales = watch("selectBySales");
    const includeDealerUsers = watch("includeDealerUsers");
    const productLine = watch("productLine");
    const salesModel = watch("salesModel");

    const onSubmit = async (data) => {
        const payload = new FormData();
        payload.append('type', isSubmittingText);
        payload.append('all_dealer', data.selectAllDealers ? 1 : 0);

        payload.append('messages', isMessageData);
        payload.append('signature', isSignatureData);
        payload.append('reply_to_email', data.reply_to_email);
        payload.append('from', data.from);
        payload.append('subject', data.subject);
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value instanceof FileList) {
                if (value.length > 0) {
                    payload.append(key, value[0]);
                }
                return;
            }
        });

        if (data?.selectAllDealers === false) {

            if (data?.selectByProduct === true || data?.productLine?.length > 0) {
                payload.append('by_product_line', 1);
                data?.productLine?.map((product, index) => {
                    payload.append(`products_ids[${index}]`, product);
                });
            } else if (data?.selectBySales === true || data?.salesModel?.length > 0) {
                payload.append('by_sales_person', 1);
                data?.salesModel?.map((sales, index) => {
                    payload.append(`sales_person_ids[${index}]`, sales);
                });
            }
            if (data?.dealUsers?.length > 0) {
                payload.append('include_dealer_user', 1);
                data?.dealUsers?.map((user, index) => {
                    payload.append(`dealer_user_type[${index}]`, user);
                });
            } else {

                payload.append('include_dealer_user', 0);
            }
        }
        if (data?.selectAllDealers === true && data?.dealUsers?.length > 0) {
            payload.append('include_dealer_user', 1);
            data?.dealUsers?.map((user, index) => {
                payload.append(`dealer_user_type[${index}]`, user);
            });
        }

        if (isSubmittingText === 'preview') {
            payload.append('preview_email', data?.preview_email);
        }
        try {
            const response = await addEmail(payload, id);
            showSuccessToast(response?.message);
            if (isSubmittingText === 'preview') {
                return;
            } else if (isSubmittingText === 'save') {
                navigate('/saved-email');
            } else {
                navigate('/manage-email');
            }
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0]);
            } else {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            }
        }
    };

    const replyTo = {
        name: "reply_to_email",
        label: "Reply To (Email Address)",
        required: true,
        options: [
            { value: "plcparts@stevenwillandinc.com", label: "plcparts@stevenwillandinc.com" },
            { value: "plcmarketinggrp@stevenwillandinc.com", label: "plcmarketinggrp@stevenwillandinc.com" },
            { value: "jdopson@stevenwillandinc.com", label: "jdopson@stevenwillandinc.com" },
            { value: "plcsalesteam@stevenwillandinc.com", label: "plcsalesteam@stevenwillandinc.com" }
        ]
    };

    useEffect(() => {
        if (selectAllDealers) {
            setValue("selectByProduct", false);
            setValue("selectBySales", false);
            setValue("productLine", []);
            setValue("salesModel", []);
        }
    }, [selectAllDealers, setValue]);

    useEffect(() => {
        if (selectByProduct) {
            setValue("productLine", isProductLines.map(p => String(p.id)));  // ✅ setting id strings

        } else {
            setValue("productLine", []);
        }
    }, [selectByProduct, setValue]);

    useEffect(() => {
        if (selectBySales) {
            setValue("salesModel", isSalesperson.map(s => String(s.id)));
        } else {
            setValue("salesModel", []);
        }
    }, [selectBySales, setValue]);

    useEffect(() => {
        if (includeDealerUsers) {
            setValue("dealUsers", isUserType.map(u => String(u.id)));
        } else {
            setValue("dealUsers", []);
        }
    }, [includeDealerUsers, setValue]);

    useEffect(() => {
        if (productLine && productLine.length > 0) {
            setValue("selectBySales", false);
            setValue("salesModel", []);
        }
    }, [productLine, setValue]);

    useEffect(() => {
        if (salesModel && salesModel.length > 0) {
            setValue("selectByProduct", false);
            setValue("productLine", []);
        }
    }, [salesModel, setValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllProducts();
                const productLineData = [
                    ...(response?.data?.map(item => ({
                        id: item?.id,
                        name: item?.product_name
                    })) || [])
                ];
                setIsProductLines(productLineData);
                const responseSalesPerson = await getAllSalesPerson();
                const salespersonData = responseSalesPerson?.data?.map((role) => ({
                    id: role?.id,
                    label: role?.sales_person_name,
                    code: role?.code
                }));
                setIsSalesperson(salespersonData);

                const responseDealerUserType = await getAllDealerUserType();
                const roleDealerUserData = responseDealerUserType?.data?.map((role) => ({
                    id: role?.id,
                    label: role?.role_name
                }));
                const finalUserTypeList = [
                    { id: 0, label: 'All Dealer Users' },
                    ...roleDealerUserData
                ];
                setIsUserType(finalUserTypeList);
            } catch (error) {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            } finally {
                setIsDataLoaded(true);
            }

        }

        fetchData();
    }, []);

    useEffect(() => {
        const fetchEmailData = async () => {
            if (id) {
                try {
                    const response = await getByIdEmail(id);
                    const emailData = response?.data;
                    setIsMessageData(emailData?.messages);
                    setIsSignatureData(emailData?.signature);
                    reset({
                        reply_to_email: emailData?.reply_to_email,
                        from: emailData?.from,
                        subject: emailData?.subject,
                        preview_email: emailData?.preview_email,
                        selectAllDealers: emailData?.all_dealer === 1 ? true : false,
                        selectBySales: emailData?.by_sales_person === 1 ? true : false,
                        selectByProduct: emailData?.by_product_line === 1 ? true : false,
                        includeDealerUsers: emailData?.include_dealer_user === 1 ? true : false,
                    });

                    if (emailData?.products_ids && Array.isArray(emailData.products_ids)) {
                        const productIds = emailData.products_ids.map(id => id.toString());
                        setValue('productLine', productIds);
                    }

                    if (emailData?.sales_person_ids && Array.isArray(emailData.sales_person_ids)) {
                        const salesIds = emailData.sales_person_ids.map(id => id.toString());
                        setValue('salesModel', salesIds);
                    }

                    if (emailData?.dealer_user_type && Array.isArray(emailData.dealer_user_type)) {
                        const dealerUserIds = emailData.dealer_user_type.map(id => id.toString());
                        setValue('dealUsers', dealerUserIds);
                    }
                    setExistingFiles({
                        attachment_1: { url: emailData?.attachment_1 },
                        attachment_2: { url: emailData?.attachment_2 },
                        attachment_3: { url: emailData?.attachment_3 }
                    });
                }
                catch (error) {
                    showErrorToast(error?.response?.data?.message || "An error occurred");
                }
            }
        };
        fetchEmailData();
    }, [id, isDataLoaded, reset]);


    return (
        <>
            <HelmetComponent
                title="E-Mail Dealers | SWI"
                description="This is the description for the e-mail dealers page."
                keywords="react, helmet, seo"
                canonicalUrl=""
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "My React App" }
                ]}
            />
            <InnerPageTopBar />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded" noValidate>
                <div className="name-part" style={{ marginTop: "20px" }}>
                    <div className='d-flex justify-content-between'>
                        <h2>E-Mail Dealers</h2>
                        <button
                            type="submit"
                            className="btn btn-success green-btn"
                            style={{
                                padding: "12px 24px",
                                fontSize: "12px",
                                fontWeight: "700",
                                whiteSpace: 'nowrap'
                            }}
                            onClick={() => setIsSubmittingText('save')}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && isSubmittingText === "save" ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : (
                                'Save Email'
                            )}
                        </button>
                    </div>
                </div>
                <div className="container-fluid py-4" style={{ maxHeight: '500px', overflow: "auto" }}>
                    <div className="row" style={{ marginBottom: "20px" }}>
                        <label className="col-12 col-md-3 col-form-label dealers-right-side">
                            Dealer Filter:
                        </label>
                        <div className="col-12 col-md-9">
                            <div className="form-check mb-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="selectAllDealers"
                                    {...register('selectAllDealers')}
                                />
                                <label className="form-check-label dealers-right-side" htmlFor="selectAllDealers">
                                    Send to ALL Dealers (Dealer Users are selected below)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginBottom: "20px" }}>
                        <label className="col-12 col-md-3 col-form-label dealers-right-side">Product Line:</label>
                        <div className="col-12 col-md-9">
                            <div className="form-check" style={{ marginBottom: "32px" }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="selectByProduct"
                                    {...register("selectByProduct")}
                                    disabled={selectAllDealers || (salesModel && salesModel.length > 0)}
                                />
                                <label className="form-check-label dealers-right-side" htmlFor="selectByProduct">
                                    Select Dealers by Product Line
                                </label>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    {isProductLines.slice(0, Math.ceil(isProductLines.length / 2)).map((option, index) => (
                                        <div key={index} className="form-check" style={{ marginBottom: "10px" }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={option?.id}
                                                id={`product-${index}`}
                                                {...register('productLine')}
                                                disabled={selectAllDealers || (salesModel && salesModel.length > 0)}
                                            />
                                            <label className="form-check-label dealers-right-side" htmlFor={`product-${index}`}>
                                                {option?.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 col-md-6">
                                    {isProductLines.slice(Math.ceil(isProductLines.length / 2)).map((option, index) => (
                                        <div key={index + Math.ceil(isProductLines.length / 2)} className="form-check" style={{ marginBottom: "10px" }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={option?.id}
                                                id={`product-${index + Math.ceil(isProductLines.length / 2)}`}
                                                {...register('productLine')}
                                                disabled={selectAllDealers || (salesModel && salesModel.length > 0)}
                                            />
                                            <label className="form-check-label dealers-right-side" htmlFor={`product-${index + Math.ceil(isProductLines.length / 2)}`}>
                                                {option?.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginBottom: "20px" }}>
                        <label className="col-12 col-md-3 col-form-label dealers-right-side">Sales Model:</label>
                        <div className="col-12 col-md-9">
                            <div className="form-check" style={{ marginBottom: "32px" }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="selectBySales"
                                    {...register("selectBySales")}
                                    disabled={selectAllDealers || (productLine && productLine.length > 0)}
                                />
                                <label className="form-check-label dealers-right-side" htmlFor="selectBySales">
                                    Select Dealers by assigned Sales Person
                                </label>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    {isSalesperson.slice(0, Math.ceil(isSalesperson.length / 2)).map((option, index) => (
                                        <div key={index} className="form-check" style={{ marginBottom: "10px" }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={option?.id}
                                                id={`sales-${index}`}
                                                {...register('salesModel')}
                                                disabled={selectAllDealers || (productLine && productLine.length > 0)}
                                            />
                                            <label className="form-check-label dealers-right-side" htmlFor={`sales-${index}`}>
                                                {option?.label}({option?.code})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 col-md-6">
                                    {isSalesperson.slice(Math.ceil(isSalesperson.length / 2)).map((option, index) => (
                                        <div key={index + Math.ceil(isSalesperson.length / 2)} className="form-check" style={{ marginBottom: "10px" }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={option?.id}
                                                id={`sales-${index + Math.ceil(isSalesperson.length / 2)}`}
                                                {...register('salesModel')}
                                                disabled={selectAllDealers || (productLine && productLine.length > 0)}
                                            />
                                            <label className="form-check-label dealers-right-side" htmlFor={`sales-${index + Math.ceil(isSalesperson.length / 2)}`}>
                                                {option?.label}({option?.code})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginBottom: "20px" }}>
                        <label className="col-12 col-md-3 col-form-label dealers-right-side">Deal Users:</label>
                        <div className="col-12 col-md-9">
                            <div className="form-check" style={{ marginBottom: "32px" }}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="includeDealerUsers"
                                    {...register("includeDealerUsers")}
                                />
                                <label className="form-check-label dealers-right-side" htmlFor="includeDealerUsers">
                                    Include Dealer Users
                                </label>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    {isUserType.slice(0, Math.ceil(isUserType.length / 2)).map((option, index) => (
                                        <div key={index} className="form-check" style={{ marginBottom: "10px" }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={option?.id}
                                                id={`deal-${index}`}
                                                {...register('dealUsers')}
                                            />
                                            <label className="form-check-label dealers-right-side" htmlFor={`deal-${index}`}>
                                                {option?.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 col-md-6">
                                    {isUserType.slice(Math.ceil(isUserType.length / 2)).map((option, index) => (
                                        <div key={index + Math.ceil(isUserType.length / 2)} className="form-check" style={{ marginBottom: "10px" }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={option?.id}
                                                id={`deal-${index + Math.ceil(isUserType.length / 2)}`}
                                                {...register('dealUsers')}
                                            />
                                            <label className="form-check-label dealers-right-side" htmlFor={`deal-${index + Math.ceil(isUserType.length / 2)}`}>
                                                {option?.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <SelectInput
                            field={replyTo}
                            register={register}
                            error={errors.gender}
                            className="form-select-input"
                            containerStyle={{ marginBottom: "20px" }}
                        />
                        <TextInputWhiteBackground
                            name="from"
                            type="email"
                            placeholder="Enter From (Email)"
                            label="From (Email)"
                            register={register}
                            error={errors.from}
                            containerStyle={{ marginBottom: "20px" }}
                            validation={{
                                required: "From (Email) is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                },
                            }}
                        />

                        <TextInputWhiteBackground
                            name="subject"
                            type="text"
                            placeholder="Enter Subject"
                            label="Subject"
                            register={register}
                            error={errors.subject}
                            containerStyle={{ marginBottom: "20px" }}
                            validation={{
                                required: "Subject is required",
                                minLength: {
                                    value: 3,
                                    message: "Subject must be at least 3 characters long"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Subject cannot be more than 100 characters"
                                }
                            }}
                        />


                        <div className="row" style={{ marginBottom: "20px" }}>
                            <label className="col-12 col-md-3 col-form-label dealers-right-side">
                                Attachments:
                            </label>
                            <div className="col-12 col-md-9">
                                <div className='mb-3'>
                                    {existingFiles?.attachment_1?.url && (
                                        <div style={{
                                            marginBottom: '8px',
                                            fontSize: '13px',
                                            color: '#666',
                                            padding: '8px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '4px'
                                        }}>
                                            Current file: <a href={existingFiles?.attachment_1?.url} target="_blank" rel="noopener noreferrer">
                                                {"Download the file"}
                                            </a>
                                            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: '#888' }}>
                                                Upload a new file to replace
                                            </span>
                                        </div>
                                    )}
                                    <FileInputWhiteBackground
                                        name="attachment_1"
                                        label="Upload Document"
                                        register={register}
                                        error={errors.attachment_1}
                                        accept=".pdf,.doc,.xlsx"
                                        validation={{
                                            // required: "Please select a file",
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
                                <div className='mb-3'>
                                    {existingFiles?.attachment_2?.url && (
                                        <div style={{
                                            marginBottom: '8px',
                                            fontSize: '13px',
                                            color: '#666',
                                            padding: '8px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '4px'
                                        }}>
                                            Current file: <a href={existingFiles?.attachment_2?.url} target="_blank" rel="noopener noreferrer">
                                                {"Download the file"}
                                            </a>
                                            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: '#888' }}>
                                                Upload a new file to replace
                                            </span>
                                        </div>
                                    )}
                                    <FileInputWhiteBackground
                                        name="attachment_2"
                                        label="Upload Document"
                                        register={register}
                                        error={errors.attachment_2}
                                        accept=".pdf,.doc,.xlsx"
                                        validation={{
                                            // required: "Please select a file",
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
                                <div>
                                    {existingFiles?.attachment_3?.url && (
                                        <div style={{
                                            marginBottom: '8px',
                                            fontSize: '13px',
                                            color: '#666',
                                            padding: '8px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '4px'
                                        }}>
                                            Current file: <a href={existingFiles?.attachment_3?.url} target="_blank" rel="noopener noreferrer">
                                                {"Download the file"}
                                            </a>
                                            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: '#888' }}>
                                                Upload a new file to replace
                                            </span>
                                        </div>
                                    )}
                                    <FileInputWhiteBackground
                                        name="attachment_3"
                                        label="Upload Document"
                                        register={register}
                                        error={errors.attachment_3}
                                        accept=".pdf,.doc,.xlsx"
                                        validation={{
                                            // required: "Please select a file",
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
                        </div>

                        <div style={{ paddingBottom: "20px" }}>
                            <p className='modal-headding-text mb-2' style={{ fontSize: "12px", color: "#18181B", textTransform: "uppercase" }}>Message</p>
                            <MyEditor value={isMessageData} onChange={setIsMessageData} />
                        </div>

                        <div style={{ paddingBottom: "20px" }}>
                            <p className='modal-headding-text mb-2' style={{ fontSize: "12px", color: "#18181B", textTransform: "uppercase" }}>Signature</p>
                            <MyEditor value={isSignatureData} onChange={setIsSignatureData} />
                        </div>
                    </div>

                    <div className='d-flex justify-content-between'>
                        <div className='d-flex align-items-start'>
                            <TextInputWhiteBackground
                                name="preview_email"
                                type="text"
                                placeholder="Enter your email address here"
                                label="Email Address"
                                register={register}
                                error={errors.preview_email}
                                validation={{
                                    required: isSubmittingText === "preview"
                                        ? "Email Address is required"
                                        : false,
                                    minLength: {
                                        value: 6,
                                        message: 'Email Address must be at least 6 characters long',
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                className="btn btn-dark black-btn-hover-white"
                                style={{ padding: "10px 20px", fontSize: "12px", fontWeight: "700", marginLeft: "12px" }}
                                onClick={() => setIsSubmittingText('preview')}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && isSubmittingText === "preview" ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Preview Email'
                                )}
                            </button>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn btn-success green-btn"
                                disabled={isSubmitting}
                                style={{ padding: "10px 20px", marginLeft: "12px", fontSize: "12px", fontWeight: "700" }}
                                onClick={() => setIsSubmittingText('sent')}
                            >
                                {isSubmitting && isSubmittingText === "sent" ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send To Dealers'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EmailDealerContent;