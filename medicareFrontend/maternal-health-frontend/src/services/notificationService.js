import axios from '../config/api';

class NotificationService {
  // Get all notifications for the current user
  async getNotifications() {
    return await axios.get('/notifications');
  }
  
  // Mark a notification as read
  async markAsRead(notificationId) {
    return await axios.patch(`/notifications/${notificationId}/read`);
  }
  
  // Mark all notifications as read
  async markAllAsRead() {
    return await axios.patch('/notifications/read-all');
  }
  
  // Delete a notification
  async deleteNotification(notificationId) {
    return await axios.delete(`/notifications/${notificationId}`);
  }
  
  // Send a notification to a patient
  async sendPatientNotification(patientId, data) {
    return await axios.post(`/notifications/patients/${patientId}`, data);
  }
  
  // Send a reminder to a patient
  async sendReminder(data) {
    return await axios.post('/reminders', data);
  }
  
  // Get all reminders
  async getReminders() {
    return await axios.get('/reminders');
  }
  
  // Get a specific reminder
  async getReminder(reminderId) {
    return await axios.get(`/reminders/${reminderId}`);
  }
  
  // Update a reminder
  async updateReminder(reminderId, data) {
    return await axios.put(`/reminders/${reminderId}`, data);
  }
  
  // Delete a reminder
  async deleteReminder(reminderId) {
    return await axios.delete(`/reminders/${reminderId}`);
  }
}

export const notificationService = new NotificationService();
