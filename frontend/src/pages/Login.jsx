import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate form
    if (!formData.email.trim()) {
      setError('Please enter your email or username')
      setLoading(false)
      return
    }

    if (!formData.password) {
      setError('Please enter your password')
      setLoading(false)
      return
    }

    try {
      const success = await login({ 
        usernameOrEmail: formData.email.trim(), 
        password: formData.password 
      })
      
      if (success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Left Side - Form */}
      <div className="login-left">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your Metro account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <input
                type="text"
                id="usernameOrEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Username or Email"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <span>Don't have an account?</span>
            <Link to="/register" className="register-link">Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Information */}
      <div className="login-right">
        <div className="info-content">
          <div className="metro-logo">
            <div className="logo-icon">M</div>
            <div className="logo-text">Metropolitano</div>
          </div>

          <h2>Your Gateway to Smart <span className="highlight-accent">Urban Mobility</span></h2>
          <p className="intro-text">
            Access your personal Metro dashboard to manage tickets, track journeys, 
            and stay connected with Ho Chi Minh City's premier transportation network.
          </p>

          <div className="benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Personal Dashboard</h4>
                <p>Track your journeys and travel history</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Quick Booking</h4>
                <p>Fast ticket purchase and mobile payments</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Smart Notifications</h4>
                <p>Real-time updates and service alerts</p>
              </div>
            </div>
          </div>

          <div className="features-highlight">
            <h3>Why Choose Metro TP.HCM?</h3>
            <ul>
              <li>✓ Fastest urban transportation</li>
              <li>✓ Eco-friendly and sustainable</li>
              <li>✓ 24/7 customer support</li>
              <li>✓ Modern safety systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
