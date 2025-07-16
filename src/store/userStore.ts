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
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn, 
        theme: state.theme 
      }),
    }
  )
)