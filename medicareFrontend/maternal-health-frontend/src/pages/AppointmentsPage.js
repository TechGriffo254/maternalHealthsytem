import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { patientService } from '../services/patientService';
import { toast } from 'react-toastify';

// TabPanel component for handling tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AppointmentsPage = () => {
  // State variables
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentType: 'Antenatal',
    appointmentDate: dayjs(),
    appointmentTime: dayjs(),
    notes: '',
    status: 'Scheduled'
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user } = useAuth();

  // Filter for appointments based on tab value
  const getFilteredAppointments = () => {
    let filtered = [...appointments];
    
    // Filter by search term if provided
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(apt => {
        const patientName = apt.patient?.fullName?.toLowerCase() || '';
        const appointmentType = apt.appointmentType?.toLowerCase() || '';
        const notes = apt.notes?.toLowerCase() || '';
        
        return (
          patientName.includes(searchLower) || 
          appointmentType.includes(searchLower) || 
          notes.includes(searchLower)
        );
      });
    }
    
    // Filter by tab (status)
    switch (tabValue) {
      case 0: // All appointments
        return filtered;
      case 1: // Upcoming appointments
        return filtered.filter(apt => 
          apt.status === 'Scheduled' && 
          dayjs(apt.appointmentDate).isAfter(dayjs())
        );
      case 2: // Completed appointments
        return filtered.filter(apt => apt.status === 'Completed');
      case 3: // Cancelled appointments
        return filtered.filter(apt => apt.status === 'Cancelled');
      default:
        return filtered;
    }
  };

  // Fetch all appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointments();
      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
      toast.error('Failed to load appointments');
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
      await fetchAppointments();
    };
    
    loadData();
  }, [fetchPatients, fetchAppointments]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open dialog for adding new appointment
  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setFormData({
      patientId: '',
      appointmentType: 'Antenatal',
      appointmentDate: dayjs(),
      status: 'Scheduled',
      notes: ''
    });
    setOpenDialog(true);
  };

  // Open dialog for editing existing appointment
  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientId: appointment.patient?._id || appointment.patientId,
      appointmentType: appointment.appointmentType,
      appointmentDate: dayjs(appointment.appointmentDate),
      status: appointment.status,
      notes: appointment.notes || ''
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
      appointmentDate: newValue
    }));
  };

  // Save appointment (create or update)
  const handleSaveAppointment = async () => {
    try {
      setActionLoading(true);
      
      const appointmentData = {
        ...formData,
        hospitalId: user?.hospitalId,
        appointmentDate: formData.appointmentDate.toISOString()
      };
      
      if (selectedAppointment) {
        // Update existing appointment
        await appointmentService.updateAppointment(
          selectedAppointment._id, 
          appointmentData
        );
        toast.success('Appointment updated successfully');
      } else {
        // Create new appointment
        await appointmentService.createAppointment(appointmentData);
        toast.success('Appointment created successfully');
      }
      
      // Refresh appointments
      fetchAppointments();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error.message || 'Failed to save appointment');
    } finally {
      setActionLoading(false);
    }
  };

  // Update appointment status
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setActionLoading(true);
      await appointmentService.updateAppointmentStatus(appointmentId, { status: newStatus });
      toast.success(`Appointment ${newStatus.toLowerCase()}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        setActionLoading(true);
        await appointmentService.deleteAppointment(appointmentId);
        toast.success('Appointment deleted successfully');
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Failed to delete appointment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Helper to format appointment date
  const formatAppointmentDate = (dateString) => {
    return dayjs(dateString).format('MMM D, YYYY h:mm A');
  };

  // Helper to get chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Appointments
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddAppointment}
            disabled={actionLoading}
          >
            New Appointment
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search appointments"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="appointment tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All" />
            <Tab label="Upcoming" />
            <Tab label="Completed" />
            <Tab label="Cancelled" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : (
          <TabPanel value={tabValue} index={tabValue}>
            {getFilteredAppointments().length === 0 ? (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No appointments found
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {getFilteredAppointments().map((appointment) => (
                  <Grid item xs={12} md={6} key={appointment._id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        p: 2,
                        borderLeft: `4px solid ${
                          appointment.status === 'Scheduled' ? '#1976d2' : 
                          appointment.status === 'Completed' ? '#00C853' : 
                          appointment.status === 'Cancelled' ? '#d32f2f' : '#757575'
                        }`
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">
                          {appointment.patient?.fullName || 'Unknown Patient'}
                        </Typography>
                        <Chip 
                          label={appointment.status} 
                          size="small"
                          color={getStatusChipColor(appointment.status)}
                        />
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <CalendarIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {formatAppointmentDate(appointment.appointmentDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          <strong>Type:</strong> {appointment.appointmentType}
                        </Typography>
                        {appointment.notes && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            <strong>Notes:</strong> {appointment.notes}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        {appointment.status === 'Scheduled' && (
                          <>
                            <Tooltip title="Mark as completed">
                              <IconButton 
                                size="small" 
                                onClick={() => handleStatusChange(appointment._id, 'Completed')}
                                disabled={actionLoading}
                                color="success"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel appointment">
                              <IconButton 
                                size="small" 
                                onClick={() => handleStatusChange(appointment._id, 'Cancelled')}
                                disabled={actionLoading}
                                color="error"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="Edit appointment">
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditAppointment(appointment)}
                            disabled={actionLoading}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete appointment">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteAppointment(appointment._id)}
                            disabled={actionLoading}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        )}
      </Paper>

      {/* Add/Edit Appointment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="patient-select-label">Patient</InputLabel>
                <Select
                  labelId="patient-select-label"
                  id="patient-select"
                  name="patientId"
                  value={formData.patientId}
                  label="Patient"
                  onChange={handleInputChange}
                  required
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
              <FormControl fullWidth>
                <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
                <Select
                  labelId="appointment-type-label"
                  id="appointment-type"
                  name="appointmentType"
                  value={formData.appointmentType}
                  label="Appointment Type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Antenatal">Antenatal</MenuItem>
                  <MenuItem value="Postnatal">Postnatal</MenuItem>
                  <MenuItem value="Vaccination">Vaccination</MenuItem>
                  <MenuItem value="General Checkup">General Checkup</MenuItem>
                  <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                  <MenuItem value="Laboratory Test">Laboratory Test</MenuItem>
                  <MenuItem value="Nutritional Counseling">Nutritional Counseling</MenuItem>
                  <MenuItem value="Birth Preparation">Birth Preparation</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <DateTimePicker
                label="Appointment Date and Time"
                value={formData.appointmentDate}
                onChange={handleDateChange}
                slotProps={{ 
                  textField: { fullWidth: true }
                }}
              />
            </Grid>

            {selectedAppointment && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAppointment} 
            variant="contained"
            disabled={!formData.patientId || actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentsPage;
