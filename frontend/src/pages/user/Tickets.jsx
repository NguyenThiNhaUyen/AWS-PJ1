import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'
import axios from 'axios'
import './Tickets.css'

const Tickets = () => {
  const [step, setStep] = useState(1)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState({
    departure: 'Ben Thanh',
    arrival: 'Ba Son'
  })
  const [loading, setLoading] = useState(false)
  const [ticketPrices, setTicketPrices] = useState(null)

  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const response = await axios.get('/api/tickets/ticket-prices')
        setTicketPrices(response.data)
      } catch (error) {
        console.error('Error fetching ticket prices:', error)
      }
    }

    fetchTicketPrices()
  }, [])

  const stationMapping = {
    'Ben Thanh': 'BEN_THANH',
    'Nha Hat TP': 'NHA_HAT_TP',
    'Ba Son': 'BA_SON',
    'Van Thanh': 'VAN_THANH',
    'Tan Cang': 'TAN_CANG',
    'Thao Dien': 'THAO_DIEN',
    'An Phu': 'AN_PHU',
    'Rach Chiec': 'RACH_CHIEC',
    'Phuoc Long': 'PHUOC_LONG',
    'Binh Thai': 'BINH_THAI',
    'Thu Duc': 'THU_DUC',
    'CN cao': 'KHU_CNC',
    'DH Quoc Gia': 'DH_QUOC_GIA',
    'BX Suoi Tien': 'BX_SUOI_TIEN'
  }

  const stations = [
    'Ben Thanh', 'Nha Hat TP', 'Ba Son', 'Van Thanh', 
    'Tan Cang', 'Thao Dien', 'An Phu', 'Rach Chiec',
    'Phuoc Long', 'Binh Thai', 'Thu Duc', 'CN cao',
    'DH Quoc Gia', 'BX Suoi Tien'
  ]

  const calculateSinglePrice = useMemo(() => {
    if (!ticketPrices) return 0
    const departureKey = stationMapping[selectedRoute.departure]
    const arrivalKey = stationMapping[selectedRoute.arrival]
    if (!departureKey || !arrivalKey) return 0
    
    const departurePrices = ticketPrices[departureKey]
    const arrivalIndex = Object.keys(stationMapping).indexOf(selectedRoute.arrival)
    
    return departurePrices ? departurePrices[arrivalIndex] * 1000 : 0
  }, [ticketPrices, selectedRoute])

  const ticketTypes = useMemo(() => [
    { id: 'single', name: 'Single', price: calculateSinglePrice, desc: 'One-time pass allows one journey.' },
    { id: 'day', name: 'Day Pass', price: 5000, desc: 'Unlimited journeys in one day.' },
    { id: '3day', name: '3-Day Pass', price: 20000, desc: 'Unlimited journeys for 3 days.' },
    { id: 'monthly', name: 'Monthly Pass', price: 50000, desc: 'Unlimited journeys for 30 days.' }
  ], [calculateSinglePrice])

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket)
  }

  const handleNext = () => {
    if (step === 1 && !selectedTicket) {
      alert('Please select a ticket type')
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePay = () => {
    setLoading(true)
    setStep(4)
    
    setTimeout(() => {
      setLoading(false)
      setStep(5)
    }, 2000)
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel?')) {
      setStep(1)
      setSelectedTicket(null)
    }
  }

  const handleViewTickets = () => {
    alert('Redirecting to My Tickets page...')
    // In your actual app, use: navigate('/my-tickets')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <Layout>
      <div className="tickets-page">
        <div className="tickets-container">
          {/* Step 1: Select Ticket Type */}
          {step === 1 && (
            <div className="ticket-step">
              <div className="step-card">
                <h2 className="step-title">Select Ticket Type</h2>
                
                <div className="ticket-options">
                  {ticketTypes.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`ticket-option ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <div className="ticket-info">
                        <h3>{ticket.name}</h3>
                        <p>{ticket.desc}</p>
                      </div>
                      <div className="ticket-price">{formatPrice(ticket.price)}</div>
                    </div>
                  ))}
                </div>

                <button className="btn-next" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Route */}
          {step === 2 && (
            <div className="ticket-step">
              <div className="step-card">
                <h2 className="step-title">Select Route</h2>
                
                <div className="route-selector">
                  <div className="route-input-group">
                    <select
                      value={selectedRoute.departure}
                      onChange={(e) => setSelectedRoute({...selectedRoute, departure: e.target.value})}
                      className="route-select"
                    >
                      {stations.map(station => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                    
                    <div className="arrow-icon">→</div>
                    
                    <select
                      value={selectedRoute.arrival}
                      onChange={(e) => setSelectedRoute({...selectedRoute, arrival: e.target.value})}
                      className="route-select"
                    >
                      {stations.map(station => (
                        <option key={station} value={station}>{station}</option>
                      ))}
                    </select>
                  </div>

                  <div className="route-map">
                    <svg viewBox="0 0 600 300" className="metro-map">
                      {/* Horizontal lines */}
                      <line x1="50" y1="75" x2="550" y2="75" stroke="#4d86be" strokeWidth="3" />
                      <line x1="50" y1="150" x2="550" y2="150" stroke="#4d86be" strokeWidth="3" />
                      <line x1="50" y1="225" x2="550" y2="225" stroke="#4d86be" strokeWidth="3" />
                      
                      {/* Vertical connections */}
                      <line x1="200" y1="75" x2="200" y2="150" stroke="#4d86be" strokeWidth="3" />
                      <line x1="300" y1="75" x2="300" y2="225" stroke="#4d86be" strokeWidth="3" />
                      <line x1="400" y1="150" x2="400" y2="225" stroke="#4d86be" strokeWidth="3" />
                      
                      {/* Diagonal line */}
                      <line x1="400" y1="75" x2="500" y2="150" stroke="#4d86be" strokeWidth="3" />
                      
                      {/* Stations */}
                      <circle cx="50" cy="75" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="200" cy="75" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="300" cy="75" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="400" cy="75" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="550" cy="75" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      
                      <circle cx="50" cy="150" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="200" cy="150" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="300" cy="150" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="400" cy="150" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="500" cy="150" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="550" cy="150" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      
                      <circle cx="50" cy="225" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="300" cy="225" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="400" cy="225" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                      <circle cx="550" cy="225" r="8" fill="white" stroke="#4d86be" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Display price for selected route */}
                  {selectedTicket?.id === 'single' && (
                    <div style={{
                      marginTop: '20px',
                      padding: '15px',
                      backgroundColor: 'rgba(77, 134, 190, 0.1)',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '5px' }}>
                        {selectedRoute.departure} → {selectedRoute.arrival}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4d86be' }}>
                        {formatPrice(calculateSinglePrice)}
                      </div>
                    </div>
                  )}
                </div>

                <button className="btn-next" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm Order */}
          {step === 3 && (
            <div className="ticket-step">
              <div className="step-card">
                <h2 className="step-title">Confirm Order</h2>
                
                <div className="order-summary">
                  <div className="summary-row">
                    <span className="summary-label">{selectedRoute.departure} → {selectedRoute.arrival}</span>
                    <span className="summary-value">{formatPrice(selectedTicket?.price || 0)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span className="summary-label">Ticket Type</span>
                    <span className="summary-value">{selectedTicket?.name}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">{formatPrice(selectedTicket?.price || 0)}</span>
                  </div>

                  <div className="payment-method">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <div className="vnpay-logo">
                      <span style={{color: '#0066CC', fontWeight: 'bold', fontSize: '1.2rem'}}>VN</span>
                      <span style={{color: '#E30613', fontWeight: 'bold', fontSize: '1.2rem'}}>Pay</span>
                    </div>
                  </div>

                  <button className="btn-pay" onClick={handlePay}>
                    Pay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Redirecting to VNPay */}
          {step === 4 && (
            <div className="ticket-step">
              <div className="step-card">
                <h2 className="step-title">Redirecting to VNPay</h2>
                
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Please wait while we transfer you to the payment page.</p>
                </div>

                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Payment Success */}
          {step === 5 && (
            <div className="ticket-step">
              <div className="step-card">
                <h2 className="step-title">Payment Success</h2>
                
                <div className="success-container">
                  <div className="success-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#4d86be" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <h3>Payment success</h3>
                  <p>Your payment has been processed successfully.</p>
                  
                  <div className="payment-details">
                    <div className="detail-row">
                      <span>Departure:</span>
                      <span>{selectedRoute.departure}</span>
                    </div>
                    <div className="detail-row">
                      <span>Arrival:</span>
                      <span>{selectedRoute.arrival}</span>
                    </div>
                    <div className="detail-row">
                      <span>Ticket Type:</span>
                      <span>{selectedTicket?.name}</span>
                    </div>
                    <div className="detail-row">
                      <span>ID:</span>
                      <span>1232215/89</span>
                    </div>
                  </div>

                  <button className="btn-tickets" onClick={handleViewTickets}>
                    My Tickets
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline / Timetable Section */}
          <div className="timeline-section">
            <div className="timeline-card">
              <h3 className="timeline-title">Timetable</h3>
              
              <div className="timeline-list">
                <div className="timeline-item">
                  <div className="timeline-info">
                    <div className="station-name">Ben Thanh</div>
                    <div className="station-line">Line 1</div>
                  </div>
                  <div className="timeline-status">
                    <span className="status-badge active">ACTIVE</span>
                    <span className="time">10:00</span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-info">
                    <div className="station-name">Nha Hat TP</div>
                    <div className="station-line">Line 1</div>
                  </div>
                  <div className="timeline-status">
                    <span className="status-badge pricing">PRICING</span>
                    <span className="time">10:55</span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-info">
                    <div className="station-name">Van Thanh</div>
                    <div className="station-line">Line 1</div>
                  </div>
                  <div className="timeline-status">
                    <span className="status-badge active">ACTIVE</span>
                    <span className="time">8:12</span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-info">
                    <div className="station-name">Ba Son</div>
                    <div className="station-line">Line 2</div>
                  </div>
                  <div className="timeline-status">
                    <span className="time">10:32</span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-info">
                    <div className="station-name">Tax Ging</div>
                    <div className="station-line">Line 2</div>
                  </div>
                  <div className="timeline-status">
                    <span className="time">10:43</span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-info">
                    <div className="station-name">Thua Den</div>
                    <div className="station-line">Line 3</div>
                  </div>
                  <div className="timeline-status">
                    <span className="time">10:28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Tickets