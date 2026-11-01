import { useEffect, useState } from "react";
import ActionDropdown from "../components/ActionDropdown";
import DataTable from "../components/DataTable ";
import HelmetComponent from "../components/HelmetComponent";
import InnerPageTopBar from "../components/InnerPageTopBar";
import AddUser from "../components/Modal/AddUser";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../components/PaginationComponent";
import { actionButtonDealerUser, getAllDealerUser } from "../services/dealerUserApi";
import DealerUserDelete from "../components/Modal/UserList/dealerUserDelete";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";

const UserList = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isTableData, setIsTableData] = useState([]);
    const [isTotalPage, setIsTotalPage] = useState(0);
    const [isDeleteRow, setIsDeleteRow] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isRowData, setIsRowData] = useState(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    const columns = [
        {
            header: "FIRST NAME",
            field: "first_name",
            minWidth: "349px"
        },
        {
            header: "LAST NAME",
            field: "last_name",
            minWidth: "349px"
        },
        {
            header: "Email Address / USER",
            field: "email",
            minWidth: "349px"
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

    const closeModal = () => {
        setIsOpenDelete(false);
        setIsRowData(null);
    }

    const closeModalAdd = () => {
        setIsAddUserOpen(false);
        setIsRowData(null);
    }

    const handleEdit = (row) => {
        setIsAddUserOpen(true);
        setIsRowData(row);
    };

    const fetchGetAllFiles = async (page) => {
        try {
            const response = await getAllDealerUser(page, 10);
            setIsTotalPage(response?.data?.last_page);
            setIsTableData(response?.data?.data);
        } catch (error) {
            showErrorToast("An error occurred while fetching the users data. Please refresh and try again.");
        }
    }

    useEffect(() => {
        fetchGetAllFiles(currentPage);
    }, [currentPage]);


    const activeButton = async (type) => {
        try {
            setIsDeleteRow(true);
            const payload = {
                "ids": selectedRows,
                "action": "update_status",
                "status": type ? 1 : 0
            }
            const response = await actionButtonDealerUser(payload);
            showSuccessToast(response?.message);
            const newPage = isTableData.length === selectedRows.length ? currentPage - 1 : currentPage;
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            } else {
                fetchGetAllFiles(newPage);
            }
            closeModal();
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred while deleting the news data.")
        } finally {
            setIsDeleteRow(false);
        }
    }

    const actionDeleteButton = async () => {
        try {
          setIsDeleteRow(true);
          const payload = {
            "ids": selectedRows,
            "action": "delete"
          }
          const response = await actionButtonDealerUser(payload);
          showSuccessToast(response?.message);
          const newPage = isTableData.length === selectedRows.length ? currentPage - 1 : currentPage;
          if (newPage !== currentPage) {
            setCurrentPage(newPage);
          } else {
            fetchGetAllFiles(newPage);
          }
          setSelectedRows([]);
          closeModal();
        } catch (error) {
          showErrorToast(error?.response?.data?.message || "An error occurred while updating the user data.")
        } finally {
          setIsDeleteRow(false);
        }
      }

    return (
        <>
            <HelmetComponent
                title="Dashboard | SWI"
                description="This is the description for the Dashboard page."
                keywords="react, helmet, seo"
                canonicalUrl=""
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "My React App" }
                ]}
            />
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-12  homepage-left-div common-page-div" style={{ borderRadius: "12px" }}>
                            <InnerPageTopBar />
                            <div className="name-part" style={{ marginTop: "20px" }}>
                                <div className='d-flex justify-content-between'>
                                    <h2>Dealer Toolbox - User List</h2>
                                </div>
                                <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>
                                    <ActionDropdown deleteModal={setIsOpenDelete} activeButton={activeButton} selectedRows={selectedRows} />
                                </div>
                                <div>
                                    <span>
                                        <span className='active-dot-btn'></span>
                                        <span className='active-dot-btn-text'>Active</span>
                                    </span>
                                    <span className='ms-3'>
                                        <span className='in-Active-dot-btn'></span>
                                        <span className='active-dot-btn-text'>In-Active</span>
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-dark black-btn-hover-white"
                                        onClick={() => setIsAddUserOpen(true)}
                                        style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
                                    >Add New</button>
                                </div>
                            </div>

                            <DataTable
                                columns={columns}
                                data={isTableData}
                                showCheckbox={true}
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
                        </div>
                    </div>
                </div>
            </div>
            <DealerUserDelete isOpen={isOpenDelete} onClose={closeModal} actionDeleteButton ={actionDeleteButton} selectedRows={selectedRows} isData={isRowData} isDeleteRow={isDeleteRow} />
            <AddUser isOpen={isAddUserOpen} onClose={closeModalAdd} isRowData={isRowData} setIsRowData={setIsRowData} fetchGetAllFiles={fetchGetAllFiles} currentPage={currentPage} />
        </>
    )
};

export default UserList;