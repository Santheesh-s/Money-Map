# 🚀 Deploying Finance Tracker to Render

This guide will walk you through deploying your Finance Tracker application to Render.

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a cloud MongoDB database at [mongodb.com/atlas](https://mongodb.com/atlas)

## Step 1: Prepare Your MongoDB Database

### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free cluster
3. Create a database user with read/write permissions
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs or Render's specific IPs)
5. Get your connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/finance-tracker`)

### Option B: Other MongoDB Providers
- You can also use other MongoDB hosting services like Railway, DigitalOcean, etc.

## Step 2: Push Your Code to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Render

### 1. Create a New Web Service

1. Log into [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your Finance Tracker repository

### 2. Configure the Service

**Basic Settings:**
- **Name**: `finance-tracker` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty (since we're deploying from root)

**Build Settings:**
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 3. Environment Variables

Add the following environment variables in Render:

**Required Variables:**
- `NODE_ENV` = `production`
- `MONGO_URI` = `your-mongodb-connection-string`
- `JWT_SECRET` = `your-super-secure-jwt-secret-key-here`
- `PORT` = `10000` (Render will set this automatically, but you can specify it)

**Optional Variables (if using email features):**
- `EMAIL_USER` = `your-email@gmail.com`
- `EMAIL_PASS` = `your-app-specific-password`
- `EMAIL_SERVICE` = `gmail`

**Optional Variables (if using AI features):**
- `GEMINI_API_KEY` = `your-gemini-api-key`

### 4. Advanced Settings

- **Auto-Deploy**: Enable this to automatically deploy when you push to GitHub
- **Instance Type**: Free tier should work fine for development/testing

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. The build process will:
   - Install dependencies
   - Build the React frontend
   - Start the Node.js server
   - The server will serve both API and static React files

## Step 5: Configure Your Frontend API Calls

Your deployed app will now serve both frontend and backend from the same domain. Make sure your frontend API calls use relative paths or environment variables.

If you have hardcoded URLs in your frontend, update them to use environment variables:

```javascript
// In your frontend API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative paths in production
  : 'http://localhost:5000';
```

## Step 6: Verify Deployment

1. Once deployment is complete, Render will provide you with a URL like `https://your-app-name.onrender.com`
2. Visit the URL to verify your application is working
3. Test key features:
   - User registration/login
   - Adding transactions
   - Budget management
   - Receipt upload (if configured)

## Common Issues & Troubleshooting

### Build Failures
- **Issue**: Build fails during `npm install`
- **Solution**: Check that all dependencies are in `package.json` and versions are compatible

### Database Connection Issues
- **Issue**: MongoDB connection fails
- **Solution**: 
  - Verify your MongoDB connection string
  - Check that your database user has proper permissions
  - Ensure IP whitelist includes `0.0.0.0/0` or Render's IPs

### Static Files Not Loading
- **Issue**: React app shows blank page
- **Solution**: 
  - Ensure the build script runs correctly
  - Check that `frontend/build` directory is created
  - Verify the static file serving configuration in `server.js`

### CORS Issues
- **Issue**: API calls fail with CORS errors
- **Solution**: The updated server configuration should handle this, but if issues persist:
  ```javascript
  // In server.js, update CORS configuration
  app.use(cors({
    origin: true, // Allow all origins in production
    credentials: true
  }));
  ```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/finance-tracker` |
| `JWT_SECRET` | Yes | JWT signing secret | `your-super-secure-secret-key` |
| `PORT` | No | Server port (Render sets this) | `10000` |
| `EMAIL_USER` | No | Email for notifications | `your-email@gmail.com` |
| `EMAIL_PASS` | No | Email app password | `your-app-password` |
| `GEMINI_API_KEY` | No | For AI receipt processing | `your-gemini-key` |

## Post-Deployment

### Custom Domain (Optional)
1. In Render dashboard, go to your service
2. Click **"Settings"** → **"Custom Domains"**
3. Add your domain and configure DNS

### Monitoring
- Render provides logs and metrics in the dashboard
- Set up monitoring for uptime and performance

### Scaling
- Free tier has limitations (sleeps after 15 minutes of inactivity)
- Consider upgrading to paid plans for production use

## Updates and Maintenance

### Automatic Deployments
- With auto-deploy enabled, pushing to your GitHub repository will trigger a new deployment

### Manual Deployments
- You can manually trigger deployments from the Render dashboard

### Environment Variable Updates
- Changes to environment variables require a manual redeploy
- Go to **"Environment"** → **"Manual Deploy"**

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret
2. **Database**: Use a dedicated database user with minimal required permissions
3. **Environment Variables**: Never commit sensitive data to GitHub
4. **HTTPS**: Render provides HTTPS by default
5. **CORS**: Configure CORS appropriately for production

## Support

If you encounter issues:
1. Check Render's build and runtime logs
2. Verify all environment variables are set correctly
3. Test your MongoDB connection
4. Check the [Render Documentation](https://render.com/docs)

---

**🎉 Congratulations!** Your Finance Tracker is now live on Render!

Your application will be available at: `https://your-app-name.onrender.com`