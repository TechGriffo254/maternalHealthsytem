# 🔐 MHAAS System Credentials

## Default Super Admin Account

### 🛡️ Super Administrator (EXISTING)
- **Email**: `kamau@gmail.com`
- **Name**: Juma
- **Role**: Super Admin
- **Status**: ✅ Already Created

⚠️ **Note**: The password for this account was set during registration and is not stored in plain text for security reasons.

### 🔑 Access Instructions
1. **If you know the password**: Use the email `kamau@gmail.com` with your password
2. **If you forgot the password**: You'll need to reset it through the system or contact the administrator
3. **For new super admin**: You can create additional super admin accounts using the registration system

### 📝 How to Create Super Admin

If the super admin doesn't exist, run the creation script:

```bash
cd medicareBackend/backend
node createSuperAdmin.js
```

This will create the default super admin account with the credentials above.

## 🚀 First Time Setup

### Step 1: Create Super Admin
1. Start the backend server: `npm run dev`
2. Run the super admin creation script: `node createSuperAdmin.js`
3. Verify the account was created successfully

### Step 2: Login as Super Admin
1. Open the frontend application: `http://localhost:3000`
2. Click "Login"
3. Use the existing super admin credentials:
   - Email: `kamau@gmail.com`
   - Password: [The password set during registration]

### Step 3: System Setup
1. **Change Password**: Update the default password immediately
2. **Onboard Hospitals**: Add hospitals using the hospital management interface
3. **Create Hospital Admins**: Add administrators for each hospital
4. **Monitor System**: Use the logs and user management features

## 🏥 Sample Hospital Setup

After logging in as Super Admin, you can create:

### Sample Hospital
- **Name**: Nairobi General Hospital
- **Address**: P.O. Box 20723, Nairobi
- **Phone**: +254701234567
- **Email**: admin@nairobigeneral.ke

### Sample Hospital Admin
- **Name**: Dr. Jane Doe
- **Email**: jane.doe@nairobigeneral.ke
- **Phone**: +254701234568
- **Role**: Hospital Admin

## 🔒 Security Notes

### Default Credentials Security
- ⚠️ **IMPORTANT**: Change the default super admin password immediately after first login
- 🔐 Use strong passwords for all accounts
- 📱 Verify phone numbers for SMS notifications
- 📧 Use valid email addresses for notifications

### Production Setup
1. **Environment Variables**: Ensure all `.env` variables are properly configured
2. **Database Security**: Use MongoDB Atlas with proper access controls
3. **SSL/HTTPS**: Enable HTTPS for production deployment
4. **Backup Strategy**: Implement regular database backups

## 🎯 Role Hierarchy

```
Super Admin (System Level)
    ├── Hospital Admin (Hospital Level)
    │   ├── Staff - Doctor (Hospital Level)
    │   ├── Staff - Nurse (Hospital Level)
    │   └── Staff - Midwife (Hospital Level)
    └── Patients (Hospital Level)
```

## 📱 Test Accounts (Optional)

You can create these test accounts for demonstration:

### Test Hospital Admin
- **Email**: admin@test-hospital.ke
- **Password**: TestAdmin@2025
- **Hospital**: Test Rural Clinic

### Test Doctor
- **Email**: doctor@test-hospital.ke
- **Password**: TestDoctor@2025
- **Specialty**: General Practitioner

### Test Patient
- **Email**: patient@test.ke
- **Password**: TestPatient@2025
- **Phone**: +254701234570

## 🆘 Troubleshooting

### Can't Login?
1. Verify the backend server is running
2. Check MongoDB connection
3. Ensure the super admin account exists
4. Verify frontend is connecting to the correct API endpoint

### Forgot Password?
1. Use the password reset functionality (if implemented)
2. Or recreate the super admin using the script
3. Or manually update in the database

### Database Issues?
1. Check MongoDB connection string in `.env`
2. Verify database permissions
3. Check network connectivity

---

**🛡️ Keep these credentials secure and change default passwords immediately!**
