// 通用响应结构
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// API响应接口
export interface AgentsApiResponse {
  data?: Agent[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}
export interface Agent {
  id?: string;
  agentName?: string;
  agentAddress?: string;
  description?: string;
  authorBio?: string;
  agentClassification?: string;
  tags?: string[];
  isPrivate?: boolean;
  autoAcceptJobs?: boolean;
  contractType?: string;
  isActive?: boolean;
  reputation?: number;
  successRate?: number;
  totalJobsCompleted?: number;
  createdAt?: Date;
  updatedAt?: Date;
  walletAddress?: string;
  isFree: boolean;
  price?: number;
}

// 分页参数接口
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

// 搜索过滤参数接口
export interface AgentFilterParams {
  /** 搜索关键词 */
  keyword?: string;
  /** 类别筛选 */
  category?: string;
  /** 最低评分 */
  minRating?: number;
  /** 价格范围 */
  priceRange?: {
    min: number;
    max: number;
  };
  /** 标签筛选 */
  tags?: string[];
  /** 状态筛选 */
  status?: string;
}

// 排序参数接口
export interface SortParams {
  /** 排序字段 */
  field: 'rating' | 'reviews' | 'price' | 'name';
  /** 排序方向 */
  direction: 'asc' | 'desc';
}

// 完整的查询参数接口
export interface AgentQueryParams extends PaginationParams {
  /** 过滤条件 */
  filters?: AgentFilterParams;
  /** 排序参数 */
  sort?: SortParams;
}

// API错误响应接口
export interface ApiError {
  /** 错误码 */
  code: string;
  /** 错误信息 */
  message: string;
  /** 详细错误信息 */
  details?: any;
}

// 组件Props接口
export interface AgentCardProps {
  /** 代理数据 */
  agent: Agent;
  /** 点击事件 */
  onClick?: (agent: Agent) => void;
  /** 是否显示详细信息 */
  showDetails?: boolean;
}

export interface IAgentDetail {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  description: string;
  contractType: string;
  tags: string[];
  pricing: {
    type: 'free' | 'paid';
    amount?: number;
    description: string;
  };
  badge?: string;
}

export interface FormData {
  agentName: string;
  agentClassification: string;
  agentAddress: string;
  tags: string[];
  autoAcceptJobs: boolean;
  description: string;
  authorBio: string;
  isFree: boolean;
  price: number;
  walletAddress: string;
}

export interface FormErrors {
  agentName?: string;
  agentClassification?: string;
  agentAddress?: string;
  description?: string;
  authorBio?: string;
}

// 分页参数接口-分类
export interface PaginationCategoryParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  limit: number;
}

// 分类接口
export interface CategoryDataRes {
  data?: CategoryData[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}
export interface CategoryData {
  id: string;
  title: string;
}
