import React from 'react';
import {
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  FormControl
} from '@mui/material';
import { DollarSign, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { styles } from '../styles';
import { FormSectionProps } from '../types';

const BudgetTimeSection: React.FC<FormSectionProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="relative mb-4">
      {/* 毛玻璃背景卡片 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-blue-50/30 -z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        {/* 标题部分 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-4 shadow-2xl shadow-emerald-200/50">
            <DollarSign size={24} className="text-white" />
          </div>
          <div>
            <Typography variant="h5" className="font-bold text-gray-900 mb-1">
              预算和时间
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              设置项目预算、支付方式和时间安排
            </Typography>
          </div>
        </div>

        <Grid container spacing={4}>
          {/* 最小预算 */}
          <Grid item xs={12} md={4}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  最小预算 (USDT)
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <TextField
                fullWidth
                type="number"
                placeholder="1000"
                value={formData.budget.min || ''}
                onChange={(e) => onInputChange('budget', { 
                  ...formData.budget, 
                  min: Number(e.target.value) 
                })}
                error={!!errors.budgetMin}
                helperText={errors.budgetMin}
                InputProps={{ inputProps: { min: 0 } }}
                className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
                      borderColor: 'rgba(16, 185, 129, 0.5)',
                    }
                  }
                }}
              />
            </div>
          </Grid>
          
          {/* 最大预算 */}
          <Grid item xs={12} md={4}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  最大预算 (USDT)
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <TextField
                fullWidth
                type="number"
                placeholder="5000"
                value={formData.budget.max || ''}
                onChange={(e) => onInputChange('budget', { 
                  ...formData.budget, 
                  max: Number(e.target.value) 
                })}
                error={!!errors.budgetMax}
                helperText={errors.budgetMax}
                InputProps={{ inputProps: { min: 0 } }}
                className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
                      borderColor: 'rgba(16, 185, 129, 0.5)',
                    }
                  }
                }}
              />
            </div>
          </Grid>

          {/* 支付类型 */}
          <Grid item xs={12} md={4}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  支付类型
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
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(59, 130, 246, 0.15)',
                      borderColor: 'rgba(59, 130, 246, 0.5)',
                    }
                  }
                }}
              >
                <Select
                  value={formData.paymentType || ''}
                  onChange={(e) => onInputChange('paymentType', e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span className="text-gray-500">请选择支付方式</span>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="fixed">固定价格</MenuItem>
                  <MenuItem value="hourly">按小时计费</MenuItem>
                  <MenuItem value="milestone">里程碑付款</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>

          {/* 截止日期 */}
          <Grid item xs={12} md={6}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-purple-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  截止日期
                </Typography>
                <span className="text-red-500 text-sm">*</span>
              </div>
              <TextField
                fullWidth
                type="date"
                value={formData.deadline}
                onChange={(e) => onInputChange('deadline', e.target.value)}
                error={!!errors.deadline}
                helperText={errors.deadline}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(147, 51, 234, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(147, 51, 234, 0.15)',
                      borderColor: 'rgba(147, 51, 234, 0.5)',
                    }
                  }
                }}
              />
            </div>
          </Grid>

          {/* 优先级 */}
          <Grid item xs={12} md={6}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-orange-500" />
                <Typography variant="subtitle1" className="font-semibold text-gray-800">
                  优先级
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
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      boxShadow: '0 4px 20px rgba(249, 115, 22, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 30px rgba(249, 115, 22, 0.15)',
                      borderColor: 'rgba(249, 115, 22, 0.5)',
                    }
                  }
                }}
              >
                <Select
                  value={formData.priority || ''}
                  onChange={(e) => onInputChange('priority', e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span className="text-gray-500">请选择优先级</span>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="low">低优先级</MenuItem>
                  <MenuItem value="medium">中优先级</MenuItem>
                  <MenuItem value="high">高优先级</MenuItem>
                  <MenuItem value="urgent">紧急</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default BudgetTimeSection;