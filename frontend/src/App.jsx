import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RouteMetro from './pages/RouteMetro'
import BookTicket from './pages/BookTicket'
import MyTickets from './pages/user/MyTickets'
import UserDashboard from './pages/user/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import Help from './pages/Help'
import ResetPassword from './pages/ResetPassword'
import Timetable from './pages/Timetable'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--primary-dark)',
        color: 'var(--text-white)'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        <span style={{ marginLeft: '1rem' }}>Đang tải...</span>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--primary-dark)',
        color: 'var(--text-white)'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        <span style={{ marginLeft: '1rem' }}>Đang tải...</span>
      </div>
    )
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/routemetro"
            element={
              <PublicRoute>
                <RouteMetro />
              </PublicRoute>
            }
          />

          {/* Protected */}
          <Route
            path="/book-ticket"
            element={
              <ProtectedRoute>
                <BookTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Normal Public Routes */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/help" element={<Help />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/timetable" element={<Timetable />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
