# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 在该仓库中工作时提供指导。

## 项目概述

这是一个名为 AgentFlow-FE 的**自定义 React SSR（服务端渲染）框架** - 一个高性能、高度可定制的 Next.js 替代方案。该项目专为需要极致性能优化和高度定制化的大型应用场景而设计。

**核心性能指标：**
- 响应时间：40-60ms（相比 Next.js 的 100-150ms）
- 冷启动：800ms（相比 Next.js 的 4-5s）
- 高并发：支持 10W+ QPS

## 常用命令

### 开发环境
```bash
# 启动开发环境（webpack 构建监听 + nodemon 服务器）
npm run dev

# 启动 Mock API 服务器（端口 8007）
npm run mock

# 启动文档服务器
npm run docs
```

### 构建
```bash
# 构建生产版本（线上环境）
npm run build

# 多环境构建
npm run build:online  # 线上环境
npm run build:beta    # 测试环境
npm run build:test1   # 测试环境1
```

### 生产环境
```bash
# 使用 PM2 启动生产服务器
npm start
```

## 架构概览

### 核心架构组件

1. **双重构建系统**
   - **客户端构建**：浏览器端的 JavaScript 和 CSS 包
   - **服务端构建**：Node.js 服务器端代码
   - 使用 Webpack 多配置实现真正的同构渲染

2. **SSR 流程**
   ```
   路由匹配 → 数据预取 → 组件渲染 → HTML 生成 → 客户端水合
   ```

3. **核心技术栈**
   - **服务端**：Koa.js + Node.js
   - **前端**：React 18 + TypeScript
   - **状态管理**：React Query 用于服务端状态
   - **路由**：React Router DOM v6
   - **样式**：Styled Components + Emotion + Tailwind CSS + MUI
   - **构建**：Webpack 5 + Babel
   - **代码分割**：@loadable/component

### 目录结构

```
app/
├── client/           # 客户端入口和水合逻辑
├── server/           # 服务端渲染逻辑
│   ├── index.tsx     # 主要 SSR 渲染器
│   ├── app.tsx       # 应用配置
│   ├── html.tsx      # HTML 模板生成
│   ├── server.ts     # 服务器入口
│   └── serverless.ts # Serverless 部署
└── utils/            # 共享工具函数

src/
├── pages/            # 页面组件（Agents, Jobs, Home）
├── components/       # 可复用 UI 组件
├── routes/           # 路由定义和懒加载
├── apis/             # API 服务和数据获取
├── types/            # TypeScript 类型定义
└── theme/            # 主题和样式配置

config/
├── webpack.config.js # 基础 webpack 配置
├── webpack.dev.js    # 开发环境 webpack 配置
├── webpack.prod.js   # 生产环境 webpack 配置
└── env/              # 环境特定配置
```

## 关键实现细节

### SSR 渲染流程 (app/server/index.tsx)

SSR 流程处理以下内容：
- **Styled Components** 样式收集
- **@loadable/component** 代码分割的 chunk 收集
- **Emotion** 关键 CSS 提取和缓存序列化
- **React Query** 状态脱水
- **React Helmet** SEO 元标签管理
- 错误处理和服务降级（SSR → CSR 回退）

### 路由配置 (src/routes/index.tsx)

- 使用 React Router v6 嵌套路由
- 通过 `@loadable/component` 实现懒加载
- 支持动态路由参数（`:id`）
- 包含 Agent 和 Job 管理的专用路由
- 内置 404 处理

### 客户端水合 (app/client/index.tsx)

- 通过 `tradeFlag.isSSR` 检测 SSR vs CSR 模式
- 使用 `loadableReady()` 进行代码分割组件同步
- 支持 React 18 的 `hydrateRoot`（SSR）或 `createRoot`（CSR）

### 路径别名 (tsconfig.json)

项目使用大量路径别名以实现清晰的导入：
- `@app/*` → `app/*`
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@utils/*` → `src/utils/*`
- `@apis/*` → `src/apis/*`
- `@types/*` → `src/types/*`

## 开发工作流

### 热模块替换 (HMR)
- 开发服务器支持 React 组件热重载
- Webpack Dev Server 与 Express 中间件集成
- 通过 nodemon 自动重启服务器端代码

### 代码分割策略
- 使用 `@loadable/component` 进行路由级代码分割
- Webpack 自动生成 chunk
- 为 SSR chunk 收集生成 Loadable 统计信息

### 样式架构
- **MUI 组件**：Material-UI 组件库，针对 SSR 优化
- **Emotion**：CSS-in-JS，服务端关键 CSS 提取
- **Styled Components**：组件级样式，支持 SSR
- **Tailwind CSS**：实用优先的 CSS 框架
- **LESS**：预处理器，支持 CSS 模块

### 环境配置
- 多环境支持（local, test, beta, online）
- 环境特定的 webpack 配置
- 从 `config/env/` 加载环境变量

## 测试和质量保证

### 可用的质量保证脚本
- **ESLint**：代码检查，包含 React 特定规则
- **TypeScript**：类型检查，为灵活性禁用严格模式
- **Prettier**：代码格式化集成

### Mock 数据
- JSON Server 用于 API 模拟（`npm run mock`）
- Mock 数据位于 `mocks/data.json`

## 部署

### 支持的部署方式
1. **传统服务器**：PM2 进程管理
2. **Serverless**：通过 `app/server/serverless.ts` 支持 AWS Lambda
3. **容器化**：Docker 就绪配置

### 生产优化
- Webpack 生产优化
- CSS 提取和压缩
- Tree shaking 和死代码消除
- 资源优化（图片、字体）

## 核心依赖

### 核心运行时
- `react` (18.3.1) - UI 框架
- `koa` (2.14.1) - 服务器框架
- `@tanstack/react-query` (4.29.3) - 服务端状态管理
- `react-router-dom` (6.10.0) - 客户端路由

### SSR 基础设施
- `@loadable/component` & `@loadable/server` (5.15.3) - 代码分割
- `styled-components` (5.3.9) - CSS-in-JS
- `@emotion/react` & `@emotion/server` (11.14.0) - Emotion CSS
- `@mui/material` (7.2.0) - Material-UI 组件
- `react-helmet-async` (1.3.0) - SEO 元标签管理

### 构建工具
- `webpack` (5.78.0) - 模块打包器
- `babel` (7.21.4) - JavaScript 编译器
- `typescript` (5.0.3) - 类型安全
- `tailwindcss` (4.1.11) - CSS 框架

## 性能优化

### 包优化
- Thread-loader 进行并行处理
- Webpack 文件系统缓存
- 使用 MiniCssExtractPlugin 进行 CSS 提取
- 图片优化和资源处理

### 运行时优化
- 服务端渲染和水合
- 关键 CSS 提取
- 路由级代码分割
- React Query 缓存策略

## 重要说明

### SSR 特定考虑
- 服务器和客户端构建使用独立的 webpack 配置
- Emotion 缓存序列化防止 FOUC（无样式内容闪烁）
- LoadablePlugin 为服务端 chunk 加载生成清单
- SSR 失败时的服务降级回退

### 开发环境 vs 生产环境
- 开发环境使用 webpack-dev-middleware 进行 HMR
- 生产环境使用预构建的静态资源
- 服务器和 serverless 部署使用不同的入口点

这是一个复杂的 SSR 框架，优先考虑性能和定制化而非约定，使其适合需要对渲染行为进行精细控制的大型生产应用。