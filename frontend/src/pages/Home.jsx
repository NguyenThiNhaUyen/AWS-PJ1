import React from 'react'
import Layout from '../components/Layout'
import './Home.css'

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Metro TP.HCM
              <span className="hero-highlight">Future Transport</span>
            </h1>
            <p className="hero-tagline">
              Smart, Fast, Sustainable Urban Mobility System for Ho Chi Minh City
            </p>
            <div className="hero-buttons">
              <a href="/register" className="btn-primary">
                Get Started
              </a>
              <a href="/routes" className="btn-secondary">
                Explore Routes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Metro Services</h2>
            <p>Experience the future of public transportation</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M9 14a3 3 0 013-3h24a3 3 0 013 3v20a3 3 0 01-3 3H12a3 3 0 01-3-3V14z"/>
                  <path d="M15 19h18v2H15v-2zm0 6h18v2H15v-2z" fill="white"/>
                </svg>
              </div>
              <h3>Smart Ticketing</h3>
              <p>Digital payment and contactless travel with mobile integration</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M6 12h36l-6 20H12L6 12zm8 24a4 4 0 108 0 4 4 0 00-8 0zm16 0a4 4 0 108 0 4 4 0 00-8 0z"/>
                </svg>
              </div>
              <h3>Real-time Updates</h3>
              <p>Live train schedules, delays, and platform information</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor">
                  <path d="M24 2L6 10v8c0 11 7.5 21.3 18 24 10.5-2.7 18-13 18-24v-8L24 2z"/>
                </svg>
              </div>
              <h3>Safe & Secure</h3>
              <p>Advanced safety systems and 24/7 security monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-grid">
              <div className="about-text">
                <h2>About <span className="highlight-accent">/ Mission</span></h2>
                <p>
                  The Metro HCMC project aims to modernize public transport, reduce traffic congestion, 
                  and promote sustainable travel across the city. Our commitment is to provide efficient, 
                  safe, and environmentally friendly transportation solutions for millions of residents and visitors.
                </p>
                <div className="stats">
                  <div className="stat">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Stations</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number highlight">20km</span>
                    <span className="stat-label">Total Length</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">160k</span>
                    <span className="stat-label">Daily Passengers</span>
                  </div>
                </div>
              </div>
              <div className="about-visual">
                <div className="metro-image-container">
                  <img 
                    src="https://cdn.tcdulichtphcm.vn/upload/2-2024/images/2024-05-02/1714615446-picture-560434701-1714614962-466-width1378height919.jpg" 
                    alt="Metro TP.HCM Station"
                    className="metro-station-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
