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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  CalendarMonth,
  Event,
  TrendingUp,
  Visibility,
  ExpandMore,
  FileUpload,
  HealthAndSafety,
  PregnantWoman,
  Schedule,
  Notifications,
  Assignment,
  TipsAndUpdates,
  Person,
  RecordVoiceOver,
  TextSnippet,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { dashboardService } from '../../services/dashboardService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAppointments: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      currentWeek: 0,
      daysUntilDue: 0,
      unreadReminders: 0
    },
    upcomingAppointments: [],
    recentAppointments: [],
    healthTips: [],
    reminders: [],
    visitHistory: [],
    pregnancyMilestones: []
  });

  const [openSubmissionDialog, setOpenSubmissionDialog] = useState(false);
  const [submissionType, setSubmissionType] = useState('text');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getPatientDashboard();
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, unit }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value} {unit && <span style={{ fontSize: '0.6em' }}>{unit}</span>}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
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
          Welcome back, {user?.name?.split(' ')[0]}!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Your Maternal Health Journey Dashboard
        </Typography>
      </Box>

      {/* Pregnancy Progress Banner */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" mb={2}>
              <PregnantWoman sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="#1976d2">
                  Week {dashboardData.stats.currentWeek} of Your Pregnancy
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {dashboardData.stats.daysUntilDue} days until your due date
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1, p: 0.5 }}>
              <Box 
                sx={{ 
                  width: `${(dashboardData.stats.currentWeek / 40) * 100}%`, 
                  bgcolor: '#1976d2', 
                  height: 8, 
                  borderRadius: 1 
                }} 
              />
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              Progress: {Math.round((dashboardData.stats.currentWeek / 40) * 100)}% complete
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" color="#1976d2">
                {Math.round((dashboardData.stats.currentWeek / 40) * 100)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Journey Complete
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Current Week"
            value={dashboardData.stats.currentWeek}
            icon={<PregnantWoman />}
            color="#1976d2"
            subtitle="of pregnancy"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Days Until Due"
            value={dashboardData.stats.daysUntilDue}
            icon={<CalendarMonth />}
            color="#2e7d32"
            subtitle="estimated"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Upcoming Appointments"
            value={dashboardData.stats.upcomingAppointments}
            icon={<Schedule />}
            color="#ed6c02"
            subtitle={`${dashboardData.stats.completedAppointments} completed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Appointments"
            value={dashboardData.stats.totalAppointments}
            icon={<Event />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="New Reminders"
            value={dashboardData.stats.unreadReminders}
            icon={<Notifications />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Health Tips"
            value={dashboardData.healthTips.filter(tip => !tip.isRead).length}
            icon={<TipsAndUpdates />}
            color="#0288d1"
            subtitle="unread"
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
            title="View Appointments"
            description="Check your upcoming appointments"
            icon={<CalendarMonth />}
            color="#1976d2"
            onClick={() => navigate('/appointments')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Submit Health Record"
            description="Share audio or text updates"
            icon={<FileUpload />}
            color="#2e7d32"
            onClick={() => setOpenSubmissionDialog(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Health Tips"
            description="Read personalized health tips"
            icon={<TipsAndUpdates />}
            color="#ed6c02"
            onClick={() => navigate('/health-tips')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Visit History"
            description="View your medical records"
            icon={<Timeline />}
            color="#9c27b0"
            onClick={() => navigate('/visits')}
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Appointments
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/appointments')}>
                View All
              </Button>
            </Box>
            <List sx={{ maxHeight: '320px', overflow: 'auto' }}>
              {dashboardData.upcomingAppointments.map((appointment) => (
                <ListItem key={appointment._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <Event />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={appointment.type}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          with {appointment.doctor}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color="primary"
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

        {/* Health Tips */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Health Tips for You
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/health-tips')}>
                View All
              </Button>
            </Box>
            <List sx={{ maxHeight: '320px', overflow: 'auto' }}>
              {dashboardData.healthTips.map((tip) => (
                <Accordion key={tip._id} sx={{ mb: 1, boxShadow: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <HealthAndSafety sx={{ mr: 2, color: '#2e7d32' }} />
                      <Box flexGrow={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {tip.title}
                        </Typography>
                        <Chip
                          label={tip.category}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        {!tip.isRead && (
                          <Chip
                            label="New"
                            size="small"
                            color="primary"
                          />
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="textSecondary">
                      {tip.content}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Reminders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Reminders
            </Typography>
            <List>
              {dashboardData.reminders.map((reminder) => (
                <ListItem key={reminder._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: reminder.isRead ? '#9e9e9e' : '#d32f2f' }}>
                      <Notifications />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reminder.message}
                    secondary={
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          {reminder.type} • {new Date(reminder.date).toLocaleDateString()}
                        </Typography>
                        {!reminder.isRead && (
                          <Chip
                            label="Unread"
                            size="small"
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Visit History */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Visits
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/visits')}>
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.visitHistory.map((visit) => (
                <ListItem key={visit._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#ed6c02' }}>
                      <Assignment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Week ${visit.week} - ${visit.type}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(visit.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Weight: {visit.weight} • BP: {visit.bloodPressure}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
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

        {/* Pregnancy Milestones */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pregnancy Milestones
            </Typography>
            <Grid container spacing={2}>
              {dashboardData.pregnancyMilestones.map((milestone, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ 
                    border: milestone.completed ? '2px solid #4caf50' : '2px solid #e0e0e0',
                    opacity: milestone.completed ? 1 : 0.7
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ 
                          bgcolor: milestone.completed ? '#4caf50' : '#9e9e9e',
                          mr: 2
                        }}>
                          {milestone.week}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold">
                          {milestone.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {milestone.description}
                      </Typography>
                      {milestone.completed && (
                        <Chip
                          label="Completed"
                          size="small"
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Submit Health Record Dialog */}
      <Dialog open={openSubmissionDialog} onClose={() => setOpenSubmissionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Health Record</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2, mt: 1 }}>
            <InputLabel>Submission Type</InputLabel>
            <Select 
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
              label="Submission Type"
            >
              <MenuItem value="text">Text Update</MenuItem>
              <MenuItem value="audio">Audio Recording</MenuItem>
            </Select>
          </FormControl>
          
          {submissionType === 'text' ? (
            <TextField
              margin="dense"
              label="Health Update"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              placeholder="Share how you're feeling, any symptoms, or questions you have for your healthcare provider..."
            />
          ) : (
            <Box sx={{ p: 3, textAlign: 'center', border: '2px dashed #ccc', borderRadius: 2 }}>
              <RecordVoiceOver sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Record an audio message for your healthcare provider
              </Typography>
              <Button variant="outlined" startIcon={<RecordVoiceOver />}>
                Start Recording
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmissionDialog(false)}>Cancel</Button>
          <Button variant="contained" startIcon={submissionType === 'text' ? <TextSnippet /> : <RecordVoiceOver />}>
            Submit {submissionType === 'text' ? 'Text' : 'Audio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDashboard;
