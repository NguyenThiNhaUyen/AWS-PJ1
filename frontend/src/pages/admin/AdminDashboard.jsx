import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
// import { getDashboardStats } from '../services/adminService'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardStats()
      setStats(data)
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
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Dashboard</h1>
          </div>

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

          <div className="top-routes-section">
            <h2 className="section-title">Top tuyến được mua nhiều vé nhất</h2>
            
            <div className="routes-list">
              {(stats?.topRoutes || [
                { line: 'Line 1', count: 892 },
                { line: 'Line 2', count: 640 },
                { line: 'Line 3', count: 512 },
                { line: 'Line 5', count: 230 },
                { line: 'Line 8', count: 112 }
              ]).map((route, index) => (
                <div key={index} className="route-item">
                  <span className="route-rank">{index + 1})</span>
                  <span className="route-name">{route.line}</span>
                  <span className="route-count">- {route.count} vé</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard