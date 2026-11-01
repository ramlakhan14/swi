import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import TextInputBlackBackground from './TextInputBlackBackground';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { setCookie } from 'nookies';
import { loginWithAdmin } from '../services/adminApi';
import { useUser } from '../context/UserContext';

const AdminLoginForm = () => {
    const { setUser } = useUser();
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
            const response = await loginWithAdmin(data);
            if (response.responseCode === 200) {
                showSuccessToast('Login successful!');
                if (response.data) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    setCookie(null, 'token', response.data.access_token, {
                        maxAge: 60 * 60 * 24 * 7,
                        path: '/',
                        secure: false,
                        sameSite: 'lax'
                    });
                    setUser(response?.data);
                    navigate("/");
                }
            } else {
                showErrorToast(response?.message);
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
            <h1 className="login-hedding">Dealer Toolbox Admin Login</h1>
            <div>
                {/* Admin Email Field */}
                <TextInputBlackBackground
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Enter your admin email address here"
                    label="Admin E-mail Address"
                    register={register}
                    error={errors.email}
                    validation={{
                        required: 'Admin email address is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    }}
                    containerStyle={{ paddingBottom: "20px" }}
                />

                {/* Password Field */}
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
                            value: 6,
                            message: 'Password must be at least 6 characters long'
                        }
                    }}
                    containerStyle={{ paddingBottom: "12px" }}
                />

                <p className='login-forgot-password'>
                    <span onClick={() => navigate('/forgot-password')}>Forgot your password?</span>
                </p>

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

export default AdminLoginForm;