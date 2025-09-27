# 💰 Smart Finance Tracker

> **A modern, AI-powered personal finance management solution built with the MERN stack**

<div align="center">

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.0+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<p>Track. Analyze. Save.</p>
<p>Take control of your financial future with intelligent insights and powerful budgeting tools.</p>

</div>

## ✨ Key Features

### 📊 **Dashboard Overview**
- Real-time financial snapshot with key metrics
- Monthly spending trends and patterns
- Budget progress tracking with visual indicators
- Quick transaction entry and overview
- Currency conversion support

### 💳 **Transaction Management**
- ➕ Add, edit, and categorize income/expense entries
- 🏷️ Custom category management with unlimited subcategories
- 🔍 Advanced filtering by date, category, amount, and payment method
- ⚡ Bulk transaction operations (import/export)
- ✅ Real-time transaction validation and duplicate detection
- 💾 Automatic backup and data synchronization

### 📈 **Advanced Analytics**
- 📊 Interactive charts using Recharts library
- 🥧 Expense breakdown by category (Pie Charts)
- 📉 Spending trends over time (Line Charts)
- 📊 Monthly/yearly comparison views
- 🎯 Budget vs actual spending analysis
- 💱 Multi-currency support with real-time rates

### 🎯 **Smart Budgeting**
- 📅 Set monthly budgets for different categories
- 📊 Visual budget tracking with progress indicators
- 🔔 Real-time budget notifications and alerts
- 📈 Budget vs. actual spending analysis
- 🔄 Recurring budget adjustments
- 📱 Mobile-optimized budget monitoring

### 🧾 **AI-Powered Receipt Processing**
- 📷 Upload receipts (Images & PDFs) with drag-and-drop
- 🤖 OCR text extraction using Tesseract.js
- 🧠 AI-powered data parsing with Google Gemini API
- 📋 Automatic transaction categorization
- 💾 Secure cloud storage for receipts
- 🔄 Fallback processing when AI services are unavailable

### 👤 **User Management**
- 🔐 Secure JWT-based authentication system
- 👥 Multi-user support with isolated data
- ⚙️ Personalized settings and preferences
- 📱 Responsive design for all devices
- 🌙 Dark/Light theme toggle
- 🔄 Real-time data synchronization

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18.0 or higher
- **MongoDB** v6.0 or higher
- **npm** v9.0 or higher
- **Git** for version control

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tarrun1506/Finance-Tracker.git
   cd Finance-Tracker
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the application**
   ```bash
   # From the project root directory
   npm run dev
   ```
   - Frontend will be available at: http://localhost:3000
   - Backend API will be available at: http://localhost:5000

### Alternative: Manual Start
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

## 🛠️ Technology Stack

### **Frontend**
- **React 19.1.0** - Modern UI library with concurrent features
- **React Router DOM 7.6.3** - Client-side routing
- **Recharts 3.0.2** - Beautiful, composable data visualization
- **React Icons 5.5.0** - Comprehensive icon library
- **Axios 1.10.0** - HTTP client for API calls
- **React Modal 3.16.1** - Accessible modal dialogs
- **Date-fns 2.30.0** - Modern date utility library
- **Tailwind CSS** - Utility-first CSS framework

### **Backend**
- **Node.js & Express 5.1.0** - Server-side JavaScript runtime and framework
- **MongoDB & Mongoose 8.16.1** - NoSQL database and ODM
- **JWT Authentication** - Secure token-based authentication
- **Bcrypt 6.0.0** - Password hashing and security
- **Multer 2.0.1** - Middleware for handling file uploads
- **Nodemailer 6.9.9** - Email notifications and alerts
- **Winston 3.11.0** - Logging framework
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - HTTP cookie parsing

### **AI & Document Processing**
- **Tesseract.js 6.0.1** - OCR engine for receipt text extraction
- **PDF-Parse 1.1.1** - PDF text extraction
- **PDF-Poppler 0.2.1** - PDF to image conversion
- **Google Gemini API** - AI-powered data extraction and processing

### **Development Tools**
- **Nodemon** - Auto-restart development server
- **Concurrently** - Run multiple npm scripts simultaneously
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting and beautification

## 📁 Project Structure

```
finance-tracker/
├── 📁 frontend/                 # React application
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable React components
│   │   ├── 📁 pages/           # Page components
│   │   ├── 📁 styles/          # CSS stylesheets
│   │   ├── 📁 utils/           # Utility functions
│   │   └── App.js              # Main App component
│   └── package.json
├── 📁 backend/                  # Express.js API server
│   ├── 📁 models/              # MongoDB models
│   ├── 📁 routes/              # API route handlers
│   ├── 📁 middleware/          # Custom middleware
│   ├── 📁 uploads/             # File upload directory
│   └── server.js               # Main server file
├── 📁 uploads/                  # Temporary file storage
├── package.json                 # Root dependencies
└── README.md                    # Project documentation
```

