import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
// import { getDelayStatsByStation } from '../services/adminService'
import './DelayStatsStation.css'

const DelayStatsStation = () => {
  const navigate = useNavigate()
  const [selectedStation, setSelectedStation] = useState('Bến Thành')
  const [stationStats, setStationStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const stations = [
    'Bến Thành',
    'Nhà Hát TP',
    'Ba Son',
    'Van Thanh',
    'Tan Cang',
    'Thu Thiem',
    'Landmark',
    'Suoi Tien'
  ]

  useEffect(() => {
    fetchStationStats()
  }, [selectedStation])

  const fetchStationStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDelayStatsByStation()
      setStationStats(data)
    } catch (err) {
      setError(err.message || 'Không thể tải thống kê')
      console.error('Error fetching station stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="delay-stats-station">
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
      <div className="delay-stats-station">
        <div className="stats-container">
          <div className="stats-header">
            <h1 className="stats-title">[Sidebar chọn: Delay Statistics - Station]</h1>
          </div>

          <div className="station-selector-section">
            <h2 className="section-title">[Thanh lọc]</h2>
            
            <div className="selector-row">
              <div className="selector-item">
                <span className="selector-label">| Ga:</span>
                <select 
                  className="selector-dropdown"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                >
                  {stations.map(station => (
                    <option key={station} value={station}>
                      [Dropdown: {station} ▼]
                    </option>
                  ))}
                </select>
              </div>

              <div className="selector-item">
                <span className="selector-label">| Từ ngày:</span>
                <input 
                  type="text" 
                  className="selector-input"
                  placeholder="[DatePicker]"
                />
              </div>

              <div className="selector-item">
                <span className="selector-label">| Đến ngày:</span>
                <input 
                  type="text" 
                  className="selector-input"
                  placeholder="[DatePicker]"
                />
              </div>

              <div className="selector-item">
                <span className="selector-label">| [Nút: Xem thống kê]</span>
              </div>
            </div>
          </div>

          {/* Kết quả */}
          <div className="results-section">
            <h2 className="section-title">[Kết kết quả]</h2>
            
            <div className="result-header">
              <p>Tiêu đề: Thống kê trễ tại ga {selectedStation}</p>
            </div>

            <div className="stats-summary">
              <div className="summary-item">
                <span className="summary-label">- Tổng số lượt tàu đến (totalStops):</span>
                <span className="summary-value">300</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Số lượt đến trễ (delayedStops):</span>
                <span className="summary-value">80</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Tỉ lệ trễ:</span>
                <span className="summary-value">26.7 %</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Độ trễ trung bình:</span>
                <span className="summary-value">2.5 phút</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Độ trễ lớn nhất:</span>
                <span className="summary-value">9 phút</span>
              </div>
            </div>
          </div>

          {/* Bảng chi tiết */}
          <div className="detail-table-section">
            <h3 className="subsection-title">[Có thể thêm bảng chi tiết]</h3>
            
            <div className="detail-table">
              <div className="table-header">
                <div className="col-date">Ngày</div>
                <div className="col-stops">Số lượt</div>
                <div className="col-delayed">Lượt trễ</div>
                <div className="col-avg">Avg Delay (phút)</div>
                <div className="col-max">Max Delay (phút)</div>
              </div>

              <div className="table-body">
                {[
                  { date: '01/11/2025', stops: 10, delayed: 3, avgDelay: 2.0, maxDelay: 4 },
                  { date: '02/11/2025', stops: 10, delayed: 4, avgDelay: 3.0, maxDelay: 7 },
                  { date: '...', stops: '', delayed: '', avgDelay: '', maxDelay: '' }
                ].map((row, index) => (
                  <div key={index} className="table-row">
                    <div className="col-date">{row.date}</div>
                    <div className="col-stops">{row.stops}</div>
                    <div className="col-delayed">{row.delayed}</div>
                    <div className="col-avg">{row.avgDelay}</div>
                    <div className="col-max">{row.maxDelay}</div>
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

export default DelayStatsStation