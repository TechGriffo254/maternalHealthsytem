import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocalHospital sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography component="h1" variant="h4" fontWeight="bold">
              MHAAS
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" gutterBottom>
            Sign In
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome to Maternal Health Appointment and Alert System
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>

        {/* Demo Credentials Info */}
        <Paper
          elevation={1}
          sx={{
            mt: 3,
            p: 2,
            width: '100%',
            backgroundColor: 'grey.50'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Demo Credentials:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Staff:</strong> staff@demo.com / password123<br />
            <strong>Patient:</strong> patient@demo.com / password123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
