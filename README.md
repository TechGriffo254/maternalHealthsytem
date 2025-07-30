# Maternal Health Appointment and Alert System (MHAAS)

A comprehensive digital health solution designed for rural clinics to manage maternal health appointments, patient records, and automated alert systems for expectant mothers.

## 🏥 Overview

The Maternal Health Appointment and Alert System (MHAAS) is a full-stack web application that helps healthcare providers in rural areas manage:
- Patient registration and profile management
- Hospital and staff management
- Appointment scheduling and tracking
- Automated reminders via SMS/Email
- Health tips and educational content
- Visit records and medical history
- Real-time dashboard analytics

## 🏗️ Architecture

The system consists of two main components:
- **Backend**: RESTful API built with Node.js, Express, and MongoDB
- **Frontend**: React.js application with Material-UI components

## 🚀 Features

### Patient Management
- ✅ Patient registration with comprehensive medical history
- ✅ Pregnancy tracking with LMP and EDD calculations
- ✅ Emergency contact management
- ✅ Multi-language support (English, Kiswahili)

### Appointment System
- ✅ Schedule and manage appointments
- ✅ Automated SMS/Email reminders
- ✅ Visit history tracking
- ✅ Follow-up scheduling

### Healthcare Provider Tools
- ✅ Hospital and staff management
- ✅ Role-based access control (Admin, Doctor, Nurse, Receptionist)
- ✅ Patient registration by healthcare staff
- ✅ Dashboard with analytics

### Communication & Alerts
- ✅ Automated appointment reminders
- ✅ Health tip notifications
- ✅ SMS and Email integration
- ✅ Emergency contact notifications

### Security & Data
- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ Role-based authorization
- ✅ Secure API endpoints

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Cloudinary (optional)
- **SMS/Email**: Africa's Talking, Nodemailer
- **Scheduled Tasks**: node-cron
- **Environment**: dotenv

### Frontend
- **Framework**: React 19.1.1
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Yup validation
- **Date Handling**: Day.js with MUI Date Pickers
- **Notifications**: React Toastify
- **Charts**: Recharts

## 📋 Prerequisites

Before running this application, make sure you have:
- Node.js (v16 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd maternalHealthsytem-
```

### 2. Backend Setup
```bash
cd medicareBackend/backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database
MONGO_URI=mongodb://localhost:27017/mhaas
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mhaas

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_LIFETIME=1d

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS Configuration (Africa's Talking)
AFRICAS_TALKING_API_KEY=your_api_key
AFRICAS_TALKING_USERNAME=your_username

# Optional: Cloudinary for file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: AI Integration
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Frontend Setup
```bash
cd ../../medicareFrontend/maternal-health-frontend
npm install
```

### 4. Start the Applications

#### Start Backend Server
```bash
cd medicareBackend/backend
npm run dev
# Server will run on http://localhost:5000
```

#### Start Frontend Application
```bash
cd medicareFrontend/maternal-health-frontend
npm start
# Application will run on http://localhost:3000
```

## 📁 Project Structure

```
maternalHealthsytem-/
├── medicareBackend/
│   └── backend/
│       ├── config/          # Database and service configurations
│       ├── controllers/     # Route handlers and business logic
│       ├── middlewares/     # Authentication and validation middlewares
│       ├── models/          # MongoDB/Mongoose data models
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic services
│       ├── utils/           # Utility functions and helpers
│       ├── .env            # Environment variables (not in git)
│       ├── app.js          # Express app configuration
│       └── server.js       # Server entry point
│
├── medicareFrontend/
│   └── maternal-health-frontend/
│       ├── public/         # Static assets
│       ├── src/
│       │   ├── components/ # Reusable React components
│       │   ├── contexts/   # React context providers
│       │   ├── pages/      # Application pages/screens
│       │   ├── services/   # API service functions
│       │   ├── config/     # Configuration files
│       │   └── App.js      # Main React component
│       └── package.json
│
└── README.md              # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password
- `PUT /api/auth/update-profile` - Update user profile

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Register new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Create hospital
- `PUT /api/hospitals/:id` - Update hospital

### Staff Management
- `GET /api/staff` - Get staff members
- `POST /api/staff` - Add staff member
- `PUT /api/staff/:id` - Update staff member

## 👥 User Roles

1. **System Admin**: Full system access, hospital management
2. **Hospital Admin**: Hospital-specific management, staff oversight
3. **Doctor**: Patient care, medical records, appointments
4. **Nurse**: Patient registration, basic care, appointment assistance
5. **Receptionist**: Appointment scheduling, patient check-in
6. **Patient**: View appointments, receive notifications

## 🔔 Notification System

The system supports automated notifications via:
- **SMS**: Using Africa's Talking API
- **Email**: Using Nodemailer with Gmail SMTP
- **In-App**: Real-time dashboard notifications

### Notification Types:
- Appointment reminders (24 hours before)
- Health tips and educational content
- Emergency alerts
- Follow-up reminders

## 🚀 Deployment

### Backend Deployment (Node.js)
1. Choose a hosting platform (Heroku, Railway, DigitalOcean)
2. Set up environment variables
3. Configure MongoDB Atlas for production database
4. Deploy using platform-specific instructions

### Frontend Deployment (React)
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: [your-email@example.com]
- Documentation: [Link to documentation]
- Issues: [GitHub Issues page]

## 🙏 Acknowledgments

- Material-UI team for the excellent React components
- MongoDB team for the robust database solution
- Africa's Talking for SMS services
- All contributors who helped build this system

---

**Built with ❤️ for improving maternal healthcare in rural communities**
