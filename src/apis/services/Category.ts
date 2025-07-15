import apiClient from '../index';
import { Category, CategoryListResponse, CreateCategoryRequest } from '../model/Category';

class CategoryService {
  // 获取所有分类
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get('categories');
      // 后台返回的是分页格式: { data: Category[], total, page, ... }
      // 我们只需要 data 数组
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      // 如果响应格式不是预期的分页格式，直接返回（可能是简单数组）
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('⚠️ CategoryService: API 调用失败，使用模拟数据', error);
      console.warn('   这可能是由于HTTP代理设置导致的，请检查网络配置');
      
      // 返回模拟数据
      return [
        { id: '1', title: 'AI Development' },
        { id: '2', title: 'Web3 Development' },
        { id: '3', title: 'Data Analysis' },
        { id: '4', title: 'Customer Service' },
        { id: '5', title: 'Design' },
        { id: '6', title: 'Marketing' },
        { id: '7', title: 'Content Writing' },
        { id: '8', title: 'Translation' }
      ];
    }
  }

  // 获取分页分类
  async getCategoriesPaginated(page = 1, limit = 10): Promise<CategoryListResponse> {
    try {
      return await apiClient.get(`categories?page=${page}&limit=${limit}`);
    } catch (error) {
      const mockCategories = await this.getCategories();
      return {
        data: mockCategories,
        total: mockCategories.length,
        page,
        limit,
        totalPages: Math.ceil(mockCategories.length / limit),
        hasNext: page < Math.ceil(mockCategories.length / limit),
        hasPrev: page > 1
      };
    }
  }

  // 创建分类
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    return apiClient.post('categories', categoryData);
  }

  // 更新分类
  async updateCategory(id: string, title: string): Promise<Category> {
    return apiClient.patch(`categories/${id}`, { title });
  }

  // 删除分类
  async deleteCategory(id: string): Promise<void> {
    return apiClient.delete(`categories/${id}`);
  }

  // 根据ID获取分类
  async getCategoryById(id: string): Promise<Category> {
    return apiClient.get(`categories/${id}`);
  }
}

export default new CategoryService();