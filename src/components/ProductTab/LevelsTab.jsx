import React from 'react';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import FileInputWhiteBackground from '../FileInputWhiteBackground';

const LevelsTab = ({ register, errors }) => (
  <div id="levels-section" className="mb-4">
    <hr style={{ borderColor: "#E4E4E7", margin: "16px 0", opacity: "1" }} />
    <div className='formHeadingWrapper-flex'>
      <p className='formHeading-flex'>Level 1</p>
      <div className='line'></div>
    </div>
    <div className="row" style={{ paddingTop: "20px" }}>
      <TextInputWhiteBackground
        name="level_1_name"
        type="text"
        placeholder="Enter your name here"
        label="Name"
        register={register}
        error={errors.level_1_name}
        validation={{
          required: 'Name is required',
          minLength: {
            value: 6,
            message: 'Name must be at least 6 characters long'
          }
        }}
        containerStyle={{ paddingBottom: "20px" }}
      />
    </div>
    <div className="row align-items-center" style={{paddingBottom:"20px"}}>
      <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
        <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
          Home Page Logo:
        </p>
      </div>
      <div className="col-12 col-sm-auto mb-0">
        <FileInputWhiteBackground
          name={`home_logo_1`}
          label="Upload Document"
          register={register}
          error={errors.home_logo_1}
          accept=".csv"
          validation={{
            required: "Please select a file",
            validate: {
              fileSize: (files) =>
                // !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB",
               !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
              fileType: (files) =>
                !files[0] ||
                ['application/pdf', 'application/msword'].includes(files[0].type) ||
                "Only PDF and DOC files are allowed"
            }
          }}
        />
      </div>
    </div>
    <div className="row align-items-center" style={{paddingBottom:"20px"}}>
      <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
        <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
          Dealer Locator Badge:
        </p>
      </div>
      <div className="col-12 col-sm-auto mb-0">
        <FileInputWhiteBackground
          name={`dealer_locator_badge_1`}
          label="Upload Document"
          register={register}
          error={errors.dealer_locator_badge_1}
          accept=".csv"
          validation={{
            required: "Please select a file",
            validate: {
              fileSize: (files) =>
                // !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB",
               !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
              fileType: (files) =>
                !files[0] ||
                ['application/pdf', 'application/msword'].includes(files[0].type) ||
                "Only PDF and DOC files are allowed"
            }
          }}
        />
      </div>
    </div>
    <div className='formHeadingWrapper-flex'>
      <p className='formHeading-flex'>Level 2</p>
      <div className='line'></div>
    </div>
    <div className="row mb-3" style={{ paddingTop: "20px" }}>
      <TextInputWhiteBackground
        name="level_2_name"
        type="text"
        placeholder="Enter your name here"
        label="Name"
        register={register}
        error={errors.level_2_name}
        validation={{
          required: 'Name is required',
          minLength: {
            value: 6,
            message: 'Name must be at least 6 characters long'
          }
        }}
        containerStyle={{ paddingBottom: "20px" }}
      />
        <div className="row align-items-center" style={{paddingBottom:"20px"}}>
      <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
        <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
          Home Page Logo:
        </p>
      </div>
      <div className="col-12 col-sm-auto mb-0">
        <FileInputWhiteBackground
          name={`home_logo_2`}
          label="Upload Document"
          register={register}
          error={errors.home_logo_2}
          accept=".csv"
          validation={{
            required: "Please select a file",
            validate: {
              fileSize: (files) =>
                // !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB",
               !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
              fileType: (files) =>
                !files[0] ||
                ['application/pdf', 'application/msword'].includes(files[0].type) ||
                "Only PDF and DOC files are allowed"
            }
          }}
        />
      </div>
    </div>
    <div className="row align-items-center" style={{paddingBottom:"20px"}}>
      <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
        <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
          Dealer Locator Badge:
        </p>
      </div>
      <div className="col-12 col-sm-auto mb-0">
        <FileInputWhiteBackground
          name={`dealer_locator_badge_2`}
          label="Upload Document"
          register={register}
          error={errors.dealer_locator_badge_2}
          accept=".csv"
          validation={{
            required: "Please select a file",
            validate: {
              fileSize: (files) =>
                 !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
                // !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB",
              fileType: (files) =>
                !files[0] ||
                ['application/pdf', 'application/msword'].includes(files[0].type) ||
                "Only PDF and DOC files are allowed"
            }
          }}
        />
      </div>
    </div>
    </div>
    <div className='formHeadingWrapper-flex'>
      <p className='formHeading-flex'>Level 3</p>
      <div className='line'></div>
    </div>
    <div className="row mb-3" style={{ paddingTop: "20px" }}>
      <TextInputWhiteBackground
        name="level_3_name"
        type="text"
        placeholder="Enter your name here"
        label="Name"
        register={register}
        error={errors.level_3_name}
        validation={{
          required: 'Name is required',
          minLength: {
            value: 6,
            message: 'Name must be at least 6 characters long'
          }
        }}
        containerStyle={{ paddingBottom: "20px" }}
      />
        <div className="row align-items-center" style={{paddingBottom:"20px"}}>
      <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
        <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
          Home Page Logo:
        </p>
      </div>
      <div className="col-12 col-sm-auto mb-0">
        <FileInputWhiteBackground
          name={`home_logo_3`}
          label="Upload Document"
          register={register}
          error={errors.home_logo_3}
          accept=".csv"
          validation={{
            required: "Please select a file",
            validate: {
              fileSize: (files) =>
                 !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
                // !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB",
              fileType: (files) =>
                !files[0] ||
                ['application/pdf', 'application/msword'].includes(files[0].type) ||
                "Only PDF and DOC files are allowed"
            }
          }}
        />
      </div>
    </div>
    <div className="row align-items-center" style={{paddingBottom:"20px"}}>
      <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
        <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
          Dealer Locator Badge:
        </p>
      </div>
      <div className="col-12 col-sm-auto mb-0">
        <FileInputWhiteBackground
          name={`dealer_locator_badge_3`}
          label="Upload Document"
          register={register}
          error={errors.dealer_locator_badge_3}
          accept=".csv"
          validation={{
            required: "Please select a file",
            validate: {
              fileSize: (files) =>
                 !files[0] || files[0].size <= 100 * 1024 * 1024 || "File size must be less than 100MB",
                // !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB",
              fileType: (files) =>
                !files[0] ||
                ['application/pdf', 'application/msword'].includes(files[0].type) ||
                "Only PDF and DOC files are allowed"
            }
          }}
        />
      </div>
    </div>
    </div>
  </div>
);

export default LevelsTab;
