const User = require('../models/User');
const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const Visit = require('../models/Visit');
const Reminder = require('../models/Reminder');
const HealthTip = require('../models/HealthTip');
const Log = require('../models/Log');
const { USER_ROLES } = require('../utils/constants');

/**
 * @desc    Get super admin dashboard data
 * @route   GET /api/v1/dashboard/super-admin
 * @access  Private (Super Admin)
 */
const getSuperAdminDashboard = async (req, res) => {
  try {
    // Get stats
    const totalHospitals = await Hospital.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalPatients = await Patient.countDocuments();
    const totalStaff = await User.countDocuments({ role: USER_ROLES.STAFF });
    const hospitalAdmins = await User.countDocuments({ role: USER_ROLES.HOSPITAL_ADMIN });
    const activeHospitals = await Hospital.countDocuments({ status: 'active' });

    // Get recent hospitals
    const recentHospitals = await Hospital.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name location createdAt status');

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('hospital', 'name')
      .select('name role createdAt');

    // Get system logs
    const systemLogs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('action user timestamp details');

    // Get hospital performance
    const hospitalPerformance = await Hospital.aggregate([
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'hospital',
          as: 'patients'
        }
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'hospital',
          as: 'appointments'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'hospital',
          as: 'staff'
        }
      },
      {
        $project: {
          hospital: '$name',
          patients: { $size: '$patients' },
          appointments: { $size: '$appointments' },
          staff: { $size: '$staff' },
          performance: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $size: '$appointments' },
                      { $add: [{ $size: '$patients' }, 1] }
                    ]
                  },
                  100
                ]
              },
              0
            ]
          }
        }
      },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalHospitals,
          totalUsers,
          totalPatients,
          totalStaff,
          hospitalAdmins,
          activeHospitals
        },
        recentHospitals,
        recentUsers,
        systemLogs,
        hospitalPerformance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get hospital admin dashboard data
 * @route   GET /api/v1/dashboard/hospital-admin
 * @access  Private (Hospital Admin)
 */
