import React, { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import TextInputWhiteBackground from '../TextInputWhiteBackground';
import { IconEyeClosed } from '../../assets/icons/iconEyeClosed';
import { IconEye } from '../../assets/icons/IconEye';
import AddIcon from "../../assets/icons/ic-add.png";
import deleteIcon from "../../assets/icons/ic-trash-black.png";
import { deleteDealerUser } from '../../services/userApi';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtils';

const DealerUsersTab = ({ register, errors, isUserType, control, watch, setIsDealerUsers }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "dealer_user"
    });

    const dealerUsers = watch("dealer_user");
    useEffect(() => {
        if (fields.length === 0) {
            append({
                first_name: '',
                last_name: '',
                email: '',
                password_string: '',
                edi_id: '',
                edi_password: '',
                sub_role_id: ''
            });
        }
    }, []);

    const removeAdditionalUser = async (index) => {
        const user = dealerUsers[index];
        if (user?.id) {
            try {
                setIsDealerUsers(true)
                const response = await deleteDealerUser(user.id);
                showSuccessToast(response?.message);
                remove(index);
            } catch (error) {
                showErrorToast(error?.response?.data?.messages || "An error occurred");
            } finally {
                setIsDealerUsers(false)
            }
        } else {
            remove(index);
        }
    };

    const addMoreUser = () => {
        append({
            first_name: '',
            last_name: '',
            email: '',
            password_string: '',
            edi_id: '',
            edi_password: '',
            sub_role_id: ''
        });
    };

    return (
        <div>
            <hr style={{ borderColor: "#E4E4E7", margin: "16px 0", opacity: "1" }} />

            {fields.map((field, index) => (
                <div key={field.id} className='dealer-user' style={{ marginBottom: index >= 0 ? "16px" : "0" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <div className="row g-2 align-items-start">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextInputWhiteBackground
                                    name={`dealer_user.${index}.first_name`}
                                    type="text"
                                    placeholder="Enter first name here"
                                    label="First Name"
                                    register={register}
                                    error={errors?.dealer_user?.[index]?.first_name}
                                    validation={{
                                        required: 'First Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'First Name must be at least 2 characters long'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "0px" }}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextInputWhiteBackground
                                    name={`dealer_user.${index}.last_name`}
                                    type="text"
                                    placeholder="Enter last name here"
                                    label="Last Name"
                                    register={register}
                                    error={errors?.dealer_user?.[index]?.last_name}
                                    validation={{
                                        // required: 'Last Name is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Last Name must be at least 2 characters long'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "0px" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <div className="row g-2 align-items-start">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextInputWhiteBackground
                                    name={`dealer_user.${index}.email`}
                                    type="email"
                                    placeholder="Enter email here"
                                    label="Email"
                                    register={register}
                                    error={errors?.dealer_user?.[index]?.email}
                                    validation={{
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "0px" }}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextInputWhiteBackground
                                    name={`dealer_user.${index}.password_string`}
                                    type="password"
                                    placeholder="Enter password here"
                                    label="Password"
                                    register={register}
                                    error={errors?.dealer_user?.[index]?.password_string}
                                    validation={{
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters long'
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{8,}$/,
                                            message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and no spaces'
                                        }
                                    }}
                                    containerStyle={{ paddingBottom: "0px" }}
                                    icon={<IconEye />}
                                    changeIcon={<IconEyeClosed />}
                                    changeType="text"
                                // disabled={!!dealerUsers?.[index]?.id}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <div className="row g-2 align-items-start">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextInputWhiteBackground
                                    name={`dealer_user.${index}.edi_id`}
                                    type="text"
                                    placeholder="Enter EDI ID here"
                                    label="EDI ID"
                                    register={register}
                                    error={errors?.dealer_user?.[index]?.edi_id}
                                    validation={{
                                        // required: 'EDI ID is required'
                                    }}
                                    containerStyle={{ paddingBottom: "0px" }}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <TextInputWhiteBackground
                                    name={`dealer_user.${index}.edi_password`}
                                    type="password"
                                    placeholder="Enter EDI password here"
                                    label="EDI Password"
                                    register={register}
                                    error={errors?.dealer_user?.[index]?.edi_password}
                                    validation={{
                                        // required: 'EDI Password is required',
                                        minLength: {
                                            value: 4,
                                            message: 'EDI Password must be at least 4 characters long'
                                        },
                                        // pattern: {
                                        //     value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?!.*\s).{4,}$/,
                                        //     message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and no spaces'
                                        // }
                                    }}
                                    containerStyle={{ paddingBottom: "0px" }}
                                    icon={<IconEye />}
                                    changeIcon={<IconEyeClosed />}
                                    changeType="text"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-between align-items-start'>
                        <div className='d-flex align-items-start gap-3'>
                            {isUserType?.map((item, roleIndex) => {
                                const selectedRole = watch(`dealer_user.${index}.sub_role_id`);

                                return (
                                    <div className='d-flex align-items-start' key={roleIndex}>
                                        <input
                                            type="radio"
                                            id={`power_dealer_enabled_${index}_${roleIndex}`}
                                            {...register(`dealer_user.${index}.sub_role_id`, {
                                                required: "Please select a role",
                                            })}
                                            value={item.value}
                                            className={`form-check-input mt-0 ${errors?.dealer_user?.[index]?.sub_role_id ? 'is-invalid' : ''}`}
                                            defaultChecked={selectedRole == item.value}
                                            style={{ cursor: "pointer" }}
                                        />

                                        <label
                                            className="form-check-label ms-2 modal-para-text mb-0"
                                            htmlFor={`power_dealer_enabled_${index}_${roleIndex}`}
                                            style={{ fontSize: '14px', color: '#666', cursor: "pointer" }}
                                        >
                                            {item.label}
                                        </label>
                                    </div>


                                );
                            })}

                        </div>
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeAdditionalUser(index)}
                                className="btn btn-link p-0 text-center"
                                style={{ textDecoration: 'none', fontSize: '14px', color: "#3F3F47" }}
                            >
                                <img src={deleteIcon} alt="delete-Icon" loading="lazy" height={"24px"} width={"24px"} />
                                <span className='ms-2'>Delete User</span>
                            </button>
                        )}
                    </div>

                    {index < fields.length - 1 && (
                        <hr style={{ borderColor: "#E4E4E7", margin: "16px 0", opacity: "1" }} />
                    )}
                </div>
            ))}

            <div style={{ marginTop: "16px" }}>
                <p className='modal-headding-text mb-0' style={{ fontWeight: "400" }}>
                    Add New Dealer User
                    <img
                        role='button'
                        onClick={addMoreUser}
                        src={AddIcon}
                        alt='Add Icon'
                        width={"24px"}
                        height={"24px"}
                        className='ms-2'
                        style={{ cursor: 'pointer' }}
                    />
                </p>
            </div>
        </div>
    );
};

export default DealerUsersTab;