import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Check as CheckIcon,
  NotificationImportant as NotificationImportantIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';
import { patientService } from '../services/patientService';
import { toast } from 'react-toastify';

const RemindersPage = () => {
  // State variables
  const [reminders, setReminders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    message: '',
    scheduledDate: dayjs().add(1, 'day'),
    reminderType: 'Appointment',
    status: 'Scheduled'
  });
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  const { user } = useAuth();

  // Get filtered reminders
  const getFilteredReminders = () => {
    let filtered = [...reminders];
    
    if (selectedPatientFilter) {
      filtered = filtered.filter(reminder => reminder.patient?._id === selectedPatientFilter);
    }
    
    if (selectedStatusFilter) {
      filtered = filtered.filter(reminder => reminder.status === selectedStatusFilter);
    }
    
    return filtered;
  };

  // Fetch all reminders
  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationService.getReminders();
      setReminders(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      setError('Failed to fetch reminders. Please try again later.');
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all patients
  const fetchPatients = useCallback(async () => {
    try {
      const response = await patientService.getHospitalPatients(user?.hospital || '');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    }
  }, [user?.hospital]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchPatients();
      await fetchReminders();
    };
    
    loadData();
  }, [fetchPatients, fetchReminders]); // Add dependencies

  // Open dialog for adding new reminder
  const handleAddReminder = () => {
    setEditingReminderId(null);
    setFormData({
      patientId: '',
      message: '',
      scheduledDate: dayjs().add(1, 'day'),
      reminderType: 'Appointment',
      status: 'Scheduled'
    });
    setOpenDialog(true);
  };

  // Open dialog for editing existing reminder
  const handleEditReminder = (reminder) => {
    setEditingReminderId(reminder._id);
    setFormData({
      patientId: reminder.patient?._id || reminder.patientId,
      message: reminder.message,
      scheduledDate: dayjs(reminder.scheduledDate),
      reminderType: reminder.reminderType,
      status: reminder.status
    });
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date change from date picker
  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      scheduledDate: newValue
    }));
  };

  // Save reminder (create or update)
  const handleSaveReminder = async () => {
    try {
      setActionLoading(true);
      
      const reminderData = {
        ...formData,
        scheduledDate: formData.scheduledDate.toISOString(),
        hospitalId: user?.hospitalId
      };
      
      if (editingReminderId) {
        // Update existing reminder
        await notificationService.updateReminder(editingReminderId, reminderData);
        toast.success('Reminder updated successfully');
      } else {
        // Create new reminder
        await notificationService.sendReminder(reminderData);
        toast.success('Reminder created successfully');
      }
      
      // Refresh reminders
      fetchReminders();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving reminder:', error);
      toast.error(error.message || 'Failed to save reminder');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a reminder
  const handleDeleteReminder = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        setActionLoading(true);
        await notificationService.deleteReminder(reminderId);
        toast.success('Reminder deleted successfully');
        fetchReminders();
      } catch (error) {
        console.error('Error deleting reminder:', error);
        toast.error('Failed to delete reminder');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Send a reminder immediately
  const handleSendNow = async (reminder) => {
    try {
      setActionLoading(true);
      
      // Send patient notification
      await notificationService.sendPatientNotification(reminder.patientId || reminder.patient._id, {
        message: reminder.message,
        type: 'Reminder',
        title: `${reminder.reminderType} Reminder`
      });
      
      // Update reminder status to sent
      await notificationService.updateReminder(reminder._id, {
        ...reminder,
        status: 'Sent',
        sentDate: new Date().toISOString()
      });
      
      toast.success('Reminder sent successfully');
      fetchReminders();
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format('MMM D, YYYY h:mm A');
  };

  // Get reminder type color
  const getReminderTypeColor = (type) => {
    switch (type) {
      case 'Appointment':
        return '#1976d2'; // blue
      case 'Medication':
        return '#00C853'; // medical green
      case 'Test':
        return '#FF9800'; // orange
      case 'General':
        return '#0277BD'; // secondary blue
      default:
        return '#757575'; // grey
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Patient Reminders
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddReminder}
            disabled={actionLoading}
          >
            New Reminder
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="patient-filter-label">Filter by Patient</InputLabel>
                <Select
                  labelId="patient-filter-label"
                  value={selectedPatientFilter}
                  onChange={(e) => setSelectedPatientFilter(e.target.value)}
                  label="Filter by Patient"
                >
                  <MenuItem value="">
                    <em>All Patients</em>
                  </MenuItem>
                  {patients.map((patient) => (
                    <MenuItem key={patient._id} value={patient._id}>
                      {patient.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  label="Filter by Status"
                >
                  <MenuItem value="">
                    <em>All Statuses</em>
                  </MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Sent">Sent</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Reminders List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
        ) : getFilteredReminders().length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>No reminders found</Alert>
        ) : (
          <Grid container spacing={3}>
            {getFilteredReminders().map((reminder) => (
              <Grid item xs={12} sm={6} md={4} key={reminder._id}>
                <Card 
                  sx={{ 
                    position: 'relative',
                    borderTop: `4px solid ${getReminderTypeColor(reminder.reminderType)}`
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 1
                    }}
                  >
                    <Chip 
                      label={reminder.status} 
                      size="small"
                      color={
                        reminder.status === 'Scheduled' ? 'primary' :
                        reminder.status === 'Sent' ? 'success' : 'error'
                      }
                    />
                  </Box>
                  <CardContent>
                    <Box sx={{ mb: 2, pt: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {reminder.reminderType} Reminder
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                        {reminder.message}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {reminder.patient?.fullName || 'Unknown Patient'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {formatDate(reminder.scheduledDate)}
                      </Typography>
                    </Box>
                    
                    {reminder.status === 'Sent' && reminder.sentDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <CheckIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          Sent on {formatDate(reminder.sentDate)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {reminder.status === 'Scheduled' && (
                        <Tooltip title="Send now">
                          <IconButton
                            size="small"
                            onClick={() => handleSendNow(reminder)}
                            disabled={actionLoading}
                            color="primary"
                          >
                            <NotificationsIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit reminder">
                        <IconButton
                          size="small"
                          onClick={() => handleEditReminder(reminder)}
                          disabled={actionLoading || reminder.status === 'Sent'}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete reminder">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteReminder(reminder._id)}
                          disabled={actionLoading}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Add/Edit Reminder Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReminderId ? 'Edit Reminder' : 'Create New Reminder'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="patient-select-label">Patient</InputLabel>
                <Select
                  labelId="patient-select-label"
                  id="patient-select"
                  name="patientId"
                  value={formData.patientId}
                  label="Patient"
                  onChange={handleInputChange}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient._id} value={patient._id}>
                      {patient.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="reminder-type-label">Reminder Type</InputLabel>
                <Select
                  labelId="reminder-type-label"
                  id="reminder-type"
                  name="reminderType"
                  value={formData.reminderType}
                  label="Reminder Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Appointment">Appointment</MenuItem>
                  <MenuItem value="Medication">Medication</MenuItem>
                  <MenuItem value="Test">Test/Lab Work</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <DateTimePicker
                label="Scheduled Date and Time"
                value={formData.scheduledDate}
                onChange={handleDateChange}
                slotProps={{ 
                  textField: { fullWidth: true, required: true }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Reminder Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                multiline
                rows={3}
                placeholder="Enter the message to send to the patient"
              />
            </Grid>
            
            {editingReminderId && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    id="status-select"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                    <MenuItem value="Sent">Sent</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveReminder} 
            variant="contained"
            disabled={!formData.patientId || !formData.message || actionLoading}
            startIcon={actionLoading ? <CircularProgress size={20} /> : <NotificationImportantIcon />}
          >
            {editingReminderId ? 'Update' : 'Create'} Reminder
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RemindersPage;
