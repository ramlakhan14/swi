import React from 'react';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import FileInputWhiteBackground from '../FileInputWhiteBackground';
import CompanyLogoUpload from '../CompanyLogoUpload';

const CompanyInformationTab = ({
  register,
  errors,
  existingFiles,
  onFileDelete,
}) => (
  <div className="row" id="company-information">
    <div className="row">
      <div className="col-9">
        <TextInputWhiteBackground
          name="product_name"
          type="text"
          placeholder="Enter your company name here"
          label="Company Name"
          register={register}
          error={errors.product_name}
          validation={{
            required: 'Company Name is required',
            minLength: {
              value: 3,
              message: 'Company Name must be at least 3 characters long',
            },
            maxLength: {
              value: 255,
              message: 'Company Name cannot be more than 255 characters',
            },
          }}
          containerStyle={{ paddingBottom: '20px' }}
        />
        <div className="row align-items-start" style={{ marginBottom: '20px' }}>
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              Current Price List:
            </p>
          </div>
          <div
            className="col-12 col-sm-auto mb-0"
            style={{ width: 'calc(100% - 180px)' }}
          >
            {existingFiles?.current_price_list?.url && (
              <div
                style={{
                  marginBottom: '8px',
                  fontSize: '13px',
                  color: '#666',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div>
                    Current file:{' '}
                    <a
                      href={existingFiles?.current_price_list?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'Download the file'}
                    </a>
                  </div>
                  <span style={{ fontSize: '11px', color: '#888' }}>
                    Upload a new file to replace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFileDelete('current_price_list')}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            <FileInputWhiteBackground
              name="current_price_list"
              label="Upload Document"
              register={register}
              error={errors.current_price_list}
              accept=".csv,.xlsx,.pdf"
              validation={{
                // required: !existingFiles?.current_price_list ? "Please select a file" : false,
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    files[0].size <= 100 * 1024 * 1024 ||
                    'File size must be less than 100MB',
                  fileType: (files) =>
                    !files[0] ||
                    [
                      'application/pdf',
                      'text/csv',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ].includes(files[0].type) ||
                    'Only PDF, CSV, Excel, or Word files are allowed',
                },
              }}
            />
          </div>
        </div>
        <div className="row align-items-start" style={{ marginBottom: '20px' }}>
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              Current Dealer <br />
              Program:
            </p>
          </div>
          <div
            className="col-12 col-sm-auto mb-0"
            style={{ width: 'calc(100% - 180px)' }}
          >
            {existingFiles?.dealer_program_1?.url && (
              <div
                style={{
                  marginBottom: '8px',
                  fontSize: '13px',
                  color: '#666',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div>
                    Current file:{' '}
                    <a
                      href={existingFiles?.dealer_program_1?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'Download the file'}
                    </a>
                  </div>
                  <span style={{ fontSize: '11px', color: '#888' }}>
                    Upload a new file to replace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFileDelete('dealer_program_1')}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            <FileInputWhiteBackground
              name="dealer_program_1"
              label="Upload Document"
              register={register}
              error={errors.dealer_program_1}
              accept=".csv,.xlsx,.pdf"
              validation={{
                // required: !existingFiles?.dealer_program_1 ? "Please select a file" : false,
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    files[0].size <= 100 * 1024 * 1024 ||
                    'File size must be less than 100MB',
                  fileType: (files) =>
                    !files[0] ||
                    [
                      'application/pdf',
                      'text/csv',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ].includes(files[0].type) ||
                    'Only PDF, CSV, Excel, or Word files are allowed',
                },
              }}
            />
          </div>
        </div>
        <div className="row align-items-start" style={{ marginBottom: '20px' }}>
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              Dealer Program 2:
            </p>
          </div>
          <div
            className="col-12 col-sm-auto mb-0"
            style={{ width: 'calc(100% - 180px)' }}
          >
            {existingFiles?.dealer_program_2?.url && (
              <div
                style={{
                  marginBottom: '8px',
                  fontSize: '13px',
                  color: '#666',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div>
                    Current file:{' '}
                    <a
                      href={existingFiles?.dealer_program_2?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {'Download the file'}
                    </a>
                  </div>
                  <span style={{ fontSize: '11px', color: '#888' }}>
                    Upload a new file to replace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFileDelete('dealer_program_2')}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            <FileInputWhiteBackground
              name="dealer_program_2"
              label="Upload Document"
              register={register}
              error={errors.dealer_program_2}
              accept=".csv,.xlsx,.pdf"
              validation={{
                // required: !existingFiles?.dealer_program_2 ? "Please select a file" : false,
                validate: {
                  fileSize: (files) =>
                    !files[0] ||
                    files[0].size <= 100 * 1024 * 1024 ||
                    'File size must be less than 100MB',
                  fileType: (files) =>
                    !files[0] ||
                    [
                      'application/pdf',
                      'text/csv',
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'application/msword',
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ].includes(files[0].type) ||
                    'Only PDF, CSV, Excel, or Word files are allowed',
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-3">
        <CompanyLogoUpload
          name="product_logo"
          label="Upload Company Logo"
          register={register}
          error={errors.product_logo}
          validation={{
            required: !existingFiles?.product_logo
              ? 'Company logo is required'
              : false,
          }}
          accept="image/png, image/jpeg, image/jpg, image/svg+xml"
          existingFile={existingFiles?.product_logo}
        />
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div className="row g-2 align-items-start">
        <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
          <p className="modal-headding-text mb-0" style={{ fontWeight: '500' }}>
            Optional File #1:
          </p>
        </div>
        <div className="col-12 col-sm">
          <TextInputWhiteBackground
            name="option_file_text_1"
            type="text"
            placeholder="Text"
            label="Text"
            register={register}
            error={errors.option_file_text_1}
            validation={{
              minLength: {
                value: 3,
                message: 'Text must be at least 3 characters long',
              },
            }}
          />
        </div>
        <div className="col-12 col-sm">
          {existingFiles?.option_file_1?.url && (
            <div
              style={{
                marginBottom: '8px',
                fontSize: '13px',
                color: '#666',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div>
                  Current file:{' '}
                  <a
                    href={existingFiles?.option_file_1?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'Download the file'}
                  </a>
                </div>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Upload a new file to replace
                </span>
              </div>
              <button
                type="button"
                onClick={() => onFileDelete('option_file_1')}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Remove
              </button>
            </div>
          )}
          <FileInputWhiteBackground
            name="option_file_1"
            label="Upload Document"
            register={register}
            error={errors.option_file_1}
            accept=".csv,.xlsx,.pdf"
            validation={{
              validate: {
                fileSize: (files) =>
                  !files[0] ||
                  files[0].size <= 100 * 1024 * 1024 ||
                  'File size must be less than 100MB',
                fileType: (files) =>
                  !files[0] ||
                  [
                    'application/pdf',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ].includes(files[0].type) ||
                  'Only PDF, CSV, Excel, or Word files are allowed',
              },
            }}
          />
        </div>
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div className="row g-2 align-items-start">
        <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
          <p className="modal-headding-text mb-0" style={{ fontWeight: '500' }}>
            Optional File #2:
          </p>
        </div>
        <div className="col-12 col-sm">
          <TextInputWhiteBackground
            name="option_file_text_2"
            type="text"
            placeholder="Text"
            label="Text"
            register={register}
            error={errors.option_file_text_2}
            validation={{
              minLength: {
                value: 3,
                message: 'Text must be at least 3 characters long',
              },
              maxLength: {
                value: 255,
                message: 'Text cannot be more than 255 characters',
              },
            }}
          />
        </div>
        <div className="col-12 col-sm">
          {existingFiles?.option_file_2?.url && (
            <div
              style={{
                marginBottom: '8px',
                fontSize: '13px',
                color: '#666',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div>
                  Current file:{' '}
                  <a
                    href={existingFiles?.option_file_2?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'Download the file'}
                  </a>
                </div>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Upload a new file to replace
                </span>
              </div>
              <button
                type="button"
                onClick={() => onFileDelete('option_file_2')}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Remove
              </button>
            </div>
          )}
          <FileInputWhiteBackground
            name="option_file_2"
            label="Upload Document"
            register={register}
            error={errors.option_file_2}
            accept=".csv,.xlsx,.pdf"
            validation={{
              validate: {
                fileSize: (files) =>
                  !files[0] ||
                  files[0].size <= 100 * 1024 * 1024 ||
                  'File size must be less than 100MB',
                fileType: (files) =>
                  !files[0] ||
                  [
                    'application/pdf',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ].includes(files[0].type) ||
                  'Only PDF, CSV, Excel, or Word files are allowed',
              },
            }}
          />
        </div>
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div className="row g-2 align-items-start">
        <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
          <p className="modal-headding-text mb-0" style={{ fontWeight: '500' }}>
            Optional File #3:
          </p>
        </div>
        <div className="col-12 col-sm">
          <TextInputWhiteBackground
            name="option_file_text_3"
            type="text"
            placeholder="Text"
            label="Text"
            register={register}
            error={errors.option_file_text_3}
            validation={{
              minLength: {
                value: 3,
                message: 'Text must be at least 3 characters long',
              },
              maxLength: {
                value: 255,
                message: 'Text cannot be more than 255 characters',
              },
            }}
          />
        </div>
        <div className="col-12 col-sm">
          {existingFiles?.option_file_3?.url && (
            <div
              style={{
                marginBottom: '8px',
                fontSize: '13px',
                color: '#666',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div>
                  Current file:{' '}
                  <a
                    href={existingFiles?.option_file_3?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'Download the file'}
                  </a>
                </div>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Upload a new file to replace
                </span>
              </div>
              <button
                type="button"
                onClick={() => onFileDelete('option_file_3')}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Remove
              </button>
            </div>
          )}
          <FileInputWhiteBackground
            name="option_file_3"
            label="Upload Document"
            register={register}
            error={errors.option_file_3}
            accept=".csv,.xlsx,.pdf"
            validation={{
              validate: {
                fileSize: (files) =>
                  !files[0] ||
                  files[0].size <= 100 * 1024 * 1024 ||
                  'File size must be less than 100MB',
                fileType: (files) =>
                  !files[0] ||
                  [
                    'application/pdf',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ].includes(files[0].type) ||
                  'Only PDF, CSV, Excel, or Word files are allowed',
              },
            }}
          />
        </div>
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div className="row g-2 align-items-start">
        <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
          <p className="modal-headding-text mb-0" style={{ fontWeight: '500' }}>
            Optional File #4:
          </p>
        </div>
        <div className="col-12 col-sm">
          <TextInputWhiteBackground
            name="option_file_text_4"
            type="text"
            placeholder="Text"
            label="Text"
            register={register}
            error={errors.option_file_text_4}
            validation={{
              minLength: {
                value: 3,
                message: 'Text must be at least 3 characters long',
              },
              maxLength: {
                value: 255,
                message: 'Text cannot be more than 255 characters',
              },
            }}
          />
        </div>
        <div className="col-12 col-sm">
          {existingFiles?.option_file_4?.url && (
            <div
              style={{
                marginBottom: '8px',
                fontSize: '13px',
                color: '#666',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div>
                  Current file:{' '}
                  <a
                    href={existingFiles?.option_file_4?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'Download the file'}
                  </a>
                </div>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Upload a new file to replace
                </span>
              </div>
              <button
                type="button"
                onClick={() => onFileDelete('option_file_4')}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Remove
              </button>
            </div>
          )}
          <FileInputWhiteBackground
            name="option_file_4"
            label="Upload Document"
            register={register}
            error={errors.option_file_4}
            accept=".csv,.xlsx,.pdf"
            validation={{
              validate: {
                fileSize: (files) =>
                  !files[0] ||
                  files[0].size <= 100 * 1024 * 1024 ||
                  'File size must be less than 100MB',
                fileType: (files) =>
                  !files[0] ||
                  [
                    'application/pdf',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ].includes(files[0].type) ||
                  'Only PDF, CSV, Excel, or Word files are allowed',
              },
            }}
          />
        </div>
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <div className="row g-2 align-items-start">
        <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
          <p className="modal-headding-text mb-0" style={{ fontWeight: '500' }}>
            Optional File #5:
          </p>
        </div>
        <div className="col-12 col-sm">
          <TextInputWhiteBackground
            name="option_file_text_5"
            type="text"
            placeholder="Text"
            label="Text"
            register={register}
            error={errors.option_file_text_5}
            validation={{
              minLength: {
                value: 3,
                message: 'Text must be at least 3 characters long',
              },
              maxLength: {
                value: 255,
                message: 'Text cannot be more than 255 characters',
              },
            }}
          />
        </div>
        <div className="col-12 col-sm">
          {existingFiles?.option_file_5?.url && (
            <div
              style={{
                marginBottom: '8px',
                fontSize: '13px',
                color: '#666',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div>
                  Current file:{' '}
                  <a
                    href={existingFiles?.option_file_5?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {'Download the file'}
                  </a>
                </div>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Upload a new file to replace
                </span>
              </div>
              <button
                type="button"
                onClick={() => onFileDelete('option_file_5')}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Remove
              </button>
            </div>
          )}
          <FileInputWhiteBackground
            name="option_file_5"
            label="Upload Document"
            register={register}
            error={errors.option_file_5}
            accept=".csv,.xlsx,.pdf"
            validation={{
              validate: {
                fileSize: (files) =>
                  !files[0] ||
                  files[0].size <= 100 * 1024 * 1024 ||
                  'File size must be less than 100MB',
                fileType: (files) =>
                  !files[0] ||
                  [
                    'application/pdf',
                    'text/csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ].includes(files[0].type) ||
                  'Only PDF, CSV, Excel, or Word files are allowed',
              },
            }}
          />
        </div>
      </div>
    </div>

    <div className="col-12">
      <TextInputWhiteBackground
        name="display_order"
        type="number"
        placeholder="Enter your display order here"
        label="Display Order"
        register={register}
        error={errors.display_order}
        validation={{
          required: 'Display Order is required',
          min: {
            value: 1,
            message: 'Display Order must be a positive number',
          },
          validate: (value) =>
            Number.isInteger(Number(value)) ||
            'Decimal numbers are not allowed',
          maxLength: {
            value: 255,
            message: 'Display Order cannot be more than 255 characters',
          },
        }}
        containerStyle={{ paddingBottom: '20px' }}
      />
    </div>
  </div>
);

export default CompanyInformationTab;
