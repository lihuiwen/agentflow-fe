import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Alert, Button } from '@mui/material';
import JobService from '@apis/services/Job';
import { PrefetchKeys } from '@apis/queryKeys';
import { JobFilterParams } from '@apis/model/Job';
import JobHero from './components/JobHero';
import JobStats from './components/JobStats';
import JobFilters from './components/JobFilters';
import JobList from './components/JobList';

const Jobs: React.FC = () => {
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    limit: 12
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: jobsData, isLoading, error, refetch } = useQuery({
    queryKey: [PrefetchKeys.JOBS, filters],
    queryFn: () => JobService.getJobs(filters),
    staleTime: 5 * 60 * 1000,
  });

  const { data: statsData } = useQuery({
    queryKey: [PrefetchKeys.JOB_STATS],
    queryFn: () => JobService.getJobStats(),
    staleTime: 10 * 60 * 1000,
  });

  const handleFilterChange = (key: keyof JobFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({
      ...prev,
      page: 1
    }));
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchTerm('');
  };

  const filteredJobs = useMemo(() => {
    if (!jobsData?.data) return [];
    
    return jobsData.data.filter(job => {
      const matchesSearch = !searchTerm || 
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [jobsData?.data, searchTerm]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prev => ({ ...prev, page: value }));
  };


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full">
          <Alert severity="error" className="mb-6">
            加载失败: {error.message}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => refetch()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            重试
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航条 */}
      <div className="w-full h-1 bg-blue-600"></div>
      
      <Container maxWidth="xl" className="py-8">
        <JobHero />
        
        <JobStats statsData={statsData} />
        
        <JobFilters
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
        
        <JobList
          jobsData={jobsData}
          filteredJobs={filteredJobs}
          isLoading={isLoading}
          filters={filters}
          onPageChange={handlePageChange}
        />
      </Container>
    </div>
  );
};

export default Jobs;