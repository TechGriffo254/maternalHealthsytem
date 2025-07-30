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
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import {
  People,
  Event,
  LocalHospital,
  Warning,
  CalendarToday,
  Person
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { patientService } from '../services/patientService';
import { healthTipService } from '../services/healthTipService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      overdueAppointments: 0
    },
    upcomingAppointments: [],
    recentPatients: [],
    healthTips: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const promises = [];

        // Get appointments
        promises.push(appointmentService.getAppointments({ limit: 10 }));
        
        // Get health tips
        promises.push(healthTipService.getHealthTips({ limit: 5 }));

        // If user is staff/admin, get patients
        if (user?.role !== 'patient') {
          promises.push(patientService.getHospitalPatients(user?.hospital || '', { limit: 5 }));
        }

        const results = await Promise.allSettled(promises);
        
        const appointmentsResult = results[0];
        const healthTipsResult = results[1];
        const patientsResult = results[2];

        const newDashboardData = {
          stats: {
            totalPatients: 0,
            totalAppointments: 0,
            upcomingAppointments: 0,
            overdueAppointments: 0
          },
          upcomingAppointments: [],
          recentPatients: [],
          healthTips: []
        };

        // Process appointments data
        if (appointmentsResult.status === 'fulfilled') {
          const appointments = appointmentsResult.value.data || [];
          newDashboardData.upcomingAppointments = appointments.slice(0, 5);
          newDashboardData.stats.totalAppointments = appointments.length;
          
          // Calculate upcoming and overdue
          const now = new Date();
          appointments.forEach(apt => {
            const aptDate = new Date(apt.appointmentDate);
            if (aptDate > now && apt.status === 'scheduled') {
              newDashboardData.stats.upcomingAppointments++;
            } else if (aptDate < now && apt.status === 'scheduled') {
              newDashboardData.stats.overdueAppointments++;
            }
          });
        }

        // Process health tips
        if (healthTipsResult.status === 'fulfilled') {
          newDashboardData.healthTips = healthTipsResult.value.data || [];
        }

        // Process patients data (if available)
        if (patientsResult && patientsResult.status === 'fulfilled') {
          const patients = patientsResult.value.data || [];
          newDashboardData.recentPatients = patients.slice(0, 5);
          newDashboardData.stats.totalPatients = patients.length;
        }

        setDashboardData(newDashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const StatCard = ({ title, value, icon, color = 'primary', loading = false }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: `${color}.main`, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4" component="div">
                {value}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'missed':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your maternal health system activity.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={dashboardData.stats.totalPatients}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Appointments"
            value={dashboardData.stats.totalAppointments}
            icon={<Event />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Appointments"
            value={dashboardData.stats.upcomingAppointments}
            icon={<CalendarToday />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overdue Appointments"
            value={dashboardData.stats.overdueAppointments}
            icon={<Warning />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px', overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Upcoming Appointments
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/appointments')}
              >
                View All
              </Button>
            </Box>
            
            {dashboardData.upcomingAppointments.length === 0 ? (
              <Alert severity="info">No upcoming appointments</Alert>
            ) : (
              <List>
                {dashboardData.upcomingAppointments.map((appointment, index) => (
                  <ListItem key={appointment._id || index} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Event />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={appointment.patient?.fullName || 'Unknown Patient'}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(appointment.appointmentDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {appointment.appointmentType || 'General Checkup'}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={appointment.status}
                      color={getAppointmentStatusColor(appointment.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recent Patients or Health Tips */}
        <Grid item xs={12} md={6}>
          {user?.role !== 'patient' ? (
            // Show recent patients for staff/admin
            <Paper sx={{ p: 3, height: '400px', overflow: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Recent Patients
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/patients')}
                >
                  View All
                </Button>
              </Box>
              
              {dashboardData.recentPatients.length === 0 ? (
                <Alert severity="info">No recent patients</Alert>
              ) : (
                <List>
                  {dashboardData.recentPatients.map((patient, index) => (
                    <ListItem key={patient._id || index} divider>
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={patient.fullName}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Phone: {patient.phoneNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              EDD: {patient.edd ? formatDate(patient.edd) : 'Not set'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          ) : (
            // Show health tips for patients
            <Paper sx={{ p: 3, height: '400px', overflow: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Health Tips for You
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/health-tips')}
                >
                  View All
                </Button>
              </Box>
              
              {dashboardData.healthTips.length === 0 ? (
                <Alert severity="info">No health tips available</Alert>
              ) : (
                <List>
                  {dashboardData.healthTips.map((tip, index) => (
                    <ListItem key={tip._id || index} divider>
                      <ListItemAvatar>
                        <Avatar>
                          <LocalHospital />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={tip.title}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {tip.content?.substring(0, 100)}...
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {user?.role !== 'patient' && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<People />}
                    onClick={() => navigate('/patients/register')}
                  >
                    Register Patient
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Event />}
                    onClick={() => navigate('/appointments/create')}
                  >
                    Schedule Appointment
                  </Button>
                </>
              )}
              <Button
                variant="outlined"
                startIcon={<CalendarToday />}
                onClick={() => navigate('/appointments')}
              >
                View Appointments
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocalHospital />}
                onClick={() => navigate('/health-tips')}
              >
                Health Tips
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
