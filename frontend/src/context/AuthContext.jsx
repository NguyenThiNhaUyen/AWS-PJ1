import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, accountAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (token && savedUser) {
        // Verify token is still valid by making a request
        const userData = await accountAPI.getMe()
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        // Clear any stale data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data
        
        // Save to localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Update state
        setUser(userData)
        setIsAuthenticated(true)
        
        return true
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle different error types
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại.')
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      
      if (response.success) {
        return true
      } else {
        throw new Error(response.message || 'Đăng ký thất bại')
      }
    } catch (error) {
      console.error('Register error:', error)
      
      // Handle different error types
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Đăng ký thất bại. Vui lòng thử lại.')
      }
    }
  }

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Update state
      setUser(null)
      setIsAuthenticated(false)
      
      // Optional: Call server logout endpoint
      // authAPI.logout().catch(console.error)
      
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
