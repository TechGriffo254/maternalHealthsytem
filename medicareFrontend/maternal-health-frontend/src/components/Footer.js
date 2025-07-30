import React from 'react';
import {
  Box,
  Typography,
  Container,
  Link,
  Grid,
  useTheme
} from '@mui/material';
import { LocalHospital, Phone, Email, LocationOn } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalHospital sx={{ mr: 1 }} />
              <Typography variant="h6" component="div" fontWeight="bold">
                MHAAS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Maternal Health Appointment and Alert System for Rural Clinics in Kenya.
              Supporting expectant mothers with timely care and reminders.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/dashboard" color="inherit" underline="hover">
                Dashboard
              </Link>
              <Link href="/appointments" color="inherit" underline="hover">
                Appointments
              </Link>
              <Link href="/patients" color="inherit" underline="hover">
                Patients
              </Link>
              <Link href="/health-tips" color="inherit" underline="hover">
                Health Tips
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">+254 700 000 000</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">info@mhaas.co.ke</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2">Nairobi, Kenya</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            mt: 4,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2">
            © {currentYear} Maternal Health Appointment and Alert System. 
            All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
