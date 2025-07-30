import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard';
import HospitalAdminDashboard from '../components/dashboards/HospitalAdminDashboard';
import StaffDashboard from '../components/dashboards/StaffDashboard';
import PatientDashboard from '../components/dashboards/PatientDashboard';
import { Container, Box, CircularProgress, Alert } from '@mui/material';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          You must be logged in to access the dashboard.
        </Alert>
      </Container>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'hospitaladmin':
      return <HospitalAdminDashboard />;
    case 'staff':
      return <StaffDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning">
            Unknown user role: {user.role}. Please contact your administrator.
          </Alert>
        </Container>
      );
  }
};

export default Dashboard;
