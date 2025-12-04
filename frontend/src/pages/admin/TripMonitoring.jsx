import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
// import { getRunningTrips, getTripDetails, updateTripStatus } from '../services/adminService'
import './TripMonitoring.css'

const TripMonitoring = () => {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showStatusPopup, setShowStatusPopup] = useState(false)

  useEffect(() => {
    fetchTrips()
    // Auto refresh mỗi 30 giây
    const interval = setInterval(fetchTrips, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRunningTrips()
      setTrips(data.trips || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách chuyến')
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (tripId) => {
    try {
      const data = await getTripDetails(tripId)
      setSelectedTrip(data.trip)
      setShowStatusPopup(true)
    } catch (err) {
      alert(err.message || 'Không thể tải chi tiết chuyến')
    }
  }

  const handleUpdateStatus = async (tripId, newStatus) => {
    try {
      await updateTripStatus(tripId, newStatus)
      alert('Cập nhật trạng thái thành công')
      setShowStatusPopup(false)
      fetchTrips()
    } catch (err) {
      alert(err.message || 'Không thể cập nhật trạng thái')
    }
  }

  const getStatusClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'RUNNING': return 'running'
      case 'DELAYED': return 'delayed'
      case 'SCHEDULED': return 'scheduled'
      case 'CANCELLED': return 'cancelled'
      case 'ISSUE': return 'issue'
      default: return ''
    }
  }

  const getStatusText = (status) => {
    switch(status?.toUpperCase()) {
      case 'RUNNING': return 'RUNNING'
      case 'DELAYED': return 'DELAYED'
      case 'SCHEDULED': return 'SCHEDULED'
      case 'CANCELLED': return 'CANCELLED'
      case 'ISSUE': return 'ISSUE'
      default: return status
    }
  }

  if (loading && trips.length === 0) {
    return (
      <Layout>
        <div className="trip-monitoring">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="trip-monitoring">
        <div className="monitoring-container">
          <div className="monitoring-header">
            <h1 className="monitoring-title">| Sidebar chọn: Dashboard |</h1>
          </div>

          {/* Hàng 1: 3 thẻ KPI */}
          <div className="kpi-section">
            <h2 className="section-title">[Hàng 1: 3 thẻ KPI]</h2>
            
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-title">Card 1</div>
                <div className="kpi-item">
                  <span className="kpi-label">- Tiêu đề:</span>
                  <span className="kpi-value">Tổng số chuyến hôm nay</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label">- Giá trị:</span>
                  <span className="kpi-value">120</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label">- Ghi chú:</span>
                  <span className="kpi-value status-list">
                    <span className="status-tag running">[x] RUNNING</span>
                    <span className="status-tag delayed">[x] DELAYED</span>
                    <span className="status-tag scheduled">[x] SCHEDULED</span>
                  </span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-title">Card 2</div>
                <div className="kpi-item">
                  <span className="kpi-label">- Tiêu đề:</span>
                  <span className="kpi-value">Tuyến trễ nhất</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label">- Nội dung:</span>
                  <span className="kpi-value">Line 1 - Avg delay 4.2 phút</span>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-title">Card 3</div>
                <div className="kpi-item">
                  <span className="kpi-label">- Tiêu đề:</span>
                  <span className="kpi-value">Ga trễ nhất</span>
                </div>
                <div className="kpi-item">
                  <span className="kpi-label">- Nội dung:</span>
                  <span className="kpi-value">Bến Thành - 35 lượt trễ / ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hàng 2: 2 biểu đồ */}
          <div className="charts-section">
            <h2 className="section-title">[Hàng 2: 2 biểu đồ]</h2>
            
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-title">[Biểu đồ trái]</div>
                <div className="chart-subtitle">
                  - Tiêu đề: Độ trễ trung bình theo tuyến
                </div>
                <div className="chart-subtitle">
                  - Dạng: Bar chart - trục X: Line 1,2,3; trục Y: phút
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-title">[Biểu đồ phải]</div>
                <div className="chart-subtitle">
                  - Tiêu đề: Độ trễ theo ngày (7 ngày gần nhất)
                </div>
                <div className="chart-subtitle">
                  - Dạng: Line chart
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách chuyến */}
          <div className="trips-section">
            <h2 className="section-title">[Nội dung mặc định: TRIP MONITORING]</h2>
            <h3 className="subsection-title">[Thanh lọc phía trên]</h3>

            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button className="btn-retry" onClick={fetchTrips}>Thử lại</button>
              </div>
            )}

            <div className="trips-table">
              <div className="table-header">
                <div className="col-trip-id">Trip ID</div>
                <div className="col-departure">Giờ xuất bến</div>
                <div className="col-route">Hướng</div>
                <div className="col-status">Trạng thái</div>
                <div className="col-delay">Max Delay</div>
                <div className="col-action">Hành động</div>
              </div>

              <div className="table-body">
                {(trips.length > 0 ? trips : [
                  {
                    id: 12,
                    departureTime: '07:00',
                    route: 'Bến Thành → Suối Tiên',
                    status: 'RUNNING',
                    maxDelay: '3 phút',
                    statusNote: '[Đời trạng thái]'
                  },
                  {
                    id: 13,
                    departureTime: '07:15',
                    route: 'Suối Tiên → Bến Thành',
                    status: 'DELAYED',
                    maxDelay: '7 phút',
                    statusNote: '[Đời trạng thái]'
                  },
                  {
                    id: 14,
                    departureTime: '07:30',
                    route: 'Bến Thành → Suối Tiên',
                    status: 'SCHEDULED',
                    maxDelay: '0 phút',
                    statusNote: '[Đời trạng thái]'
                  }
                ]).map((trip) => (
                  <div key={trip.id} className="table-row">
                    <div className="col-trip-id">{trip.id}</div>
                    <div className="col-departure">{trip.departureTime}</div>
                    <div className="col-route">{trip.route}</div>
                    <div className="col-status">
                      <span className={`status-badge ${getStatusClass(trip.status)}`}>
                        {getStatusText(trip.status)}
                      </span>
                    </div>
                    <div className="col-delay">{trip.maxDelay}</div>
                    <div className="col-action">
                      <button 
                        className="btn-view-detail"
                        onClick={() => handleViewDetails(trip.id)}
                      >
                        {trip.statusNote}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API Info */}
          <div className="api-section">
            <h3 className="api-title">API sử dụng:</h3>
            <div className="api-content">
              <p>- Gọi: PATCH /api/admin/trips/{'{id}'}/status?status=...</p>
              <p>- UI cập nhật realtime (đổi liều nhận qua WebSocket /topic/trips/{'{lineName}'})</p>
            </div>
          </div>

          {/* Status Update Popup */}
          {showStatusPopup && selectedTrip && (
            <div className="popup-overlay" onClick={() => setShowStatusPopup(false)}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                  <h3>[Khi bấm đổi trạng thái trên 1 dòng]</h3>
                  <button 
                    className="popup-close"
                    onClick={() => setShowStatusPopup(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="popup-body">
                  <h4>- Hiện Popup:</h4>
                  <div className="popup-info">
                    <p>Chọn trạng thái mới cho Trip #{selectedTrip.id}</p>
                  </div>

                  <div className="status-options">
                    <h4>[Dropdown trạng thái]:</h4>
                    <button 
                      className="status-option scheduled"
                      onClick={() => handleUpdateStatus(selectedTrip.id, 'SCHEDULED')}
                    >
                      - SCHEDULED
                    </button>
                    <button 
                      className="status-option running"
                      onClick={() => handleUpdateStatus(selectedTrip.id, 'RUNNING')}
                    >
                      - RUNNING
                    </button>
                    <button 
                      className="status-option delayed"
                      onClick={() => handleUpdateStatus(selectedTrip.id, 'DELAYED')}
                    >
                      - DELAYED
                    </button>
                    <button 
                      className="status-option cancelled"
                      onClick={() => handleUpdateStatus(selectedTrip.id, 'CANCELLED')}
                    >
                      - CANCELLED
                    </button>
                    <button 
                      className="status-option issue"
                      onClick={() => handleUpdateStatus(selectedTrip.id, 'ISSUE')}
                    >
                      - ISSUE
                    </button>
                  </div>

                  <div className="popup-note">
                    <p>[Mét: Lưu] [Mét: Hủy]</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default TripMonitoring