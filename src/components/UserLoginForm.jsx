import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import TextInputBlackBackground from './TextInputBlackBackground';
import { loginWithDealer } from '../services/dealerApi';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { setCookie } from 'nookies';
import { useUser } from '../context/UserContext';

const UserLoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginWithDealer(data);
      if (response.responseCode === 200) {
        showSuccessToast('Login successful!');
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response?.data?.user));
          setCookie(null, 'token', response?.data?.token, {
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            secure: false,
            sameSite: 'lax'
          });
          setUser(response?.data?.user);
          navigate("/");
        }
      } else {
        showErrorToast(response?.message);
      }
    } catch (error) {
      if (error?.response?.data.responseCode === 422) {
        return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to forget password");
      }
      showErrorToast(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="login-hedding">Dealer Toolbox Login</h1>
      <div>
        {/* Dealer Number Field */}
        <TextInputBlackBackground
          name="login"
          type="text"
          placeholder="Enter your dealer number here"
          label="Dealer Number/Email"
          register={register}
          error={errors.login}
          validation={{
            required: 'Dealer Number is required'
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
              value: 8,
              message: 'Password must be at least 8 characters long'
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

export default UserLoginForm;