# 🎨 Smart Finance Tracker - Frontend

> **React-based frontend for the Smart Finance Tracker application**

This is the client-side application built with **React 19.1.0** and modern web technologies, providing an intuitive and responsive user interface for personal finance management.

## 🚀 Features

### 📱 **Responsive Design**
- Mobile-first approach with responsive layouts
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly interface elements

### 🎨 **Modern UI Components**
- Clean and intuitive user interface
- Interactive charts and data visualizations
- Dark/Light theme support
- Smooth animations and transitions

### 📊 **Data Visualization**
- **Recharts** integration for beautiful charts
- Real-time data updates
- Interactive pie charts, line graphs, and bar charts
- Responsive chart layouts

### 🔐 **Authentication & Security**
- JWT token-based authentication
- Protected routes and components
- Secure API communication
- Session management

## 🛠️ Tech Stack

- **React 19.1.0** - Latest React with concurrent features
- **React Router DOM 7.6.3** - Client-side routing and navigation
- **Recharts 3.0.2** - Data visualization library
- **React Icons 5.5.0** - Comprehensive icon library
- **Axios 1.10.0** - HTTP client for API requests
- **React Testing Library** - Component testing utilities

## 📁 Project Structure

```
frontend/
├── 📁 public/                   # Static assets
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # App favicon
│   └── manifest.json           # PWA manifest
│
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── ChatBot.jsx         # AI chatbot component
│   │   ├── LineChart.jsx       # Line chart visualization
│   │   ├── PieChart.jsx        # Pie chart visualization
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── SummaryCards.jsx    # Dashboard summary cards
│   │   ├── Toast.jsx           # Notification component
│   │   ├── TransactionModal.jsx # Transaction form modal
│   │   └── TransactionsTable.jsx # Transaction data table
│   │
│   ├── 📁 pages/               # Application pages
│   │   ├── AuthPage.jsx        # Login/Register page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── AddTransaction.jsx  # Add transaction page
│   │   ├── TransactionHistory.jsx # Transaction history
│   │   ├── ReceiptUpload.jsx   # Receipt upload page
│   │   ├── SummaryGraphs.jsx   # Analytics page
│   │   ├── Profile.jsx         # User profile page
│   │   └── Settings.jsx        # App settings page
│   │
│   ├── 📁 styles/              # CSS stylesheets
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── global-responsive.css # Global responsive styles
│   │   └── responsive.css      # Component-specific responsive styles
│   │
│   ├── 📁 utils/               # Utility functions
│   │   ├── axios.js            # Axios configuration
│   │   ├── jwt.js              # JWT token utilities
│   │   └── RequireAuth.jsx     # Authentication wrapper
│   │
│   ├── App.js                  # Main App component
│   ├── App.css                 # App-level styles
│   ├── index.js                # React DOM entry point
│   └── index.css               # Global styles
│
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The application will open at [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.
- Opens [http://localhost:3000](http://localhost:3000) in your browser
- Automatically reloads when you make changes
- Shows lint errors in the console

### `npm test`
Launches the test runner in interactive watch mode.
- Runs all test files
- Watches for changes and re-runs tests
- Provides coverage reports

### `npm run build`
Builds the app for production to the `build` folder.
- Optimizes the build for best performance
- Minifies files and includes hashes in filenames
- Ready for deployment

### `npm run eject`
⚠️ **One-way operation** - Removes Create React App abstraction
- Copies all configuration files to your project
- Gives you full control over webpack, Babel, ESLint, etc.
- Use only if you need advanced customization

## 🎨 Component Overview

### **Core Components**

- **`Dashboard.jsx`** - Main application dashboard with financial overview
- **`Sidebar.jsx`** - Navigation sidebar with menu items
- **`SummaryCards.jsx`** - Financial summary cards with key metrics
- **`TransactionsTable.jsx`** - Data table for transaction display

### **Chart Components**

- **`PieChart.jsx`** - Category-wise expense breakdown
- **`LineChart.jsx`** - Spending trends over time
- **Recharts integration** for responsive, interactive charts

### **Form Components**

- **`TransactionModal.jsx`** - Add/edit transaction form
- **`ReceiptUpload.jsx`** - File upload with drag-and-drop
- **Form validation** and error handling

### **Utility Components**

- **`Toast.jsx`** - Success/error notifications
- **`RequireAuth.jsx`** - Route protection wrapper
- **`ChatBot.jsx`** - AI-powered financial assistant

## 🔧 Configuration

### **API Configuration**
The frontend communicates with the backend API through Axios. Configuration is in `src/utils/axios.js`:

```javascript
// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api'
```

### **Authentication**
JWT tokens are managed in `src/utils/jwt.js` with automatic token refresh and secure storage.

## 🎯 Key Features Implementation

### **Responsive Design**
- CSS Grid and Flexbox layouts
- Mobile-first media queries
- Touch-friendly interface elements

### **State Management**
- React Context API for global state
- Local component state for UI interactions
- Efficient re-rendering with React 19 features

### **Performance Optimization**
- Code splitting with React.lazy()
- Memoized components with React.memo()
- Optimized bundle size with tree shaking

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Tests include:
- Component rendering tests
- User interaction testing
- API integration tests
- Accessibility testing

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The `build` folder contains optimized static files ready for deployment to any static hosting service.

## 🤝 Contributing

When contributing to the frontend:

1. Follow React best practices
2. Maintain consistent code style
3. Write tests for new components
4. Ensure responsive design
5. Update documentation

---

**Part of the Smart Finance Tracker project by [@Tarrun1506](https://github.com/Tarrun1506)**
