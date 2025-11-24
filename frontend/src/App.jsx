import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookTicket from './pages/BookTicket'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import MyTickets from './pages/MyTickets'
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

// Public Route (redirect to home if already logged in)
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
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes - Only accessible when not logged in */}
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
          
          {/* Protected Routes - Only accessible when logged in */}
          {/* TEMP: Removed protection to test UI without login */}
          <Route 
            path="/book-ticket" 
            element={<BookTicket />}
          />
          {/* 
          <Route 
            path="/book-ticket" 
            element={
              <ProtectedRoute>
                <BookTicket />
              </ProtectedRoute>
            } 
          />
          */}

          {/* Payment Result Pages */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />

          {/* My Tickets - TEMP: Removed protection for UI testing */}
          <Route path="/my-tickets" element={<MyTickets />} />
          {/* 
          <Route 
            path="/my-tickets" 
            element={<ProtectedRoute><MyTickets /></ProtectedRoute>} 
          />
          */}

          {/* Public Routes */}
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/help" element={<Help />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
