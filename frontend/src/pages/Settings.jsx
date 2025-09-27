// Settings.jsx - User settings page
// Allows changing notification preferences and account deletion

import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './Settings.css';

const Settings = () => {
  // State for notifications, loading, error, and user data
  const [notifications, setNotifications] = useState({
    enabled: true,
    budgetAlerts: true,
    weeklyReports: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/user/me');
        const userData = response.data;
        
        // Set notification preferences from user data
        if (userData.emailNotifications) {
          setNotifications(userData.emailNotifications);
        }
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Handle notification preference changes
  const handleNotificationChange = async (field, value) => {
    setSaving(true);
    try {
      const updatedNotifications = { ...notifications, [field]: value };
      setNotifications(updatedNotifications);
      
      // Save to backend
      await axios.put('/user/me', {
        emailNotifications: updatedNotifications
      });
      
      // Also save to localStorage for quick access
      localStorage.setItem('emailNotifications', JSON.stringify(updatedNotifications));
      
      // Show success message
      if (window.showToast) {
        window.showToast('Notification preferences updated successfully', 'success');
      }
    } catch (err) {
      setError('Failed to update notification preferences');
      // Revert the change on error
      setNotifications(notifications);
    } finally {
      setSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await axios.delete('/user/me');
      await axios.post('/auth/logout');
      window.location.href = '/auth';
    } catch {
      alert('Failed to delete account');
    }
  };

  if (loading) return <div className="settings-page"><p>Loading...</p></div>;
  if (error) return <div className="settings-page"><p style={{color:'red'}}>{error}</p></div>;

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      {/* Notifications section */}
      <div className="settings-section">
        <h4>Email Notifications</h4>
        <div className="notification-options">
          <label className="notification-label">
            <input 
              type="checkbox" 
              checked={notifications.enabled} 
              onChange={e => handleNotificationChange('enabled', e.target.checked)}
              disabled={saving}
            /> 
            <span>Enable all email notifications</span>
            {saving && <span className="saving-indicator"> (Saving...)</span>}
          </label>
          
          {notifications.enabled && (
            <div className="sub-options">
              <label className="notification-label">
                <input 
                  type="checkbox" 
                  checked={notifications.budgetAlerts} 
                  onChange={e => handleNotificationChange('budgetAlerts', e.target.checked)}
                  disabled={saving}
                /> 
                <span>Budget alerts (when you exceed spending limits)</span>
              </label>
              
              <label className="notification-label">
                <input 
                  type="checkbox" 
                  checked={notifications.weeklyReports} 
                  onChange={e => handleNotificationChange('weeklyReports', e.target.checked)}
                  disabled={saving}
                /> 
                <span>Weekly spending reports</span>
              </label>
            </div>
          )}
        </div>
        
        {error && <p className="error-message">{error}</p>}
      </div>
      
      {/* Account section for delete */}
      <div className="settings-section">
        <h4>Account</h4>
        <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default Settings;
