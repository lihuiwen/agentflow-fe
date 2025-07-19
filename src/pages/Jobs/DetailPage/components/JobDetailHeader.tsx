import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Typography } from '@mui/material';
import {
  ArrowLeft,
  Edit,
  Play,
  Pause,
  CheckCircle,
  X,
  Flag
} from 'lucide-react';
import { Job } from '@apis/model/Job';
import { getStatusColor, getPriorityColor, formatBudget } from '../utils';

interface JobDetailHeaderProps {
  job: Job;
  onStatusUpdate: (status: Job['status']) => void;
  isUpdating: boolean;
  onOpenStatusDialog: () => void;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({
  job,
  onStatusUpdate,
  isUpdating,
  onOpenStatusDialog
}) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Play size={16} />;
      case 'IN_PROGRESS': return <Pause size={16} />;
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <X size={16} />;
      default: return <Flag size={16} />;
    }
  };

  const handleStatusUpdate = (status: Job['status']) => {
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      const confirmMessage = status === 'COMPLETED' 
        ? '确定要标记此任务为已完成吗？'
        : '确定要取消此任务吗？此操作不可撤销。';
      
      if (window.confirm(confirmMessage)) {
        onStatusUpdate(status);
      }
    } else {
      onStatusUpdate(status);
    }
  };

  return (
    <>
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
            onClick={() => navigate(`/jobs/${job.id}/edit`)}
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
                disabled={isUpdating}
              >
                {isUpdating ? '处理中...' : '开始执行'}
              </Button>
              <Button
                startIcon={<X size={20} />}
                onClick={() => handleStatusUpdate('CANCELLED')}
                variant="outlined"
                color="error"
                className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                disabled={isUpdating}
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
                disabled={isUpdating}
              >
                {isUpdating ? '处理中...' : '标记完成'}
              </Button>
              <Button
                startIcon={<Pause size={20} />}
                onClick={onOpenStatusDialog}
                variant="contained"
                color="warning"
                className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                disabled={isUpdating}
              >
                更多操作
              </Button>
            </>
          )}
          
          {(job.status === 'COMPLETED' || job.status === 'CANCELLED') && (
            <Button
              startIcon={<Flag size={20} />}
              onClick={() => handleStatusUpdate('OPEN')}
              variant="outlined"
              color="primary"
              className="rounded-2xl px-6 py-3 font-semibold lowercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              disabled={isUpdating}
            >
              {isUpdating ? '处理中...' : '重新开放'}
            </Button>
          )}
        </Box>
      </Box>

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
    </>
  );
};

export default JobDetailHeader;