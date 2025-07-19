import React from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import { Job } from '@apis/model/Job';
import { Agent } from '@apis/model/Agents';
import { formatDate } from '../utils';

interface JobExecutionTabProps {
  job: Job;
  agents: Agent[];
}

const JobExecutionTab: React.FC<JobExecutionTabProps> = ({ job, agents }) => {
  return (
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
    </Grid>
  );
};

export default JobExecutionTab;