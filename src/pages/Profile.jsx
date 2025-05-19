import { useState } from 'react';
import './Profile.css';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    email: 'JaneD@example.com',
    memberSince: '2024',
    receiveEmails: false,
    preferences: '', // ✅ New field
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === 'true',
      }));
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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      const savedProfile = await response.json();
      setProfileData(savedProfile);
      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage(error.message || 'Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='profile-wrapper'>
      <h1 className='profile-title'>Your Profile</h1>
      <p className='profile-text'>Manage your account and settings here.</p>

      <div className='profile-card'>
        {isEditing ? (
          <>
            <p>
              <strong>Name:</strong>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
              />
            </p>

            <p>
              <strong>Email:</strong>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
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

            {/* ✅ New Preferences Dropdown */}
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
              {profileData.preferences || 'Not selected'}
            </p>
            <button className='profile-edit-button' onClick={handleEdit}>
              Edit
            </button>
          </>
        )}
        {message && <p className='profile-message'>{message}</p>}
      </div>
    </div>
  );
}
