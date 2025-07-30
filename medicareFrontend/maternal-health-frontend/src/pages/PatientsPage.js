import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Fab,
  TablePagination
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Event,
  Phone,
  LocationOn,
  Search,
  FilterList
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { patientService } from '../services/patientService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          status: filterStatus !== 'all' ? filterStatus : undefined
        };

        let result;
        if (user?.role === 'patient') {
          result = await patientService.getPatient(user._id);
          setPatients([result.data]);
          setTotalCount(1);
        } else {
          result = await patientService.getHospitalPatients(user?.hospital || '', params);
          setPatients(result.data || []);
          setTotalCount(result.total || 0);
        }
      } catch (error) {
        console.error('Error loading patients:', error);
        toast.error('Failed to load patients');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, rowsPerPage, searchTerm, filterStatus, user]);

  useEffect(() => {
    // Check if we have a new patient from registration
    if (location.state?.newPatient) {
      toast.success(`Patient ${location.state.newPatient.fullName} registered successfully!`);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      let result;
      if (user?.role === 'patient') {
        // If user is a patient, get only their data
        result = await patientService.getPatient(user._id);
        setPatients([result.data]);
        setTotalCount(1);
      } else {
        // If user is staff/admin, get all patients for their hospital
        result = await patientService.getHospitalPatients(user?.hospitalId || '', params);
        setPatients(result.data || []);
        setTotalCount(result.total || 0);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0); // Reset to first page when filtering
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleEditPatient = (patient) => {
    navigate(`/patients/edit/${patient._id}`);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(patientId);
        toast.success('Patient deleted successfully');
        loadPatients();
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  const calculateWeeksPregnant = (lmp) => {
    if (!lmp) return 'Unknown';
    const weeks = dayjs().diff(dayjs(lmp), 'week');
    return `${weeks} weeks`;
  };

  const getPregnancyStatusColor = (edd) => {
    if (!edd) return 'default';
    const daysUntilEDD = dayjs(edd).diff(dayjs(), 'day');
    if (daysUntilEDD < 0) return 'error'; // Overdue
    if (daysUntilEDD <= 14) return 'warning'; // Due soon
    return 'success'; // Normal
  };

  if (loading && patients.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Patients
        </Typography>
        
        {user?.role !== 'patient' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/patients/register')}
          >
            Register Patient
          </Button>
        )}
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterStatus}
                label="Filter"
                onChange={handleFilterChange}
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Patients</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Delivered</MenuItem>
                <MenuItem value="high-risk">High Risk</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Patients Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Pregnancy Status</TableCell>
                <TableCell>EDD</TableCell>
                <TableCell>Weeks Pregnant</TableCell>
                {user?.role !== 'patient' && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={user?.role !== 'patient' ? 7 : 6} align="center">
                    <Alert severity="info">No patients found</Alert>
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">
                          {patient.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {patient.nationalIdClinicId || 'Not provided'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        {patient.phoneNumber}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        {patient.locationVillage}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={patient.pregnancyStatus}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={formatDate(patient.edd)}
                        size="small"
                        color={getPregnancyStatusColor(patient.edd)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      {calculateWeeksPregnant(patient.lmp)}
                    </TableCell>
                    
                    {user?.role !== 'patient' && (
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewPatient(patient)}
                            title="View Details"
                          >
                            <Event />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleEditPatient(patient)}
                            title="Edit Patient"
                          >
                            <Edit />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePatient(patient._id)}
                            title="Delete Patient"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Patient Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPatient && (
          <>
            <DialogTitle>
              Patient Details: {selectedPatient.fullName}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Personal Information</Typography>
                  <Typography variant="body2">
                    <strong>Date of Birth:</strong> {formatDate(selectedPatient.dateOfBirth)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Blood Group:</strong> {selectedPatient.bloodGroup || 'Not specified'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Marital Status:</strong> {selectedPatient.maritalStatus}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Language:</strong> {selectedPatient.languagePreference}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Pregnancy Information</Typography>
                  <Typography variant="body2">
                    <strong>LMP:</strong> {formatDate(selectedPatient.lmp)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>EDD:</strong> {formatDate(selectedPatient.edd)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Gravida:</strong> {selectedPatient.gravida}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Para:</strong> {selectedPatient.para}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedPatient.emergencyContactName}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedPatient.emergencyContactPhone}
                  </Typography>
                </Grid>
                
                {selectedPatient.allergies && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Allergies</Typography>
                    <Typography variant="body2">{selectedPatient.allergies}</Typography>
                  </Grid>
                )}
                
                {selectedPatient.medicalHistory && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Medical History</Typography>
                    <Typography variant="body2">{selectedPatient.medicalHistory}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {user?.role !== 'patient' && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setDialogOpen(false);
                    handleEditPatient(selectedPatient);
                  }}
                >
                  Edit Patient
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Floating Action Button */}
      {user?.role !== 'patient' && (
        <Fab
          color="primary"
          aria-label="add patient"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/patients/register')}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
};

export default PatientsPage;
