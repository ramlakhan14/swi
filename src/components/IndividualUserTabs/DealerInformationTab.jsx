import React, { useState } from 'react';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import { IconEyeClosed } from '../../assets/icons/iconEyeClosed';
import { IconEye } from '../../assets/icons/IconEye';
import SelectInput from '../SelectInput';
import MapComponent from '../MapComponent';

const DealerInformationTab = ({
  register,
  errors,
  setValue,
  genderFieldRole,
  isPasswordIsNotNull,
  watch,
  id,
  genderFieldSalesPerson,
}) => {
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ''); // remove non-digits
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (!match) return value;

    let formatted = match[1];
    if (match[2]) formatted += `-${match[2]}`;
    if (match[3]) formatted += `-${match[3]}`;

    return formatted;
  };
  return (
    <div>
      <TextInputWhiteBackground
        name="dealer_id"
        type="text"
        placeholder="Enter your dealer id here"
        label="Dealer ID"
        register={register}
        error={errors.dealer_id}
        validation={{
          required: 'Dealer ID is required',
          minLength: {
            value: 3,
            message: 'Dealer ID must be at least 3 characters long',
          },
        }}
        containerStyle={{ paddingBottom: '20px' }}
      />

      <TextInputWhiteBackground
        name="company_name"
        type="text"
        placeholder="Enter your company name here"
        label="Company Name"
        register={register}
        error={errors.company_name}
        validation={{
          required: 'Company Name is required',
          minLength: {
            value: 3,
            message: 'Company Name must be at least 3 characters long',
          },
        }}
        containerStyle={{ paddingBottom: '20px' }}
      />

      <TextInputWhiteBackground
        name="password_string"
        type="password"
        placeholder="Enter your password here"
        label="Password"
        register={register}
        error={errors.password_string}
        validation={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters long',
          },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/,
            message:
              'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and no spaces',
          },
        }}
        containerStyle={{ paddingBottom: '20px' }}
        icon={<IconEye />}
        changeIcon={<IconEyeClosed />}
        changeType="text"
        // disabled={isPasswordIsNotNull}
      />

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="edi_id"
              type="text"
              placeholder="Enter your EDI ID here"
              label="EDI ID"
              register={register}
              error={errors.edi_id}
              validation={
                {
                  // required: 'EDI ID is required'
                }
              }
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="edi_password"
              type="password"
              placeholder="Enter your EDI password here"
              label="EDI Password"
              register={register}
              error={errors.edi_password}
              validation={{
                // required: 'EDI Password is required',
                minLength: {
                  value: 4,
                  message: 'EDI Password must be at least 4 characters long',
                },
                // pattern: {
                //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{4,}$/,
                //   message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and no spaces'
                // }
              }}
              containerStyle={{ paddingBottom: '0px' }}
              icon={<IconEye />}
              changeIcon={<IconEyeClosed />}
              changeType="text"
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="first_name"
              type="text"
              placeholder="Enter your first name here"
              label="First Name"
              register={register}
              error={errors.first_name}
              validation={{
                required: 'First Name is required',
                minLength: {
                  value: 2,
                  message: 'First Name must be at least 2 characters long',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="last_name"
              type="text"
              placeholder="Enter your last name here"
              label="Last Name"
              register={register}
              error={errors.last_name}
              validation={{
                // required: 'Last Name is required',
                minLength: {
                  value: 2,
                  message: 'Last Name must be at least 2 characters long',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
        </div>
      </div>

      <TextInputWhiteBackground
        name="address_1"
        type="text"
        placeholder="Enter your address here"
        label="Address 1"
        register={register}
        error={errors.address_1}
        validation={
          {
            // required: 'Address 1 is required'
          }
        }
        containerStyle={{ paddingBottom: '20px' }}
      />

      <TextInputWhiteBackground
        name="address_2"
        type="text"
        placeholder="Enter your address here"
        label="Address 2"
        register={register}
        error={errors.address_2}
        containerStyle={{ paddingBottom: '20px' }}
      />

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <TextInputWhiteBackground
              name="city"
              type="text"
              placeholder="Enter your city here"
              label="City"
              register={register}
              error={errors.city}
              validation={
                {
                  // required: 'City is required'
                }
              }
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <TextInputWhiteBackground
              name="state"
              type="text"
              placeholder="Enter your state here"
              label="State"
              register={register}
              error={errors.state}
              validation={
                {
                  // required: 'State is required'
                }
              }
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <TextInputWhiteBackground
              name="zip"
              type="text"
              placeholder="Enter your ZIP here"
              label="ZIP"
              register={register}
              error={errors.zip}
              validation={{
                // required: 'ZIP is required',
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Invalid ZIP code format',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <TextInputWhiteBackground
              name="phone_no"
              type="tel"
              placeholder="Enter your phone here"
              label="Phone"
              register={register}
              error={errors.phone_no}
              validation={{
                // required: "Phone is required",
                pattern: {
                  value: /^\d{3}-\d{3}-\d{4}$/,
                  message: 'The phone number format should be XXX-XXX-XXXX',
                },
              }}
              onChange={(e) => {
                e.target.value = formatPhoneNumber(e.target.value);
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <TextInputWhiteBackground
              name="fax"
              type="tel"
              placeholder="Enter your fax here"
              label="Fax"
              register={register}
              error={errors.fax}
              containerStyle={{ paddingBottom: '0px' }}
              validation={{
                pattern: {
                  value: /^\d{3}-\d{3}-\d{4}$/,
                  message: 'The fax number format should be XXX-XXX-XXXX',
                },
              }}
              onChange={(e) => {
                e.target.value = formatPhoneNumber(e.target.value);
              }}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <TextInputWhiteBackground
              name="email"
              type="email"
              placeholder="Enter your email here"
              label="Email"
              register={register}
              error={errors.email}
              validation={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="url"
              type="url"
              placeholder="Enter your URL here"
              label="URL"
              register={register}
              error={errors.url}
              validation={{
                pattern: {
                  value:
                    /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                  message:
                    'Please enter a valid URL starting with http:// or https://',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <SelectInput
              field={genderFieldSalesPerson}
              register={register}
              error={errors.sale_person_id}
              className="form-select-input"
              containerStyle={{ marginBottom: '0px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div className="row g-2 align-items-start">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="lat"
              type="text"
              placeholder="Enter latitude here"
              label="Lat"
              register={register}
              error={errors.lat}
              validation={{
                pattern: {
                  value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/,
                  message: 'Invalid latitude',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="lng"
              type="text"
              placeholder="Enter longitude here"
              label="Lon"
              register={register}
              error={errors.lng}
              validation={{
                pattern: {
                  value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/,
                  message: 'Invalid longitude',
                },
              }}
              containerStyle={{ paddingBottom: '0px' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <MapComponent
            lat={parseFloat(watch('lat')) || 53.7798}
            lng={parseFloat(watch('lng')) || -1.7528}
            onLocationUpdate={(newLat, newLng) => {
              setValue('lat', newLat.toFixed(6));
              setValue('lng', newLng.toFixed(6));
            }}
            id={id}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SelectInput
          field={genderFieldRole}
          register={register}
          error={errors.role_id}
          className="form-select-input"
          containerStyle={{ marginBottom: '20px' }}
        />
      </div>

      <div
        style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px' }}
      >
        <input
          type="checkbox"
          id="is_importer"
          {...register('is_importer_exporter')}
          className="form-check-input mt-0"
        />
        <label
          className="form-check-label ms-2 modal-para-text mb-0"
          htmlFor="is_importer"
          style={{ fontSize: '14px', color: '#666' }}
        >
          Is Importer/Exporter
        </label>
      </div>

      <div
        className="mb-2"
        style={{ display: 'flex', alignItems: 'center', paddingBottom: '0px' }}
      >
        <input
          type="checkbox"
          id="hide_from"
          {...register('hide_from_dealer')}
          className="form-check-input mt-0"
        />
        <label
          className="form-check-label ms-2 modal-para-text mb-0"
          htmlFor="hide_from"
          style={{ fontSize: '14px', color: '#666' }}
        >
          Hide from Dealer Locator results
        </label>
      </div>

      <hr style={{ borderColor: '#E4E4E7', margin: '16px 0', opacity: '1' }} />

      <div>
        <div className="row g-2 align-items-start">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="monday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Monday"
              register={register}
              error={errors.monday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="friday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Friday"
              register={register}
              error={errors.friday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="tuesday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Tuesday"
              register={register}
              error={errors.tuesday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="saturday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Saturday"
              register={register}
              error={errors.saturday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="wednesday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Wednesday"
              register={register}
              error={errors.wednesday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="sunday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Sunday"
              register={register}
              error={errors.sunday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextInputWhiteBackground
              name="thursday"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              label="Thursday"
              register={register}
              error={errors.thursday}
              containerStyle={{ paddingBottom: '20px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerInformationTab;
