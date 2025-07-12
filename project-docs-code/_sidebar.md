- [🏠 首页](README.md)

## 📁 第一部分：目录结构深度分析

- **🗂️ 项目结构总览**
  - [整体架构设计](01-structure/01-overview.md)
  - [目录职责划分](01-structure/02-directory-roles.md)
  - [模块间关系分析](01-structure/03-module-relationships.md)
  - [设计合理性评估](01-structure/04-design-evaluation.md)

- **📦 app/ 目录深度分析**
  - [app/client 客户端入口](01-structure/app/01-client.md)
  - [app/server 服务端核心](01-structure/app/02-server.md)
  - [app/utils 工具函数](01-structure/app/03-utils.md)

- **🎯 src/ 业务代码分析**
  - [src/pages 页面组件](01-structure/src/01-pages.md)
  - [src/components 通用组件](01-structure/src/02-components.md)
  - [src/routes 路由配置](01-structure/src/03-routes.md)
  - [src/apis API 层设计](01-structure/src/04-apis.md)
  - [src/theme 主题系统](01-structure/src/05-theme.md)

- **⚙️ config/ 配置分析**
  - [webpack 配置架构](01-structure/config/01-webpack.md)
  - [环境配置策略](01-structure/config/02-env.md)

## 🔍 第二部分：代码设计深度解析

- **🏗️ 核心实现分析**
  - [SSR 渲染流程深度解析](02-code/01-ssr-deep-dive.md)
  - [双重构建系统实现](02-code/02-dual-build.md)
  - [代码分割与懒加载](02-code/03-code-splitting.md)
  - [样式系统集成方案](02-code/04-style-integration.md)

- **🔄 数据流设计**
  - [React Query 集成分析](02-code/05-react-query.md)
  - [状态管理策略](02-code/06-state-management.md)
  - [服务端数据预取](02-code/07-data-prefetch.md)
  - [客户端水合机制](02-code/08-hydration.md)

- **⚡ 性能优化实现**
  - [关键渲染路径优化](02-code/09-critical-rendering.md)
  - [缓存策略实现](02-code/10-caching.md)
  - [Bundle 优化技术](02-code/11-bundle-optimization.md)

- **🛠️ 工程化实践**
  - [开发环境配置](02-code/12-dev-environment.md)
  - [错误处理机制](02-code/13-error-handling.md)
  - [类型系统设计](02-code/14-type-system.md)

## 🎯 第三部分：架构优化建议

- **🔧 整体架构优化**
  - [架构层面优化点](03-optimization/01-architecture.md)
  - [性能瓶颈分析](03-optimization/02-performance-bottlenecks.md)
  - [可维护性提升](03-optimization/03-maintainability.md)
  - [安全性加固](03-optimization/04-security.md)

- **📦 模块级优化**
  - [构建系统优化](03-optimization/05-build-optimization.md)
  - [代码组织优化](03-optimization/06-code-organization.md)
  - [API 设计优化](03-optimization/07-api-optimization.md)
  - [组件设计优化](03-optimization/08-component-optimization.md)

- **🚀 运行时优化**
  - [服务端性能优化](03-optimization/09-server-optimization.md)
  - [客户端性能优化](03-optimization/10-client-optimization.md)
  - [内存使用优化](03-optimization/11-memory-optimization.md)

## 🚀 第四部分：扩展性设计

- **🎨 架构扩展方向**
  - [微前端集成 (Module Federation)](04-extensions/01-micro-frontend.md)
  - [流式渲染实现](04-extensions/02-streaming-ssr.md)
  - [边缘计算适配](04-extensions/03-edge-computing.md)
  - [PWA 集成方案](04-extensions/04-pwa-integration.md)

- **📱 功能扩展**
  - [国际化系统扩展](04-extensions/05-i18n-system.md)
  - [主题系统增强](04-extensions/06-theme-enhancement.md)
  - [权限系统集成](04-extensions/07-auth-system.md)
  - [实时通信集成](04-extensions/08-realtime-communication.md)

- **🔧 工程化扩展**
  - [监控系统集成](04-extensions/09-monitoring.md)
  - [测试体系完善](04-extensions/10-testing-system.md)
  - [CI/CD 流程优化](04-extensions/11-cicd-enhancement.md)
  - [文档系统自动化](04-extensions/12-docs-automation.md)

## 📖 第五部分：实战应用指南

- **🔄 项目迁移策略**
  - [老项目 CSR→SSR 迁移](05-practices/01-csr-to-ssr-migration.md)
  - [Next.js 项目迁移](05-practices/02-nextjs-migration.md)
  - [Create React App 迁移](05-practices/03-cra-migration.md)
  - [Vite 项目迁移](05-practices/04-vite-migration.md)

- **🎯 使用场景分析**
  - [电商平台应用](05-practices/05-ecommerce-platform.md)
  - [企业官网建设](05-practices/06-corporate-website.md)
  - [内容管理系统](05-practices/07-cms-application.md)
  - [大型 Web 应用](05-practices/08-large-web-app.md)

- **🚀 部署实战**
  - [云服务器部署](05-practices/09-cloud-deployment.md)
  - [容器化部署](05-practices/10-docker-deployment.md)
  - [Serverless 部署](05-practices/11-serverless-deployment.md)
  - [CDN 优化策略](05-practices/12-cdn-optimization.md)

- **🔍 故障排查指南**
  - [常见问题解决](05-practices/13-troubleshooting.md)
  - [性能问题诊断](05-practices/14-performance-diagnosis.md)
  - [生产环境调试](05-practices/15-production-debugging.md)