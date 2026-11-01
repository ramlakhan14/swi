import React, { useState } from 'react';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import TextAreaInput from '../TextAreaInput';
import FileInputWhiteBackground from '../FileInputWhiteBackground';
import AddIcon from '../../assets/icons/ic-add.png';

const CouponsTab = ({ register, errors }) => {
  // Start with one coupon, index 0
  const [couponList, setCouponList] = useState([0]);

  // Handler to add a new coupon section
  const addMoreCoupon = () => {
    setCouponList(prev =>
      [...prev, prev.length > 0 ? Math.max(...prev) + 1 : 1]
    );
  };

  // Handler to remove a coupon section by its index
  const removeCoupon = (removeIdx) => {
    setCouponList(prev => prev.filter((_, idx) => idx !== removeIdx));
  };

  return (
    <div id="coupons-section">
      <hr style={{ borderColor: "#E4E4E7", margin: "16px 0", opacity: "1" }} />
      <div className='mb-2' style={{ display: 'flex', alignItems: 'center', paddingBottom: "20px" }}>
        <input
          type="checkbox"
          id="existing"
          {...register("Power_dealer_enabled")}
          className='form-check-input mt-0'
        />
        <label
          className="form-check-label ms-2 modal-para-text mb-0"
          htmlFor="existing"
          style={{ fontSize: '14px', color: '#666' }}
        >
          Power Dealer Enabled
        </label>
      </div>

      {couponList.map((couponNum, idx) => (
        <React.Fragment key={`coupon_${couponNum}`}>
          <div className='formHeadingWrapper-flex'>
            <p className='formHeading-flex'>Coupon {idx + 1}</p>
            <div className='line'></div>
            {idx !== 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-3"
                style={{ fontSize: "12px", height: "30px" }}
                onClick={() => removeCoupon(idx)}
              >
                Remove
              </button>
            )}
          </div>
          <div className="row g-2 align-items-center" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <div className="col-12 col-sm-auto mt-0" style={{ minWidth: "180px" }}>
              <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
                Coupon Date Range:
              </p>
            </div>
            <div className="col-12 col-sm">
              <TextInputWhiteBackground
                name={`coupon_${couponNum}_date_from`}
                type="date"
                placeholder=""
                label="From"
                register={register}
                error={errors[`coupon_${couponNum}_date_from`]}
                validation={{ required: 'From date is required' }}
                containerStyle={{ paddingBottom: "0px" }}
              />
            </div>
            <div className="col-12 col-sm">
              <TextInputWhiteBackground
                name={`coupon_${couponNum}_date_to`}
                type="date"
                placeholder=""
                label="To"
                register={register}
                error={errors[`coupon_${couponNum}_date_to`]}
                validation={{ required: 'To date is required' }}
                containerStyle={{ paddingBottom: "0px" }}
              />
            </div>
          </div>
          <TextInputWhiteBackground
            name={`coupon_${couponNum}_title`}
            type="text"
            placeholder="Enter your coupon title here"
            label="Coupon Title"
            register={register}
            error={errors[`coupon_${couponNum}_title`]}
            validation={{
              required: 'Coupon Title is required',
              minLength: {
                value: 6,
                message: 'Coupon Title must be at least 6 characters long'
              }
            }}
            containerStyle={{ paddingBottom: "20px" }}
          />
          <TextAreaInput
            name={`coupon_${couponNum}_description`}
            placeholder="Enter your coupon description here"
            label="Coupon Description"
            register={register}
            error={errors[`coupon_${couponNum}_description`]}
            validation={{
              required: 'Coupon Description is required',
              minLength: {
                value: 6,
                message: 'Coupon Description must be at least 6 characters long'
              }
            }}
            containerStyle={{ paddingBottom: "20px" }}
            rows={4}
          />
          <div className="row align-items-center" style={{ marginBottom: "20px" }}>
            <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
              <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
                “View Full Details” PDF:
              </p>
            </div>
            <div className="col-12 col-sm-auto mb-0">
              <FileInputWhiteBackground
                name={`coupon_${couponNum}_file`}
                label="Upload Document"
                register={register}
                error={errors[`coupon_${couponNum}_file`]}
                accept=".csv"
                validation={{
                  required: "Please select a file",
                  validate: {
                    fileSize: (files) =>
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
        </React.Fragment>
      ))}

      <div style={{ marginBottom: "20px" }}>
        <p className='modal-headding-text mb-0' style={{ fontWeight: "400", display: "inline-flex", alignItems: "center" }}>
          Add More Coupon
          <img
            role='button'
            onClick={addMoreCoupon}
            src={AddIcon}
            alt='Add'
            width={"24px"}
            height={"24px"}
            className='ms-2'
            style={{ cursor: "pointer" }}
          />
        </p>
      </div>
    </div>
  );
};

export default CouponsTab;
