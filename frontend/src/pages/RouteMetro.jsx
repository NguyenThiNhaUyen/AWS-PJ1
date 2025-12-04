import React, { useState } from 'react';
import './RouteMetro.css';

const RouteMetro = () => {
    const [hoveredLine, setHoveredLine] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const metroLines = [
    {
      id: 'm1',
      name: 'Line 1',
      route: 'Ben Thanh - Suoi Tien',
      status: 'completed',
      statusText: 'Completed',
      launchDate: '22/12/2024',
      length: '19.7 km',
      stations: 14,
      description: 'The first Metro line of Ho Chi Minh City, connecting the center with the Eastern area',
      details: 'Length: 19.7km (2.6km underground + 17.1km elevated) • 14 stations (3 underground + 11 elevated) • Free for the first 30 days',
      color: '#e74c3c'
    },
    {
      id: 'm2',
      name: 'Line 2',
      route: 'Ben Thanh - Tham Luong',
      status: 'construction',
      statusText: 'Under construction',
      description: 'Connecting the city center with the Northwest area',
      details: 'Connects with Line 1 at Ben Thanh station',
      color: '#9b59b6'
    },
    {
      id: 'm3a',
      name: 'Line 3A',
      route: 'Ben Thanh - Tan Kien Depot',
      status: 'planning',
      statusText: 'Planning',
      description: 'Extending connection to the Southwest',
      color: '#3498db'
    },
    {
      id: 'm3b',
      name: 'Line 3B',
      route: 'Nga 6 Cong Hoa - Hiep Binh Phuoc',
      status: 'planning',
      statusText: 'Planning',
      description: 'Connecting Tan Binh area with Thu Duc',
      color: '#27ae60'
    },
    {
      id: 'm4',
      name: 'Line 4',
      route: 'Thanh Xuan - Hiep Phuoc Urban Area',
      status: 'planning',
      statusText: 'Planning',
      description: 'Connecting Nha Be District',
      color: '#f39c12'
    },
    {
      id: 'm4b',
      name: 'Line 4B',
      route: 'Gia Dinh Park Station - Lang Cha Ca Station',
      status: 'planning',
      statusText: 'Planning',
      description: 'A branch line connecting Tan Binh area',
      color: '#e67e22'
    },
    {
      id: 'm5',
      name: 'Line 5',
      route: 'Can Giuoc Bus Station - Sai Gon Bridge',
      status: 'planning',
      statusText: 'Planning',
      description: 'Extension toward Long An Province',
      color: '#16a085'
    },
    {
      id: 'm6',
      name: 'Line 6',
      route: 'Ba Queo - Phu Lam',
      status: 'planning',
      statusText: 'Planning',
      description: 'Connecting Binh Tan area',
      color: '#f1c40f'
    }
  ];

  const line1Stations = [
    { id: 1, name: 'Ga Ben Thanh', nameEn: 'Ben Thanh Station', zone: 'Underground' },
    { id: 2, name: 'Ga Nha hat Thanh pho', nameEn: 'City Theater Station', zone: 'Underground' },
    { id: 3, name: 'Ga Ba Son', nameEn: 'Ba Son Station', zone: 'Underground' },
    { id: 4, name: 'Ga Cong vien Van Thanh', nameEn: 'Van Thanh Park Station', zone: 'Elevated' },
    { id: 5, name: 'Ga Tan Cang', nameEn: 'Tan Cang Station', zone: 'Elevated' },
    { id: 6, name: 'Ga Thao Dien', nameEn: 'Thao Dien Station', zone: 'Elevated' },
    { id: 7, name: 'Ga An Phu', nameEn: 'An Phu Station', zone: 'Elevated' },
    { id: 8, name: 'Ga Rach Chiec', nameEn: 'Rach Chiec Station', zone: 'Elevated' },
    { id: 9, name: 'Ga Phuoc Long', nameEn: 'Phuoc Long Station', zone: 'Elevated' },
    { id: 10, name: 'Ga Binh Thai', nameEn: 'Binh Thai Station', zone: 'Elevated' },
    { id: 11, name: 'Ga Thu Duc', nameEn: 'Thu Duc Station', zone: 'Elevated' },
    { id: 12, name: 'Ga Khu Cong nghe cao', nameEn: 'High-Tech Park Station', zone: 'Elevated' },
    { id: 13, name: 'Ga Dai hoc Quoc gia', nameEn: 'National University Station', zone: 'Elevated' },
    { id: 14, name: 'Ga Ben xe Suoi Tien', nameEn: 'Suoi Tien Bus Terminal Station', zone: 'Elevated' }
  ];


  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'construction': return '🚧';
      case 'planning': return '📋';
      default: return '⏳';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'construction': return '#f39c12';
      case 'planning': return '#95a5a6';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="route-container">
      <div className="route-wrapper">
        <div className="route-header">
          <div className="route-title-container">
            <div className="route-logo">M</div>
            <h1 className="route-title">Ho Chi Minh City Metro System</h1>
          </div>
          <p className="route-subtitle">
            8 modern Metro lines connecting the entire city
          </p>
        </div>

        <div className="metro-lines-grid">
          {metroLines.map((line) => (
            <div
              key={line.id}
              className={`metro-line-card ${hoveredLine === line.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredLine(line.id)}
              onMouseLeave={() => setHoveredLine(null)}
              style={{
                borderColor: hoveredLine === line.id ? line.color : 'rgba(77, 134, 190, 0.2)',
                boxShadow: hoveredLine === line.id ? `0 8px 25px ${line.color}40` : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="line-header">
                <div className="line-number" style={{ background: line.color }}>
                  {line.name.split(' ')[1]}
                </div>
                <div className="line-name">{line.name}</div>
                <div className="line-status-icon">{getStatusIcon(line.status)}</div>
              </div>

              <div className="line-route">{line.route}</div>

              <div
                className="line-status-badge"
                style={{
                  color: getStatusColor(line.status),
                  background: `${getStatusColor(line.status)}20`
                }}
              >
                {line.statusText}
                {line.launchDate && ` • ${line.launchDate}`}
              </div>

              <p className="line-description">{line.description}</p>

              {hoveredLine === line.id && line.details && (
                <div className="line-details">{line.details}</div>
              )}

              {line.length && (
                <div className="line-info">
                  <span>📏 {line.length}</span>
                  {line.stations && <span>🚉 {line.stations} stations</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="map-section">
          <h2 className="section-title">
            <span className="section-icon">🗺️</span>
            Metro Line 1 Map
          </h2>

          <div className="map-container">
            <img
              src="https://phongvu.vn/cong-nghe/wp-content/uploads/2024/12/so-do-cac-tuyen-metro-tphcm-3.jpg"
              alt="Map of 8 Metro lines in Ho Chi Minh City"
              className="map-image"
            />
          </div>
        </div>

        <div className="line1-banner">
          <h2 className="banner-title">
            <span>🎉</span>
            Line 1: Ben Thanh - Suoi Tien
          </h2>
          <p className="banner-description">
            Ho Chi Minh City's first Metro line officially opens on <strong>22/12/2024</strong>.
            Free tickets for the first 30 days and 17 connecting bus routes!
          </p>

          <div className="banner-stats">
            <div className="stat-box">
              <div className="stat-label">Total length</div>
              <div className="stat-value">19.7 km</div>
              <div className="stat-subtext">2.6km underground + 17.1km elevated</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Number of stations</div>
              <div className="stat-value">14 stations</div>
              <div className="stat-subtext">3 underground + 11 elevated</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Operating hours</div>
              <div className="stat-value">5:00 - 22:00</div>
              <div className="stat-subtext">Frequency: 4.5-10 minutes per trip</div>
            </div>

            <div className="stat-box">
              <div className="stat-label">Ticket price</div>
              <div className="stat-value">6k - 20k</div>
              <div className="stat-subtext">Free for the first 30 days</div>
            </div>
          </div>
        </div>

        {/* Station List */}
        <div className="stations-section">
          <h2 className="section-title">
            <span className="section-icon">🚉</span>
            14 Stations of Metro Line 1
          </h2>

          <div className="stations-grid">
            {line1Stations.map((station) => (
              <div
                key={station.id}
                className={`station-card ${selectedStation === station.id ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedStation(station.id)}
                onMouseLeave={() => setSelectedStation(null)}
              >
                <div className="station-number">{station.id}</div>
                <div className="station-info">
                  <div className="station-name">{station.name}</div>
                  <div className="station-name-en">{station.nameEn}</div>
                </div>
                <div className="station-zone">{station.zone}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RouteMetro