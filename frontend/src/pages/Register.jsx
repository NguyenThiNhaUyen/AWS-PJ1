import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const success = await register({
        username: formData.fullName,
        email: formData.email,
        password: formData.password
      })
      if (success) {
        navigate('/login')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      {/* Left Side - Form */}
      <div className="register-left">
        <div className="register-form-wrapper">
          <div className="register-header">
            <h1>Create Your Account</h1>
            <p>Join the future of urban mobility</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
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

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="form-input"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="register-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="login-link">Login</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Information */}
      <div className="register-right">
        <div className="info-content">
          <div className="metro-logo">
            <div className="logo-icon">M</div>
            <div className="logo-text">Metropolitano</div>
          </div>

          <h2>Smart Urban <span className="highlight-accent">Mobility</span> for Ho Chi Minh City</h2>
          <p className="intro-text">
            Experience the future of public transportation with our state-of-the-art 
            metro system designed for modern urban living.
          </p>

          <div className="benefits">
            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Digital Ticketing</h4>
                <p>Contactless payment and mobile integration</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Real-time Updates</h4>
                <p>Live schedules and arrival notifications</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="benefit-text">
                <h4>Safe & Reliable</h4>
                <p>24/7 security monitoring and safety systems</p>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Stations</span>
            </div>
            <div className="stat">
              <span className="stat-number highlight">4</span>
              <span className="stat-label">Lines</span>
            </div>
            <div className="stat">
              <span className="stat-number">2M+</span>
              <span className="stat-label">Monthly Riders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
