import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { metroAPI } from '../services/api'
import Layout from '../components/Layout'
import './Timetable.css'

const Timetable = () => {
  const { user } = useAuth()
  const [currentStation, setCurrentStation] = useState('')
  const [destinationStation, setDestinationStation] = useState('')
  const [stations, setStations] = useState([])
  const [upcomingTrips, setUpcomingTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTrip, setSelectedTrip] = useState(null)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch stations on mount
  useEffect(() => {
    fetchStations()
  }, [])

  // Fetch upcoming trips when station changes
  useEffect(() => {
    if (currentStation) {
      fetchUpcomingTrips()
      // Refresh every 30 seconds
      const interval = setInterval(fetchUpcomingTrips, 30000)
      return () => clearInterval(interval)
    }
  }, [currentStation])

  const fetchStations = async () => {
    try {
      const data = await metroAPI.getStations()
      setStations(data)
      if (data.length > 0) {
        setCurrentStation(data[0].name)
      }
    } catch (error) {
      console.error('Error fetching stations:', error)
    }
  }

  const fetchUpcomingTrips = async () => {
    if (!currentStation) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/stations/${encodeURIComponent(currentStation)}/arrivals?limit=10`)
      const data = await response.json()
      console.log('API Response:', data)
      console.log('Current Station:', currentStation)
      setUpcomingTrips(data)
    } catch (error) {
      console.error('Error fetching upcoming trips:', error)
      setUpcomingTrips([])
    } finally {
      setLoading(false)
    }
  }

  const getTimeUntil = (scheduledTime) => {
    if (!scheduledTime) return null
    const scheduled = new Date(scheduledTime)
    const diff = scheduled - currentTime
    
    if (diff < 0) return 'Departing'
    
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    if (minutes === 0) return `${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  const formatTime = (dateTime) => {
    if (!dateTime) return '-'
    return new Date(dateTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Lấy tên chuyến đi dựa vào hướng
  const getTripDirection = (direction) => {
    if (direction === 'A_TO_B') {
      return 'Chuyến đi Suối Tiên'
    } else {
      return 'Chuyến đi Bến Thành'
    }
  }

  const getFilteredTrips = () => {
    console.log('Filtering trips, total:', upcomingTrips.length, 'destination:', destinationStation)
    if (!destinationStation) return upcomingTrips
    
    // Filter trips based on line and direction
    return upcomingTrips.filter(trip => {
      // Check if the line serves both current and destination stations
      const currentStationObj = stations.find(s => s.name === currentStation)
      const destStationObj = stations.find(s => s.name === destinationStation)
      
      if (!currentStationObj || !destStationObj) return true
      
      // If they're on the same line, check direction
      if (currentStationObj.lineName === destStationObj.lineName && trip.lineName === currentStationObj.lineName) {
        const currentIndex = currentStationObj.orderIndex
        const destIndex = destStationObj.orderIndex
        
        // A_TO_B means increasing order, B_TO_A means decreasing order
        if (destIndex > currentIndex) {
          return trip.direction === 'A_TO_B'
        } else {
          return trip.direction === 'B_TO_A'
        }
      }
      
      return true
    })
  }

  const handleViewTripDetails = async (tripId) => {
    try {
      const response = await fetch(`/api/trips/${tripId}/stops`)
      const stops = await response.json()
      setSelectedTrip({ id: tripId, stops })
    } catch (error) {
      console.error('Error fetching trip details:', error)
    }
  }

  return (
    <Layout>
      <div className="timetable-container">
        <div className="timetable-header">
          <div className="header-content">
            <h1>Real-Time Metro Schedule</h1>
            <p>Live train arrivals and departures</p>
          </div>
          <div className="live-clock">
            <div className="clock-icon">🕐</div>
            <div className="clock-time">{currentTime.toLocaleTimeString('en-US')}</div>
          </div>
        </div>

        {/* Station Selection */}
        <div className="station-selector">
          <div className="selector-card current-station">
            <div className="selector-header">
              <div className="icon">📍</div>
              <label>Current Station</label>
            </div>
            <select 
              value={currentStation} 
              onChange={(e) => setCurrentStation(e.target.value)}
              className="station-select"
            >
              <option value="">Select your station</option>
              {stations.map(station => (
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="route-arrow">→</div>

          <div className="selector-card destination-station">
            <div className="selector-header">
              <div className="icon">🎯</div>
              <label>Destination (Optional)</label>
            </div>
            <select 
              value={destinationStation} 
              onChange={(e) => setDestinationStation(e.target.value)}
              className="station-select"
            >
              <option value="">All directions</option>
              {stations
                .filter(s => s.name !== currentStation)
                .map(station => (
                  <option key={station.id} value={station.name}>
                    {station.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Upcoming Trips */}
        {currentStation && (
          <div className="upcoming-section">
            <div className="section-header">
              <h2>🚇 Upcoming Trains at {currentStation}</h2>
              <button className="btn-refresh" onClick={fetchUpcomingTrips}>
                🔄 Refresh
              </button>
            </div>

            {/* Validation: Same station selected */}
            {destinationStation && currentStation === destinationStation ? (
              <div className="validation-warning">
                <div className="warning-icon">⚠️</div>
                <h3>Invalid Route Selection</h3>
                <p>Please select a different destination station.</p>
              </div>
            ) : loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading train information...</p>
              </div>
            ) : getFilteredTrips().length > 0 ? (
              <div className="trips-list">
                {getFilteredTrips().map((trip, index) => {
                  const timeUntil = getTimeUntil(trip.scheduledArrival)
                  const isImminent = timeUntil && timeUntil !== 'Departing' && parseInt(timeUntil) <= 3
                  
                  return (
                    <div 
                      key={trip.tripId} 
                      className={`trip-card ${isImminent ? 'imminent' : ''} ${timeUntil === 'Departing' ? 'departing' : ''}`}
                    >
                      <div className="trip-number">#{index + 1}</div>
                      
                      <div className="trip-info">
                        <div className="trip-direction-info">
                          <div className="direction-label">🚇 {getTripDirection(trip.direction)}</div>
                        </div>
                        <div className="trip-details">
                          <div className="detail-item">
                            <span className="label">Scheduled:</span>
                            <span className="value">{formatTime(trip.scheduledArrival)}</span>
                          </div>
                          {trip.actualArrival && (
                            <div className="detail-item">
                              <span className="label">Actual:</span>
                              <span className="value actual">{formatTime(trip.actualArrival)}</span>
                            </div>
                          )}
                          {trip.delayMinutes > 0 && (
                            <div className="detail-item delay">
                              <span className="label">Delay:</span>
                              <span className="value">{trip.delayMinutes} min</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="trip-status">
                        {timeUntil && (
                          <div className="countdown">
                            <div className="countdown-label">Arrives in</div>
                            <div className="countdown-value">{timeUntil}</div>
                          </div>
                        )}
                        <div className={`status-badge ${trip.status.toLowerCase()}`}>
                          {trip.status}
                        </div>
                      </div>

                      <button 
                        className="btn-view-route"
                        onClick={() => handleViewTripDetails(trip.tripId)}
                      >
                        View Route
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🚫</div>
                <h3>No upcoming trains</h3>
                <p>There are no scheduled trains at this time. Please check back later.</p>
              </div>
            )}
          </div>
        )}

        {/* Trip Details Modal */}
        {selectedTrip && (
          <div className="modal-overlay" onClick={() => setSelectedTrip(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Trip Route Details</h3>
                <button className="btn-close" onClick={() => setSelectedTrip(null)}>✕</button>
              </div>
              
              <div className="route-timeline">
                {selectedTrip.stops.map((stop, index) => (
                  <div 
                    key={index} 
                    className={`timeline-stop ${stop.stationName === currentStation ? 'current' : ''} ${stop.stationName === destinationStation ? 'destination' : ''}`}
                  >
                    <div className="stop-marker">
                      <div className="marker-dot"></div>
                      {index < selectedTrip.stops.length - 1 && <div className="marker-line"></div>}
                    </div>
                    
                    <div className="stop-info">
                      <div className="stop-name">
                        {stop.stationName}
                        {stop.stationName === currentStation && <span className="badge-current">Current</span>}
                        {stop.stationName === destinationStation && <span className="badge-dest">Destination</span>}
                      </div>
                      <div className="stop-time">
                        {formatTime(stop.scheduledArrival)}
                        {stop.actualArrival && ` (Actual: ${formatTime(stop.actualArrival)})`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div className="quick-info">
          <h3>ℹ️ Service Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">🌅</div>
              <div className="info-text">
                <strong>First Train:</strong> 6:00 AM
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🌙</div>
              <div className="info-text">
                <strong>Last Train:</strong> 10:00 PM
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">⏱️</div>
              <div className="info-text">
                <strong>Frequency:</strong> 8-10 minutes
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <strong>Hotline:</strong> 1900 6688
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Timetable
