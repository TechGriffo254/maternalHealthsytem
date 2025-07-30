import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Divider, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  Tab,
  Tabs, 
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Add as AddIcon,
  Phone as PhoneIcon, 
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { appointmentService } from '../services/appointmentService';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';

// TabPanel component for handling tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [appointmentFormData, setAppointmentFormData] = useState({
    patientId: '',
    appointmentType: 'Antenatal',
    appointmentDate: dayjs(),
    notes: '',
    status: 'Scheduled'
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Calculate the estimated due date from LMP
  const calculateEDD = (lmp) => {
    if (!lmp) return 'Not available';
    return dayjs(lmp).add(280, 'day').format('MMM D, YYYY');
  };

  // Calculate weeks of pregnancy
  const calculateWeeksOfPregnancy = (lmp) => {
    if (!lmp) return 'Not available';
    const lmpDate = dayjs(lmp);
    const today = dayjs();
    const diffDays = today.diff(lmpDate, 'day');
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    
    return `${weeks} weeks and ${days} days`;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Not available';
    return dayjs(date).format('MMM D, YYYY');
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Not available';
    return dayjs().diff(dayjs(dateOfBirth), 'year');
  };

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const patientResponse = await patientService.getPatient(id);
        setPatient(patientResponse.data);
        
        const appointmentsResponse = await appointmentService.getPatientAppointments(id);
        setAppointments(appointmentsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again later.');
        toast.error('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open appointment dialog
  const handleAddAppointment = () => {
    setAppointmentFormData({
      patientId: id,
      appointmentType: 'Antenatal',
      appointmentDate: dayjs(),
      notes: '',
      status: 'Scheduled'
    });
    setOpenAppointmentDialog(true);
  };

  // Close appointment dialog
  const handleCloseAppointmentDialog = () => {
    setOpenAppointmentDialog(false);
  };

  // Handle form input changes
  const handleAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date change from date picker
  const handleAppointmentDateChange = (newValue) => {
    setAppointmentFormData((prev) => ({
      ...prev,
      appointmentDate: newValue
    }));
  };

  // Save appointment
  const handleSaveAppointment = async () => {
    try {
      setActionLoading(true);
      
      const appointmentData = {
        ...appointmentFormData,
        appointmentDate: appointmentFormData.appointmentDate.toISOString()
      };
      
      await appointmentService.createAppointment(appointmentData);
      toast.success('Appointment created successfully');
      
      // Refresh appointments
      const appointmentsResponse = await appointmentService.getPatientAppointments(id);
      setAppointments(appointmentsResponse.data);
      
      handleCloseAppointmentDialog();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(error.message || 'Failed to save appointment');
    } finally {
      setActionLoading(false);
    }
  };

  // Navigate to edit patient page
  const handleEditPatient = () => {
    navigate(`/patients/edit/${id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Patient not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {patient.fullName}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                icon={<PhoneIcon fontSize="small" />} 
                label={patient.phoneNumber || 'No phone number'} 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<CalendarIcon fontSize="small" />} 
                label={`${calculateAge(patient.dateOfBirth)} years`} 
                size="small" 
                variant="outlined"
              />
              {patient.pregnancyStatus && (
                <Chip 
                  color="primary"
                  label={patient.pregnancyStatus} 
                  size="small" 
                />
              )}
            </Box>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />}
            onClick={handleEditPatient}
          >
            Edit
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="patient tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Information" />
            <Tab label="Pregnancy Details" />
            <Tab label="Appointments" />
            <Tab label="Medical History" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Personal Details
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Full Name" 
                        secondary={patient.fullName} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Phone Number" 
                        secondary={patient.phoneNumber} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Date of Birth" 
                        secondary={formatDate(patient.dateOfBirth)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Age" 
                        secondary={`${calculateAge(patient.dateOfBirth)} years`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="ID/Clinic Number" 
                        secondary={patient.nationalIdClinicId || 'Not provided'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Blood Group" 
                        secondary={patient.bloodGroup || 'Not recorded'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Marital Status" 
                        secondary={patient.maritalStatus} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Language Preference" 
                        secondary={patient.languagePreference} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Location/Village" 
                        secondary={patient.locationVillage} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Emergency Contact" 
                        secondary={patient.emergencyContactName} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Emergency Contact Phone" 
                        secondary={patient.emergencyContactPhone} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Next of Kin" 
                        secondary={patient.nextOfKinName || 'Not provided'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Next of Kin Contact" 
                        secondary={patient.nextOfKinContact || 'Not provided'} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pregnancy Status
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Pregnancy Status" 
                        secondary={patient.pregnancyStatus} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Last Menstrual Period (LMP)" 
                        secondary={formatDate(patient.lmp)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Estimated Due Date (EDD)" 
                        secondary={calculateEDD(patient.lmp)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Current Gestational Age" 
                        secondary={calculateWeeksOfPregnancy(patient.lmp)} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Gravida (Number of Pregnancies)" 
                        secondary={patient.gravida || 0} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Para (Number of Births)" 
                        secondary={patient.para || 0} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Important Dates
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon color="primary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Registration Date
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(patient.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon color="secondary" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Menstrual Period
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(patient.lmp)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon color="error" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estimated Due Date
                        </Typography>
                        <Typography variant="body1">
                          {calculateEDD(patient.lmp)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Pregnancy Timeline
                      </Typography>
                      <Box sx={{ mt: 1, position: 'relative', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                        {patient.lmp && (
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              left: 0, 
                              top: 0, 
                              height: '100%', 
                              width: `${Math.min(100, (dayjs().diff(dayjs(patient.lmp), 'day') / 280) * 100)}%`, 
                              bgcolor: 'primary.main',
                              borderRadius: 4
                            }} 
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {patient.lmp ? `${calculateWeeksOfPregnancy(patient.lmp)} of pregnancy completed` : 'No LMP recorded'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Appointments
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddAppointment}
            >
              Add Appointment
            </Button>
          </Box>

          {appointments.length === 0 ? (
            <Alert severity="info">No appointments found for this patient</Alert>
          ) : (
            <Grid container spacing={3}>
              {appointments.map((appointment) => (
                <Grid item xs={12} sm={6} md={4} key={appointment._id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" color="primary">
                          {appointment.appointmentType}
                        </Typography>
                        <Chip 
                          label={appointment.status}
                          size="small"
                          color={
                            appointment.status === 'Scheduled' ? 'primary' :
                            appointment.status === 'Completed' ? 'success' : 'error'
                          }
                        />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {dayjs(appointment.appointmentDate).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {dayjs(appointment.appointmentDate).format('h:mm A')}
                          </Typography>
                        </Box>
                        
                        {appointment.notes && (
                          <Typography 
                            variant="body2" 
                            sx={{ mt: 1, color: 'text.secondary' }}
                          >
                            {appointment.notes}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Medical History
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {patient.medicalHistory || 'No medical history recorded'}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Allergies
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {patient.allergies || 'No allergies recorded'}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    Current Medications
                  </Typography>
                  <Typography variant="body1">
                    {patient.currentMedications || 'No current medications recorded'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Obstetric History
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Gravida" 
                        secondary={`${patient.gravida || 0} (total pregnancies)`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Para" 
                        secondary={`${patient.para || 0} (births after 24 weeks)`} 
                      />
                    </ListItem>
                    {/* More obstetric history could be added here */}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add Appointment Dialog */}
      <Dialog open={openAppointmentDialog} onClose={handleCloseAppointmentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="appointment-type-label">Appointment Type</InputLabel>
                <Select
                  labelId="appointment-type-label"
                  id="appointment-type"
                  name="appointmentType"
                  value={appointmentFormData.appointmentType}
                  label="Appointment Type"
                  onChange={handleAppointmentInputChange}
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
                value={appointmentFormData.appointmentDate}
                onChange={handleAppointmentDateChange}
                slotProps={{ 
                  textField: { fullWidth: true }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                multiline
                rows={3}
                value={appointmentFormData.notes}
                onChange={handleAppointmentInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAppointmentDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAppointment} 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={24} /> : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDetailPage;
