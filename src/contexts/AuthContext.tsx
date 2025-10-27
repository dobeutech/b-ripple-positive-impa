import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/types'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useKV<User[]>('users', [])
  const [currentUserId, setCurrentUserId] = useKV<string | null>('currentUserId', null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    if (currentUserId && users) {
      const user = users.find(u => u.id === currentUserId)
      setCurrentUser(user || null)
    } else {
      setCurrentUser(null)
    }
  }, [currentUserId, users])

  const signup = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    const existingUser = users?.find(u => u.email === userData.email)
    if (existingUser) {
      return false
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName,
      username: userData.username,
      avatarUrl: userData.avatarUrl,
      verificationStatus: 'email-verified',
      interests: userData.interests || [],
      createdAt: new Date().toISOString(),
      isAnonymousUser: false
    }

    await setUsers((currentUsers) => [...(currentUsers || []), newUser])
    await setCurrentUserId(newUser.id)
    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = users?.find(u => u.email === email)
    if (user) {
      await setCurrentUserId(user.id)
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUserId(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return

    await setUsers((currentUsers) =>
      (currentUsers || []).map(u =>
        u.id === currentUser.id ? { ...u, ...updates } : u
      )
    )
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
