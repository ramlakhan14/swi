import React, { useEffect, useRef, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import DealerInformationTab from './IndividualUserTabs/DealerInformationTab';
import { addUserModel, getAllRole, getByIdUser } from '../services/userApi';
import { getAllDealerUserType, getAllSalesPerson } from '../services/adminApi';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import PowerDealerInfoTab from './IndividualUserTabs/PowerDealerInfoTab';
import ProductLineTab from './IndividualUserTabs/ProductLineTab';
import { getAllProducts } from '../services/ProductsApis';
import DealerUsersTab from './IndividualUserTabs/DealerUsersTab';
import SwidistincCredentialsTab from './IndividualUserTabs/SwidistincCredentialsTab';
import DeletUser from './Modal/UserList/DeletUser';
import Loader from './Loader';

const ProductLineEidtContent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset, control } = useForm();
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('dealer-information');
    const [isRoleData, setIsRoleData] = useState([]);
    const [isSalesperson, setIsSalesperson] = useState([]);
    const [isProductLines, setIsProductLines] = useState([]);
    const [isUserType, setIsUserType] = useState([]);
    const [existingFiles, setExistingFiles] = useState({});
    const [isData, setIsData] = useState(null);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isPasswordIsNotNull, setIsPasswordIsNotNull] = useState(false);
    const sectionRefs = {
        'dealer-information': useRef(null),
        'power-dealer-info': useRef(null),
        'product-lines': useRef(null),
        'dealer-users': useRef(null),
        'swidistinc-credentials': useRef(null),
    };

    const [isDealerUsers, setIsDealerUsers] = useState(false);

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
            const scrollContainer = containerRef.current;

            if (
                scrollContainer.scrollTop + scrollContainer.clientHeight >=
                scrollContainer.scrollHeight - 5
            ) {
                setActiveTab("swidistinc-credentials");
                return;
            }
            const sectionTops = Object.entries(sectionRefs)
                .map(([key, ref]) => ({
                    key,
                    offset: ref.current ? Math.abs(ref.current.getBoundingClientRect().top - containerRef.current.getBoundingClientRect().top - 60) : Infinity
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
    }, [activeTab, sectionRefs]);


    const genderFieldRole = {
        name: "role_id",
        label: "Role",
        required: true,
        options: isRoleData
    };

    const genderFieldSalesPerson = {
        name: "sale_person_id",
        label: "Salesperson",
        required: true,
        options: isSalesperson
    };

    useEffect(() => {
        const fetchRole = async (id) => {
            try {
                const responseRole = await getAllRole();
                const roleData = responseRole?.data?.map((role) => ({
                    value: role?.id,
                    label: role?.role_name
                }));
                setIsRoleData(roleData);
                const responseSalesPerson = await getAllSalesPerson();
                const salespersonData = responseSalesPerson?.data?.map((role) => ({
                    value: role?.id,
                    label: role?.sales_person_name
                }));
                setIsSalesperson(salespersonData);
                const response = await getAllProducts();
                const productLineData = [
                    ...(response?.data?.map(item => ({
                        id: item?.id,
                        name: item?.product_name
                    })) || [])
                ];
                setIsProductLines(productLineData);

                const responseDealerUserType = await getAllDealerUserType();
                const roleDealerUserData = responseDealerUserType?.data?.map((role) => ({
                    value: role?.id,
                    label: role?.role_name
                }));
                // const roleDealerUserData = [
                //     ...(responseDealerUserType?.data?.map((role) => ({
                //         value: role?.id,
                //         label: role?.role_name
                //     })) || []),
                //     {
                //         value: 0,
                //         label: "Other"
                //     }
                // ];

                setIsUserType(roleDealerUserData);
                const responseUserById = await getByIdUser(id);
                setIsData(responseUserById?.data);

                setTimeout(() => {
                    scrollToSection('dealer-information');
                }, 0);

            } catch (error) {
                showErrorToast(error?.response?.data?.message || "An error occurred");
            }
        }
        fetchRole(id);
    }, []);

    const formatPhoneNumber = (value) => {
        if (!value) return "";

        const cleaned = value.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }

        return value;
    };


    useEffect(() => {
        if (isData) {
            const {
                logo,
                photo,
                ...removeFileData
            } = isData;

            if (removeFileData?.password !== null && removeFileData?.password !== "null") {
                setIsPasswordIsNotNull(true);
            }

            // format phone number before reset
            if (removeFileData?.phone_no) {
                removeFileData.phone_no = formatPhoneNumber(removeFileData.phone_no);
            }

            // Format fax number
            if (removeFileData?.fax) {
                removeFileData.fax = formatPhoneNumber(removeFileData.fax);
            }

            reset(removeFileData);
            if (isData?.product_ids && Array.isArray(isData.product_ids)) {
                isData.product_ids.forEach(productId => {
                    setValue(`product_${productId}`, true);
                });
            }
            setExistingFiles({
                logo: { url: isData?.logo },
                photo: { url: isData?.photo }
            });
            setTimeout(() => {
                scrollToSection('dealer-information');
            }, 0);
        }
    }, [isData]);



    const onSubmit = async (data) => {
        const selectedProducts = isProductLines
            .filter(product => data[`product_${product.id}`])
            .map(product => product.id);

        const payload = new FormData();

        const safeAppend = (form, key, value) => {
            if (value === null || value === undefined || value === "") return;
            form.append(key, value);
        };

        safeAppend(payload, "dealer_id", data?.dealer_id);
        safeAppend(payload, "company_name", data?.company_name);
        safeAppend(payload, "edi_id", data?.edi_id);
        safeAppend(payload, "edi_password", data?.edi_password);
        safeAppend(payload, "first_name", data?.first_name);
        safeAppend(payload, "last_name", data?.last_name);
        safeAppend(payload, "address_1", data?.address_1);
        safeAppend(payload, "address_2", data?.address_2);
        safeAppend(payload, "city", data?.city);
        safeAppend(payload, "state", data?.state);
        safeAppend(payload, "zip", data?.zip);
        safeAppend(payload, "phone_no", data?.phone_no?.replace(/\D/g, ""));
        safeAppend(payload, "fax", data?.fax?.replace(/\D/g, ""));
        safeAppend(payload, "email", data?.email);
        safeAppend(payload, "url", data?.url);
        // payload.append("url", data?.url);
        safeAppend(payload, "sale_person_id", data?.sale_person_id);
        safeAppend(payload, "lat", data?.lat);
        safeAppend(payload, "lng", data?.lng);
        safeAppend(payload, "role_id", data?.role_id);
        safeAppend(payload, "monday", data?.monday);
        safeAppend(payload, "tuesday", data?.tuesday);
        safeAppend(payload, "wednesday", data?.wednesday);
        safeAppend(payload, "thursday", data?.thursday);
        safeAppend(payload, "friday", data?.friday);
        safeAppend(payload, "saturday", data?.saturday);
        safeAppend(payload, "sunday", data?.sunday);
        // payload.append("other_hours", data?.other_hours);
        safeAppend(payload, "other_hours", data?.other_hours);
        safeAppend(payload, "descriptions", data?.descriptions);
        // payload.append("descriptions", data?.descriptions);
        // form.append(payload, "descriptions", data?.descriptions);
        safeAppend(payload, "notes", data?.notes);
        safeAppend(
            payload,
            "swidistinc_ediID",
            data?.swidistinc_ediID
        );

        safeAppend(
            payload,
            "swidistinc_password",
            data?.swidistinc_password
        );
        if (!isPasswordIsNotNull) {
        }

        safeAppend(payload, "password", data?.password_string);
        // boolean fields (append 1 or 0)
        safeAppend(payload, "is_importer_exporter", data?.is_importer_exporter ? 1 : 0);
        safeAppend(payload, "power_dealer_enabled", data?.power_dealer_enabled ? 1 : 0);
        safeAppend(payload, "hide_from_dealer", data?.hide_from_dealer ? 1 : 0);

        // product ids
        selectedProducts.forEach((id, index) => {
            safeAppend(payload, `product_ids[${index}]`, id);
        });

        // dealer users
        data?.dealer_user?.forEach((user, index) => {
            Object.entries(user).forEach(([key, value]) => {
                if (key === "password_string") {
                    safeAppend(payload, `dealer_user[${index}][password]`, value);
                    return;
                }
                if (key === "password" && user.id) return;
                safeAppend(payload, `dealer_user[${index}][${key}]`, value);
            });
        });

        // files
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value instanceof FileList) {
                if (value.length > 0) {
                    payload.append(key, value[0]);
                }
            }
        });

        // PUT method
        payload.append("_method", "PUT");
        try {
            const response = await addUserModel(payload, data?.id);
            showSuccessToast(response?.message);
            if (response?.responseCode === 200) {
                navigate('/user');
            }
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "An error occurred");
            }
            showErrorToast(error?.response?.data?.messages || "An error occurred");
        }
    };


    return (
        <>
            <InnerPageTopBar path="/user" />
            {isDealerUsers && <Loader />}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="name-part" style={{ marginTop: "20px" }}>
                    <div className='d-flex justify-content-between'>
                        <h2>Edit a Dealer / User</h2>
                        <div>
                            <button
                                type="button"
                                className="btn btn-dark black-btn-hover-white"
                                style={{ fontSize: "12px", fontWeight: "700", marginRight: "12px", padding: "12px 24px" }}
                                onClick={() => {
                                    setIsDeleteModal(true);
                                }}
                            >Delete Dealer</button>
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
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Dealer'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="outer-div-fixed-height" style={{ paddingTop: "20px" }}>
                        <div className='position-relative' style={{ overflowX: "hidden" }}>
                            <ul className="nav nav-tabs justify-content-center position-absolute top-0 w-100 bg-white" style={{ marginBottom: "20px", paddingTop: "10px", left: 0, right: 0, zIndex: 3 }}>
                                <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'dealer-information' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('dealer-information')}>Dealer Information</button>
                                </li>
                                <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'power-dealer-info' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('power-dealer-info')}>Power Dealer Info</button>
                                </li>
                                <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'product-lines' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('product-lines')}>Product Lines</button>
                                </li>
                                <li className="nav-item">
                                    <button type='button' className={`nav-link tab-view ${activeTab === 'dealer-users' ? 'active' : ''}`}
                                        onClick={() => scrollToSection('dealer-users')}>Dealer Users</button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link tab-view ${
                                            activeTab === 'swidistinc-credentials' ? 'active' : ''
                                        }`}
                                        onClick={() => scrollToSection('swidistinc-credentials')}
                                    >
                                        Swidistinc Credentials
                                    </button>
                                </li>
                            </ul>
                            <div style={{ height: "550px", overflowY: "auto", overflowX: "hidden", paddingTop: "60px" }} ref={containerRef}>
                                <div id="dealer-information" ref={sectionRefs['dealer-information']} >
                                    <DealerInformationTab
                                        register={register}
                                        errors={errors}
                                        watch={watch}
                                        setValue={setValue}
                                        genderFieldRole={genderFieldRole}
                                        genderFieldSalesPerson={genderFieldSalesPerson}
                                        isPasswordIsNotNull={isPasswordIsNotNull}
                                        id={id}
                                    />
                                </div>
                                <div ref={sectionRefs['power-dealer-info']} id="power-dealer-info">
                                    <PowerDealerInfoTab register={register} errors={errors} existingFiles={existingFiles} />
                                </div>
                                <div ref={sectionRefs['product-lines']} id="product-lines">
                                    <ProductLineTab register={register} errors={errors} isProductLines={isProductLines} />
                                </div>
                                <div ref={sectionRefs['dealer-users']} id="dealer-users">
                                    <DealerUsersTab setIsDealerUsers={setIsDealerUsers} register={register} errors={errors} isUserType={isUserType} control={control} watch={watch} />
                                </div>
                                <div
                                    ref={sectionRefs['swidistinc-credentials']}
                                    id="swidistinc-credentials"
                                >
                                    <SwidistincCredentialsTab
                                        register={register}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <DeletUser isOpen={isDeleteModal} onClose={() => setIsDeleteModal(false)} data={id} />
        </>
    );
};

export default ProductLineEidtContent;