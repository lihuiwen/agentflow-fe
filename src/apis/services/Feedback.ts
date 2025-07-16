import apiClient from '../index';
import { 
  Feedback, 
  CreateFeedbackRequest, 
  FeedbackListResponse, 
  FeedbackFilterParams,
  FeedbackStats 
} from '../model/Feedback';

class FeedbackService {
  // 获取Job的反馈列表
  async getFeedbacksByJobId(jobId: string, params: FeedbackFilterParams = {}): Promise<FeedbackListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.rating) queryParams.append('rating', params.rating.toString());
      if (params.feedbackType) queryParams.append('feedbackType', params.feedbackType);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = queryParams.toString() ? 
        `jobs/${jobId}/feedbacks?${queryParams}` : 
        `jobs/${jobId}/feedbacks`;
      
      return await apiClient.get(url);
    } catch (error) {
      // 如果API失败，返回模拟数据
      return this.generateMockFeedbacks(jobId, params);
    }
  }

  // 创建新反馈
  async createFeedback(feedbackData: CreateFeedbackRequest): Promise<Feedback> {
    try {
      return await apiClient.post(`jobs/${feedbackData.jobId}/feedbacks`, feedbackData);
    } catch (error) {
      // 如果API失败，返回模拟的新反馈
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        jobId: feedbackData.jobId,
        userId: 'current-user',
        userName: '当前用户',
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        feedbackType: feedbackData.feedbackType || 'general',
        isAnonymous: feedbackData.isAnonymous || false,
        tags: feedbackData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dimensions: feedbackData.dimensions,
        helpfulVotes: {
          helpful: 0,
          notHelpful: 0,
          userVote: null
        }
      };
      return newFeedback;
    }
  }

  // 获取反馈统计
  async getFeedbackStats(jobId: string): Promise<FeedbackStats> {
    try {
      return await apiClient.get(`jobs/${jobId}/feedbacks/stats`);
    } catch (error) {
      // 如果API失败，返回模拟统计数据
      return {
        averageRating: 4.2,
        totalFeedbacks: 8,
        ratingDistribution: {
          5: 3,
          4: 3,
          3: 1,
          2: 1,
          1: 0
        },
        dimensionAverages: {
          quality: 4.3,
          communication: 4.1,
          timeliness: 3.9,
          professionalism: 4.4
        }
      };
    }
  }

  // 对反馈投票（有用/无用）
  async voteFeedback(feedbackId: string, vote: 'helpful' | 'notHelpful'): Promise<Feedback> {
    try {
      return await apiClient.post(`feedbacks/${feedbackId}/vote`, { vote });
    } catch (error) {
      throw new Error('投票失败，请重试');
    }
  }

  // 删除反馈（仅作者可删除）
  async deleteFeedback(feedbackId: string): Promise<void> {
    try {
      await apiClient.delete(`feedbacks/${feedbackId}`);
    } catch (error) {
      throw new Error('删除反馈失败，请重试');
    }
  }

  // 生成模拟反馈数据
  private generateMockFeedbacks(jobId: string, params: FeedbackFilterParams): FeedbackListResponse {
    const mockFeedbacks: Feedback[] = [
      {
        id: '1',
        jobId,
        userId: 'user1',
        userName: '张三',
        rating: 5,
        comment: '工作完成得非常好，超出预期！Agent的响应速度很快，代码质量也很高。',
        feedbackType: 'quality',
        isAnonymous: false,
        tags: ['高质量', '及时响应', '专业'],
        createdAt: '2025-01-10T10:30:00.000Z',
        updatedAt: '2025-01-10T10:30:00.000Z',
        dimensions: {
          quality: 5,
          communication: 5,
          timeliness: 4,
          professionalism: 5
        },
        helpfulVotes: {
          helpful: 3,
          notHelpful: 0,
          userVote: null
        }
      },
      {
        id: '2',
        jobId,
        userId: 'user2',
        userName: '李四',
        rating: 4,
        comment: '整体质量不错，但交付时间稍晚于预期。希望下次能够更好地控制时间。',
        feedbackType: 'timeline',
        isAnonymous: false,
        tags: ['质量好', '时间管理'],
        createdAt: '2025-01-09T15:20:00.000Z',
        updatedAt: '2025-01-09T15:20:00.000Z',
        dimensions: {
          quality: 4,
          communication: 4,
          timeliness: 3,
          professionalism: 4
        },
        helpfulVotes: {
          helpful: 2,
          notHelpful: 1,
          userVote: null
        }
      },
      {
        id: '3',
        jobId,
        userId: 'user3',
        userName: '王五',
        rating: 5,
        comment: '沟通非常顺畅，Agent能够准确理解需求并提供有效的解决方案。',
        feedbackType: 'communication',
        isAnonymous: false,
        tags: ['沟通顺畅', '理解到位'],
        createdAt: '2025-01-08T09:15:00.000Z',
        updatedAt: '2025-01-08T09:15:00.000Z',
        dimensions: {
          quality: 5,
          communication: 5,
          timeliness: 5,
          professionalism: 5
        },
        helpfulVotes: {
          helpful: 4,
          notHelpful: 0,
          userVote: null
        }
      },
      {
        id: '4',
        jobId,
        userId: 'user4',
        userName: '匿名用户',
        rating: 3,
        comment: '基本满足要求，但还有改进空间。建议加强细节处理。',
        feedbackType: 'general',
        isAnonymous: true,
        tags: ['基本满足', '待改进'],
        createdAt: '2025-01-07T14:45:00.000Z',
        updatedAt: '2025-01-07T14:45:00.000Z',
        dimensions: {
          quality: 3,
          communication: 3,
          timeliness: 4,
          professionalism: 3
        },
        helpfulVotes: {
          helpful: 1,
          notHelpful: 2,
          userVote: null
        }
      }
    ];

    // 应用筛选
    let filteredFeedbacks = mockFeedbacks;
    if (params.rating) {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.rating === params.rating);
    }
    if (params.feedbackType) {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.feedbackType === params.feedbackType);
    }

    // 应用排序
    if (params.sortBy) {
      filteredFeedbacks.sort((a, b) => {
        let aValue, bValue;
        switch (params.sortBy) {
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'helpful':
            aValue = (a.helpfulVotes?.helpful || 0) - (a.helpfulVotes?.notHelpful || 0);
            bValue = (b.helpfulVotes?.helpful || 0) - (b.helpfulVotes?.notHelpful || 0);
            break;
          case 'createdAt':
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
        }
        
        if (params.sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    // 分页
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

    // 计算统计信息
    const totalCount = filteredFeedbacks.length;
    const averageRating = totalCount > 0 ? 
      filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalCount : 0;
    
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredFeedbacks.forEach(f => {
      ratingDistribution[f.rating as keyof typeof ratingDistribution]++;
    });

    return {
      data: paginatedFeedbacks,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page < Math.ceil(totalCount / limit),
      hasPrev: page > 1,
      stats: {
        averageRating,
        totalCount,
        ratingDistribution
      }
    };
  }
}

export default new FeedbackService();