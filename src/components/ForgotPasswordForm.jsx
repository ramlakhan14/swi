import { useForm } from 'react-hook-form';
import TextInputBlackBackground from './TextInputBlackBackground';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { forgotPassword } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        try {
            const response = await forgotPassword(data);
            showSuccessToast(response?.message);
            if (response?.responseCode === 200) {
                navigate('/reset-password', {
                    state: { email: response?.data?.email }
                });
            }
        } catch (error) {
            if (error?.response?.data.responseCode === 422) {
                return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to forget password");
            }
            showErrorToast(error?.response?.data?.message)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h1 className="login-hedding">Dealer Toolbox Forgot Password</h1>
            <div>
                <TextInputBlackBackground
                    name="email"
                    type="email"
                    placeholder="Enter your email address here"
                    label="Email Address"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    }}
                    containerStyle={{ paddingBottom: "20px" }}
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
    )
};

export default ForgotPasswordForm;