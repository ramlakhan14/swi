import React, { useEffect, useState } from "react";
import InnerPageTopBar from "./InnerPageTopBar";
import DataTable from "./DataTable ";
import TextInputWhiteBackground from "./TextInputWhiteBackground";
import { useForm } from "react-hook-form";
import UserAdd from "./Modal/UserAdd";
import PaginationComponent from "./PaginationComponent";
import { getAllUser } from "../services/userApi";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";
import { useLocation, useNavigate } from "react-router-dom";
import HelmetComponent from "./HelmetComponent";
import ActionApprovedDropdown from "./ActionApprovedDropdown";
import {
  getAllRebateForms,
  updateRebateStatus,
} from "../services/rebateApproval";
import RejectModal from "./Modal/RejectModal";
import { hideLoader, showLoader } from "../utils/loaderManager";

const RebateApprovalContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(
    location.state?.currentPage || 1,
  );
  const [isDealerId, setIsDealerId] = useState(
    location.state?.isDealerId || null,
  );
  const [isTypeOfRebate, setIsTypeOfRebate] = useState(
    location.state?.isTypeOfRebate || null,
  );
  const [selectedRows, setSelectedRows] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [isTableData, setIsTableData] = useState([]);
  const [isTotalPage, setIsTotalPage] = useState(0);
  // const [isDealerId, setIsDealerId] = useState(null);
  const [isEmail, setIsEmail] = useState(null);
  const [isCompanyName, setIsCompanyName] = useState(null);
  const [isMissingLat, setIsMissingLat] = useState(null);
  const [isUserType, setIsUserType] = useState(null);
  // const [isTypeOfRebate, setIsTypeOfRebate] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isFormId, setIsFormId] = useState(null);
  const [id, setId] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsDealerId(data?.dealer_id);
    setIsTypeOfRebate(data?.type_of_rebate);
    setIsFormId(data?.form_id);
  };

  const columns = [
    {
      header: "Form Id",
      field: "id",
      minWidth: "72px",
    },
    {
      header: "Dealer ID No.",
      field: "dealer_id",
      minWidth: "92px",
    },
    {
      header: "Type of rebate",
      field: "type_of_rebate",
      minWidth: "92px",
    },
    {
      header: "Manufacturer",
      field: "manufacturer_id",
      minWidth: "141px",
    },
    {
      header: "status",
      field: "status",
      minWidth: "120px",
    },
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(isTableData?.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleEdit = (row) => {
    navigate(`/rebate-approval/${row?.id}`, {
      state: { currentPage, isDealerId, isTypeOfRebate },
    });
  };

  const fetchGetAllFiles = async (
    page,
    isDealerId,
    isTypeOfRebate,
    isFormId,
  ) => {
    try {
      const response = await getAllRebateForms(
        page,
        10,
        isDealerId,
        isTypeOfRebate,
        isFormId,
      );
      setIsTableData(response?.data);
      setIsTotalPage(response?.pagination?.last_page);
    } catch (error) {
      showErrorToast(
        "An error occurred while fetching the user data. Please refresh and try again.",
      );
    }
  };

  useEffect(() => {
    fetchGetAllFiles(currentPage, isDealerId, isTypeOfRebate, isFormId);
  }, [currentPage, isDealerId, isTypeOfRebate, isFormId]);

  const handleActionApi = async (type, rows) => {
    if (type === "approved") {
      try {
        showLoader();
        const payload = {
          status: 1,
          ids: rows,
        };
        const response = await updateRebateStatus(payload);
        showSuccessToast(response?.message || "Data is approved successfully");
        // const updated = response?.updated?.count || 0;
        // const updatedIds = response?.updated?.ids || [];
        // const notUpdatedIds =
        //   response?.not_updated?.map((item) => item.id) || [];
        // showSuccessToast(
        //   `${updated} updated successfully (IDs: ${updatedIds.join(", ")})${
        //     notUpdatedIds.length
        //       ? `, already status updated (IDs: ${notUpdatedIds.join(", ")})`
        //       : ""
        //   }`,
        // );
        setSelectedRows([]); // Clear selected rows after action
        fetchGetAllFiles(currentPage, isDealerId, isTypeOfRebate);
      } catch (error) {
        if (error?.response?.data?.responseCode === 422) {
          return showErrorToast(
            Object.values(error?.response?.data?.messages)[0][0] ||
              "Failed to reject dealer",
          );
        }
        showErrorToast(error?.response?.data?.message || "An error occurred while approving the data. Please try again.");
        // showErrorToast(
        //   `${error?.response?.data?.message || "An error occurred while approving the dealer. Please try again."}${
        //     error?.response?.data?.not_updated?.length
        //       ? ` (IDs: ${error?.response?.data?.not_updated?.map((item) => item.id).join(", ")})`
        //       : ""
        //   }`,
        // );
        setSelectedRows([]);
      } finally {
        hideLoader();
      }
    } else {
      setId(rows); // Set the ID of the first selected row
      setShowRejectModal(true);
    }
  };

  const handleChange = () => {
    fetchGetAllFiles(currentPage, isDealerId, isTypeOfRebate);
    setSelectedRows([]);
  };

  return (
    <>
      <HelmetComponent
        title="Rebate Approval | SWI"
        description="This is the description for the rebate approval page."
        keywords="react, helmet, seo"
        canonicalUrl=""
        customMeta={[
          { name: "robots", content: "index, follow" },
          { name: "author", content: "Ritik Jain" },
          { property: "og:title", content: "My React App" },
        ]}
      />
      <InnerPageTopBar />
      <div className="name-part" style={{ marginTop: "20px" }}>
        <h2>Rebate Approval</h2>
        <div style={{ marginTop: "20px" }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div
              className="d-md-flex"
              style={{ gap: "20px", alignItems: "center" }}
            >
              <TextInputWhiteBackground
                name="form_id"
                type="text"
                placeholder="Form Id"
                label="Form Id"
                register={register}
                containerStyle={{ flex: 1 }}
              />
              <TextInputWhiteBackground
                name="dealer_id"
                type="text"
                placeholder="Dealer ID No."
                label="Dealer ID No."
                register={register}
                containerStyle={{ flex: 1 }}
              />
              <TextInputWhiteBackground
                name="type_of_rebate"
                type="text"
                placeholder="Type of rebate"
                label="Type of rebate"
                register={register}
                containerStyle={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-success green-btn"
                disabled={isSubmitting}
                style={{
                  padding: "12px 24px",
                  fontSize: "12px",
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                }}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>
        </div>
        <hr
          style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }}
        />
      </div>
      <div className="d-flex justify-content-between">
        <ActionApprovedDropdown
          activeButton={setIsUserType}
          selectedRows={selectedRows}
          onApiCall={handleActionApi}
        />
      </div>
      <DataTable
        columns={columns}
        data={isTableData}
        showCheckbox={true}
        onView={handleEdit}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        selectedRows={selectedRows}
        actionMinWidth={false}
      />
      <div className="d-flex justify-content-end">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={isTotalPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        id={id}
        onApiCall={handleChange}
      />
    </>
  );
};

export default RebateApprovalContent;
