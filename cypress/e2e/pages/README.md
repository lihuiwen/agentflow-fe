# Agents 页面 Cypress 测试

## 概述

本目录包含 AgentFlow-FE 项目中 Agents 页面的完整 Cypress 测试套件。

## 测试文件

### 1. `agents.cy.ts` - 基础功能测试
- **页面基础结构验证**：搜索框、按钮、标题等
- **Agent 卡片列表显示**：卡片结构、数据完整性
- **搜索功能**：搜索输入、回车键搜索
- **分页功能**：页面导航、页码显示
- **Upload 按钮**：页面跳转功能
- **Modal 交互**：点击卡片打开详情
- **SSR 水合测试**：服务端渲染到客户端的过渡
- **布局导航**：Header、Footer、导航链接

### 2. `agents-advanced.cy.ts` - 高级功能测试
- **性能测试**：页面加载时间、响应性
- **数据验证**：数据完整性、数量验证
- **搜索深度测试**：特殊字符、边界情况
- **响应式设计**：多设备适配
- **错误处理**：网络延迟、空状态
- **可访问性**：键盘导航、ARIA 标签
- **状态管理**：搜索状态、分页状态

## 测试数据

### `cypress/fixtures/agents.json`
包含测试所需的模拟数据：
- **expectedAgents**: Agent 列表数据
- **searchTerms**: 搜索测试用词
- **categories**: Agent 分类
- **testScenarios**: 测试场景配置

## 运行测试

### 1. 启动应用
```bash
# 启动开发环境
npm run dev

# 或启动生产环境
npm run build
npm start
```

### 2. 运行 Cypress 测试

#### 交互式模式（推荐开发时使用）
```bash
npx cypress open
```
然后选择 E2E Testing → 选择浏览器 → 运行测试文件

#### 无头模式（CI/CD 使用）
```bash
# 运行所有 agents 测试
npx cypress run --spec "cypress/e2e/pages/agents*.cy.ts"

# 运行基础测试
npx cypress run --spec "cypress/e2e/pages/agents.cy.ts"

# 运行高级测试
npx cypress run --spec "cypress/e2e/pages/agents-advanced.cy.ts"
```

## 测试配置

### 当前配置 (`cypress.config.ts`)
- **baseUrl**: `http://localhost:3001`
- **viewportWidth**: 1280
- **viewportHeight**: 720
- **video**: false（可根据需要开启）
- **screenshotOnRunFailure**: true

### 自定义命令
项目使用了以下自定义 Cypress 命令（定义在 `cypress/support/commands.ts`）：
- `cy.waitForHydration()`: 等待 SSR 水合完成
- `cy.verifyHydrationByInteraction()`: 通过交互验证水合
- `cy.waitForReactQueryData()`: 等待 React Query 数据加载

## 测试重点

### SSR 特定测试
由于 AgentFlow-FE 是 SSR 项目，测试特别关注：
1. **SSR 内容验证**：确保服务端渲染的内容正确显示
2. **水合过程**：验证客户端 JavaScript 正确接管
3. **状态一致性**：确保 SSR 和 CSR 状态一致

### 性能测试
- **加载时间**：页面在 5 秒内完成加载
- **交互响应**：快速连续操作的流畅性
- **数据渲染**：Agent 卡片在 15 秒内渲染完成

### 可访问性测试
- **键盘导航**：支持 Tab 键导航
- **屏幕阅读器**：重要元素有适当的文本内容
- **ARIA 标签**：表单元素有正确的属性

## 故障排除

### 常见问题

1. **测试超时**
   - 检查应用是否在 `http://localhost:3001` 正常运行
   - 增加等待时间：`cy.get(selector, { timeout: 20000 })`

2. **SSR 水合失败**
   - 确保应用的 SSR 功能正常
   - 检查 `#__APP_FLAG__` 和 `#__REACT_QUERY_STATE__` 元素是否存在

3. **元素找不到**
   - 确认页面完全加载：`cy.waitForHydration()`
   - 检查选择器是否正确：使用 `data-testid` 属性

4. **数据不匹配**
   - 确认 `cypress/fixtures/agents.json` 与实际数据一致
   - 检查 Agent 数据的生成逻辑

### 调试技巧

1. **使用 Cypress 开发者工具**
   ```javascript
   cy.debug(); // 在测试中添加断点
   cy.pause(); // 暂停测试执行
   ```

2. **截图调试**
   ```javascript
   cy.screenshot('debug-screenshot');
   ```

3. **控制台日志**
   ```javascript
   cy.window().then((win) => {
     win.console.log('Debug info');
   });
   ```

## 扩展测试

### 添加新测试
1. 在相应的测试文件中添加新的 `it()` 块
2. 使用项目的自定义命令
3. 遵循现有的测试模式

### 更新测试数据
1. 修改 `cypress/fixtures/agents.json`
2. 确保测试用例与新数据格式兼容

### 新增测试文件
1. 在 `cypress/e2e/pages/` 目录下创建新文件
2. 遵循命名约定：`[page-name].cy.ts`
3. 使用相同的 `describe` 和 `beforeEach` 结构

## 最佳实践

1. **使用 data-testid 属性**：为测试元素添加专用标识符
2. **避免依赖样式类**：使用结构化选择器而非 CSS 类
3. **合理设置超时**：根据实际加载时间调整超时设置
4. **模块化测试**：将复杂测试分解为独立的测试用例
5. **清晰的断言**：每个测试用例有明确的验证目标