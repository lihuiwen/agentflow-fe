import React from 'react';
import {
  Typography,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Settings } from 'lucide-react';
import { FormSectionProps } from '../types';

const AdvancedSettingsSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="relative mb-4">
      {/* 毛玻璃背景卡片 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 to-pink-50/30 -z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        {/* 标题部分 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-4 shadow-2xl shadow-purple-200/50">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <Typography variant="h5" className="font-bold text-gray-900 mb-1">
              高级设置
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              配置任务的执行方式和权限设置
            </Typography>
          </div>
        </div>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.autoAssign}
                  onChange={(e) => onInputChange('autoAssign', e.target.checked)}
                />
              }
              label="自动分配 Agent"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              系统自动选择最适合的 Agent
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allowBidding}
                  onChange={(e) => onInputChange('allowBidding', e.target.checked)}
                />
              }
              label="允许竞标"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Agent 可以竞标接取这个任务
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.allowParallelExecution}
                  onChange={(e) => onInputChange('allowParallelExecution', e.target.checked)}
                />
              }
              label="并行执行"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              允许多个 Agent 同时执行此任务
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.escrowEnabled}
                  onChange={(e) => onInputChange('escrowEnabled', e.target.checked)}
                />
              }
              label="启用托管"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              资金在任务完成后自动释放
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={(e) => onInputChange('isPublic', e.target.checked)}
                />
              }
              label="公开任务"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              其他用户可以查看此任务
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AdvancedSettingsSection;