## 🚀 Recent Updates

### v1.3.0 - Enhanced Receipt Processing & Error Handling
- ✅ Added robust retry logic for API calls with exponential backoff
- 🛠️ Implemented intelligent fallback processing when AI services are unavailable
- 📱 Improved mobile responsiveness across all components
- 🐛 Fixed expense/income categorization in receipt processing
- ⚡ Enhanced error handling and user feedback
- 🎨 Updated transaction table column widths for better readability

### v1.2.0 - Budget Management System
- 📊 Added comprehensive budget tracking with visual progress indicators
- 🔔 Implemented real-time budget notifications and alerts
- 📈 Enhanced analytics dashboard with budget vs. actual spending
- 🎨 Improved UI/UX with better color schemes and layouts
- 📱 Mobile-first responsive design improvements

### v1.1.0 - Core Features
- 💳 Transaction management with categorization
- 📊 Basic analytics and reporting
- 👤 User authentication and profile management
- 🧾 Initial receipt processing capabilities

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Areas for Contribution
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation updates
- 🎨 UI/UX improvements
- 🔧 Performance optimizations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **MongoDB Inc.** - For the powerful MongoDB database
- **Tesseract.js Contributors** - For the OCR capabilities
- **Google AI Team** - For the Gemini API integration
- **Open Source Community** - For all the amazing libraries and tools

---

<div align="center">

**Made with ❤️ by Tarrun Kalsi**

⭐ Star this repo if you found it helpful!

[📧 Contact](mailto:your.email@example.com) • [🐛 Report Issues](https://github.com/Tarrun1506/Finance-Tracker/issues) • [📖 Documentation](https://github.com/Tarrun1506/Finance-Tracker/wiki)

</div>
- Enhanced form validation
- Improved error handling and user feedback
- Optimized database queries

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/Tarrun1506/Finance-Tracker.git
cd Finance-Tracker
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/finance-tracker
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker

JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install all dependencies (root, frontend, and backend)
npm install
```

### 4. Start the Application
```bash
# Run both frontend and backend concurrently
npm run dev
```

The application will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
Finance-Tracker/
├── 📁 frontend/                 # React application
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 pages/           # Application pages
│   │   ├── 📁 styles/          # CSS stylesheets
│   │   ├── 📁 utils/           # Utility functions
│   │   └── App.js              # Main App component
│   └── package.json
│
├── 📁 backend/                  # Node.js API server
│   ├── 📁 middleware/          # Custom middleware
│   ├── 📁 models/              # MongoDB schemas
│   ├── 📁 routes/              # API route handlers
│   ├── server.js               # Express server setup
│   └── package.json
│
├── package.json                # Root package configuration
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

---

## 🔧 Development Scripts

```bash
# Start both frontend and backend in development mode
npm run dev

# Install dependencies for all packages
npm install

# Frontend only (from /frontend directory)
cd frontend && npm start

# Backend only (from /backend directory)
cd backend && npm run server
```

---

## 📱 Application Features

### Dashboard
- 📊 Financial overview with key metrics
- 📈 Recent transactions display
- 💰 Balance and spending summaries
- 🎯 Quick action buttons

### Transaction Management
- ➕ Add new income/expense entries
- 📝 Edit existing transactions
- 🗑️ Delete unwanted entries
- 🔍 Advanced search and filtering

### Receipt Upload
- 📷 Drag-and-drop file upload
- 🤖 Automatic text extraction
- ✏️ Manual editing capabilities
- 💾 Secure file storage

### Analytics & Reports
- 📊 Category-wise spending breakdown
- 📈 Monthly/yearly trend analysis
- 💡 Spending insights and patterns
- 📋 Exportable reports

### User Profile
- 👤 Personal information management
- ⚙️ Application preferences
- 🔐 Security settings
- 🌙 Theme customization

---

## 🔒 Security Features

- 🛡️ **JWT Authentication** - Secure token-based auth
- 🔐 **Password Hashing** - Bcrypt encryption
- 🍪 **HTTP-only Cookies** - Secure session management
- 🔒 **Input Validation** - Server-side data validation
- 🛡️ **CORS Protection** - Cross-origin request security

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Tarrun1506**
- GitHub: [@Tarrun1506](https://github.com/Tarrun1506)
- Repository: [Finance-Tracker](https://github.com/Tarrun1506/Finance-Tracker)

---

## 🙏 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Charts by [Recharts](https://recharts.org/)
- OCR by [Tesseract.js](https://tesseract.projectnaptha.com/)
- UI Components from [Material-UI](https://mui.com/)
- Date handling with [date-fns](https://date-fns.org/)
- MongoDB for the flexible database solution
- Tesseract.js for OCR capabilities
- Recharts for beautiful data visualization
- All open-source contributors who made this project possible

---

**⭐ If you found this project helpful, please give it a star!**

