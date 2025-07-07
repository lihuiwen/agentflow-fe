# AgentFlow 路由配置说明

## 🗺️ 路由结构总览

```
/ (Layout)
├── / (index) → Home                    # 首页
├── /agents                             # Agent管理模块
│   ├── /agents (index) → Agents        # Agent列表
│   ├── /agents/new → AgentForm         # 新增Agent
│   ├── /agents/:id → AgentDetail       # Agent详情
│   └── /agents/:id/edit → AgentForm    # 编辑Agent
├── /jobs                               # Job管理模块  
│   ├── /jobs (index) → Jobs            # Job列表
│   ├── /jobs/new → JobForm             # 新增Job
│   ├── /jobs/:id → JobDetail           # Job详情
│   └── /jobs/:id/edit → JobForm        # 编辑Job
├── /about → About                      # 关于页面
└── /* → NotFound                       # 404页面
```

## 📋 路由详细说明

### 🏠 首页模块
| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页，展示功能概览 |

### 🤖 Agent管理模块
| 路径 | 组件 | 说明 |
|------|------|------|
| `/agents` | Agents | Agent列表页面 |
| `/agents/new` | AgentForm | 新增Agent表单 |
| `/agents/:id` | AgentDetail | Agent详情页面 |
| `/agents/:id/edit` | AgentForm | 编辑Agent表单 |

### 📋 Job管理模块
| 路径 | 组件 | 说明 |
|------|------|------|
| `/jobs` | Jobs | Job列表页面 |
| `/jobs/new` | JobForm | 新增Job表单 |
| `/jobs/:id` | JobDetail | Job详情页面 |
| `/jobs/:id/edit` | JobForm | 编辑Job表单 |

### 🔧 其他页面
| 路径 | 组件 | 说明 |
|------|------|------|
| `/about` | About | 关于页面 |
| `/*` | NotFound | 404错误页面 |

## 🎯 路由特性

### ✅ 已实现的特性

1. **嵌套路由结构**
   - 使用React Router v6的嵌套路由
   - 清晰的模块化组织

2. **懒加载**
   - 使用@loadable/component进行代码分割
   - 提升首屏加载性能

3. **Layout包装**
   - 所有页面都使用统一的Layout组件
   - 包含导航栏和页脚

4. **404处理**
   - 通配符路由捕获未匹配路径
   - 友好的错误页面

5. **表单复用**
   - AgentForm组件同时处理新增和编辑
   - JobForm组件同时处理新增和编辑

### 🔄 表单路由逻辑

```typescript
// AgentForm组件中的逻辑
const { id } = useParams(); // 从URL获取参数
const isEditing = id !== 'new'; // 判断是新增还是编辑

// 路由示例：
// /agents/new      → isEditing = false (新增模式)
// /agents/123/edit → isEditing = true  (编辑模式)
```

## 🚀 使用示例

### 导航跳转
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 跳转到Agent列表
navigate('/agents');

// 跳转到新增Agent
navigate('/agents/new');

// 跳转到编辑Agent
navigate(`/agents/${agentId}/edit`);

// 返回上一页
navigate(-1);
```

### Link组件
```tsx
import { Link } from 'react-router-dom';

// 导航链接
<Link to="/agents">Agent管理</Link>
<Link to="/agents/new">新增Agent</Link>
<Link to={`/agents/${id}`}>查看详情</Link>
```

### 获取路由参数
```typescript
import { useParams } from 'react-router-dom';

// 在AgentDetail组件中
const { id } = useParams<{ id: string }>();
// URL: /agents/123 → id = "123"
```

## 🛠️ 路由配置源码

```typescript
// src/routes/index.tsx
const routes: PreFetchRouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      // 首页
      { index: true, element: <Home /> },
      
      // Agent模块
      {
        path: "agents",
        children: [
          { index: true, element: <Agents /> },
          { path: "new", element: <AgentForm /> },
          { path: ":id", element: <AgentDetail /> },
          { path: ":id/edit", element: <AgentForm /> },
        ],
      },
      
      // Job模块
      {
        path: "jobs", 
        children: [
          { index: true, element: <Jobs /> },
          { path: "new", element: <JobForm /> },
          { path: ":id", element: <JobDetail /> },
          { path: ":id/edit", element: <JobForm /> },
        ],
      },
      
      // 其他
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
```

## 📝 注意事项

1. **参数验证**: 建议在组件中验证路由参数的有效性
2. **权限控制**: 可以在路由层面添加权限检查
3. **面包屑**: 可以基于路由结构自动生成面包屑导航
4. **SEO优化**: 每个页面应该设置合适的title和meta信息

## 🔄 扩展建议

### 添加权限路由
```typescript
// 可以添加权限检查的高阶组件
const ProtectedRoute = ({ children, permission }) => {
  // 权限检查逻辑
  return hasPermission(permission) ? children : <Unauthorized />;
};
```

### 添加面包屑
```typescript
// 基于路由自动生成面包屑
const breadcrumbMap = {
  '/agents': 'Agent管理',
  '/agents/new': '新增Agent', 
  '/jobs': 'Job管理',
  // ...
};
``` 