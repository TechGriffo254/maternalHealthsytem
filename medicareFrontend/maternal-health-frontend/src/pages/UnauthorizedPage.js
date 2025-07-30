import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid
} from '@mui/material';
import {
  Security as SecurityIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <SecurityIcon color="error" sx={{ fontSize: 80 }} />
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          You don't have permission to access this page. This area requires higher privileges.
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          If you believe this is an error, please contact your system administrator.
        </Typography>
        
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
