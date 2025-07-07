import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <h1>欢迎使用 AgentFlow</h1>
      <div style={{ marginTop: '2rem' }}>
        <h2>功能概览</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <h3>Agent 管理</h3>
            <p>创建、配置和管理各种类型的智能代理</p>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <h3>Job 管理</h3>
            <p>创建、调度和监控各种任务执行</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
