// backend/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['monthly', 'category'],
    required: true,
  },
  category: {
    type: String,
    required: function() {
      return this.type === 'category';
    },
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  month: {
    type: Number,
    required: function() {
      return this.type === 'monthly';
    },
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2100,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true,
    },
    threshold: {
      type: Number,
      default: 80, // Percentage at which to warn
      min: 0,
      max: 100,
    },
  },
  metadata: {
    createdBy: {
      type: String,
      enum: ['user', 'system'],
      default: 'user',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Index for efficient queries
budgetSchema.index({ userId: 1, type: 1, year: 1, month: 1 });
budgetSchema.index({ userId: 1, type: 1, category: 1, year: 1, month: 1 });

// Virtual for current spending (will be calculated in routes)
budgetSchema.virtual('currentSpending').get(function() {
  return 0; // This will be calculated dynamically
});

// Virtual for remaining budget
budgetSchema.virtual('remaining').get(function() {
  return Math.max(0, this.amount - (this.currentSpending || 0));
});

// Virtual for percentage used
budgetSchema.virtual('percentageUsed').get(function() {
  if (this.amount === 0) return 0;
  return Math.min(100, ((this.currentSpending || 0) / this.amount) * 100);
});

// Virtual for isOverBudget
budgetSchema.virtual('isOverBudget').get(function() {
  return (this.currentSpending || 0) > this.amount;
});

module.exports = mongoose.model('Budget', budgetSchema);
