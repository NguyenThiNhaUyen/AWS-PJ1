import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import './MyTickets.css'

const MyTickets = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('current')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // TEMP: Disabled for UI testing
  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate('/login')
    //   return
    // }
    fetchTickets()
  }, [isAuthenticated, navigate])

  const fetchTickets = async () => {
    try {
      // TODO: Replace with actual API call when backend implements it
      // const response = await fetch('/api/tickets/my-tickets', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      // })
      // const data = await response.json()
      
      // Mock data for now
      const mockTickets = [
        {
          id: 1,
          ticketCode: 'METRO2024001',
          ticketType: { name: 'Ve tuyen' },
          startStation: { name: 'Ben Thanh' },
          endStation: { name: 'Thu Duc' },
          price: 13000,
          status: 'NOT_ACTIVATED',
          activationTime: null,
          expirationTime: null,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          ticketCode: 'METRO2024002',
          ticketType: { name: 'Ve 1 ngay' },
          price: 40000,
          status: 'ACTIVATED',
          activationTime: new Date(Date.now() - 3600000).toISOString(),
          expirationTime: new Date(Date.now() + 82800000).toISOString(),
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ]
      
      setTickets(mockTickets)
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeRemaining = (expirationTime) => {
    if (!expirationTime) return null
    const now = new Date()
    const expiry = new Date(expirationTime)
    const diff = expiry - now
    
    if (diff <= 0) return 'Đã hết hạn'
    
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `Còn ${days} ngày`
    }
    return `Còn ${hours}h ${minutes}m`
  }

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { text: 'Chờ thanh toán', class: 'pending' },
      'NOT_ACTIVATED': { text: 'Chưa kích hoạt', class: 'not-activated' },
      'ACTIVATED': { text: 'Đã kích hoạt', class: 'activated' },
      'USED': { text: 'Đã sử dụng', class: 'used' },
      'EXPIRED': { text: 'Hết hạn', class: 'expired' }
    }
    return badges[status] || { text: status, class: 'default' }
  }

  const currentTickets = tickets.filter(t => 
    ['PENDING', 'NOT_ACTIVATED', 'ACTIVATED'].includes(t.status)
  )
  
  const historyTickets = tickets.filter(t => 
    ['USED', 'EXPIRED'].includes(t.status)
  )

  const displayTickets = activeTab === 'current' ? currentTickets : historyTickets

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Đang tải vé của bạn...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="my-tickets-container">
        <div className="tickets-header">
          <h1>Vé của tôi</h1>
          <button 
            className="btn-book-new"
            onClick={() => navigate('/book-ticket')}
          >
            + Đặt vé mới
          </button>
        </div>

        {/* Tabs */}
        <div className="tickets-tabs">
          <button 
            className={`tab ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Vé hiện tại ({currentTickets.length})
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Lịch sử ({historyTickets.length})
          </button>
        </div>

        {/* Tickets List */}
        <div className="tickets-list">
          {displayTickets.length === 0 ? (
            <div className="empty-state">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <path d="M9 14l-4-4m0 0l4-4m-4 4h14m-5 4v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5" 
                  stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>Chưa có vé nào</h3>
              <p>
                {activeTab === 'current' 
                  ? 'Bạn chưa có vé nào. Hãy đặt vé ngay để trải nghiệm Metro!'
                  : 'Chưa có lịch sử sử dụng vé.'}
              </p>
              {activeTab === 'current' && (
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/book-ticket')}
                >
                  Đặt vé ngay
                </button>
              )}
            </div>
          ) : (
            displayTickets.map(ticket => {
              const statusBadge = getStatusBadge(ticket.status)
              return (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <div className="ticket-type">
                      <span className="icon">🎫</span>
                      <span>{ticket.ticketType.name}</span>
                    </div>
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>

                  <div className="ticket-body">
                    {ticket.startStation && ticket.endStation && (
                      <div className="route-info">
                        <div className="station">{ticket.startStation.name}</div>
                        <div className="route-arrow">→</div>
                        <div className="station">{ticket.endStation.name}</div>
                      </div>
                    )}

                    <div className="ticket-details-grid">
                      <div className="detail-item">
                        <span className="label">Mã vé:</span>
                        <span className="value code">{ticket.ticketCode}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Giá:</span>
                        <span className="value price">{formatPrice(ticket.price)} ₫</span>
                      </div>
                      {ticket.expirationTime && (
                        <div className="detail-item">
                          <span className="label">Hết hạn:</span>
                          <span className="value expiry">
                            {getTimeRemaining(ticket.expirationTime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {ticket.status === 'ACTIVATED' && (
                      <div className="qr-code-mini">
                        <div className="qr-placeholder">
                          <svg width="80" height="80" viewBox="0 0 100 100">
                            <rect width="100" height="100" fill="#f3f4f6"/>
                            <text x="50" y="50" textAnchor="middle" fill="#6b7280" fontSize="8">QR</text>
                          </svg>
                        </div>
                        <span className="qr-label">Quét tại cổng</span>
                      </div>
                    )}
                  </div>

                  <div className="ticket-footer">
                    <span className="created-date">
                      Mua ngày: {formatDate(ticket.createdAt)}
                    </span>
                    {ticket.status === 'NOT_ACTIVATED' && (
                      <button className="btn-activate">
                        Kích hoạt vé
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyTickets
