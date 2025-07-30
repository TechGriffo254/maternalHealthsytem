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
  Group,
  CalendarMonth,
  MedicalServices,
  Assignment,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const HospitalAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStaff: 0,
      totalPatients: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      todayAppointments: 0,
      activeStaff: 0
    },
    recentStaff: [],
    recentPatients: [],
    upcomingAppointments: [],
    staffPerformance: [],
    departmentStats: []
  });

  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch hospital-specific dashboard data
      
      // Mock data for now
      setDashboardData({
        stats: {
          totalStaff: 25,
          totalPatients: 450,
          totalAppointments: 1200,
          upcomingAppointments: 45,
          todayAppointments: 12,
          activeStaff: 23
        },
        recentStaff: [
          { _id: '1', name: 'Dr. Sarah Johnson', specialty: 'Obstetrician', email: 'sarah@hospital.com', createdAt: new Date(), status: 'active' },
          { _id: '2', name: 'Nurse Mary Wanjiku', specialty: 'Midwife', email: 'mary@hospital.com', createdAt: new Date(), status: 'active' },
        ],
        recentPatients: [
          { _id: '1', name: 'Grace Muthoni', age: 28, lastVisit: new Date(), nextAppointment: new Date(), pregnancyWeek: 24 },
          { _id: '2', name: 'Faith Wanjiru', age: 25, lastVisit: new Date(), nextAppointment: new Date(), pregnancyWeek: 16 },
        ],
        upcomingAppointments: [
          { _id: '1', patient: 'Grace Muthoni', staff: 'Dr. Sarah Johnson', date: new Date(), type: 'Antenatal Checkup', status: 'Scheduled' },
          { _id: '2', patient: 'Faith Wanjiru', staff: 'Nurse Mary Wanjiku', date: new Date(), type: 'Vaccination', status: 'Scheduled' },
        ],
        staffPerformance: [
          { name: 'Dr. Sarah Johnson', patients: 45, appointments: 89, satisfaction: 96 },
          { name: 'Nurse Mary Wanjiku', patients: 38, appointments: 76, satisfaction: 94 },
        ],
        departmentStats: [
          { department: 'Antenatal Care', patients: 180, appointments: 420, staff: 8 },
          { department: 'Postnatal Care', patients: 120, appointments: 280, staff: 6 },
          { department: 'General Consultation', patients: 150, appointments: 500, staff: 11 },
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
          Hospital Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {user?.hospital?.name || 'Hospital Name'} - Management Portal
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Staff"
            value={dashboardData.stats.totalStaff}
            icon={<Group />}
            color="#1976d2"
            trend={8}
            subtitle={`${dashboardData.stats.activeStaff} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Patients"
            value={dashboardData.stats.totalPatients}
            icon={<People />}
            color="#2e7d32"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Today's Appointments"
            value={dashboardData.stats.todayAppointments}
            icon={<CalendarMonth />}
            color="#ed6c02"
            subtitle={`${dashboardData.stats.upcomingAppointments} upcoming`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Appointments"
            value={dashboardData.stats.totalAppointments}
            icon={<Event />}
            color="#9c27b0"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Upcoming Appointments"
            value={dashboardData.stats.upcomingAppointments}
            icon={<Schedule />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Staff"
            value={dashboardData.stats.activeStaff}
            icon={<MedicalServices />}
            color="#0288d1"
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
            title="Add Staff"
            description="Register new doctor or nurse"
            icon={<PersonAdd />}
            color="#1976d2"
            onClick={() => setOpenStaffDialog(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="View Patients"
            description="Manage patient records"
            icon={<People />}
            color="#2e7d32"
            onClick={() => navigate('/patients')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Schedule Appointment"
            description="Book new appointment"
            icon={<Add />}
            color="#ed6c02"
            onClick={() => navigate('/appointments/new')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="View Reports"
            description="Hospital analytics & reports"
            icon={<Assignment />}
            color="#9c27b0"
            onClick={() => navigate('/reports')}
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Staff */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Staff
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/staff')}>
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.recentStaff.map((staff) => (
                <ListItem key={staff._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <MedicalServices />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={staff.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {staff.specialty}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {staff.email}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={staff.status}
                            size="small"
                            color={staff.status === 'active' ? 'success' : 'default'}
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

        {/* Recent Patients */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Patients
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/patients')}>
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.recentPatients.map((patient) => (
                <ListItem key={patient._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2e7d32' }}>
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
                          Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                        </Typography>
                        <Box mt={0.5}>
                          <Chip
                            label={`Next: ${new Date(patient.nextAppointment).toLocaleDateString()}`}
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

        {/* Upcoming Appointments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Today's Appointments
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
                    <TableCell>Staff</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.staff}</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleTimeString()}</TableCell>
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

        {/* Staff Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Staff Performance
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Staff</TableCell>
                    <TableCell align="right">Patients</TableCell>
                    <TableCell align="right">Appointments</TableCell>
                    <TableCell align="right">Satisfaction</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.staffPerformance.map((staff, index) => (
                    <TableRow key={index}>
                      <TableCell>{staff.name}</TableCell>
                      <TableCell align="right">{staff.patients}</TableCell>
                      <TableCell align="right">{staff.appointments}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${staff.satisfaction}%`}
                          size="small"
                          color={staff.satisfaction >= 95 ? 'success' : staff.satisfaction >= 90 ? 'warning' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Department Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Department Statistics
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Department</TableCell>
                    <TableCell align="right">Patients</TableCell>
                    <TableCell align="right">Appointments</TableCell>
                    <TableCell align="right">Staff</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.departmentStats.map((dept, index) => (
                    <TableRow key={index}>
                      <TableCell>{dept.department}</TableCell>
                      <TableCell align="right">{dept.patients}</TableCell>
                      <TableCell align="right">{dept.appointments}</TableCell>
                      <TableCell align="right">{dept.staff}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Staff Dialog */}
      <Dialog open={openStaffDialog} onClose={() => setOpenStaffDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Staff Member</DialogTitle>
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
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Specialty</InputLabel>
            <Select label="Specialty">
              <MenuItem value="General Practitioner">General Practitioner</MenuItem>
              <MenuItem value="Obstetrician">Obstetrician</MenuItem>
              <MenuItem value="Nurse">Nurse</MenuItem>
              <MenuItem value="Midwife">Midwife</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStaffDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Staff</Button>
        </DialogActions>
      </Dialog>

      {/* Add Patient Dialog */}
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
          <TextField
            margin="dense"
            label="Age"
            type="number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientDialog(false)}>Cancel</Button>
          <Button variant="contained">Register Patient</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HospitalAdminDashboard;
