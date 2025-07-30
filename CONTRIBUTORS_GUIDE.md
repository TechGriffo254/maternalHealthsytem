# 🚀 MHAAS Contributors Setup Guide

## ✅ **ISSUE FIXED!** - Repository Now Uses Monorepo Structure

The cloning issue has been resolved! The repository has been converted from submodules to a monorepo structure, meaning all files are now included in a single clone operation.

## 📥 How to Clone and Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/TechGriffo254/maternalHealthsytem.git
cd maternalHealthsytem
```

**✅ You will now get ALL files including:**
- Complete backend code in `medicareBackend/backend/`
- Complete frontend code in `medicareFrontend/maternal-health-frontend/`
- All documentation and configuration files

### Step 2: Backend Setup
```bash
# Navigate to backend directory
cd medicareBackend/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database and service credentials
# Required variables:
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET (JWT secret key)
# - EMAIL_USER & EMAIL_PASS (for notifications)
# - AFRICAS_TALKING_API_KEY (for SMS, optional)

# Start the backend server
npm run dev
```

### Step 3: Frontend Setup
```bash
# Navigate to frontend directory (open new terminal)
cd medicareFrontend/maternal-health-frontend

# Install dependencies
npm install

# Start the frontend application
npm start
```

## 🔧 Environment Setup

### Required Environment Variables (.env file)
Create a `.env` file in `medicareBackend/backend/` with:

```env
# Database
MONGO_URI=mongodb://localhost:27017/mhaas
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mhaas

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_LIFETIME=1d

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# SMS Configuration (Optional)
AFRICAS_TALKING_API_KEY=your_api_key
AFRICAS_TALKING_USERNAME=your_username
```

## 🛡️ Super Admin Access

### Existing Super Admin
- **Email**: `kamau@gmail.com`
- **Role**: Super Admin
- **Status**: Active in the system

### Create Additional Super Admin (if needed)
```bash
cd medicareBackend/backend
node createSuperAdmin.js
```

## 📁 Project Structure
```
maternalHealthsytem/
├── README.md                          # Main project documentation
├── CREDENTIALS.md                     # Login credentials and setup
├── CURRENT_USERS.md                   # Current system users
├── MHAAS_REQUIREMENTS_VERIFICATION.md # Requirements compliance
├── DEPLOYMENT_SUMMARY.md              # Deployment status
├── .gitignore                         # Git ignore rules
│
├── medicareBackend/
│   └── backend/                       # Backend API (Node.js/Express)
│       ├── controllers/               # API route handlers
│       ├── models/                    # Database models (MongoDB)
│       ├── routes/                    # API routes
│       ├── services/                  # Business logic services
│       ├── middlewares/               # Authentication & validation
│       ├── utils/                     # Utility functions
│       ├── config/                    # Configuration files
│       ├── .env.example               # Environment template
│       ├── package.json               # Backend dependencies
│       └── server.js                  # Server entry point
│
└── medicareFrontend/
    └── maternal-health-frontend/      # Frontend React App
        ├── src/
        │   ├── components/            # Reusable React components
        │   ├── pages/                 # Application pages
        │   ├── services/              # API service calls
        │   ├── contexts/              # React context providers
        │   └── config/                # Frontend configuration
        ├── public/                    # Static assets
        └── package.json               # Frontend dependencies
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Empty directories after clone"
**✅ FIXED!** This was caused by submodule structure. Now resolved with monorepo.

#### 2. "Cannot connect to database"
- Check MongoDB is running (local) or connection string (Atlas)
- Verify `.env` file has correct `MONGO_URI`
- Check network connectivity

#### 3. "Backend won't start"
```bash
# Install dependencies
cd medicareBackend/backend
npm install

# Check for missing .env file
cp .env.example .env
# Edit .env with your values

# Try starting with debug
npm run dev
```

#### 4. "Frontend won't start"
```bash
# Install dependencies
cd medicareFrontend/maternal-health-frontend
npm install

# Clear cache and restart
npm start
```

#### 5. "API calls failing"
- Ensure backend is running on `http://localhost:5000`
- Check frontend API configuration in `src/config/api.js`
- Verify CORS settings in backend

## 🤝 Contributing

### Making Changes
1. **Fork** the repository
2. **Clone** your fork
3. Create a **feature branch**: `git checkout -b feature/amazing-feature`
4. **Make changes** and test thoroughly
5. **Commit** with descriptive messages: `git commit -m 'Add amazing feature'`
6. **Push** to your fork: `git push origin feature/amazing-feature`
7. **Create Pull Request** to main repository

### Development Workflow
1. **Backend changes**: Test with Postman/Thunder Client
2. **Frontend changes**: Test in browser with dev tools
3. **Database changes**: Use MongoDB Compass for verification
4. **Environment changes**: Update `.env.example` if needed

## 📞 Support

### Getting Help
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check README.md and related docs
- **Code Review**: Request reviews on pull requests

### System Users for Testing
- **Super Admin**: kamau@gmail.com
- **Hospital Admin**: oasiskakamega@gmail.com (Oasis Kakamega)
- **Staff**: griffo@gmail.com (Kakamega Referal Hospital)
- **Patient**: purity@gmail.com (Oasis Kakamega)

---

**🎉 Happy Contributing! The MHAAS system is ready for collaborative development!**
