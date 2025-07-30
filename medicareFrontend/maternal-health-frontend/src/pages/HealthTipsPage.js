import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab
} from '@mui/material';
import {
  Add,
  LocalHospital,
  Lightbulb,
  PregnantWoman,
  ChildCare,
  FitnessCenter,
  Restaurant
} from '@mui/icons-material';
import { healthTipService } from '../services/healthTipService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const HealthTipsPage = () => {
  const [healthTips, setHealthTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTip, setNewTip] = useState({
    title: '',
    content: '',
    category: '',
    pregnancyStage: '',
    priority: 'medium'
  });

  const { user } = useAuth();

  const categories = [
    { value: 'all', label: 'All Categories', icon: <LocalHospital /> },
    { value: 'nutrition', label: 'Nutrition', icon: <Restaurant /> },
    { value: 'exercise', label: 'Exercise', icon: <FitnessCenter /> },
    { value: 'prenatal', label: 'Prenatal Care', icon: <PregnantWoman /> },
    { value: 'postnatal', label: 'Postnatal Care', icon: <ChildCare /> },
    { value: 'general', label: 'General Health', icon: <Lightbulb /> }
  ];

  const pregnancyStages = [
    { value: 'all', label: 'All Stages' },
    { value: 'first-trimester', label: 'First Trimester (1-12 weeks)' },
    { value: 'second-trimester', label: 'Second Trimester (13-26 weeks)' },
    { value: 'third-trimester', label: 'Third Trimester (27-40 weeks)' },
    { value: 'postnatal', label: 'After Delivery' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          pregnancyStage: selectedStage !== 'all' ? selectedStage : undefined
        };

        const result = await healthTipService.getHealthTips(params);
        setHealthTips(result.data || []);
      } catch (error) {
        console.error('Error loading health tips:', error);
        toast.error('Failed to load health tips');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, selectedStage]);

  const loadHealthTips = async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        pregnancyStage: selectedStage !== 'all' ? selectedStage : undefined
      };

      const result = await healthTipService.getHealthTips(params);
      setHealthTips(result.data || []);
    } catch (error) {
      console.error('Error loading health tips:', error);
      toast.error('Failed to load health tips');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTip = async () => {
    try {
      if (!newTip.title.trim() || !newTip.content.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      await healthTipService.createHealthTip({
        ...newTip,
        createdBy: user._id
      });

      toast.success('Health tip created successfully!');
      setDialogOpen(false);
      setNewTip({
        title: '',
        content: '',
        category: '',
        pregnancyStage: '',
        priority: 'medium'
      });
      loadHealthTips();
    } catch (error) {
      toast.error('Failed to create health tip');
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : <Lightbulb />;
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
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
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Health Tips
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Essential maternal health information and guidance
          </Typography>
        </Box>
        
        {(user?.role === 'staff' || user?.role === 'hospital_admin' || user?.role === 'super_admin') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
          >
            Add Health Tip
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category.icon}
                      {category.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pregnancy Stage</InputLabel>
              <Select
                value={selectedStage}
                label="Pregnancy Stage"
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                {pregnancyStages.map((stage) => (
                  <MenuItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Health Tips Grid */}
      {healthTips.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <Alert severity="info">
            No health tips found for the selected filters. 
            {(user?.role === 'staff' || user?.role === 'hospital_admin' || user?.role === 'super_admin') && 
              ' Click "Add Health Tip" to create the first one!'
            }
          </Alert>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {healthTips.map((tip) => (
            <Grid item xs={12} md={6} lg={4} key={tip._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getCategoryIcon(tip.category)}
                      <Typography variant="caption" color="text.secondary">
                        {tip.category?.toUpperCase()}
                      </Typography>
                    </Box>
                    <Chip
                      label={tip.priority}
                      size="small"
                      color={getPriorityColor(tip.priority)}
                    />
                  </Box>
                  
                  <Typography variant="h6" component="h3" gutterBottom>
                    {tip.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tip.content?.length > 150 
                      ? `${tip.content.substring(0, 150)}...` 
                      : tip.content
                    }
                  </Typography>
                  
                  {tip.pregnancyStage && (
                    <Chip
                      label={pregnancyStages.find(s => s.value === tip.pregnancyStage)?.label || tip.pregnancyStage}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created: {formatDate(tip.createdAt)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Health Tip Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Health Tip</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newTip.title}
                onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTip.category}
                  label="Category"
                  onChange={(e) => setNewTip({ ...newTip, category: e.target.value })}
                >
                  {categories.filter(cat => cat.value !== 'all').map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Pregnancy Stage</InputLabel>
                <Select
                  value={newTip.pregnancyStage}
                  label="Pregnancy Stage"
                  onChange={(e) => setNewTip({ ...newTip, pregnancyStage: e.target.value })}
                >
                  {pregnancyStages.filter(stage => stage.value !== 'all').map((stage) => (
                    <MenuItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTip.priority}
                  label="Priority"
                  onChange={(e) => setNewTip({ ...newTip, priority: e.target.value })}
                >
                  {priorities.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                value={newTip.content}
                onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                multiline
                rows={4}
                required
                placeholder="Enter the health tip content..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTip}>
            Create Tip
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      {(user?.role === 'staff' || user?.role === 'hospital_admin' || user?.role === 'super_admin') && (
        <Fab
          color="primary"
          aria-label="add health tip"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setDialogOpen(true)}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
};

export default HealthTipsPage;
