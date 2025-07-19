import { Job } from '@/apis/model/Job';

export const getStatusColor = (status: Job['status']) => {
  switch (status) {
    case 'OPEN': return 'success';
    case 'IN_PROGRESS': return 'warning';
    case 'COMPLETED': return 'info';
    case 'CANCELLED': return 'error';
    case 'EXPIRED': return 'default';
    default: return 'default';
  }
};

export const getStatusStyle = (status: Job['status']) => {
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

export const getPriorityStyle = (priority: string) => {
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

export const getPriorityBorderColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'border-red-400';
    case 'high': return 'border-orange-400';
    case 'medium': return 'border-yellow-400';
    case 'low': return 'border-green-400';
    default: return 'border-gray-400';
  }
};

export const formatBudget = (budget: Job['budget']) => {
  if (typeof budget === 'number') {
    return `$${budget}`;
  }
  if (budget.min && budget.max) {
    return `$${budget.min} - $${budget.max}`;
  }
  return 'TBD';
};

export const getDeadlineStatus = (deadline: string) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { status: 'expired', text: '已过期', color: 'text-red-600' };
  if (diffDays <= 3) return { status: 'urgent', text: `${diffDays}天`, color: 'text-red-500' };
  if (diffDays <= 7) return { status: 'warning', text: `${diffDays}天`, color: 'text-orange-500' };
  return { status: 'normal', text: `${diffDays}天`, color: 'text-green-600' };
};

export const getStatusDisplayText = (status: Job['status']) => {
  switch (status) {
    case 'OPEN': return '开放中';
    case 'IN_PROGRESS': return '进行中';
    case 'COMPLETED': return '已完成';
    case 'CANCELLED': return '已取消';
    case 'EXPIRED': return '已过期';
    default: return status;
  }
};

export const getSkillLevelText = (skillLevel: string) => {
  switch (skillLevel) {
    case 'beginner': return '初级';
    case 'intermediate': return '中级';
    case 'advanced': return '高级';
    case 'expert': return '专家';
    default: return skillLevel;
  }
};

export const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'low': return '低优先级';
    case 'medium': return '中优先级';
    case 'high': return '高优先级';
    case 'urgent': return '紧急';
    default: return priority;
  }
};