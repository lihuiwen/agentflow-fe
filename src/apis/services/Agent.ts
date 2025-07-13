import apiClient from "../index";
import axios, { AxiosRequestConfig } from "axios";
import { AgentsApiResponse, PaginationParams, PaginationCategoryParams } from "../model/Agents";

class AgentService {
  // 获取 Agents 列表
  static async getList(page: number, pageSize: number): Promise<AgentsApiResponse> {
    return apiClient.get("/agents?page=" + page + "&limit=" + pageSize);
  }
}

export default AgentService;
