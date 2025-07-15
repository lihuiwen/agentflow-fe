// Category 相关的数据模型定义
export interface Category {
  id: string;
  title: string;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateCategoryRequest {
  title: string;
}