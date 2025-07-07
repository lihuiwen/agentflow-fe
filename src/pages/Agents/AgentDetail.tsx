import React from 'react';
import { useParams, Link } from 'react-router-dom';

const AgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Agent 详情</h1>
        <div>
          <Link to="/agents" style={{ 
            backgroundColor: '#f3f4f6', 
            color: '#374151', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            marginRight: '1rem'
          }}>
            返回列表
          </Link>
          <Link to={`/agents/${id}/edit`} style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none' 
          }}>
            编辑
          </Link>
        </div>
      </div>
      
      <div>
        <p>Agent详情页面 - 待实现</p>
        <p>Agent ID: {id}</p>
        <ul>
          <li>显示Agent详细信息</li>
          <li>显示Agent配置</li>
          <li>显示Agent状态</li>
        </ul>
      </div>
    </div>
  );
};

export default AgentDetail; 