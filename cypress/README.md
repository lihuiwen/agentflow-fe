# Cypress 测试指南

## 目录结构

```
cypress/
├── e2e/                    # E2E 测试文件
│   └── pages/             # 页面测试
│       └── requestDemo.cy.ts  # RequestDemo 页面测试
├── fixtures/              # 测试数据
│   └── requestDemo.json   # RequestDemo 相关测试数据
├── support/               # 支持文件
│   ├── commands.ts        # 自定义命令
│   └── e2e.ts            # E2E 支持文件
└── README.md             # 本文档
```

## 运行测试

### 前置条件
确保项目运行在 `http://localhost:3000`：
```bash
npm run dev
```

### 运行 Cypress 测试
```bash
# 打开 Cypress Test Runner (GUI 模式)
npx cypress open

# 运行所有测试 (无头模式)
npx cypress run

# 运行特定测试文件
npx cypress run --spec "cypress/e2e/pages/requestDemo.cy.ts"
```

## 测试内容

### RequestDemo 页面测试 (`requestDemo.cy.ts`)
- ✅ 页面标题和副标题显示
- ✅ 加密货币列表正确加载 (BTC, ETH, MEME, DOGE)
- ✅ 列表项内容验证和顺序检查
- ✅ 点击事件处理和console.log验证
- ✅ 页面加载状态和数据等待
- ✅ 可访问性检查
- ✅ SSR到CSR过渡测试

## 自定义命令

项目提供了以下自定义 Cypress 命令：

- `cy.waitForPageLoad()` - 等待页面加载完成
- `cy.waitForReactQuery()` - 检查 React Query 加载状态
- `cy.checkSSRContent(selector, text)` - 验证 SSR 渲染内容

## 最佳实践

1. **测试数据管理**: 使用 `fixtures/` 目录存储测试数据
2. **页面对象模式**: 将页面测试组织在 `e2e/pages/` 目录下
3. **自定义命令**: 将常用操作封装为自定义命令以提高复用性
4. **环境配置**: 在 `cypress.config.ts` 中配置不同环境的 baseUrl

## 注意事项

- 测试运行前确保 SSR 服务正在运行在 `http://localhost:3001`
- 针对 SSR 项目的特殊考虑：数据预取、水合等
- 测试 React Query 的数据加载状态
- 每个测试用例都会重新访问页面确保状态独立
- 使用 15 秒超时等待数据加载完成

## 故障排除

### 常见问题
1. **"ul element not found"** - 检查服务器是否运行在正确端口
2. **"React Query data loading timeout"** - 增加超时时间或检查数据源
3. **"SSR hydration issues"** - 确保客户端和服务端渲染一致

### 调试技巧
```bash
# 使用 GUI 模式调试
npx cypress open

# 查看详细日志
npx cypress run --spec "cypress/e2e/pages/requestDemo.cy.ts" --headed
```