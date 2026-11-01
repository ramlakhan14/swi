import React, { useEffect, useState } from 'react';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import AddIcon from '../../assets/icons/ic-add.png';
import { useFieldArray } from 'react-hook-form';

const ModelsTab = ({ register, errors, isModalData, control }) => {

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "model"
  });

  const addMoreOptionalLink = () => {
    append({ model_number: '' });
  };

  const removeAdditionalOptionalLink = (index) => {
    remove(index);
  };

  useEffect(() => {
    if (isModalData && isModalData.length > 0) {
      replace(isModalData);
    } else {
      replace([{ model_number: '' }]);
    }
  }, [isModalData, replace]);

  return (
    <div id="modal-section">
      <hr style={{ borderColor: "#E4E4E7", margin: "16px 0", opacity: "1" }} />
      <div className='formHeadingWrapper-flex'>
        <p className='formHeading-flex'>Model #</p>
        <div className='line'></div>
      </div>
      <div className='row' style={{ paddingTop: "20px" }}>
        {fields.map((field, index) => (
          <div key={field.id} style={{ paddingBottom: "20px" }}>
            <div className="row g-4">
              <div className="col-12 col-sm">
                <TextInputWhiteBackground
                  name={`model[${index}].model_number`}
                  type="text"
                  placeholder="Text"
                  label={`Modal #${index + 1}`}
                  register={register}
                 error={errors?.model?.[index]?.model_number}
                  validation={{
                    // required: 'Model number is required',
                    minLength: {
                      value: 3,
                      message: 'Model number must be at least 3 characters long'
                    },
                    maxLength: {
                      value: 255,
                      message: 'Model number cannot be more than 255 characters'
                    }
                  }}
                />
              </div>
              {index > 0 && (
                <div className="col-12 col-sm-auto">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeAdditionalOptionalLink(index)}
                    style={{ fontSize: "12px" }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: "20px" }}>
          <p className='modal-headding-text mb-0' style={{ fontWeight: "400", display: "inline-flex", alignItems: "center" }}>
            Add More Model #
            <img
              role='button'
              onClick={addMoreOptionalLink}
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
    </div>
  );
};

export default ModelsTab;
