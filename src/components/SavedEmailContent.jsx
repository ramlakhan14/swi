import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import ActionDropdown from './ActionDropdown';
import DataTable from './DataTable ';
import PaginationComponent from './PaginationComponent';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { actionButtonEmail, deleteEmail, getAllSavedEmail } from '../services/savedEmailApi';
import EmailDelete from './Modal/SavedEmail/EmailDelete';
import { useNavigate } from 'react-router-dom';
import HelmetComponent from './HelmetComponent';


const SavedEmailContent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();
  const [isData, setIsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableData, setIsTableData] = useState([]);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isDeleteRow, setIsDeleteRow] = useState(false);

  const columns = [
    {
      header: "Subject",
      field: "subject",
      minWidth: "216px"
    },
    // {
    //   header: "Message",
    //   field: "messages",
    //   minWidth: "216px"
    // },
    {
      header: "Last Modified",
      field: "updated_at",
      minWidth: "216px"
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
    navigate(`/email-dealer/${row?.id}`);
  };

  const handleDelete = (row) => {
    setIsData(row);
    setIsOpenDelete(true);
  };



  const fetchGetAllFiles = async (page) => {
    try {
      const response = await getAllSavedEmail("save", page);
      setIsTotalPage(response?.data?.last_page);
      setIsTableData(response?.data?.data);
    } catch (error) {
      showErrorToast("An error occurred while fetching the email data. Please refresh and try again.");
    }
  }

  useEffect(() => {
    fetchGetAllFiles(currentPage);
  }, [currentPage]);


  const closeModal = () => {
    setIsOpenDelete(false);
    setIsData(null);
  }

  const deleteRow = async (id) => {
    try {
      setIsDeleteRow(true);
      const response = await deleteEmail(id);
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
      const response = await actionButtonEmail(payload);
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
      showErrorToast(error?.response?.data?.message || "An error occurred while updating the email data.")
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
      const response = await actionButtonEmail(payload);
      showSuccessToast(response?.message);
      const newPage = isTableData.length === selectedRows.length ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        fetchGetAllFiles(newPage);
      }
      closeModal();
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting the email data.")
    } finally {
      setIsDeleteRow(false);
    }
  }
  return (
    <>
      <HelmetComponent
        title="Saved E-Mail | SWI"
        description="This is the description for the saved e-mail page."
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
        <h2>Saved E-Mail</h2>
        <p>Delete or Edit Saved E-mail</p>
        <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
        <div className='d-flex justify-content-between'>
          <div>
            <ActionDropdown deleteModal={setIsOpenDelete} activeButton={activeButton} selectedRows={selectedRows} />
          </div>
          <div>
            <button
              type="button"
              className="btn btn-dark black-btn-hover-white"
              onClick={() => navigate(`/email-dealer`)}
              style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
            >New Email</button>
          </div>
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
      <EmailDelete isOpen={isOpenDelete} onClose={closeModal} actionDeleteButton={actionDeleteButton} selectedRows={selectedRows} isFileData={isData} deleteRow={deleteRow} isDeleteRow={isDeleteRow} />
    </>
  );
};

export default SavedEmailContent;