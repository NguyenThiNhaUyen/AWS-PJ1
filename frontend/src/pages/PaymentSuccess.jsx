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
          <p>Loading ticket information...</p>
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
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-subtitle">
            Your ticket has been activated. Details have been sent to your email.
          </p>
          <p className="auto-redirect-notice">
            Automatically redirecting to homepage in <strong>{countdown}</strong> seconds...
          </p>

          {/* Ticket Details */}
          {ticket && (
            <div className="ticket-details">
              <h3>Ticket Information</h3>
              
              <div className="detail-row">
                <span className="label">Ticket ID:</span>
                <span className="value ticket-code">{ticket.ticketCode || `TICKET-${ticketId}`}</span>
              </div>

              <div className="detail-row">
                <span className="label">Ticket Type:</span>
                <span className="value">{ticket.ticketType?.name || 'N/A'}</span>
              </div>

              {ticket.startStation && ticket.endStation && (
                <div className="detail-row">
                  <span className="label">Route:</span>
                  <span className="value">
                    {ticket.startStation.name} → {ticket.endStation.name}
                  </span>
                </div>
              )}

              <div className="detail-row">
                <span className="label">Price:</span>
                <span className="value price">{formatPrice(ticket.price)} VND</span>
              </div>

              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`value status ${ticket.status?.toLowerCase()}`}>
                  {ticket.status === 'PENDING' ? 'Pending Activation' : 
                   ticket.status === 'NOT_ACTIVATED' ? 'Not Activated' :
                   ticket.status === 'ACTIVATED' ? 'Activated' : ticket.status}
                </span>
              </div>

              {ticket.expirationTime && (
                <div className="detail-row">
                  <span className="label">Expires:</span>
                  <span className="value">{formatDate(ticket.expirationTime)}</span>
                </div>
              )}
            </div>
          )}

          {/* Transaction Info */}
          {responseCode && (
            <div className="transaction-info">
              <h4>Transaction Information</h4>
              <p><strong>Transaction ID:</strong> <span>{ticketId || 'N/A'}</span></p>
              <p><strong>Payment Method:</strong> <span>VNPay</span></p>
              <p><strong>Status:</strong> <span>Success</span></p>
            </div>
          )}

          {/* QR Code Section */}
          {ticket && (
            <div className="qr-code-section">
              <h4>Your Ticket QR Code</h4>
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
              <p className="qr-instruction">Scan this code at the ticket gate</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="success-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate('/my-tickets')}
            >
              View My Tickets
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/book-ticket')}
            >
              Book Another Ticket
            </button>
            <button 
              className="btn-outline"
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <h3>📧 Important Notes</h3>
            <ul>
              <li>Ticket information has been sent to your email</li>
              <li>Please activate your ticket at the station before use</li>
              <li>Check the expiration date - tickets have a validity period</li>
              <li>Bring your ID/Passport when using student monthly passes</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PaymentSuccess
