import { useForm } from "react-hook-form";
import { showErrorToast, showSuccessToast } from "../../utils/ToastUtils";
import { useState } from "react";
import TextAreaInput from "../TextAreaInput";
import { updateRebateStatus } from "../../services/rebateApproval";
import { hideLoader, showLoader } from "../../utils/loaderManager";

const RejectModal = ({ isOpen, onClose, id, onApiCall }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      otherReasonText: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      showLoader();
      const payload = {
        status: 2,
        ids: id,
        reason: data.otherReasonText?.trim(),
      };
      const response = await updateRebateStatus(payload);
      //   showSuccessToast(response?.message || "Dealer rejected successfully");
      //   const updated = response?.updated?.count || 0;
      //   const updatedIds = response?.updated?.ids || [];
      //   const notUpdatedIds = response?.not_updated?.map((item) => item.id) || [];
      //   showSuccessToast(
      //     `${updated} updated successfully (IDs: ${updatedIds.join(", ")})${
      //       notUpdatedIds.length
      //         ? `, already status updated (IDs: ${notUpdatedIds.join(", ")})`
      //         : ""
      //     }`,
      //   );
      showErrorToast(response?.message || "Data is rejected successfully");
      onClose();
      reset({
        otherReasonText: "",
      });
      onApiCall(); // Notify parent to refresh data
    } catch (error) {
      if (error?.response?.data?.responseCode === 422) {
        return showErrorToast(
          Object.values(error?.response?.data?.messages)[0][0] ||
            "Failed to reject dealer",
        );
      }
      showErrorToast(
        error?.response?.data?.message ||
          "An error occurred while rejecting the dealer. Please try again.",
      );
      //   showErrorToast(
      //     `${error?.response?.data?.message || "An error occurred while approving the dealer. Please try again."}${
      //       error?.response?.data?.not_updated?.length
      //         ? ` (IDs: ${error?.response?.data?.not_updated?.map((item) => item.id).join(", ")})`
      //         : ""
      //     }`,
      //   );
      onClose();
      reset({
        otherReasonText: "",
      });
      onApiCall();
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block modal-md" tabIndex={-1} role="dialog">
      <div
        className="modal-dialog"
        tabIndex="-1"
        role="dialog"
        style={{ paddingRight: "17px" }}
      >
        <div className="modal-content add-news-modal">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title modal-headding mb-0">REJECT DEALER?</h5>
            <button
              type="button"
              className="btn-close modal-close-btn"
              onClick={() => {
                onClose();
                reset({
                  selectedReasons: [],
                  otherReasonText: "",
                });
              }}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="modal-body">
              <p
                className=""
                style={{
                  fontSize: "14px",
                  color: "#52525C",
                  marginBottom: "24px",
                }}
              >
                Why do you want to reject?
              </p>
              <TextAreaInput
                name="otherReasonText"
                placeholder="Please specify your reason..."
                label="Mention the reason"
                register={register}
                error={errors.otherReasonText}
                validation={{
                  minLength: {
                    value: 3,
                    message: "Reason must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 500,
                    message: "Reason cannot be more than 500 characters",
                  },
                }}
                containerStyle={{ paddingBottom: "32px", marginTop: "20px" }}
                rows={4}
              />

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-dark black-btn-hover-white"
                  style={{ fontSize: "12px", fontWeight: "700" }}
                  onClick={() => {
                    onClose();
                    reset({
                      selectedReasons: [],
                      otherReasonText: "",
                    });
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success green-btn"
                  disabled={isSubmitting || !watch("otherReasonText")?.trim()}
                  style={{
                    padding: "8px 16px",
                    marginLeft: "12px",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
