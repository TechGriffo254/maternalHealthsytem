import api from '../config/api';

const hospitalService = {
  // Get all hospitals for registration (public endpoint)
  getHospitalsForRegistration: async () => {
    try {
      const response = await api.get('/hospitals/public/list');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hospitals');
    }
  },
};

export default hospitalService;
