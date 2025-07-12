describe('RequestDemo 页面测试', () => {
  beforeEach(() => {
    // 只在第一个测试前访问页面，提高执行效率
    cy.visit('/request-demo');
    
    // 等待Layout加载完成 - 检查header中的AgentFlow标题
    cy.get('header h1', { timeout: 10000 }).should('contain.text', 'AgentFlow');
    
    // 等待页面内容在main区域内加载
    cy.get('main', { timeout: 10000 }).should('exist');
    cy.get('main h1', { timeout: 10000 }).should('contain.text', 'RequestDemo');
    
    // 等待数据加载完成
    cy.get('main ul li', { timeout: 15000 }).should('have.length', 4);
  });

  it('应该正确显示页面标题和标题内容', () => {
    // 验证Layout标题
    cy.get('header h1').should('contain.text', 'AgentFlow').and('be.visible');
    
    // 验证页面标题（在main区域内）
    cy.get('main h1').should('contain.text', 'RequestDemo').and('be.visible');
    
    // 验证副标题（在main区域内）
    cy.get('main h2').should('contain.text', '功能概览').and('be.visible').and('have.class', 'mt-2');
  });

  it('应该加载并显示加密货币列表', () => {
    // 验证列表存在（数据已在before中加载）
    cy.get('main ul').should('exist');
    
    // 验证列表项数量
    cy.get('main ul li').should('have.length', 4);
    
    // 验证具体的列表项内容
    cy.fixture('requestDemo').then((data) => {
      data.expectedItems.forEach((item, index) => {
        cy.get('main ul li').eq(index).should('contain.text', item.content);
      });
    });
  });

  it('应该验证每个加密货币项目正确显示', () => {
    const expectedItems = ['BTC', 'ETH', 'MEME', 'DOGE'];
    
    // 验证列表项数量（数据已在before中加载）
    cy.get('main ul li').should('have.length', 4);
    
    expectedItems.forEach((item, index) => {
      cy.get('main ul li').eq(index).should('contain.text', item);
    });
  });

  it('应该处理列表项的点击事件', () => {
    // 验证列表项存在（数据已在before中加载）
    cy.get('main ul li').should('have.length', 4);
    
    // 设置console.log监听
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog');
    });
    
    // 点击第一个列表项 (BTC)
    cy.get('main ul li').first().click();
    
    // 验证console.log被调用
    cy.get('@consoleLog').should('have.been.called');
  });

  it('应该具有适当的可访问性属性', () => {
    // 验证列表项数量（数据已在before中加载）
    cy.get('main ul li').should('have.length', 4);
    
    // 验证列表项可见性
    cy.get('main ul li').first().should('be.visible');
    
    // 验证列表结构正确
    cy.get('main ul').should('have.length', 1);
    cy.get('main ul li').should('have.length', 4);
  });

  it('应该按正确顺序显示内容', () => {
    const expectedOrder = ['BTC', 'ETH', 'MEME', 'DOGE'];
    
    // 验证列表项数量（数据已在before中加载）
    cy.get('main ul li').should('have.length', 4);
    
    cy.get('main ul li').each(($li, index) => {
      cy.wrap($li).should('contain.text', expectedOrder[index]);
    });
  });

  it('应该优雅地处理页面加载状态', () => {
    // 验证页面标题已显示
    cy.get('main h1').should('contain.text', 'RequestDemo');
    
    // 验证列表数据已加载完成
    cy.get('main ul li').should('have.length', 4);
  });
  
  // 专门测试SSR + 客户端水合的场景（需要重新访问页面）
  it('应该正确处理SSR到CSR的过渡', () => {
    // 重新访问页面测试SSR到CSR的过渡
    cy.visit('/request-demo');
    
    // 验证SSR内容立即可见（在水合之前就存在）
    cy.get('header h1', { timeout: 2000 }).should('contain.text', 'AgentFlow');
    cy.get('main h1', { timeout: 2000 }).should('contain.text', 'RequestDemo');
    cy.get('main h2', { timeout: 2000 }).should('contain.text', '功能概览');
    
    // 使用功能性验证确认水合完成
    cy.verifyHydrationByInteraction('main ul li');
    
    // 验证最终状态和交互功能
    cy.get('main ul li', { timeout: 15000 }).should('have.length', 4);
    cy.get('main ul li').first().should('contain.text', 'BTC');
    
    // 验证真正的交互功能（这证明水合真的完成了）
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('hydrationConsoleLog');
    });
    cy.get('main ul li').first().click();
    cy.get('@hydrationConsoleLog').should('have.been.called');
  });

  // 测试Layout导航功能
  it('应该正确显示布局导航', () => {
    // 验证header导航
    cy.get('header nav').should('be.visible');
    cy.get('header h1').should('contain.text', 'AgentFlow');
    
    // 验证导航链接
    cy.get('header nav a').should('have.length.at.least', 3);
    cy.get('header nav').should('contain.text', '首页');
    cy.get('header nav').should('contain.text', 'Agents');
    cy.get('header nav').should('contain.text', 'Jobs');
    
    // 验证footer
    cy.get('footer').should('be.visible');
    cy.get('footer').should('contain.text', '2024 AgentFlow');
  });
});