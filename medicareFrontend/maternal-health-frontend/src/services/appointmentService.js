// Appointment Service
import api from '../config/api';

export const appointmentService = {
  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create appointment' };
    }
  },

  // Get appointments
  getAppointments: async (params = {}) => {
    try {
      const response = await api.get('/appointments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointments' };
    }
  },

  // Get single appointment
  getAppointment: async (appointmentId) => {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch appointment' };
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update appointment' };
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await api.delete(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete appointment' };
    }
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    try {
      const response = await api.get('/appointments', {
        params: {
          status: 'scheduled',
          upcoming: true
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch upcoming appointments' };
    }
  }
};
