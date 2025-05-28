import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SignUp.css';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.careersnap.l5.ca'
    : 'http://localhost:3003';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      navigate('/signin');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='signup-main'>
      <section className='signup-container'>
        <button className='close-button-signup' onClick={() => navigate('/')}>
          ×
        </button>
        <form onSubmit={handleSubmit} className='signup-form'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
            aria-label='Name'
            required
            className='form-input'
          />

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
            aria-label='Email address'
            required
            className='form-input'
            autoComplete='username'
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
            aria-label='Password'
            required
            className='form-input'
            autoComplete='new-password'
          />

          <button type='submit' disabled={loading} className='submit-button'>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>

          <p className='account-text'>
            Already have an account?{' '}
            <Link to='/signin' className='signin-link'>
              Sign In
            </Link>
          </p>

          {error && <p className='error-message'>{error}</p>}
          {success && <p className='success-message'>{success}</p>}
        </form>
      </section>
    </main>
  );
}

export default SignUp;
