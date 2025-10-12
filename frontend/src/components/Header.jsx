import React from 'react'
import { Link, useNav          {/* Auth Section */}
          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.fullName || user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-logout">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-login">Login</Link>
                <Link to="/register" className="btn btn-primary btn-signup">Sign Up</Link>
              </div>
            )}router-dom'
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
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                <path d="M8 12h16v8H8z" fill="white"/>
                <circle cx="12" cy="16" r="2" fill="url(#gradient)"/>
                <circle cx="20" cy="16" r="2" fill="url(#gradient)"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4d86be"/>
                    <stop offset="100%" stopColor="#5da0de"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">Metro TP.HCM</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link">Trang chủ</Link>
            <Link to="/routes" className="nav-link">Sơ đồ tuyến</Link>
            <Link to="/schedule" className="nav-link">Lịch trình</Link>
            <Link to="/tickets" className="nav-link">Mua vé</Link>
            <Link to="/news" className="nav-link">Tin tức</Link>
          </nav>

          {/* Auth Section */}
          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.fullName || user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-small">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost btn-small">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary btn-small">Đăng ký</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
