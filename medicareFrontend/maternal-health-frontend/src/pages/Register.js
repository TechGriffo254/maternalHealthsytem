import React, { useState, useEffect } from 'react';
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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import hospitalService from '../services/hospitalService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phoneNumber: '',
    hospitalId: '',
    dateOfBirth: '',
    edd: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    hospitalName: '',
    hospitalAddress: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [useNewHospital, setUseNewHospital] = useState(false);

  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { value: 'patient', label: 'Patient' },
    { value: 'staff', label: 'Health Worker/Staff' },
    { value: 'hospitaladmin', label: 'Hospital Administrator' }
  ];

  // Load hospitals on component mount
  useEffect(() => {
    const loadHospitals = async () => {
      try {
        setLoadingHospitals(true);
        const response = await hospitalService.getHospitalsForRegistration();
        setHospitals(response.data || []);
      } catch (error) {
        console.error('Failed to load hospitals:', error);
        toast.error('Failed to load hospitals. Please refresh the page.');
      } finally {
        setLoadingHospitals(false);
      }
    };

    loadHospitals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors
    if (error) {
      clearError();
    }
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      errors.role = 'Role is required';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }

    // Hospital ID is required for all roles except superadmin
    if (formData.role && formData.role !== 'superadmin' && !formData.hospitalId.trim()) {
      errors.hospitalId = 'Hospital ID is required for this role';
    }

    // Additional validation for new hospital creation
    if (useNewHospital && formData.role && formData.role !== 'superadmin') {
      if (!formData.hospitalName.trim()) {
        errors.hospitalName = 'Hospital name is required when creating a new hospital';
      }
      if (!formData.hospitalAddress.trim()) {
        errors.hospitalAddress = 'Hospital address is required when creating a new hospital';
      }
    }

    // Additional validation for patient role
    if (formData.role === 'patient') {
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required for patients';
      }

      if (!formData.edd) {
        errors.edd = 'Expected due date is required for patients';
      }

      if (!formData.emergencyContactName.trim()) {
        errors.emergencyContactName = 'Emergency contact name is required for patients';
      }

      if (!formData.emergencyContactPhone.trim()) {
        errors.emergencyContactPhone = 'Emergency contact phone is required for patients';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phoneNumber: formData.phoneNumber
      };

      // Add hospitalId if provided
      if (formData.hospitalId) {
        registrationData.hospitalId = formData.hospitalId;
      }

      // Add hospital details if creating a new hospital
      if (useNewHospital && formData.hospitalName && formData.hospitalAddress) {
        registrationData.hospitalName = formData.hospitalName;
        registrationData.hospitalAddress = formData.hospitalAddress;
      }

      // Add patient-specific fields if role is patient
      if (formData.role === 'patient') {
        registrationData.dateOfBirth = formData.dateOfBirth;
        registrationData.edd = formData.edd;
        registrationData.emergencyContactName = formData.emergencyContactName;
        registrationData.emergencyContactPhone = formData.emergencyContactPhone;
      }

      await register(registrationData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
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
            Create Account
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join the Maternal Health Appointment and Alert System
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.role}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.role && (
                    <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                      {formErrors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  error={!!formErrors.phoneNumber}
                  helperText={formErrors.phoneNumber}
                  placeholder="+254700000000"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Hospital/Clinic Selection
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant={!useNewHospital ? "contained" : "outlined"}
                      onClick={() => setUseNewHospital(false)}
                      size="small"
                    >
                      Select Existing
                    </Button>
                    <Button
                      variant={useNewHospital ? "contained" : "outlined"}
                      onClick={() => setUseNewHospital(true)}
                      size="small"
                    >
                      Create New Hospital
                    </Button>
                  </Box>
                </Box>

                {!useNewHospital ? (
                  // Existing Hospital Dropdown
                  <FormControl 
                    fullWidth 
                    required={formData.role && formData.role !== 'superadmin'}
                    error={!!formErrors.hospitalId}
                    disabled={isSubmitting || loadingHospitals}
                  >
                    <InputLabel id="hospital-label">
                      {formData.role === 'superadmin' ? 'Hospital/Clinic (Optional)' : 'Select Hospital/Clinic'}
                    </InputLabel>
                    <Select
                      labelId="hospital-label"
                      id="hospitalId"
                      name="hospitalId"
                      value={formData.hospitalId}
                      label={formData.role === 'superadmin' ? 'Hospital/Clinic (Optional)' : 'Select Hospital/Clinic'}
                      onChange={handleChange}
                    >
                      {hospitals.map((hospital) => (
                        <MenuItem key={hospital._id} value={hospital.hospitalCode}>
                          {hospital.name} ({hospital.hospitalCode})
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.hospitalId && (
                      <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                        {formErrors.hospitalId}
                      </Typography>
                    )}
                    {loadingHospitals && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 2, mt: 0.5 }}>
                        Loading hospitals...
                      </Typography>
                    )}
                  </FormControl>
                ) : (
                  // New Hospital Input
                  <Box>
                    <TextField
                      required={formData.role && formData.role !== 'superadmin'}
                      fullWidth
                      id="hospitalId"
                      label="New Hospital/Clinic Code"
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.hospitalId}
                      helperText={formErrors.hospitalId || "Enter a unique code for your hospital (e.g., HD006)"}
                      placeholder="HD006"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      required={formData.role && formData.role !== 'superadmin'}
                      fullWidth
                      id="hospitalName"
                      label="Hospital/Clinic Name"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.hospitalName}
                      helperText={formErrors.hospitalName || "Enter the full name of your hospital"}
                      placeholder="Medi Heal Hospital"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      required={formData.role && formData.role !== 'superadmin'}
                      fullWidth
                      id="hospitalAddress"
                      label="Hospital/Clinic Address"
                      name="hospitalAddress"
                      value={formData.hospitalAddress}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.hospitalAddress}
                      helperText={formErrors.hospitalAddress || "Enter the hospital address"}
                      placeholder="123 Medical Street, City, Kenya"
                      multiline
                      rows={2}
                    />
                  </Box>
                )}
              </Grid>

              {/* Patient-specific fields */}
              {formData.role === 'patient' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="dateOfBirth"
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.dateOfBirth}
                      helperText={formErrors.dateOfBirth}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="edd"
                      label="Expected Due Date"
                      name="edd"
                      type="date"
                      value={formData.edd}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.edd}
                      helperText={formErrors.edd}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="emergencyContactName"
                      label="Emergency Contact Name"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.emergencyContactName}
                      helperText={formErrors.emergencyContactName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="emergencyContactPhone"
                      label="Emergency Contact Phone"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      error={!!formErrors.emergencyContactPhone}
                      helperText={formErrors.emergencyContactPhone}
                      placeholder="+254700000000"
                    />
                  </Grid>
                </>
              )}
            </Grid>

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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
