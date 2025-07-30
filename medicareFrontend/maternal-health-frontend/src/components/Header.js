import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  LocalHospital,
  ExitToApp,
  Dashboard,
  People,
  EventNote,
  Notifications,
  Healing
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    handleMenuClose();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Logo and Title */}
        <LocalHospital sx={{ mr: 2, color: 'white' }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.25rem',
            color: 'white'
          }}
        >
          Maternal Health System
        </Typography>

        {/* Navigation Links - Desktop */}
        {!isMobile && user && (
          <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/dashboard')}
              startIcon={<Dashboard />}
            >
              Dashboard
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/patients')}
              startIcon={<People />}
            >
              Patients
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/appointments')}
              startIcon={<EventNote />}
            >
              Appointments
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/reminders')}
              startIcon={<Notifications />}
            >
              Reminders
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/health-tips')}
              startIcon={<Healing />}
            >
              Health Tips
            </Button>
          </Box>
        )}

        {/* User Menu */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{ 
                mr: 1, 
                display: { xs: 'none', sm: 'block' } 
              }}
            >
              {user.name || user.email}
            </Typography>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isMobile && (
                <>
                  <MenuItem onClick={handleDashboard}>
                    <Dashboard sx={{ mr: 1 }} />
                    Dashboard
                  </MenuItem>
                  
                  <MenuItem onClick={() => {
                    navigate('/patients');
                    handleMenuClose();
                  }}>
                    <People sx={{ mr: 1 }} />
                    Patients
                  </MenuItem>
                  
                  <MenuItem onClick={() => {
                    navigate('/appointments');
                    handleMenuClose();
                  }}>
                    <EventNote sx={{ mr: 1 }} />
                    Appointments
                  </MenuItem>
                  
                  <MenuItem onClick={() => {
                    navigate('/reminders');
                    handleMenuClose();
                  }}>
                    <Notifications sx={{ mr: 1 }} />
                    Reminders
                  </MenuItem>
                  
                  <MenuItem onClick={() => {
                    navigate('/health-tips');
                    handleMenuClose();
                  }}>
                    <Healing sx={{ mr: 1 }} />
                    Health Tips
                  </MenuItem>
                </>
              )}
              
              <MenuItem onClick={handleProfile}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}

        {/* Login button for non-authenticated users */}
        {!user && (
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
