import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration';
import PatientsPage from './pages/PatientsPage';
import PatientDetailPage from './pages/PatientDetailPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RemindersPage from './pages/RemindersPage';
import HealthTipsPage from './pages/HealthTipsPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // Professional medical blue
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#0277BD', // Complementary medical blue
      light: '#03DAC6',
      dark: '#01579B',
    },
    background: {
      default: '#FAFAFA', // Clean, clinical white background
    },
    info: {
      main: '#00ACC1', // Cyan for informational elements
      light: '#4DD0E1',
      dark: '#006064',
    },
    success: {
      main: '#00C853', // Green for success states
      light: '#69F0AE',
      dark: '#2E7D32',
    },
    warning: {
      main: '#FF9800', // Orange for warnings
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#D32F2F', // Red for errors
      light: '#EF5350',
      dark: '#C62828',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1976D2',
    },
    h5: {
      fontWeight: 600,
      color: '#1976D2',
    },
    h6: {
      fontWeight: 600,
      color: '#1976D2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976D2',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh' 
            }}>
              <Header />
              
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/patients" 
                    element={
                      <ProtectedRoute>
                        <PatientsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/patients/register" 
                    element={
                      <ProtectedRoute allowedRoles={['staff', 'hospital_admin', 'super_admin']}>
                        <PatientRegistration />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/health-tips" 
                    element={
                      <ProtectedRoute>
                        <HealthTipsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/appointments" 
                    element={
                      <ProtectedRoute>
                        <AppointmentsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/patients/:id" 
                    element={
                      <ProtectedRoute>
                        <PatientDetailPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/reminders" 
                    element={
                      <ProtectedRoute>
                        <RemindersPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/unauthorized" 
                    element={<UnauthorizedPage />} 
                  />
                  
                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Box>
              
              <Footer />
            </Box>
            
            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
