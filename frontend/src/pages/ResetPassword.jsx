// src/pages/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams(); // Token from URL

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
        { newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(res.data.message || 'Password reset successful!');
      setNewPassword('');

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
        {/* Hidden email field for accessibility/autofill support */}
        <input
          type='text'
          name='email'
          autoComplete='username'
          value='reset-user'
          hidden
          readOnly
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
