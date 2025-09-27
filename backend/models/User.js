const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  emailNotifications: {
    enabled: { type: Boolean, default: true },
    budgetAlerts: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: false },
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
