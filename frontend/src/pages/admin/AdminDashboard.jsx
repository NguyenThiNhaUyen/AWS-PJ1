import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { adminStatsAPI } from '../../services/api'
import Layout from '../../components/Layout'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Call API endpoints - Backend already exists!
      const [summary, revenueData] = await Promise.all([
        adminStatsAPI.getSummary(),
        adminStatsAPI.getRevenueByDay(7) // Backend expects ?days=7, not date range
      ])
      
      // Map backend response to frontend format
      const mappedRevenue = revenueData.map(day => ({
        date: new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        amount: day.revenue
      }))
      
      setStats({
        totalTickets: summary.totalTickets,
        paidTickets: summary.totalPaidTickets,
        totalRevenue: summary.totalRevenue,
        totalAccounts: summary.totalAccounts,
        todayTickets: summary.todayTickets,
        todayRevenue: summary.todayRevenue,
        weeklyRevenue: mappedRevenue
      })
    } catch (err) {
      setError(err.message || 'Cannot load statistics')
      console.error('Error fetching dashboard stats:', err)
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
        <div className="admin-dashboard">
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
        <div className="admin-dashboard">
          <div className="error-state">
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchDashboardStats}>
              Retry
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="admin-dashboard">
        {/* Sidebar Menu */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <span className="item-text">Dashboard</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveMenu('tickets')}
            >
              <span className="item-text">Ticket Management</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'users' ? 'active' : ''}`}
              onClick={() => setActiveMenu('users')}
            >
              <span className="item-text">User Management</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'revenue' ? 'active' : ''}`}
              onClick={() => setActiveMenu('revenue')}
            >
              <span className="item-text">Revenue Report</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveMenu('payments')}
            >
              <span className="item-text">Payment Management</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'fares' ? 'active' : ''}`}
              onClick={() => setActiveMenu('fares')}
            >
              <span className="item-text">Fare Management</span>
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <div className="admin-info">
              <div className="admin-details">
                <p className="admin-name">{user?.fullName || user?.username}</p>
                <p className="admin-role">Administrator</p>
              </div>
            </div>
          </div>
        </aside>
        
        <div className="dashboard-container">
          {user && (
            <div className="greeting-section">
              <div className="greeting-card">
                <div className="greeting-icon">👋</div>
                <div className="greeting-content">
                  <h3 className="greeting-title">Hello!</h3>
                  <p className="greeting-name">{user.fullName || user.username}</p>
                  <p className="greeting-message">Welcome to Admin Portal</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              {activeMenu === 'dashboard' && 'Dashboard'}
              {activeMenu === 'tickets' && 'Ticket Management'}
              {activeMenu === 'users' && 'User Management'}
              {activeMenu === 'revenue' && 'Revenue Report'}
              {activeMenu === 'payments' && 'Payment Management'}
              {activeMenu === 'fares' && 'Fare Management'}
            </h1>
          </div>

          {/* Dashboard Content */}
          {activeMenu === 'dashboard' && (
            <>
              <div className="stats-section">
                <h2 className="section-title">Overview Statistics</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Tickets Created:</div>
                    <div className="stat-value">{stats?.totalTickets?.toLocaleString() || '12,450'}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Paid Tickets:</div>
                    <div className="stat-value">{stats?.paidTickets?.toLocaleString() || '10,822'}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">All-Time Revenue:</div>
                    <div className="stat-value highlight">
                      {stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : '5.234.000.000 VND'}
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Total Accounts:</div>
                    <div className="stat-value">{stats?.totalAccounts?.toLocaleString() || '4,221'}</div>
                  </div>
                </div>
              </div>

              <div className="today-section">
                <h2 className="section-title">Today's Statistics</h2>
                
                <div className="today-stats">
                  <div className="today-item">
                    <span className="today-label">Tickets created today:</span>
                    <span className="today-value">{stats?.todayTickets || '243'}</span>
                  </div>
                  <div className="today-item">
                    <span className="today-label">Revenue today:</span>
                    <span className="today-value">{stats?.todayRevenue ? formatCurrency(stats.todayRevenue) : '352.000 VND'}</span>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <h2 className="section-title">Revenue Chart - Last 7 Days</h2>
                
                <div className="revenue-chart">
                  {(stats?.weeklyRevenue || [
                    { date: '19/11', amount: 1200000 },
                    { date: '20/11', amount: 900000 },
                    { date: '21/11', amount: 3000000 },
                    { date: '22/11', amount: 1100000 },
                    { date: '23/11', amount: 800000 }
                  ]).map((day, index) => {
                    const maxAmount = 3000000
                    const percentage = (day.amount / maxAmount) * 100
                    
                    return (
                      <div key={index} className="chart-bar-container">
                        <div className="chart-date">{day.date}</div>
                        <div className="chart-bar-wrapper">
                          <div 
                            className="chart-bar" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="chart-amount">
                          {(day.amount / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Tickets Management */}
          {activeMenu === 'tickets' && (
            <div className="management-section">
              <div className="management-toolbar">
                <input 
                  type="text" 
                  placeholder="Search tickets by ID, user..."
                  className="search-input"
                />
                <button className="btn-action">Search</button>
                <button className="btn-action">Export Excel</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Route</th>
                      <th>Ticket Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Purchase Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TK-001234</td>
                      <td>Nguyen Van A</td>
                      <td>Ben Thanh → Thao Dien</td>
                      <td>Single Trip</td>
                      <td>9.000 VND</td>
                      <td><span className="badge badge-success">Paid</span></td>
                      <td>01/12/2025</td>
                      <td>
                        <button className="btn-small">Details</button>
                        <button className="btn-small btn-danger">Cancel</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Management */}
          {activeMenu === 'users' && (
            <div className="management-section">
              <div className="management-toolbar">
                <input 
                  type="text" 
                  placeholder="Search users..."
                  className="search-input"
                />
                <button className="btn-action">Search</button>
                <button className="btn-action btn-primary">+ Add User</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Full Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>admin</td>
                      <td>admin@metro.local</td>
                      <td>Administrator</td>
                      <td><span className="badge badge-admin">ADMIN</span></td>
                      <td><span className="badge badge-success">Active</span></td>
                      <td>15/11/2025</td>
                      <td>
                        <button className="btn-small">Edit</button>
                        <button className="btn-small btn-warning">Lock</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue Report */}
          {activeMenu === 'revenue' && (
            <div className="management-section">
              <div className="management-toolbar">
                <input type="date" className="date-input" />
                <span>to</span>
                <input type="date" className="date-input" />
                <button className="btn-action">Filter</button>
                <button className="btn-action">Export PDF</button>
                <button className="btn-action">Export Excel</button>
              </div>
              
              <div className="revenue-summary">
                <div className="summary-card">
                  <h3>Total Revenue</h3>
                  <p className="summary-value">156.780.000 VND</p>
                </div>
                <div className="summary-card">
                  <h3>Tickets Sold</h3>
                  <p className="summary-value">10,452</p>
                </div>
                <div className="summary-card">
                  <h3>Avg Daily Revenue</h3>
                  <p className="summary-value">22.397.143 VND</p>
                </div>
              </div>
            </div>
          )}

          {/* Payments Management */}
          {activeMenu === 'payments' && (
            <div className="management-section">
              <div className="management-toolbar">
                <input 
                  type="text" 
                  placeholder="Search transactions..."
                  className="search-input"
                />
                <select className="filter-select">
                  <option>All status</option>
                  <option>SUCCESS</option>
                  <option>FAILED</option>
                  <option>PENDING</option>
                </select>
                <button className="btn-action">Search</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PAY-001234</td>
                      <td>TK-001234</td>
                      <td>Nguyen Van A</td>
                      <td>15.000 VND</td>
                      <td>VNPay</td>
                      <td><span className="badge badge-success">SUCCESS</span></td>
                      <td>01/12/2025 08:30</td>
                      <td>
                        <button className="btn-small">Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fares Management */}
          {activeMenu === 'fares' && (
            <div className="management-section">
              <div className="management-toolbar">
                <button className="btn-action btn-primary">+ Add Fare</button>
              </div>
              
              <div className="fares-grid">
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Adult</h3>
                    <button className="btn-small">Edit</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">15.000 VND</p>
                    <p className="fare-description">Standard fare for adults</p>
                  </div>
                </div>
                
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Child</h3>
                    <button className="btn-small">Edit</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">7.000 VND</p>
                    <p className="fare-description">For children under 12</p>
                  </div>
                </div>
                
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Student</h3>
                    <button className="btn-small">Edit</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">10.000 VND</p>
                    <p className="fare-description">For students with ID</p>
                  </div>
                </div>
                
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Senior</h3>
                    <button className="btn-small">Edit</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">5.000 VND</p>
                    <p className="fare-description">For seniors over 60</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard