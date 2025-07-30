const express = require('express');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { USER_ROLES } = require('../utils/constants');
const {
  getSuperAdminDashboard,
  getHospitalAdminDashboard,
  getStaffDashboard,
  getPatientDashboard
} = require('../controllers/dashboard.controller');

const router = express.Router();

/**
 * @route   GET /api/v1/dashboard/super-admin
 * @desc    Get super admin dashboard data
 * @access  Private (Super Admin)
 */
router.get('/super-admin', protect, authorize(USER_ROLES.SUPER_ADMIN), getSuperAdminDashboard);

/**
 * @route   GET /api/v1/dashboard/hospital-admin
 * @desc    Get hospital admin dashboard data
 * @access  Private (Hospital Admin)
 */
router.get('/hospital-admin', protect, authorize(USER_ROLES.HOSPITAL_ADMIN), getHospitalAdminDashboard);

/**
 * @route   GET /api/v1/dashboard/staff
 * @desc    Get staff dashboard data
 * @access  Private (Staff)
 */
router.get('/staff', protect, authorize(USER_ROLES.STAFF), getStaffDashboard);

/**
 * @route   GET /api/v1/dashboard/patient
 * @desc    Get patient dashboard data
 * @access  Private (Patient)
 */
router.get('/patient', protect, authorize(USER_ROLES.PATIENT), getPatientDashboard);

module.exports = router;
