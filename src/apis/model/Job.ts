// Job 相关的数据模型定义
export interface Job {
  id: string;
  jobTitle: string;
  category: string;
  description: string;
  deliverables: string;
  budget: {
    min?: number;
    max?: number;
  } | number;
  maxBudget?: number;
  deadline: string;
  paymentType: 'fixed' | 'hourly' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  status: 'OPEN' | 'DISTRIBUTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  autoAssign: boolean;
  allowBidding: boolean;
  allowParallelExecution: boolean;
  escrowEnabled: boolean;
  isPublic: boolean;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
}

export interface JobListResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface JobFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  skillLevel?: string;
  isPublic?: boolean;
  minBudget?: number;
  maxBudget?: number;
  walletAddress?: string;
}

export interface CreateJobRequest {
  jobTitle: string;
  category: string;
  description: string;
  deliverables: string;
  budget: { min: number; max: number };
  minBudget?: number; // 对应前端 minBudget
  maxBudget?: number;
  deadline: string;
  paymentType: 'fixed' | 'hourly' | 'milestone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  autoAssign?: boolean;
  allowBidding?: boolean;
  allowParallelExecution?: boolean;
  escrowEnabled?: boolean;
  isPublic?: boolean;
  walletAddress: string;
}