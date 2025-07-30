// --- Handles User Registration and Login ---
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Patient = require('../models/Patient');
const ErrorResponse = require('../utils/errorResponse');
const { USER_ROLES } = require('../utils/constants');
const logService = require('../services/log.service');

// Generate JWT and send it via response only (no cookies)
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      hospital: user.hospital,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    hospitalId,
    hospitalName,
    hospitalAddress,
    dateOfBirth,
    edd,
    emergencyContactName,
    emergencyContactPhone,
    specialty,
  } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return next(new ErrorResponse('Name, email, password, and role are required', 400));
    }

    if (password.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters', 400));
    }

    let hospital = null;
    if (role !== USER_ROLES.SUPER_ADMIN) {
      if (!hospitalId) {
        return next(new ErrorResponse('Hospital ID is required for this role', 400));
      }

      hospital = await Hospital.findOne({ hospitalCode: hospitalId.toUpperCase() });
      if (!hospital) {
        // Create a new hospital if it doesn't exist
        try {
          hospital = await Hospital.create({
            name: hospitalName || `Hospital ${hospitalId.toUpperCase()}`,
            hospitalCode: hospitalId.toUpperCase(),
            address: hospitalAddress || 'Address to be updated',
            phone: '+254700000000',
            email: `admin@${hospitalId.toLowerCase()}.ke`,
            description: hospitalName ? 
              `${hospitalName} - Registered through user registration system.` : 
              'Hospital created during user registration. Please update details.'
          });
          console.log(`Created new hospital: ${hospital.name} (${hospital.hospitalCode})`);
        } catch (hospitalError) {
          console.error('Error creating hospital:', hospitalError);
          return next(new ErrorResponse(`Failed to create hospital with code ${hospitalId}. Code may be invalid or already exist.`, 400));
        }
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already exists', 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber,
      hospital: hospital ? hospital._id : null,
      specialty: role === USER_ROLES.STAFF ? specialty : undefined,
    });

    if (role === USER_ROLES.PATIENT) {
      if (!dateOfBirth || !edd || !emergencyContactName || !emergencyContactPhone) {
        return next(new ErrorResponse('Patient details (DOB, EDD, emergency contact) are required', 400));
      }

      await Patient.create({
        user: user._id,
        hospital: hospital ? hospital._id : null,
        fullName: name, // Use the name from user registration
        phoneNumber: phoneNumber, // Use the phone number from user registration
        dateOfBirth,
        edd,
        lmp: new Date(new Date(edd).getTime() - (280 * 24 * 60 * 60 * 1000)), // Calculate LMP from EDD (280 days back)
        pregnancyStatus: 'First pregnancy', // Default value, can be updated later
        maritalStatus: 'Single', // Default value, can be updated later
        locationVillage: 'To be updated', // Default value, can be updated later
        emergencyContactName,
        emergencyContactPhone,
        registeredBy: req.user ? req.user._id : user._id,
      });
    }

    await logService.logActivity(
      user._id,
      user.role,
      `Registered new user: ${user.name} (${user.role})`,
      'User',
      user._id
    );

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    await logService.logActivity(user._id, user.role, 'Logged in', 'Auth', user._id);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  await logService.logActivity(req.user._id, req.user.role, 'Logged out', 'Auth', req.user._id);

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    
    // Only allow updating certain fields
    const updateData = {
      name,
      email,
      phoneNumber
    };
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    await logService.logActivity(
      req.user._id, 
      req.user.role,
      'Updated profile',
      'User',
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change user password
// @route   POST /api/v1/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verify required fields
    if (!currentPassword || !newPassword) {
      return next(new ErrorResponse('Current password and new password are required', 400));
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }
    
    // Set new password
    user.password = newPassword;
    await user.save();
    
    await logService.logActivity(
      req.user._id,
      req.user.role,
      'Changed password',
      'User',
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};
