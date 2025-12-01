import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Will be proxied to localhost:8080 by Vite
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register
  register: async (userData) => {
    console.log('Register request payload:', userData)
    const response = await api.post('/auth/register', userData)
    console.log('Register response:', response.data)
    return response.data
  },

  // Logout (if needed for server-side logout)
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData)
    return response.data
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email?token=${token}`)
    return response.data
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  }
}

// Account API functions
export const accountAPI = {
  // Get current user info
  getMe: async () => {
    const response = await api.get('/account/me')
    return response.data
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/account/${id}`)
    return response.data
  },

  // Get user by username
  getUserByUsername: async (username) => {
    const response = await api.get(`/account/username/${username}`)
    return response.data
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/account/profile', profileData)
    return response.data
  }
}

export default api
