import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ticketAPI, scheduleAPI } from '../../services/api'
import Layout from '../../components/Layout'
import './MyTickets.css'

const MyTickets = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [tickets, setTickets] = useState([])
  const [upcomingSchedules, setUpcomingSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTickets()
    fetchSchedules()
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

      // Map backend data to UI format
      const mappedTickets = data.map(ticket => ({
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
    } catch (err) {
      setError(err.message || 'Cannot load ticket list')
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchedules = async () => {
    try {
      const data = await scheduleAPI.getUpcomingSchedules(6)
      setUpcomingSchedules(data)
    } catch (err) {
      console.error('Error fetching schedules:', err)
      // Keep empty array if API fails
      setUpcomingSchedules([])
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
                <h3>No tickets yet</h3>
                <p>You haven't purchased any tickets. Start your journey now!</p>
                <button className="btn-buy-new" onClick={handleBuyNewTicket}>
                  Buy Ticket Now
                </button>
              </div>
            )}

            {!loading && !error && tickets.length > 0 && (
              <div className="tickets-list">
                {tickets.map((ticket) => (
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
                      {ticket.expiryDate && ticket.expiryDate !== '-' && (
                        <div className="ticket-row">
                          <span className="row-label">Expires:</span>
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
                          {loading ? 'Processing...' : 'Activate Ticket'}
                        </button>
                      )}
                      {ticket.status === 'ACTIVE' && (
                        <button
                          className="btn-view-details"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          View Details
                        </button>
                      )}
                      {ticket.status === 'EXPIRED' && (
                        <button
                          className="btn-expired"
                          disabled
                        >
                          Expired
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
              <h3 className="schedule-title">Upcoming Schedule</h3>

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