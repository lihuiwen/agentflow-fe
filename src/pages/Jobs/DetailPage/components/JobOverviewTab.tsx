import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Divider,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CheckCircle, 
  X, 
  Star,
  Shield,
  Zap,
  FileText,
  Bookmark
} from 'lucide-react';
import { Job } from '@apis/model/Job';

interface JobOverviewTabProps {
  job: Job;
}

const JobOverviewTab: React.FC<JobOverviewTabProps> = ({ job }) => {
  const theme = useTheme();

  // 技能等级颜色映射
  const getSkillLevelColor = (level: string) => {
    const levelMap = {
      '初级': { color: theme.palette.success.main, bg: alpha(theme.palette.success.main, 0.1) },
      '中级': { color: theme.palette.warning.main, bg: alpha(theme.palette.warning.main, 0.1) },
      '高级': { color: theme.palette.error.main, bg: alpha(theme.palette.error.main, 0.1) },
      '专家': { color: theme.palette.secondary.main, bg: alpha(theme.palette.secondary.main, 0.1) }
    };
    return levelMap[level as keyof typeof levelMap] || levelMap['初级'];
  };

  // 设置项配置
  const settingItems = [
    {
      label: '自动分配',
      value: job.autoAssign,
      icon: <Zap size={16} />,
      description: '系统会自动为此任务分配合适的执行者'
    },
    {
      label: '允许竞标',
      value: job.allowBidding,
      icon: <FileText size={16} />,
      description: '执行者可以对此任务进行竞标'
    },
    {
      label: '并行执行',
      value: job.allowParallelExecution,
      icon: <Zap size={16} />,
      description: '允许多个执行者同时处理此任务'
    },
    {
      label: '托管付款',
      value: job.escrowEnabled,
      icon: <Shield size={16} />,
      description: '付款将通过第三方托管保障'
    }
  ];

  const StatusIcon = ({ enabled }: { enabled: boolean }) => (
    enabled ? 
      <CheckCircle size={16} style={{ color: theme.palette.success.main }} /> : 
      <X size={16} style={{ color: theme.palette.grey[400] }} />
  );

  return (
    <Grid container spacing={3}>
      {/* 左侧主要内容 */}
      <Grid item xs={12} lg={8}>
        <Stack spacing={3}>
          {/* 任务描述 */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Bookmark size={20} style={{ color: theme.palette.primary.main }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                任务描述
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{
                lineHeight: 1.7,
                color: 'text.secondary',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap'
              }}
            >
              {job.description}
            </Typography>
          </Paper>

          {/* 交付成果 */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <FileText size={20} style={{ color: theme.palette.success.main }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                交付成果
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{
                lineHeight: 1.7,
                color: 'text.secondary',
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap'
              }}
            >
              {job.deliverables}
            </Typography>
          </Paper>

          {/* 技能标签 */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Star size={20} style={{ color: theme.palette.warning.main }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary'
                }}
              >
                技能标签
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {job.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  variant="outlined"
                  size="medium"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    height: 32,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: 'primary.main',
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: 'primary.main'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Stack>
      </Grid>
      
      {/* 右侧设置信息 */}
      <Grid item xs={12} lg={4}>
        <Stack spacing={3}>
          {/* 技能等级 */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              技能等级
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                borderRadius: 1.5,
                backgroundColor: getSkillLevelColor(job.skillLevel).bg,
                border: `2px solid ${getSkillLevelColor(job.skillLevel).color}`
              }}
            >
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 600,
                  color: getSkillLevelColor(job.skillLevel).color
                }}
              >
                {job.skillLevel}
              </Typography>
            </Box>
          </Paper>

          {/* 任务设置 */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              background: 'linear-gradient(135deg, #fafafa 0%, #ffffff 100%)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              任务设置
            </Typography>
            <Stack spacing={2}>
              {settingItems.map((item, index) => (
                <Box key={index}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      {item.icon}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: 'text.primary'
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    <StatusIcon enabled={item.value} />
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      ml: 3
                    }}
                  >
                    {item.description}
                  </Typography>
                  {index < settingItems.length - 1 && (
                    <Divider sx={{ mt: 1.5 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default JobOverviewTab;