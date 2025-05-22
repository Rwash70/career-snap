import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    email: 'JaneD@example.com',
    memberSince: '2024',
    receiveEmails: false,
    preferences: '',
  });

  const [formData, setFormData] = useState(profileData);

  const handleBackHome = () => {
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/signin', {
        state: { message: 'Please log in to view your profile.' },
      });
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await res.json();

        const updatedData = {
          name: data?.name || '',
          email: data?.email || '',
          memberSince: data?.memberSince || '',
          receiveEmails: data?.receiveEmails || false,
          preferences: data?.preferences || '',
        };

        setProfileData(updatedData);
        setFormData(updatedData);
      } catch (error) {
        console.error(error);
        navigate('/signin', {
          state: { message: 'Session expired. Please log in again.' },
        });
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    // Frontend Validation
    if (!/^\d{4}$/.test(formData.memberSince)) {
      setMessage('Please enter a valid 4-digit year for "Member Since".');
      setLoading(false);
      return;
    }

    if (!formData.preferences) {
      setMessage('Please select a work preference.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          memberSince: formData.memberSince,
          preferences: formData.preferences,
          receiveEmails: formData.receiveEmails,
        }),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      const result = await response.json();

      setProfileData({
        name: profileData.name,
        email: profileData.email,
        memberSince: result.profile.memberSince,
        receiveEmails: result.profile.receiveEmails,
        preferences: result.profile.preferences,
      });

      setFormData({
        name: profileData.name,
        email: profileData.email,
        memberSince: result.profile.memberSince,
        receiveEmails: result.profile.receiveEmails,
        preferences: result.profile.preferences,
      });

      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage(error.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin', { state: { message: 'You have been logged out.' } });
  };

  return (
    <div className='profile-wrapper'>
      <h1 className='profile-title'>Your Profile</h1>
      <p className='profile-text'>Manage your account and settings here.</p>

      <button className='back-home-button' onClick={handleBackHome}>
        ← Back to Home
      </button>

      <div className='profile-card'>
        {isEditing ? (
          <>
            <p>
              <strong>Name:</strong>
              <input type='text' name='name' value={formData.name} disabled />
            </p>
            <p>
              <strong>Email:</strong>
              <input
                type='email'
                name='email'
                value={formData.email}
                disabled
              />
            </p>
            <p>
              <strong>Member since:</strong>
              <input
                type='text'
                name='memberSince'
                value={formData.memberSince}
                onChange={handleChange}
              />
            </p>
            <p>
              <strong>Receive emails about remote jobs:</strong>
            </p>
            <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  name='receiveEmails'
                  value='true'
                  checked={formData.receiveEmails === true}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type='radio'
                  name='receiveEmails'
                  value='false'
                  checked={formData.receiveEmails === false}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
            <p>
              <strong>Work Preference:</strong>
              <select
                name='preferences'
                value={formData.preferences}
                onChange={handleChange}
                className='preferences-dropdown'
              >
                <option value=''>-- Select --</option>
                <option value='Full-time'>Full-time</option>
                <option value='Part-time'>Part-time</option>
                <option value='Hybrid'>Hybrid</option>
              </select>
            </p>

            <button
              className='profile-save-button'
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              className='profile-cancel-button'
              onClick={() => {
                setIsEditing(false);
                setFormData(profileData);
                setMessage('');
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {profileData.name}
            </p>
            <p>
              <strong>Email:</strong> {profileData.email}
            </p>
            <p>
              <strong>Member since:</strong> {profileData.memberSince}
            </p>
            <p>
              <strong>Receive emails about remote jobs:</strong>{' '}
              {profileData.receiveEmails ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Work Preference:</strong>{' '}
              <span className='preference-dropdown'>
                {profileData.preferences || 'Not selected'}
              </span>
            </p>
            <button className='profile-edit-button' onClick={handleEdit}>
              Edit
            </button>
          </>
        )}
        {message && <p className='profile-message'>{message}</p>}
      </div>

      <button className='logout-button' onClick={handleLogout}>
        <FaSignOutAlt style={{ marginRight: '8px' }} />
        Logout
      </button>
    </div>
  );
}
