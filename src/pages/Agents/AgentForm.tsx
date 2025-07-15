import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Grid,
  Paper,
  Alert,
  Tooltip,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Info, HelpCircle, Plus, ExternalLink, RefreshCw, Send, X } from 'lucide-react';

import { FormData, FormErrors, PaginationCategoryParams, CategoryData, CategoryDataRes } from '@apis/model/Agents';
import { useNavigate } from 'react-router-dom';

function AgentForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    agentName: '',
    tags: [],
    autoAcceptJobs: true,
    agentClassification: '',
    agentAddress: '',
    description: '',
    authorBio: '',
    // isFree: true,
    walletAddress: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentTag, setCurrentTag] = useState<string>('');
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  const navigate = useNavigate();
  
  // 页面初始化执行内容
  useEffect(() => {
    getCategoryList();
  }, []);
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.agentName.trim()) {
      newErrors.agentName = 'Agent name is required';
    }

    if (!formData.agentClassification) {
      newErrors.agentClassification = 'Agent classification is required';
    }

    if (!formData.agentAddress.trim()) {
      newErrors.agentAddress = 'Agent address is required';
    } else if (!formData.agentAddress.startsWith('https://')) {
      newErrors.agentAddress = 'Agent address must be a valid HTTPS URL';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Brief description is required';
    }

    if (!formData.authorBio.trim()) {
      newErrors.authorBio = 'Author bio is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleAddTag = (): void => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Deploy agent
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const response = await fetch('http://localhost:8088/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if(response) {
        // 跳转到列表页
        navigate('/agents');
      }
      setLoading(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      agentName: '',
      tags: [],
      autoAcceptJobs: true,
      agentClassification: '',
      agentAddress: '',
      description: '',
      authorBio: '',
      // isFree: true,
      walletAddress: '',
    });
    setErrors({});
    setCurrentTag('');
  };

  // 获取 Agents 分类
  const getCategoryList = async () => {
    const res = await fetch('http://localhost:8088/categories?page=1&limit=10');
    if (!res.ok) {
      throw new Error('获取文章失败');
    }
    const resCate: CategoryDataRes = await res.json();
    setCategoryData(resCate.data);
    console.log(resCate.data);
  };

  // tsx
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom fontWeight="500">
            Deploy Agent Based on Aladdin Protocol
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Create and deploy your AI agent with advanced features
          </Typography>
        </Box>

        {/* Info Cards (Optional - uncommented if needed) */}
        <Box sx={{ p: 4, display: 'none' }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Agent payment is result-oriented</strong>, meaning payment is based on the Agent's execution
              results. Funds are temporarily held in escrow by the open-source <strong>Aladdin Protocol</strong>{' '}
              contract.
            </Typography>
          </Alert>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              The settlement process is automatically completed using a third-party verification system. In case of
              disputes, the DAO committee will make the final decision.
            </Typography>
          </Alert>

          <Alert severity="info">
            <Typography variant="body2">
              Before settlement, the Agent's funds are held in escrow by the contract and can earn additional stablecoin
              staking rewards.
            </Typography>
          </Alert>
        </Box>

        {/* Form */}
        <Box sx={{ p: 3 }}>
          {/* Agent Name */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' } }}>
                <Typography variant="body2" fontWeight="500">
                  Agent Name
                </Typography>
                <Tooltip title="Enter a unique name for your agent">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.agentName}
                onChange={(e) => handleInputChange('agentName', e.target.value)}
                error={!!errors.agentName}
                helperText={errors.agentName}
                placeholder="Enter Agent name"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Agent Classification */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' } }}>
                <Typography variant="body2" fontWeight="500">
                  Agent Classification
                </Typography>
                <Tooltip title="Select the primary function of your agent">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <FormControl fullWidth size="small" error={!!errors.agentClassification}>
                <Select
                  value={formData.agentClassification}
                  onChange={(e) => handleInputChange('agentClassification', e.target.value)}
                  displayEmpty
                >
                  {categoryData && categoryData.length
                    ? categoryData.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.title}
                        </MenuItem>
                      ))
                    : ''}
                </Select>
                {errors.agentClassification && <FormHelperText>{errors.agentClassification}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          {/* Agent Address */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'flex-start' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' }, mt: 1 }}>
                <Typography variant="body2" fontWeight="500">
                  Agent Address
                </Typography>
                <Tooltip title="The HTTPS URL where your agent can be accessed">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.agentAddress}
                onChange={(e) => handleInputChange('agentAddress', e.target.value)}
                error={!!errors.agentAddress}
                helperText={errors.agentAddress}
                placeholder="Enter Agent address (e.g., https://api.example.com)"
                variant="outlined"
              />
              <Button
                startIcon={<ExternalLink size={14} />}
                variant="text"
                size="small"
                sx={{ mt: 0.5, fontSize: '0.75rem' }}
              >
                View API Call Example
              </Button>
            </Grid>
          </Grid>

          {/* Tags */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'flex-start' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' }, mt: 1 }}>
                <Typography variant="body2" fontWeight="500">
                  Tags
                </Typography>
                <Tooltip title="Add tags to help users find your agent">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter tags and press Enter to add"
                  size="small"
                  variant="outlined"
                />
                <Button variant="outlined" size="small" onClick={handleAddTag} sx={{ minWidth: 'auto', px: 1.5 }}>
                  <Plus size={14} />
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                e.g., data analysis, automation, AI assistant
              </Typography>

              {formData.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      deleteIcon={<X size={14} />}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Auto Accept Jobs */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' } }}>
                <Typography variant="body2" fontWeight="500">
                  Auto Accept Jobs
                </Typography>
                <Tooltip title="Automatically accept incoming job requests">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoAcceptJobs}
                    onChange={(e) => handleInputChange('autoAcceptJobs', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Auto accept jobs</Typography>}
              />
            </Grid>
          </Grid>

          {/* Brief Description */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'flex-start' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' }, mt: 1 }}>
                <Typography variant="body2" fontWeight="500">
                  Brief Description
                </Typography>
                <Tooltip title="Describe what your agent does and its main capabilities">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Briefly describe the functionality of this Agent"
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Author Bio */}
          <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'flex-start' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' }, mt: 1 }}>
                <Typography variant="body2" fontWeight="500">
                  Author Bio
                </Typography>
                <Tooltip title="Share your background and expertise to build trust with users">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                size="small"
                value={formData.authorBio}
                onChange={(e) => handleInputChange('authorBio', e.target.value)}
                error={!!errors.authorBio}
                helperText={errors.authorBio}
                placeholder="Introduce your professional background, skills, or team experience, e.g.: 3 years of AI development experience, specializing in natural language processing..."
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Is Free */}
          {/* <Grid container spacing={2} sx={{ mb: 2.5, alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' } }}>
                <Typography variant="body2" fontWeight="500">
                  Is Free
                </Typography>
                <Tooltip title="Make your agent available for free or set a price">
                  <IconButton size="small">
                    <HelpCircle size={14} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
             <Grid size={{ xs: 12, md: 9 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFree}
                    onChange={(e) => handleInputChange('isFree', e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="body2">Free to use</Typography>}
              />
            </Grid> 
          </Grid>*/}
        </Box>

        {/* Form Actions */}
        <Box sx={{ pb: 3, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RefreshCw size={14} />}
            size="medium"
            sx={{ px: 3 }}
          >
            Reset
          </Button>

          <Button variant="contained" onClick={handleSubmit} endIcon={<Send size={14} />} size="medium" sx={{ px: 3 }}>
            Deploy
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default AgentForm;
