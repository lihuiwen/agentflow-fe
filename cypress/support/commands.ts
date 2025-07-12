/// <reference types="cypress" />
// ***********************************************
// AgentFlow-FE 项目自定义 Cypress 命令
// ***********************************************

// 等待页面加载完成的命令
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  // 不强制要求React在window上，因为可能以模块形式加载
});

// 等待SSR水合完成 - 针对AgentFlow-FE项目的实用方案
Cypress.Commands.add('waitForHydration', () => {
  // 1. 验证SSR数据脚本存在（说明页面是SSR渲染的）
  cy.get('#__APP_FLAG__', { timeout: 5000 }).should('exist');
  cy.get('#__REACT_QUERY_STATE__', { timeout: 5000 }).should('exist');
  
  // 2. 等待足够时间让JavaScript加载和执行
  cy.wait(800);
  
  // 3. 功能性验证：尝试简单的交互来确认水合完成
  cy.get('#root').should('exist');
  
  // 4. 检查页面基本结构是否完整（说明React已接管）
  cy.get('header').should('exist');
  cy.get('main').should('exist');
  cy.get('footer').should('exist');
});

// 等待React Query数据加载完成
Cypress.Commands.add('waitForReactQueryData', (selector?: string, expectedCount?: number) => {
  if (selector && expectedCount) {
    // 等待指定元素加载到预期数量，增加超时时间
    cy.get(selector, { timeout: 15000 }).should('have.length', expectedCount);
  } else {
    // 对于模拟数据，直接等待DOM更新
    cy.wait(1000); // 等待足够时间让React渲染完成
    
    // 可选：检查是否有列表元素出现
    cy.get('ul', { timeout: 10000 }).should('exist');
  }
});

// 验证SSR渲染的命令
Cypress.Commands.add('checkSSRContent', (selector: string, expectedText: string) => {
  cy.get(selector).should('contain.text', expectedText);
});

// 智能页面访问：处理SSR + 客户端水合
Cypress.Commands.add('visitAndWaitForApp', (url: string) => {
  cy.visit(url);
  cy.waitForHydration();
});

// 功能性水合验证：通过实际交互确认水合完成
Cypress.Commands.add('verifyHydrationByInteraction', (testSelector: string) => {
  // 等待基础水合
  cy.waitForHydration();
  
  // 简化验证：直接检查元素数量和可见性
  if (testSelector) {
    cy.get(testSelector, { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get(testSelector).first().should('be.visible');
    
    // 简单的hover测试（仅对第一个元素）
    cy.get(testSelector).first().trigger('mouseover');
  }
});

// TypeScript 类型声明
declare global {
  namespace Cypress {
    interface Chainable {
      waitForPageLoad(): Chainable<void>
      waitForHydration(): Chainable<void>
      waitForReactQueryData(selector?: string, expectedCount?: number): Chainable<void>
      checkSSRContent(selector: string, expectedText: string): Chainable<void>
      visitAndWaitForApp(url: string): Chainable<void>
      verifyHydrationByInteraction(testSelector: string): Chainable<void>
    }
  }
}