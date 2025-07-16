import React, { useState } from 'react'
import { useCounterStore, useUserStore, useTodoStore } from '@/store'

const ZustandDemo: React.FC = () => {
  const { count, increment, decrement, reset } = useCounterStore()
  const { user, isLoggedIn, theme, login, logout, toggleTheme } = useUserStore()
  const { todos, addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted, getFilteredTodos } = useTodoStore()
  
  const [todoText, setTodoText] = useState('')
  const [userForm, setUserForm] = useState({
    name: '',
    email: ''
  })

  const handleLogin = () => {
    if (userForm.name && userForm.email) {
      login({
        id: Date.now(),
        name: userForm.name,
        email: userForm.email
      })
      setUserForm({ name: '', email: '' })
    }
  }

  const handleAddTodo = () => {
    if (todoText.trim()) {
      addTodo(todoText)
      setTodoText('')
    }
  }

  const filteredTodos = getFilteredTodos()

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-3xl font-bold mb-8">Zustand Demo</h1>
      
      {/* Counter Store Demo */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Counter Store</h2>
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -
          </button>
          <span className="text-2xl font-bold">{count}</span>
          <button 
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +
          </button>
          <button 
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* User Store Demo */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">User Store (with Persistence)</h2>
        <div className="mb-4">
          <button 
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
          >
            Toggle Theme ({theme})
          </button>
        </div>
        
        {!isLoggedIn ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full px-3 py-2 border rounded text-black"
            />
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full px-3 py-2 border rounded text-black"
            />
            <button 
              onClick={handleLogin}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2">Welcome, {user?.name}!</p>
            <p className="mb-4">Email: {user?.email}</p>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Todo Store Demo */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Todo Store (with Immer)</h2>
        
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a new todo..."
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            className="flex-1 px-3 py-2 border rounded text-black"
          />
          <button 
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Completed
          </button>
          <button 
            onClick={clearCompleted}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Completed
          </button>
        </div>

        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ZustandDemo