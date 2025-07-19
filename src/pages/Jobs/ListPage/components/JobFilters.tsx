import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Chip,
  Fade,
  Box
} from '@mui/material';
import { Search, Filter, User, TrendingUp, Star, Award, RotateCcw } from 'lucide-react';
import { JobFilterParams } from '@apis/model/Job';

interface JobFiltersProps {
  filters: JobFilterParams;
  searchTerm: string;
  onFilterChange: (key: keyof JobFilterParams, value: any) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  searchTerm,
  onFilterChange,
  onSearchChange,
  onReset
}) => {
  return (
    <Fade in={true} timeout={800}>
      <Card className="bg-white/95 backdrop-blur-sm border-0 rounded-3xl mb-8 shadow-xl shadow-gray-100/40">
        <CardContent className="p-6">
          {/* 标题区域 */}
          <Box className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Filter size={20} className="text-white" />
            </div>
            <Typography variant="h6" className="font-bold text-gray-800">
              筛选与搜索
            </Typography>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Typography variant="caption" className="text-green-700 font-medium">
                实时筛选
              </Typography>
            </div>
          </Box>
          
          {/* 筛选控件区域 */}
          <Grid container spacing={3} alignItems="end">
            {/* 搜索框 */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="搜索任务"
                placeholder="按标题、描述、分类搜索..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                variant="outlined"
                className="[&_.MuiOutlinedInput-root]:bg-gray-50/80 [&_.MuiOutlinedInput-root]:rounded-2xl [&_.MuiOutlinedInput-root]:border-2 [&_.MuiOutlinedInput-root]:border-gray-200 [&_.MuiOutlinedInput-root]:shadow-sm [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root:hover]:shadow-md [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600 [&_.MuiOutlinedInput-root.Mui-focused]:shadow-blue-200/30 [&_.MuiOutlinedInput-root]:transition-all [&_.MuiOutlinedInput-root]:duration-300"
                InputProps={{
                  startAdornment: (
                    <div className="p-2 bg-blue-50 rounded-xl mr-3 shadow-sm">
                      <Search size={18} className="text-blue-600" />
                    </div>
                  )
                }}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
                    color: '#4b5563'
                  },
                  minWidth: '200px'
                }}
              />
            </Grid>
            
            {/* 状态筛选 */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl 
                fullWidth 
                className="[&_.MuiOutlinedInput-root]:bg-gray-50/80 [&_.MuiOutlinedInput-root]:rounded-2xl [&_.MuiOutlinedInput-root]:border-2 [&_.MuiOutlinedInput-root]:border-gray-200 [&_.MuiOutlinedInput-root]:shadow-sm [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root:hover]:shadow-md [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600 [&_.MuiOutlinedInput-root.Mui-focused]:shadow-blue-200/30 [&_.MuiOutlinedInput-root]:transition-all [&_.MuiOutlinedInput-root]:duration-300"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
                    color: '#4b5563'
                  },
                  minWidth: '120px'
                }}
              >
                <InputLabel>状态</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  label="状态"
                >
                  <MenuItem value="">
                    <span className="text-gray-600 font-medium">全部状态</span>
                  </MenuItem>
                  <MenuItem value="OPEN">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm" />
                      <span className="font-medium">开放中</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="IN_PROGRESS">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm" />
                      <span className="font-medium">进行中</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="COMPLETED">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm" />
                      <span className="font-medium">已完成</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="CANCELLED">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-rose-500 shadow-sm" />
                      <span className="font-medium">已取消</span>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* 优先级筛选 */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl 
                fullWidth 
                className="[&_.MuiOutlinedInput-root]:bg-gray-50/80 [&_.MuiOutlinedInput-root]:rounded-2xl [&_.MuiOutlinedInput-root]:border-2 [&_.MuiOutlinedInput-root]:border-gray-200 [&_.MuiOutlinedInput-root]:shadow-sm [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root:hover]:shadow-md [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600 [&_.MuiOutlinedInput-root.Mui-focused]:shadow-blue-200/30 [&_.MuiOutlinedInput-root]:transition-all [&_.MuiOutlinedInput-root]:duration-300"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
                    color: '#4b5563'
                  },
                  minWidth: '130px'
                }}
              >
                <InputLabel>优先级</InputLabel>
                <Select
                  value={filters.priority || ''}
                  onChange={(e) => onFilterChange('priority', e.target.value)}
                  label="优先级"
                >
                  <MenuItem value="">
                    <span className="text-gray-600 font-medium">全部优先级</span>
                  </MenuItem>
                  <MenuItem value="low">
                    <div className="flex items-center gap-2">
                      <Chip 
                        label="低" 
                        size="small" 
                        className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 font-semibold" 
                      />
                      <span className="font-medium text-gray-700">低优先级</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="medium">
                    <div className="flex items-center gap-2">
                      <Chip 
                        label="中" 
                        size="small" 
                        className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-0 font-semibold" 
                      />
                      <span className="font-medium text-gray-700">中优先级</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="high">
                    <div className="flex items-center gap-2">
                      <Chip 
                        label="高" 
                        size="small" 
                        className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-0 font-semibold" 
                      />
                      <span className="font-medium text-gray-700">高优先级</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="urgent">
                    <div className="flex items-center gap-2">
                      <Chip 
                        label="急" 
                        size="small" 
                        className="bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-0 font-semibold" 
                      />
                      <span className="font-medium text-gray-700">紧急任务</span>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* 技能等级筛选 */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl 
                fullWidth 
                className="[&_.MuiOutlinedInput-root]:bg-gray-50/80 [&_.MuiOutlinedInput-root]:rounded-2xl [&_.MuiOutlinedInput-root]:border-2 [&_.MuiOutlinedInput-root]:border-gray-200 [&_.MuiOutlinedInput-root]:shadow-sm [&_.MuiOutlinedInput-root:hover]:border-blue-400 [&_.MuiOutlinedInput-root:hover]:shadow-md [&_.MuiOutlinedInput-root.Mui-focused]:border-blue-600 [&_.MuiOutlinedInput-root.Mui-focused]:shadow-blue-200/30 [&_.MuiOutlinedInput-root]:transition-all [&_.MuiOutlinedInput-root]:duration-300"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontWeight: 500,
                    color: '#4b5563'
                  },
                  minWidth: '120px'
                }}
              >
                <InputLabel>技能等级</InputLabel>
                <Select
                  value={filters.skillLevel || ''}
                  onChange={(e) => onFilterChange('skillLevel', e.target.value)}
                  label="技能等级"
                >
                  <MenuItem value="">
                    <span className="text-gray-600 font-medium">全部等级</span>
                  </MenuItem>
                  <MenuItem value="beginner">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-100 rounded-lg">
                        <User size={14} className="text-blue-600" />
                      </div>
                      <span className="font-medium">初级</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="intermediate">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-green-100 rounded-lg">
                        <TrendingUp size={14} className="text-green-600" />
                      </div>
                      <span className="font-medium">中级</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="advanced">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-orange-100 rounded-lg">
                        <Star size={14} className="text-orange-600" />
                      </div>
                      <span className="font-medium">高级</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="expert">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-purple-100 rounded-lg">
                        <Award size={14} className="text-purple-600" />
                      </div>
                      <span className="font-medium">专家</span>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* 重置按钮 */}
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                onClick={onReset}
                startIcon={<RotateCcw size={18} className="text-blue-600" />}
                variant="outlined"
                className="h-14 font-semibold rounded-2xl transform hover:scale-105 transition-all duration-300"
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
                  minWidth: '120px',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    color: '#2563eb',
                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1)',
                    transform: 'scale(1.05)',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  }
                }}
              >
                <span className="font-semibold text-sm">重置筛选</span>
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default JobFilters;