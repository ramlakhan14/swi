import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import FileInputWhiteBackground from '../FileInputWhiteBackground';
import TextAreaInput from '../TextAreaInput';
import AddIcon from '../../assets/icons/ic-add.png';
import CompanyLogoUpload from '../CompanyLogoUpload';
import SelectInput from '../SelectInput';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';
import { createProduct } from '../../services/ProductsApis';

const AddProductLine = ({ isOpen, onClose, fetchGetAllNews }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    defaultValues: {
      option_link: [{ text: '', url: '' }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'option_link',
  });

  const addMoreOptionalLink = () => {
    append({ text: '', url: '' });
  };

  const removeAdditionalOptionalLink = (index) => {
    remove(index);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const genderField = {
    name: 'rebate_type',
    label: 'Type of Rebate',
    required: true,
    options: [
      { value: 'bid', label: 'Bid' },
      { value: 'fleet', label: 'Fleet' },
      { value: 'both', label: 'Both' },
      { value: 'openHouseFleet', label: 'Open House Fleet' },
    ],
  };

  function cleanData(obj) {
    const cleaned = {};

    Object.entries(obj).forEach(([key, value]) => {
      // Remove empty string ""
      if (value === '') return;

      // Remove empty FileList
      if (value instanceof FileList && value.length === 0) return;

      // Remove empty array objects like [{ text: "", url: "" }]
      if (Array.isArray(value)) {
        const filteredArr = value.filter(
          (item) =>
            !(
              item &&
              typeof item === 'object' &&
              Object.values(item).every((v) => v === '')
            ),
        );

        if (filteredArr.length > 0) cleaned[key] = filteredArr;
        return;
      }

      cleaned[key] = value;
    });

    return cleaned;
  }

  const onSubmit = async (data) => {
    const finalData = cleanData(data);
    const formData = new FormData();
    Object.keys(finalData).forEach((key) => {
      const value = finalData[key];

      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.keys(item).forEach((subKey) => {
            formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
          });
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    try {
      const response = await createProduct(formData);
      showSuccessToast(response?.message);
      fetchGetAllNews();
      handleClose();
    } catch (error) {
      if (error?.response?.data.responseCode === 422) {
        return showErrorToast(
          Object.values(error?.response?.data?.messages)[0][0] ||
            'Failed to forget password',
        );
      }
      showErrorToast(error?.response?.data?.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block modal-lg" tabIndex={-1} role="dialog">
      <div
        className="modal-dialog modal-dialog-scrollable modal-lg"
        tabIndex="-1"
        role="dialog"
        style={{ paddingRight: '17px', maxWidth: '800px' }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title modal-headding mb-0">
              Add a product line
            </h5>
            <button
              type="button"
              className="btn-close modal-close-btn"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div
                className="formHeadingWrapper-flex"
                style={{ paddingBottom: '20px' }}
              >
                <p
                  className="formHeading-flex"
                  style={{ fontSize: '14px', fontWeight: '600' }}
                >
                  Dealer Toolbox Home Page
                </p>
                <div
                  className="line"
                  style={{
                    flex: 1,
                    height: '1px',
                    backgroundColor: '#dee2e6',
                    marginLeft: '15px',
                  }}
                ></div>
              </div>
              <div>
                <div className="row">
                  <div className="col-lg-9 col-12">
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
                          message:
                            'Company Name must be at least 3 characters long',
                        },
                        maxLength: {
                          value: 150,
                          message:
                            'Company Name cannot be more than 150 characters',
                        },
                      }}
                      containerStyle={{ paddingBottom: '20px' }}
                    />
                    <div className="d-flex align-items-center mb-3">
                      <p
                        className="modal-headding-text mb-0"
                        style={{ minWidth: '180px', fontWeight: '500' }}
                      >
                        Current Price List:
                      </p>
                      <FileInputWhiteBackground
                        name="current_price_list"
                        label="Upload Document"
                        register={register}
                        error={errors.current_price_list}
                        accept=".pdf,.doc,.xlsx"
                        validation={{
                          required: 'Please select a file',
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
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                                'application/vnd.ms-excel', // .xls
                                'application/msword', // .doc
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                              ].includes(files[0].type) ||
                              'Only PDF, CSV, Excel, or Word files are allowed',
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-12 d-flex flex-column align-items-center">
                    <CompanyLogoUpload
                      name="product_logo"
                      label="Upload Company Logo"
                      register={register}
                      error={errors.product_logo}
                      validation={{
                        required: 'Company logo is required',
                      }}
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    />
                  </div>
                </div>

                <div
                  className="row align-items-start"
                  style={{ marginBottom: '20px' }}
                >
                  <div
                    className="col-12 col-sm-auto"
                    style={{ minWidth: '180px' }}
                  >
                    <p
                      className="modal-headding-text mb-0"
                      style={{ fontWeight: '500' }}
                    >
                      Current Dealer <br />
                      Program:
                    </p>
                  </div>
                  <div className="col-12 col-sm-auto mb-0">
                    <FileInputWhiteBackground
                      name="dealer_program_1"
                      label="Upload Document"
                      register={register}
                      error={errors.dealer_program_1}
                      accept=".pdf,.doc,.xlsx"
                      validation={{
                        required: 'Please select a file',
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
                              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                              'application/vnd.ms-excel', // .xls
                              'application/msword', // .doc
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                            ].includes(files[0].type) ||
                            'Only PDF, CSV, Excel, or Word files are allowed',
                        },
                      }}
                    />
                  </div>
                </div>
                <div
                  className="row align-items-start"
                  style={{ marginBottom: '20px' }}
                >
                  <div
                    className="col-12 col-sm-auto"
                    style={{ minWidth: '180px' }}
                  >
                    <p
                      className="modal-headding-text mb-0"
                      style={{ fontWeight: '500' }}
                    >
                      Dealer Program 2:
                    </p>
                  </div>
                  <div className="col-12 col-sm-auto mb-0">
                    <FileInputWhiteBackground
                      name="dealer_program_2"
                      label="Upload Document"
                      register={register}
                      error={errors.dealer_program_2}
                      accept=".pdf,.doc,.xlsx"
                      validation={{
                        required: 'Please select a file',
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
                              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                              'application/vnd.ms-excel', // .xls
                              'application/msword', // .doc
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                            ].includes(files[0].type) ||
                            'Only PDF, CSV, Excel, or Word files are allowed',
                        },
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div className="row g-2 align-items-start">
                    <div
                      className="col-12 col-sm-auto"
                      style={{ minWidth: '180px' }}
                    >
                      <p
                        className="modal-headding-text mb-0"
                        style={{ fontWeight: '500' }}
                      >
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
                          // required: 'Text is required',
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
                      <FileInputWhiteBackground
                        name="option_file_1"
                        label="Upload Document"
                        register={register}
                        error={errors.option_file_1}
                        accept=".pdf,.doc,.xlsx"
                        validation={{
                          required: 'Please select a file',
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
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                                'application/vnd.ms-excel', // .xls
                                'application/msword', // .doc
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
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
                    <div
                      className="col-12 col-sm-auto"
                      style={{ minWidth: '180px' }}
                    >
                      <p
                        className="modal-headding-text mb-0"
                        style={{ fontWeight: '500' }}
                      >
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
                          // required: 'Text is required',
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
                      <FileInputWhiteBackground
                        name="option_file_2"
                        label="Upload Document"
                        register={register}
                        error={errors.option_file_2}
                        accept=".pdf,.doc,.xlsx"
                        validation={{
                          required: 'Please select a file',
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
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                                'application/vnd.ms-excel', // .xls
                                'application/msword', // .doc
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                              ].includes(files[0].type) ||
                              'Only PDF, CSV, Excel, or Word files are allowed',
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <TextInputWhiteBackground
                  name="display_order"
                  type="number"
                  placeholder="Enter your display order here"
                  label="Display Order"
                  register={register}
                  error={errors.display_order}
                  validation={{
                    required: 'Display Order is required',
                    // minLength: {
                    //     value: 3,
                    //     message: 'Display Order must be at least 3 characters long'
                    // }
                  }}
                  containerStyle={{ paddingBottom: '20px' }}
                />

                <div
                  className="formHeadingWrapper-flex"
                  style={{ paddingBottom: '20px', paddingTop: '20px' }}
                >
                  <p
                    className="formHeading-flex"
                    style={{ fontSize: '14px', fontWeight: '600' }}
                  >
                    Detailed Company Information
                  </p>
                  <div
                    className="line"
                    style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: '#dee2e6',
                      marginLeft: '15px',
                    }}
                  ></div>
                </div>

                <div
                  className="row align-items-start"
                  style={{ paddingBottom: '20px' }}
                >
                  <div
                    className="col-12 col-sm-auto"
                    style={{ minWidth: '180px' }}
                  >
                    <p
                      className="modal-headding-text mb-0"
                      style={{ fontWeight: '500' }}
                    >
                      Primary Photo:
                    </p>
                  </div>
                  <div className="col-12 col-sm-auto mb-0">
                    <FileInputWhiteBackground
                      name="primary_photo"
                      label="Upload Image"
                      register={register}
                      error={errors.primary_photo}
                      accept="image/*"
                      validation={{
                        required: 'Please select an image',
                        validate: {
                          fileSize: (files) =>
                            !files[0] ||
                            files[0].size <= 5 * 1024 * 1024 ||
                            'File size must be less than 5MB',
                          fileType: (files) =>
                            !files[0] ||
                            [
                              'image/jpeg',
                              'image/jpg',
                              'image/png',
                              'image/gif',
                              'image/webp',
                            ].includes(files[0].type) ||
                            'Only image files (.jpg, .jpeg, .png, .gif, .webp) are allowed',
                        },
                      }}
                    />
                  </div>
                </div>

                <TextAreaInput
                  name="comapny_text"
                  placeholder="Enter your company text here"
                  label="Company Text"
                  register={register}
                  error={errors.comapny_text}
                  validation={{
                    required: 'Company Text is required',
                    minLength: {
                      value: 3,
                      message:
                        'Company Text must be at least 3 characters long',
                    },
                    maxLength: {
                      value: 500,
                      message:
                        'Company Text cannot be more than 500 characters',
                    },
                  }}
                  containerStyle={{ paddingBottom: '20px' }}
                  rows={4}
                />

                <TextInputWhiteBackground
                  name="dealer_locator"
                  type="text"
                  placeholder="Dealer Locator (URL)"
                  label="Dealer Locator (URL)"
                  register={register}
                  error={errors.dealer_locator}
                  validation={{
                    required: 'Dealer Locator URL is required',
                    pattern: {
                      value:
                        /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                      message:
                        'Please enter a valid URL starting with http:// or https://',
                    },
                  }}
                  containerStyle={{ paddingBottom: '20px' }}
                />

                <TextInputWhiteBackground
                  name="part_lookup"
                  type="text"
                  placeholder="Parts Lookup (URL)"
                  label="Parts Lookup (URL)"
                  register={register}
                  error={errors.part_lookup}
                  validation={{
                    required: 'Parts Lookup URL is required',
                    pattern: {
                      value:
                        /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                      message:
                        'Please enter a valid URL starting with http:// or https://',
                    },
                  }}
                  containerStyle={{ paddingBottom: '20px' }}
                />

                <div style={{ paddingBottom: '20px' }}>
                  <div className="row g-2 align-items-start">
                    <div
                      className="col-12 col-sm-auto"
                      style={{ minWidth: '180px' }}
                    >
                      <p
                        className="modal-headding-text mb-0"
                        style={{ fontWeight: '500' }}
                      >
                        Warranty:
                      </p>
                    </div>
                    <div className="col-12 col-sm">
                      <TextInputWhiteBackground
                        name="warranty_text"
                        type="text"
                        placeholder="Text"
                        label="Text"
                        register={register}
                        error={errors.warranty_text}
                        validation={{
                          required: 'Warranty text is required',
                        }}
                      />
                    </div>
                    <div className="col-12 col-sm">
                      <TextInputWhiteBackground
                        name="warranty_url"
                        type="url"
                        placeholder="URL"
                        label="URL"
                        register={register}
                        error={errors.warranty_url}
                        validation={{
                          required: 'Warranty URL is required',
                          pattern: {
                            value:
                              /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                            message:
                              'Please enter a valid URL starting with http:// or https://',
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Website */}
                <div style={{ paddingBottom: '20px' }}>
                  <div className="row g-2 align-items-start">
                    <div
                      className="col-12 col-sm-auto"
                      style={{ minWidth: '180px' }}
                    >
                      <p
                        className="modal-headding-text mb-0"
                        style={{ fontWeight: '500' }}
                      >
                        Website:
                      </p>
                    </div>
                    <div className="col-12 col-sm">
                      <TextInputWhiteBackground
                        name="website_text"
                        type="text"
                        placeholder="Text"
                        label="Text"
                        register={register}
                        error={errors.website_text}
                        validation={{
                          required: 'Website text is required',
                          minLength: {
                            value: 3,
                            message:
                              'Website text must be at least 3 characters long',
                          },
                          maxLength: {
                            value: 255,
                            message:
                              'Website text cannot be more than 255 characters',
                          },
                        }}
                      />
                    </div>
                    <div className="col-12 col-sm">
                      <TextInputWhiteBackground
                        name="website_url"
                        type="url"
                        placeholder="URL"
                        label="URL"
                        register={register}
                        error={errors.website_url}
                        validation={{
                          required: 'Website URL is required',
                          pattern: {
                            value:
                              /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                            message:
                              'Please enter a valid URL starting with http:// or https://',
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Optional Links */}
                {fields.map((field, index) => (
                  <div key={field.id} style={{ paddingBottom: '20px' }}>
                    <div className="row g-2 align-items-start">
                      <div
                        className="col-12 col-sm-auto"
                        style={{ minWidth: '180px' }}
                      >
                        <p
                          className="modal-headding-text mb-0"
                          style={{ fontWeight: '500' }}
                        >
                          Optional Link {index + 1}:
                        </p>
                      </div>
                      <div className="col-12 col-sm">
                        <TextInputWhiteBackground
                          name={`option_link[${index}].text`}
                          type="text"
                          placeholder="Text"
                          label="Text"
                          register={register}
                          error={errors?.option_link?.[index]?.text}
                          // error={errors[`option_link[${index}].text`]}
                          validation={{
                            // required: 'Text is required',
                            minLength: {
                              value: 3,
                              message:
                                'Text must be at least 3 characters long',
                            },
                            maxLength: {
                              value: 255,
                              message:
                                'Text cannot be more than 255 characters',
                            },
                          }}
                        />
                      </div>
                      <div className="col-12 col-sm">
                        <TextInputWhiteBackground
                          name={`option_link[${index}].url`}
                          type="url"
                          placeholder="URL"
                          label="URL"
                          register={register}
                          error={errors?.option_link?.[index]?.url}
                          validation={{
                            // required: 'URL is required',
                            pattern: {
                              value:
                                /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                              message:
                                'Please enter a valid URL starting with http:// or https://',
                            },
                          }}
                        />
                      </div>
                      {index > 0 && (
                        <div
                          className="col-12 col-sm-auto"
                          style={{ minWidth: '180px' }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeAdditionalOptionalLink(index)}
                            style={{ fontSize: '12px' }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ marginBottom: '20px' }}>
                  <p
                    className="modal-headding-text mb-0"
                    style={{ fontWeight: '400' }}
                  >
                    Add More Optional Link
                    <img
                      role="button"
                      onClick={addMoreOptionalLink}
                      src={AddIcon}
                      alt="AddIcon"
                      width={'24px'}
                      height={'24px'}
                      className="ms-2"
                    />
                  </p>
                </div>

                <SelectInput
                  field={genderField}
                  register={register}
                  error={errors.type_of_rebate}
                  className="form-select-input"
                  containerStyle={{ marginBottom: '20px' }}
                />

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-dark black-btn-hover-white"
                    onClick={handleClose}
                    style={{ fontSize: '12px', fontWeight: '700' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-success green-btn"
                    style={{
                      padding: '8px 16px',
                      marginLeft: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
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
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductLine;
