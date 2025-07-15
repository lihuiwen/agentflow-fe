import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  MessageSquare,
  Code,
  Database,
  TrendingUp,
  Shield,
  Settings,
  Zap,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  Upload,
} from 'lucide-react';

import type { Agent, IAgentDetail } from '@apis/model/Agents';
import AgentDetail from './AgentDetail';
import { useQuery } from '@tanstack/react-query';
import { PrefetchKeys } from '@/apis/queryKeys';
import AgentService from '@/apis/services/Agent';

// 图标映射
const iconMap = {
  TrendingUp: TrendingUp,
  Code: Code,
  BarChart3: BarChart3,
  MessageSquare: MessageSquare,
  Shield: Shield,
  Database: Database,
  Settings: Settings,
  Zap: Zap,
  Brain: Brain,
};
const Agents = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent>({})
  // 获取 agents 列表
  const { data: agentRes } = useQuery({
    queryKey: [PrefetchKeys.AGENTS, currentPage, pageSize],
    queryFn: () => AgentService.getList(currentPage, pageSize),
    keepPreviousData: true, // 保持之前的数据，避免页面跳转时闪烁
  });

  useEffect(() => {
    if (agentRes) {
      setAgents(agentRes.data);
      setTotalPages(agentRes.totalPages);
    }
  }, [agentRes]);

  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log('搜索:', searchValue);
    // 在这里添加搜索逻辑
  };

  const handleAdd = () => {
    // 跳转到新增页面
    navigate('/agents/new');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // 详情弹窗
  const openDetail = (agent: Agent) => {
    const currentAgent: IAgentDetail = {
      id: '1',
      name: 'zhijia加密',
      avatar: '',
      rating: 0,
      reviewCount: 1,
      description: '可以预测市价的作者可以预测市价的作者',
      contractType: 'Result-based Contract',
      tags: ['测试tag', '测试tag2'],
      pricing: {
        type: 'free',
        description: 'No payment required, use directly',
      },
      badge: 'Marketing Expert',
    };
    setCurrentAgent(agent);
    setOpen(true);
  }

  // 单个 agent 组件
  const AgentCard = ({ agent }) => {
    const IconComponent = iconMap[agent.icon] || MessageSquare;

    return (
      <div
        data-testid="agent-card"
        onClick={() => openDetail(agent)}
        className="bg-blue-500/10 border-blue-500/20 w-1/3 border-2 rounded-2xl p-2 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-blue-500/15"
      >
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">{agent.agentName}</h3>
              {/* 评分 */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{agent.reputation}</span>
                {/* <span className="text-xs text-gray-500">({agent.reputation})</span> */}
              </div>
            </div>
          </div>
          {/* 分类 */}
          <div className="text-sm text-blue-600 font-medium">{agent.category}</div>
        </div>

        {/* 描述 */}
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{agent.description}</p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-white text-xs font-medium text-gray-600 rounded-lg">
              {tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* {agent.isFree ? <span className="text-xl font-bold text-gray-900">{agent.price}</span> : ''} */}
            {/* <span className="text-xs text-gray-500">{agent.isFree ? '免费使用' : 'USDT/月'}</span> */}
            <span className="text-xs text-gray-500">免费使用</span>
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="text-xs text-gray-500">{agent.isFree ? '免费使用' : '固定通用收费'}</span> */}
            <span className="text-xs text-gray-500">免费使用</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">合约</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 搜索框 */}
      <div className="flex items-center gap-3 w-full mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="请输入搜索内容..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          />
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
        >
          <Search size={18} />
          {/* <TextSearch size={18} /> */}
          Search
        </button>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
        >
          <Upload size={18} />
          Upload
        </button>
      </div>
      {/* 头部标题 */}
      <div className="flex justify-between items-center mt-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">所有代理</h1>
        <span className="text-gray-500">{agents.length} 个结果</span>
      </div>

      {/* 按行显示代理卡片 */}
      <div className="w-full mb-8 flex justify-around gap-4">
        {agents &&
          agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
      </div>

      {/* 分页组件 */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          上一页
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-40 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          下一页
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* agent detail */}
      <AgentDetail open={open} onClose={() => setOpen(false)} agent={currentAgent} />
    </div>
  );
};

export default Agents;