const getHospitalAdminDashboard = async (req, res) => {
  try {
    const hospitalId = req.user.hospital;

    // Get stats
    const totalStaff = await User.countDocuments({ 
      hospital: hospitalId, 
      role: USER_ROLES.STAFF 
    });
    const totalPatients = await Patient.countDocuments({ hospital: hospitalId });
    const totalAppointments = await Appointment.countDocuments({ hospital: hospitalId });
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todayAppointments = await Appointment.countDocuments({
      hospital: hospitalId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const upcomingAppointments = await Appointment.countDocuments({
      hospital: hospitalId,
      appointmentDate: { $gt: endOfDay },
      status: 'scheduled'
    });
    
    const activeStaff = await User.countDocuments({
      hospital: hospitalId,
      role: USER_ROLES.STAFF,
      status: 'active'
    });

    // Get recent staff
    const recentStaff = await User.find({
      hospital: hospitalId,
      role: USER_ROLES.STAFF
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name specialty email createdAt status');

    // Get recent patients
    const recentPatients = await Patient.find({ hospital: hospitalId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name age lastVisit nextAppointment pregnancyWeek');

    // Get upcoming appointments
    const upcomingAppointmentsList = await Appointment.find({
      hospital: hospitalId,
      appointmentDate: { $gt: endOfDay },
      status: 'scheduled'
    })
      .sort({ appointmentDate: 1 })
      .limit(10)
      .populate('patient', 'name')
      .populate('staff', 'name')
      .select('patient staff appointmentDate type status');

    // Staff performance
    const staffPerformance = await User.aggregate([
      { $match: { hospital: hospitalId, role: USER_ROLES.STAFF } },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'staff',
          as: 'appointments'
        }
      },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'assignedStaff',
          as: 'patients'
        }
      },
      {
        $project: {
          name: 1,
          patients: { $size: '$patients' },
          appointments: { $size: '$appointments' },
          satisfaction: { $multiply: [Math.random() * 20 + 80, 1] } // Mock satisfaction
        }
      },
      { $limit: 10 }
    ]);

    // Department stats (mock for now)
    const departmentStats = [
      { department: 'Antenatal Care', patients: totalPatients * 0.4, appointments: totalAppointments * 0.35, staff: totalStaff * 0.3 },
      { department: 'Postnatal Care', patients: totalPatients * 0.25, appointments: totalAppointments * 0.25, staff: totalStaff * 0.25 },
      { department: 'General Consultation', patients: totalPatients * 0.35, appointments: totalAppointments * 0.4, staff: totalStaff * 0.45 }
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStaff,
          totalPatients,
          totalAppointments,
          upcomingAppointments,
          todayAppointments,
          activeStaff
        },
        recentStaff,
        recentPatients,
        upcomingAppointments: upcomingAppointmentsList,
        staffPerformance,
        departmentStats
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get staff dashboard data
 * @route   GET /api/v1/dashboard/staff
 * @access  Private (Staff)
 */
const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user.id;
    const hospitalId = req.user.hospital;

    // Get my patients
    const myPatients = await Patient.find({ assignedStaff: staffId })
      .sort({ lastVisit: -1 })
      .limit(10)
      .select('name age pregnancyWeek lastVisit nextAppointment status');

    // Get stats
    const totalPatients = await Patient.countDocuments({ assignedStaff: staffId });
    const totalAppointments = await Appointment.countDocuments({ staff: staffId });
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todayAppointments = await Appointment.countDocuments({
      staff: staffId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const upcomingAppointments = await Appointment.countDocuments({
      staff: staffId,
      appointmentDate: { $gt: endOfDay },
      status: 'scheduled'
    });
    
    const completedAppointments = await Appointment.countDocuments({
      staff: staffId,
      status: 'completed'
    });
    
    const pendingReminders = await Reminder.countDocuments({
      staff: staffId,
      status: 'pending'
    });

    // Today's appointments
    const todayAppointmentsList = await Appointment.find({
      staff: staffId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({ appointmentDate: 1 })
      .populate('patient', 'name')
      .select('patient appointmentDate type status');

    // Upcoming appointments
    const upcomingAppointmentsList = await Appointment.find({
      staff: staffId,
      appointmentDate: { $gt: endOfDay },
      status: 'scheduled'
    })
      .sort({ appointmentDate: 1 })
      .limit(10)
      .populate('patient', 'name')
      .select('patient appointmentDate type status');

    // Recent visits
    const recentVisits = await Visit.find({
      staff: staffId
    })
      .sort({ visitDate: -1 })
      .limit(10)
      .populate('patient', 'name')
      .select('patient visitDate type notes');

    // Reminders
    const reminders = await Reminder.find({
      staff: staffId
    })
      .sort({ scheduledFor: 1 })
      .limit(10)
      .populate('patient', 'name')
      .select('patient type message status');

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPatients,
          totalAppointments,
          todayAppointments,
          upcomingAppointments,
          completedAppointments,
          pendingReminders
        },
        myPatients,
        todayAppointments: todayAppointmentsList,
        upcomingAppointments: upcomingAppointmentsList,
        recentVisits,
        reminders
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get patient dashboard data
 * @route   GET /api/v1/dashboard/patient
 * @access  Private (Patient)
 */
const getPatientDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get patient record
    const patient = await Patient.findOne({ user: userId })
      .populate('hospital', 'name')
      .populate('assignedStaff', 'name specialty');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found'
      });
    }

    // Get appointments
    const upcomingAppointments = await Appointment.find({
      patient: patient._id,
      appointmentDate: { $gt: new Date() },
      status: 'scheduled'
    })
      .sort({ appointmentDate: 1 })
      .limit(5)
      .populate('staff', 'name specialty')
      .select('staff appointmentDate type notes status');

    const pastAppointments = await Appointment.find({
      patient: patient._id,
      appointmentDate: { $lt: new Date() }
    })
      .sort({ appointmentDate: -1 })
      .limit(10)
      .populate('staff', 'name specialty')
      .select('staff appointmentDate type notes status');

    // Get visits
    const recentVisits = await Visit.find({
      patient: patient._id
    })
      .sort({ visitDate: -1 })
      .limit(10)
      .populate('staff', 'name specialty')
      .select('staff visitDate type vitals notes');

    // Get reminders
    const reminders = await Reminder.find({
      patient: patient._id,
      status: { $in: ['pending', 'sent'] }
    })
      .sort({ scheduledFor: 1 })
      .limit(10)
      .select('type message scheduledFor status');

    // Get personalized health tips
    const healthTips = await HealthTip.find({
      $or: [
        { pregnancyStage: patient.pregnancyStage },
        { category: 'general' }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title content category priority');

    // Calculate stats
    const totalAppointments = await Appointment.countDocuments({ patient: patient._id });
    const completedAppointments = await Appointment.countDocuments({ 
      patient: patient._id, 
      status: 'completed' 
    });
    const totalVisits = await Visit.countDocuments({ patient: patient._id });
    const pendingReminders = await Reminder.countDocuments({ 
      patient: patient._id, 
      status: 'pending' 
    });

    res.status(200).json({
      success: true,
      data: {
        patient,
        stats: {
          totalAppointments,
          completedAppointments,
          totalVisits,
          pendingReminders,
          pregnancyWeek: patient.pregnancyWeek,
          nextAppointment: upcomingAppointments.length > 0 ? upcomingAppointments[0].appointmentDate : null
        },
        upcomingAppointments,
        pastAppointments,
        recentVisits,
        reminders,
        healthTips
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getSuperAdminDashboard,
  getHospitalAdminDashboard,
  getStaffDashboard,
  getPatientDashboard
};
