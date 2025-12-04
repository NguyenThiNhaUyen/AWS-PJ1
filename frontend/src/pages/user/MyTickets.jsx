import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ticketAPI } from '../../services/api'
import Layout from '../../components/Layout'
import './MyTickets.css'

const MyTickets = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL') // ALL, ACTIVE, USED
  const [stats, setStats] = useState({ active: 0, used: 0, total: 0 })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user || !user.id) {
        setError('Please log in to view tickets')
        setLoading(false)
        return
      }

      const data = await ticketAPI.getMyTickets(user.id)

      // Filter only ACTIVE and USED tickets (exclude PENDING and EXPIRED)
      const activeAndUsedTickets = data.filter(ticket => 
        ticket.status === 'ACTIVE' || ticket.status === 'USED'
      )

      // Map backend data to UI format
      const mappedTickets = activeAndUsedTickets.map(ticket => ({
        id: ticket.id,
        type: ticket.ticketTypeName || 'Single Trip',
        line: 'Ben Thanh - Suoi Tien',
        departure: ticket.startStation || 'N/A',
        arrival: ticket.endStation || 'N/A',
        price: ticket.price || 0,
        status: ticket.status || 'PENDING',
        statusText: getStatusText(ticket.status),
        activatedDate: ticket.activationTime ? new Date(ticket.activationTime).toLocaleString('vi-VN') : '-',
        expiryDate: ticket.expirationTime ? new Date(ticket.expirationTime).toLocaleString('vi-VN') : '-'
      }))

      setTickets(mappedTickets)
      
      // Calculate statistics
      const activeCount = mappedTickets.filter(t => t.status === 'ACTIVE').length
      const usedCount = mappedTickets.filter(t => t.status === 'USED').length
      setStats({
        active: activeCount,
        used: usedCount,
        total: mappedTickets.length
      })
    } catch (err) {
      setError(err.message || 'Cannot load ticket list')
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Active'
      case 'PENDING': return 'Not Activated'
      case 'EXPIRED': return 'Expired'
      case 'USED': return 'Used'
      default: return status
    }
  }

  const handleActivateTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to activate this ticket?')) {
      return
    }

    try {
      setLoading(true)
      // Note: Backend expects ticketId as query param
      await ticketAPI.activateTicket(ticketId)
      alert('Ticket activated successfully!')
      await fetchTickets()
    } catch (err) {
      alert(err.message || 'Cannot activate ticket')
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
    switch (status) {
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
              <h1 className="page-title">My Tickets</h1>
              <button className="btn-buy-new" onClick={handleBuyNewTicket}>
                Buy New Ticket
              </button>
            </div>

            {/* Statistics Section */}
            {!loading && !error && (
              <div className="tickets-stats">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <div className="stat-label">Total Tickets</div>
                    <div className="stat-value">{stats.total}</div>
                  </div>
                </div>
                <div className="stat-card active">
                  <div className="stat-icon">🎫</div>
                  <div className="stat-info">
                    <div className="stat-label">Active Tickets</div>
                    <div className="stat-value">{stats.active}</div>
                  </div>
                </div>
                <div className="stat-card used">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <div className="stat-label">Used Tickets</div>
                    <div className="stat-value">{stats.used}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            {!loading && !error && tickets.length > 0 && (
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${filterStatus === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ALL')}
                >
                  All ({stats.total})
                </button>
                <button 
                  className={`filter-tab ${filterStatus === 'ACTIVE' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ACTIVE')}
                >
                  Active ({stats.active})
                </button>
                <button 
                  className={`filter-tab ${filterStatus === 'USED' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('USED')}
                >
                  Used ({stats.used})
                </button>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading tickets...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button className="btn-retry" onClick={fetchTickets}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && tickets.length === 0 && (
              <div className="empty-state">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h16v11z" fill="rgba(77, 134, 190, 0.3)" />
                </svg>
                <h3>No active or used tickets</h3>
                <p>You don't have any active or used tickets yet. Purchase a ticket to start traveling!</p>
                <button className="btn-buy-new" onClick={handleBuyNewTicket}>
                  Buy Ticket Now
                </button>
              </div>
            )}

            {!loading && !error && tickets.length > 0 && (
              <div className="tickets-list">
                {tickets
                  .filter(ticket => filterStatus === 'ALL' || ticket.status === filterStatus)
                  .map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                      <div className="ticket-id">
                        <span className="label">Ticket ID:</span>
                        <span className="value">{ticket.id}</span>
                      </div>
                      <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                        {ticket.statusText}
                      </span>
                    </div>

                    <div className="ticket-body">
                      <div className="ticket-row">
                        <span className="row-label">Type:</span>
                        <span className="row-value">{ticket.type}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="row-label">Line:</span>
                        <span className="row-value">{ticket.line}</span>
                      </div>
                      <div className="ticket-row route">
                        <span className="row-label">From:</span>
                        <span className="row-value">{ticket.departure}</span>
                        <span className="arrow">→</span>
                        <span className="row-label">To:</span>
                        <span className="row-value">{ticket.arrival}</span>
                      </div>
                      <div className="ticket-row">
                        <span className="row-label">Price:</span>
                        <span className="row-value price">{ticket.price.toLocaleString('vi-VN')} VND</span>
                      </div>
                      {ticket.status === 'PENDING' && (
                        <div className="ticket-row">
                          <span className="row-label">Activation:</span>
                          <span className="row-value">{ticket.statusText}</span>
                        </div>
                      )}
                      {ticket.status === 'ACTIVE' && (
                        <>
                          <div className="ticket-row">
                            <span className="row-label">Status:</span>
                            <span className="row-value status-active">[ACTIVE] (Green)</span>
                          </div>
                          <div className="ticket-row">
                            <span className="row-label">Activated:</span>
                            <span className="row-value">{ticket.activatedDate}</span>
                          </div>
                        </>
                      )}
                      {ticket.status === 'USED' && (
                        <div className="ticket-row">
                          <span className="row-label">Used on:</span>
                          <span className="row-value">{ticket.expiryDate}</span>
                        </div>
                      )}
                      {ticket.expiryDate && ticket.expiryDate !== '-' && ticket.status === 'ACTIVE' && (
                        <div className="ticket-row">
                          <span className="row-label">Expires:</span>
                          <span className="row-value">{ticket.expiryDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="ticket-footer">
                      {ticket.status === 'ACTIVE' && (
                        <button
                          className="btn-view-details"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          View Details
                        </button>
                      )}
                      {ticket.status === 'USED' && (
                        <div className="ticket-used-badge">
                          <span>✓ Ticket Used</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tips-sidebar">
            <div className="tips-card">
              <h3 className="tips-title">💡 Tips & Reminders</h3>

              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">🎫</div>
                  <div className="tip-content">
                    <h4>How to Activate Tickets</h4>
                    <p>Scan your ticket QR code at the station gate. Tickets activate automatically on first use.</p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon">⏰</div>
                  <div className="tip-content">
                    <h4>Validity Period</h4>
                    <p>Single trip tickets are valid for 2 hours. Pass tickets are valid according to their duration (1 day, 3 days, or 30 days).</p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon">📱</div>
                  <div className="tip-content">
                    <h4>Keep Ticket Ready</h4>
                    <p>Save your ticket QR code for quick access. You can find all tickets in "My Tickets" section.</p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon">🎓</div>
                  <div className="tip-content">
                    <h4>Student Pass</h4>
                    <p>Bring your student ID when using student monthly passes. Required for verification at gates.</p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon">💳</div>
                  <div className="tip-content">
                    <h4>Refund Policy</h4>
                    <p>Unactivated tickets can be refunded within 24 hours with 10% fee. Activated tickets are non-refundable.</p>
                  </div>
                </div>

                <div className="tip-item">
                  <div className="tip-icon">📞</div>
                  <div className="tip-content">
                    <h4>Need Help?</h4>
                    <p>Contact our hotline 1900 6688 or visit Help Center for support.</p>
                  </div>
                </div>
              </div>

              <div className="tips-actions">
                <button className="btn-help" onClick={() => navigate('/help')}>
                  Visit Help Center
                </button>
                <button className="btn-timetable" onClick={() => navigate('/timetable')}>
                  View Timetable
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyTickets