import React, { use, useEffect, useState } from "react";
import HelmetComponent from "../components/HelmetComponent";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InnerPageTopBar from "../components/InnerPageTopBar";
import RejectModal from "../components/Modal/RejectModal";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";
import { getRebateDetails, updateRebateStatus } from "../services/rebateApproval";
import { hideLoader, showLoader } from "../utils/loaderManager";

const RebateApprovalTablePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const { currentPage, isDealerId, isTypeOfRebate } = location.state || {};
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({})
    const rowsData = formData?.dealer_rows;
    useEffect(() => {
        const fetchFormData = async (id) => {
            try {
                const response = await getRebateDetails(id);
                setFormData(response);
            } catch (error) {
                showErrorToast(error?.response?.data?.message || "Failed to fetch rebate form details. Please refresh and try again.");
            }
        }

        if (id) {
            fetchFormData(id);
        }

    }, [id]);


    const handleChange = () => {
        navigate("/rebate-approval", {
            state: { currentPage, isDealerId, isTypeOfRebate }
        });
    };

    const handleActionApproved = async () => {
        try {
            setIsSubmitting(true);
            showLoader();
            const payload = {
                status: 1,
                ids: [Number(id)]
            };
            const response = await updateRebateStatus(payload);
            showSuccessToast(response?.message || "Dealer approved successfully");
            handleChange();
        } catch (error) {
            showErrorToast(error?.response?.data?.message || "An error occurred while approving the dealer. Please try again.");
        } finally {
            setIsSubmitting(false);
            hideLoader();
        }
    };

    const fetchGetAllFiles = async (fileUrl) => {
        try {
            const link = document.createElement("a");
            link.href = `${fileUrl}`;
            link.download = `rebate_data_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.target = "_blank";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            showErrorToast("Failed to download file. Please refresh and try again.");
        }
    };

    return (
        <>
            <HelmetComponent
                title="Rebate Form Approval | SWI"
                description="Review rebate form details"
                keywords="rebate, approval, swi"
                canonicalUrl=""
            />
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col-12 homepage-left-div common-page-div" style={{ borderRadius: "12px" }}>
                            <InnerPageTopBar path="/rebate-approval" />
                            <div className="name-part d-flex justify-content-between" style={{ marginTop: "20px" }}>
                                <div className="d-flex align-items-center gap-3">
                                    <h2 className="mb-0">Form ID# {formData?.dealer_rebate_form?.id}</h2>
                                    <div>
                                        <span style={{
                                            display: "inline-block",
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            marginRight: "6px",
                                            backgroundColor:
                                                formData?.dealer_rebate_form?.status === "1" ? "#12BC4E" :
                                                    formData?.dealer_rebate_form?.status === "0" ? "#FFCC00" :
                                                        formData?.dealer_rebate_form?.status === "2" ? "#FF4245" :
                                                            "#9ca3af",
                                            verticalAlign: "middle",
                                        }}></span>
                                        <span className="rebate-approval-status">
                                            {formData?.dealer_rebate_form?.status === "1"
                                                ? "Approved"
                                                : formData?.dealer_rebate_form?.status === "2"
                                                    ? "Rejected"
                                                    : formData?.dealer_rebate_form?.status === "0"
                                                        ? "Pending"
                                                        : "-"}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className='d-md-flex' style={{ gap: '12px', alignItems: "center" }}>
                                        <button
                                            type="button"
                                            disabled={isSubmitting || formData?.dealer_rebate_form?.status !== "0"}
                                            className="btn btn-dark black-btn-hover-white"
                                            style={{ padding: "8px 16px", fontSize: "12px", fontWeight: "700", whiteSpace: 'nowrap' }}
                                            onClick={() => setShowRejectModal(true)}
                                        >
                                            Reject
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-success green-btn"
                                            disabled={isSubmitting || formData?.dealer_rebate_form?.status !== "0"}
                                            onClick={handleActionApproved}
                                            style={{ padding: "8px 16px", fontSize: "12px", fontWeight: "700", whiteSpace: 'nowrap' }}
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />

                            <div style={{ display: "flex", gap: "16px" }}>

                                {/* LEFT CARD */}
                                <div style={{
                                    flex: 1,
                                    border: "1px solid #E4E4E7",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    height: "fit-content"
                                }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <tbody className="table-details-top">
                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Dealer ID No.</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.dealer_id || "-"}</td>
                                            </tr>

                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Type Of Rebate</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.type_of_rebate || "-"}</td>
                                            </tr>

                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Manufacturer</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.manufacturer_id || "-"}</td>
                                            </tr>

                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Dealer Name</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.dealer_name || "-"}</td>
                                            </tr>

                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Dealer Signature</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.dealer_signature || "-"}</td>
                                            </tr>

                                            <tr>
                                                <td className="table-details-label">Upload Invoice</td>
                                                <td className="table-details-value">
                                                    {formData?.dealer_rebate_form?.invoice_file ? (
                                                        <a href="#" style={{ color: "#11843A" }} onClick={() => fetchGetAllFiles(formData?.dealer_rebate_form?.invoice_file)}>invoice.pdf</a>
                                                    ) : "-"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* RIGHT CARD */}
                                <div style={{
                                    flex: 1,
                                    border: "1px solid #E4E4E7",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    height: "fit-content"
                                }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <tbody>
                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Fleet Program Customer Name</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.dealer_customer_name || "-"}</td>
                                            </tr>
                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Date Of Sale</td>
                                                <td className="table-details-value">
                                                    {
                                                        formData?.dealer_rebate_form?.date_of_sale
                                                            ? formData.dealer_rebate_form.date_of_sale
                                                                .split("-")
                                                                .slice(1)
                                                                .concat(formData.dealer_rebate_form.date_of_sale.split("-")[0])
                                                                .join("-")
                                                            : "-"
                                                    }
                                                </td>
                                            </tr>

                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Invoice No.</td>
                                                <td className="table-details-value">{formData?.dealer_rebate_form?.invoice_number || "-"}</td>
                                            </tr>

                                            <tr style={{ borderBottom: "1px solid #E4E4E7" }}>
                                                <td className="table-details-label">Total Units</td>
                                                <td className="table-details-value">{rowsData?.length}</td>
                                            </tr>

                                            <tr>
                                                <td className="table-details-label">Total</td>
                                                <td className="table-details-value">${formData?.dealer_rebate_form?.total || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            {/* Product Details Cards - Read Only */}
                            <div style={{ marginTop: "20px" }}>
                                {/* <h4 className="mb-3">Product Details</h4> */}
                                {rowsData?.map((row, index) => (
                                    <div
                                        key={index}
                                        style={{ border: "1px solid #E4E4E7", borderRadius: "12px", marginBottom: "16px", backgroundColor: "#fff", overflow: "hidden" }}
                                    >
                                        <div style={{ backgroundColor: "#F4F4F5", padding: "12px 20px", borderBottom: "1px solid #E4E4E7" }}>
                                            <h5 className="mb-0" style={{ fontWeight: "600", fontSize: "12px", color: "#18181BP" }}>Unit {index + 1}</h5>
                                        </div>
                                        <div style={{ padding: "20px" }}>
                                            <div className="row rebate-details-rows">
                                                <div className="col-md-3 col-sm-6">
                                                    <label>QTY</label>
                                                    <div>
                                                        {row.qty ?? "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Model</label>
                                                    <div>
                                                        {row.model_number || "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Serial No.</label>
                                                    <div>
                                                        {row.serial_number || "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Model-Serial-Dealer</label>
                                                    <div>
                                                        {row.model_serial || "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Part No.</label>
                                                    <div>
                                                        {row.part_number || "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Dealer Customer Name</label>
                                                    <div>
                                                        {row.dealer_custom || "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Date Unit Sold</label>
                                                    <div>
                                                        {row.date_unit_sold ? new Date(row.date_unit_sold).toLocaleDateString() : "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Points</label>
                                                    <div>
                                                        {row.points ?? "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>MSRP</label>
                                                    <div>
                                                        {row.msrp != null ? `$${parseFloat(row.msrp).toFixed(2)}` : "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Sell Price/Bid Price</label>
                                                    <div>
                                                        {row.sell_price_bid_price != null ? `$${parseFloat(row.sell_price_bid_price).toFixed(2)}` : "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Dealer Actual Cost</label>
                                                    <div>
                                                        {row.dealer_actual_cost != null ? `$${parseFloat(row.dealer_actual_cost).toFixed(2)}` : "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Discount $</label>
                                                    <div>
                                                        {row.discount_of_dollar != null ? `$${parseFloat(row.discount_of_dollar).toFixed(2)}` : "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Discount %</label>
                                                    <div>
                                                        {row.discount_of_percentage != null ? `${row.discount_of_percentage}%` : "-"}
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-6">
                                                    <label>Dealer Rebate $</label>
                                                    <div>
                                                        {row.dealer_rebate_dollar != null ? `$${parseFloat(row.dealer_rebate_dollar).toFixed(2)}` : "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <RejectModal
                    isOpen={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                    id={[Number(id)]}
                    onApiCall={handleChange}
                />
            </div>
        </>
    );
};

export default RebateApprovalTablePage;