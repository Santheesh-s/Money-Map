// BudgetCard.jsx - Component for displaying individual budget information
import React from 'react';
import { MdCheckCircle, MdWarningAmber, MdError, MdEdit, MdDelete } from 'react-icons/md';
import './BudgetCard.css';

const BudgetCard = ({ budget, onEdit, onDelete, currency = 'INR' }) => {
  const {
    type,
    category,
    amount,
    currentSpending,
    remaining,
    percentageUsed,
    isOverBudget,
    month,
    year,
    notifications
  } = budget;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = () => {
    if (isOverBudget) return '#e53935';
    if (percentageUsed >= (notifications?.threshold || 80)) return '#ff9800';
    return '#4caf50';
  };

  const getStatusText = () => {
    if (isOverBudget) return 'Over Budget';
    if (percentageUsed >= (notifications?.threshold || 80)) return 'Near Limit';
    return 'On Track';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return <MdError aria-label="Over budget" color="#e53935" size={18} />;
    if (percentageUsed >= (notifications?.threshold || 80)) return <MdWarningAmber aria-label="Near limit" color="#ff9800" size={18} />;
    return <MdCheckCircle aria-label="On track" color="#4caf50" size={18} />;
  };

  return (
    <div className={`budget-card ${isOverBudget ? 'over-budget' : ''}`}>
      <div className="budget-card-header">
        <div className="budget-title">
          <h4>
            {type === 'monthly' 
              ? `Monthly Budget (${month}/${year})` 
              : `${category} Budget (${month}/${year})`
            }
          </h4>
          <span className={`budget-status ${isOverBudget ? 'over' : percentageUsed >= (notifications?.threshold || 80) ? 'warning' : 'good'}`}>
            {getStatusIcon()} {getStatusText()}
          </span>
        </div>
        <div className="budget-actions">
          <button 
            className="edit-btn" 
            onClick={() => onEdit(budget)}
            title="Edit Budget"
          >
            <MdEdit size={18} />
          </button>
          <button 
            className="delete-btn" 
            onClick={() => onDelete(budget._id)}
            title="Delete Budget"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      <div className="budget-amounts">
        <div className="budget-amount-row">
          <span className="label">Budget:</span>
          <span className="amount budget-amount">{formatCurrency(amount)}</span>
        </div>
        <div className="budget-amount-row">
          <span className="label">Spent:</span>
          <span className="amount spent-amount">{formatCurrency(currentSpending)}</span>
        </div>
        <div className="budget-amount-row">
          <span className="label">Remaining:</span>
          <span className={`amount remaining-amount ${remaining < 0 ? 'negative' : ''}`}>
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      <div className="budget-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{
              width: `${Math.min(100, percentageUsed)}%`,
              backgroundColor: getProgressColor()
            }}
          />
        </div>
        <div className="progress-text">
          {percentageUsed.toFixed(1)}% used
        </div>
      </div>

      {notifications?.enabled && (
        <div className="budget-notifications">
          <small>
            Notifications at {notifications.threshold}% usage
          </small>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
