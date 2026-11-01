import React from 'react';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import TextAreaInput from '../TextAreaInput';
import FileInputWhiteBackground from '../FileInputWhiteBackground';

const PowerDealerInfoTab = ({ register, errors, existingFiles }) => {
    
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: "20px" }}>
                <input
                    type="checkbox"
                    id="power_dealer_enabled"
                    {...register("power_dealer_enabled")}
                    className='form-check-input mt-0'
                />
                <label
                    className="form-check-label ms-2 modal-para-text mb-0"
                    htmlFor="power_dealer_enabled"
                    style={{ fontSize: '14px', color: '#666' }}
                >
                    Power Dealer Enabled
                </label>
            </div>

            {/* Other Hours */}
            <TextInputWhiteBackground
                name="other_hours"
                type="text"
                placeholder="Other Hours"
                label="Other Hours"
                register={register}
                error={errors.other_hours}
                // validation={{
                //     required: 'Other Hours is required'
                // }}
                containerStyle={{ paddingBottom: "20px" }}
            />

            {/* Dealer Description */}
            <TextAreaInput
                name="descriptions"
                placeholder="Dealer Description"
                label="Dealer Description"
                register={register}
                error={errors.descriptions}
                // validation={{
                //     required: 'Dealer Description is required'
                // }}
                containerStyle={{ paddingBottom: "20px" }}
                rows={4}
            />

            {/* Optional Logo */}
            <div className="row align-items-center" style={{ paddingBottom: "20px" }}>
                <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
                    <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
                        Optional Logo:
                    </p>
                </div>
                <div className="col-12 col-sm-auto mb-0">
                    {existingFiles?.logo?.url !== null  &&  (
                        <div style={{
                            marginBottom: '8px',
                            fontSize: '13px',
                            color: '#666',
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                        }}>
                            Current file: <a href={existingFiles?.logo?.url} target="_blank" rel="noopener noreferrer">
                                {"Download the file"}
                            </a>
                            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: '#888' }}>
                                Upload a new file to replace
                            </span>
                        </div>
                    )}
                    <FileInputWhiteBackground
                        name="logo"
                        label="Choose File"
                        register={register}
                        error={errors.logo}
                        accept=".jpg,.jpeg,.png,.pdf,.doc"
                        validation={{
                            required: !existingFiles?.logo ? "Please select a file" : false,
                            validate: {
                                fileSize: (files) =>
                                    !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB"
                            }
                        }}
                    />
                </div>
            </div>

            {/* Optional Photo */}
            <div className="row align-items-center" style={{ paddingBottom: "20px" }}>
                <div className="col-12 col-sm-auto" style={{ minWidth: "180px" }}>
                    <p className="modal-headding-text mb-0" style={{ fontWeight: "500" }}>
                        Optional Photo:
                    </p>
                </div>
                <div className="col-12 col-sm-auto mb-0">
                    {existingFiles?.photo?.url !== null && (
                        <div style={{
                            marginBottom: '8px',
                            fontSize: '13px',
                            color: '#666',
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px'
                        }}>
                            Current file: <a href={existingFiles?.photo?.url} target="_blank" rel="noopener noreferrer">
                                {"Download the file"}
                            </a>
                            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px', color: '#888' }}>
                                Upload a new file to replace
                            </span>
                        </div>
                    )}
                    <FileInputWhiteBackground
                        name="photo"
                        label="Choose File"
                        register={register}
                        error={errors.photo}
                        accept=".jpg,.jpeg,.png,.pdf,.doc"
                        validation={{
                             required: !existingFiles?.photo ? "Please select a file" : false,
                            validate: {
                                fileSize: (files) =>
                                    !files[0] || files[0].size <= 5000000 || "File size must be less than 5MB"
                            }
                        }}
                    />
                </div>
            </div>

            {/* Custom URL */}
            {/* <TextInputWhiteBackground
                name="custom_url"
                type="text"
                placeholder="Custom URL"
                label="Custom URL"
                register={register}
                error={errors.custom_url}
                validation={{
                    required: true,
                    pattern: {
                        value: /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                        message: 'Please enter a valid URL starting with http:// or https://'
                    }
                }}
                containerStyle={{ paddingBottom: "0px" }}
            /> */}
        </div>
    );
};

export default PowerDealerInfoTab;
