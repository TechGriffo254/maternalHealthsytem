import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUserProfile, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
    hospitalId: ''
  });
  
  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || '',
        hospitalId: user.hospital || user.hospitalId || '' // Handle both possible field names
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Reset error and success messages when user starts typing
    setPasswordError('');
    setPasswordSuccess('');
  };

  // Toggle editing mode
  const handleEditToggle = () => {
    setEditing(!editing);
    
    // Reset form data if canceling
    if (editing && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || '',
        hospitalId: user.hospital || user.hospitalId || '' // Handle both possible field names
      });
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      await updateUserProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');
      
      // Call API to change password
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordSuccess('Password changed successfully');
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password');
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'N/A';
    
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Alert severity="info">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ mt: 2, mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  margin: '0 auto',
                  backgroundColor: 'primary.main'
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
            </Box>
            
            <Typography variant="h5" gutterBottom>
              {user.name || 'User'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatRole(user.role)}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant={editing ? "outlined" : "contained"} 
                startIcon={editing ? <CancelIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                color={editing ? "error" : "primary"}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
          </Paper>
          
          {/* Hospital Information */}
          {user.hospitalId && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Hospital Information</Typography>
                </Box>
                
                <Typography variant="body1">
                  {user.hospitalName || 'Hospital Name Not Available'}
                </Typography>
                
                {user.hospitalAddress && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {user.hospitalAddress}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {editing ? 'Edit Profile' : 'Profile Details'}
              </Typography>
              <Divider />
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <PersonIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      label="Role"
                    >
                      <MenuItem value="patient">Patient</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="hospital_admin">Hospital Admin</MenuItem>
                      <MenuItem value="super_admin">Super Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {editing && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
          
          {/* Change Password Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Change Password
              </Typography>
              <Divider />
            </Box>
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {passwordSuccess}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <SecurityIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      startIcon={passwordLoading ? <CircularProgress size={24} /> : <SecurityIcon />}
                      disabled={passwordLoading}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
