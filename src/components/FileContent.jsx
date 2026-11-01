import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import DataTable from './DataTable ';
import ActionDropdown from './ActionDropdown';
import FileAddAndUpdate from './Modal/File/FileAddAndUpdate';
import PaginationComponent from './PaginationComponent';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { actionButtonFile, deleteFile, getAllFiles } from '../services/fileApis';
import FileDelete from './Modal/File/FileDelete';
import HelmetComponent from './HelmetComponent';

const FileContent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isFileData, setIsFileData] = useState(null);
  const [isOpenFileDelete, setIsOpenFileDelete] = useState(false);
  const [isAddAndUpdateFile, setIsAddAndUpdateFile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableData, setIsTableData] = useState([]);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const [isDeleteRow, setIsDeleteRow] = useState(false);

  const columns = [
    {
      header: "Title",
      field: "title",
      minWidth: "216px"
    },
    {
      header: "Description",
      field: "description",
      minWidth: "216px"
    },
    {
      header: "Category",
      field: "category_name",
      minWidth: "216px"
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

  const fetchGetAllFiles = async (page) => {
    try {
      const response = await getAllFiles(page);
      setIsTotalPage(response?.data?.last_page);
      setIsTableData(response?.data?.data);
    } catch (error) {
      showErrorToast("An error occurred while fetching the news data. Please refresh and try again.");
    }
  }

  useEffect(() => {
    fetchGetAllFiles(currentPage);
  }, [currentPage]);

  const handleEdit = (row) => {
    setIsFileData(row);
    setIsAddAndUpdateFile(true);
  };

  const handleDelete = (row) => {
    setIsFileData(row);
    setIsOpenFileDelete(true);
  };

  const closeModal = () => {
    setIsOpenFileDelete(false);
    setIsFileData(null);
  }

  const deleteRow = async (id) => {    
    try {
      setIsDeleteRow(true);
      const response = await deleteFile(id);
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
      const response = await actionButtonFile(payload);
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


  const activeButton = async(type) =>{    
     try {
        setIsDeleteRow(true);
        const payload = {
          "ids": selectedRows,
          "action": "update_status",
          "status": type ? 1 : 0
        }
        const response = await actionButtonFile(payload);
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
        title="File | SWI"
        description="This is the description for the File page."
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
        <h2>File Edit Center</h2>
        <p>View, edit or delete Files. You can edit them by clicking on the pencil icon.</p>
        <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
        <div className='d-flex justify-content-between'>
          <div>
            <ActionDropdown deleteModal={setIsOpenFileDelete} activeButton={activeButton} selectedRows={selectedRows} />
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
              onClick={() => setIsAddAndUpdateFile(true)}
              style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
            >Add New</button>
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
      <FileDelete isOpen={isOpenFileDelete} onClose={closeModal} actionDeleteButton={actionDeleteButton} selectedRows={selectedRows} isFileData={isFileData} deleteRow={deleteRow} isDeleteRow={isDeleteRow} />
      <FileAddAndUpdate isOpen={isAddAndUpdateFile} onClose={() => setIsAddAndUpdateFile(false)} isFileData={isFileData} setIsFileData={setIsFileData} fetchGetAllFiles={fetchGetAllFiles} currentPage={currentPage} />
    </>
  );
};

export default FileContent;