import React from 'react';
import { Link } from 'react-router-dom';

const Jobs: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Job 管理</h1>
        <Link to="new" style={{ 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '0.5rem', 
          textDecoration: 'none' 
        }}>
          新增 Job
        </Link>
      </div>
      
      <div>
        <p>Job列表页面 - 待实现</p>
        <ul>
          <li>显示Job列表</li>
          <li>支持查看、编辑、删除操作</li>
          <li>支持执行Job</li>
        </ul>
      </div>
    </div>
  );
};

export default Jobs; 