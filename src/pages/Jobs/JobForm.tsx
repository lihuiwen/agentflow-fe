import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== 'new';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 表单提交逻辑 - 待实现
    console.log('表单提交');
  };

  const handleCancel = () => {
    navigate('/jobs');
  };

  return (
    <div>
      <h1>{isEditing ? '编辑 Job' : '新增 Job'}</h1>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div>
          <p>Job表单页面 - 待实现</p>
          <p>{isEditing ? `编辑 Job ID: ${id}` : '新增 Job'}</p>
          <ul>
            <li>Job名称输入</li>
            <li>描述输入</li>
            <li>选择关联Agent</li>
            <li>设置优先级</li>
            <li>配置参数</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button 
            type="button" 
            onClick={handleCancel}
            style={{ 
              backgroundColor: '#f3f4f6', 
              color: '#374151', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem', 
              border: 'none',
              marginRight: '1rem',
              cursor: 'pointer'
            }}
          >
            取消
          </button>
          <button 
            type="submit"
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm; 