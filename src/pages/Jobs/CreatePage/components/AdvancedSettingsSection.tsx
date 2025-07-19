import React from 'react';
import {
  Typography,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Settings } from 'lucide-react';
import { SectionCard } from '../styles';
import { FormSectionProps } from '../types';

const AdvancedSettingsSection: React.FC<FormSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <SectionCard>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Settings size={20} />
        高级设置
      </Typography>
      
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
    </SectionCard>
  );
};

export default AdvancedSettingsSection;