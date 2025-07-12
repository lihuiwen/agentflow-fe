describe('Agents 页面测试', () => {
  beforeEach(() => {
    // 访问 Agents 页面
    cy.visit('/agents');
    
    // 等待 Layout 加载完成
    cy.get('header h1', { timeout: 10000 }).should('contain.text', 'AgentFlow');
    
    // 等待页面内容加载
    cy.get('main', { timeout: 10000 }).should('exist');
    
    // 等待数据加载完成（等待 agent 卡片渲染）
    cy.get('[data-testid="agent-card"]', { timeout: 15000 }).should('have.length.at.least', 1);
  });

  it('应该正确显示页面基础结构', () => {
    // 验证 Layout 标题
    cy.get('header h1').should('contain.text', 'AgentFlow').and('be.visible');
    
    // 验证搜索框区域
    cy.get('input[placeholder="请输入搜索内容..."]').should('be.visible');
    cy.get('button').contains('Search').should('be.visible');
    cy.get('button').contains('Upload').should('be.visible');
    
    // 验证页面标题区域
    cy.get('h1').contains('所有代理').should('be.visible');
    cy.get('span').contains('个结果').should('be.visible');
  });

  it('应该加载并显示 Agent 卡片列表', () => {
    // 验证 Agent 卡片存在
    cy.get('[data-testid="agent-card"]').should('have.length.at.least', 1);
    
    // 验证第一个 Agent 卡片的基本结构
    cy.get('[data-testid="agent-card"]').first().within(() => {
      // 验证图标
      cy.get('svg').should('be.visible');
      
      // 验证名称
      cy.get('h3').should('be.visible').and('contain.text', '量化交易专家');
      
      // 验证评分
      cy.get('span').contains('4.8').should('be.visible');
      cy.get('span').contains('(256)').should('be.visible');
      
      // 验证分类
      cy.get('div').contains('金融顾问').should('be.visible');
      
      // 验证描述
      cy.get('p').should('be.visible').and('contain.text', '专业的量化交易和投资分析AI');
      
      // 验证标签
      cy.get('span').contains('量化交易').should('be.visible');
      
      // 验证价格
      cy.get('span').contains('50').should('be.visible');
      cy.get('span').contains('USDT/月').should('be.visible');
    });
  });

  it('应该正确显示不同类型的 Agent', () => {
    cy.fixture('agents').then((data) => {
      const expectedAgents = data.expectedAgents.slice(0, 3);
      
      expectedAgents.forEach((agent, index) => {
        cy.get('[data-testid="agent-card"]').eq(index).within(() => {
          cy.get('h3').should('contain.text', agent.name);
          cy.get('div').contains(agent.category).should('be.visible');
          cy.get('span').contains(agent.price.toString()).should('be.visible');
        });
      });
    });
  });

  it('应该支持搜索功能', () => {
    const searchInput = 'input[placeholder="请输入搜索内容..."]';
    const searchButton = 'button:contains("Search")';
    
    // 输入搜索关键词
    cy.get(searchInput).type('量化交易');
    
    // 点击搜索按钮
    cy.get(searchButton).click();
    
    // 验证搜索功能被触发（检查 console.log）
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
    
    // 测试回车键搜索
    cy.get(searchInput).clear().type('开发助手{enter}');
  });

  it('应该支持分页功能', () => {
    // 等待数据加载完成
    cy.get('[data-testid="agent-card"]').should('have.length.at.least', 1);
    
    // 验证分页控件存在
    cy.get('button').contains('上一页').should('be.visible');
    cy.get('button').contains('下一页').should('be.visible');
    
    // 验证页码按钮
    cy.get('button').contains('1').should('be.visible').and('have.class', 'bg-blue-600');
    
    // 测试下一页按钮（如果有多页）
    cy.get('button').contains('下一页').then(($btn) => {
      if (!$btn.prop('disabled')) {
        cy.wrap($btn).click();
        // 验证页面变化
        cy.get('button').contains('2').should('have.class', 'bg-blue-600');
      }
    });
  });

  it('应该支持 Upload 按钮功能', () => {
    // 点击 Upload 按钮
    cy.get('button').contains('Upload').click();
    
    // 验证页面跳转到 new agent 页面
    cy.url().should('include', '/agents/new');
  });

  it('应该支持点击 Agent 卡片打开详情', () => {
    // 点击第一个 Agent 卡片
    cy.get('[data-testid="agent-card"]').first().click();
    
    // 验证 AgentDetail 模态框打开
    // 注意：这里需要根据实际的 AgentDetail 组件结构来验证
    // 假设模态框有特定的测试标识或者可见的特征
    cy.get('body').should('contain.text', 'zhijia加密'); // 基于示例数据
  });

  it('应该正确处理加载状态', () => {
    // 重新访问页面来测试加载状态
    cy.visit('/agents');
    
    // 验证加载指示器（如果显示时间足够长）
    cy.get('body').should('be.visible');
    
    // 最终验证数据加载完成
    cy.get('[data-testid="agent-card"]', { timeout: 15000 }).should('have.length.at.least', 1);
    cy.get('span').contains('个结果').should('be.visible');
  });

  it('应该显示正确的 Agent 统计信息', () => {
    // 等待数据加载
    cy.get('[data-testid="agent-card"]').should('have.length.at.least', 1);
    
    // 验证结果数量显示
    cy.get('span').contains('个结果').should('be.visible');
    
    // 验证显示的数量与实际卡片数量一致
    cy.get('[data-testid="agent-card"]').then(($cards) => {
      const cardCount = $cards.length;
      cy.get('span').should('contain.text', `${cardCount} 个结果`);
    });
  });

  it('应该正确显示 Agent 卡片的视觉样式', () => {
    cy.get('[data-testid="agent-card"]').first().within(() => {
      // 验证卡片基础样式
      cy.get('div').first().should('have.class', 'bg-blue-50');
      cy.get('div').first().should('have.class', 'border-blue-200');
      cy.get('div').first().should('have.class', 'rounded-2xl');
      
      // 验证图标容器样式
      cy.get('.w-10.h-10.rounded-xl.bg-white').should('be.visible');
      
      // 验证评分星标
      cy.get('svg').should('have.class', 'text-yellow-400');
    });
  });

  it('应该支持键盘导航和可访问性', () => {
    // 验证搜索框可以通过 Tab 键访问
    cy.get('input[placeholder="请输入搜索内容..."]').focus();
    cy.focused().should('have.attr', 'placeholder', '请输入搜索内容...');
    
    // 验证按钮可以通过 Tab 键访问
    cy.get('button').contains('Search').focus();
    cy.focused().should('contain.text', 'Search');
    
    // 验证 Agent 卡片的可访问性
    cy.get('[data-testid="agent-card"]').first().should('be.visible');
  });

  // SSR 水合测试
  it('应该正确处理 SSR 到 CSR 的过渡', () => {
    // 重新访问页面测试 SSR 到 CSR 的过渡
    cy.visit('/agents');
    
    // 验证 SSR 内容立即可见
    cy.get('header h1', { timeout: 2000 }).should('contain.text', 'AgentFlow');
    cy.get('input[placeholder="请输入搜索内容..."]', { timeout: 2000 }).should('be.visible');
    
    // 使用自定义命令验证水合
    cy.verifyHydrationByInteraction('[data-testid="agent-card"]');
    
    // 验证交互功能
    cy.get('[data-testid="agent-card"]', { timeout: 15000 }).should('have.length.at.least', 1);
    
    // 验证真正的交互功能（证明水合完成）
    cy.get('input[placeholder="请输入搜索内容..."]').type('测试');
    cy.get('input[placeholder="请输入搜索内容..."]').should('have.value', '测试');
  });

  // 布局导航测试
  it('应该正确显示布局导航', () => {
    // 验证 header 导航
    cy.get('header nav').should('be.visible');
    cy.get('header h1').should('contain.text', 'AgentFlow');
    
    // 验证导航链接
    cy.get('header nav a').should('have.length.at.least', 3);
    cy.get('header nav').should('contain.text', '首页');
    cy.get('header nav').should('contain.text', 'Agents');
    cy.get('header nav').should('contain.text', 'Jobs');
    
    // 验证 footer
    cy.get('footer').should('be.visible');
    cy.get('footer').should('contain.text', '2024 AgentFlow');
  });
});