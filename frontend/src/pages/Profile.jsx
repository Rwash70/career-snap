// Profile.jsx
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

  const handleBackHome = () => navigate('/');

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
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        const updated = {
          name: data.name || '',
          email: data.email || '',
          memberSince: data.memberSince || '',
          receiveEmails: data.receiveEmails || false,
          preferences: data.preferences || '',
        };
        setProfileData(updated);
        setFormData(updated);
      } catch {
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
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'radio'
          ? value === 'true'
          : value,
    }));
  };
  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    if (!/^\d{4}$/.test(formData.memberSince)) {
      setMessage('Please enter a valid 4-digit year.');
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
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
      if (!res.ok) throw new Error('Failed to save profile');
      const result = await res.json();
      const updated = {
        ...profileData,
        memberSince: result.profile.memberSince,
        receiveEmails: result.profile.receiveEmails,
        preferences: result.profile.preferences,
      };
      setProfileData(updated);
      setFormData(updated);
      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (err) {
      setMessage(err.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '/signin';
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
            <div className='profile-fields-group'>
              <div className='input-block'>
                <label>Name:</label>
                <input type='text' name='name' value={formData.name} disabled />
              </div>
              <div className='input-block'>
                <label>Email:</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  disabled
                />
              </div>
              <div className='input-block'>
                <label>Member Since:</label>
                <input
                  type='text'
                  name='memberSince'
                  value={formData.memberSince}
                  onChange={handleChange}
                />
              </div>
              <div className='input-block'>
                <label>Work Preference:</label>
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
              </div>
            </div>

            <div className='button-group'>
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
            </div>
          </>
        ) : (
          <>
            <div className='profile-fields-group'>
              <div className='input-block'>
                <label>Name:</label> {profileData.name}
              </div>
              <div className='input-block'>
                <label>Email:</label> {profileData.email}
              </div>
              <div className='input-block'>
                <label>Member Since:</label> {profileData.memberSince}
              </div>
              <div className='input-block'>
                <label>Work Preference:</label>{' '}
                {profileData.preferences || 'Not selected'}
              </div>
            </div>

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
