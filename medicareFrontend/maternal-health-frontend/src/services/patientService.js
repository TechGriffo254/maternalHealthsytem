// Patient Service
import api from '../config/api';

export const patientService = {
  // Register new patient
  registerPatient: async (patientData) => {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to register patient' };
    }
  },

  // Get all patients for a hospital
  getHospitalPatients: async (hospitalId, params = {}) => {
    try {
      const response = await api.get(`/patients/hospitals/${hospitalId}/patients`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch patients' };
    }
  },

  // Get single patient
  getPatient: async (patientId) => {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch patient' };
    }
  },

  // Update patient
  updatePatient: async (patientId, updateData) => {
    try {
      const response = await api.put(`/patients/${patientId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update patient' };
    }
  },

  // Delete patient
  deletePatient: async (patientId) => {
    try {
      const response = await api.delete(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete patient' };
    }
  }
};
