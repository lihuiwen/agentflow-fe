import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
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
  TextSearch,
} from 'lucide-react';

import type { Agent, AgentsApiResponse, IAgentDetail } from 'types/agents';
import AgentDetail from "./AgentDetail";

const agentsData = [
  {
    id: 1,
    name: '量化交易专家',
    category: '金融顾问',
    rating: 4.8,
    reviews: 256,
    description: '专业的量化交易和投资分析AI，提供市场分析、风险控制和投资策略建议。',
    tags: ['量化交易', '投资分析', '风险控制', '策略优化'],
    price: 50,
    status: '基于详细的合约',
    icon: 'TrendingUp',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 2,
    name: '全栈开发助手',
    category: '编程开发',
    rating: 4.9,
    reviews: 432,
    description: '精通多种编程语言和框架的AI开发助手，提供代码审查、架构设计和问题解决。',
    tags: ['全栈开发', '代码审查', '架构设计', 'DevOps'],
    price: 30,
    status: '基于详细的合约',
    icon: 'Code',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 3,
    name: '数据科学家',
    category: '数据分析',
    rating: 4.7,
    reviews: 198,
    description: '专业的数据分析和机器学习专家，提供数据挖掘、预测建模和可视化服务。',
    tags: ['数据挖掘', '机器学习', '预测建模', '数据可视化'],
    price: 40,
    status: '基于详细的合约',
    icon: 'BarChart3',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 4,
    name: '智能客服助手',
    category: '客户服务',
    rating: 4.6,
    reviews: 324,
    description: '24/7智能客服解决方案，提供多语言支持和情感分析能力。',
    tags: ['客户服务', '多语言', '情感分析', '自动回复'],
    price: 25,
    status: '基于详细的合约',
    icon: 'MessageSquare',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  {
    id: 5,
    name: '网络安全专家',
    category: '安全防护',
    rating: 4.8,
    reviews: 167,
    description: '专业的网络安全分析和防护AI，提供威胁检测、漏洞扫描和安全咨询。',
    tags: ['威胁检测', '漏洞扫描', '安全咨询', '风险评估'],
    price: 60,
    status: '基于详细的合约',
    icon: 'Shield',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 6,
    name: '性能优化师',
    category: '系统优化',
    rating: 4.6,
    reviews: 156,
    description: '专业的系统性能分析和优化AI，提供性能监控和调优建议。',
    tags: ['性能监控', '系统调优', '资源管理', '负载均衡'],
    price: 38,
    status: '基于详细的合约',
    icon: 'Zap',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 7,
    name: '智能决策助手',
    category: '决策支持',
    rating: 4.8,
    reviews: 278,
    description: '基于大数据和AI的智能决策支持系统，提供数据驱动的决策建议。',
    tags: ['决策支持', '数据分析', '预测模型', '风险评估'],
    price: 55,
    status: '基于详细的合约',
    icon: 'Brain',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
  {
    id: 8,
    name: '图像处理专家',
    category: '计算机视觉',
    rating: 4.6,
    reviews: 234,
    description: '专业的图像识别、处理和分析AI，提供OCR、人脸识别等服务。',
    tags: ['图像识别', 'OCR', '人脸识别', '图像处理'],
    price: 48,
    status: '基于详细的合约',
    icon: 'Settings',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
  },
  {
    id: 9,
    name: '区块链专家',
    category: '区块链技术',
    rating: 4.6,
    reviews: 178,
    description: '专业的区块链技术和智能合约开发AI，提供区块链咨询和开发服务。',
    tags: ['区块链', '智能合约', 'DeFi', 'NFT'],
    price: 65,
    status: '基于详细的合约',
    icon: 'Shield',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
];
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
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const itemsPerPage = 9; // 每页显示5行，即15个项目
  const navigate = useNavigate();

  // 加载数据
  useEffect(() => {
    const loadAgents = async () => {
      try {
        // 模拟从JSON文件获取数据
        // const agentsList = fetch('/mocks/agents.json')
        //   .then((response) => {
        //     console.log(response);
        //     return response.json();
        //   })
        //   .then((data) => {
        //     console.log('获取的数据：', data);
        //   })
        //   .catch((error) => {
        //     console.error('出错了:', error);
        //   });
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAgents(agentsData);
        setLoading(false);
      } catch (error) {
        console.error('加载数据失败:', error);
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const totalPages = Math.ceil(agents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRows = [];

  // 将数据按行分组，每行3个项目
  for (let i = startIndex; i < startIndex + itemsPerPage && i < agents.length; i++) {
    const rowStart = i * 3;
    const rowAgents = agents.slice(rowStart, rowStart + 3);
    if (rowAgents.length > 0) {
      currentRows.push(rowAgents);
    }
  }

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

  const sampleAgent: IAgentDetail = {
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
      description: 'No payment required, use directly'
    },
    badge: 'Marketing Expert'
  };

  // 单个 agent 组件
  const AgentCard = ({ agent }) => {
    const IconComponent = iconMap[agent.icon] || MessageSquare;

    return (
      <div
        data-testid="agent-card"
        onClick={() => setOpen(true)}
        className={`${agent.bgColor} ${agent.borderColor} border-2 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 flex-1`}
      >
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900">{agent.name}</h3>
              {/* 评分 */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{agent.rating}</span>
                <span className="text-xs text-gray-500">({agent.reviews})</span>
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
            <span className="text-xl font-bold text-gray-900">{agent.price}</span>
            <span className="text-xs text-gray-500">USDT/月</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">固定通用收费</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">合约</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">加载中...</span>
        </div>
      </div>
    );
  }

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
      <div className="space-y-4 mb-8">
        {currentRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            {/* 如果当前行不足3个，添加空占位符 */}
            {row.length < 3 &&
              Array.from({ length: 3 - row.length }).map((_, index) => (
                <div key={`placeholder-${index}`} className="flex-1"></div>
              ))}
          </div>
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
      <AgentDetail
        open={open}
        onClose={() => setOpen(false)}
        agent={sampleAgent}
      />
    </div>
  );
};

export default Agents;
