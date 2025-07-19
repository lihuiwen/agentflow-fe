import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Tab,
  Tabs,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Badge,
  Snackbar
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  Play,
  Pause,
  CheckCircle,
  X,
  User,
  DollarSign,
  Clock,
  Flag,
  TrendingUp,
  FileText,
  MessageCircle,
  Download,
  Star,
  MoreHorizontal
} from 'lucide-react';
import JobService from '@apis/services/Job';
import AgentService from '@apis/services/Agent';
import FeedbackService from '@apis/services/Feedback';
import { Job } from '@apis/model/Job';
import { Agent } from '@apis/model/Agents';
import { Feedback, CreateFeedbackRequest } from '@apis/model/Feedback';
import { PrefetchKeys } from '@apis/queryKeys';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`job-detail-tabpanel-${index}`}
      aria-labelledby={`job-detail-tab-${index}`}
      {...other}
    >
      {value === index && <div className="py-6">{children}</div>}
    </div>
  );
}

// 辅助函数
const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN': return { bg: '#4CAF50', color: 'white' };
    case 'IN_PROGRESS': return { bg: '#FF9800', color: 'white' };
    case 'COMPLETED': return { bg: '#2196F3', color: 'white' };
    case 'CANCELLED': return { bg: '#f44336', color: 'white' };
    default: return { bg: '#9E9E9E', color: 'white' };
  }
};

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [statusDialog, setStatusDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number | null>(4);
  const [feedbackType, setFeedbackType] = useState<'general' | 'quality' | 'communication' | 'timeline'>('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dimensions, setDimensions] = useState({
    quality: 4,
    communication: 4,
    timeliness: 4,
    professionalism: 4
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // 获取Job数据
  const { data: job, isLoading, error } = useQuery({
    queryKey: [PrefetchKeys.JOB_DETAIL, id],
    queryFn: () => JobService.getJobById(id!),
    enabled: !!id
  });

  // 获取Job相关的Agents数据
  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: [PrefetchKeys.JOB_AGENTS, id],
    queryFn: () => AgentService.getAgentsByJobId(id!),
    enabled: !!id
  });

  // 获取Job的反馈数据
  const { data: feedbacksData, isLoading: feedbacksLoading, refetch: refetchFeedbacks } = useQuery({
    queryKey: [PrefetchKeys.JOB_FEEDBACKS, id],
    queryFn: () => FeedbackService.getFeedbacksByJobId(id!, { sortBy: 'createdAt', sortOrder: 'desc' }),
    enabled: !!id
  });

  // 获取反馈统计数据
  const { data: feedbackStats } = useQuery({
    queryKey: [PrefetchKeys.FEEDBACK_STATS, id],
    queryFn: () => FeedbackService.getFeedbackStats(id!),
    enabled: !!id
  });

  // 状态更新mutation
  const statusMutation = useMutation({
    mutationFn: (status: Job['status']) => JobService.updateJobStatus(id!, status),
    onSuccess: (updatedJob) => {
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOB_DETAIL, id] });
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOBS] }); // 同时刷新列表页
      setStatusDialog(false);
      
      // 显示成功消息
      const statusMessages = {
        'OPEN': '任务已重新开放',
        'IN_PROGRESS': '任务已开始执行',
        'COMPLETED': '任务已标记为完成',
        'CANCELLED': '任务已取消',
        'DISTRIBUTED': '任务已分发',
        'EXPIRED': '任务已过期'
      };
      
      setSnackbar({
        open: true,
        message: statusMessages[updatedJob.status] || '状态更新成功',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setStatusDialog(false);
      setSnackbar({
        open: true,
        message: error.message || '状态更新失败，请重试',
        severity: 'error'
      });
    }
  });

  // 创建反馈mutation
  const createFeedbackMutation = useMutation({
    mutationFn: (feedbackData: CreateFeedbackRequest) => FeedbackService.createFeedback(feedbackData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOB_FEEDBACKS, id] });
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.FEEDBACK_STATS, id] });
      setFeedbackDialog(false);
      setFeedback('');
      setRating(4);
      setFeedbackType('general');
      setIsAnonymous(false);
      setDimensions({
        quality: 4,
        communication: 4,
        timeliness: 4,
        professionalism: 4
      });
      setSnackbar({
        open: true,
        message: '反馈提交成功！',
        severity: 'success'
      });
    },
    onError: (error: any) => {
      setSnackbar({
        open: true,
        message: error.message || '反馈提交失败，请重试',
        severity: 'error'
      });
    }
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusUpdate = (status: Job['status']) => {
    // 添加确认逻辑，特别是对于重要的状态变更
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      const confirmMessage = status === 'COMPLETED' 
        ? '确定要标记此任务为已完成吗？'
        : '确定要取消此任务吗？此操作不可撤销。';
      
      if (window.confirm(confirmMessage)) {
        statusMutation.mutate(status);
      }
    } else {
      statusMutation.mutate(status);
    }
  };

  const handleSubmitFeedback = () => {
    if (!rating || !feedback.trim()) {
      setSnackbar({
        open: true,
        message: '请填写评分和反馈内容',
        severity: 'warning'
      });
      return;
    }

    const feedbackData: CreateFeedbackRequest = {
      jobId: id!,
      rating: rating,
      comment: feedback.trim(),
      feedbackType,
      isAnonymous,
      dimensions
    };

    createFeedbackMutation.mutate(feedbackData);
  };

  const formatBudget = (budget: Job['budget']) => {
    if (typeof budget === 'number') {
      return `$${budget.toLocaleString()}`;
    }
    return `$${budget.min?.toLocaleString() || 0} - $${budget.max?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Play size={16} />;
      case 'IN_PROGRESS': return <Clock size={16} />;
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <X size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  // 使用真实的Agent数据，如果加载中则使用空数组
  const jobAgents = agents || [];

  // 使用真实的反馈数据
  const feedbacks = feedbacksData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-500 to-purple-600 w-full pt-8 pb-8">
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} sx={{ color: 'white' }} />
          </Box>
        </Container>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-500 to-purple-600 w-full pt-8 pb-8">
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            加载Job详情失败，请稍后重试。
          </Alert>
          <Button 
            startIcon={<ArrowLeft size={20} />} 
            onClick={() => navigate('/jobs')}
            variant="contained"
            className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            返回列表
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-50 to-gray-100 w-full py-8">
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* 头部操作区 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/jobs')}
            variant="outlined"
            sx={{ 
              borderRadius: 3,
              px: 3,
              py: 1.5,
              border: '2px solid',
              borderColor: 'gray.300',
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': { 
                borderColor: 'primary.main',
                backgroundColor: 'primary.50',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            返回列表
          </Button>
          
          <Box display="flex" gap={2}>
            <Button
              startIcon={<Edit size={20} />}
              onClick={() => navigate(`/jobs/${id}/edit`)}
              variant="contained"
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              编辑
            </Button>
            
            {job.status === 'OPEN' && (
              <>
                <Button
                  startIcon={<Play size={20} />}
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    backgroundColor: '#10b981',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    '&:hover': {
                      backgroundColor: '#059669',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending ? '处理中...' : '开始执行'}
                </Button>
                <Button
                  startIcon={<X size={20} />}
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  variant="outlined"
                  color="error"
                  className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  disabled={statusMutation.isPending}
                >
                  取消任务
                </Button>
              </>
            )}
            
            {job.status === 'IN_PROGRESS' && (
              <>
                <Button
                  startIcon={<CheckCircle size={20} />}
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  variant="contained"
                  color="success"
                  className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending ? '处理中...' : '标记完成'}
                </Button>
                <Button
                  startIcon={<Pause size={20} />}
                  onClick={() => setStatusDialog(true)}
                  variant="contained"
                  color="warning"
                  className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  disabled={statusMutation.isPending}
                >
                  更多操作
                </Button>
              </>
            )}
            
            {job.status === 'COMPLETED' && (
              <Button
                startIcon={<Flag size={20} />}
                onClick={() => handleStatusUpdate('OPEN')}
                variant="outlined"
                color="primary"
                className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                disabled={statusMutation.isPending}
              >
                {statusMutation.isPending ? '处理中...' : '重新开放'}
              </Button>
            )}
            
            {job.status === 'CANCELLED' && (
              <Button
                startIcon={<Flag size={20} />}
                onClick={() => handleStatusUpdate('OPEN')}
                variant="outlined"
                color="primary"
                className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                disabled={statusMutation.isPending}
              >
                {statusMutation.isPending ? '处理中...' : '重新开放'}
              </Button>
            )}
          </Box>
        </Box>

        {/* 主要内容卡片 */}
        <Card 
          sx={{
            borderRadius: 4,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid',
            borderColor: 'gray.100',
            backgroundColor: 'white',
            overflow: 'visible'
          }}
        >
          <CardContent sx={{ p: 5 }}>
            {/* Job标题和状态 */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={5}>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800, 
                    color: '#1a202c',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  {job.jobTitle}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Chip 
                    label={job.status}
                    icon={getStatusIcon(job.status)}
                    sx={{ 
                      backgroundColor: getStatusColor(job.status).bg,
                      color: getStatusColor(job.status).color,
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderRadius: 3,
                      fontSize: '0.875rem'
                    }}
                  />
                  <Chip 
                    label={job.priority} 
                    sx={{ 
                      backgroundColor: getPriorityColor(job.priority),
                      color: 'white',
                      fontWeight: 600,
                      px: 2,
                      py: 0.5,
                      borderRadius: 3,
                      fontSize: '0.875rem'
                    }}
                  />
                  <Chip 
                    label={job.category} 
                    variant="outlined" 
                    sx={{
                      fontWeight: 600,
                      borderColor: 'gray.300',
                      color: 'gray.700',
                      borderRadius: 3,
                      fontSize: '0.875rem'
                    }}
                  />
                </Box>
              </Box>
              
              <Box textAlign="right">
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#059669', 
                    fontWeight: 800,
                    mb: 1
                  }}
                >
                  {formatBudget(job.budget)}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: 'gray.600',
                    fontWeight: 500,
                    backgroundColor: 'green.50',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: 'inline-block'
                  }}
                >
                  {job.paymentType === 'fixed' ? '固定价格' : 
                   job.paymentType === 'hourly' ? '按小时计费' : '里程碑付款'}
                </Typography>
              </Box>
            </Box>

            {/* 统计卡片 */}
            <Grid container spacing={4} mb={6}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'green.100',
                    backgroundColor: 'green.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(16, 185, 129, 0.15)',
                      borderColor: 'green.200'
                    }
                  }}
                >
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    mb={2}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'green.100',
                      mx: 'auto'
                    }}
                  >
                    <DollarSign size={32} style={{ color: '#059669' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'green.800', fontWeight: 600 }}>
                    预算
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#059669', fontWeight: 800 }}>
                    {formatBudget(job.budget)}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'blue.100',
                    backgroundColor: 'blue.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(59, 130, 246, 0.15)',
                      borderColor: 'blue.200'
                    }
                  }}
                >
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    mb={2}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'blue.100',
                      mx: 'auto'
                    }}
                  >
                    <User size={32} style={{ color: '#2563eb' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'blue.800', fontWeight: 600 }}>
                    分配Agent
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#2563eb', fontWeight: 800 }}>
                    {agentsLoading ? '...' : jobAgents.length}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'orange.100',
                    backgroundColor: 'orange.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(245, 158, 11, 0.15)',
                      borderColor: 'orange.200'
                    }
                  }}
                >
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    mb={2}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'orange.100',
                      mx: 'auto'
                    }}
                  >
                    <TrendingUp size={32} style={{ color: '#d97706' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'orange.800', fontWeight: 600 }}>
                    成功率
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#d97706', fontWeight: 800 }}>
                    92%
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'purple.100',
                    backgroundColor: 'purple.50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(147, 51, 234, 0.15)',
                      borderColor: 'purple.200'
                    }
                  }}
                >
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    mb={2}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'purple.100',
                      mx: 'auto'
                    }}
                  >
                    <Clock size={32} style={{ color: '#7c3aed' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'purple.800', fontWeight: 600 }}>
                    截止日期
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.1rem' }}>
                    {formatDate(job.deadline)}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Tab导航 */}
            <Box sx={{ 
              borderBottom: 2, 
              borderColor: 'gray.100', 
              mb: 4,
              '& .MuiTabs-root': {
                minHeight: 56
              }
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minHeight: 56,
                    px: 4,
                    color: 'gray.600',
                    '&.Mui-selected': {
                      color: 'primary.main',
                      fontWeight: 700
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }
                }}
              >
                <Tab label="任务概览" />
                <Tab label="Agent结果" />
                <Tab label="执行统计" />
                <Tab label="反馈评价" />
              </Tabs>
            </Box>

            {/* Tab内容 */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Paper 
                    sx={{ 
                      p: 4, 
                      mb: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'gray.100',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: 'gray.800',
                        mb: 3
                      }}
                    >
                      任务描述
                    </Typography>
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{
                        lineHeight: 1.8,
                        color: 'gray.700',
                        fontSize: '1.1rem'
                      }}
                    >
                      {job.description}
                    </Typography>
                  </Paper>
                  
                  <Paper 
                    sx={{ 
                      p: 4, 
                      mb: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'gray.100',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: 'gray.800',
                        mb: 3
                      }}
                    >
                      交付成果
                    </Typography>
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{
                        lineHeight: 1.8,
                        color: 'gray.700',
                        fontSize: '1.1rem'
                      }}
                    >
                      {job.deliverables}
                    </Typography>
                  </Paper>
                  
                  <Paper 
                    sx={{ 
                      p: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'gray.100',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: 'gray.800',
                        mb: 3
                      }}
                    >
                      技能标签
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1.5}>
                      {job.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            py: 1,
                            px: 2,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.50'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      p: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'gray.100',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        color: 'gray.800',
                        mb: 3
                      }}
                    >
                      任务设置
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={3}>
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'gray.50'
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, color: 'gray.700' }}>技能等级:</Typography>
                        <Chip 
                          label={job.skillLevel} 
                          size="medium"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: 'primary.100',
                            color: 'primary.800'
                          }}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>自动分配:</Typography>
                        <Chip 
                          label={job.autoAssign ? '启用' : '禁用'} 
                          size="small"
                          color={job.autoAssign ? 'success' : 'default'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>允许竞标:</Typography>
                        <Chip 
                          label={job.allowBidding ? '允许' : '禁止'} 
                          size="small"
                          color={job.allowBidding ? 'success' : 'default'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>并行执行:</Typography>
                        <Chip 
                          label={job.allowParallelExecution ? '允许' : '禁止'} 
                          size="small"
                          color={job.allowParallelExecution ? 'success' : 'default'}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>托管付款:</Typography>
                        <Chip 
                          label={job.escrowEnabled ? '启用' : '禁用'} 
                          size="small"
                          color={job.escrowEnabled ? 'success' : 'default'}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                分配的Agent
              </Typography>
              {agentsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {jobAgents.length === 0 ? (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        暂无分配的Agent
                      </Alert>
                    </Grid>
                  ) : (
                    jobAgents.map((agent) => (
                      <Grid item xs={12} md={6} key={agent.id}>
                        <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
                          <Box display="flex" alignItems="center" mb={2}>
                            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                              {agent.agentName?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">{agent.agentName}</Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Badge 
                                  color={agent.isActive ? 'success' : 'default'}
                                  variant="dot"
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {agent.isActive ? '活跃' : '非活跃'}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {agent.agentClassification}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="body2">成功率: {agent.successRate}%</Typography>
                            <Typography variant="body2">完成任务: {agent.totalJobsCompleted}</Typography>
                          </Box>
                          
                          <LinearProgress 
                            variant="determinate" 
                            value={agent.successRate || 0} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: (agent.successRate || 0) >= 90 ? '#4caf50' : '#ff9800'
                              }
                            }}
                          />
                          
                          <Box mt={2}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                              {agent.description}
                            </Typography>
                          </Box>
                          
                          {agent.tags && agent.tags.length > 0 && (
                            <Box mt={2} display="flex" flexWrap="wrap" gap={0.5}>
                              {agent.tags.slice(0, 3).map((tag, index) => (
                                <Chip key={index} label={tag} size="small" variant="outlined" />
                              ))}
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                {/* 执行进度卡片 */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      执行进度
                    </Typography>
                    <Box mb={3}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">总体进度</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>75%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          height: 12, 
                          borderRadius: 6,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#4caf50'
                          }
                        }} 
                      />
                    </Box>

                    {/* 子任务进度 */}
                    <Box mb={2}>
                      <Typography variant="body2" gutterBottom>子任务分解</Typography>
                      <Box display="flex" flexDirection="column" gap={1.5}>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2" color="text.secondary">需求分析</Typography>
                            <Typography variant="body2" color="success.main">100%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3 }} color="success" />
                        </Box>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2" color="text.secondary">开发实现</Typography>
                            <Typography variant="body2" color="warning.main">80%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={80} sx={{ height: 6, borderRadius: 3 }} color="warning" />
                        </Box>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2" color="text.secondary">测试验证</Typography>
                            <Typography variant="body2" color="info.main">40%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={40} sx={{ height: 6, borderRadius: 3 }} color="info" />
                        </Box>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="body2" color="text.secondary">部署上线</Typography>
                            <Typography variant="body2" color="error.main">0%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={0} sx={{ height: 6, borderRadius: 3 }} color="error" />
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* 时间统计卡片 */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      时间统计
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Box display="flex" justifyContent="space-between" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2">开始时间:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(job.createdAt)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2">预计完成:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(job.deadline)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="success.dark">已用时间:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} color="success.dark">3天</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="body2" color="warning.dark">剩余时间:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} color="warning.dark">12天</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Agent性能统计 */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Agent性能分析
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      {jobAgents.slice(0, 3).map((agent, index) => (
                        <Box key={agent.id} sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{agent.agentName}</Typography>
                            <Chip 
                              label={`${agent.successRate}%`} 
                              size="small" 
                              color={(agent.successRate || 0) >= 90 ? 'success' : 'warning'}
                            />
                          </Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">响应时间</Typography>
                            <Typography variant="body2">{Math.floor(Math.random() * 100) + 50}ms</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">完成任务</Typography>
                            <Typography variant="body2">{agent.totalJobsCompleted}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* 资源利用率 */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      资源利用率
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">CPU使用率</Typography>
                          <Typography variant="body2" color="success.main">65%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={65} 
                          color="success"
                          sx={{ height: 8, borderRadius: 4 }} 
                        />
                      </Box>
                      
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">内存使用率</Typography>
                          <Typography variant="body2" color="warning.main">82%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={82} 
                          color="warning"
                          sx={{ height: 8, borderRadius: 4 }} 
                        />
                      </Box>

                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">网络带宽</Typography>
                          <Typography variant="body2" color="info.main">45%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={45} 
                          color="info"
                          sx={{ height: 8, borderRadius: 4 }} 
                        />
                      </Box>

                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">存储使用率</Typography>
                          <Typography variant="body2" color="error.main">91%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={91} 
                          color="error"
                          sx={{ height: 8, borderRadius: 4 }} 
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* 执行历史趋势 */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      执行历史趋势
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        过去7天的任务执行情况
                      </Typography>
                    </Box>
                    
                    {/* 简单的柱状图模拟 */}
                    <Box display="flex" alignItems="end" gap={1} height={120} mb={2}>
                      {[65, 78, 82, 45, 90, 88, 75].map((value, index) => (
                        <Box 
                          key={index}
                          sx={{
                            flex: 1,
                            height: `${value}%`,
                            backgroundColor: index === 6 ? 'primary.main' : 'grey.300',
                            borderRadius: '4px 4px 0 0',
                            display: 'flex',
                            alignItems: 'end',
                            justifyContent: 'center',
                            pb: 0.5
                          }}
                        >
                          <Typography variant="caption" color={index === 6 ? 'white' : 'text.secondary'}>
                            {value}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    {/* 日期标签 */}
                    <Box display="flex" gap={1}>
                      {['周一', '周二', '周三', '周四', '周五', '周六', '今天'].map((day, index) => (
                        <Box key={index} flex={1} textAlign="center">
                          <Typography variant="caption" color="text.secondary">
                            {day}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  反馈评价
                </Typography>
                <Button 
                  variant="contained"
                  onClick={() => setFeedbackDialog(true)}
                  className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  disabled={createFeedbackMutation.isPending}
                >
                  {createFeedbackMutation.isPending ? '提交中...' : '添加反馈'}
                </Button>
              </Box>

              {/* 反馈统计概览 */}
              {feedbackStats && (
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        评分统计
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          {feedbackStats.averageRating.toFixed(1)}
                        </Typography>
                        <Box>
                          <Rating value={feedbackStats.averageRating} readOnly precision={0.1} />
                          <Typography variant="body2" color="text.secondary">
                            基于 {feedbackStats.totalFeedbacks} 条反馈
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* 评分分布 */}
                      <Box>
                        {[5, 4, 3, 2, 1].map((star) => (
                          <Box key={star} display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="body2" width={20}>{star}</Typography>
                            <Star size={16} fill="currentColor" />
                            <LinearProgress 
                              variant="determinate" 
                              value={(feedbackStats.ratingDistribution[star as keyof typeof feedbackStats.ratingDistribution] / feedbackStats.totalFeedbacks) * 100}
                              sx={{ 
                                flex: 1, 
                                height: 6, 
                                borderRadius: 3,
                                backgroundColor: 'grey.200'
                              }}
                            />
                            <Typography variant="body2" width={30}>
                              {feedbackStats.ratingDistribution[star as keyof typeof feedbackStats.ratingDistribution]}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>

                  {feedbackStats.dimensionAverages && (
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          维度评分
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                          {Object.entries(feedbackStats.dimensionAverages).map(([key, value]) => (
                            <Box key={key}>
                              <Box display="flex" justifyContent="space-between" mb={0.5}>
                                <Typography variant="body2">
                                  {key === 'quality' ? '质量' : 
                                   key === 'communication' ? '沟通' :
                                   key === 'timeliness' ? '及时性' : '专业性'}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {value.toFixed(1)}
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={(value / 5) * 100}
                                sx={{ height: 8, borderRadius: 4 }}
                                color={value >= 4 ? 'success' : value >= 3 ? 'warning' : 'error'}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* 反馈列表 */}
              {feedbacksLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : feedbacks.length === 0 ? (
                <Alert severity="info">
                  暂无反馈，成为第一个评价的用户吧！
                </Alert>
              ) : (
                <List>
                  {feedbacks.map((feedback) => (
                    <React.Fragment key={feedback.id}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {feedback.isAnonymous ? '匿' : feedback.userName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {feedback.isAnonymous ? '匿名用户' : feedback.userName}
                              </Typography>
                              <Rating value={feedback.rating} readOnly size="small" />
                              <Chip 
                                label={
                                  feedback.feedbackType === 'quality' ? '质量' :
                                  feedback.feedbackType === 'communication' ? '沟通' :
                                  feedback.feedbackType === 'timeline' ? '时间' : '综合'
                                }
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(feedback.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                {feedback.comment}
                              </Typography>
                              
                              {/* 标签 */}
                              {feedback.tags && feedback.tags.length > 0 && (
                                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                                  {feedback.tags.map((tag, index) => (
                                    <Chip key={index} label={tag} size="small" />
                                  ))}
                                </Box>
                              )}

                              {/* 维度评分 */}
                              {feedback.dimensions && (
                                <Grid container spacing={1} mb={2}>
                                  {Object.entries(feedback.dimensions).map(([key, value]) => (
                                    <Grid item xs={6} sm={3} key={key}>
                                      <Box textAlign="center">
                                        <Typography variant="caption" color="text.secondary">
                                          {key === 'quality' ? '质量' : 
                                           key === 'communication' ? '沟通' :
                                           key === 'timeliness' ? '及时性' : '专业性'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {value}/5
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              )}

                              {/* 有用投票 */}
                              {feedback.helpfulVotes && (
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="caption" color="text.secondary">
                                    这条反馈有用吗？
                                  </Typography>
                                  <Button size="small" startIcon={<Star size={14} />}>
                                    有用 ({feedback.helpfulVotes.helpful})
                                  </Button>
                                  <Button size="small" color="inherit">
                                    无用 ({feedback.helpfulVotes.notHelpful})
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>
          </CardContent>
        </Card>
        
        {/* 状态更新对话框 */}
        <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>更新任务状态</DialogTitle>
          <DialogContent>
            <Typography gutterBottom sx={{ mb: 3 }}>
              当前状态：<strong>{job?.status}</strong>
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
              选择要更新的状态：
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {job?.status === 'IN_PROGRESS' && (
                <>
                  <Button 
                    variant="outlined"
                    onClick={() => handleStatusUpdate('COMPLETED')}
                    startIcon={<CheckCircle size={20} />}
                    color="success"
                    className="rounded-lg justify-start"
                    disabled={statusMutation.isPending}
                  >
                    标记为已完成
                  </Button>
                  <Button 
                    variant="outlined"
                    onClick={() => handleStatusUpdate('OPEN')}
                    startIcon={<Pause size={20} />}
                    color="warning"
                    className="rounded-lg justify-start"
                    disabled={statusMutation.isPending}
                  >
                    暂停任务（回到开放状态）
                  </Button>
                  <Button 
                    variant="outlined"
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    startIcon={<X size={20} />}
                    color="error"
                    className="rounded-lg justify-start"
                    disabled={statusMutation.isPending}
                  >
                    取消任务
                  </Button>
                </>
              )}
              
              {job?.status === 'OPEN' && (
                <>
                  <Button 
                    variant="outlined"
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                    startIcon={<Play size={20} />}
                    color="success"
                    className="rounded-lg justify-start"
                    disabled={statusMutation.isPending}
                  >
                    开始执行
                  </Button>
                  <Button 
                    variant="outlined"
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    startIcon={<X size={20} />}
                    color="error"
                    className="rounded-lg justify-start"
                    disabled={statusMutation.isPending}
                  >
                    取消任务
                  </Button>
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialog(false)} disabled={statusMutation.isPending}>
              取消
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* 反馈对话框 */}
        <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>添加反馈评价</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
              {/* 总体评分 */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  总体评分 *
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>

              {/* 反馈类型 */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  反馈类型
                </Typography>
                <Box display="flex" gap={1}>
                  {[
                    { value: 'general', label: '综合评价' },
                    { value: 'quality', label: '质量' },
                    { value: 'communication', label: '沟通' },
                    { value: 'timeline', label: '时间' }
                  ].map((type) => (
                    <Chip
                      key={type.value}
                      label={type.label}
                      clickable
                      color={feedbackType === type.value ? 'primary' : 'default'}
                      onClick={() => setFeedbackType(type.value as any)}
                    />
                  ))}
                </Box>
              </Box>

              {/* 维度评分 */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  详细评分
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(dimensions).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          {key === 'quality' ? '工作质量' : 
                           key === 'communication' ? '沟通效果' :
                           key === 'timeliness' ? '时间把控' : '专业程度'}
                        </Typography>
                        <Rating
                          value={value}
                          onChange={(event, newValue) => setDimensions(prev => ({
                            ...prev,
                            [key]: newValue || 1
                          }))}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* 反馈内容 */}
              <TextField
                label="反馈内容 *"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="请详细描述您的使用体验..."
                helperText={`${feedback.length}/500 字符`}
                inputProps={{ maxLength: 500 }}
              />

              {/* 匿名选项 */}
              <Box display="flex" alignItems="center" gap={1}>
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label htmlFor="anonymous">
                  <Typography variant="body2">
                    匿名发布反馈
                  </Typography>
                </label>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setFeedbackDialog(false)}
              disabled={createFeedbackMutation.isPending}
            >
              取消
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmitFeedback}
              disabled={createFeedbackMutation.isPending}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              {createFeedbackMutation.isPending ? '提交中...' : '提交反馈'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* 通知 Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default JobDetail; 