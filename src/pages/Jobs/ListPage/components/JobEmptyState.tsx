import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import { Search, Plus } from 'lucide-react';

const JobEmptyState: React.FC = () => {
  return (
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
  );
};

export default JobEmptyState;