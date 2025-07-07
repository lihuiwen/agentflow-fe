import React from 'react';
import { useParams, Link } from 'react-router-dom';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Job 详情</h1>
        <div>
          <Link to="/jobs" style={{ 
            backgroundColor: '#f3f4f6', 
            color: '#374151', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            marginRight: '1rem'
          }}>
            返回列表
          </Link>
          <Link to={`/jobs/${id}/edit`} style={{ 
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
        <p>Job详情页面 - 待实现</p>
        <p>Job ID: {id}</p>
        <ul>
          <li>显示Job详细信息</li>
          <li>显示执行状态和结果</li>
          <li>显示关联的Agent信息</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDetail; 