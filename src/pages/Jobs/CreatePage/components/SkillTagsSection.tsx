import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  Box,
  Stack,
  Chip
} from '@mui/material';
import { Tag } from 'lucide-react';
import { SectionCard, StyledTextField } from '../styles';
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
    <SectionCard>
      <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tag size={20} />
        技能标签
      </Typography>
      
      <Grid container spacing={2} alignItems="end">
        <Grid item xs={12} md={8}>
          <StyledTextField
            fullWidth
            label="添加标签"
            placeholder="输入技能标签，如：React, Python, AI等"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            error={!!errors.tags && formData.tags.length === 0}
            helperText={errors.tags && formData.tags.length === 0 ? errors.tags : ''}
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
    </SectionCard>
  );
};

export default SkillTagsSection;