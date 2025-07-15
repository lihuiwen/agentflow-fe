import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Grid, 
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Plus, Search, Filter, TrendingUp, Calendar, DollarSign, User } from 'lucide-react';
import JobService from '../../apis/services/Job';
import { PrefetchKeys } from '../../apis/queryKeys';
import { Job, JobFilterParams } from '../../apis/model/Job';

// 样式化组件
const HeroBanner = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  textAlign: 'center'
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  border: 'none',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)'
  }
}));

const JobCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  }
}));

const FilterSection = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(20px)',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.spacing(3),
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    zIndex: -1
  },
  position: 'relative'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(102, 126, 234, 0.4)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(102, 126, 234, 0.4)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
    },
    '&.Mui-focused': {
      background: 'rgba(255, 255, 255, 1)',
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: 500
  }
}));

const FilterButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
  }
}));

const Jobs: React.FC = () => {
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    limit: 12
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // 获取Jobs数据
  const { data: jobsData, isLoading, error, refetch } = useQuery({
    queryKey: [PrefetchKeys.JOBS, filters],
    queryFn: () => JobService.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5分钟
  });

  // 获取统计数据
  const { data: statsData } = useQuery({
    queryKey: [PrefetchKeys.JOB_STATS],
    queryFn: () => JobService.getJobStats(),
    staleTime: 10 * 60 * 1000, // 10分钟
  });

  // 处理筛选
  const handleFilterChange = (key: keyof JobFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // 重置页码
    }));
  };

  // 处理搜索
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // 实际项目中可以添加防抖动逻辑
    setFilters(prev => ({
      ...prev,
      // 如果有搜索字段，可以在这里添加
      page: 1
    }));
  };

  // 过滤后的数据（客户端搜索）
  const filteredJobs = useMemo(() => {
    if (!jobsData?.data) return [];
    
    return jobsData.data.filter(job => {
      const matchesSearch = !searchTerm || 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [jobsData?.data, searchTerm]);

  // 处理分页
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  // 获取状态颜色
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'OPEN': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'error';
      case 'EXPIRED': return 'default';
      default: return 'default';
    }
  };

  // 格式化预算显示
  const formatBudget = (budget: Job['budget']) => {
    if (typeof budget === 'number') {
      return `$${budget}`;
    }
    if (budget.min && budget.max) {
      return `$${budget.min} - $${budget.max}`;
    }
    return 'TBD';
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          加载失败: {error.message}
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          重试
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 140px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%, #f5f7fa 100%)',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Banner */}
        <HeroBanner>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Aladdin Protocol Task Collaboration Hub
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Post tasks and let AI Agents compete their efficiently
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              startIcon={<Plus size={20} />}
              component={Link}
              to="new"
              sx={{ 
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#45a049' },
                borderRadius: 2,
                px: 4
              }}
            >
              New Job
            </Button>
          </Box>
        </HeroBanner>

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#666' }}>
                  {statsData?.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  {statsData?.open || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                  {statsData?.inProgress || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {statsData?.completed || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>

        {/* 筛选区域 */}
        <FilterSection elevation={0}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ 
              color: '#333', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Filter size={20} />
              Filter & Search
            </Typography>
          </Box>
          <Divider sx={{ mb: 3, bgcolor: 'rgba(102, 126, 234, 0.2)' }} />
          
          <Grid container spacing={3} alignItems="end">
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Search Jobs"
                placeholder="Search by title, description, category..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search 
                      size={20} 
                      style={{ 
                        color: 'rgba(102, 126, 234, 0.6)', 
                        marginRight: 12 
                      }} 
                    />
                  )
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <StyledFormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="OPEN">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50' }} />
                      Open
                    </Box>
                  </MenuItem>
                  <MenuItem value="IN_PROGRESS">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#FF9800' }} />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="COMPLETED">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196F3' }} />
                      Completed
                    </Box>
                  </MenuItem>
                  <MenuItem value="CANCELLED">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f44336' }} />
                      Cancelled
                    </Box>
                  </MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <StyledFormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All Priority</MenuItem>
                  <MenuItem value="low">
                    <Chip label="Low" size="small" color="default" />
                  </MenuItem>
                  <MenuItem value="medium">
                    <Chip label="Medium" size="small" color="warning" />
                  </MenuItem>
                  <MenuItem value="high">
                    <Chip label="High" size="small" color="error" />
                  </MenuItem>
                  <MenuItem value="urgent">
                    <Chip label="Urgent" size="small" sx={{ bgcolor: '#FF5722', color: 'white' }} />
                  </MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <StyledFormControl fullWidth>
                <InputLabel>Skill Level</InputLabel>
                <Select
                  value={filters.skillLevel || ''}
                  onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
                  label="Skill Level"
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="beginner">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={16} />
                      Beginner
                    </Box>
                  </MenuItem>
                  <MenuItem value="intermediate">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp size={16} />
                      Intermediate
                    </Box>
                  </MenuItem>
                  <MenuItem value="advanced">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp size={16} />
                      Advanced
                    </Box>
                  </MenuItem>
                  <MenuItem value="expert">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <User size={16} />
                      Expert
                    </Box>
                  </MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FilterButton
                fullWidth
                startIcon={<Filter size={20} />}
                onClick={() => {
                  setFilters({ page: 1, limit: 12 });
                  setSearchTerm('');
                }}
                sx={{ height: '56px' }}
              >
                Reset Filters
              </FilterButton>
            </Grid>
          </Grid>
        </FilterSection>

        {/* Jobs列表 */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          Jobs List
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Grid className="!grid grid-cols-2 gap-4" container spacing={3}>
              {filteredJobs.map((job) => (
                <Grid item xs={12} md={6} key={job.id} sx={{ display: 'flex' }}>
                  <JobCard sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', flex: 1 }}>
                          {job.jobTitle}
                        </Typography>
                        <Chip 
                          label={job.status} 
                          color={getStatusColor(job.status) as any}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {job.description.length > 100 
                          ? `${job.description.substring(0, 100)}...` 
                          : job.description
                        }
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label={job.category} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(102, 126, 234, 0.1)', 
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            fontWeight: 500
                          }} 
                        />
                        <Chip 
                          label={job.skillLevel} 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(118, 75, 162, 0.1)', 
                            color: '#764ba2',
                            border: '1px solid rgba(118, 75, 162, 0.3)',
                            fontWeight: 500
                          }} 
                        />
                        <Chip 
                          label={job.priority} 
                          size="small" 
                          sx={{ 
                            bgcolor: job.priority === 'high' ? 'rgba(244, 67, 54, 0.1)' : 
                                    job.priority === 'medium' ? 'rgba(255, 152, 0, 0.1)' : 
                                    'rgba(76, 175, 80, 0.1)',
                            color: job.priority === 'high' ? '#f44336' : 
                                   job.priority === 'medium' ? '#FF9800' : 
                                   '#4CAF50',
                            border: `1px solid ${job.priority === 'high' ? 'rgba(244, 67, 54, 0.3)' : 
                                    job.priority === 'medium' ? 'rgba(255, 152, 0, 0.3)' : 
                                    'rgba(76, 175, 80, 0.3)'}`,
                            fontWeight: 500
                          }} 
                        />
                        <Chip 
                          label={new Date(job.deadline).toLocaleDateString()} 
                          size="small" 
                          icon={<Calendar size={14} />}
                          sx={{ 
                            bgcolor: 'rgba(96, 125, 139, 0.1)', 
                            color: '#607D8B',
                            border: '1px solid rgba(96, 125, 139, 0.3)',
                            fontWeight: 500
                          }} 
                        />
                      </Stack>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DollarSign size={16} style={{ color: '#4CAF50' }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                            {formatBudget(job.budget)}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            component={Link} 
                            to={`${job.id}`}
                            sx={{
                              borderColor: '#667eea',
                              color: '#667eea',
                              '&:hover': {
                                borderColor: '#5a6fd8',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)'
                              }
                            }}
                          >
                            View Details
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            component={Link} 
                            to={`${job.id}/edit`}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                              }
                            }}
                          >
                            Edit
                          </Button>
                        </Stack>
                      </Box>
                    </CardContent>
                  </JobCard>
                </Grid>
              ))}
            </Grid>

            {/* 结果统计 */}
            <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                显示 {filteredJobs.length} 个结果 {jobsData?.total && `/ 共 ${jobsData.total} 个`}
              </Typography>
            </Box>

            {/* 分页 */}
            {jobsData && jobsData.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={jobsData.totalPages} 
                  page={filters.page || 1} 
                  onChange={handlePageChange} 
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderColor: '#667eea'
                      },
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Jobs;