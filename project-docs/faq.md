# 常见问题解答 (FAQ)

## 🤔 通用问题

### Q: 为什么选择自定义 SSR 而不是 Next.js？

**A:** 自定义 SSR 适合以下场景：
- 需要极致的性能优化（40-60ms 响应时间）
- 复杂的业务逻辑需要完全控制渲染流程
- 大型应用需要高并发处理能力（10W+ QPS）
- 需要灵活的部署策略（传统服务器、Serverless、容器等）
- 老项目从 CSR 迁移到 SSR 需要渐进式改造

### Q: 这个框架的学习成本如何？

**A:** 学习成本取决于背景：
- **React 开发者**: 主要学习 SSR 概念和构建配置，学习成本中等
- **Node.js 开发者**: 需要学习 React 和前端构建工具，学习成本较高
- **Full Stack 开发者**: 学习成本较低，主要了解框架特性即可

### Q: 性能优势真的这么明显吗？

**A:** 是的，性能优势主要体现在：
- **首屏渲染**: 服务端直出 HTML，减少白屏时间
- **SEO 友好**: 搜索引擎可以直接抓取完整内容
- **缓存策略**: 多层缓存提升响应速度
- **代码分割**: 按需加载减少初始包体积

## 🔧 开发问题

### Q: 如何处理客户端和服务端的环境差异？

**A:** 几种常见的处理方式：

```javascript
// 1. 使用环境判断
if (typeof window !== 'undefined') {
  // 客户端代码
} else {
  // 服务端代码
}

// 2. 使用 useEffect 处理客户端逻辑
useEffect(() => {
  // 只在客户端执行
}, []);

// 3. 使用动态导入
const ClientOnlyComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false
});
```

### Q: 如何处理样式闪烁问题？

**A:** 使用 styled-components 的 SSR 配置：

```javascript
// 服务端收集样式
const sheet = new ServerStyleSheet();
const jsx = sheet.collectStyles(<App />);
const styleTags = sheet.getStyleTags();

// 客户端注入样式
// 样式会在服务端渲染时注入，避免闪烁
```

### Q: 如何调试 SSR 应用？

**A:** 调试技巧：

```bash
# 1. 查看服务端渲染日志
npm run dev

# 2. 查看客户端水合过程
# 在浏览器开发者工具中查看 Console

# 3. 使用 React DevTools
# 安装 React DevTools 浏览器扩展

# 4. 调试构建过程
npm run build -- --verbose
```

## 🚀 部署问题

### Q: 如何部署到生产环境？

**A:** 多种部署方式：

```bash
# 1. 传统服务器部署
npm run build
npm start

# 2. PM2 部署
pm2 start ecosystem.config.js

# 3. Docker 容器部署
docker build -t custom-ssr .
docker run -p 3001:3001 custom-ssr

# 4. Serverless 部署
# 使用 serverless.ts 入口文件
```

### Q: 如何配置 CDN？

**A:** 配置静态资源 CDN：

```javascript
// webpack.config.js
module.exports = {
  output: {
    publicPath: process.env.CDN_URL || '/static/',
  },
};

// 环境变量
CDN_URL=https://cdn.example.com/static/
```

### Q: 如何处理 HTTPS 和安全问题？

**A:** 安全配置：

```javascript
// 添加安全头
app.use((ctx, next) => {
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  return next();
});

// HTTPS 重定向
app.use((ctx, next) => {
  if (ctx.header['x-forwarded-proto'] !== 'https') {
    return ctx.redirect(`https://${ctx.header.host}${ctx.url}`);
  }
  return next();
});
```

## 📊 性能问题

### Q: 如何优化首屏加载速度？

**A:** 优化策略：

```javascript
// 1. 关键资源预加载
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/critical.js" as="script">

// 2. 代码分割
const LazyComponent = loadable(() => import('./LazyComponent'));

// 3. 图片优化
<img src="/image.webp" alt="optimized" loading="lazy">

// 4. 服务端缓存
const cache = new Map();
app.use(async (ctx, next) => {
  const key = ctx.url;
  if (cache.has(key)) {
    ctx.body = cache.get(key);
    return;
  }
  await next();
  cache.set(key, ctx.body);
});
```

### Q: 内存使用过高怎么办？

**A:** 内存优化：

```javascript
// 1. 及时清理 React Query 缓存
queryClient.clear();

// 2. 避免内存泄漏
useEffect(() => {
  return () => {
    // 清理副作用
  };
}, []);

// 3. 监控内存使用
process.on('warning', (warning) => {
  console.warn('Memory Warning:', warning);
});
```

## 🔍 错误处理

### Q: SSR 渲染失败如何处理？

**A:** 错误处理策略：

```javascript
// 服务端渲染失败降级到 CSR
router.get('(.*)', async (ctx) => {
  try {
    const appContent = await renderToString(jsx);
    ctx.body = renderHtml({ appContent });
  } catch (error) {
    console.error('SSR failed:', error);
    // 降级到 CSR
    ctx.body = renderHtml({ 
      appContent: '<div id="root"></div>',
      isSSR: false 
    });
  }
});
```

### Q: 如何处理异步数据错误？

**A:** 数据错误处理：

```javascript
// 使用 React Query 的错误处理
const { data, error, isLoading } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: 3,
  retryDelay: 1000,
});

if (error) {
  return <ErrorBoundary error={error} />;
}
```

## 📝 开发工具

### Q: 推荐的开发工具有哪些？

**A:** 推荐工具：

- **编辑器**: VS Code + React/TypeScript 扩展
- **调试**: React DevTools + Chrome DevTools
- **性能**: Lighthouse + Web Vitals
- **构建分析**: webpack-bundle-analyzer
- **代码质量**: ESLint + Prettier
- **版本控制**: Git + Husky

### Q: 如何设置开发环境？

**A:** 环境设置：

```bash
# 1. 安装 Node.js (推荐 16+)
node --version

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local

# 4. 启动开发服务
npm run dev
```

## 🎯 最佳实践

### Q: 有什么开发建议吗？

**A:** 最佳实践：

1. **组件设计**: 保持组件的纯函数特性
2. **数据获取**: 使用 React Query 管理服务端状态
3. **错误边界**: 每个页面都要有错误边界
4. **性能监控**: 定期检查构建体积和运行时性能
5. **类型安全**: 充分利用 TypeScript 的类型系统
6. **测试**: 编写单元测试和集成测试

### Q: 如何贡献代码？

**A:** 贡献指南：

1. Fork 项目仓库
2. 创建功能分支
3. 编写代码和测试
4. 提交 Pull Request
5. 等待代码审查

---

## 📞 获取帮助

如果您遇到其他问题，可以：
- 查看 [GitHub Issues](https://github.com/your-repo/issues)
- 阅读 [项目文档](README.md)
- 联系项目维护者

**持续更新中...** 如果您有其他问题，欢迎提交 Issue！ 