# Zustand 使用指南

## 简介

Zustand 是一个小型、快速、灵活的状态管理库，专为 React 应用程序设计。它提供了一种简单而强大的方式来管理应用程序的状态，无需样板代码。

## 特性

- 🚀 **轻量级**: 压缩后仅 2.7KB
- 🎯 **简单**: 没有复杂的样板代码
- 📦 **TypeScript 支持**: 完全的类型安全
- 🔄 **中间件支持**: 支持持久化、Immer 等中间件
- 🧪 **测试友好**: 易于测试
- 🔧 **灵活**: 可以与任何 React 应用集成

## 安装

```bash
pnpm install zustand
```

## 基础用法

### 1. 创建简单的 Store

```typescript
// src/store/counterStore.ts
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
```

### 2. 在组件中使用

```tsx
import React from 'react'
import { useCounterStore } from '@/store'

const Counter = () => {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

## 中间件使用

### 1. 持久化中间件 (Persist)

```typescript
// src/store/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  theme: 'light' | 'dark'
  login: (user: User) => void
  logout: () => void
  toggleTheme: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      theme: 'light',
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
    }),
    {
      name: 'user-storage', // localStorage 中的键名
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn, 
        theme: state.theme 
      }), // 选择要持久化的状态
    }
  )
)
```

### 2. Immer 中间件

```typescript
// src/store/todoStore.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  clearCompleted: () => void
  getFilteredTodos: () => Todo[]
}

export const useTodoStore = create<TodoState>()(
  immer((set, get) => ({
    todos: [],
    filter: 'all',
    addTodo: (text) =>
      set((state) => {
        // 使用 Immer，可以直接修改状态
        state.todos.push({
          id: Date.now().toString(),
          text,
          completed: false,
          createdAt: new Date(),
        })
      }),
    toggleTodo: (id) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id)
        if (todo) {
          todo.completed = !todo.completed
        }
      }),
    deleteTodo: (id) =>
      set((state) => {
        state.todos = state.todos.filter((t) => t.id !== id)
      }),
    setFilter: (filter) => set({ filter }),
    clearCompleted: () =>
      set((state) => {
        state.todos = state.todos.filter((t) => !t.completed)
      }),
    getFilteredTodos: () => {
      const { todos, filter } = get()
      switch (filter) {
        case 'active':
          return todos.filter((t) => !t.completed)
        case 'completed':
          return todos.filter((t) => t.completed)
        default:
          return todos
      }
    },
  }))
)
```

## 高级用法

### 1. 异步操作

```typescript
interface ApiState {
  data: any[]
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
}

const useApiStore = create<ApiState>((set, get) => ({
  data: [],
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
```

### 2. 选择器优化

```typescript
// 只订阅特定的状态片段
const count = useCounterStore(state => state.count)
const increment = useCounterStore(state => state.increment)

// 或者使用 shallow 比较
import { shallow } from 'zustand/shallow'

const { count, increment } = useCounterStore(
  (state) => ({ count: state.count, increment: state.increment }),
  shallow
)
```

### 3. 计算属性

```typescript
interface CartState {
  items: Array<{ id: string; price: number; quantity: number }>
  getTotalPrice: () => number
  getTotalItems: () => number
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  getTotalPrice: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  getTotalItems: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.quantity, 0)
  },
}))
```

## 最佳实践

### 1. 文件组织

```
src/
├── store/
│   ├── index.ts          # 统一导出
│   ├── counterStore.ts   # 计数器状态
│   ├── userStore.ts      # 用户状态
│   └── todoStore.ts      # 待办事项状态
```

### 2. 类型定义

```typescript
// 始终为 store 定义完整的 TypeScript 接口
interface StoreState {
  // 状态
  value: string
  // 动作
  setValue: (value: string) => void
  // 计算属性
  getUpperValue: () => string
}
```

### 3. 状态分离

```typescript
// 不要把所有状态放在一个 store 中
// 根据功能域分离状态

// ✅ 好的实践
const useAuthStore = create(...)     // 认证相关
const useUIStore = create(...)       // UI 相关
const useDataStore = create(...)     // 数据相关

// ❌ 避免
const useGlobalStore = create(...)   // 包含所有状态
```

### 4. 统一导出

```typescript
// src/store/index.ts
export { useCounterStore } from './counterStore'
export { useUserStore } from './userStore'
export { useTodoStore } from './todoStore'

// 使用时
import { useCounterStore, useUserStore } from '@/store'
```

## 测试

### 1. 基础测试

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounterStore } from '@/store'

test('should increment count', () => {
  const { result } = renderHook(() => useCounterStore())
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

### 2. 重置状态

```typescript
// 在测试前重置状态
beforeEach(() => {
  useCounterStore.getState().reset()
})
```

## 与其他状态管理库的比较

| 特性 | Zustand | Redux | Context API |
|------|---------|--------|-------------|
| 包大小 | 2.7KB | 47KB | 内置 |
| 样板代码 | 极少 | 大量 | 中等 |
| TypeScript | 优秀 | 良好 | 一般 |
| 开发者工具 | 支持 | 优秀 | 有限 |
| 学习曲线 | 平缓 | 陡峭 | 中等 |

## 性能优化

### 1. 使用选择器

```typescript
// ✅ 只订阅需要的状态
const count = useCounterStore(state => state.count)

// ❌ 订阅整个状态
const { count, increment, decrement, reset } = useCounterStore()
```

### 2. 使用 shallow 比较

```typescript
import { shallow } from 'zustand/shallow'

const { count, increment } = useCounterStore(
  (state) => ({ count: state.count, increment: state.increment }),
  shallow
)
```

### 3. 批量更新

```typescript
// 在一次 set 调用中更新多个状态
set((state) => ({
  loading: false,
  data: newData,
  error: null
}))
```

## 调试

### 1. 开发者工具

```typescript
import { devtools } from 'zustand/middleware'

const useStore = create(
  devtools(
    (set) => ({
      // store 定义
    }),
    {
      name: 'my-store', // 在开发者工具中显示的名称
    }
  )
)
```

### 2. 日志中间件

```typescript
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('Previous state:', get())
      set(...args)
      console.log('New state:', get())
    },
    get,
    api
  )

const useStore = create(log((set) => ({
  // store 定义
})))
```

## 常见问题

### 1. 状态不更新？

确保使用 `set` 函数来更新状态：

```typescript
// ✅ 正确
const increment = () => set((state) => ({ count: state.count + 1 }))

// ❌ 错误
const increment = () => {
  // 直接修改状态不会触发重新渲染
  state.count++
}
```

### 2. 持久化不工作？

检查中间件的使用顺序：

```typescript
// ✅ 正确的顺序
create(
  persist(
    devtools((set) => ({
      // store 定义
    })),
    { name: 'storage' }
  )
)
```

### 3. TypeScript 错误？

确保为 store 定义完整的接口：

```typescript
interface StoreState {
  value: string
  setValue: (value: string) => void
}

const useStore = create<StoreState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}))
```

## 示例应用

在项目中查看完整的示例：

- **基础计数器**: `src/store/counterStore.ts`
- **用户状态管理**: `src/store/userStore.ts`
- **待办事项管理**: `src/store/todoStore.ts`
- **演示组件**: `src/components/ZustandDemo/index.tsx`

## 参考资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand 中间件](https://github.com/pmndrs/zustand#middleware)
- [TypeScript 使用指南](https://github.com/pmndrs/zustand#typescript)

---

*本文档基于 Zustand 5.0.6 编写，适用于 React 18+ 项目。*