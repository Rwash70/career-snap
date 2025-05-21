import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css'; // <-- Your CSS file

function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     navigate('/profile');
  //   }
  // }, [navigate]);

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
      const res = await axios.post('http://localhost:3002/signin', formData);
      localStorage.setItem('token', res.data.token);
      alert('Signed in successfully!');
      setFormData({ email: '', password: '' });
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin-container'>
      <form onSubmit={handleSubmit} className='signin-form'>
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
        />

        <button type='submit' disabled={loading} className='submit-button'>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {error && <p className='error-message'>{error}</p>}
      </form>

      <p className='forgot-password-text'>
        Forgot your password?{' '}
        <Link to='/reset-password' className='forgot-password-link'>
          Reset Password
        </Link>
      </p>

      <p className='switch-form'>
        Don't have an account?{' '}
        <Link to='/signup' className='signup-link'>
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default SignIn;
