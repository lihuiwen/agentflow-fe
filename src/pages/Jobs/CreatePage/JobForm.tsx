import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Autocomplete,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft, Save, Calendar, DollarSign, Tag, User, Settings } from 'lucide-react';
import JobService from '@apis/services/Job';
import CategoryService from '@apis/services/Category';
import { PrefetchKeys } from '@apis/queryKeys';
import { CreateJobRequest, Job } from '@apis/model/Job';

// 样式化组件
const FormContainer = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 140px)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%, #f5f7fa 100%)',
  width: '100%',
  margin: 0,
  padding: 0
}));

const FormCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  overflow: 'visible'
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(102, 126, 234, 0.4)'
      }
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
        borderWidth: '2px'
      }
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(102, 126, 234, 0.4)'
      }
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
        borderWidth: '2px'
      }
    }
  }
}));

const SaveButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
  }
}));

const CancelButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  color: '#666',
  border: '2px solid rgba(102, 126, 234, 0.2)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: '#667eea',
    transform: 'translateY(-1px)'
  }
}));

interface FormData {
  jobTitle: string;
  category: string;
  description: string;
  deliverables: string;
  budget: { min: number; max: number };
  deadline: string;
  paymentType: 'fixed' | 'hourly' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  autoAssign: boolean;
  allowBidding: boolean;
  allowParallelExecution: boolean;
  escrowEnabled: boolean;
  isPublic: boolean;
}

