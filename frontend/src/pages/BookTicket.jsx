import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import './BookTicket.css'

const BookTicket = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  // TEMP: Mock user for UI testing when not logged in
  const currentUser = user || { id: 1, username: 'demo', fullName: 'Demo User' }
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState([])
  const [stations, setStations] = useState([])
  const [fare, setFare] = useState(null)
  const [loadingFare, setLoadingFare] = useState(false)

  const [formData, setFormData] = useState({
    ticketType: '',
    selectedLine: '',
    startStation: '',
    endStation: '',
    paymentMethod: 'VNPay'
  })

  const [errors, setErrors] = useState({})

  // Ticket types với thông tin chi tiết
  const ticketTypes = [
    {
      id: 'Ve luot',
      name: 'Single Trip',
      description: 'One-time journey only',
      icon: '🎫',
      duration: 'One trip',
      priceNote: '6,000 - 19,000 VND',
      priceRange: 'By distance',
      popular: true
    },
    {
      id: 'Ve ngay',
      name: 'Day Pass',
      description: 'Unlimited travel for 1 day',
      icon: '📅',
      duration: '1 day',
      price: '40,000',
      fixedPrice: 40000,
      popular: false
    },
    {
      id: 'Ve 3 ngay',
      name: '3-Day Pass',
      description: 'Unlimited travel for 3 consecutive days',
      icon: '🗓️',
      duration: '3 days',
      price: '90,000',
      fixedPrice: 90000,
      popular: false
    },
    {
      id: 'Ve thang',
      name: 'Monthly Pass',
      description: 'Unlimited travel for 30 days',
      icon: '📆',
      duration: '30 days',
      price: '300,000',
      fixedPrice: 300000,
      popular: false
    },
    {
      id: 'Ve thang HSSV',
      name: 'Student Pass',
      description: 'For students (30 days)',
      icon: '🎓',
      duration: '30 days',
      price: '150,000',
      fixedPrice: 150000,
      popular: false
    }
  ]

  // Redirect if not authenticated
  // TEMP: Disabled for UI testing
  /*
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])
  */

  // Load routes
  useEffect(() => {
    fetchRoutes()
  }, [])

  // Load stations when line is selected
  useEffect(() => {
    if (formData.selectedLine) {
      fetchStationsByLine(formData.selectedLine)
    } else {
      setStations([])
    }
  }, [formData.selectedLine])

  // Calculate fare when stations change
  useEffect(() => {
    if (formData.ticketType === 'Ve luot' && formData.startStation && formData.endStation) {
      calculateFare()
    }
  }, [formData.startStation, formData.endStation, formData.ticketType])

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes')
      if (response.ok) {
        const data = await response.json()
        // Chỉ lấy Line 1
        const line1 = data.find(r => r.lineName === 'Line 1')
        setRoutes(line1 ? [line1] : [{ lineName: 'Line 1', stationCount: 14 }])
      } else {
        // Fallback to mock data - chỉ Line 1
        setRoutes([
          { lineName: 'Line 1', stationCount: 14 }
        ])
      }
    } catch (error) {
      console.error('Error fetching routes:', error)
      // Mock data for testing - chỉ Line 1
      setRoutes([
        { lineName: 'Line 1', stationCount: 14 }
      ])
    }
  }

  const fetchStationsByLine = async (lineName) => {
    try {
      const response = await fetch(`/api/routes/${encodeURIComponent(lineName)}/stations`)
      if (response.ok) {
        const data = await response.json()
        setStations(data)
      } else {
        // Fallback to mock data
        loadMockStations(lineName)
      }
    } catch (error) {
      console.error('Error fetching stations:', error)
      // Mock data for testing
      loadMockStations(lineName)
    }
  }

  const loadMockStations = (lineName) => {
    // Chỉ có Line 1: Bến Thành - Suối Tiên (14 ga)
    const mockStations = {
      'Line 1': [
        { id: 1, name: 'Bến Thành', lineName: 'Line 1', orderIndex: 1 },
        { id: 2, name: 'Nhà hát Thành phố', lineName: 'Line 1', orderIndex: 2 },
        { id: 3, name: 'Ba Son', lineName: 'Line 1', orderIndex: 3 },
        { id: 4, name: 'Công viên Văn Thánh', lineName: 'Line 1', orderIndex: 4 },
        { id: 5, name: 'Tân Cảng', lineName: 'Line 1', orderIndex: 5 },
        { id: 6, name: 'Thảo Điền', lineName: 'Line 1', orderIndex: 6 },
        { id: 7, name: 'An Phú', lineName: 'Line 1', orderIndex: 7 },
        { id: 8, name: 'Rạch Chiếc', lineName: 'Line 1', orderIndex: 8 },
        { id: 9, name: 'Phước Long', lineName: 'Line 1', orderIndex: 9 },
        { id: 10, name: 'Bình Thái', lineName: 'Line 1', orderIndex: 10 },
        { id: 11, name: 'Thủ Đức', lineName: 'Line 1', orderIndex: 11 },
        { id: 12, name: 'Khu Công nghệ cao', lineName: 'Line 1', orderIndex: 12 },
        { id: 13, name: 'Đại học Quốc gia', lineName: 'Line 1', orderIndex: 13 },
        { id: 14, name: 'Bến xe Suối Tiên', lineName: 'Line 1', orderIndex: 14 }
      ]
    }
    setStations(mockStations[lineName] || [])
  }

  const calculateFare = async () => {
    if (!formData.startStation || !formData.endStation) return
    
    setLoadingFare(true)
    try {
      const response = await fetch(
        `/api/fares?start=${encodeURIComponent(formData.startStation)}&end=${encodeURIComponent(formData.endStation)}`
      )
      if (response.ok) {
        const data = await response.json()
        setFare(data)
      } else {
        // Mock fare calculation based on distance
        const startIdx = stations.findIndex(s => s.name === formData.startStation)
        const endIdx = stations.findIndex(s => s.name === formData.endStation)
        const distance = Math.abs(endIdx - startIdx)
        // Giá vé: 6.000 VNĐ cho 1-3 trạm, sau đó +1.000 VNĐ/trạm, tối đa 19.000 VNĐ
        let basePrice = 6000
        if (distance > 3) {
          basePrice = Math.min(6000 + ((distance - 3) * 1000), 19000)
        }
        setFare({
          startStation: formData.startStation,
          endStation: formData.endStation,
          price: basePrice,
          distance: distance,
          estimatedTime: distance * 3
        })
      }
    } catch (error) {
      console.error('Error calculating fare:', error)
      // Mock data fallback
      const startIdx = stations.findIndex(s => s.name === formData.startStation)
      const endIdx = stations.findIndex(s => s.name === formData.endStation)
      const distance = Math.abs(endIdx - startIdx)
      let basePrice = 6000
      if (distance > 3) {
        basePrice = Math.min(6000 + ((distance - 3) * 1000), 19000)
      }
      setFare({
        startStation: formData.startStation,
        endStation: formData.endStation,
        price: basePrice,
        distance: distance,
        estimatedTime: distance * 3
      })
    } finally {
      setLoadingFare(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (stepNumber) => {
    const newErrors = {}

    if (stepNumber === 1) {
      if (!formData.ticketType) {
        newErrors.ticketType = 'Please select a ticket type'
      }
    }

    if (stepNumber === 2 && formData.ticketType === 'Ve luot') {
      if (!formData.selectedLine) {
        newErrors.selectedLine = 'Please select a metro line'
      }
      if (!formData.startStation) {
        newErrors.startStation = 'Please select departure station'
      }
      if (!formData.endStation) {
        newErrors.endStation = 'Please select arrival station'
      }
      if (formData.startStation === formData.endStation) {
        newErrors.endStation = 'Arrival station must be different from departure'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setLoading(true)
    try {
      const purchaseData = {
        accountId: currentUser.id,  // Use mock user if not logged in
        startStation: formData.startStation || null,
        endStation: formData.endStation || null,
        paymentMethod: formData.paymentMethod,
        ticketTypeName: formData.ticketType
      }

      const response = await fetch('/api/payments/vnpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(purchaseData)
      })

      if (response.ok) {
        const result = await response.json()
        // Redirect to VNPay
        window.location.href = result.payUrl
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.message || 'Có lỗi xảy ra khi tạo thanh toán' })
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  const getSelectedTicketType = () => {
    return ticketTypes.find(t => t.id === formData.ticketType)
  }

  const getFinalPrice = () => {
    const selectedType = getSelectedTicketType()
    if (selectedType?.id === 'Ve luot' && fare) {
      return fare.price?.toLocaleString('vi-VN')
    }
    if (selectedType?.fixedPrice) {
      return selectedType.fixedPrice.toLocaleString('vi-VN')
    }
    return selectedType?.price
  }

  // TEMP: Disabled auth check for UI testing
  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <Layout>
      <div className="book-ticket-container">
        <div className="book-ticket-header">
          <h1>Book Metro Ticket</h1>
          <p>Choose the ticket type and route that suits you</p>
        </div>

        {/* Progress Steps */}
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <span>Select Ticket</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <span>Route</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirm</span>
          </div>
        </div>

        <div className="booking-content">
          {/* Step 1: Select Ticket Type */}
          {step === 1 && (
            <div className="step-content">
              <h2>Select ticket type</h2>
              <div className="ticket-types-grid">
                {ticketTypes.map(ticket => (
                  <div 
                    key={ticket.id}
                    className={`ticket-type-card ${formData.ticketType === ticket.id ? 'selected' : ''} ${ticket.popular ? 'popular' : ''}`}
                    onClick={() => handleInputChange('ticketType', ticket.id)}
                  >
                    {ticket.popular && <div className="popular-badge">Popular</div>}
                    <div className="ticket-icon">{ticket.icon}</div>
                    <div className="ticket-content">
                      <h3>{ticket.name}</h3>
                      <p>{ticket.description}</p>
                    </div>
                    <div className="ticket-details">
                      <div className="duration">⏰ {ticket.duration}</div>
                      <div className="price">
                        {ticket.price ? `${ticket.price.toLocaleString()} VND` : ticket.priceNote}
                      </div>
                    </div>
                    <div className="ticket-radio"></div>
                  </div>
                ))}
              </div>
              {errors.ticketType && <div className="error-message">{errors.ticketType}</div>}
            </div>
          )}

          {/* Step 2: Select Route (only for route-based tickets) */}
          {step === 2 && (
            <div className="step-content">
              <h2>Select route</h2>
              {formData.ticketType === 'Ve luot' ? (
                <div className="route-selection">
                  {/* Select Metro Line */}
                  <div className="line-selection">
                    <h3>Metro Line 1: Ben Thanh - Suoi Tien</h3>
                    <div className="line-options">
                      {routes.map((route) => {
                        const color = '#0066cc' // Blue cho Line 1
                        const code = 'M1'
                        
                        return (
                          <div
                            key={route.lineName}
                            className={`line-option ${formData.selectedLine === route.lineName ? 'selected' : ''}`}
                            style={{
                              '--line-color': color,
                              borderColor: formData.selectedLine === route.lineName ? color : 'rgba(77, 134, 190, 0.3)'
                            }}
                            onClick={() => {
                              handleInputChange('selectedLine', route.lineName)
                              handleInputChange('startStation', '')
                              handleInputChange('endStation', '')
                            }}
                          >
                            <div className="line-badge" style={{ backgroundColor: color }}>
                              {code}
                            </div>
                            <div className="line-info">
                              <span className="line-title">Ben Thanh - Suoi Tien</span>
                              <span className="line-stations">14 stations: 3 underground + 11 elevated</span>
                            </div>
                            {formData.selectedLine === route.lineName && (
                              <div className="line-check">✓</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    {errors.selectedLine && <span className="error-text">{errors.selectedLine}</span>}
                  </div>

                  {/* Select Stations */}
                  {formData.selectedLine && (
                    <div className="route-inputs">
                      <div className="input-group">
                        <label>Departure Station</label>
                        <select 
                          value={formData.startStation}
                          onChange={(e) => handleInputChange('startStation', e.target.value)}
                          className={errors.startStation ? 'error' : ''}
                        >
                          <option value="">Select departure station</option>
                          {stations.map(station => (
                            <option key={station.id} value={station.name}>
                              {station.name}
                            </option>
                          ))}
                        </select>
                        {errors.startStation && <span className="error-text">{errors.startStation}</span>}
                      </div>

                      <div className="route-arrow">↓</div>

                      <div className="input-group">
                        <label>Arrival Station</label>
                        <select 
                          value={formData.endStation}
                          onChange={(e) => handleInputChange('endStation', e.target.value)}
                          className={errors.endStation ? 'error' : ''}
                        >
                          <option value="">Select arrival station</option>
                          {stations.map(station => (
                            <option key={station.id} value={station.name}>
                              {station.name}
                            </option>
                          ))}
                        </select>
                        {errors.endStation && <span className="error-text">{errors.endStation}</span>}
                      </div>
                    </div>
                  )}

                  {/* Fare Preview */}
                  {(formData.startStation && formData.endStation) && (
                    <div className="fare-preview">
                      <h3>Fare Information</h3>
                      {loadingFare ? (
                        <div className="loading">Calculating fare...</div>
                      ) : fare ? (
                        <div className="fare-details">
                          <div className="route-info">
                            <span>{fare.startStation} → {fare.endStation}</span>
                          </div>
                          <div className="price-info">
                            <span className="price">{fare.price?.toLocaleString('vi-VN')} VND</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div className="ticket-summary">
                  <div className="summary-card">
                    <div className="ticket-icon-large">{getSelectedTicketType()?.icon}</div>
                    <h3>{getSelectedTicketType()?.name}</h3>
                    <p>{getSelectedTicketType()?.description}</p>
                    <div className="price-large">{getSelectedTicketType()?.price} VND</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="step-content">
              <h2>Confirm Information</h2>
              <div className="confirmation-content">
                <div className="summary-card">
                  <div className="summary-header">
                    <h3>Ticket Information</h3>
                    <span className="ticket-badge">{getSelectedTicketType()?.name}</span>
                  </div>
                  <div className="summary-details">
                    <div className="summary-row">
                      <label>Ticket Type</label>
                      <span className="value">{getSelectedTicketType()?.name}</span>
                    </div>
                    {formData.ticketType === 'Ve luot' && (
                      <div className="summary-row">
                        <label>Route</label>
                        <span className="value">{formData.startStation} → {formData.endStation}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <label>Validity</label>
                      <span className="value">{getSelectedTicketType()?.duration}</span>
                    </div>
                    <div className="summary-row total">
                      <label>Total</label>
                      <span className="value">{getFinalPrice()} VND</span>
                    </div>
                  </div>

                  <div className="payment-section">
                    <h3>Payment Method</h3>
                    <div className="payment-methods">
                      <div 
                        className={`payment-method ${formData.paymentMethod === 'VNPay' ? 'selected' : ''}`}
                        onClick={() => handleInputChange('paymentMethod', 'VNPay')}
                      >
                        <input 
                          type="radio" 
                          id="vnpay" 
                          name="payment" 
                          value="VNPay"
                          checked={formData.paymentMethod === 'VNPay'}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                        <div className="payment-info">
                          <h4>VNPay</h4>
                          <p>Pay via VNPay e-wallet</p>
                        </div>
                        <img src="https://vnpay.vn/assets/images/logo-icon/logo-primary.svg" alt="VNPay" style={{ width: '60px', height: 'auto' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {errors.submit && <div className="error-message">{errors.submit}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="booking-actions">
          {step > 1 && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={prevStep}
              disabled={loading}
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button 
              type="button" 
              className="btn-primary"
              onClick={nextStep}
            >
              Continue
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default BookTicket
