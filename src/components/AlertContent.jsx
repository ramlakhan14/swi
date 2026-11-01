import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import ActionDropdown from './ActionDropdown';
import DataTable from './DataTable ';
import PaginationComponent from './PaginationComponent';
import { actionButtonAlert, deleteAlert, getAllAlerts } from '../services/alertApi';
import AlertDelete from './Modal/Alert/AlertDelete';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import AddAlert from './Modal/Alert/AddAlert';
import HelmetComponent from './HelmetComponent';


const AlertContent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAlertData, setIsAlertData] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isAddAlert, setIsAddAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableData, setIsTableData] = useState([]);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const [isDeleteRow, setIsDeleteRow] = useState(false);

  const columns = [
    {
      header: "Title",
      field: "alert_name",
      minWidth: "648px"
    }
  ];



  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(isTableData.map(row => row.id));
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
    setIsAlertData(row);
    setIsAddAlert(true);
  };

  const handleDelete = (row) => {
    setIsAlertData(row);
    setIsOpenDelete(true);
  };

 

  const fetchGetAllFiles = async (page) => {
    try {
      const response = await getAllAlerts(page);
      setIsTotalPage(response?.data?.last_page);
      setIsTableData(response?.data?.data);
    } catch (error) {
      showErrorToast("An error occurred while fetching the news data. Please refresh and try again.");
    }
  }

  useEffect(() => {
    fetchGetAllFiles(currentPage);
  }, [currentPage]);

  const closeModal = () => {
    setIsOpenDelete(false);
    setIsAlertData(null);
  }

  const deleteRow = async (id) => {
    try {
      setIsDeleteRow(true);
      const response = await deleteAlert(id);
      showSuccessToast(response?.message);
      const newPage = isTableData.length === 1 ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        fetchGetAllFiles(newPage);
      }
      closeModal();
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting the news data.");
    }
    finally {
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
      const response = await actionButtonAlert(payload);
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
      showErrorToast(error?.response?.data?.message || "An error occurred while updating the file data.")
    } finally {
      setIsDeleteRow(false);
    }
  }


  const activeButton = async (type) => {
    try {
      setIsDeleteRow(true);
      const payload = {
        "ids": selectedRows,
        "action": "update_status",
        "status": type ? 1 : 0
      }
      const response = await actionButtonAlert(payload);
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


  return (
    <>
     <HelmetComponent
        title="Alerts | SWI"
        description="This is the description for the alerts page."
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
        <h2>Alerts</h2>
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
            onClick={() => setIsAddAlert(true)}
            style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
          >Add New</button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={isTableData}
        showCheckbox={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
      <AddAlert isOpen={isAddAlert} onClose={() => setIsAddAlert(false)} isAlertData={isAlertData} fetchGetAllFiles={fetchGetAllFiles} currentPage={currentPage} />
      <AlertDelete isOpen={isOpenDelete} onClose={closeModal} actionDeleteButton={actionDeleteButton} selectedRows={selectedRows} isFileData={isAlertData} deleteRow={deleteRow} isDeleteRow={isDeleteRow} />
    </>
  );
};

export default AlertContent;