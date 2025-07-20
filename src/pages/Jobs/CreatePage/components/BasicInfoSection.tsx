import React from 'react';
import {
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Box
} from '@mui/material';
import { Tag, FileText, Target, Settings } from 'lucide-react';
import { styles } from '../styles';
import { TextField, FormControl } from '@mui/material';
import { FormSectionProps, Category } from '../types';

interface BasicInfoSectionProps extends FormSectionProps {
  categories: Category[];
  categoriesLoading: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  errors,
  onInputChange,
  categories,
  categoriesLoading
}) => {
  return (
    <div className="relative mb-4">
      {/* 毛玻璃背景卡片 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/30 -z-10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        
        {/* 标题部分 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-4 shadow-2xl shadow-blue-200/50">
            <Tag size={24} className="text-white" />
          </div>
          <div>
            <Typography variant="h5" className="font-bold text-gray-900 mb-1">
              基本信息
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              填写任务的核心信息和要求
            </Typography>
          </div>
        </div>

        <Grid container spacing={4}>
          {/* 任务标题 */}
          <Grid item xs={12}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-blue-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  任务标题
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <div className="relative">
                <TextField
                  fullWidth
                  placeholder="请输入任务标题，如：开发一个 AI 聊天机器人"
                  value={formData.jobTitle}
                  onChange={(e) => onInputChange('jobTitle', e.target.value)}
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle}
                  className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '16px',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 8px 30px rgba(59, 130, 246, 0.15)',
                        borderColor: 'rgba(59, 130, 246, 0.5)',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </Grid>

          {/* 任务分类和技能等级 */}
          <Grid item xs={12} md={6}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Settings size={18} className="text-green-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  任务分类
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <FormControl 
                fullWidth 
                error={!!errors.category}
                className={`${styles.formControl.root} ${styles.formControl.inputHover} ${styles.formControl.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(34, 197, 94, 0.15)',
                      borderColor: 'rgba(34, 197, 94, 0.5)',
                    }
                  }
                }}
              >
                <Select
                  value={formData.category}
                  onChange={(e) => onInputChange('category', e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span className="text-gray-500">请选择分类</span>;
                    }
                    return selected;
                  }}
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        加载中...
                      </div>
                    </MenuItem>
                  ) : Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.title}>
                        {category.title}
                      </MenuItem>
                    ))
                  ) : (
                    [
                      { id: '1', title: 'AI Development', icon: '🤖' },
                      { id: '2', title: 'Web3 Development', icon: '⛓️' },
                      { id: '3', title: 'Data Analysis', icon: '📊' },
                      { id: '4', title: 'Customer Service', icon: '🎧' },
                      { id: '5', title: 'Design', icon: '🎨' },
                      { id: '6', title: 'Marketing', icon: '📈' }
                    ].map((category) => (
                      <MenuItem key={category.id} value={category.title}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          {category.title}
                        </div>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-purple-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  技能等级
                </Typography>
              </div>
              <FormControl 
                fullWidth
                className={`${styles.formControl.root} ${styles.formControl.inputHover} ${styles.formControl.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(147, 51, 234, 0.15)',
                      borderColor: 'rgba(147, 51, 234, 0.5)',
                    }
                  }
                }}
              >
                <Select
                  value={formData.skillLevel}
                  onChange={(e) => onInputChange('skillLevel', e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span className="text-gray-500">请选择等级</span>;
                    }
                    const levelMap = {
                      'beginner': '🌱 初级',
                      'intermediate': '🚀 中级', 
                      'advanced': '⭐ 高级',
                      'expert': '👑 专家'
                    };
                    return levelMap[selected as keyof typeof levelMap] || selected;
                  }}
                >
                  <MenuItem value="beginner">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">🌱</span>
                      初级
                    </div>
                  </MenuItem>
                  <MenuItem value="intermediate">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-500">🚀</span>
                      中级
                    </div>
                  </MenuItem>
                  <MenuItem value="advanced">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">⭐</span>
                      高级
                    </div>
                  </MenuItem>
                  <MenuItem value="expert">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">👑</span>
                      专家
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>

          {/* 任务描述 */}
          <Grid item xs={12}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-indigo-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  任务描述
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="详细描述您的任务需求、技术规格、期望结果等..."
                value={formData.description}
                onChange={(e) => onInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(99, 102, 241, 0.15)',
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                    }
                  }
                }}
              />
            </div>
          </Grid>

          {/* 交付物 */}
          <Grid item xs={12}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-orange-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  交付物
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="请列出您需要的交付物，如：源代码、文档、部署指南等..."
                value={formData.deliverables}
                onChange={(e) => onInputChange('deliverables', e.target.value)}
                error={!!errors.deliverables}
                helperText={errors.deliverables}
                className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(249, 115, 22, 0.15)',
                      borderColor: 'rgba(249, 115, 22, 0.5)',
                    }
                  }
                }}
              />
            </div>
          </Grid>
        </Grid>

        {/* 底部提示 */}
        <div className="mt-8 p-4 bg-blue-50/60 backdrop-blur-sm rounded-2xl border border-blue-100/50">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">💡</span>
            </div>
            <div>
              <Typography variant="body2" className="text-blue-800 font-medium mb-1">
                填写小贴士
              </Typography>
              <Typography variant="caption" className="text-blue-700">
                详细准确的信息有助于匹配到最合适的人才。建议包含具体的技术要求、项目规模和预期时间等关键信息。
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;