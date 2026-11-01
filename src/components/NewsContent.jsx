import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import ActionDropdown from './ActionDropdown';
import DataTable from './DataTable ';
import NewView from './Modal/News/NewsView';
import NewsDelete from './Modal/News/NewsDelete';
import NewsAddAndEdit from './Modal/News/NewsAddAndEdit';
import PaginationComponent from './PaginationComponent';
import { actionButtonNews, deleteNews, getAllNews } from '../services/newsApi';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HelmetComponent from './HelmetComponent';


const NewsContent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenNewView, setIsOpenNewView] = useState(false);
  const [isNewsData, setIsNewsData] = useState(null);
  const [isOpenNewsDelete, setIsOpenNewsDelete] = useState(false);
  const [isAddAndEditNews, setIsAddAndEditNews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableData, setIsTableData] = useState([]);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const [isDeleteRow, setIsDeleteRow] = useState(false);

  const columns = [
    {
      header: "Title",
      field: "title",
      minWidth: "304px"
    },
    {
      header: "Text",
      field: "message",
      minWidth: "304px"
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

  const handleView = (row) => {
    setIsNewsData(row);
    setIsOpenNewView(true);
  };

  const handleEdit = (row) => {
    setIsNewsData(row);
    setIsAddAndEditNews(true);
  };

  const handleDelete = (row) => {
    setIsNewsData(row);
    setIsOpenNewsDelete(true);
  };

  const closeNewsView = () => {
    setIsOpenNewView(false)
    setIsOpenNewsDelete(true);

  }


  const fetchGetAllNews = async (page) => {
    try {
      const response = await getAllNews(page);
      setIsTotalPage(response?.data?.last_page)
      setIsTableData(response?.data?.data);
    } catch (error) {
      showErrorToast("An error occurred while fetching the news data. Please refresh and try again.");
    }
  }

  useEffect(() => {
    fetchGetAllNews(currentPage);
  }, [currentPage]);

  const closeModal = () => {
    setIsOpenNewsDelete(false);
    setIsNewsData(null);
  }

  const deleteRow = async (id) => {
    try {
      setIsDeleteRow(true);
      const response = await deleteNews(id);
      showSuccessToast(response?.message);
      const newPage = isTableData.length === 1 ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        fetchGetAllNews(newPage);
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
      const response = await actionButtonNews(payload);
      showSuccessToast(response?.message);
      const newPage = isTableData.length === selectedRows.length ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        fetchGetAllNews(newPage);
      }
      setSelectedRows([]);
      closeModal();
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred while deleting the news data.")
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
      const response = await actionButtonNews(payload);
      showSuccessToast(response?.message);
      const newPage = isTableData.length === selectedRows.length ? currentPage - 1 : currentPage;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      } else {
        fetchGetAllNews(newPage);
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
        title="News | SWI"
        description="This is the description for the news page."
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
        <h2>News</h2>
        <p>View, edit or delete Messages. You can edit them by clicking on the pencil icon.</p>
        <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
        <div className='d-flex justify-content-between'>
          <div>
            <ActionDropdown deleteModal={setIsOpenNewsDelete} activeButton={activeButton} selectedRows={selectedRows}  />
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
              onClick={() => setIsAddAndEditNews(true)}
              style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
            >Add New</button>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={isTableData}
        showCheckbox={true}
        onView={handleView}
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
      <NewView isOpen={isOpenNewView} onClose={() => setIsOpenNewView(false)} setIsAddAndEditNews={setIsAddAndEditNews} isNewsData={isNewsData} closeNewsView={closeNewsView} />
      <NewsDelete isOpen={isOpenNewsDelete} onClose={closeModal} actionDeleteButton={actionDeleteButton} selectedRows={selectedRows} isNewsData={isNewsData} deleteRow={deleteRow} isDeleteRow={isDeleteRow} />
      <NewsAddAndEdit isOpen={isAddAndEditNews} onClose={() => setIsAddAndEditNews(false)} fetchGetAllNews={fetchGetAllNews} currentPage={currentPage} isNewsData={isNewsData} setIsNewsData={setIsNewsData} />
    </>
  );
};

export default NewsContent;