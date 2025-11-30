import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
// import { getMyTickets, activateTicket as activateTicketAPI } from '../services/ticketService'
import './MyTickets.css'

const MyTickets = () => {
  const navigate = useNavigate()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyTickets()
      setTickets(data.tickets || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách vé')
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const upcomingSchedules = [
    {
      station: 'Bến Thành',
      line: 'Line 1',
      status: 'ACTIVE',
      time: '10:00'
    },
    {
      station: 'Nhà Hát TP',
      line: 'Line 1',
      status: 'PRICING',
      time: '10:55'
    },
    {
      station: 'Vạn Thành',
      line: 'Line 1',
      status: 'ACTIVE',
      time: '8:12'
    },
    {
      station: 'Ba Son',
      line: 'Line 2',
      time: '10:32'
    },
    {
      station: 'Tân Cảng',
      line: 'Line 2',
      time: '10:43'
    },
    {
      station: 'Thủ Thiêm',
      line: 'Line 3',
      time: '10:28'
    }
  ]

  const handleActivateTicket = async (ticketId) => {
    if (!window.confirm('Bạn có chắc chắn muốn kích hoạt vé này?')) {
      return
    }

    try {
      setLoading(true)
      await activateTicketAPI(ticketId)
      alert('Kích hoạt vé thành công!')
      // Refresh list tecket
      await fetchTickets()
    } catch (err) {
      alert(err.message || 'Không thể kích hoạt vé')
      console.error('Error activating ticket:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleBuyNewTicket = () => {
    navigate('/tickets')
  }

  const getStatusClass = (status) => {
    switch(status) {
      case 'ACTIVE': return 'active'
      case 'PENDING': return 'pending'
      case 'EXPIRED': return 'expired'
      default: return ''
    }
  }

  return (
    <Layout>
      <div className="my-tickets-page">
        <div className="my-tickets-container">
          <div className="tickets-main">
            <div className="page-header">
              <h1 className="page-title">Vé của tôi</h1>
              <button className="btn-buy-new" onClick={handleBuyNewTicket}>
                Mua vé mới
              </button>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải danh sách vé...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button className="btn-retry" onClick={fetchTickets}>
                  Thử lại
                </button>
              </div>
            )}

            {!loading && !error && tickets.length === 0 && (
              <div className="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h16v11z" fill="rgba(77, 134, 190, 0.3)"/>
                </svg>
                <h3>Chưa có vé nào</h3>
                <p>Bạn chưa mua vé nào. Hãy mua vé để bắt đầu hành trình!</p>
                <button className="btn-buy-new" onClick={handleBuyNewTicket}>
                  Mua vé ngay
                </button>
              </div>
            )}

            {!loading && !error && tickets.length > 0 && (
              <div className="tickets-list">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                      <div className="ticket-id">
                        <span className="label">Mã vé:</span>
                        <span className="value">{ticket.id}</span>
                      </div>
                      <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                        {ticket.statusText}
                      </span>
                    </div>

                    <div className="ticket-body">
                      <div className="ticket-row">
                        <span className="row-label">Loại vé:</span>
                        <span className="row-value">{ticket.type}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="row-label">Tuyến:</span>
                        <span className="row-value">{ticket.line}</span>
                      </div>
                      <div className="ticket-row route">
                        <span className="row-label">Từ:</span>
                        <span className="row-value">{ticket.departure}</span>
                        <span className="arrow">→</span>
                        <span className="row-label">Đến:</span>
                        <span className="row-value">{ticket.arrival}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="row-label">Giá:</span>
                        <span className="row-value price">{ticket.price.toLocaleString('vi-VN')} VND</span>
                      </div>
                      {ticket.status === 'PENDING' && (
                        <div className="ticket-row">
                          <span className="row-label">Thời gian kích hoạt:</span>
                          <span className="row-value">{ticket.statusText}</span>
                        </div>
                      )}
                      {ticket.status === 'ACTIVE' && (
                        <>
                          <div className="ticket-row">
                            <span className="row-label">Trạng thái:</span>
                            <span className="row-value status-active">[ACTIVE] (Màu xanh)</span>
                          </div>
                          <div className="ticket-row">
                            <span className="row-label">Thời gian kích hoạt:</span>
                            <span className="row-value">{ticket.activatedDate}</span>
                          </div>
                        </>
                      )}
                      {ticket.expiryDate && ticket.expiryDate !== '-' && (
                        <div className="ticket-row">
                          <span className="row-label">Hạn sử dụng:</span>
                          <span className="row-value">{ticket.expiryDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="ticket-footer">
                      {ticket.status === 'PENDING' && (
                        <button 
                          className="btn-activate"
                          onClick={() => handleActivateTicket(ticket.id)}
                          disabled={loading}
                        >
                          {loading ? 'Đang xử lý...' : 'Kích hoạt vé'}
                        </button>
                      )}
                      {ticket.status === 'ACTIVE' && (
                        <button 
                          className="btn-view-details"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          Xem chi tiết
                        </button>
                      )}
                      {ticket.status === 'EXPIRED' && (
                        <button 
                          className="btn-expired"
                          disabled
                        >
                          Đã hết hạn
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="schedule-sidebar">
            <div className="schedule-card">
              <h3 className="schedule-title">Lịch trình sắp tới</h3>
              
              <div className="schedule-list">
                {upcomingSchedules.map((schedule, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-info">
                      <div className="station-name">{schedule.station}</div>
                      <div className="station-line">{schedule.line}</div>
                    </div>
                    <div className="schedule-status">
                      {schedule.status && (
                        <span className={`status-badge ${schedule.status.toLowerCase()}`}>
                          {schedule.status}
                        </span>
                      )}
                      <span className="time">{schedule.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyTickets