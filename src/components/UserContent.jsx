import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import DataTable from './DataTable ';
import TextInputWhiteBackground from './TextInputWhiteBackground';
import { useForm } from 'react-hook-form';
import UserAdd from './Modal/UserAdd';
import PaginationComponent from './PaginationComponent';
import { getAllUser } from '../services/userApi';
import { showErrorToast } from '../utils/ToastUtils';
import { useNavigate } from 'react-router-dom';
import HelmetComponent from './HelmetComponent';


const UserContent = () => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [isOpenAddUser, setIsOpenAddUser] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isTableData, setIsTableData] = useState([]);
    const [isTotalPage, setIsTotalPage] = useState(0);
    const [isDealerId, setIsDealerId] = useState(null);
    const [isEmail, setIsEmail] = useState(null);
    const [isCompanyName , setIsCompanyName] = useState(null);
    const [isMissingLat, setIsMissingLat] = useState(null);
    const [isUserType, setIsUserType] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm({
        mode: 'onChange'
    });


    const onSubmit = async (data) => {
        setIsDealerId(data?.dealer_id);
        setIsEmail(data?.email);
        setIsCompanyName(data?.company_name);
        setIsMissingLat(data?.missing_lat_lng ? 1 : 0);
    };

    const columns = [
        {
            header: "Dealer #",
            field: "dealer_id",
            minWidth: "92px"
        },
        {
            header: "Company Name",
            field: "company_name",
            minWidth: "277px"
        }, {
            header: "Email Address",
            field: "email",
            minWidth: "277px"
        }
    ];



    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedRows(isTableData?.map(row => row.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, id]);
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleEdit = (row) => {
        navigate(`/individual-user/${row?.id}`);
    };

    const fetchGetAllFiles = async (page, id ,isEmail, isCompanyName , isMissingLat, userType) => {
        try {
            const response = await getAllUser(page, 10, id , isEmail, isCompanyName , isMissingLat, userType);
            setIsTotalPage(response?.data?.last_page);
            setIsTableData(response?.data?.data);
        } catch (error) {
            showErrorToast("An error occurred while fetching the user data. Please refresh and try again.");
        }
    }

    useEffect(() => {
        fetchGetAllFiles(currentPage, isDealerId,isEmail, isCompanyName , isMissingLat, isUserType);
    }, [currentPage, isDealerId ,isEmail, isCompanyName , isMissingLat,isUserType]);


    return (
        <>
         <HelmetComponent
                title="Users | SWI"
                description="This is the description for the users page."
                keywords="react, helmet, seo"
                canonicalUrl=""
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "My React App" }
                ]}
            />
            <InnerPageTopBar />
            <div className="name-part" style={{ marginTop: "20px" }}>
                <h2>Users</h2>
                <div style={{ marginTop: "20px" }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className='d-md-flex' style={{ gap: '20px', alignItems: "center" }}>
                            <TextInputWhiteBackground
                                name="dealer_id"
                                type="text"
                                placeholder="Dealer #"
                                label="Dealer #"
                                register={register}
                                containerStyle={{ flex: 1 }}
                            />
                            <TextInputWhiteBackground
                                name="company_name"
                                type="text"
                                placeholder="Company Name"
                                label="Company Name"
                                register={register}
                                containerStyle={{ flex: 1 }}
                            />

                            <TextInputWhiteBackground
                                name="email"
                                type="email"
                                placeholder="Email"
                                label="Email"
                                register={register}
                                containerStyle={{ flex: 1 }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    id="missingLatLon"
                                    {...register("missing_lat_lng")}
                                    className='form-check-input mt-0'
                                />
                                <label
                                    className="form-check-label ms-2 modal-para-text mb-0"
                                    htmlFor="missingLatLon"
                                    style={{ fontSize: '14px', color: '#666' }}
                                >
                                    Missing Lat/Lon
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success green-btn"
                                disabled={isSubmitting}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Searching...
                                    </>
                                ) : (
                                    'Search'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
            </div>
            <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                    <p className='modal-headding-text mb-0'>View:</p>
                    <p className='modal-para-text mb-0 ms-2 dealers-hover' role='button' onClick={() => setIsUserType('2')}>Dealers</p>
                    <p className='modal-para-text mb-0 with-divider dealers-hover' role='button' onClick={() => setIsUserType('1')}>Non Dealers</p>
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-dark black-btn-hover-white"
                        onClick={() => setIsOpenAddUser(true)}
                        style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
                    >Add New</button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={isTableData}
                showCheckbox={false}
                onEdit={handleEdit}
                onSelectAll={handleSelectAll}
                onSelectRow={handleSelectRow}
                selectedRows={selectedRows}
            />
            <div className="d-flex justify-content-end">
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={isTotalPage}
                    onPageChange={setCurrentPage}
                />
            </div>
            <UserAdd isOpen={isOpenAddUser} onClose={() => setIsOpenAddUser(false)} />
        </>
    );
};

export default UserContent;