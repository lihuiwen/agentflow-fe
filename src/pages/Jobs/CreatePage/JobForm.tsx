import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  CardContent,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import JobService from '@apis/services/Job';
import CategoryService from '@apis/services/Category';
import { PrefetchKeys } from '@apis/queryKeys';
import { CreateJobRequest } from '@apis/model/Job';
import { styles } from './styles';
import { FormData } from './types';
import BasicInfoSection from './components/BasicInfoSection';
import BudgetTimeSection from './components/BudgetTimeSection';
import SkillTagsSection from './components/SkillTagsSection';
import AdvancedSettingsSection from './components/AdvancedSettingsSection';


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
      minBudget: formData.budget.min,
      maxBudget: formData.budget.max,
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


  // 取消操作
  const handleCancel = () => {
    navigate('/jobs');
  };

  if (isEditing && jobLoading) {
    return (
      <Box className={styles.formContainer}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const submitError = createMutation.error || updateMutation.error;

  return (
    <Box className={styles.formContainer}>
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
          <Box className={styles.formCard}>
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

              {/* 表单各个部分 */}
              <BasicInfoSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                categories={categories}
                categoriesLoading={categoriesLoading}
              />

              <BudgetTimeSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <SkillTagsSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <AdvancedSettingsSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              {/* 提交按钮 */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className={styles.cancelButton}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                  className={styles.saveButton}
                >
                  {isSubmitting ? '保存中...' : isEditing ? '更新 Job' : '创建 Job'}
                </Button>
              </Box>
            </CardContent>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default JobForm; 