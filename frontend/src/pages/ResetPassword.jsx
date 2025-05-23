import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Helper to get query param 'token' from URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  };

  const token = getTokenFromUrl();

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('No reset token provided.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        { newPassword, token }
      );
      setMessage(res.data.message || 'Password reset successful!');
      setNewPassword('');

      // Optional: redirect to login after a delay
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='reset-container'>
      <h2 className='reset-title'>Reset Password</h2>
      <form className='reset-form' onSubmit={handleReset}>
        {/* Hidden username/email field for accessibility */}
        <input
          type='email'
          name='email'
          value='' // or your email if you have it
          readOnly
          hidden
          autoComplete='username'
          tabIndex={-1}
        />

        <div className='form-group'>
          <label className='form-label'>New Password</label>
          <input
            className='form-input'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder='Enter new password'
            autoComplete='new-password'
          />
        </div>

        <button className='reset-button' type='submit' disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {message && <p className='reset-message success'>{message}</p>}
      {error && <p className='reset-message error'>{error}</p>}
    </div>
  );
};

export default ResetPassword;
