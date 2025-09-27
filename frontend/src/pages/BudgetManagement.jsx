// BudgetManagement.jsx - Page for managing budgets
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import BudgetCard from '../components/BudgetCard';
import BudgetModal from '../components/BudgetModal';
import './BudgetManagement.css';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [filter, setFilter] = useState('all'); // all, monthly, category
  const [currency, setCurrency] = useState('INR');

  // Fetch budgets and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [budgetsRes, categoriesRes] = await Promise.all([
          axios.get('/budgets'),
          axios.get('/budgets/categories')
        ]);
        setBudgets(budgetsRes.data);
        setCategories(categoriesRes.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to load budget data');
        console.error('Error fetching budget data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Listen for budget events to refresh data
    const handleBudgetEvent = () => {
      console.log('Budget event received, refreshing data...');
      fetchData();
    };
    
    window.addEventListener('budgetUpdated', handleBudgetEvent);
    return () => window.removeEventListener('budgetUpdated', handleBudgetEvent);
  }, []);

  // Filter budgets based on selected filter
  const filteredBudgets = budgets.filter(budget => {
    if (filter === 'all') return true;
    if (filter === 'monthly') return budget.type === 'monthly';
    if (filter === 'category') return budget.type === 'category';
    return true;
  });

  // Group budgets by type for better organization
  const monthlyBudgets = filteredBudgets.filter(b => b.type === 'monthly');
  const categoryBudgets = filteredBudgets.filter(b => b.type === 'category');

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      await axios.delete(`/budgets/${budgetId}`);
      setBudgets(prev => prev.filter(b => b._id !== budgetId));
      if (window.showToast) window.showToast('Budget deleted successfully!', 'success');
    } catch (err) {
      if (window.showToast) window.showToast('Failed to delete budget', 'error');
    }
  };

  const handleSaveBudget = async () => {
    // Refresh budgets after save
    try {
      setLoading(true);
      const res = await axios.get('/budgets');
      setBudgets(res.data);
      setError(null); // Clear any previous errors
      console.log('Budgets refreshed:', res.data);
    } catch (err) {
      console.error('Error refreshing budgets:', err);
      setError('Failed to refresh budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBudget(null);
  };

  // Calculate summary statistics
  const totalMonthlyBudget = monthlyBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalMonthlySpent = monthlyBudgets.reduce((sum, b) => sum + b.currentSpending, 0);
  const totalCategoryBudget = categoryBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalCategorySpent = categoryBudgets.reduce((sum, b) => sum + b.currentSpending, 0);
  const overBudgetCount = budgets.filter(b => b.isOverBudget).length;

  if (loading) {
    return (
      <div className="budget-management">
        <div className="loading">Loading budgets...</div>
      </div>
    );
  }

  // Debug logging
  console.log('BudgetManagement render:', { budgets, error, loading });

  return (
    <div className="budget-management">
      <div className="budget-header">
        <h2>Budget Management</h2>
        <button className="create-budget-btn" onClick={handleCreateBudget}>
          + Create Budget
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            className="retry-btn" 
            onClick={() => {
              setError(null);
              const fetchData = async () => {
                try {
                  setLoading(true);
                  const [budgetsRes, categoriesRes] = await Promise.all([
                    axios.get('/budgets'),
                    axios.get('/budgets/categories')
                  ]);
                  setBudgets(budgetsRes.data);
                  setCategories(categoriesRes.data);
                  setError(null);
                } catch (err) {
                  setError('Failed to load budget data');
                  console.error('Error fetching budget data:', err);
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="budget-summary">
        <div className="summary-card">
          <h4>Monthly Budgets</h4>
          <div className="summary-amount">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
            }).format(totalMonthlyBudget)}
          </div>
          <div className="summary-spent">
            Spent: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
            }).format(totalMonthlySpent)}
          </div>
        </div>

        <div className="summary-card">
          <h4>Category Budgets</h4>
          <div className="summary-amount">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
            }).format(totalCategoryBudget)}
          </div>
          <div className="summary-spent">
            Spent: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 0,
            }).format(totalCategorySpent)}
          </div>
        </div>

        <div className="summary-card">
          <h4>Over Budget</h4>
          <div className="summary-amount over-budget">
            {overBudgetCount}
          </div>
          <div className="summary-spent">
            {overBudgetCount === 0 ? 'All on track!' : 'Need attention'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="budget-filters">
        <div className="filter-group">
          <label>Filter by type:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Budgets</option>
            <option value="monthly">Monthly Only</option>
            <option value="category">Category Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Currency:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </div>
      </div>

      {/* Budget Lists */}
      {monthlyBudgets.length > 0 && (
        <div className="budget-section">
          <h3>Monthly Budgets</h3>
          <div className="budget-grid">
            {monthlyBudgets.map(budget => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
                currency={currency}
              />
            ))}
          </div>
        </div>
      )}

      {categoryBudgets.length > 0 && (
        <div className="budget-section">
          <h3>Category Budgets</h3>
          <div className="budget-grid">
            {categoryBudgets.map(budget => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
                currency={currency}
              />
            ))}
          </div>
        </div>
      )}

      {budgets.length === 0 && (
        <div className="empty-state">
          <h3>No budgets created yet</h3>
          <p>Create your first budget to start tracking your spending!</p>
          <button className="create-budget-btn" onClick={handleCreateBudget}>
            + Create Your First Budget
          </button>
        </div>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveBudget}
        initialData={editingBudget}
        categories={categories}
      />
    </div>
  );
};

export default BudgetManagement;
