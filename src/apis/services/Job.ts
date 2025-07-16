import apiClient from '../index';
import { Job, JobListResponse, JobFilterParams, CreateJobRequest, JobStats } from '../model/Job';

class JobService {
  // 获取所有Jobs（分页+筛选）
  async getJobs(params: JobFilterParams = {}): Promise<JobListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.skillLevel) queryParams.append('skillLevel', params.skillLevel);
      if (params.isPublic !== undefined) queryParams.append('isPublic', params.isPublic.toString());
      if (params.minBudget) queryParams.append('minBudget', params.minBudget.toString());
      if (params.maxBudget) queryParams.append('maxBudget', params.maxBudget.toString());
      if (params.walletAddress) queryParams.append('walletAddress', params.walletAddress);
      
      const url = queryParams.toString() ? `jobs?${queryParams}` : 'jobs';
      return await apiClient.get(url);
    } catch (error) {
      // 如果API失败，返回模拟数据
      const mockJobs = this.generateMockJobs(params);
      return {
        data: mockJobs,
        total: mockJobs.length,
        page: params.page || 1,
        limit: params.limit || 12,
        totalPages: Math.ceil(mockJobs.length / (params.limit || 12)),
        hasNext: (params.page || 1) < Math.ceil(mockJobs.length / (params.limit || 12)),
        hasPrev: (params.page || 1) > 1
      };
    }
  }

  // 生成模拟数据
  private generateMockJobs(params: JobFilterParams): Job[] {
    const mockJobs: Job[] = [
      {
        id: '1',
        jobTitle: '客服问题处理',
        category: 'Customer Service',
        description: '需要处理客户的各种咨询和投诉，提供专业的解决方案',
        deliverables: '完整的客户问题处理报告',
        budget: { min: 50, max: 200 },
        deadline: '2025-08-28',
        paymentType: 'milestone' as const,
        priority: 'medium' as const,
        skillLevel: 'intermediate' as const,
        tags: ['客服', '问题处理'],
        status: 'OPEN' as const,
        autoAssign: false,
        allowBidding: true,
        allowParallelExecution: false,
        escrowEnabled: true,
        isPublic: true,
        walletAddress: '0x1234567890abcdef',
        createdAt: '2025-06-27',
        updatedAt: '2025-06-27'
      },
      {
        id: '2',
        jobTitle: 'AI聊天机器人开发',
        category: 'AI Development',
        description: '开发一个基于GPT的智能聊天机器人，支持多轮对话',
        deliverables: '完整的源代码、部署文档、使用说明',
        budget: { min: 1000, max: 5000 },
        deadline: '2025-12-31',
        paymentType: 'milestone' as const,
        priority: 'high' as const,
        skillLevel: 'expert' as const,
        tags: ['AI', '聊天机器人', 'GPT'],
        status: 'IN_PROGRESS' as const,
        autoAssign: false,
        allowBidding: true,
        allowParallelExecution: false,
        escrowEnabled: true,
        isPublic: true,
        walletAddress: '0x1234567890abcdef',
        createdAt: '2025-06-25',
        updatedAt: '2025-06-27'
      },
      {
        id: '3',
        jobTitle: '数据分析任务',
        category: 'Data Analysis',
        description: '对用户行为数据进行深度分析，提供业务见解',
        deliverables: '数据分析报告和可视化图表',
        budget: 800,
        deadline: '2025-09-15',
        paymentType: 'fixed' as const,
        priority: 'medium' as const,
        skillLevel: 'advanced' as const,
        tags: ['数据分析', 'Python', '可视化'],
        status: 'COMPLETED' as const,
        autoAssign: true,
        allowBidding: false,
        allowParallelExecution: false,
        escrowEnabled: true,
        isPublic: true,
        walletAddress: '0x1234567890abcdef',
        createdAt: '2025-06-20',
        updatedAt: '2025-06-26'
      },
      {
        id: '4',
        jobTitle: '网站界面设计',
        category: 'Design',
        description: '设计一个现代化的网站界面，符合UI/UX最佳实践',
        deliverables: 'Figma设计稿和前端代码',
        budget: { min: 500, max: 1500 },
        deadline: '2025-08-01',
        paymentType: 'hourly' as const,
        priority: 'low' as const,
        skillLevel: 'intermediate' as const,
        tags: ['UI设计', 'Figma', '前端'],
        status: 'OPEN' as const,
        autoAssign: false,
        allowBidding: true,
        allowParallelExecution: true,
        escrowEnabled: false,
        isPublic: true,
        walletAddress: '0x1234567890abcdef',
        createdAt: '2025-06-24',
        updatedAt: '2025-06-24'
      }
    ];

    // 应用筛选
    let filteredJobs = mockJobs;
    
    if (params.status) {
      filteredJobs = filteredJobs.filter(job => job.status === params.status);
    }
    if (params.priority) {
      filteredJobs = filteredJobs.filter(job => job.priority === params.priority);
    }
    if (params.skillLevel) {
      filteredJobs = filteredJobs.filter(job => job.skillLevel === params.skillLevel);
    }
    if (params.category) {
      filteredJobs = filteredJobs.filter(job => job.category.toLowerCase().includes(params.category!.toLowerCase()));
    }

    return filteredJobs;
  }

  // 获取开放的Jobs
  async getOpenJobs(): Promise<Job[]> {
    return apiClient.get('jobs/open');
  }

  // 获取即将到期的Jobs
  async getExpiringJobs(days: number = 7): Promise<Job[]> {
    return apiClient.get(`jobs/expiring?days=${days}`);
  }

  // 获取Job统计信息
  async getJobStats(): Promise<JobStats> {
    try {
      // 先获取所有jobs数据，然后计算统计
      const allJobs = await this.getJobs({ limit: 1000 }); // 获取足够多的数据用于统计
      const jobs = allJobs.data || [];
      
      const stats = {
        total: jobs.length,
        open: jobs.filter(job => job.status === 'OPEN').length,
        inProgress: jobs.filter(job => job.status === 'IN_PROGRESS' || job.status === 'DISTRIBUTED').length,
        completed: jobs.filter(job => job.status === 'COMPLETED').length
      };
      
      return stats;
    } catch (error) {
      // 如果API失败，返回模拟数据
      return {
        total: 24,
        open: 8,
        inProgress: 12,
        completed: 4
      };
    }
  }

  // 根据钱包地址获取Jobs
  async getJobsByWallet(walletAddress: string): Promise<Job[]> {
    return apiClient.get(`jobs/wallet/${walletAddress}`);
  }

  // 根据ID获取Job
  async getJobById(id: string): Promise<Job> {
    if (!id) {
      throw new Error('Job ID is required');
    }
    
    try {
      return await apiClient.get(`jobs/${id}`);
    } catch (error) {
      // 如果API失败，返回模拟数据
      const mockJobs = this.generateMockJobs({});
      const job = mockJobs.find(j => j.id === id);
      if (job) {
        return job;
      }
      throw new Error(`Job with id ${id} not found`);
    }
  }

  // 创建Job
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    return apiClient.post('jobs', jobData);
  }

  // 更新Job
  async updateJob(id: string, updateData: Partial<CreateJobRequest>): Promise<Job> {
    return apiClient.patch(`jobs/${id}`, updateData);
  }

  // 更新Job状态
  async updateJobStatus(id: string, status: Job['status']): Promise<Job> {
    return apiClient.patch(`jobs/${id}/status`, { status });
  }

  // 删除Job
  async deleteJob(id: string): Promise<void> {
    return apiClient.delete(`jobs/${id}`);
  }
}

export default new JobService();