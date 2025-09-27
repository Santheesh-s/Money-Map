// budgetNotifications.js - Utility for budget-related notifications and warnings
import axios from './axios';

// Check if a new transaction would exceed budget limits
export const checkBudgetLimits = async (transaction) => {
  try {
    const res = await axios.get('/budgets/summary');
    const { monthly, categories } = res.data;
    
    const warnings = [];
    
    // Check monthly budget
    if (monthly && transaction.amount < 0) {
      const newMonthlySpending = monthly.currentSpending + Math.abs(transaction.amount);
      const percentage = (newMonthlySpending / monthly.amount) * 100;
      
      if (newMonthlySpending > monthly.amount) {
        warnings.push({
          type: 'error',
          message: `This transaction would exceed your monthly budget by ${new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
          }).format(newMonthlySpending - monthly.amount)}`
        });
      } else if (percentage >= monthly.notifications.threshold) {
        warnings.push({
          type: 'warning',
          message: `This transaction would bring you to ${percentage.toFixed(1)}% of your monthly budget`
        });
      }
    }
    
    // Check category budget
    if (categories && transaction.amount < 0 && transaction.category) {
      const categoryBudget = categories.find(c => c.category === transaction.category);
      if (categoryBudget) {
        const newCategorySpending = categoryBudget.currentSpending + Math.abs(transaction.amount);
        const percentage = (newCategorySpending / categoryBudget.amount) * 100;
        
        if (newCategorySpending > categoryBudget.amount) {
          warnings.push({
            type: 'error',
            message: `This transaction would exceed your ${transaction.category} budget by ${new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
            }).format(newCategorySpending - categoryBudget.amount)}`
          });
        } else if (percentage >= categoryBudget.notifications.threshold) {
          warnings.push({
            type: 'warning',
            message: `This transaction would bring you to ${percentage.toFixed(1)}% of your ${transaction.category} budget`
          });
        }
      }
    }
    
    return warnings;
  } catch (error) {
    console.error('Error checking budget limits:', error);
    return [];
  }
};

// Show budget warnings in a user-friendly way
export const showBudgetWarnings = (warnings) => {
  if (warnings.length === 0) return;
  
  warnings.forEach(warning => {
    if (window.showToast) {
      window.showToast(warning.message, warning.type);
    } else {
      alert(warning.message);
    }
  });
};

// Get budget status for a category
export const getCategoryBudgetStatus = (category, budgets) => {
  const budget = budgets.find(b => b.category === category && b.type === 'category');
  if (!budget) return null;
  
  return {
    budget: budget.amount,
    spent: budget.currentSpending,
    remaining: budget.remaining,
    percentage: budget.percentageUsed,
    isOverBudget: budget.isOverBudget,
    status: budget.isOverBudget ? 'over' : budget.percentageUsed >= 80 ? 'warning' : 'good'
  };
};

// Get monthly budget status
export const getMonthlyBudgetStatus = (budgets) => {
  const budget = budgets.find(b => b.type === 'monthly');
  if (!budget) return null;
  
  return {
    budget: budget.amount,
    spent: budget.currentSpending,
    remaining: budget.remaining,
    percentage: budget.percentageUsed,
    isOverBudget: budget.isOverBudget,
    status: budget.isOverBudget ? 'over' : budget.percentageUsed >= 80 ? 'warning' : 'good'
  };
};
