import { Job } from '@apis/model/Job';

// 状态颜色配置
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN': return { bg: '#4CAF50', color: 'white' };
    case 'IN_PROGRESS': return { bg: '#FF9800', color: 'white' };
    case 'COMPLETED': return { bg: '#2196F3', color: 'white' };
    case 'CANCELLED': return { bg: '#f44336', color: 'white' };
    default: return { bg: '#9E9E9E', color: 'white' };
  }
};

// 优先级颜色配置
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return '#f44336';
    case 'high': return '#ff9800';
    case 'medium': return '#2196f3';
    case 'low': return '#4caf50';
    default: return '#9e9e9e';
  }
};

// 预算格式化
export const formatBudget = (budget: Job['budget']) => {
  if (typeof budget === 'number') {
    return `$${budget.toLocaleString()}`;
  }
  return `$${budget.min?.toLocaleString() || 0} - $${budget.max?.toLocaleString() || 0}`;
};

// 日期格式化
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 状态操作消息
export const getStatusMessage = (status: Job['status']) => {
  const statusMessages = {
    'OPEN': '任务已重新开放',
    'IN_PROGRESS': '任务已开始执行',
    'COMPLETED': '任务已标记为完成',
    'CANCELLED': '任务已取消',
    'DISTRIBUTED': '任务已分发',
    'EXPIRED': '任务已过期'
  };
  
  return statusMessages[status] || '状态更新成功';
};