import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3002/reset-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className='reset-container'>
      <h2 className='reset-title'>Reset Password</h2>
      <form className='reset-form' onSubmit={handleReset}>
        <div className='form-group'>
          <label className='form-label'>Current Password</label>
          <input
            className='form-input'
            type='password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>New Password</label>
          <input
            className='form-input'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button className='reset-button' type='submit'>
          Reset Password
        </button>
      </form>

      {message && <p className='reset-message'>{message}</p>}
    </div>
  );
};

export default ResetPassword;
