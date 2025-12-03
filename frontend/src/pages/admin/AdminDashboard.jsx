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
      setError(err.message || 'Không thể tải thống kê')
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
            <p>Đang tải dữ liệu...</p>
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
              Thử lại
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
              <span className="item-text">Quản lý Vé</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'users' ? 'active' : ''}`}
              onClick={() => setActiveMenu('users')}
            >
              <span className="item-text">Quản lý Người dùng</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'revenue' ? 'active' : ''}`}
              onClick={() => setActiveMenu('revenue')}
            >
              <span className="item-text">Báo cáo Doanh thu</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveMenu('payments')}
            >
              <span className="item-text">Quản lý Thanh toán</span>
            </button>
            
            <button 
              className={`sidebar-item ${activeMenu === 'fares' ? 'active' : ''}`}
              onClick={() => setActiveMenu('fares')}
            >
              <span className="item-text">Quản lý Giá vé</span>
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
                  <h3 className="greeting-title">Xin chào!</h3>
                  <p className="greeting-name">{user.fullName || user.username}</p>
                  <p className="greeting-message">Chào mừng bạn đến với Trang Quản Trị</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              {activeMenu === 'dashboard' && 'Dashboard'}
              {activeMenu === 'tickets' && 'Quản lý Vé'}
              {activeMenu === 'users' && 'Quản lý Người dùng'}
              {activeMenu === 'revenue' && 'Báo cáo Doanh thu'}
              {activeMenu === 'payments' && 'Quản lý Thanh toán'}
              {activeMenu === 'fares' && 'Quản lý Giá vé'}
            </h1>
          </div>

          {/* Dashboard Content */}
          {activeMenu === 'dashboard' && (
            <>
              <div className="stats-section">
                <h2 className="section-title">Thống kê tổng quan</h2>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Tổng số vé đã tạo:</div>
                    <div className="stat-value">{stats?.totalTickets?.toLocaleString() || '12,450'}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Vé đã thanh toán:</div>
                    <div className="stat-value">{stats?.paidTickets?.toLocaleString() || '10,822'}</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Doanh thu toàn thời gian:</div>
                    <div className="stat-value highlight">
                      {stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : '5.234.000.000 VND'}
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Tổng số tài khoản:</div>
                    <div className="stat-value">{stats?.totalAccounts?.toLocaleString() || '4,221'}</div>
                  </div>
                </div>
              </div>

              <div className="today-section">
                <h2 className="section-title">Thống kê hôm nay</h2>
                
                <div className="today-stats">
                  <div className="today-item">
                    <span className="today-label">Vé tạo hôm nay:</span>
                    <span className="today-value">{stats?.todayTickets || '243'}</span>
                  </div>
                  <div className="today-item">
                    <span className="today-label">Doanh thu hôm nay:</span>
                    <span className="today-value">{stats?.todayRevenue ? formatCurrency(stats.todayRevenue) : '352.000 VND'}</span>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <h2 className="section-title">Biểu đồ doanh thu 7 ngày gần nhất</h2>
                
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
                  placeholder="Tìm kiếm vé theo mã, người dùng..."
                  className="search-input"
                />
                <button className="btn-action">Tìm kiếm</button>
                <button className="btn-action">Xuất Excel</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã vé</th>
                      <th>Người dùng</th>
                      <th>Tuyến</th>
                      <th>Loại vé</th>
                      <th>Giá</th>
                      <th>Trạng thái</th>
                      <th>Ngày mua</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TK-001234</td>
                      <td>Nguyễn Văn A</td>
                      <td>Bến Thành → Thảo Điền</td>
                      <td>Vé lượt</td>
                      <td>9.000 VND</td>
                      <td><span className="badge badge-success">Đã thanh toán</span></td>
                      <td>01/12/2025</td>
                      <td>
                        <button className="btn-small">Chi tiết</button>
                        <button className="btn-small btn-danger">Hủy</button>
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
                  placeholder="Tìm kiếm người dùng..."
                  className="search-input"
                />
                <button className="btn-action">Tìm kiếm</button>
                <button className="btn-action btn-primary">+ Thêm người dùng</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Họ tên</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th>Hành động</th>
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
                        <button className="btn-small">Sửa</button>
                        <button className="btn-small btn-warning">Khóa</button>
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
                <span>đến</span>
                <input type="date" className="date-input" />
                <button className="btn-action">Lọc</button>
                <button className="btn-action">Xuất PDF</button>
                <button className="btn-action">Xuất Excel</button>
              </div>
              
              <div className="revenue-summary">
                <div className="summary-card">
                  <h3>Tổng doanh thu</h3>
                  <p className="summary-value">156.780.000 VND</p>
                </div>
                <div className="summary-card">
                  <h3>Số vé đã bán</h3>
                  <p className="summary-value">10,452</p>
                </div>
                <div className="summary-card">
                  <h3>Doanh thu trung bình/ngày</h3>
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
                  placeholder="Tìm kiếm giao dịch..."
                  className="search-input"
                />
                <select className="filter-select">
                  <option>Tất cả trạng thái</option>
                  <option>SUCCESS</option>
                  <option>FAILED</option>
                  <option>PENDING</option>
                </select>
                <button className="btn-action">Tìm kiếm</button>
              </div>
              
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã GD</th>
                      <th>Mã vé</th>
                      <th>Người dùng</th>
                      <th>Số tiền</th>
                      <th>Phương thức</th>
                      <th>Trạng thái</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PAY-001234</td>
                      <td>TK-001234</td>
                      <td>Nguyễn Văn A</td>
                      <td>15.000 VND</td>
                      <td>VNPay</td>
                      <td><span className="badge badge-success">SUCCESS</span></td>
                      <td>01/12/2025 08:30</td>
                      <td>
                        <button className="btn-small">Chi tiết</button>
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
                <button className="btn-action btn-primary">+ Thêm bảng giá</button>
              </div>
              
              <div className="fares-grid">
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Người lớn</h3>
                    <button className="btn-small">Sửa</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">15.000 VND</p>
                    <p className="fare-description">Vé tiêu chuẩn cho người lớn</p>
                  </div>
                </div>
                
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Trẻ em</h3>
                    <button className="btn-small">Sửa</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">7.000 VND</p>
                    <p className="fare-description">Dành cho trẻ em dưới 12 tuổi</p>
                  </div>
                </div>
                
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Sinh viên</h3>
                    <button className="btn-small">Sửa</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">10.000 VND</p>
                    <p className="fare-description">Dành cho sinh viên có thẻ</p>
                  </div>
                </div>
                
                <div className="fare-card">
                  <div className="fare-header">
                    <h3>Người cao tuổi</h3>
                    <button className="btn-small">Sửa</button>
                  </div>
                  <div className="fare-body">
                    <p className="fare-price">5.000 VND</p>
                    <p className="fare-description">Dành cho người trên 60 tuổi</p>
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