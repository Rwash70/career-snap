import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import { BASE_URL } from '../utils/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/forgot-password`, {
        email,
      });
      setMessage(
        res.data.message ||
          'If your email is registered, you will receive reset instructions.'
      );
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='forgot-container'>
      <h2 className='forgot-title'>Forgot Password</h2>
      <form className='forgot-form' onSubmit={handleSubmit}>
        <label htmlFor='email' className='forgot-label'>
          Email Address
        </label>
        <input
          id='email'
          type='email'
          className='forgot-input'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
          autoComplete='username'
        />
        <button className='forgot-button' type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <div className='forgot-footer'>
          <Link to='/signin' className='forgot-link'>
            Back to Sign In
          </Link>
        </div>
      </form>

      {message && <p className='forgot-message success'>{message}</p>}
      {error && <p className='forgot-message error'>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
