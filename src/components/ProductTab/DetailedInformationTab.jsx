import React, { useEffect, useState } from 'react';
import FileInputWhiteBackground from '../FileInputWhiteBackground';
import TextAreaInput from '../TextAreaInput';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import AddIcon from '../../assets/icons/ic-add.png';
import SelectInput from '../SelectInput';
import { useFieldArray } from 'react-hook-form';

const DetailedInformationTab = ({
  register,
  errors,
  genderField,
  isOptionLinkData,
  control,
  existingFiles,
  onFileDelete,
}) => {
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

  useEffect(() => {
    if (isOptionLinkData && isOptionLinkData.length > 0) {
      replace(isOptionLinkData);
    }
  }, [isOptionLinkData, replace]);

  return (
    <div id="detailed-information-section">
      <hr style={{ borderColor: '#E4E4E7', margin: '16px 0', opacity: '1' }} />
      <p
        className=""
        style={{
          fontSize: '14px',
          color: '#52525C',
          marginBottom: '20px',
          fontWeight: '500',
        }}
      >
        After clicking the "Learn More..." Link - Detailed Company Information.
      </p>
      <div className="row align-items-start" style={{ paddingBottom: '20px' }}>
        <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
          <p className="modal-headding-text mb-0" style={{ fontWeight: '500' }}>
            Primary Photo:
          </p>
        </div>
        <div className="col-12 col-sm-auto mb-0">
          {existingFiles?.primary_photo?.url && (
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
                    href={existingFiles?.primary_photo?.url}
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
                onClick={() => onFileDelete('primary_photo')}
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
            name={`primary_photo`}
            label="Upload Document"
            register={register}
            error={errors.primary_photo}
            accept="image/png, image/jpeg, image/jpg, image/svg+xml"
            validation={{
              // required: !existingFiles?.primary_photo ? "Please select a file" : false,
              validate: {
                fileSize: (files) =>
                  !files[0] ||
                  files[0].size <= 5000000 ||
                  'File size must be less than 5MB',
                fileType: (files) =>
                  !files[0] ||
                  [
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/svg+xml',
                  ].includes(files[0].type) ||
                  'Only PNG, JPG, JPEG, SVG image files are allowed',
              },
            }}
          />
        </div>
      </div>
      <TextAreaInput
        name={`comapny_text`}
        placeholder="Enter your company text here"
        label="Company Text"
        register={register}
        error={errors.comapny_text}
        validation={{
          // required: 'Company Text is required',
          minLength: {
            value: 3,
            message: 'Company Text must be at least 3 characters long',
          },
          maxLength: {
            value: 500,
            message: 'Company Text cannot be more than 500 characters',
          },
        }}
        containerStyle={{ paddingBottom: '20px' }}
        rows={4}
      />
      <TextInputWhiteBackground
        name={`dealer_locator`}
        type="text"
        placeholder="Enter your Dealer Locator (URL) here"
        label="Dealer Locator (URL)"
        register={register}
        error={errors.dealer_locator}
        validation={{
          // required: 'Dealer Locator (URL) is required',
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
        name={`part_lookup`}
        type="text"
        placeholder="Enter your Parts Lookup (URL) here"
        label="Parts Lookup (URL)"
        register={register}
        error={errors.part_lookup}
        validation={{
          // required: 'Parts Lookup (URL) is required',
          pattern: {
            value:
              /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
            message:
              'Please enter a valid URL starting with http:// or https://',
          },
        }}
        containerStyle={{ paddingBottom: '20px' }}
      />

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
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
            <TextInputWhiteBackground
              name="warranty_url"
              type="url"
              placeholder="URL"
              label="URL"
              register={register}
              error={errors.warranty_url}
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
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
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
            <TextInputWhiteBackground
              name="website_url"
              type="url"
              placeholder="URL"
              label="URL"
              register={register}
              error={errors.website_url}
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
        </div>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} style={{ paddingBottom: '20px' }}>
          <div className="row g-2 align-items-start">
            <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
              <p
                className="modal-headding-text mb-0"
                style={{ fontWeight: '500' }}
              >
                Optional Link {index + 1}:
              </p>
            </div>
            <div className="col-12 col-sm">
              <TextInputWhiteBackground
                name={`option_link.${index}.text`}
                type="text"
                placeholder="Text"
                label="Text"
                register={register}
                error={errors?.option_link?.[index]?.text}
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
              <TextInputWhiteBackground
                name={`option_link.${index}.url`}
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
            <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeAdditionalOptionalLink(index)}
                style={{ fontSize: '12px' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginBottom: '20px' }}>
        <p
          className="modal-headding-text mb-0"
          style={{
            fontWeight: '400',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Add More Optional Link
          <img
            role="button"
            onClick={addMoreOptionalLink}
            src={AddIcon}
            alt="Add"
            width={'24px'}
            height={'24px'}
            className="ms-2"
            style={{ cursor: 'pointer' }}
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

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              Facebook:
            </p>
          </div>
          <div className="col-12 col-sm">
            <TextInputWhiteBackground
              name="facebook"
              type="url"
              placeholder="URL"
              label="URL"
              register={register}
              error={errors.facebook}
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
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              YouTube:
            </p>
          </div>
          <div className="col-12 col-sm">
            <TextInputWhiteBackground
              name="youtube"
              type="url"
              placeholder="URL"
              label="URL"
              register={register}
              error={errors.youtube}
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
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              X (Twitter):
            </p>
          </div>
          <div className="col-12 col-sm">
            <TextInputWhiteBackground
              name="x_twitter"
              type="url"
              placeholder="URL"
              label="URL"
              register={register}
              error={errors.x_twitter}
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
        </div>
      </div>

      <div className="formHeadingWrapper-flex">
        <p className="formHeading-flex">Optional YouTube Videos</p>
        <div className="line"></div>
      </div>

      <p
        style={{
          fontSize: '14px',
          color: '#52525C',
          marginBottom: '20px',
          fontWeight: '500',
          paddingTop: '20px',
        }}
      >
        Select the video on YouTube, Click Share and then Embed to get the{' '}
        <br />
        HTML code to embed the video. Copy/Paste the Embed html code below.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              YouTube Video 1 <br />
              (HTML Code):
            </p>
          </div>
          <div className="col-12 col-sm">
            <TextAreaInput
              name={`youtube_video_1`}
              placeholder="Enter your youTube video 1 (HTML Code) here"
              label="YouTube Video 1 (HTML Code)"
              register={register}
              error={errors.youtube_video_1}
              validation={{
                // required: 'YouTube Video 1 (HTML Code) is required',
                minLength: {
                  value: 3,
                  message:
                    'YouTube Video 1 (HTML Code) must be at least 3 characters long',
                },
                maxLength: {
                  value: 500,
                  message:
                    'YouTube Video 1 (HTML Code) cannot be more than 500 characters',
                },
              }}
              containerStyle={{ paddingBottom: '20px' }}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              YouTube Video 2 <br />
              (HTML Code):
            </p>
          </div>
          <div className="col-12 col-sm">
            <TextAreaInput
              name={`youtube_video_2`}
              placeholder="Enter your youTube video 2 (HTML Code) here"
              label="YouTube Video 2 (HTML Code)"
              register={register}
              error={errors.youtube_video_2}
              validation={{
                // required: 'YouTube Video 2 (HTML Code) is required',
                minLength: {
                  value: 3,
                  message:
                    'YouTube Video 2 (HTML Code) must be at least 3 characters long',
                },
                maxLength: {
                  value: 500,
                  message:
                    'YouTube Video 2 (HTML Code) cannot be more than 500 characters',
                },
              }}
              containerStyle={{ paddingBottom: '20px' }}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2">
          <div className="col-12 col-sm-auto" style={{ minWidth: '180px' }}>
            <p
              className="modal-headding-text mb-0"
              style={{ fontWeight: '500' }}
            >
              YouTube Video 3 <br />
              (HTML Code):
            </p>
          </div>
          <div className="col-12 col-sm">
            <TextAreaInput
              name={`youtube_video_3`}
              placeholder="Enter your youTube video 3 (HTML Code) here"
              label="YouTube Video 3 (HTML Code)"
              register={register}
              error={errors.youtube_video_3}
              validation={{
                // required: 'YouTube Video 3 (HTML Code) is required',
                minLength: {
                  value: 3,
                  message:
                    'YouTube Video 3 (HTML Code) must be at least 3 characters long',
                },
                maxLength: {
                  value: 500,
                  message:
                    'YouTube Video 3 (HTML Code) cannot be more than 500 characters',
                },
              }}
              containerStyle={{ paddingBottom: '20px' }}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedInformationTab;
