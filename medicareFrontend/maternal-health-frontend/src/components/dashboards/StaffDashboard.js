import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  People,
  PersonAdd,
  Event,
  TrendingUp,
  Visibility,
  Add,
  Edit,
  CalendarMonth,
  Assignment,
  Schedule,
  NotificationImportant,
  TipsAndUpdates,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const StaffDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      totalAppointments: 0,
      todayAppointments: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      pendingReminders: 0
    },
    myPatients: [],
    todayAppointments: [],
    upcomingAppointments: [],
    recentVisits: [],
    reminders: []
  });

  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openVisitDialog, setOpenVisitDialog] = useState(false);
  const [openReminderDialog, setOpenReminderDialog] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch staff-specific dashboard data
      
      // Mock data for now
      setDashboardData({
        stats: {
          totalPatients: 45,
          totalAppointments: 180,
          todayAppointments: 8,
          upcomingAppointments: 15,
          completedAppointments: 165,
          pendingReminders: 12
        },
        myPatients: [
          { _id: '1', name: 'Grace Muthoni', age: 28, pregnancyWeek: 24, lastVisit: new Date(), nextAppointment: new Date(), status: 'Active' },
          { _id: '2', name: 'Faith Wanjiru', age: 25, pregnancyWeek: 16, lastVisit: new Date(), nextAppointment: new Date(), status: 'Active' },
          { _id: '3', name: 'Mary Nyawira', age: 30, pregnancyWeek: 32, lastVisit: new Date(), nextAppointment: new Date(), status: 'Active' },
        ],
        todayAppointments: [
          { _id: '1', patient: 'Grace Muthoni', time: '09:00 AM', type: 'Antenatal Checkup', status: 'Scheduled' },
          { _id: '2', patient: 'Faith Wanjiru', time: '10:30 AM', type: 'Vaccination', status: 'Scheduled' },
          { _id: '3', patient: 'Mary Nyawira', time: '02:00 PM', type: 'Follow-up', status: 'Completed' },
        ],
        upcomingAppointments: [
          { _id: '1', patient: 'Grace Muthoni', date: new Date(Date.now() + 86400000), type: 'Antenatal Checkup', status: 'Scheduled' },
          { _id: '2', patient: 'Faith Wanjiru', date: new Date(Date.now() + 172800000), type: 'Consultation', status: 'Scheduled' },
        ],
        recentVisits: [
          { _id: '1', patient: 'Mary Nyawira', date: new Date(), type: 'Antenatal', notes: 'Normal checkup, vitals good' },
          { _id: '2', patient: 'Grace Muthoni', date: new Date(), type: 'Follow-up', notes: 'Blood pressure slightly elevated' },
        ],
        reminders: [
          { _id: '1', patient: 'Grace Muthoni', type: 'Appointment', message: 'Antenatal checkup tomorrow', status: 'Pending' },
          { _id: '2', patient: 'Faith Wanjiru', type: 'Health Tip', message: 'Nutrition guidelines for second trimester', status: 'Sent' },
        ]
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp sx={{ color: 'green', fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2" color="green">
                  +{trend}% this month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s' }} onClick={onClick}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Staff Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Welcome, {user?.name} - {user?.specialty}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="My Patients"
            value={dashboardData.stats.totalPatients}
            icon={<People />}
            color="#1976d2"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Today's Appointments"
            value={dashboardData.stats.todayAppointments}
            icon={<CalendarMonth />}
            color="#2e7d32"
            subtitle={`${dashboardData.stats.upcomingAppointments} upcoming`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Appointments"
            value={dashboardData.stats.totalAppointments}
            icon={<Event />}
            color="#ed6c02"
            subtitle={`${dashboardData.stats.completedAppointments} completed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Upcoming"
            value={dashboardData.stats.upcomingAppointments}
            icon={<Schedule />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Reminders"
            value={dashboardData.stats.pendingReminders}
            icon={<NotificationImportant />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Completed"
            value={dashboardData.stats.completedAppointments}
            icon={<Assignment />}
            color="#0288d1"
            trend={5}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Register Patient"
            description="Add new patient to system"
            icon={<PersonAdd />}
            color="#1976d2"
            onClick={() => setOpenPatientDialog(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Create Visit"
            description="Record patient visit"
            icon={<Add />}
            color="#2e7d32"
            onClick={() => setOpenVisitDialog(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Schedule Appointment"
            description="Book new appointment"
            icon={<Schedule />}
            color="#ed6c02"
            onClick={() => navigate('/appointments/new')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Send Reminder"
            description="Send patient reminder"
            icon={<NotificationImportant />}
            color="#9c27b0"
            onClick={() => setOpenReminderDialog(true)}
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* My Patients */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                My Patients
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/patients')}>
                View All
              </Button>
            </Box>
            <List sx={{ maxHeight: '320px', overflow: 'auto' }}>
              {dashboardData.myPatients.map((patient) => (
                <ListItem key={patient._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <People />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={patient.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Age: {patient.age} • Week {patient.pregnancyWeek}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={patient.status}
                            size="small"
                            color="success"
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton size="small" color="primary" onClick={() => navigate(`/patients/${patient._id}`)}>
                    <Visibility />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Today's Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Today's Schedule
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/appointments')}>
                View All
              </Button>
            </Box>
            <List sx={{ maxHeight: '320px', overflow: 'auto' }}>
              {dashboardData.todayAppointments.map((appointment) => (
                <ListItem key={appointment._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2e7d32' }}>
                      <CalendarMonth />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={appointment.patient}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {appointment.time} • {appointment.type}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={appointment.status === 'Completed' ? 'success' : 'primary'}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Appointments
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/appointments')}>
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.status}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Visits */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Visits
            </Typography>
            <List>
              {dashboardData.recentVisits.map((visit) => (
                <ListItem key={visit._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#ed6c02' }}>
                      <Timeline />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={visit.patient}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {visit.type} • {new Date(visit.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {visit.notes}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Reminders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Patient Reminders
              </Typography>
              <Button startIcon={<Add />} onClick={() => setOpenReminderDialog(true)}>
                New Reminder
              </Button>
            </Box>
            <List>
              {dashboardData.reminders.map((reminder) => (
                <ListItem key={reminder._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#9c27b0' }}>
                      <TipsAndUpdates />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reminder.patient}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {reminder.type}: {reminder.message}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={reminder.status}
                            size="small"
                            color={reminder.status === 'Sent' ? 'success' : 'warning'}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Register Patient Dialog */}
      <Dialog open={openPatientDialog} onClose={() => setOpenPatientDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Patient</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Age"
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Pregnancy Week"
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientDialog(false)}>Cancel</Button>
          <Button variant="contained">Register Patient</Button>
        </DialogActions>
      </Dialog>

      {/* Create Visit Dialog */}
      <Dialog open={openVisitDialog} onClose={() => setOpenVisitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Visit</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Patient</InputLabel>
            <Select label="Patient">
              {dashboardData.myPatients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Visit Type</InputLabel>
            <Select label="Visit Type">
              <MenuItem value="Antenatal">Antenatal</MenuItem>
              <MenuItem value="Postnatal">Postnatal</MenuItem>
              <MenuItem value="Delivery">Delivery</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Notes"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVisitDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Visit</Button>
        </DialogActions>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={openReminderDialog} onClose={() => setOpenReminderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Patient Reminder</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Patient</InputLabel>
            <Select label="Patient">
              {dashboardData.myPatients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Reminder Type</InputLabel>
            <Select label="Reminder Type">
              <MenuItem value="Appointment">Appointment</MenuItem>
              <MenuItem value="Health Tip">Health Tip</MenuItem>
              <MenuItem value="Medication">Medication</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Message"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReminderDialog(false)}>Cancel</Button>
          <Button variant="contained">Send Reminder</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffDashboard;
