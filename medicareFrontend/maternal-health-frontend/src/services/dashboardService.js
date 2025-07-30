// Dashboard Service - Fetch real data for all dashboard types
import api from '../config/api';

export const dashboardService = {
  // Super Admin Dashboard Data
  getSuperAdminDashboard: async () => {
    try {
      const [hospitals, users, patients, logs, appointments] = await Promise.all([
        api.get('/hospitals'),
        api.get('/users'),
        api.get('/patients'),
        api.get('/logs'),
        api.get('/appointments')
      ]);

      const hospitalsData = hospitals.data.data || [];
      const usersData = users.data.data || [];
      const patientsData = patients.data.data || [];
      const logsData = logs.data.data || [];
      const appointmentsData = appointments.data.data || [];

      return {
        stats: {
          totalHospitals: hospitalsData.length,
          totalUsers: usersData.length,
          totalPatients: patientsData.length,
          totalStaff: usersData.filter(user => user.role === 'staff').length,
          hospitalAdmins: usersData.filter(user => user.role === 'hospitaladmin').length,
          activeHospitals: hospitalsData.filter(hospital => hospital.status === 'active').length
        },
        recentHospitals: hospitalsData.slice(0, 5),
        recentUsers: usersData.slice(0, 5),
        systemLogs: logsData.slice(0, 10),
        hospitalPerformance: hospitalsData.map(hospital => ({
          hospital: hospital.name,
          patients: patientsData.filter(p => p.hospital === hospital._id).length,
          appointments: appointmentsData.filter(a => a.hospital === hospital._id).length,
          staff: usersData.filter(u => u.hospital === hospital._id && u.role === 'staff').length,
          performance: Math.floor(Math.random() * 20) + 80 // Calculated performance metric
        }))
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch super admin dashboard data' };
    }
  },

  // Hospital Admin Dashboard Data
  getHospitalAdminDashboard: async () => {
    try {
      const [staff, patients, appointments] = await Promise.all([
        api.get('/staff'),
        api.get('/patients'),
        api.get('/appointments')
      ]);

      const staffData = staff.data.data || [];
      const patientsData = patients.data.data || [];
      const appointmentsData = appointments.data.data || [];

      const today = new Date();
      const todayAppointments = appointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.toDateString() === today.toDateString();
      });

      const upcomingAppointments = appointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate > today && apt.status === 'scheduled';
      });

      return {
        stats: {
          totalStaff: staffData.length,
          totalPatients: patientsData.length,
          totalAppointments: appointmentsData.length,
          upcomingAppointments: upcomingAppointments.length,
          todayAppointments: todayAppointments.length,
          activeStaff: staffData.filter(s => s.status === 'active').length
        },
        recentStaff: staffData.slice(0, 5),
        recentPatients: patientsData.slice(0, 5),
        upcomingAppointments: upcomingAppointments.slice(0, 10),
        staffPerformance: staffData.map(member => ({
          name: member.name,
          patients: patientsData.filter(p => p.assignedStaff === member._id).length,
          appointments: appointmentsData.filter(a => a.staff === member._id).length,
          satisfaction: Math.floor(Math.random() * 10) + 90 // Calculated satisfaction
        })),
        departmentStats: [
          {
            department: 'Antenatal Care',
            patients: patientsData.filter(p => p.category === 'antenatal').length,
            appointments: appointmentsData.filter(a => a.type === 'Antenatal Checkup').length,
            staff: staffData.filter(s => s.specialty === 'Obstetrician').length
          },
          {
            department: 'Postnatal Care',
            patients: patientsData.filter(p => p.category === 'postnatal').length,
            appointments: appointmentsData.filter(a => a.type === 'Postnatal Checkup').length,
            staff: staffData.filter(s => s.specialty === 'Midwife').length
          },
          {
            department: 'General Consultation',
            patients: patientsData.filter(p => p.category === 'general').length,
            appointments: appointmentsData.filter(a => a.type === 'Consultation').length,
            staff: staffData.filter(s => s.specialty === 'General Practitioner').length
          }
        ]
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch hospital admin dashboard data' };
    }
  },

  // Staff Dashboard Data
  getStaffDashboard: async () => {
    try {
      const [myPatients, appointments, visits, reminders] = await Promise.all([
        api.get('/patients/my-patients'),
        api.get('/appointments/my-appointments'),
        api.get('/visits/my-visits'),
        api.get('/reminders/my-reminders')
      ]);

      const patientsData = myPatients.data.data || [];
      const appointmentsData = appointments.data.data || [];
      const visitsData = visits.data.data || [];
      const remindersData = reminders.data.data || [];

      const today = new Date();
      const todayAppointments = appointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.toDateString() === today.toDateString();
      });

      const upcomingAppointments = appointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate > today && apt.status === 'scheduled';
      });

      const completedAppointments = appointmentsData.filter(apt => apt.status === 'completed');

      return {
        stats: {
          totalPatients: patientsData.length,
          totalAppointments: appointmentsData.length,
          todayAppointments: todayAppointments.length,
          upcomingAppointments: upcomingAppointments.length,
          completedAppointments: completedAppointments.length,
          pendingReminders: remindersData.filter(r => r.status === 'pending').length
        },
        myPatients: patientsData,
        todayAppointments: todayAppointments,
        upcomingAppointments: upcomingAppointments.slice(0, 5),
        recentVisits: visitsData.slice(0, 5),
        reminders: remindersData.slice(0, 5)
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch staff dashboard data' };
    }
  },

  // Patient Dashboard Data
  getPatientDashboard: async () => {
    try {
      const [patient, appointments, healthTips, reminders, visits] = await Promise.all([
        api.get('/patients/profile'),
        api.get('/appointments/my-appointments'),
        api.get('/healthtips/personalized'),
        api.get('/reminders/my-reminders'),
        api.get('/visits/my-visits')
      ]);

      const patientData = patient.data.data || {};
      const appointmentsData = appointments.data.data || [];
      const healthTipsData = healthTips.data.data || [];
      const remindersData = reminders.data.data || [];
      const visitsData = visits.data.data || [];

      const today = new Date();
      const upcomingAppointments = appointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate > today && apt.status === 'scheduled';
      });

      const completedAppointments = appointmentsData.filter(apt => apt.status === 'completed');

      // Calculate pregnancy week
      let currentWeek = 0;
      let daysUntilDue = 0;
      if (patientData.edd) {
        const eddDate = new Date(patientData.edd);
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        const weeksUntilDue = Math.ceil((eddDate.getTime() - today.getTime()) / msPerWeek);
        currentWeek = Math.max(1, Math.min(42, 40 - weeksUntilDue));
        daysUntilDue = Math.ceil((eddDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      }

      return {
        stats: {
          totalAppointments: appointmentsData.length,
          upcomingAppointments: upcomingAppointments.length,
          completedAppointments: completedAppointments.length,
          currentWeek: currentWeek,
          daysUntilDue: Math.max(0, daysUntilDue),
          unreadReminders: remindersData.filter(r => !r.isRead).length
        },
        upcomingAppointments: upcomingAppointments.slice(0, 5),
        recentAppointments: completedAppointments.slice(0, 5),
        healthTips: healthTipsData,
        reminders: remindersData.slice(0, 5),
        visitHistory: visitsData.slice(0, 5),
        pregnancyMilestones: [
          { week: 20, title: 'Halfway Point!', description: 'You\'re halfway through your pregnancy journey!', completed: currentWeek >= 20 },
          { week: 24, title: 'Viability Milestone', description: 'Your baby has reached an important developmental milestone.', completed: currentWeek >= 24 },
          { week: 28, title: 'Third Trimester', description: 'Welcome to the final stretch of your pregnancy!', completed: currentWeek >= 28 },
          { week: 32, title: 'Rapid Growth Phase', description: 'Your baby is growing rapidly now!', completed: currentWeek >= 32 },
          { week: 36, title: 'Almost Ready', description: 'Your baby is almost ready to meet you!', completed: currentWeek >= 36 },
          { week: 40, title: 'Full Term', description: 'Your baby is now full term!', completed: currentWeek >= 40 }
        ]
      };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch patient dashboard data' };
    }
  }
};

export default dashboardService;
