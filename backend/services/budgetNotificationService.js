// budgetNotificationService.js - Service for checking budget thresholds and sending notifications
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { sendBudgetThresholdAlert, sendBudgetExceededAlert } = require('./emailService');

// Track sent notifications to avoid spam
const sentNotifications = new Map();

// Helper function to calculate current spending for a budget
const calculateCurrentSpending = async (budget, userId) => {
  const startDate = new Date(budget.year, budget.month - 1, 1);
  const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);
  
  let query = {
    userId,
    date: { $gte: startDate, $lte: endDate },
    isDeleted: false,
  };

  if (budget.type === 'category') {
    query.category = budget.category;
  }
  
  // For expenses, we want negative amounts
  query.amount = { $lt: 0 };

  const transactions = await Transaction.find(query);
  return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

// Check if notification should be sent (avoid spam)
const shouldSendNotification = (budgetId, type) => {
  const key = `${budgetId}_${type}`;
  const now = Date.now();
  const lastSent = sentNotifications.get(key);
  
  // Send notification only once per hour for the same budget and type
  if (lastSent && (now - lastSent) < 60 * 60 * 1000) {
    return false;
  }
  
  sentNotifications.set(key, now);
  return true;
};

// Check budget thresholds and send notifications
const checkBudgetThresholds = async (userId, transactionId = null) => {
  try {
    // Get user's email preferences
    const user = await User.findById(userId);
    if (!user || !user.emailNotifications.enabled || !user.emailNotifications.budgetAlerts) {
      return;
    }

    // Get all active budgets for the current month
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgets = await Budget.find({
      userId,
      month: currentMonth,
      year: currentYear,
      isActive: true,
    });

    for (const budget of budgets) {
      const currentSpending = await calculateCurrentSpending(budget, userId);
      const percentage = budget.amount === 0 ? 0 : (currentSpending / budget.amount) * 100;
      const remaining = Math.max(0, budget.amount - currentSpending);
      const exceededBy = Math.max(0, currentSpending - budget.amount);

      // Check if budget is exceeded
      if (currentSpending > budget.amount) {
        if (shouldSendNotification(budget._id.toString(), 'exceeded')) {
          await sendBudgetExceededAlert(
            user.email,
            user.name,
            budget.type,
            budget.category || 'Monthly',
            budget.amount,
            exceededBy
          );
          console.log(`Budget exceeded notification sent for ${budget.type} budget ${budget.category || 'monthly'}`);
        }
      }
      // Check if threshold is reached
      else if (percentage >= budget.notifications.threshold) {
        if (shouldSendNotification(budget._id.toString(), 'threshold')) {
          await sendBudgetThresholdAlert(
            user.email,
            user.name,
            budget.type,
            budget.category || 'Monthly',
            percentage,
            budget.amount,
            remaining
          );
          console.log(`Budget threshold notification sent for ${budget.type} budget ${budget.category || 'monthly'}`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking budget thresholds:', error);
  }
};

// Check all users' budgets (for scheduled checks)
const checkAllUsersBudgets = async () => {
  try {
    const users = await User.find({ 
      'emailNotifications.enabled': true,
      'emailNotifications.budgetAlerts': true 
    });

    for (const user of users) {
      await checkBudgetThresholds(user._id);
    }
  } catch (error) {
    console.error('Error checking all users budgets:', error);
  }
};

// Schedule daily budget checks
const scheduleBudgetChecks = () => {
  // Check budgets every 6 hours
  setInterval(checkAllUsersBudgets, 6 * 60 * 60 * 1000);
  
  // Initial check
  setTimeout(checkAllUsersBudgets, 5000);
  
  console.log('Budget notification service started - checking every 6 hours');
};

module.exports = {
  checkBudgetThresholds,
  checkAllUsersBudgets,
  scheduleBudgetChecks,
};
