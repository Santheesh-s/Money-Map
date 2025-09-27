const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Helper function to calculate current spending for a budget
const calculateCurrentSpending = async (budget, userId) => {
  // For monthly budgets, use the specific month. For category budgets, use current month if no month specified
  const currentDate = new Date();
  const budgetMonth = budget.month || (currentDate.getMonth() + 1);
  const budgetYear = budget.year || currentDate.getFullYear();
  
  const startDate = new Date(budgetYear, budgetMonth - 1, 1);
  const endDate = new Date(budgetYear, budgetMonth, 0, 23, 59, 59);
  
  let query = {
    userId,
    date: { $gte: startDate, $lte: endDate },
    isDeleted: false,
  };

  if (budget.type === 'category' && budget.category) {
    query.category = budget.category;
  }
  
  // For expenses, we want negative amounts
  query.amount = { $lt: 0 };

  try {
    const transactions = await Transaction.find(query);
    return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  } catch (error) {
    console.error('Error calculating current spending:', error);
    return 0;
  }
};

// GET /budgets - Get all budgets for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ 
      userId: req.userId, 
      isActive: true 
    }).sort({ type: 1, year: -1, month: -1, category: 1 });

    // Calculate current spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const currentSpending = await calculateCurrentSpending(budget, req.userId);
        return {
          ...budget.toObject(),
          currentSpending,
          remaining: Math.max(0, budget.amount - currentSpending),
          percentageUsed: budget.amount === 0 ? 0 : Math.min(100, (currentSpending / budget.amount) * 100),
          isOverBudget: currentSpending > budget.amount,
        };
      })
    );

    res.json(budgetsWithSpending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /budgets/summary - Get budget summary for current month
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get monthly budget
    const monthlyBudget = await Budget.findOne({
      userId: req.userId,
      type: 'monthly',
      month: currentMonth,
      year: currentYear,
      isActive: true,
    });

    // Get category budgets
    const categoryBudgets = await Budget.find({
      userId: req.userId,
      type: 'category',
      month: currentMonth,
      year: currentYear,
      isActive: true,
    });

    // Calculate current month spending
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    
    const monthlySpending = await calculateCurrentSpending(
      { type: 'monthly', month: currentMonth, year: currentYear },
      req.userId
    );

    // Calculate category spending
    const categorySpending = {};
    for (const budget of categoryBudgets) {
      categorySpending[budget.category] = await calculateCurrentSpending(budget, req.userId);
    }

    res.json({
      monthly: monthlyBudget ? {
        ...monthlyBudget.toObject(),
        currentSpending: monthlySpending,
        remaining: Math.max(0, monthlyBudget.amount - monthlySpending),
        percentageUsed: monthlyBudget.amount === 0 ? 0 : Math.min(100, (monthlySpending / monthlyBudget.amount) * 100),
        isOverBudget: monthlySpending > monthlyBudget.amount,
      } : null,
      categories: categoryBudgets.map(budget => ({
        ...budget.toObject(),
        currentSpending: categorySpending[budget.category] || 0,
        remaining: Math.max(0, budget.amount - (categorySpending[budget.category] || 0)),
        percentageUsed: budget.amount === 0 ? 0 : Math.min(100, ((categorySpending[budget.category] || 0) / budget.amount) * 100),
        isOverBudget: (categorySpending[budget.category] || 0) > budget.amount,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /budgets - Create new budget
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, category, amount, currency, month, year, notifications } = req.body;

    // Validate required fields
    if (!type || !amount || !year) {
      return res.status(400).json({ message: 'Type, amount, and year are required' });
    }

    if (type === 'category' && !category) {
      return res.status(400).json({ message: 'Category is required for category budgets' });
    }

    if (type === 'monthly' && !month) {
      return res.status(400).json({ message: 'Month is required for monthly budgets' });
    }

    // Check for existing budget
    const existingBudget = await Budget.findOne({
      userId: req.userId,
      type,
      category: type === 'category' ? category : undefined,
      month: type === 'monthly' ? month : undefined,
      year,
      isActive: true,
    });

    if (existingBudget) {
      return res.status(409).json({ 
        message: `Budget already exists for ${type === 'monthly' ? `${month}/${year}` : `${category} ${year}`}` 
      });
    }

    const budget = new Budget({
      userId: req.userId,
      type,
      category: type === 'category' ? category : undefined,
      amount,
      currency: currency || 'INR',
      month: type === 'monthly' ? month : undefined,
      year,
      notifications: notifications || { enabled: true, threshold: 80 },
    });

    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /budgets/:id - Update budget
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { amount, notifications, isActive } = req.body;
    
    const budget = await Budget.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (amount !== undefined) budget.amount = amount;
    if (notifications !== undefined) budget.notifications = notifications;
    if (isActive !== undefined) budget.isActive = isActive;
    
    budget.metadata.lastUpdated = new Date();
    
    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /budgets/:id - Delete budget (soft delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const budget = await Budget.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.isActive = false;
    budget.metadata.lastUpdated = new Date();
    await budget.save();

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /budgets/categories - Get available categories for budget creation
router.get('/categories', verifyToken, async (req, res) => {
  try {
    const categories = await Transaction.distinct('category', {
      userId: req.userId,
      isDeleted: false,
    });
    res.json(categories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
