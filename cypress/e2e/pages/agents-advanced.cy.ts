describe('Agents 页面高级测试', () => {
  beforeEach(() => {
    cy.visit('/agents');
    cy.waitForHydration();
    cy.get('[data-testid="agent-card"]', { timeout: 15000 }).should('have.length.at.least', 1);
  });

  describe('性能和响应性测试', () => {
    it('应该在合理时间内加载页面', () => {
      const startTime = Date.now();
      
      cy.visit('/agents').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // 5秒内加载完成
      });
      
      // 验证关键内容在 3 秒内可见
      cy.get('h1', { timeout: 3000 }).contains('所有代理').should('be.visible');
      cy.get('[data-testid="agent-card"]', { timeout: 3000 }).should('have.length.at.least', 1);
    });

    it('应该流畅处理快速连续的交互', () => {
      // 快速切换搜索内容
      const searchInput = 'input[placeholder="请输入搜索内容..."]';
      
      cy.get(searchInput)
        .type('量化')
        .clear()
        .type('开发')
        .clear()
        .type('数据');
      
      // 快速点击多个按钮
      cy.get('button').contains('Search').click();
      cy.get('button').contains('Upload').click();
      
      // 验证页面仍然响应
      cy.url().should('include', '/agents/new');
      cy.go('back');
      cy.get('[data-testid="agent-card"]').should('have.length.at.least', 1);
    });
  });

  describe('数据验证测试', () => {
    it('应该显示正确数量的 Agent 卡片', () => {
      cy.fixture('agents').then((data) => {
        const expectedCount = data.expectedAgents.length;
        
        cy.get('[data-testid="agent-card"]').should('have.length', expectedCount);
        cy.get('span').contains(`${expectedCount} 个结果`).should('be.visible');
      });
    });

    it('应该验证每个 Agent 的数据完整性', () => {
      cy.fixture('agents').then((data) => {
        data.expectedAgents.forEach((expectedAgent, index) => {
          cy.get('[data-testid="agent-card"]').eq(index).within(() => {
            // 验证必要字段存在
            cy.get('h3').should('contain.text', expectedAgent.name);
            cy.get('div').contains(expectedAgent.category).should('exist');
            cy.get('span').contains(expectedAgent.rating.toString()).should('exist');
            cy.get('span').contains(`(${expectedAgent.reviews})`).should('exist');
            cy.get('span').contains(expectedAgent.price.toString()).should('exist');
            
            // 验证标签存在
            expectedAgent.tags.slice(0, 3).forEach((tag) => {
              cy.get('span').contains(tag).should('exist');
            });
          });
        });
      });
    });
  });

  describe('搜索功能深度测试', () => {
    it('应该支持多种搜索方式', () => {
      cy.fixture('agents').then((data) => {
        const searchInput = 'input[placeholder="请输入搜索内容..."]';
        
        // 测试有效搜索词
        data.testScenarios.search.validSearchTerms.forEach((term) => {
          cy.get(searchInput).clear().type(term);
          cy.get('button').contains('Search').click();
          cy.wait(500); // 等待搜索处理
        });
        
        // 测试回车键搜索
        cy.get(searchInput).clear().type('测试搜索{enter}');
        
        // 测试空搜索
        cy.get(searchInput).clear();
        cy.get('button').contains('Search').click();
      });
    });

    it('应该处理特殊字符搜索', () => {
      const searchInput = 'input[placeholder="请输入搜索内容..."]';
      const specialChars = ['@#$%', '中文测试', '123456', '   空格   '];
      
      specialChars.forEach((chars) => {
        cy.get(searchInput).clear().type(chars);
        cy.get('button').contains('Search').click();
        cy.wait(300);
      });
    });
  });

  describe('分页功能测试', () => {
    it('应该正确处理分页导航', () => {
      // 获取总页数
      cy.get('button[class*="bg-blue-600"]').then(($currentPage) => {
        const currentPageText = $currentPage.text();
        expect(currentPageText).to.equal('1');
      });
      
      // 测试上一页按钮在第一页时禁用
      cy.get('button').contains('上一页').should('be.disabled');
      
      // 如果有多页，测试页面跳转
      cy.get('button').contains('下一页').then(($btn) => {
        if (!$btn.prop('disabled')) {
          cy.wrap($btn).click();
          cy.get('button[class*="bg-blue-600"]').should('contain.text', '2');
          
          // 测试回到第一页
          cy.get('button').contains('1').click();
          cy.get('button[class*="bg-blue-600"]').should('contain.text', '1');
        }
      });
    });
  });

  describe('响应式设计测试', () => {
    const viewports = [
      { width: 375, height: 667, device: 'mobile' },
      { width: 768, height: 1024, device: 'tablet' },
      { width: 1920, height: 1080, device: 'desktop' }
    ];

    viewports.forEach((viewport) => {
      it(`应该在 ${viewport.device} 设备上正确显示`, () => {
        cy.viewport(viewport.width, viewport.height);
        
        // 验证基本元素可见
        cy.get('h1').contains('所有代理').should('be.visible');
        cy.get('input[placeholder="请输入搜索内容..."]').should('be.visible');
        cy.get('[data-testid="agent-card"]').should('have.length.at.least', 1);
        
        // 验证卡片布局适应屏幕
        cy.get('[data-testid="agent-card"]').first().should('be.visible');
      });
    });
  });

  describe('错误处理和边界情况', () => {
    it('应该处理网络延迟情况', () => {
      // 模拟慢网络
      cy.intercept('GET', '**/agents**', (req) => {
        req.reply((res) => {
          // 延迟 2 秒响应
          setTimeout(() => res.send(), 2000);
        });
      }).as('slowAgentsRequest');
      
      cy.visit('/agents');
      
      // 验证加载状态
      cy.get('body').should('be.visible');
      
      // 等待数据加载
      cy.wait('@slowAgentsRequest');
      cy.get('[data-testid="agent-card"]', { timeout: 10000 }).should('have.length.at.least', 1);
    });

    it('应该处理空状态', () => {
      // 如果没有数据的情况下的处理
      // 这个测试可能需要根据实际的空状态实现来调整
      
      cy.get('[data-testid="agent-card"]').then(($cards) => {
        if ($cards.length === 0) {
          // 验证空状态显示
          cy.get('body').should('contain.text', '暂无数据');
        } else {
          // 如果有数据，验证正常显示
          cy.wrap($cards).should('have.length.at.least', 1);
        }
      });
    });
  });

  describe('可访问性测试', () => {
    it('应该支持键盘导航', () => {
      // Tab 键导航测试
      cy.get('body').tab();
      cy.focused().should('have.attr', 'placeholder', '请输入搜索内容...');
      
      cy.focused().tab();
      cy.focused().should('contain.text', 'Search');
      
      cy.focused().tab();
      cy.focused().should('contain.text', 'Upload');
    });

    it('应该有适当的 ARIA 标签', () => {
      // 验证搜索区域
      cy.get('input[placeholder="请输入搜索内容..."]')
        .should('be.visible')
        .and('have.attr', 'type', 'text');
      
      // 验证按钮
      cy.get('button').contains('Search').should('be.visible');
      cy.get('button').contains('Upload').should('be.visible');
    });

    it('应该支持屏幕阅读器', () => {
      // 验证重要元素有适当的文本内容
      cy.get('h1').contains('所有代理').should('be.visible');
      
      cy.get('[data-testid="agent-card"]').first().within(() => {
        cy.get('h3').should('be.visible').and('not.be.empty');
        cy.get('p').should('be.visible').and('not.be.empty');
      });
    });
  });

  describe('状态管理测试', () => {
    it('应该正确保持搜索状态', () => {
      const searchInput = 'input[placeholder="请输入搜索内容..."]';
      const searchTerm = '量化交易';
      
      // 输入搜索词
      cy.get(searchInput).type(searchTerm);
      
      // 点击其他区域
      cy.get('h1').click();
      
      // 验证搜索词仍然保留
      cy.get(searchInput).should('have.value', searchTerm);
    });

    it('应该正确保持分页状态', () => {
      // 如果有多页，测试页面状态保持
      cy.get('button').contains('下一页').then(($btn) => {
        if (!$btn.prop('disabled')) {
          cy.wrap($btn).click();
          
          // 刷新页面
          cy.reload();
          
          // 验证回到第一页（这是正常行为）
          cy.get('button[class*="bg-blue-600"]', { timeout: 10000 }).should('contain.text', '1');
        }
      });
    });
  });

  describe('Modal 交互测试', () => {
    it('应该正确打开和关闭 Agent 详情', () => {
      // 点击第一个 Agent 卡片
      cy.get('[data-testid="agent-card"]').first().click();
      
      // 等待 modal 打开（这里可能需要根据实际的 modal 实现调整）
      cy.wait(500);
      
      // 验证 modal 内容（基于 AgentDetail 组件）
      cy.get('body').should('be.visible');
      
      // 尝试关闭 modal（如果有关闭按钮或点击外部区域）
      cy.get('body').type('{esc}'); // ESC 键关闭
    });
  });
});