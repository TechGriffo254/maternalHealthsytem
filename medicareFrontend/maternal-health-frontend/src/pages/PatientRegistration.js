import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { patientService } from '../services/patientService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Personal Details', 'Contact Information', 'Health Information', 'Emergency Contacts'];

const PatientRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dateOfBirth: null,
    nationalIdClinicId: '',
    bloodGroup: '',
    maritalStatus: '',
    languagePreference: 'English',
    pregnancyStatus: '',
    
    // Contact Information
    phoneNumber: '',
    email: '',
    locationVillage: '',
    
    // Health Information
    lmp: null, // Last Menstrual Period
    gravida: 0,
    parity: 0,
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    
    // Emergency Contacts
    emergencyContactName: '',
    emergencyContactPhone: '',
    nextOfKinName: '',
    nextOfKinContact: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const maritalStatuses = ['Single', 'Married', 'Other'];
  const languages = ['English', 'Kiswahili', 'Other'];
  const pregnancyStatuses = ['First pregnancy', 'Subsequent pregnancy'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Personal Details
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
        if (!formData.pregnancyStatus) newErrors.pregnancyStatus = 'Pregnancy status is required';
        break;
        
      case 1: // Contact Information
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.locationVillage.trim()) newErrors.locationVillage = 'Location/Village is required';
        break;
        
      case 2: // Health Information
        if (!formData.lmp) newErrors.lmp = 'Last Menstrual Period is required';
        break;
        
      case 3: // Emergency Contacts
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
        break;
        
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const calculateEDD = (lmp) => {
    if (!lmp) return null;
    // EDD = LMP + 280 days (40 weeks)
    return dayjs(lmp).add(280, 'day');
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);
    try {
      const patientData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth?.toDate(),
        lmp: formData.lmp?.toDate(),
        edd: calculateEDD(formData.lmp)?.toDate(),
        // Generate email if not provided
        email: formData.email || `${formData.phoneNumber}@patient.local`,
        hospital: user?.hospital?._id || user?.hospital,
        registeredBy: user?._id,
        dateOfFirstVisit: new Date()
      };

      console.log('Sending patient data:', patientData);
      const result = await patientService.registerPatient(patientData);
      toast.success('Patient registered successfully!');
      navigate('/patients', { 
        state: { newPatient: result.data } 
      });
    } catch (error) {
      toast.error(error.message || 'Failed to register patient');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(value) => handleInputChange('dateOfBirth', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                      required
                    />
                  )}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="National ID / Clinic ID"
                value={formData.nationalIdClinicId}
                onChange={(e) => handleInputChange('nationalIdClinicId', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={formData.bloodGroup}
                  label="Blood Group"
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                >
                  {bloodGroups.map((group) => (
                    <MenuItem key={group} value={group}>{group}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.maritalStatus}>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  value={formData.maritalStatus}
                  label="Marital Status"
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                >
                  {maritalStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
                {errors.maritalStatus && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.maritalStatus}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.pregnancyStatus}>
                <InputLabel>Pregnancy Status</InputLabel>
                <Select
                  value={formData.pregnancyStatus}
                  label="Pregnancy Status"
                  onChange={(e) => handleInputChange('pregnancyStatus', e.target.value)}
                >
                  {pregnancyStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
                {errors.pregnancyStatus && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {errors.pregnancyStatus}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Language Preference</InputLabel>
                <Select
                  value={formData.languagePreference}
                  label="Language Preference"
                  onChange={(e) => handleInputChange('languagePreference', e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber || 'Format: +254700000000'}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                helperText="Leave blank to auto-generate from phone number"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location/Village"
                value={formData.locationVillage}
                onChange={(e) => handleInputChange('locationVillage', e.target.value)}
                error={!!errors.locationVillage}
                helperText={errors.locationVillage}
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Last Menstrual Period (LMP)"
                  value={formData.lmp}
                  onChange={(value) => handleInputChange('lmp', value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.lmp}
                      helperText={errors.lmp || 'Required for calculating due date'}
                      required
                    />
                  )}
                  maxDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>

            {formData.lmp && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Estimated Due Date (EDD)"
                  value={calculateEDD(formData.lmp)?.format('YYYY-MM-DD') || ''}
                  disabled
                  helperText="Automatically calculated from LMP"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gravida (Total pregnancies)"
                type="number"
                value={formData.gravida}
                onChange={(e) => handleInputChange('gravida', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Para (Live births)"
                type="number"
                value={formData.para}
                onChange={(e) => handleInputChange('para', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Known Allergies"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                multiline
                rows={2}
                placeholder="List any known allergies or drug reactions"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medical History"
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                multiline
                rows={3}
                placeholder="Previous medical conditions, surgeries, etc."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Medications"
                value={formData.currentMedications}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                multiline
                rows={2}
                placeholder="List current medications and supplements"
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Emergency Contact
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                error={!!errors.emergencyContactName}
                helperText={errors.emergencyContactName}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                error={!!errors.emergencyContactPhone}
                helperText={errors.emergencyContactPhone}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Next of Kin (Optional)
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next of Kin Name"
                value={formData.nextOfKinName}
                onChange={(e) => handleInputChange('nextOfKinName', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Next of Kin Contact"
                value={formData.nextOfKinContact}
                onChange={(e) => handleInputChange('nextOfKinContact', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Patient Registration
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Register a new patient for maternal health care
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Please correct the highlighted fields before proceeding.
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/patients')}
            >
              Cancel
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Registering...
                  </>
                ) : (
                  'Register Patient'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientRegistration;
