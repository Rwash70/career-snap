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
    receiveEmails: false, // new toggle field
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Replace this URL with your actual backend API endpoint
      const response = await fetch('https://your-backend-api.com/profile', {
        method: 'POST', // or PUT depending on your API
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourToken}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Assume backend returns saved profile data
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
              <strong>Member since:</strong> {formData.memberSince}
            </p>
            <p>
              <label>
                <input
                  type='checkbox'
                  name='receiveEmails'
                  checked={formData.receiveEmails}
                  onChange={handleChange}
                />{' '}
                Receive emails about remote jobs
              </label>
            </p>
            <button
              className='profile-save-button'
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
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
