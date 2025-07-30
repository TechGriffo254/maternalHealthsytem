# Maternal Health Appointment and Alert System (MHAAS)

A comprehensive web-based application designed to support rural clinics in Kenya by improving the management of maternal health appointments, sending automated reminders, and providing essential health tips to expectant mothers. This system aims to address challenges such as missed antenatal visits, late deliveries, and reliance on outdated paper records.

## 🏥 Project Overview

The Maternal Health Appointment and Alert System (MHAAS) is a full-stack web application that helps healthcare providers in rural areas manage:
- Patient registration and profile management
- Hospital and staff management
- Appointment scheduling and tracking with automated reminders
- Health tips and educational content delivery
- Visit records and medical history
- Real-time dashboard analytics
- Audio and text health record submissions from patients

## 👥 User Roles & Features

The system supports multiple user roles, each with specific responsibilities:

### 🛡️ Super Admin
- **Hospital Onboarding**: Add new hospitals into the system with full details
- **Admin Management**: Add dedicated Hospital Admins for each onboarded hospital  
- **System Oversight**: View activity logs across the entire system
- **User Management**: View and manage all users registered in the system (Super Admins, Hospital Admins, Staff, Patients)
- **System Analytics**: Access comprehensive system-wide reports and statistics

### 🏥 Hospital Admin
- **Staff Management**: Onboard and manage staff members (doctors, nurses) for their specific hospital
- **Patient Oversight**: View and manage all patient records associated with their hospital
- **Appointment Management**: Oversee and manage all appointments and reminders within their hospital
- **Hospital Operations**: Monitor hospital-specific activities and generate reports
- **Resource Management**: Manage hospital resources and staff assignments

### 👨‍⚕️ Staff (Doctors/Nurses)
- **Patient Registration**: Register new patients into the system with comprehensive medical profiles
- **Visit Management**: Create and manage visits for individual patients with detailed medical records
- **Appointment Scheduling**: Set and update appointment schedules for patients
- **Communication**: Send timely reminders to patients regarding appointments and health tips
- **Medical Records**: Access and update patient medical histories and treatment plans
- **Health Monitoring**: Review patient submissions and provide medical guidance

### 🤰 Patient
- **Appointment Access**: View personal appointment schedules and visit history
- **Health Submissions**: Submit health records including audio notes and text updates to assigned staff
- **Automated Reminders**: Receive timely reminders for appointments and health-related alerts
- **Educational Content**: Access and read maternal health tips relevant to pregnancy stage
- **Profile Management**: Update personal information and emergency contacts
- **Communication**: Communicate with healthcare providers through the system

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

## 🔐 API Endpoints by Role

### Super Admin Endpoints
- `POST /api/hospitals` - Onboard new hospitals
- `POST /api/hospitals/:hospitalId/admin` - Add hospital administrators
- `GET /api/logs` - View system-wide activity logs
- `GET /api/users` - View all users in the system
- `GET /api/users/:id` - View any user details
- `PUT /api/users/:id` - Update any user
- `DELETE /api/users/:id` - Delete any user

### Hospital Admin Endpoints
- `GET /api/hospitals/:hospitalId/staff` - View hospital staff
- `POST /api/staff` - Add new staff members (doctors, nurses)
- `GET /api/hospitals/:hospitalId/patients` - View hospital patients
- `GET /api/hospitals/:hospitalId/appointments` - Manage hospital appointments
- `GET /api/hospitals/:hospitalId/submissions` - View patient submissions
- `GET /api/users/:userId/logs` - View logs for hospital users

### Staff (Doctors/Nurses) Endpoints
- `POST /api/patients` - Register new patients
- `GET /api/patients` - View patients in their hospital
- `POST /api/visits` - Create patient visits
- `PUT /api/visits/:id` - Update visit records
- `POST /api/appointments` - Schedule appointments
- `PUT /api/appointments/:id` - Update appointments
- `POST /api/reminders` - Send reminders to patients
- `GET /api/hospitals/:hospitalId/submissions` - View patient submissions

### Patient Endpoints
- `GET /api/appointments/my` - View personal appointments
- `GET /api/visits/my` - View visit history
- `POST /api/me/submit` - Submit health records (audio/text)
- `GET /api/me/submissions` - View own submissions
- `GET /api/health-tips` - Access health tips
- `PUT /api/auth/update-profile` - Update personal profile

### Common Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password

## 👥 User Roles

1. **System Admin**: Full system access, hospital management
2. **Hospital Admin**: Hospital-specific management, staff oversight
3. **Doctor**: Patient care, medical records, appointments
4. **Nurse**: Patient registration, basic care, appointment assistance
5. **Receptionist**: Appointment scheduling, patient check-in
6. **Patient**: View appointments, receive notifications

## 🔔 Notification & Alert System

The system supports automated notifications via:
- **SMS**: Using Africa's Talking API
- **Email**: Using Nodemailer with Gmail SMTP
- **In-App**: Real-time dashboard notifications

### Notification Types
- Appointment reminders (24 hours before)
- Health tips and educational content relevant to pregnancy stage
- Emergency alerts for high-risk pregnancies
- Follow-up reminders for missed appointments
- Medication reminders
- Antenatal care schedule notifications

### Alert Features
- Automated reminder system for expectant mothers
- Missed appointment follow-up alerts
- Health tips delivery based on pregnancy stage
- Emergency contact notifications
- Staff notifications for urgent patient needs

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
