// Health Tips Service
import api from '../config/api';

export const healthTipService = {
  // Get health tips
  getHealthTips: async (params = {}) => {
    try {
      const response = await api.get('/healthtips', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch health tips' };
    }
  },

  // Get health tips by pregnancy stage
  getHealthTipsByStage: async (pregnancyStage) => {
    try {
      const response = await api.get('/healthtips', {
        params: { pregnancyStage }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch health tips for stage' };
    }
  },

  // Create health tip (admin/staff only)
  createHealthTip: async (tipData) => {
    try {
      const response = await api.post('/healthtips', tipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create health tip' };
    }
  },

  // Update health tip
  updateHealthTip: async (tipId, updateData) => {
    try {
      const response = await api.put(`/healthtips/${tipId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update health tip' };
    }
  },

  // Delete health tip
  deleteHealthTip: async (tipId) => {
    try {
      const response = await api.delete(`/healthtips/${tipId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete health tip' };
    }
  }
};
