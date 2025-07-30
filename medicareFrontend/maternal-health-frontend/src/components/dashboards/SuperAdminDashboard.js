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
  TextField
} from '@mui/material';
import {
  People,
  LocalHospital,
  AdminPanelSettings,
  TrendingUp,
  Visibility,
  Add,
  Edit,
  Business,
  PersonAdd,
  Analytics,
  Security,
  Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalHospitals: 0,
      totalUsers: 0,
      totalPatients: 0,
      totalStaff: 0,
      hospitalAdmins: 0,
      activeHospitals: 0
    },
    recentHospitals: [],
    recentUsers: [],
    systemLogs: [],
    hospitalPerformance: []
  });

  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all dashboard data
      // This would call various API endpoints
      
      // Mock data for now
      setDashboardData({
        stats: {
          totalHospitals: 25,
          totalUsers: 1250,
          totalPatients: 980,
          totalStaff: 245,
          hospitalAdmins: 25,
          activeHospitals: 23
        },
        recentHospitals: [
          { _id: '1', name: 'Kenyatta National Hospital', location: 'Nairobi', createdAt: new Date(), status: 'active' },
          { _id: '2', name: 'Moi Teaching Hospital', location: 'Eldoret', createdAt: new Date(), status: 'active' },
        ],
        recentUsers: [
          { _id: '1', name: 'Dr. John Doe', role: 'hospitaladmin', hospital: 'Kenyatta National Hospital', createdAt: new Date() },
          { _id: '2', name: 'Nurse Jane Smith', role: 'staff', hospital: 'Moi Teaching Hospital', createdAt: new Date() },
        ],
        systemLogs: [
          { _id: '1', action: 'Hospital Added', user: 'Super Admin', timestamp: new Date(), details: 'Added Kenyatta National Hospital' },
          { _id: '2', action: 'User Created', user: 'Dr. John Doe', timestamp: new Date(), details: 'Created hospital admin account' },
        ],
        hospitalPerformance: [
          { hospital: 'Kenyatta National Hospital', patients: 120, appointments: 89, staff: 15, performance: 92 },
          { hospital: 'Moi Teaching Hospital', patients: 98, appointments: 76, staff: 12, performance: 87 },
        ]
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
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
          Super Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          System Overview & Management Portal
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Hospitals"
            value={dashboardData.stats.totalHospitals}
            icon={<LocalHospital />}
            color="#1976d2"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={dashboardData.stats.totalUsers}
            icon={<People />}
            color="#2e7d32"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Hospitals"
            value={dashboardData.stats.activeHospitals}
            icon={<Business />}
            color="#ed6c02"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Hospital Admins"
            value={dashboardData.stats.hospitalAdmins}
            icon={<AdminPanelSettings />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Patients"
            value={dashboardData.stats.totalPatients}
            icon={<People />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Staff"
            value={dashboardData.stats.totalStaff}
            icon={<PersonAdd />}
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
            title="Add Hospital"
            description="Onboard a new hospital to the system"
            icon={<Add />}
            color="#1976d2"
            onClick={() => setOpenHospitalDialog(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="Add Hospital Admin"
            description="Create admin account for hospital"
            icon={<PersonAdd />}
            color="#2e7d32"
            onClick={() => setOpenUserDialog(true)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="System Analytics"
            description="View detailed system analytics"
            icon={<Analytics />}
            color="#ed6c02"
            onClick={() => navigate('/analytics')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickActionCard
            title="System Logs"
            description="Monitor system activity logs"
            icon={<Security />}
            color="#9c27b0"
            onClick={() => navigate('/logs')}
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Hospitals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Hospitals
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/hospitals')}>
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.recentHospitals.map((hospital) => (
                <ListItem key={hospital._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <LocalHospital />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={hospital.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {hospital.location}
                        </Typography>
                        <Chip
                          label={hospital.status}
                          size="small"
                          color={hospital.status === 'active' ? 'success' : 'default'}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent Users
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/users')}>
                View All
              </Button>
            </Box>
            <List>
              {dashboardData.recentUsers.map((user) => (
                <ListItem key={user._id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#2e7d32' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {user.hospital}
                        </Typography>
                        <Chip
                          label={user.role}
                          size="small"
                          color="primary"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Hospital Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Hospital Performance Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hospital</TableCell>
                    <TableCell align="right">Patients</TableCell>
                    <TableCell align="right">Appointments</TableCell>
                    <TableCell align="right">Staff</TableCell>
                    <TableCell align="right">Performance</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.hospitalPerformance.map((hospital, index) => (
                    <TableRow key={index}>
                      <TableCell>{hospital.hospital}</TableCell>
                      <TableCell align="right">{hospital.patients}</TableCell>
                      <TableCell align="right">{hospital.appointments}</TableCell>
                      <TableCell align="right">{hospital.staff}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${hospital.performance}%`}
                          color={hospital.performance >= 90 ? 'success' : hospital.performance >= 75 ? 'warning' : 'error'}
                          size="small"
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

        {/* System Activity Logs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Recent System Activity
              </Typography>
              <Button startIcon={<Visibility />} onClick={() => navigate('/logs')}>
                View All Logs
              </Button>
            </Box>
            <List>
              {dashboardData.systemLogs.map((log) => (
                <ListItem key={log._id} divider>
                  <ListItemText
                    primary={log.action}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          By: {log.user} • {log.details}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Add Hospital Dialog */}
      <Dialog open={openHospitalDialog} onClose={() => setOpenHospitalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Hospital</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Hospital Name"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Contact Email"
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHospitalDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Hospital</Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Hospital Admin</DialogTitle>
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
            label="Hospital"
            select
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {/* Hospital options would be populated here */}
          </TextField>
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Admin</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuperAdminDashboard;
