## SSR ( server-side rendering ) 同构
- SEO (SEM)
- Performance（LCP、 INP、 CLS）

## SSR框架
   - Next.js
   - 自定义SSR框架（币安、okx、bybit、bitget、shopee、今日头条、淘宝）
### ssr的核心
1. 路由定义
2. 数据获取

### Nextjs
### 自定义SSR
#### 应用场景
 nextjs能满足就用nextjs
- nextjs逐渐封闭，很多高级的特性只能在vercel基础上：
   - edge：vercl
   - ISR：vercel， opennext
- 极致的性能：100-150ms => 自定义SSR ，40 - 60ms
- 复杂的场景
 - 老项目 CSR 迁移 SSR
 - 微前端
   - module federation
   - 分布式并发渲染: taobao, shopee, baidu
- SRI
- 冷启动： serverless，nextjs13后 4-5s ，自定义SSR 800ms
- 高可用
 - 高并发：10W qps，nextjs扩容不起来 慢
 - 服务降级：SSR崩了(window document) => CSR
 - 容错: try catch, promiserejection
 - 熔断: 异常时候缩小影响范围：opossum



#### 自定义SSR远离
1. 项目构建
   1. 客户端构建 webpack
   2. 服务端构建 webpack
2. http服务
   1. koa
      1. 开发环境：nodemon
      2. 生产部署：serverless：
         - aws lambda
         - cloudflare workers
3. 应用渲染
   - 路由定义
   - 数据获取
   - nodejs koa middleware
     - 日志收集/打印
     - 301 302 重定向
     - 错误处理
   

作业：
1. nextjs 做一个 博客的两个页面，一个是文章列表页，一个是文章详情页，msw
2. 看一下 自定义ssr webpack部分代码