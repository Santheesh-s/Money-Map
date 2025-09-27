// BudgetSummary.jsx - Component for displaying budget summary on dashboard
import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdWarningAmber, MdError } from 'react-icons/md';
import axios from '../utils/axios';
import './BudgetSummary.css';

const BudgetSummary = ({ currency = 'INR' }) => {
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgetSummary = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/budgets/summary');
        setBudgetSummary(res.data);
      } catch (err) {
        setError('Failed to load budget data');
        console.error('Error fetching budget summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetSummary();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="budget-summary">
        <div className="loading">Loading budget data...</div>
      </div>
    );
  }

  if (error || !budgetSummary) {
    return (
      <div className="budget-summary">
        <div className="error">Unable to load budget data</div>
      </div>
    );
  }

  const { monthly, categories } = budgetSummary;
  const isMonthlyActive = monthly && (monthly.isActive ?? true);
  const activeCategories = Array.isArray(categories)
    ? categories.filter(c => (c.isActive ?? c.active ?? true))
    : [];

  return (
    <div className="budget-summary">
      <h3>Budget Overview</h3>
      
      {isMonthlyActive ? (
        <div className="monthly-budget">
          <div className="budget-header">
            <h4>Monthly Budget</h4>
            <span className={`budget-status ${monthly.isOverBudget ? 'over' : monthly.percentageUsed >= 80 ? 'warning' : 'good'}`}>
              {monthly.isOverBudget ? (
                <><MdError size={18} color="#e53935" /> Over Budget</>
              ) : monthly.percentageUsed >= 80 ? (
                <><MdWarningAmber size={18} color="#ff9800" /> Near Limit</>
              ) : (
                <><MdCheckCircle size={18} color="#4caf50" /> On Track</>
              )}
            </span>
          </div>
          
          <div className="budget-amounts">
            <div className="amount-row">
              <span>Budget:</span>
              <span>{formatCurrency(monthly.amount)}</span>
            </div>
            <div className="amount-row">
              <span>Spent:</span>
              <span>{formatCurrency(monthly.currentSpending)}</span>
            </div>
            <div className="amount-row">
              <span>Remaining:</span>
              <span className={monthly.remaining < 0 ? 'negative' : ''}>
                {formatCurrency(monthly.remaining)}
              </span>
            </div>
          </div>

          <div className="budget-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{
                  width: `${Math.min(100, monthly.percentageUsed)}%`,
                  backgroundColor: monthly.isOverBudget ? '#e53935' : monthly.percentageUsed >= 80 ? '#ff9800' : '#4caf50'
                }}
              />
            </div>
            <div className="progress-text">
              {monthly.percentageUsed.toFixed(1)}% used
            </div>
          </div>
        </div>
      ) : (
        <div className="no-monthly-budget">
          <p>No monthly budget set for this month</p>
          <button 
            className="create-budget-btn"
            onClick={() => window.location.href = '/budgets'}
          >
            Create Monthly Budget
          </button>
        </div>
      )}

      {activeCategories && activeCategories.length > 0 && (
        <div className="category-budgets">
          <h4>Category Budgets</h4>
          <div className="category-list">
            {activeCategories.slice(0, 3).map(category => (
              <div key={category._id} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.category}</span>
                  <span className="category-amount">
                    {formatCurrency(category.currentSpending)} / {formatCurrency(category.amount)}
                  </span>
                </div>
                <div className="category-progress">
                  <div className="progress-bar small">
                    <div 
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, category.percentageUsed)}%`,
                        backgroundColor: category.isOverBudget ? '#e53935' : category.percentageUsed >= 80 ? '#ff9800' : '#4caf50'
                      }}
                    />
                  </div>
                  <span className="progress-percentage">
                    {category.percentageUsed.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
            {activeCategories.length > 3 && (
              <div className="view-more">
                <button 
                  className="view-more-btn"
                  onClick={() => window.location.href = '/budgets'}
                >
                  View all {activeCategories.length} categories
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      
    </div>
  );
};

export default BudgetSummary;
