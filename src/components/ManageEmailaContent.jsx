import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import DataTable from './DataTable ';
import PaginationComponent from './PaginationComponent';
import { getAllSavedEmail } from '../services/savedEmailApi';
import { useNavigate } from 'react-router-dom';
import HelmetComponent from './HelmetComponent';


const ManageEmailaContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableData, setIsTableData] = useState([]);
  const [isTotalPage, setIsTotalPage] = useState(0);
  const navigate = useNavigate();
  const columns = [
    {
      header: "Subject",
      field: "subject",
      minWidth: "202px"
    },
    {
      header: "Message",
      field: "messages",
      minWidth: "202px",
    },
    {
      header: "Last Modified",
      field: "updated_at",
      minWidth: "202px",
    },
    {
      header: "Sent",
      field: "sent_count",
      minWidth: "80px",
    }
  ];

  const handleEdit = (row) => {
    navigate(`/email-dealer/${row?.id}`);
  };

  const fetchGetAllFiles = async (page) => {
    try {
      const response = await getAllSavedEmail("sent",page);
      setIsTotalPage(response?.data?.last_page);
      setIsTableData(response?.data?.data);
    } catch (error) {
      showErrorToast("An error occurred while fetching the email data. Please refresh and try again.");
    }
  }

  useEffect(() => {
    fetchGetAllFiles(currentPage);
  }, [currentPage]);

  return (
    <>
     <HelmetComponent
        title="Manage E-Mail | SWI"
        description="This is the description for the manage e-mail page."
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
        <h2>Manage E-Mail</h2>
        <p>Reuse or Edit Sent E-mail</p>
        <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
        <div className='d-flex justify-content-end'>
          <button
            type="button"
            className="btn btn-dark black-btn-hover-white"
            onClick={() => navigate(`/email-dealer`)}
            style={{ fontSize: "12px", fontWeight: "700", marginLeft: "32px" }}
          >New Email</button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={isTableData}
        showCheckbox={false}
        onEdit={handleEdit}
        onSelectAll={null}
        onSelectRow={null}
        selectedRows={null}
      />

      <div className="d-flex justify-content-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={isTotalPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ManageEmailaContent;