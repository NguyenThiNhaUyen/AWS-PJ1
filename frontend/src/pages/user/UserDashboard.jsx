import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { userStatsAPI } from '../../services/api'
import Layout from '../../components/Layout'
import './UserDashboard.css'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Call API endpoints
      const [statsData, ticketsData] = await Promise.all([
        userStatsAPI.getStats(user.id),
        userStatsAPI.getRecentTickets(user.id, 3)
      ])
      
      setStats(statsData)
      setTickets(ticketsData)
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu')
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <Layout>
        <div className="user-dashboard">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="user-dashboard">
          <div className="error-state">
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchDashboardData}>
              Retry
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="user-dashboard">
        {/* Sidebar Menu */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <span className="item-text">Dashboard</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'tickets' ? 'active' : ''}`}
              onClick={() => navigate('/my-tickets')}
            >
              <span className="item-text">My Tickets</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'buy' ? 'active' : ''}`}
              onClick={() => navigate('/book-ticket')}
            >
              <span className="item-text">Buy New Ticket</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'timetable' ? 'active' : ''}`}
              onClick={() => navigate('/timetable')}
            >
              <span className="item-text">Schedule</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveMenu('profile')}
            >
              <span className="item-text">Account</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'help' ? 'active' : ''}`}
              onClick={() => navigate('/help')}
            >
              <span className="item-text">Help</span>
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-details">
                <p className="user-name">{user?.fullName || user?.username}</p>
                <p className="user-role">Customer</p>
              </div>
            </div>
          </div>
        </aside>
        
        <div className="dashboard-container">
          {/* Greeting Section */}
          {user && (
            <div className="greeting-section">
              <div className="greeting-card">
                <div className="greeting-icon">👋</div>
                <div className="greeting-content">
                  <h3 className="greeting-title">Hello!</h3>
                  <p className="greeting-name">{user.fullName || user.username}</p>
                  <p className="greeting-message">Welcome back</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              {activeMenu === 'dashboard' && 'Dashboard'}
              {activeMenu === 'profile' && 'Account Information'}
            </h1>
          </div>

          {/* Dashboard Content */}
          {activeMenu === 'dashboard' && (
            <>
              {/* Stats Section */}
              <div className="stats-section">
                <h2 className="section-title">Statistics</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Tickets:</div>
                    <div className="stat-value">{stats?.totalTickets || 0}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Active Tickets:</div>
                    <div className="stat-value">{stats?.activeTickets || 0}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Used Tickets:</div>
                    <div className="stat-value">{stats?.usedTickets || 0}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Total Spent:</div>
                    <div className="stat-value highlight">
                      {stats?.totalSpent ? formatCurrency(stats.totalSpent) : '0 VND'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="recent-tickets-section">
                <h2 className="section-title">Recent Tickets</h2>
                
                <div className="tickets-list">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-card">
                      <div className="ticket-header">
                        <h3>{ticket.route}</h3>
                        <span className={`badge badge-${ticket.status.toLowerCase()}`}>
                          {ticket.status === 'PAID' && 'Paid'}
                          {ticket.status === 'ACTIVE' && 'Active'}
                          {ticket.status === 'USED' && 'Used'}
                        </span>
                      </div>
                      <div className="ticket-body">
                        <div className="ticket-info">
                          <span className="info-label">Price:</span>
                          <span className="info-value">{formatCurrency(ticket.price)}</span>
                        </div>
                        <div className="ticket-info">
                          <span className="info-label">Purchase Date:</span>
                          <span className="info-value">{ticket.purchaseDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Profile Section */}
          {activeMenu === 'profile' && (
            <div className="profile-section">
              <div className="profile-card">
                <h2 className="section-title">Personal Information</h2>
                
                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label">Username:</span>
                    <span className="info-value">{user?.username}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">{user?.fullName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Role:</span>
                    <span className="info-value badge badge-customer">Customer</span>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="btn-action btn-primary">Update Information</button>
                  <button className="btn-action">Change Password</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default UserDashboard
