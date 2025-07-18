import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthState {
  isAuthenticated: boolean

  authenticate: () => void
  unauthenticate: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,

      authenticate: () => set({ isAuthenticated: true }),
      unauthenticate: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'auth',
    }
  )
)
