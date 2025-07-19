import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Card,
  CardContent,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Snackbar,
  Box
} from '@mui/material';
import JobService from '@apis/services/Job';
import AgentService from '@apis/services/Agent';
import FeedbackService from '@apis/services/Feedback';
import { CreateFeedbackRequest } from '@apis/model/Feedback';
import { PrefetchKeys } from '@apis/queryKeys';
import JobDetailHeader from './components/JobDetailHeader';
import JobStatsCards from './components/JobStatsCards';
import JobOverviewTab from './components/JobOverviewTab';
import JobAgentsTab from './components/JobAgentsTab';
import JobExecutionTab from './components/JobExecutionTab';
import JobFeedbackTab from './components/JobFeedbackTab';
import StatusUpdateDialog from './components/StatusUpdateDialog';
import { getStatusMessage } from './utils';
import { SnackbarState, FeedbackFormData } from './types';

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


const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [statusDialog, setStatusDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormData>({
    rating: 4,
    comment: '',
    feedbackType: 'general',
    isAnonymous: false,
    dimensions: {
      quality: 4,
      communication: 4,
      timeliness: 4,
      professionalism: 4
    }
  });
  const [snackbar, setSnackbar] = useState<SnackbarState>({
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
      queryClient.invalidateQueries({ queryKey: [PrefetchKeys.JOBS] });
      setStatusDialog(false);
      
      setSnackbar({
        open: true,
        message: getStatusMessage(updatedJob.status),
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
      setFeedbackForm({
        rating: 4,
        comment: '',
        feedbackType: 'general',
        isAnonymous: false,
        dimensions: {
          quality: 4,
          communication: 4,
          timeliness: 4,
          professionalism: 4
        }
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
    statusMutation.mutate(status);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.rating || !feedbackForm.comment.trim()) {
      setSnackbar({
        open: true,
        message: '请填写评分和反馈内容',
        severity: 'warning'
      });
      return;
    }

    const feedbackData: CreateFeedbackRequest = {
      jobId: id!,
      rating: feedbackForm.rating,
      comment: feedbackForm.comment.trim(),
      feedbackType: feedbackForm.feedbackType,
      isAnonymous: feedbackForm.isAnonymous,
      dimensions: feedbackForm.dimensions
    };

    createFeedbackMutation.mutate(feedbackData);
  };

  // 使用真实的Agent数据
  const jobAgents = agents || [];
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
        {/* 头部操作区和任务信息 */}
        <JobDetailHeader
          job={job}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={statusMutation.isPending}
          onOpenStatusDialog={() => setStatusDialog(true)}
        />

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
            {/* 统计卡片 */}
            <JobStatsCards
              job={job}
              agentsCount={jobAgents.length}
              agentsLoading={agentsLoading}
            />

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
              <JobOverviewTab job={job} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <JobAgentsTab 
                agents={jobAgents}
                agentsLoading={agentsLoading}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <JobExecutionTab 
                job={job}
                agents={jobAgents}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <JobFeedbackTab
                feedbacks={feedbacks}
                feedbackStats={feedbackStats}
                feedbacksLoading={feedbacksLoading}
                onAddFeedback={() => setFeedbackDialog(true)}
                isSubmitting={createFeedbackMutation.isPending}
              />
            </TabPanel>
          </CardContent>
        </Card>
        
        {/* 状态更新对话框 */}
        <StatusUpdateDialog
          open={statusDialog}
          onClose={() => setStatusDialog(false)}
          job={job}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={statusMutation.isPending}
        />
        
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