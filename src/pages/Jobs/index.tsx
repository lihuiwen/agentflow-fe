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
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { Plus, Search, Filter, TrendingUp, Calendar, DollarSign, User, Eye, Edit3, Zap, Clock, Target, MoreVertical } from 'lucide-react';
import JobService from '../../apis/services/Job';
import { PrefetchKeys } from '../../apis/queryKeys';
import { Job, JobFilterParams } from '../../apis/model/Job';

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

  // 获取状态样式（扁平化）
  const getStatusStyle = (status: Job['status']) => {
    switch (status) {
      case 'OPEN': 
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': 
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': 
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': 
        return 'bg-red-100 text-red-800';
      case 'EXPIRED': 
        return 'bg-gray-100 text-gray-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取优先级样式（扁平化）
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': 
        return 'bg-red-500 text-white';
      case 'high': 
        return 'bg-orange-500 text-white';
      case 'medium': 
        return 'bg-yellow-500 text-white';
      case 'low': 
        return 'bg-green-500 text-white';
      default: 
        return 'bg-gray-500 text-white';
    }
  };

  // 获取优先级边框颜色
  const getPriorityBorderColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-400';
      case 'high': return 'border-orange-400';
      case 'medium': return 'border-yellow-400';
      case 'low': return 'border-green-400';
      default: return 'border-gray-400';
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

  // 计算截止日期状态
  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', text: '已过期', color: 'text-red-600' };
    if (diffDays <= 3) return { status: 'urgent', text: `${diffDays}天`, color: 'text-red-500' };
    if (diffDays <= 7) return { status: 'warning', text: `${diffDays}天`, color: 'text-orange-500' };
    return { status: 'normal', text: `${diffDays}天`, color: 'text-green-600' };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full">
          <Alert severity="error" className="mb-6">
            加载失败: {error.message}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => refetch()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航条 */}
      <div className="w-full h-1 bg-blue-600"></div>
      
      <Container maxWidth="xl" className="py-8">
        {/* Hero Section - 扁平化设计 */}
        <div className="bg-blue-600 rounded-lg mb-8 overflow-hidden">
          <div className="px-8 py-12 text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Zap size={16} className="mr-2" />
              AI-Powered Task Platform
            </div>
            <Typography variant="h2" className="font-bold mb-4">
              Protocol
            </Typography>
            <Typography variant="h5" className="opacity-90 mb-8 max-w-2xl mx-auto">
              智能任务协作中心 - 发布任务，让 AI Agent 高效竞标完成
            </Typography>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                variant="contained" 
                size="large"
                startIcon={<Plus size={20} />}
                component={Link}
                to="new"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg px-8 py-3 font-semibold"
              >
                发布新任务
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                startIcon={<TrendingUp size={20} />}
                className="border-white/30 text-white hover:bg-white/10 rounded-lg px-8 py-3 font-semibold"
              >
                查看统计
              </Button>
            </div>
          </div>
        </div>

        {/* 统计卡片区域 - 扁平化 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: '总任务数', value: statsData?.total || 0, icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            { label: '开放中', value: statsData?.open || 0, icon: Zap, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            { label: '进行中', value: statsData?.inProgress || 0, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
            { label: '已完成', value: statsData?.completed || 0, icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
          ].map((stat, index) => (
            <Card key={index} className={`bg-white border-2 ${stat.borderColor} rounded-lg hover:border-opacity-80 transition-colors duration-200`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h3" className="font-bold text-gray-800 mb-1">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 font-medium">
                      {stat.label}
                    </Typography>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 筛选和搜索区域 - 扁平化 */}
        <Card className="bg-white border border-gray-200 rounded-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Filter size={20} className="text-white" />
              </div>
              <Typography variant="h6" className="font-bold text-gray-800">
                筛选与搜索
              </Typography>
            </div>
            
            <Grid container spacing={4} alignItems="end">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="搜索任务"
                  placeholder="按标题、描述、分类搜索..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="[&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600"
                  InputProps={{
                    startAdornment: (
                      <Search size={20} className="text-gray-400 mr-3" />
                    )
                  }}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth className="[&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600">
                  <InputLabel>状态</InputLabel>
                  <Select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="状态"
                  >
                    <MenuItem value="">全部状态</MenuItem>
                    <MenuItem value="OPEN">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        开放中
                      </div>
                    </MenuItem>
                    <MenuItem value="IN_PROGRESS">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        进行中
                      </div>
                    </MenuItem>
                    <MenuItem value="COMPLETED">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        已完成
                      </div>
                    </MenuItem>
                    <MenuItem value="CANCELLED">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        已取消
                      </div>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth className="[&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600">
                  <InputLabel>优先级</InputLabel>
                  <Select
                    value={filters.priority || ''}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    label="优先级"
                  >
                    <MenuItem value="">全部优先级</MenuItem>
                    <MenuItem value="low">
                      <Chip label="低" size="small" className="bg-green-100 text-green-800" />
                    </MenuItem>
                    <MenuItem value="medium">
                      <Chip label="中" size="small" className="bg-yellow-100 text-yellow-800" />
                    </MenuItem>
                    <MenuItem value="high">
                      <Chip label="高" size="small" className="bg-orange-100 text-orange-800" />
                    </MenuItem>
                    <MenuItem value="urgent">
                      <Chip label="紧急" size="small" className="bg-red-100 text-red-800" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth className="[&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:rounded-lg [&_.MuiOutlinedInput-root]:border-gray-300 [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600">
                  <InputLabel>技能等级</InputLabel>
                  <Select
                    value={filters.skillLevel || ''}
                    onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
                    label="技能等级"
                  >
                    <MenuItem value="">全部等级</MenuItem>
                    <MenuItem value="beginner">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        初级
                      </div>
                    </MenuItem>
                    <MenuItem value="intermediate">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} />
                        中级
                      </div>
                    </MenuItem>
                    <MenuItem value="advanced">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} />
                        高级
                      </div>
                    </MenuItem>
                    <MenuItem value="expert">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        专家
                      </div>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  startIcon={<Filter size={20} />}
                  onClick={() => {
                    setFilters({ page: 1, limit: 12 });
                    setSearchTerm('');
                  }}
                  className="h-14 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
                >
                  重置筛选
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 任务列表标题 */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-bold text-gray-800">
            任务列表 ({filteredJobs.length})
          </Typography>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded bg-green-500"></div>
            <span>实时更新</span>
          </div>
        </div>

        {/* 任务卡片列表 - 扁平化设计 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <CircularProgress size={60} className="mb-4" />
              <Typography variant="h6" className="text-gray-600">
                正在加载任务...
              </Typography>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {filteredJobs.map((job) => {
                const deadlineStatus = getDeadlineStatus(job.deadline);
                return (
                  <Card key={job.id} className={`group bg-white border-l-4 ${getPriorityBorderColor(job.priority)} border-r border-t border-b border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200`}>
                    <CardContent className="p-6">
                      {/* 标题和状态 */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-4">
                          <Typography variant="h6" className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            {job.jobTitle}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600 leading-relaxed">
                            {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
                          </Typography>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Chip 
                            label={job.status === 'OPEN' ? '开放中' : job.status === 'IN_PROGRESS' ? '进行中' : job.status === 'COMPLETED' ? '已完成' : job.status === 'CANCELLED' ? '已取消' : '已过期'}
                            size="small"
                            className={`${getStatusStyle(job.status)} font-medium`}
                          />
                          <Tooltip title="更多操作">
                            <IconButton size="small" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <MoreVertical size={16} />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>

                      {/* 标签区域 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Chip 
                          label={job.category} 
                          size="small" 
                          className="bg-blue-50 text-blue-700 font-medium"
                        />
                        <Chip 
                          label={job.skillLevel === 'beginner' ? '初级' : job.skillLevel === 'intermediate' ? '中级' : job.skillLevel === 'advanced' ? '高级' : '专家'} 
                          size="small" 
                          className="bg-purple-50 text-purple-700 font-medium"
                        />
                        <Chip 
                          label={job.priority === 'low' ? '低优先级' : job.priority === 'medium' ? '中优先级' : job.priority === 'high' ? '高优先级' : '紧急'}
                          size="small" 
                          className={`${getPriorityStyle(job.priority)} font-medium`}
                        />
                      </div>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} className="text-green-600" />
                            <Typography variant="h6" className="font-bold text-green-600">
                              {formatBudget(job.budget)}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} className={deadlineStatus.color} />
                            <Typography variant="body2" className={`font-medium ${deadlineStatus.color}`}>
                              剩余 {deadlineStatus.text}
                            </Typography>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Tooltip title="查看详情">
                            <Button 
                              size="small" 
                              variant="outlined" 
                              component={Link} 
                              to={`${job.id}`}
                              className="border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 rounded-lg min-w-0 px-3"
                            >
                              <Eye size={16} />
                            </Button>
                          </Tooltip>
                          <Tooltip title="编辑任务">
                            <Button 
                              size="small" 
                              variant="contained" 
                              component={Link} 
                              to={`${job.id}/edit`}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg min-w-0 px-3"
                            >
                              <Edit3 size={16} />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 空状态 */}
            {filteredJobs.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <Typography variant="h6" className="text-gray-600 mb-2">
                  暂无匹配的任务
                </Typography>
                <Typography variant="body2" className="text-gray-500 mb-6">
                  尝试调整筛选条件或发布新任务
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Plus size={20} />}
                  component={Link}
                  to="new"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3"
                >
                  发布新任务
                </Button>
              </div>
            )}

            {/* 底部统计和分页 */}
            {filteredJobs.length > 0 && (
              <div className="mt-8">
                {/* 结果统计 */}
                <div className="text-center mb-6">
                  <Typography variant="body2" className="text-gray-600 bg-white border border-gray-200 inline-block px-4 py-2 rounded-lg">
                    显示 {filteredJobs.length} 个结果 {jobsData?.total && `/ 共 ${jobsData.total} 个任务`}
                  </Typography>
                </div>

                {/* 分页 */}
                {jobsData && jobsData.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination 
                      count={jobsData.totalPages} 
                      page={filters.page || 1} 
                      onChange={handlePageChange} 
                      color="primary"
                      size="large"
                      className="[&_.MuiPaginationItem-root]:bg-white [&_.MuiPaginationItem-root]:border [&_.MuiPaginationItem-root]:border-gray-300 [&_.MuiPaginationItem-root]:rounded-lg [&_.MuiPaginationItem-root:hover]:bg-blue-50 [&_.MuiPaginationItem-root:hover]:border-blue-400 [&_.MuiPaginationItem-root.Mui-selected]:bg-blue-600 [&_.MuiPaginationItem-root.Mui-selected]:text-white [&_.MuiPaginationItem-root.Mui-selected]:border-blue-600 [&_.MuiPaginationItem-root.Mui-selected:hover]:bg-blue-700 [&_.MuiPaginationItem-root]:transition-colors [&_.MuiPaginationItem-root]:duration-200"
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Jobs;