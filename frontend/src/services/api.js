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

// Metro API functions
export const metroAPI = {
  // Get all stations
  getStations: async () => {
    const response = await api.get('/stations')
    return response.data
  },

  // Get all routes
  getRoutes: async () => {
    const response = await api.get('/routes')
    return response.data
  },

  // Get stations by route
  getStationsByRoute: async (lineName) => {
    const response = await api.get(`/routes/${lineName}/stations`)
    return response.data
  },

  // Calculate fare
  calculateFare: async (start, end) => {
    const response = await api.get(`/fares?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
    return response.data
  }
}

// Ticket API functions
export const ticketAPI = {
  // Get my tickets
  getMyTickets: async (accountId) => {
    const response = await api.get(`/tickets/my?accountId=${accountId}`)
    return response.data
  },

  // Get ticket by ID
  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  // Purchase ticket (old method)
  purchaseRoute: async (purchaseData) => {
    const response = await api.post('/tickets/purchase-route', purchaseData)
    return response.data
  },

  // Activate ticket
  activateTicket: async (ticketCode, station) => {
    const response = await api.post(`/tickets/activate/${ticketCode}?station=${encodeURIComponent(station)}`)
    return response.data
  },

  // Scan at destination
  scanDestination: async (ticketCode, station) => {
    const response = await api.post(`/tickets/scan-destination/${ticketCode}?station=${encodeURIComponent(station)}`)
    return response.data
  }
}

// Payment API functions
export const paymentAPI = {
  // Create VNPay payment
  createVNPayPayment: async (purchaseData) => {
    const response = await api.post('/payments/vnpay/create', purchaseData)
    return response.data
  },

  // Handle VNPay return (for reference, usually handled by backend)
  handleVNPayReturn: async (returnData) => {
    const response = await api.get('/payments/vnpay/return', { params: returnData })
    return response.data
  }
}

// User Stats API functions (for User Dashboard)
export const userStatsAPI = {
  // Get user statistics summary
  getStats: async (accountId) => {
    const response = await api.get(`/user/stats/summary?accountId=${accountId}`)
    return response.data
  },

  // Get recent tickets for dashboard
  getRecentTickets: async (accountId, limit = 3) => {
    const response = await api.get(`/user/stats/recent-tickets?accountId=${accountId}&limit=${limit}`)
    return response.data
  }
}

// Admin Stats API functions (for Admin Dashboard)
export const adminStatsAPI = {
  // Get admin dashboard summary statistics
  getSummary: async () => {
    const response = await api.get('/admin/stats/summary')
    return response.data
  },

  // Get revenue by day for chart (backend uses ?days=N parameter)
  getRevenueByDay: async (days = 7) => {
    const response = await api.get(`/admin/stats/revenue-by-day?days=${days}`)
    return response.data
  },

  // Get top routes statistics (already exists in backend)
  getTopRoutes: async (limit = 5) => {
    const response = await api.get(`/admin/stats/top-routes?limit=${limit}`)
    return response.data
  }
}

// Admin Ticket Management API
export const adminTicketAPI = {
  // Get all tickets with pagination and search
  getAllTickets: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({ page, size })
    if (search) params.append('search', search)
    const response = await api.get(`/admin/tickets?${params.toString()}`)
    return response.data
  },

  // Get ticket details
  getTicketDetails: async (id) => {
    const response = await api.get(`/admin/tickets/${id}`)
    return response.data
  },

  // Cancel ticket
  cancelTicket: async (id) => {
    const response = await api.delete(`/admin/tickets/${id}`)
    return response.data
  }
}

// Admin User Management API
export const adminUserAPI = {
  // Get all users with pagination and search
  getAllUsers: async (page = 0, size = 20, search = '') => {
    const params = new URLSearchParams({ page, size })
    if (search) params.append('search', search)
    const response = await api.get(`/admin/users?${params.toString()}`)
    return response.data
  },

  // Get user details
  getUserDetails: async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData)
    return response.data
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData)
    return response.data
  },

  // Lock/unlock user
  toggleUserStatus: async (id) => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`)
    return response.data
  }
}

// Admin Payment Management API
export const adminPaymentAPI = {
  // Get all payments with pagination and filter
  getAllPayments: async (page = 0, size = 20, status = '') => {
    const params = new URLSearchParams({ page, size })
    if (status) params.append('status', status)
    const response = await api.get(`/admin/payments?${params.toString()}`)
    return response.data
  },

  // Get payment details
  getPaymentDetails: async (id) => {
    const response = await api.get(`/admin/payments/${id}`)
    return response.data
  }
}

// Admin Route Management API
export const adminRouteAPI = {
  // Get all routes with statistics
  getAllRoutesWithStats: async () => {
    const response = await api.get('/admin/routes/stats')
    return response.data
  },

  // Get route details
  getRouteDetails: async (lineName) => {
    const response = await api.get(`/admin/routes/${encodeURIComponent(lineName)}`)
    return response.data
  }
}

// Admin Fare Management API
export const adminFareAPI = {
  // Get all fare types
  getAllFares: async () => {
    const response = await api.get('/admin/fares')
    return response.data
  },

  // Update fare
  updateFare: async (id, fareData) => {
    const response = await api.put(`/admin/fares/${id}`, fareData)
    return response.data
  },

  // Create new fare
  createFare: async (fareData) => {
    const response = await api.post('/admin/fares', fareData)
    return response.data
  }
}

// Schedule API (for My Tickets sidebar)
export const scheduleAPI = {
  // Get upcoming schedules
  getUpcomingSchedules: async (limit = 6) => {
    const response = await api.get(`/schedules/upcoming?limit=${limit}`)
    return response.data
  },

  // Get schedules by line
  getSchedulesByLine: async (lineName) => {
    const response = await api.get(`/schedules/line/${encodeURIComponent(lineName)}`)
    return response.data
  }
}

export default api
