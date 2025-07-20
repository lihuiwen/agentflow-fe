import React from 'react';
import { Grid, Card, Box, Typography, Skeleton } from '@mui/material';
import { DollarSign, User, TrendingUp, Clock } from 'lucide-react';
import { Job } from '@apis/model/Job';
import { Agent } from '@apis/model/Agents';
import { formatBudget, formatDate } from '../utils';

interface JobStatsCardsProps {
  job: Job;
  agentsCount: number;
  agentsLoading: boolean;
}

const JobStatsCards: React.FC<JobStatsCardsProps> = ({
  job,
  agentsCount,
  agentsLoading
}) => {
  const statsData = [
    {
      title: '预算',
      value: formatBudget(job.budget),
      icon: DollarSign,
      color: {
        primary: '#10b981',
        light: '#d1fae5',
        border: '#86efac',
        shadow: 'rgba(16, 185, 129, 0.15)'
      }
    },
    {
      title: '分配Agent',
      value: agentsLoading ? null : 30,
      icon: User,
      color: {
        primary: '#3b82f6',
        light: '#dbeafe',
        border: '#93c5fd',
        shadow: 'rgba(59, 130, 246, 0.15)'
      },
      loading: agentsLoading
    },
    {
      title: '成功率',
      value: '92%',
      icon: TrendingUp,
      color: {
        primary: '#f59e0b',
        light: '#fef3c7',
        border: '#fcd34d',
        shadow: 'rgba(245, 158, 11, 0.15)'
      }
    },
    {
      title: '截止日期',
      value: formatDate(job.deadline),
      icon: Clock,
      color: {
        primary: '#8b5cf6',
        light: '#ede9fe',
        border: '#c4b5fd',
        shadow: 'rgba(139, 92, 246, 0.15)'
      },
      isDate: true
    }
  ];

  return (
    <Grid container spacing={3} mb={6}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card 
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: 3,
              border: '2px solid transparent',
              backgroundColor: stat.color.light,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: stat.color.primary,
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease'
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: `0 20px 40px ${stat.color.shadow}`,
                borderColor: stat.color.border,
                '&::before': {
                  transform: 'scaleX(1)'
                },
                '& .icon-container': {
                  transform: 'rotate(5deg) scale(1.1)',
                  backgroundColor: stat.color.primary,
                  '& svg': {
                    color: 'white'
                  }
                }
              }
            }}
          >
            {/* 图标容器 */}
            <Box 
              className="icon-container"
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: `0 8px 16px ${stat.color.shadow}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: `2px solid ${stat.color.border}`
              }}
            >
              <stat.icon size={28} style={{ color: stat.color.primary }} />
            </Box>
            
            {/* 标题 */}
            <Typography 
              variant="subtitle1" 
              gutterBottom 
              sx={{ 
                color: stat.color.primary,
                fontWeight: 600,
                mb: 1,
                fontSize: '0.95rem',
                letterSpacing: '0.02em'
              }}
            >
              {stat.title}
            </Typography>
            
            {/* 数值 */}
            <Box sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
              {stat.loading ? (
                <Skeleton 
                  variant="text" 
                  width={60} 
                  height={40}
                  sx={{ 
                    fontSize: '1.75rem',
                    borderRadius: 1
                  }}
                />
              ) : (
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: stat.color.primary,
                    fontWeight: 800,
                    fontSize: stat.isDate ? '1.1rem' : '2rem',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {stat.value}
                </Typography>
              )}
            </Box>
            
            {/* 装饰性背景元素 */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: stat.color.primary,
                opacity: 0.05,
                transition: 'all 0.3s ease'
              }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default JobStatsCards;