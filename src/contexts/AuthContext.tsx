import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  email?: string
  rollNumber?: string
  type: 'student' | 'employee'
  branch?: string
  academicYear?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: any, type: 'student' | 'employee') => Promise<boolean>
  logout: () => void
  syncData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('currentUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials: any, type: 'student' | 'employee'): Promise<boolean> => {
    try {
      setLoading(true)
      
      if (type === 'student') {
        const response = await api.post('/api/student/auth', {
          rollNumber: credentials.rollNumber,
          password: credentials.password
        })
        
        if (response.data.success) {
          const userData: User = {
            id: credentials.rollNumber,
            name: response.data.student.name,
            rollNumber: response.data.student.rollNumber,
            type: 'student',
            branch: response.data.student.branch,
            academicYear: response.data.student.academicYear
          }
          setUser(userData)
          localStorage.setItem('currentUser', JSON.stringify(userData))
          return true
        }
      } else {
        const response = await api.post('/api/employee/auth', {
          email: credentials.email,
          password: credentials.password
        })
        
        if (response.data.success) {
          const userData: User = {
            id: credentials.email,
            name: credentials.email.split('@')[0],
            email: credentials.email,
            type: 'employee'
          }
          setUser(userData)
          localStorage.setItem('currentUser', JSON.stringify(userData))
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    // Clear any other stored data
    localStorage.removeItem('studentData')
    localStorage.removeItem('employeeData')
  }

  const syncData = async () => {
    // This function can be used to sync data across devices
    if (user?.type === 'student' && user.rollNumber) {
      try {
        const response = await api.get(`/api/student/payment-details/${user.rollNumber}`)
        if (response.data.success) {
          localStorage.setItem('studentData', JSON.stringify(response.data))
        }
      } catch (error) {
        console.error('Sync error:', error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, syncData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}