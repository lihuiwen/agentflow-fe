import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Chip,
  Typography,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { Calendar, DollarSign, Eye, Edit3, MoreVertical } from 'lucide-react';
import { Job } from '@apis/model/Job';
import {
  getStatusStyle,
  getPriorityBorderColor,
  getPriorityStyle,
  formatBudget,
  getDeadlineStatus,
  getStatusDisplayText,
  getSkillLevelText,
  getPriorityText
} from '../utils/jobUtils';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const deadlineStatus = getDeadlineStatus(job.deadline);

  return (
    <Card className={`group bg-white border-l-4 ${getPriorityBorderColor(job.priority)} border-r border-t border-b border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200`}>
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
              label={getStatusDisplayText(job.status)}
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
            label={getSkillLevelText(job.skillLevel)} 
            size="small" 
            className="bg-purple-50 text-purple-700 font-medium"
          />
          <Chip 
            label={getPriorityText(job.priority)}
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
};

export default JobCard;