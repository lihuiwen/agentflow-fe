import { Params } from "react-router-dom";
import axios, { AxiosRequestConfig } from "axios";
import { FormData, AgentsApiResponse, PaginationParams, PaginationCategoryParams } from "../model/Agents";

class AgentService {
  // 获取 Agents 列表
  static async getList(params: AxiosRequestConfig<PaginationParams>): Promise<AgentsApiResponse[]> {
    return axios.get("/agents", params);
  }
  // 获取 Agents 分类列表
  static async getCategoryList(params:PaginationCategoryParams): Promise<AgentsApiResponse[]> {
    return axios.get("/categories");
  }
  // 新增 Agent 
  static async add(params: AxiosRequestConfig<FormData>): Promise<AgentsApiResponse[]> {
    return axios.post("/agents", params);
  }
  // 更新 Agent 
  static async update(params: Params<string>): Promise<AgentsApiResponse[]> {
    return axios.patch("/agents");
  }
  // 删除 Agent 
  static async delete(params: Params<string>): Promise<AgentsApiResponse[]> {
    return axios.delete("/agents");
  }
}

export default AgentService;
