import React, { useEffect, useRef, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { useForm } from 'react-hook-form';
import FileInputWhiteBackground from './FileInputWhiteBackground';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { adminRebateBulkUpload, createdealerBulkUpload } from '../services/uploadDealerListApi';
import HelmetComponent from './HelmetComponent';


const VerificationFileUploadContent = () => {
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: 'onChange'
  });


  const onSubmit = async (data) => {
    const payload = new FormData();
    if (data.myFile && data.myFile.length > 0) {
      payload.append("file", data.myFile[0]);
    }
    try {
      const response = await adminRebateBulkUpload(payload);
      showSuccessToast(response?.message);

      reset({
        replace_duplicates: false,
        delete_not_in_file: false,
        myFile: null
      });
      fileInputRef.current?.resetFileName();
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "An error occurred");
    }
  };


  return (
    <>
      <HelmetComponent
        title="Rebate Verification file upload | SWI"
        description="This is the description for the rebate verification file upload page."
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
        <h2>Rebate Verification file upload</h2>
        <p>Browse for the .CSV file to upload, then click submit.</p>
        <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <div>
              <div className='d-flex align-items-center mb-3'>
                <p className='modal-headding-text mb-0' style={{ marginRight: "38px" }}>Sales/Verification File Upload:</p>
                <FileInputWhiteBackground
                  name="myFile"
                  ref={fileInputRef}
                  label="Upload Document"
                  register={register}
                  error={errors.myFile}
                  accept=".pdf,.csv,.doc,.docx,.xlsx"
                  validation={{
                    required: "Please select a file",
                    validate: {
                      fileSize: (files) =>
                        !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
                      fileType: (files) =>
                        !files[0] ||
                        [
                          "application/pdf",
                          "text/csv",
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                          "application/vnd.ms-excel", // .xls
                          "application/msword", // .doc
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                        ].includes(files[0].type) ||
                        "Only PDF, CSV, Excel, or Word files are allowed",
                    },
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success green-btn"
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
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
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>

    </>
  );
};

export default VerificationFileUploadContent;