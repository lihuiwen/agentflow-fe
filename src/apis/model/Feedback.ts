// 反馈相关的数据模型定义

export interface Feedback {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5分评分
  comment: string;
  feedbackType: 'general' | 'quality' | 'communication' | 'timeline';
  isAnonymous: boolean;
  tags?: string[]; // 反馈标签
  createdAt: string;
  updatedAt: string;
  // 可选的额外评分维度
  dimensions?: {
    quality: number;      // 质量评分
    communication: number; // 沟通评分
    timeliness: number;   // 及时性评分
    professionalism: number; // 专业性评分
  };
  // 是否有用投票
  helpfulVotes?: {
    helpful: number;
    notHelpful: number;
    userVote?: 'helpful' | 'notHelpful' | null;
  };
}

export interface CreateFeedbackRequest {
  jobId: string;
  rating: number;
  comment: string;
  feedbackType?: 'general' | 'quality' | 'communication' | 'timeline';
  isAnonymous?: boolean;
  tags?: string[];
  dimensions?: {
    quality: number;
    communication: number;
    timeliness: number;
    professionalism: number;
  };
}

export interface FeedbackListResponse {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  // 统计信息
  stats: {
    averageRating: number;
    totalCount: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}

export interface FeedbackFilterParams {
  page?: number;
  limit?: number;
  rating?: number;
  feedbackType?: string;
  sortBy?: 'createdAt' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

export interface FeedbackStats {
  averageRating: number;
  totalFeedbacks: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  dimensionAverages?: {
    quality: number;
    communication: number;
    timeliness: number;
    professionalism: number;
  };
}