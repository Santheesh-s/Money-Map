// BudgetModal.jsx - Modal for creating and editing budgets
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import './BudgetModal.css';

const BudgetModal = ({ isOpen, onClose, onSave, initialData, categories = [] }) => {
  const [formData, setFormData] = useState({
    type: 'monthly',
    category: '',
    amount: '',
    currency: 'INR',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    notifications: {
      enabled: true,
      threshold: 80
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          type: initialData.type || 'monthly',
          category: initialData.category || '',
          amount: initialData.amount || '',
          currency: initialData.currency || 'INR',
          month: initialData.month || new Date().getMonth() + 1,
          year: initialData.year || new Date().getFullYear(),
          notifications: initialData.notifications || {
            enabled: true,
            threshold: 80
          }
        });
      } else {
        setFormData({
          type: 'monthly',
          category: '',
          amount: '',
          currency: 'INR',
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          notifications: {
            enabled: true,
            threshold: 80
          }
        });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        notifications: {
          ...formData.notifications,
          threshold: parseInt(formData.notifications.threshold)
        }
      };

      if (initialData) {
        // Update existing budget
        await axios.put(`/budgets/${initialData._id}`, payload);
        if (window.showToast) window.showToast('Budget updated successfully!', 'success');
      } else {
        // Create new budget
        const response = await axios.post('/budgets', payload);
        console.log('Budget created:', response.data);
        if (window.showToast) window.showToast('Budget created successfully!', 'success');
      }

      // Dispatch budget event to refresh data
      window.dispatchEvent(new CustomEvent('budgetUpdated'));
      
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
      if (window.showToast) window.showToast('Failed to save budget', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  return (
    <div className="modal-overlay">
      <div className="budget-modal">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Budget' : 'Create New Budget'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="budget-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Budget Type *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="monthly"
                  checked={formData.type === 'monthly'}
                  onChange={handleChange}
                />
                Monthly Budget
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="category"
                  checked={formData.type === 'category'}
                  onChange={handleChange}
                />
                Category Budget
              </label>
            </div>
          </div>

          {formData.type === 'category' && (
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Amount *</label>
            <div className="amount-input">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder="Enter budget amount"
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Month *</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              >
                {months.map((month, index) => (
                  <option key={index + 1} value={index + 1}>{month}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Year *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications.enabled"
                checked={formData.notifications.enabled}
                onChange={handleChange}
              />
              Enable spending notifications
            </label>
          </div>

          {formData.notifications.enabled && (
            <div className="form-group">
              <label>Notification Threshold (%)</label>
              <input
                type="number"
                name="notifications.threshold"
                value={formData.notifications.threshold}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="80"
              />
              <small>You'll be notified when you reach this percentage of your budget</small>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
