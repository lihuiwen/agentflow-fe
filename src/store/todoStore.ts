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