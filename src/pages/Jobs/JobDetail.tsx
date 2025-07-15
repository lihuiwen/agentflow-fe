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
import JobService from '../../apis/services/Job';
import { Job } from '../../apis/model/Job';
import { PrefetchKeys } from '../../apis/queryKeys';

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

  // 模拟Agent数据
  const mockAgents = [
    { id: '1', name: 'AI Assistant Pro', avatar: '/api/placeholder/40/40', status: 'active', successRate: 95, completedTasks: 156 },
    { id: '2', name: 'Code Helper Bot', avatar: '/api/placeholder/40/40', status: 'active', successRate: 88, completedTasks: 89 },
    { id: '3', name: 'Data Analyst AI', avatar: '/api/placeholder/40/40', status: 'inactive', successRate: 92, completedTasks: 234 }
  ];

  // 模拟反馈数据
  const mockFeedbacks = [
    { id: '1', user: '用户A', rating: 5, comment: '工作完成得非常好，超出预期！', date: '2025-01-10' },
    { id: '2', user: '用户B', rating: 4, comment: '质量不错，但交付时间稍晚。', date: '2025-01-09' }
  ];

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
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-indigo-500 to-purple-600 w-full pt-8 pb-8">
      <Container maxWidth="lg">
        {/* 头部操作区 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/jobs')}
            variant="contained"
            className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            sx={{ 
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            返回列表
          </Button>
          
          <Box display="flex" gap={2}>
            <Button
              startIcon={<Edit size={20} />}
              onClick={() => navigate(`/jobs/${id}/edit`)}
              variant="contained"
              className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              编辑
            </Button>
            
            {job.status === 'OPEN' && (
              <>
                <Button
                  startIcon={<Play size={20} />}
                  onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  variant="contained"
                  color="success"
                  className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
        <Card className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-visible">
          <CardContent sx={{ p: 4 }}>
            {/* Job标题和状态 */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
                  {job.jobTitle}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Chip 
                    label={job.status}
                    icon={getStatusIcon(job.status)}
                    className="font-semibold px-4 py-2 rounded-lg text-white"
                    sx={{ 
                      backgroundColor: getStatusColor(job.status).bg,
                      color: getStatusColor(job.status).color
                    }}
                  />
                  <Chip 
                    label={job.priority} 
                    className="font-semibold text-white"
                    sx={{ 
                      backgroundColor: getPriorityColor(job.priority),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  <Chip label={job.category} variant="outlined" />
                </Box>
              </Box>
              
              <Box textAlign="right">
                <Typography variant="h5" sx={{ color: '#2d3748', fontWeight: 600 }}>
                  {formatBudget(job.budget)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.paymentType === 'fixed' ? '固定价格' : 
                   job.paymentType === 'hourly' ? '按小时计费' : '里程碑付款'}
                </Typography>
              </Box>
            </Box>

            {/* 统计卡片 */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 border border-white/20 hover:-translate-y-1 hover:shadow-xl">
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <DollarSign size={40} style={{ color: '#4caf50' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    预算
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {formatBudget(job.budget)}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 border border-white/20 hover:-translate-y-1 hover:shadow-xl">
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <User size={40} style={{ color: '#2196f3' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    分配Agent
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700 }}>
                    {mockAgents.length}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 border border-white/20 hover:-translate-y-1 hover:shadow-xl">
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <TrendingUp size={40} style={{ color: '#ff9800' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    成功率
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                    92%
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 border border-white/20 hover:-translate-y-1 hover:shadow-xl">
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <Clock size={40} style={{ color: '#9c27b0' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    截止日期
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                    {formatDate(job.deadline)}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Tab导航 */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
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
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      任务描述
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {job.description}
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      交付成果
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {job.deliverables}
                    </Typography>
                  </Paper>
                  
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      技能标签
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {job.tags.map((tag, index) => (
                        <Chip key={index} label={tag} variant="outlined" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      任务设置
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>技能等级:</Typography>
                        <Chip label={job.skillLevel} size="small" />
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
              <Grid container spacing={3}>
                {mockAgents.map((agent) => (
                  <Grid item xs={12} md={6} key={agent.id}>
                    <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar src={agent.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                        <Box>
                          <Typography variant="h6">{agent.name}</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Badge 
                              color={agent.status === 'active' ? 'success' : 'default'}
                              variant="dot"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {agent.status === 'active' ? '活跃' : '非活跃'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">成功率: {agent.successRate}%</Typography>
                        <Typography variant="body2">完成任务: {agent.completedTasks}</Typography>
                      </Box>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={agent.successRate} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: agent.successRate >= 90 ? '#4caf50' : '#ff9800'
                          }
                        }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      执行进度
                    </Typography>
                    <Box mb={2}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">总体进度</Typography>
                        <Typography variant="body2">75%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      时间统计
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">开始时间:</Typography>
                        <Typography variant="body2">{formatDate(job.createdAt)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">预计完成:</Typography>
                        <Typography variant="body2">{formatDate(job.deadline)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">已用时间:</Typography>
                        <Typography variant="body2">3天</Typography>
                      </Box>
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
                >
                  添加反馈
                </Button>
              </Box>
              
              <List>
                {mockFeedbacks.map((feedback) => (
                  <React.Fragment key={feedback.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{feedback.user.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="subtitle1">{feedback.user}</Typography>
                            <Rating value={feedback.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(feedback.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {feedback.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
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
        <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>添加反馈</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  评分
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>
              <TextField
                label="反馈内容"
                multiline
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackDialog(false)}>取消</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                // 这里可以添加提交反馈的逻辑
                setFeedbackDialog(false);
                setFeedback('');
                setRating(4);
              }}
              className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
            >
              提交反馈
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