import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout()
      navigate('/')
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">M</div>
            <span className="logo-text">Metropolitano</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/routes" className="nav-link">Routes</Link>
            <Link to="/book-ticket" className="nav-link">Tickets</Link>
            <Link to="/timetable" className="nav-link">Timetable</Link>
            <Link to="/help" className="nav-link">Help</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          {/* Auth Section */}
          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <span className="user-name">Xin chào, {user.fullName || user.username}</span>
                <button onClick={handleLogout} className="btn btn-outline">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
