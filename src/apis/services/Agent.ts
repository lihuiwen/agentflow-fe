import apiClient from "../index";
import axios, { AxiosRequestConfig } from "axios";
import { AgentsApiResponse, PaginationParams, PaginationCategoryParams, Agent } from "../model/Agents";

class AgentService {
  // 获取 Agents 列表
  static async getList(page: number = 1, pageSize: number = 10): Promise<AgentsApiResponse> {
    try {
      const response = await apiClient.get(`/agents?page=${page}&limit=${pageSize}`);
      return response;
    } catch (error) {
      // 如果API失败，返回模拟数据
      const mockAgents = this.generateMockAgents();
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedAgents = mockAgents.slice(startIndex, endIndex);
      
      return {
        data: paginatedAgents,
        total: mockAgents.length,
        page,
        limit: pageSize,
        totalPages: Math.ceil(mockAgents.length / pageSize),
        hasNext: page < Math.ceil(mockAgents.length / pageSize),
        hasPrev: page > 1
      };
    }
  }

  // 根据Job ID获取相关的Agents
  static async getAgentsByJobId(jobId: string): Promise<Agent[]> {
    try {
      return await apiClient.get(`/jobs/${jobId}/agents`);
    } catch (error) {
      // 如果API失败，返回模拟数据
      const mockAgents = this.generateMockAgents();
      // 根据jobId返回一些相关的agents（这里简化处理，返回前3个）
      return mockAgents.slice(0, 3);
    }
  }

  // 根据ID获取单个Agent
  static async getAgentById(id: string): Promise<Agent> {
    try {
      return await apiClient.get(`/agents/${id}`);
    } catch (error) {
      // 如果API失败，从模拟数据中查找
      const mockAgents = this.generateMockAgents();
      const agent = mockAgents.find(a => a.id === id);
      if (agent) {
        return agent;
      }
      throw new Error(`Agent with id ${id} not found`);
    }
  }

  // 生成模拟Agent数据
  private static generateMockAgents(): Agent[] {
    return [
      {
        id: "1",
        agentName: "AI Assistant Pro",
        agentAddress: "0x742d35Cc6639C0532fEb17f6fB466C8fd3b00C36",
        description: "专业的AI助手，擅长客户服务和问题解决",
        authorBio: "资深AI工程师，专注于智能客服解决方案",
        agentClassification: "Customer Service",
        tags: ["客服", "问题解决", "AI"],
        isPrivate: false,
        autoAcceptJobs: true,
        contractType: "subscription",
        isActive: true,
        reputation: 4.8,
        successRate: 95,
        totalJobsCompleted: 156,
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-15"),
        walletAddress: "0x742d35Cc6639C0532fEb17f6fB466C8fd3b00C36"
      },
      {
        id: "2",
        agentName: "Code Helper Bot", 
        agentAddress: "0x8ba1f109551bD432803012645Hac136c34774567",
        description: "专业的代码助手，支持多种编程语言和框架",
        authorBio: "全栈开发工程师，10年编程经验",
        agentClassification: "AI Development",
        tags: ["编程", "代码审查", "调试"],
        isPrivate: false,
        autoAcceptJobs: false,
        contractType: "fixed",
        isActive: true,
        reputation: 4.6,
        successRate: 88,
        totalJobsCompleted: 89,
        createdAt: new Date("2025-01-02"),
        updatedAt: new Date("2025-01-15"),
        walletAddress: "0x8ba1f109551bD432803012645Hac136c34774567"
      },
      {
        id: "3",
        agentName: "Data Analyst AI",
        agentAddress: "0x2f37d1c3b5d982a14e7e678f2b4a9e6d1c8b9a7c",
        description: "专业的数据分析专家，提供深度数据洞察",
        authorBio: "数据科学家，专注于商业智能和数据可视化",
        agentClassification: "Data Analysis",
        tags: ["数据分析", "机器学习", "可视化"],
        isPrivate: false,
        autoAcceptJobs: true,
        contractType: "hourly",
        isActive: false,
        reputation: 4.9,
        successRate: 92,
        totalJobsCompleted: 234,
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2025-01-10"),
        walletAddress: "0x2f37d1c3b5d982a14e7e678f2b4a9e6d1c8b9a7c"
      },
      {
        id: "4",
        agentName: "Design Master",
        agentAddress: "0x9c8e7f6d5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
        description: "创意设计专家，专业UI/UX设计服务",
        authorBio: "资深设计师，Adobe认证专家",
        agentClassification: "Design",
        tags: ["UI设计", "UX设计", "品牌设计"],
        isPrivate: false,
        autoAcceptJobs: false,
        contractType: "milestone",
        isActive: true,
        reputation: 4.7,
        successRate: 91,
        totalJobsCompleted: 127,
        createdAt: new Date("2024-11-20"),
        updatedAt: new Date("2025-01-14"),
        walletAddress: "0x9c8e7f6d5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e"
      },
      {
        id: "5",
        agentName: "Marketing Wizard",
        agentAddress: "0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d",
        description: "数字营销专家，全渠道营销策略制定",
        authorBio: "营销总监，专注于数字化营销和品牌建设",
        agentClassification: "Marketing",
        tags: ["数字营销", "社媒运营", "SEO"],
        isPrivate: false,
        autoAcceptJobs: true,
        contractType: "subscription",
        isActive: true,
        reputation: 4.5,
        successRate: 87,
        totalJobsCompleted: 98,
        createdAt: new Date("2024-12-01"),
        updatedAt: new Date("2025-01-13"),
        walletAddress: "0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d"
      }
    ];
  }
}

export default AgentService;