const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = id && id !== 'new';
  
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    category: '',
    description: '',
    deliverables: '',
    budget: { min: 0, max: 0 },
    deadline: '',
    paymentType: 'milestone',
    priority: 'medium',
    skillLevel: 'intermediate',
    tags: [],
    autoAssign: false,
    allowBidding: true,
    allowParallelExecution: false,
    escrowEnabled: true,
    isPublic: true
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 获取分类数据
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: [PrefetchKeys.CATEGORIES],
    queryFn: () => CategoryService.getCategories(),
    staleTime: 10 * 60 * 1000
  });

  // 获取Job数据（编辑模式）
  const { data: jobData, isLoading: jobLoading } = useQuery({
    queryKey: [PrefetchKeys.JOB_DETAIL, id],
    queryFn: () => JobService.getJobById(id!),
    enabled: !!isEditing,
    staleTime: 5 * 60 * 1000
  });

  // 创建/更新突变
  const createMutation = useMutation({
    mutationFn: (data: CreateJobRequest) => JobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOBS] });
      navigate('/jobs');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateJobRequest>) => JobService.updateJob(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOBS] });
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOB_DETAIL, id] });
      navigate('/jobs');
    }
  });

  // 初始化表单数据（编辑模式）
  useEffect(() => {
    if (jobData && isEditing) {
      setFormData({
        jobTitle: jobData.jobTitle,
        category: jobData.category,
        description: jobData.description,
        deliverables: jobData.deliverables,
        budget: typeof jobData.budget === 'object' 
          ? jobData.budget 
          : { min: jobData.budget, max: jobData.budget },
        deadline: jobData.deadline.split('T')[0], // 转换为日期格式
        paymentType: jobData.paymentType,
        priority: jobData.priority,
        skillLevel: jobData.skillLevel,
        tags: jobData.tags,
        autoAssign: jobData.autoAssign,
        allowBidding: jobData.allowBidding,
        allowParallelExecution: jobData.allowParallelExecution,
        escrowEnabled: jobData.escrowEnabled,
        isPublic: jobData.isPublic
      });
    }
  }, [jobData, isEditing]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.jobTitle.trim()) newErrors.jobTitle = '请输入任务标题';
    if (!formData.category) newErrors.category = '请选择分类';
    if (!formData.description.trim()) newErrors.description = '请输入任务描述';
    if (!formData.deliverables.trim()) newErrors.deliverables = '请输入交付物';
    if (!formData.deadline) newErrors.deadline = '请选择截止日期';
    if (formData.budget.min <= 0) newErrors.budgetMin = '最小预算必须大于0';
    if (formData.budget.max <= 0) newErrors.budgetMax = '最大预算必须大于0';
    if (formData.budget.min > formData.budget.max) {
      newErrors.budgetMin = '最小预算不能大于最大预算';
    }
    if (formData.tags.length === 0) newErrors.tags = '请添加至少一个标签';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData: CreateJobRequest = {
      ...formData,
      walletAddress: '0x1234567890abcdef' // 实际项目中从钱包获取
    };
    
    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  // 处理表单数据变化
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 处理标签添加
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // 处理标签删除
  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/jobs');
  };

  if (isEditing && jobLoading) {
    return (
      <FormContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </FormContainer>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError = createMutation.error || updateMutation.error;

  return (
    <FormContainer>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 标题区域 */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={handleCancel}
            sx={{ 
              mb: 2, 
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            返回列表
          </Button>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              mb: 1
            }}
          >
            {isEditing ? '编辑 Job' : '创建新 Job'}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            {isEditing ? '更新任务信息和设置' : '填写任务详细信息，让 AI Agents 更好地理解您的需求'}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormCard>
            <CardContent sx={{ p: 4 }}>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submitError.message || '提交失败，请重试'}
                </Alert>
              )}
              
              {categoriesError && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  分类数据加载失败，将使用默认分类选项
                </Alert>
              )}

              {/* 基本信息 */}
              <SectionCard>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tag size={20} />
                  基本信息
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="任务标题 *"
                      placeholder="请输入任务标题，如：开发一个 AI 聊天机器人"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      error={!!errors.jobTitle}
                      helperText={errors.jobTitle}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <StyledFormControl fullWidth error={!!errors.category}>
                      <InputLabel>任务分类 *</InputLabel>
                      <Select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        label="任务分类 *"
                      >
                        {categoriesLoading ? (
                          <MenuItem disabled>加载中...</MenuItem>
                        ) : Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((category) => (
                            <MenuItem key={category.id} value={category.title}>
                              {category.title}
                            </MenuItem>
                          ))
                        ) : (
                          // 默认分类选项
                          [
                            { id: '1', title: 'AI Development' },
                            { id: '2', title: 'Web3 Development' },
                            { id: '3', title: 'Data Analysis' },
                            { id: '4', title: 'Customer Service' },
                            { id: '5', title: 'Design' },
                            { id: '6', title: 'Marketing' }
                          ].map((category) => (
                            <MenuItem key={category.id} value={category.title}>
                              {category.title}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {errors.category && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.category}
                        </Typography>
                      )}
                    </StyledFormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <StyledFormControl fullWidth>
                      <InputLabel>技能等级</InputLabel>
                      <Select
                        value={formData.skillLevel}
                        onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                        label="技能等级"
                      >
                        <MenuItem value="beginner">初级</MenuItem>
                        <MenuItem value="intermediate">中级</MenuItem>
                        <MenuItem value="advanced">高级</MenuItem>
                        <MenuItem value="expert">专家</MenuItem>
                      </Select>
                    </StyledFormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      multiline
                      rows={4}
                      label="任务描述 *"
                      placeholder="详细描述您的任务需求、技术规格、期望结果等..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      error={!!errors.description}
                      helperText={errors.description}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      multiline
                      rows={3}
                      label="交付物 *"
                      placeholder="请列出您需要的交付物，如：源代码、文档、部署指南等..."
                      value={formData.deliverables}
                      onChange={(e) => handleInputChange('deliverables', e.target.value)}
                      error={!!errors.deliverables}
                      helperText={errors.deliverables}
                    />
                  </Grid>
                </Grid>
              </SectionCard>

              {/* 预算和时间 */}
              <SectionCard>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DollarSign size={20} />
                  预算和时间
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      fullWidth
                      type="number"
                      label="最小预算 (USDT) *"
                      value={formData.budget.min}
                      onChange={(e) => handleInputChange('budget', { 
                        ...formData.budget, 
                        min: Number(e.target.value) 
                      })}
                      error={!!errors.budgetMin}
                      helperText={errors.budgetMin}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      fullWidth
                      type="number"
                      label="最大预算 (USDT) *"
                      value={formData.budget.max}
                      onChange={(e) => handleInputChange('budget', { 
                        ...formData.budget, 
                        max: Number(e.target.value) 
                      })}
                      error={!!errors.budgetMax}
                      helperText={errors.budgetMax}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <StyledFormControl fullWidth>
                      <InputLabel>支付类型</InputLabel>
                      <Select
                        value={formData.paymentType}
                        onChange={(e) => handleInputChange('paymentType', e.target.value)}
                        label="支付类型"
                      >
                        <MenuItem value="fixed">固定价格</MenuItem>
                        <MenuItem value="hourly">按小时计费</MenuItem>
                        <MenuItem value="milestone">里程碑付款</MenuItem>
                      </Select>
                    </StyledFormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      type="date"
                      label="截止日期 *"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      error={!!errors.deadline}
                      helperText={errors.deadline}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <StyledFormControl fullWidth>
                      <InputLabel>优先级</InputLabel>
                      <Select
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        label="优先级"
                      >
                        <MenuItem value="low">低优先级</MenuItem>
                        <MenuItem value="medium">中优先级</MenuItem>
                        <MenuItem value="high">高优先级</MenuItem>
                        <MenuItem value="urgent">紧急</MenuItem>
                      </Select>
                    </StyledFormControl>
                  </Grid>
                </Grid>
              </SectionCard>

              {/* 标签 */}
              <SectionCard>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tag size={20} />
                  技能标签
                </Typography>
                
                <Grid container spacing={2} alignItems="end">
                  <Grid item xs={12} md={8}>
                    <StyledTextField
                      fullWidth
                      label="添加标签"
                      placeholder="输入技能标签，如：React, Python, AI等"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      error={!!errors.tags && formData.tags.length === 0}
                      helperText={errors.tags && formData.tags.length === 0 ? errors.tags : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      sx={{ height: '56px' }}
                    >
                      添加标签
                    </Button>
                  </Grid>
                </Grid>
                
                {formData.tags.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          sx={{
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)'
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </SectionCard>

              {/* 高级设置 */}
              <SectionCard>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Settings size={20} />
                  高级设置
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.autoAssign}
                          onChange={(e) => handleInputChange('autoAssign', e.target.checked)}
                        />
                      }
                      label="自动分配 Agent"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      系统自动选择最适合的 Agent
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.allowBidding}
                          onChange={(e) => handleInputChange('allowBidding', e.target.checked)}
                        />
                      }
                      label="允许竞标"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Agent 可以竞标接取这个任务
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.allowParallelExecution}
                          onChange={(e) => handleInputChange('allowParallelExecution', e.target.checked)}
                        />
                      }
                      label="并行执行"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      允许多个 Agent 同时执行此任务
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.escrowEnabled}
                          onChange={(e) => handleInputChange('escrowEnabled', e.target.checked)}
                        />
                      }
                      label="启用托管"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      资金在任务完成后自动释放
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isPublic}
                          onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                        />
                      }
                      label="公开任务"
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      其他用户可以查看此任务
                    </Typography>
                  </Grid>
                </Grid>
              </SectionCard>

              {/* 提交按钮 */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                <CancelButton
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  取消
                </CancelButton>
                <SaveButton
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                >
                  {isSubmitting ? '保存中...' : isEditing ? '更新 Job' : '创建 Job'}
                </SaveButton>
              </Box>
            </CardContent>
          </FormCard>
        </form>
      </Container>
    </FormContainer>
  );
};

export default JobForm; 