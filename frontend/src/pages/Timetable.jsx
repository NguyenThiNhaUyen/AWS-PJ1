import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import './Timetable.css'

const Timetable = () => {
  const { user } = useAuth()
  const [selectedLine, setSelectedLine] = useState('Line1')
  const [scheduleType, setScheduleType] = useState('weekday')
  const [direction, setDirection] = useState('ben-thanh-suoi-tien')
  const [timetable, setTimetable] = useState(null)
  const [loading, setLoading] = useState(false)

  const lines = [
    { id: 'Line1', name: 'Line 1', route: 'Ben Thanh - Suoi Tien' }
  ]

  useEffect(() => {
    fetchTimetable()
  }, [selectedLine, scheduleType, direction])

  const fetchTimetable = async () => {
    setLoading(true)
    try {
      // Mock data for now - backend endpoint: /api/routes/{lineName}/timetable?type={weekday|weekend}
      const mockData = {
        lineName: 'Line1',
        scheduleType: scheduleType,
        direction: direction,
        firstTrain: direction === 'ben-thanh-suoi-tien' ? '05:00' : '05:15',
        lastTrain: direction === 'ben-thanh-suoi-tien' ? '22:00' : '22:15',
        frequency: '8-10 phút',
        stations: direction === 'ben-thanh-suoi-tien' ? [
          { name: 'Bến Thành', times: ['05:00', '05:10', '05:20', '05:30', '05:40', '05:50', '06:00', '06:10', '06:20', '06:30'] },
          { name: 'Nhà hát Thành phố', times: ['05:03', '05:13', '05:23', '05:33', '05:43', '05:53', '06:03', '06:13', '06:23', '06:33'] },
          { name: 'Ba Son', times: ['05:06', '05:16', '05:26', '05:36', '05:46', '05:56', '06:06', '06:16', '06:26', '06:36'] },
          { name: 'Văn Thánh', times: ['05:09', '05:19', '05:29', '05:39', '05:49', '05:59', '06:09', '06:19', '06:29', '06:39'] },
          { name: 'Tân Cảng', times: ['05:12', '05:22', '05:32', '05:42', '05:52', '06:02', '06:12', '06:22', '06:32', '06:42'] },
          { name: 'Thảo Điền', times: ['05:15', '05:25', '05:35', '05:45', '05:55', '06:05', '06:15', '06:25', '06:35', '06:45'] },
          { name: 'An Phú', times: ['05:18', '05:28', '05:38', '05:48', '05:58', '06:08', '06:18', '06:28', '06:38', '06:48'] },
          { name: 'Rạch Chiếc', times: ['05:21', '05:31', '05:41', '05:51', '06:01', '06:11', '06:21', '06:31', '06:41', '06:51'] },
          { name: 'Phước Long', times: ['05:24', '05:34', '05:44', '05:54', '06:04', '06:14', '06:24', '06:34', '06:44', '06:54'] },
          { name: 'Bình Thái', times: ['05:27', '05:37', '05:47', '05:57', '06:07', '06:17', '06:27', '06:37', '06:47', '06:57'] },
          { name: 'Thủ Đức', times: ['05:30', '05:40', '05:50', '06:00', '06:10', '06:20', '06:30', '06:40', '06:50', '07:00'] },
          { name: 'Suối Tiên', times: ['05:35', '05:45', '05:55', '06:05', '06:15', '06:25', '06:35', '06:45', '06:55', '07:05'] }
        ] : [
          { name: 'Suối Tiên', times: ['05:15', '05:25', '05:35', '05:45', '05:55', '06:05', '06:15', '06:25', '06:35', '06:45'] },
          { name: 'Thủ Đức', times: ['05:20', '05:30', '05:40', '05:50', '06:00', '06:10', '06:20', '06:30', '06:40', '06:50'] },
          { name: 'Bình Thái', times: ['05:23', '05:33', '05:43', '05:53', '06:03', '06:13', '06:23', '06:33', '06:43', '06:53'] },
          { name: 'Phước Long', times: ['05:26', '05:36', '05:46', '05:56', '06:06', '06:16', '06:26', '06:36', '06:46', '06:56'] },
          { name: 'Rạch Chiếc', times: ['05:29', '05:39', '05:49', '05:59', '06:09', '06:19', '06:29', '06:39', '06:49', '06:59'] },
          { name: 'An Phú', times: ['05:32', '05:42', '05:52', '06:02', '06:12', '06:22', '06:32', '06:42', '06:52', '07:02'] },
          { name: 'Thảo Điền', times: ['05:35', '05:45', '05:55', '06:05', '06:15', '06:25', '06:35', '06:45', '06:55', '07:05'] },
          { name: 'Tân Cảng', times: ['05:38', '05:48', '05:58', '06:08', '06:18', '06:28', '06:38', '06:48', '06:58', '07:08'] },
          { name: 'Văn Thánh', times: ['05:41', '05:51', '06:01', '06:11', '06:21', '06:31', '06:41', '06:51', '07:01', '07:11'] },
          { name: 'Ba Son', times: ['05:44', '05:54', '06:04', '06:14', '06:24', '06:34', '06:44', '06:54', '07:04', '07:14'] },
          { name: 'Nhà hát Thành phố', times: ['05:47', '05:57', '06:07', '06:17', '06:27', '06:37', '06:47', '06:57', '07:07', '07:17'] },
          { name: 'Bến Thành', times: ['05:50', '06:00', '06:10', '06:20', '06:30', '06:40', '06:50', '07:00', '07:10', '07:20'] }
        ]
      }

      setTimetable(mockData)
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="timetable-container">
        <div className="timetable-header">
          <h1>Metro Schedule</h1>
          <p>Check train times for each station</p>
        </div>

        {/* Controls */}
        <div className="timetable-controls">
          <div className="control-group">
            <label>Line</label>
            <select 
              value={selectedLine} 
              onChange={(e) => setSelectedLine(e.target.value)}
            >
              {lines.map(line => (
                <option key={line.id} value={line.id}>
                  {line.name} - {line.route}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Schedule Type</label>
            <div className="toggle-buttons">
              <button 
                className={scheduleType === 'weekday' ? 'active' : ''}
                onClick={() => setScheduleType('weekday')}
              >
                Weekday
              </button>
              <button 
                className={scheduleType === 'weekend' ? 'active' : ''}
                onClick={() => setScheduleType('weekend')}
              >
                Weekend
              </button>
            </div>
          </div>

          <div className="control-group">
            <label>Direction</label>
            <select 
              value={direction} 
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="ben-thanh-suoi-tien">Ben Thanh → Suoi Tien</option>
              <option value="suoi-tien-ben-thanh">Suoi Tien → Ben Thanh</option>
            </select>
          </div>
        </div>

        {/* Timetable Info */}
        {timetable && (
          <div className="timetable-info">
            <div className="info-card">
              <div className="info-icon">🚇</div>
              <div className="info-content">
                <div className="info-label">First Train</div>
                <div className="info-value">{timetable.firstTrain}</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🌙</div>
              <div className="info-content">
                <div className="info-label">Last Train</div>
                <div className="info-value">{timetable.lastTrain}</div>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">⏱️</div>
              <div className="info-content">
                <div className="info-label">Frequency</div>
                <div className="info-value">{timetable.frequency}</div>
              </div>
            </div>
          </div>
        )}

        {/* Timetable Grid */}
        {loading ? (
          <div className="loading">Loading schedule...</div>
        ) : timetable ? (
          <div className="timetable-grid">
            {timetable.stations.map((station, index) => (
              <div key={index} className="station-schedule">
                <div className="station-header">
                  <div className="station-number">{index + 1}</div>
                  <div className="station-name">{station.name}</div>
                </div>
                <div className="time-grid">
                  {station.times.map((time, timeIndex) => (
                    <div key={timeIndex} className="time-slot">
                      {time}
                    </div>
                  ))}
                  <div className="time-slot more">...</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Notes */}
        <div className="timetable-notes">
          <h3>📌 Important Notes</h3>
          <ul>
            <li>Schedule may change during holidays and Tet</li>
            <li>Train times may be adjusted based on actual conditions</li>
            <li>Please arrive at the station at least 5 minutes before departure</li>
            <li>Contact hotline 1900 6688 for detailed information</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Timetable
