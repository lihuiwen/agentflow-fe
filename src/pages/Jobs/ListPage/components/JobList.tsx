import React from 'react';
import { Typography, Pagination, CircularProgress } from '@mui/material';
import { Job, JobFilterParams } from '@/apis/model/Job';
import JobCard from './JobCard';
import JobEmptyState from './JobEmptyState';

interface JobListData {
  data: Job[];
  total?: number;
  totalPages?: number;
}

interface JobListProps {
  jobsData?: JobListData;
  filteredJobs: Job[];
  isLoading: boolean;
  filters: JobFilterParams;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobsData,
  filteredJobs,
  isLoading,
  filters,
  onPageChange
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="text-center">
          <div className="relative">
            <CircularProgress 
              size={64} 
              className="mb-6 text-blue-500" 
              thickness={3}
            />
            <div className="absolute inset-0 rounded-full bg-blue-50 opacity-20 animate-pulse"></div>
          </div>
          <Typography variant="h6" className="text-gray-700 font-medium">
            正在加载任务...
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-2">
            请稍候片刻
          </Typography>
        </div>
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return <JobEmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* 任务列表标题 - 圆润卡片样式 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                任务列表
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                共找到 {filteredJobs.length} 个任务
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-green-50 rounded-full px-4 py-2 border border-green-100">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-400 absolute top-0 animate-ping"></div>
            </div>
            <span className="text-sm font-medium text-green-700">实时更新</span>
          </div>
        </div>
      </div>

      {/* 任务卡片网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job, index) => (
          <div 
            key={job.id} 
            className="transform hover:scale-[1.02] transition-all duration-300 ease-out"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>

      {/* 底部统计和分页 */}
      <div className="space-y-6">
        {/* 结果统计 - 圆润样式 */}
        <div className="text-center">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <Typography variant="body2" className="text-gray-600 font-medium">
              显示 <span className="text-blue-600 font-semibold">{filteredJobs.length}</span> 个结果
              {jobsData?.total && (
                <span className="text-gray-400 ml-1">
                  / 共 <span className="text-gray-600 font-semibold">{jobsData.total}</span> 个任务
                </span>
              )}
            </Typography>
          </div>
        </div>

        {/* 分页 - 圆润样式 */}
        {jobsData && jobsData.totalPages && jobsData.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <Pagination
                count={jobsData.totalPages}
                page={filters.page || 1}
                onChange={onPageChange}
                color="primary"
                size="large"
                className="[&_.MuiPaginationItem-root]:bg-transparent [&_.MuiPaginationItem-root]:border-0 [&_.MuiPaginationItem-root]:rounded-xl [&_.MuiPaginationItem-root]:mx-1 [&_.MuiPaginationItem-root]:min-w-[44px] [&_.MuiPaginationItem-root]:h-[44px] [&_.MuiPaginationItem-root]:text-gray-600 [&_.MuiPaginationItem-root]:font-medium [&_.MuiPaginationItem-root:hover]:bg-blue-50 [&_.MuiPaginationItem-root:hover]:text-blue-600 [&_.MuiPaginationItem-root:hover]:scale-110 [&_.MuiPaginationItem-root.Mui-selected]:bg-gradient-to-r [&_.MuiPaginationItem-root.Mui-selected]:from-blue-500 [&_.MuiPaginationItem-root.Mui-selected]:to-blue-600 [&_.MuiPaginationItem-root.Mui-selected]:text-white [&_.MuiPaginationItem-root.Mui-selected]:shadow-lg [&_.MuiPaginationItem-root.Mui-selected]:shadow-blue-200 [&_.MuiPaginationItem-root.Mui-selected:hover]:from-blue-600 [&_.MuiPaginationItem-root.Mui-selected:hover]:to-blue-700 [&_.MuiPaginationItem-root]:transition-all [&_.MuiPaginationItem-root]:duration-200"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default JobList;