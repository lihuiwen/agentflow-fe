# AgentFlow-FE

高性能自定义 React SSR（服务端渲染）框架

## 🚀 项目概述

AgentFlow-FE 是一个专为大型应用场景设计的高性能、高度可定制的服务端渲染框架，具有以下核心性能指标：

- **响应时间**：40-60ms（相比 Next.js 的 100-150ms）
- **冷启动**：800ms（相比 Next.js 的 4-5s）  
- **高并发**：支持 10W+ QPS

## 📦 技术栈

### 核心运行时
- React 18.3.1 - UI 框架
- Koa 2.14.1 - 服务器框架
- React Query 4.29.3 - 服务端状态管理
- React Router DOM 6.10.0 - 客户端路由

### SSR 基础设施
- @loadable/component - 代码分割
- Styled Components - CSS-in-JS
- Emotion - CSS-in-JS 引擎
- Material-UI - 组件库
- React Helmet - SEO 元标签管理

### 构建工具
- Webpack 5 - 模块打包器
- Babel 7 - JavaScript 编译器
- TypeScript 5 - 类型安全
- Tailwind CSS 4 - CSS 框架

## 🛠️ 快速开始

### 安装依赖
```bash
npm install
```

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

## 🏗️ 项目架构

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
├── pages/            # 页面组件
├── components/       # 可复用 UI 组件
├── routes/           # 路由定义和懒加载
├── apis/             # API 服务和数据获取
├── types/            # TypeScript 类型定义
└── theme/            # 主题和样式配置

config/
├── webpack.config.js # 基础 webpack 配置
├── webpack.dev.js    # 开发环境配置
├── webpack.prod.js   # 生产环境配置
└── env/              # 环境特定配置
```

### 双重构建系统
- **客户端构建**：浏览器端的 JavaScript 和 CSS 包
- **服务端构建**：Node.js 服务器端代码
- 使用 Webpack 多配置实现真正的同构渲染

### SSR 流程
```
路由匹配 → 数据预取 → 组件渲染 → HTML 生成 → 客户端水合
```

## 🎯 核心特性

### 性能优化
- **包优化**：Thread-loader 并行处理、Webpack 文件系统缓存
- **运行时优化**：关键 CSS 提取、路由级代码分割
- **样式处理**：Styled Components 样式收集、Emotion 关键 CSS 提取

### 代码分割
- 使用 `@loadable/component` 进行路由级代码分割
- Webpack 自动生成 chunk
- SSR chunk 收集和 Loadable 统计信息生成

### 热模块替换 (HMR)
- React 组件热重载
- Webpack Dev Server 集成
- 服务器端代码自动重启

## 🔧 路径别名

项目配置了以下路径别名以实现清晰的导入：

```typescript
"@app/*" → "app/*"
"@/*" → "src/*"
"@components/*" → "src/components/*"
"@pages/*" → "src/pages/*"
"@utils/*" → "src/utils/*"
"@apis/*" → "src/apis/*"
"@types/*" → "src/types/*"
```

## 🎨 样式架构

支持多种样式解决方案：

- **MUI 组件**：Material-UI 组件库，针对 SSR 优化
- **Emotion**：CSS-in-JS，服务端关键 CSS 提取
- **Styled Components**：组件级样式，支持 SSR
- **Tailwind CSS**：实用优先的 CSS 框架
- **LESS**：预处理器，支持 CSS 模块

## 🧪 测试和质量保证

### 可用脚本
- **ESLint**：代码检查，包含 React 特定规则
- **TypeScript**：类型检查
- **Prettier**：代码格式化

### Mock 数据
- JSON Server 用于 API 模拟（`npm run mock`）
- Mock 数据位于 `mocks/data.json`

## 🚀 部署方式

### 支持的部署选项
1. **传统服务器**：PM2 进程管理
2. **Serverless**：AWS Lambda 支持
3. **容器化**：Docker 就绪配置

### 生产优化
- Webpack 生产优化
- CSS 提取和压缩
- Tree shaking 和死代码消除
- 资源优化（图片、字体）

## 🌍 多环境支持

支持多种环境配置：
- `local` - 本地开发
- `test` - 测试环境
- `beta` - 预发布环境
- `online` - 生产环境

## ⚠️ 重要说明

### SSR 特定考虑
- 服务器和客户端使用独立的 webpack 配置
- Emotion 缓存序列化防止 FOUC（无样式内容闪烁）
- LoadablePlugin 为服务端 chunk 加载生成清单
- SSR 失败时的服务降级回退

### 环境差异
- **开发环境**：使用 webpack-dev-middleware 进行 HMR
- **生产环境**：使用预构建的静态资源
- **部署模式**：服务器和 serverless 使用不同入口点

## 📄 许可证

[添加许可证信息]

## 🤝 贡献

[添加贡献指南]

---

AgentFlow-FE 是一个复杂的 SSR 框架，优先考虑性能和定制化，适合需要对渲染行为进行精细控制的大型生产应用。
