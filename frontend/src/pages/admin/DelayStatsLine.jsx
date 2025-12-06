import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
// import { getDelayStatsByLine } from '../services/adminService'
import './DelayStatsLine.css'

const DelayStatsLine = () => {
  const navigate = useNavigate()
  const [selectedLine, setSelectedLine] = useState('Line 1')
  const [dateRange, setDateRange] = useState({
    from: '2025-11-01',
    to: '2025-11-30'
  })
  const [lineStats, setLineStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const lines = ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']

  useEffect(() => {
    fetchLineStats()
  }, [selectedLine])

  const fetchLineStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDelayStatsByLine(selectedLine)
      setLineStats(data)
    } catch (err) {
      setError(err.message || 'Không thể tải thống kê')
      console.error('Error fetching line stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="delay-stats-line">
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
      <div className="delay-stats-line">
        <div className="stats-line-container">
          <div className="stats-line-header">
            <h1 className="stats-line-title">[Sidebar chọn: Delay Statistics - Line]</h1>
          </div>

          <div className="line-selector-section">
            <h2 className="section-title">[Thanh lọc]</h2>
            
            <div className="selector-row">
              <div className="selector-item">
                <span className="selector-label">| Tuyến:</span>
                <select 
                  className="selector-dropdown"
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                >
                  {lines.map(line => (
                    <option key={line} value={line}>
                      [Dropdown: {line} ▼]
                    </option>
                  ))}
                </select>
              </div>

              <div className="selector-item">
                <span className="selector-label">| Từ ngày:</span>
                <input 
                  type="text" 
                  className="selector-input"
                  value="[DatePicker: 2025-11-01]"
                  readOnly
                />
              </div>

              <div className="selector-item">
                <span className="selector-label">| Đến ngày:</span>
                <input 
                  type="text" 
                  className="selector-input"
                  value="[DatePicker: 2025-11-30]"
                  readOnly
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
              <p>Tiêu đề: Thống kê trễ tuyến {selectedLine} (01/11/2025 - 30/11/2025)</p>
            </div>

            <div className="stats-summary">
              <div className="summary-item">
                <span className="summary-label">- Tổng số lượt dừng (totalStops):</span>
                <span className="summary-value">1.200</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Số lượt bị trễ (delayedStops):</span>
                <span className="summary-value">350</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Tỉ lệ trễ:</span>
                <span className="summary-value">29.2 %</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Độ trễ trung bình:</span>
                <span className="summary-value">3.4 phút</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">- Độ trễ lớn nhất:</span>
                <span className="summary-value">12 phút</span>
              </div>
            </div>
          </div>

          {/* Realtime Note */}
          <div className="realtime-section">
            <h3 className="subsection-title">[Nếu có realtime]:</h3>
            <div className="realtime-content">
              <p>- Các trên hiện thị chụp: "Realtime ON"</p>
              <p>(Khi backend broadcast /topic/delays/line/{'{lineName}'}, số liệu cập nhật)</p>
            </div>
          </div>

          {/* API Info */}
          <div className="api-section">
            <h3 className="subsection-title">API sử dụng:</h3>
            <div className="api-content">
              <p>- Gọi: PATCH /api/admin/trips/{'{id}'}/status?status=...</p>
              <p>- UI cập nhật realtime (đổi liều nhận qua WebSocket /topic/trips/{'{lineName}'})</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DelayStatsLine