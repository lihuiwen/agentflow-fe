export interface Agent {
  /** 代理唯一标识符 */
  id: number;
  /** 代理名称 */
  name: string;
  /** 代理类别 */
  category: string;
  /** 评分 (1-5) */
  rating: number;
  /** 评价数量 */
  reviews: number;
  /** 代理描述 */
  description: string;
  /** 技能标签列表 */
  tags: string[];
  /** 价格 (USDT/月) */
  price: number;
  /** 代理状态 */
  status: string;
  /** 图标类型 */
  icon: string;
}

// API响应接口
export interface AgentsApiResponse {
  /** 代理列表 */
  agents: Agent[];
  /** 总数量 */
  total?: number;
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

// 分页参数接口
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
  /** 总数量 */
  total: number;
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

export interface CategoryData {
  id: string;
  title: string;
}