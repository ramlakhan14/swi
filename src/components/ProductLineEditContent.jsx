import React, { useEffect, useRef, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { useForm } from 'react-hook-form';
import CompanyInformationTab from './ProductTab/CompanyInformationTab';
import ModelsTab from './ProductTab/ModelsTab';
import DetailedInformationTab from './ProductTab/DetailedInformationTab';
import { useNavigate, useParams } from 'react-router-dom';
import { adminProductsStatus, createProduct, getAllProductdetails } from '../services/ProductsApis';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HideProductLine from './Modal/HideProductLine';

const ProductLineEditContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isData, setIsData] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, control, getValues } = useForm();
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('company-information');
    const [existingFiles, setExistingFiles] = useState({});
    const [isOptionLinkData, setIsOptionLinkData] = useState([]);
    const [isModalData, setIsModalData] = useState([]);
    const [isDisableProduct, setIsDisableProduct] = useState(false);
    const [isOpenHideProductModal, setIsOpenHideProductModal] = useState(false);
    useEffect(() => {
        const fetchProductdetails = async (id) => {
            try {
                const response = await getAllProductdetails(id);
                setIsData(response?.data[0]);
            } catch (error) {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            }
        }
        fetchProductdetails(id);
    }, [id]);

    useEffect(() => {
        if (isData) {
            const {
                current_price_list,
                dealer_program_1,
                dealer_program_2,
                option_file_1,
                option_file_2,
                option_file_3, 
                option_file_4, 
                option_file_5,
                product_logo,
                primary_photo,
                ...filteredProduct
            } = isData;

            setIsOptionLinkData(filteredProduct?.option_link);
            setIsModalData(filteredProduct?.model)
            reset(filteredProduct);
            setExistingFiles({
                current_price_list: { url: current_price_list },
                dealer_program_1: { url: dealer_program_1 },
                dealer_program_2: { url: dealer_program_2 },
                option_file_1: { url: option_file_1 },
                option_file_2: { url: option_file_2 },
                option_file_3: { url: option_file_3 },
                option_file_4: { url: option_file_4 },
                option_file_5: { url: option_file_5 },
                product_logo: { url: product_logo },
                primary_photo: { url: primary_photo }
            });
        }
    }, [isData, reset]);



    const sectionRefs = {
        'company-information': useRef(null),
        'modal-section': useRef(null),
        'detailed-information-section': useRef(null),
    };

    function cleanData(obj) {
        const cleaned = {};

        Object.entries(obj).forEach(([key, value]) => {
            // Keep empty strings (for deleted files)
            if (value === "") {
                cleaned[key] = value;
                return;
            }

            // Keep FileList objects even if empty (we'll check length later)
            if (value instanceof FileList) {
                cleaned[key] = value;
                return;
            }

            // Skip null/undefined
            if (value === null || value === undefined) return;

            // Handle arrays
            if (Array.isArray(value)) {
                const filteredArr = value.filter(
                    (item) =>
                        !(item &&
                            typeof item === "object" &&
                            Object.values(item).every((v) => v === ""))
                );

                if (filteredArr.length > 0) cleaned[key] = filteredArr;
                return;
            }

            // Keep all other values
            cleaned[key] = value;
        });

        return cleaned;
    }

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Add all non-file fields first
    Object.keys(data).forEach(key => {
        const value = data[key];
        
        // Skip FileList objects for now
        if (value instanceof FileList) {
            return;
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                Object.keys(item).forEach(subKey => {
                    if (item[subKey] !== null && item[subKey] !== undefined) {
                        formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
                    }
                });
            });
            return;
        }
        
        // Add regular fields (including empty strings for deleted files)
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    // Handle file uploads - check each file input directly
    const fileInputs = ['option_file_1', 'option_file_2', 'option_file_3', 'option_file_4', 'option_file_5' ,'current_price_list', 'dealer_program_1', 'dealer_program_2', 'product_logo', 'primary_photo'];
    
    fileInputs.forEach(fieldName => {
        const fileList = data[fieldName];
        // If there's a new file selected
        if (fileList && fileList instanceof FileList && fileList.length > 0) {
            formData.append(fieldName, fileList[0]);
        } 
        // If the file was removed (existingFiles[fieldName] is null and no new file)
        else if (existingFiles[fieldName] === null && (!fileList || fileList.length === 0)) {
            formData.append(fieldName, '');
        }
        // If keeping existing file - do nothing, backend will keep it
    });

    formData.append("_method", "PUT");
    
    try {
        const response = await createProduct(formData, data?.id);
        showSuccessToast(response?.message);
        navigate('/product-line');
    } catch (error) {
        showErrorToast(error?.response?.data?.message || "An error occurred");
    }
};

    const scrollToSection = (ref) => {
        setActiveTab(ref);
        setTimeout(() => {
            const element = document.getElementById(ref);
            const scrollContainer = element?.closest('[style*="overflow"]');
            if (element && scrollContainer) {
                const navHeight = 60;
                const elementTop = element.offsetTop;
                scrollContainer.scrollTo({
                    top: elementTop - navHeight,
                    behavior: 'smooth'
                });
            }
        }, 0);
    };

    useEffect(() => {
        const handleScroll = () => {
            const sectionTops = Object.entries(sectionRefs)
                .map(([key, ref]) => ({
                    key,
                    offset: ref.current ? Math.abs(ref.current.getBoundingClientRect().top - containerRef.current.getBoundingClientRect().top - 60) : Infinity // 60 is nav height
                }))
                .sort((a, b) => a.offset - b.offset);

            if (sectionTops.length > 0 && activeTab !== sectionTops[0].key) {
                setActiveTab(sectionTops[0].key);
            }
        };

        const scrollContainer = containerRef.current;
        if (scrollContainer) {
            

            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
        setActiveTab("dealer-information");
    }, [activeTab, sectionRefs]);

    const genderField = {
        name: "rebate_type",
        label: "Type of Rebate",
        required: true,
        options: [
            { value: "bid", label: "Bid" },
            { value: "fleet", label: "Fleet" },
            { value: "both", label: "Both" },
            { value: "openHouseFleet", label: "Open House Fleet" },
        ]
    };


    // Add this function in your parent component before the return statement
    const handleFileDelete = (fieldName) => {
        // Update existingFiles to remove the file
        setExistingFiles(prev => ({
        ...prev,
        [fieldName]: null
    }));
    };

    const hideProduct = async () => {
        try {
            setIsDisableProduct(true);
            const payload = {
                "product_id": id,
                "status": 0
            }
            const response = await adminProductsStatus(payload);
            showSuccessToast(response?.message);
            setIsOpenHideProductModal(false);
            navigate('/product-line');
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred");
        } finally {
            setIsDisableProduct(false)
        }
    }


    return (
        <>
            <InnerPageTopBar path='/product-line' />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="name-part" style={{ marginTop: "20px" }}>
                    <div className='d-flex justify-content-between'>
                        <h2>{isData?.product_name}</h2>
                        <div className='d-flex gap-2'>
                            <button
                                type="button"
                                className="btn btn-dark black-btn-hover-white"
                                onClick={() => setIsOpenHideProductModal(true)}
                                style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px", padding: "12px 24px" }}
                            >Hide Product</button>
                            <button
                                type="submit"
                                className="btn btn-success green-btn"
                                style={{
                                     padding: "12px 24px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    whiteSpace: 'nowrap'
                                }}
                                disabled={isSubmitting}
                            >{isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="outer-div-fixed-height" style={{ paddingTop: "20px" }}>
                        <div className='position-relative' style={{ overflowX: "hidden" }}>
                            <ul className="nav nav-tabs justify-content-center position-absolute top-0 w-100 bg-white" style={{ marginBottom: "20px", paddingTop: "10px", left: 0, right: 0, zIndex: 3 }}>
                                <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'company-information' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('company-information')}>Company Information</button>
                                </li>
                                {/* <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'modal-section' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('modal-section')}>Models</button>
                                </li> */}
                                <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'detailed-information-section' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('detailed-information-section')}>Detailed Information</button>
                                </li>
                            </ul>
                            <div style={{ height: "550px", overflowY: "auto", overflowX: "hidden", paddingTop: "60px" }} ref={containerRef}>

                                <div ref={sectionRefs['company-information']} id="company-information">
                                    <CompanyInformationTab
                                        register={register}
                                        errors={errors}
                                        existingFiles={existingFiles}
                                        onFileDelete={handleFileDelete}
                                    />
                                </div>
                                {/* <div ref={sectionRefs['modal-section']} id="modal-section">
                                    <ModelsTab register={register} errors={errors} isModalData={isModalData} control={control} />
                                </div> */}
                                <div ref={sectionRefs['detailed-information-section']} id="detailed-information-section">
                                    <DetailedInformationTab register={register} existingFiles={existingFiles} control={control} errors={errors} genderField={genderField} isOptionLinkData={isOptionLinkData} onFileDelete={handleFileDelete} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <HideProductLine isOpen={isOpenHideProductModal} onClose={() => setIsOpenHideProductModal(false)} hideProduct={hideProduct} isDisableProduct={isDisableProduct} />
        </>
    );
};

export default ProductLineEditContent;