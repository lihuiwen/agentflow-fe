import React from 'react';
import { Card, CardContent, Typography, Zoom, Fade } from '@mui/material';
import { Target, Zap, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react';

interface JobStatsData {
  total?: number;
  open?: number;
  inProgress?: number;
  completed?: number;
}

interface JobStatsProps {
  statsData?: JobStatsData;
}

const JobStats: React.FC<JobStatsProps> = ({ statsData }) => {
  const stats = [
    { 
      label: '总任务数', 
      value: statsData?.total || 0, 
      icon: Target, 
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      shadowColor: 'shadow-blue-100/50',
      trend: '+12%',
      description: '平台总任务量'
    },
    { 
      label: '开放中', 
      value: statsData?.open || 0, 
      icon: Zap, 
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      shadowColor: 'shadow-emerald-100/50',
      trend: '+8%',
      description: '等待接取任务'
    },
    { 
      label: '进行中', 
      value: statsData?.inProgress || 0, 
      icon: Activity, 
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      shadowColor: 'shadow-amber-100/50',
      trend: '+15%',
      description: '正在执行任务'
    },
    { 
      label: '已完成', 
      value: statsData?.completed || 0, 
      icon: CheckCircle, 
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      shadowColor: 'shadow-purple-100/50',
      trend: '+22%',
      description: '成功完成任务'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {stats.map((stat, index) => (
        <Zoom in={true} timeout={600 + index * 200} key={index}>
          <Card className={`group bg-gradient-to-br ${stat.bgGradient} border-0 rounded-3xl hover:shadow-2xl ${stat.shadowColor} transition-all duration-500 transform hover:-translate-y-2 overflow-hidden`}>
            {/* 顶部装饰条 */}
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
            
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Typography variant="h2" className="font-black text-gray-800 group-hover:scale-110 transition-transform duration-300">
                      {stat.value.toLocaleString()}
                    </Typography>
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                      <TrendingUp size={12} className="text-green-600" />
                      <Typography variant="caption" className="text-green-700 font-semibold">
                        {stat.trend}
                      </Typography>
                    </div>
                  </div>
                  <Typography variant="h6" className="text-gray-700 font-bold mb-1">
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {stat.description}
                  </Typography>
                </div>
                
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                  <stat.icon size={32} className="text-white" />
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="caption" className="text-gray-600 font-medium">
                    月度目标进度
                  </Typography>
                  <Typography variant="caption" className="text-gray-600 font-bold">
                    {Math.min(100, Math.round((stat.value / (stat.value + 20)) * 100))}%
                  </Typography>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${Math.min(100, Math.round((stat.value / (stat.value + 20)) * 100))}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
              </div>
              
              {/* 底部状态指示器 */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`}></div>
                  <Typography variant="caption" className="text-gray-600">
                    实时更新
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-500 font-medium">
                  过去7天
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Zoom>
      ))}
    </div>
  );
};

export default JobStats;