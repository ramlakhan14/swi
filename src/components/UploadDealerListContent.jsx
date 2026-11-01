import React, { useEffect, useRef, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import { useForm } from 'react-hook-form';
import FileInputWhiteBackground from './FileInputWhiteBackground';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { createdealerBulkUpload } from '../services/uploadDealerListApi';
import HelmetComponent from './HelmetComponent';


const UploadDealerListContent = () => {
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
    payload.append("replace_duplicates", data?.replace_duplicates ? 1 : 0);
    payload.append("delete_not_in_file", data?.delete_not_in_file ? 1 : 0);
    if (data.myFile && data.myFile.length > 0) {
      payload.append("file", data.myFile[0]);
    }
    try {
      const response = await createdealerBulkUpload(payload);
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
        title="Upload Dealer List | SWI"
        description="This is the description for the upload dealer list page."
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
        <h2>Upload Dealer List</h2>
        <p>Browse for the .CSV file to upload, then click submit.</p>
        <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <div>
              <div className='d-flex align-items-center mb-3 align-items-start'>
                <p className='modal-headding-text mb-0' style={{ marginRight: "38px" }}>Upload Dealer List:</p>
                <FileInputWhiteBackground
                  name="myFile"
                  ref={fileInputRef}
                  label="Upload Document"
                  register={register}
                  error={errors.myFile}
                  accept=".csv,.xlsx"
                  validation={{
                    required: "Please select a file",
                    validate: {
                      fileSize: (files) =>
                        !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
                      fileType: (files) =>
                        !files[0] ||
                        [
                          // "application/pdf",
                          "text/csv",
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                          "application/vnd.ms-excel", // .xls
                          "application/msword", // .doc
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                        ].includes(files[0].type) ||
                        "Only CSV, Excel, or Word files are allowed",
                    },
                  }}
                />
              </div>
            </div>
            <div className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="replaceDuplicates"
                {...register("replace_duplicates")}
                className='form-check-input mt-0'
              />
              <label
                className="form-check-label ms-2 modal-para-text mb-0"
                htmlFor="replaceDuplicates"
                style={{ fontSize: '14px', color: '#666' }}
              >
                Replace duplicates with dealers imported from file
              </label>
            </div>


            <div className='mb-2' style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="existing"
                {...register("delete_not_in_file")}
                className='form-check-input mt-0'
              />
              <label
                className="form-check-label ms-2 modal-para-text mb-0"
                htmlFor="existing"
                style={{ fontSize: '14px', color: '#666' }}
              >
                DELETE existing dealers not referenced in file
              </label>
            </div>
            <p className='mb-3 red-text'>
              Be careful when checking this box. All dealers that do not exist in the uploaded data file will be permanently deleted.
            </p>

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

export default UploadDealerListContent;