// Profile.jsx - User profile page
// Allows viewing and editing of user profile information, and logout

import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './Profile.css';

const Profile = () => {
  // State for user data, edit mode, form fields, loading, and error
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    email: '',
    emailNotifications: {
      enabled: true,
      budgetAlerts: true,
      weeklyReports: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    axios.get('/user/me')
      .then(res => {
        setUser(res.data); // Set user data from response
        setForm({ 
          name: res.data.name, 
          email: res.data.email,
          emailNotifications: res.data.emailNotifications || {
            enabled: true,
            budgetAlerts: true,
            weeklyReports: false
          }
        }); // Initialize form fields
      })
      .catch(() => setError('Failed to load user info')) // Handle fetch error
      .finally(() => setLoading(false)); // Stop loading spinner
  }, []);

  // Save updated profile info
  const handleSave = async () => {
    try {
      setLoading(true); // Show loading spinner
      const res = await axios.put('/user/me', form); // Send updated data to backend
      setUser(res.data); // Update user state with new data
      setEditMode(false); // Exit edit mode
    } catch {
      setError('Failed to update profile'); // Show error if update fails
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Show loading, error, or profile content
  if (loading) return <div className="profile-page"><p>Loading...</p></div>;
  if (error) return <div className="profile-page"><p style={{color:'red'}}>{error}</p></div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        {/* Avatar and profile info */}
        <img className="profile-avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} alt="avatar" />
        <div>
          {editMode ? (
            <>
              {/* Editable input fields for name and email */}
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </>
          ) : (
            <>
              {/* Display user info */}
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          )}
        </div>
      </div>
      {/* Email Notification Settings */}
      <div className="notification-settings">
        <h3>Email Notifications</h3>
        <div className="notification-options">
          <label className="notification-option">
            <input
              type="checkbox"
              checked={form.emailNotifications.enabled}
              onChange={e => setForm(f => ({
                ...f,
                emailNotifications: { ...f.emailNotifications, enabled: e.target.checked }
              }))}
            />
            <span>Enable email notifications</span>
          </label>
          
          <label className="notification-option">
            <input
              type="checkbox"
              checked={form.emailNotifications.budgetAlerts}
              disabled={!form.emailNotifications.enabled}
              onChange={e => setForm(f => ({
                ...f,
                emailNotifications: { ...f.emailNotifications, budgetAlerts: e.target.checked }
              }))}
            />
            <span>Budget alerts (threshold and exceeded notifications)</span>
          </label>
          
          <label className="notification-option">
            <input
              type="checkbox"
              checked={form.emailNotifications.weeklyReports}
              disabled={!form.emailNotifications.enabled}
              onChange={e => setForm(f => ({
                ...f,
                emailNotifications: { ...f.emailNotifications, weeklyReports: e.target.checked }
              }))}
            />
            <span>Weekly financial reports (coming soon)</span>
          </label>
        </div>
      </div>

      <div className="profile-actions">
        {/* Edit, Save, Cancel, and Logout buttons */}
        {editMode ? (
          <>
            <button className="profile-btn" onClick={handleSave}>Save</button>
            <button className="profile-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="profile-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            <button className="profile-btn" onClick={async () => { await axios.post('/auth/logout'); window.location.href = '/auth'; }}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;

