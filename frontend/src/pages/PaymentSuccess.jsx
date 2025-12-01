import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import './PaymentSuccess.css'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(10)
  
  const ticketId = searchParams.get('ticketId')
  const responseCode = searchParams.get('vnp_ResponseCode')

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails()
    } else {
      setLoading(false)
    }
  }, [ticketId])

  // Auto redirect to homepage after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data)
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (loading) {
    return (
      <Layout>
        <div className="payment-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin vé...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="payment-success-container">
        <div className="success-content">
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <div className="success-icon"></div>
          </div>

          {/* Success Message */}
          <h1 className="success-title">Thanh toán thành công!</h1>
          <p className="success-subtitle">
            Vé của bạn đã được kích hoạt. Thông tin chi tiết đã được gửi về email.
          </p>
          <p className="auto-redirect-notice">
            Tự động chuyển về trang chủ sau <strong>{countdown}</strong> giây...
          </p>

          {/* Ticket Details */}
          {ticket && (
            <div className="ticket-details">
              <h3>Thông tin vé</h3>
              
              <div className="detail-row">
                <span className="label">Mã vé:</span>
                <span className="value ticket-code">{ticket.ticketCode || `TICKET-${ticketId}`}</span>
              </div>

              <div className="detail-row">
                <span className="label">Loại vé:</span>
                <span className="value">{ticket.ticketType?.name || 'N/A'}</span>
              </div>

              {ticket.startStation && ticket.endStation && (
                <div className="detail-row">
                  <span className="label">Tuyến:</span>
                  <span className="value">
                    {ticket.startStation.name} → {ticket.endStation.name}
                  </span>
                </div>
              )}

              <div className="detail-row">
                <span className="label">Giá tiền:</span>
                <span className="value price">{formatPrice(ticket.price)} VND</span>
              </div>

              <div className="detail-row">
                <span className="label">Trạng thái:</span>
                <span className={`value status ${ticket.status?.toLowerCase()}`}>
                  {ticket.status === 'PENDING' ? 'Chờ kích hoạt' : 
                   ticket.status === 'NOT_ACTIVATED' ? 'Chưa kích hoạt' :
                   ticket.status === 'ACTIVATED' ? 'Đã kích hoạt' : ticket.status}
                </span>
              </div>

              {ticket.expirationTime && (
                <div className="detail-row">
                  <span className="label">Hết hạn:</span>
                  <span className="value">{formatDate(ticket.expirationTime)}</span>
                </div>
              )}
            </div>
          )}

          {/* Transaction Info */}
          {responseCode && (
            <div className="transaction-info">
              <h4>Thông tin giao dịch</h4>
              <p><strong>Mã giao dịch:</strong> <span>{ticketId || 'N/A'}</span></p>
              <p><strong>Phương thức:</strong> <span>VNPay</span></p>
              <p><strong>Trạng thái:</strong> <span>Thành công</span></p>
            </div>
          )}

          {/* QR Code Section */}
          {ticket && (
            <div className="qr-code-section">
              <h4>Mã QR vé của bạn</h4>
              <div className="qr-code-placeholder">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <rect width="200" height="200" fill="#f3f4f6"/>
                  <text x="100" y="100" textAnchor="middle" fill="#6b7280" fontSize="14">
                    QR Code
                  </text>
                  <text x="100" y="120" textAnchor="middle" fill="#9ca3af" fontSize="10">
                    {ticket.ticketCode || ticketId}
                  </text>
                </svg>
              </div>
              <p className="qr-instruction">Quét mã này tại cổng soát vé</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="success-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/my-tickets')}
            >
              Xem vé của tôi
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/book-ticket')}
            >
              Đặt vé khác
            </button>
            <button 
              className="btn-outline"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <h3>📧 Lưu ý</h3>
            <ul>
              <li>Thông tin vé đã được gửi về email của bạn</li>
              <li>Vui lòng kích hoạt vé tại ga trước khi sử dụng</li>
              <li>Vé có thời hạn sử dụng, vui lòng kiểm tra ngày hết hạn</li>
              <li>Mang theo CMND/CCCD khi sử dụng vé tháng sinh viên</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PaymentSuccess
