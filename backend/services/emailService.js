// emailService.js - Email service for sending budget notifications with AI-generated tips
const nodemailer = require('nodemailer');

// AI-Generated Financial Tips Database
const financialTips = {
  budgetThreshold: [
    {
      category: 'general',
      tips: [
        '💡 Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
        '📱 Use expense tracking apps to monitor spending in real-time',
        '🛒 Create a shopping list before going to stores to avoid impulse purchases',
        '💳 Consider using cash for discretionary spending to increase awareness',
        '📊 Review your spending weekly to identify patterns and areas for improvement'
      ]
    },
    {
      category: 'food',
      tips: [
        '🍳 Meal prep on weekends to reduce food delivery expenses',
        '🛒 Shop with a grocery list and stick to it to avoid overspending',
        '🥗 Cook at home more often - it\'s typically 3-5x cheaper than dining out',
        '☕ Make coffee at home instead of buying from cafes daily',
        '🍽️ Use smaller plates to control portion sizes and reduce food waste'
      ]
    },
    {
      category: 'transportation',
      tips: [
        '🚗 Combine errands into one trip to save on fuel costs',
        '🚌 Consider public transportation or carpooling for regular commutes',
        '🚴 Walk or bike for short distances to save money and stay healthy',
        '⛽ Use apps to find the cheapest gas stations in your area',
        '🔧 Regular car maintenance prevents costly repairs later'
      ]
    },
    {
      category: 'entertainment',
      tips: [
        '🎬 Look for free community events and activities in your area',
        '📚 Use your local library for books, movies, and free programs',
        '🏠 Host potluck dinners instead of expensive restaurant outings',
        '🎮 Share streaming subscriptions with family or friends',
        '🌳 Explore free outdoor activities like hiking and parks'
      ]
    },
    {
      category: 'shopping',
      tips: [
        '⏰ Wait 24 hours before making non-essential purchases',
        '🏷️ Use price comparison apps to find the best deals',
        '📅 Shop end-of-season sales for clothing and seasonal items',
        '💰 Set up price alerts for items you want to buy',
        '🛍️ Unsubscribe from promotional emails to reduce temptation'
      ]
    }
  ],
  budgetExceeded: [
    {
      category: 'immediate',
      tips: [
        '🚨 Pause all non-essential spending for the rest of the month',
        '📱 Delete shopping apps from your phone temporarily',
        '💳 Leave credit cards at home and use cash only',
        '📊 Review every transaction from the past week to identify overspending',
        '🎯 Focus on free activities for entertainment this month'
      ]
    },
    {
      category: 'recovery',
      tips: [
        '📈 Increase your budget by 10-15% next month if this was a one-time event',
        '🔄 Reallocate funds from other categories if possible',
        '💼 Consider a side hustle to increase income temporarily',
        '🏦 Look into high-yield savings accounts for better returns',
        '📝 Create a debt payoff plan if you used credit cards'
      ]
    },
    {
      category: 'prevention',
      tips: [
        '⚡ Set up automatic transfers to savings right after payday',
        '📊 Use envelope budgeting method for better spending control',
        '🔔 Set up spending alerts on your bank account',
        '📅 Schedule weekly money check-ins to stay on track',
        '🎯 Create specific, measurable financial goals'
      ]
    }
  ],
  seasonal: [
    '🎄 Start saving for holidays early in the year to avoid debt',
    '🌞 Take advantage of summer sales for winter clothing',
    '📚 Buy school supplies during back-to-school sales even if you don\'t have kids',
    '🏖️ Book vacations during off-peak seasons for better deals',
    '🎁 Consider homemade gifts which are often more meaningful and cheaper'
  ],
  investment: [
    '📈 Start investing even with small amounts - consistency matters more than amount',
    '🏦 Take advantage of employer 401(k) matching - it\'s free money',
    '📚 Educate yourself about index funds for low-cost diversification',
    '💰 Consider dollar-cost averaging to reduce investment risk',
    '🎯 Invest in yourself through skills development and education'
  ]
};

// Function to get personalized tips based on spending category and situation
const getPersonalizedTips = (budgetType, category, situation = 'threshold', count = 3) => {
  let relevantTips = [];
  
  if (situation === 'threshold') {
    // Find category-specific tips
    const categoryTips = financialTips.budgetThreshold.find(tip => tip.category === category?.toLowerCase());
    if (categoryTips) {
      relevantTips = [...categoryTips.tips];
    }
    
    // Add general tips if we need more
    const generalTips = financialTips.budgetThreshold.find(tip => tip.category === 'general');
    if (generalTips && relevantTips.length < count) {
      relevantTips = [...relevantTips, ...generalTips.tips];
    }
  } else if (situation === 'exceeded') {
    // Get immediate action tips
    const immediateTips = financialTips.budgetExceeded.find(tip => tip.category === 'immediate');
    const recoveryTips = financialTips.budgetExceeded.find(tip => tip.category === 'recovery');
    const preventionTips = financialTips.budgetExceeded.find(tip => tip.category === 'prevention');
    
    relevantTips = [
      ...(immediateTips?.tips || []),
      ...(recoveryTips?.tips || []),
      ...(preventionTips?.tips || [])
    ];
  }
  
  // Add seasonal and investment tips
  relevantTips = [...relevantTips, ...financialTips.seasonal, ...financialTips.investment];
  
  // Shuffle and return requested count
  const shuffled = relevantTips.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Function to generate motivational message based on spending pattern
const getMotivationalMessage = (percentage, budgetType, category) => {
  if (percentage < 50) {
    return "🌟 Great job staying within budget! You're building excellent financial habits.";
  } else if (percentage < 75) {
    return "⚡ You're doing well, but it's time to be more mindful of your spending.";
  } else if (percentage < 90) {
    return "⚠️ You're approaching your budget limit. Consider slowing down your spending.";
  } else {
    return "🚨 You're very close to your budget limit. Time for immediate action!";
  }
};

// Create transporter based on environment configuration
const createTransporter = () => {
  const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  return nodemailer.createTransport(emailConfig);
};

// Email templates
const emailTemplates = {
  budgetThreshold: (userName, budgetType, category, percentage, amount, remaining) => ({
    subject: `💰 Budget Alert: ${budgetType === 'monthly' ? 'Monthly' : category} Budget at ${percentage.toFixed(1)}%`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">💰 Budget Alert</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Personal Finance Assistant</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <h3 style="color: #ff9800; margin-top: 0;">⚠️ Budget Threshold Reached</h3>
            <p style="margin: 10px 0; color: #666;">
              Your <strong>${budgetType === 'monthly' ? 'monthly' : category}</strong> budget has reached 
              <strong style="color: #ff9800;">${percentage.toFixed(1)}%</strong> of its limit.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Budget Details:</h4>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Budget Type:</strong> ${budgetType === 'monthly' ? 'Monthly Budget' : `${category} Category Budget`}</li>
              <li><strong>Total Budget:</strong> ₹${amount.toLocaleString()}</li>
              <li><strong>Amount Spent:</strong> ₹${(amount - remaining).toLocaleString()}</li>
              <li><strong>Remaining:</strong> ₹${remaining.toLocaleString()}</li>
              <li><strong>Usage:</strong> ${percentage.toFixed(1)}%</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1976d2; font-weight: 500;">
              💡 <strong>Tip:</strong> Consider reviewing your recent expenses and adjusting your spending to stay within budget.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/budgets" 
               style="background: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              View Budget Details
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            This is an automated message from your Personal Finance Assistant. 
            You can manage your notification preferences in the app settings.
          </p>
        </div>
      </div>
    `,
    text: `
      Budget Alert - Personal Finance Assistant
      
      Hello ${userName}!
      
      Your ${budgetType === 'monthly' ? 'monthly' : category} budget has reached ${percentage.toFixed(1)}% of its limit.
      
      Budget Details:
      - Budget Type: ${budgetType === 'monthly' ? 'Monthly Budget' : `${category} Category Budget`}
      - Total Budget: ₹${amount.toLocaleString()}
      - Amount Spent: ₹${(amount - remaining).toLocaleString()}
      - Remaining: ₹${remaining.toLocaleString()}
      - Usage: ${percentage.toFixed(1)}%
      
      View your budget details: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/budgets
      
      This is an automated message from your Personal Finance Assistant.
    `
  }),

  budgetExceeded: (userName, budgetType, category, amount, exceededBy) => ({
    subject: `🚨 Budget Exceeded: ${budgetType === 'monthly' ? 'Monthly' : category} Budget Over Limit`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e53935 0%, #c62828 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚨 Budget Exceeded</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Personal Finance Assistant</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName}!</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e53935;">
            <h3 style="color: #e53935; margin-top: 0;">🚨 Budget Exceeded</h3>
            <p style="margin: 10px 0; color: #666;">
              Your <strong>${budgetType === 'monthly' ? 'monthly' : category}</strong> budget has been exceeded by 
              <strong style="color: #e53935;">₹${exceededBy.toLocaleString()}</strong>.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">Budget Details:</h4>
            <ul style="color: #666; line-height: 1.6;">
              <li><strong>Budget Type:</strong> ${budgetType === 'monthly' ? 'Monthly Budget' : `${category} Category Budget`}</li>
              <li><strong>Total Budget:</strong> ₹${amount.toLocaleString()}</li>
              <li><strong>Amount Spent:</strong> ₹${(amount + exceededBy).toLocaleString()}</li>
              <li><strong>Over Budget By:</strong> ₹${exceededBy.toLocaleString()}</li>
            </ul>
          </div>
          
          <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #c62828; font-weight: 500;">
              ⚠️ <strong>Action Required:</strong> Please review your recent expenses and consider adjusting your budget or spending habits.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/budgets" 
               style="background: #e53935; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Review Budget
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            This is an automated message from your Personal Finance Assistant. 
            You can manage your notification preferences in the app settings.
          </p>
        </div>
      </div>
    `,
    text: `
      Budget Exceeded - Personal Finance Assistant
      
      Hello ${userName}!
      
      Your ${budgetType === 'monthly' ? 'monthly' : category} budget has been exceeded by ₹${exceededBy.toLocaleString()}.
      
      Budget Details:
      - Budget Type: ${budgetType === 'monthly' ? 'Monthly Budget' : `${category} Category Budget`}
      - Total Budget: ₹${amount.toLocaleString()}
      - Amount Spent: ₹${(amount + exceededBy).toLocaleString()}
      - Over Budget By: ₹${exceededBy.toLocaleString()}
      
      Review your budget: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/budgets
      
      This is an automated message from your Personal Finance Assistant.
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email service not configured. Skipping email send.');
      return { success: false, error: 'Email service not configured' };
    }

    const transporter = createTransporter();
    
    let emailTemplate;
    
    // Handle custom email templates
    if (template === 'custom' && typeof data === 'object' && data.subject) {
      emailTemplate = data;
    } else {
      // Handle predefined templates
      emailTemplate = emailTemplates[template](...data);
    }
    
    const mailOptions = {
      from: `"Personal Finance Assistant" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send budget threshold notification
const sendBudgetThresholdAlert = async (userEmail, userName, budgetType, category, percentage, amount, remaining) => {
  return await sendEmail(userEmail, 'budgetThreshold', [
    userName, budgetType, category, percentage, amount, remaining
  ]);
};

// Send budget exceeded notification
const sendBudgetExceededAlert = async (userEmail, userName, budgetType, category, amount, exceededBy) => {
  return await sendEmail(userEmail, 'budgetExceeded', [
    userName, budgetType, category, amount, exceededBy
  ]);
};

module.exports = {
  sendEmail,
  sendBudgetThresholdAlert,
  sendBudgetExceededAlert,
};
