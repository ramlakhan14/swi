import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HelmetComponent from '../components/HelmetComponent';
import { useForm } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import TextInputBlackBackground from '../components/TextInputBlackBackground';
import { resetPassword } from '../services/adminApi';
import bgImg from "../assets/icons/login.png"

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onChange'
    });
    const newPassword = watch('password');
    const currentYear = new Date().getFullYear();
    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                email: email
            }
            const response = await resetPassword(payload);
            showSuccessToast(response?.message);
            if (response?.responseCode === 200) {
                if (response?.data?.role_id === 1) {
                    navigate('/login-admin')
                } else {
                    navigate('/login')
                }
            }
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to forget password");
            }
            showErrorToast(error?.response?.data?.message)
        }
    };
    return (
        <>
            <HelmetComponent
                title="Dealer Toolbox Forgot Password | SWI"
                description="This is the description for the Dealer Toolbox Forgot Password page."
                keywords="react, helmet, seo"
                canonicalUrl="forgot-password"
                customMeta={[
                    { name: "robots", content: "index, follow" },
                    { name: "author", content: "Ritik Jain" },
                    { property: "og:title", content: "My React App" }
                ]}
            />
            <div className="container-fluid" style={{ paddingBottom: "20px" }}>
                <div className="container">
                    <div className="row outer-div">
                        <div className="col-12 col-lg-6 col-md-6 col-sm-12 p-0 d-flex flex-column order-2 order-md-1">
                            <div className='left-side-div flex-grow-1'>
                                <img src={bgImg} alt='baner-img' loading="lazy" width={"100%"} height={"auto"} />
                                <p className='copyright-text admin-login-page' style={{ paddingTop: "20px" }}>Copyright © {currentYear}, Steven Willand Inc.</p>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6 col-md-6 col-sm-12 p-0 d-flex flex-column order-1 order-md-2">
                            <div className="right-side-div flex-grow-1 admin-login">
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <h1 className="login-hedding">Dealer Toolbox Reset Password</h1>
                                    <div>
                                        <TextInputBlackBackground
                                            name="token"
                                            type="text"
                                            placeholder="Enter your new password here"
                                            label="Verification Code"
                                            register={register}
                                            error={errors.token}
                                            validation={{
                                                required: 'Verification Code is required'

                                            }}
                                            containerStyle={{ paddingBottom: "20px" }}
                                        />
                                        <TextInputBlackBackground
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password here"
                                            label="Password"
                                            register={register}
                                            error={errors.password}
                                            validation={{
                                                required: 'Password is required',
                                                minLength: {
                                                    value: 8,
                                                    message: 'Password must be at least 8 characters long'
                                                },
                                                maxLength: {
                                                    value: 20,
                                                    message: 'Password cannot be more than 20 characters'
                                                },
                                                validate: {
                                                    hasUpperCase: (value) =>
                                                        /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                                                    hasLowerCase: (value) =>
                                                        /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                                                    hasSpecialChar: (value) =>
                                                        /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character'
                                                }
                                            }}
                                            containerStyle={{ paddingBottom: "32px" }}
                                        />

                                        <TextInputBlackBackground
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="Enter your confirm  password here"
                                            label="Confirm Password"
                                            register={register}
                                            error={errors.password_confirmation}
                                            validation={{
                                                required: 'Confirm password is required',
                                                maxLength: {
                                                    value: 20,
                                                    message: 'Confirm password cannot be more than 20 characters'
                                                },
                                                validate: (value) =>
                                                    value === newPassword || 'Passwords do not match'
                                            }}

                                            containerStyle={{ paddingBottom: "32px" }}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-success green-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit '
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <div>
                                    <p className='login-paragraph mb-0 pb-0'>Remember your password?<span className='login-here' onClick={() => navigate('/login-admin')}>Login Here</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}