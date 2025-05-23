import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';

function SignIn({ isLoggedIn, setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message || '';

  useEffect(() => {
    // Redirect if already logged in
    if (isLoggedIn) {
      sessionStorage.setItem('redirectMessage', "You're already signed in.");
      navigate('/');
    }

    // localStorage.removeItem('token');
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:3002/api/auth/signin',
        formData
      );
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.data.token}`;
      setIsLoggedIn(true);

      toast.success('Signed in successfully!');
      setFormData({ email: '', password: '' });

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className='signin-container'>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='signin-form'>
        <button
          className='close-button-signin'
          onClick={handleClose}
          type='button'
        >
          &times;
        </button>

        {redirectMessage && (
          <p className='redirect-message'>{redirectMessage}</p>
        )}

        <label htmlFor='email' className='form-label'>
          Email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Email'
          className='form-input'
          required
          autoComplete='email'
        />

        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          id='password'
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Password'
          className='form-input'
          required
          autoComplete='current-password'
        />

        <button type='submit' disabled={loading} className='submit-button'>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className='forgot-password'>
          <Link to='/forgot-password' className='forgot-password-link'>
            Forgot Password?
          </Link>
        </p>

        {error && <p className='error-message'>{error}</p>}

        <p className='switch-form'>
          Don't have an account?{' '}
          <Link to='/signup' className='signup-link'>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
