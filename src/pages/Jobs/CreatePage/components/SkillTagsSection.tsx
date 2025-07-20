import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  Box,
  Stack,
  Chip,
  TextField
} from '@mui/material';
import { Tag } from 'lucide-react';
import { styles } from '../styles';
import { FormSectionProps } from '../types';

const SkillTagsSection: React.FC<FormSectionProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      onInputChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="relative mb-4">
      {/* 毛玻璃背景卡片 */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/30 -z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        
        {/* 标题部分 */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-4 shadow-2xl shadow-blue-200/50">
            <Tag size={24} className="text-white" />
          </div>
          <div>
            <Typography variant="h5" className="font-bold text-gray-900 mb-1">
              技能标签
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              添加相关的技能标签，帮助更好地匹配合适的 Agent
            </Typography>
          </div>
        </div>
        
        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="添加标签"
              placeholder="输入技能标签，如：React, Python, AI等"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              error={!!errors.tags && formData.tags.length === 0}
              helperText={errors.tags && formData.tags.length === 0 ? errors.tags : ''}
              className={`${styles.textField.root} ${styles.textField.inputHover} ${styles.textField.inputFocused}`}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              sx={{ height: '56px' }}
            >
              添加标签
            </Button>
          </Grid>
        </Grid>
        
        {formData.tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '1px solid rgba(102, 126, 234, 0.3)'
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </div>
    </div>
  );
};

export default SkillTagsSection;