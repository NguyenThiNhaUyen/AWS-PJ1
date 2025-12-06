import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import './PaymentFailed.css'

const PaymentFailed = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const responseCode = searchParams.get('vnp_ResponseCode')
  const message = searchParams.get('message')

  const getErrorMessage = (code) => {
    const errorMessages = {
      '07': 'Transaction suspected of fraud',
      '09': 'Card/Account not registered for InternetBanking',
      '10': 'Card/Account authentication failed 3 times',
      '11': 'Payment timeout expired',
      '12': 'Card/Account is locked',
      '13': 'Incorrect OTP verification code',
      '24': 'Transaction cancelled',
      '51': 'Insufficient account balance',
      '65': 'Transaction limit exceeded',
      '75': 'Payment bank under maintenance',
      '79': 'Too many incorrect password attempts',
      '99': 'Transaction failed'
    }
    return errorMessages[code] || 'Transaction unsuccessful'
  }

  const getSupportAction = (code) => {
    if (['09', '12', '51', '65'].includes(code)) {
      return 'Please contact your bank for support.'
    }
    if (['11', '24'].includes(code)) {
      return 'You can try the transaction again.'
    }
    if (['10', '13', '79'].includes(code)) {
      return 'Please check your information and try again in a few minutes.'
    }
    return 'If the problem persists, please contact support.'
  }

  return (
    <Layout>
      <div className="payment-failed-container">
        <div className="failed-content">
          {/* Failed Icon */}
          <div className="failed-icon-wrapper">
            <div className="failed-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
                <path d="M8 8l8 8M16 8l-8 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="failed-title">Payment Unsuccessful</h1>
          <p className="error-code">Error Code: {responseCode || 'N/A'}</p>
          <p className="error-message">
            {message || getErrorMessage(responseCode)}
          </p>
          <p className="support-message">
            {getSupportAction(responseCode)}
          </p>

          {/* Possible Reasons */}
          <div className="error-details">
            <h3>Possible reasons:</h3>
            <ul>
              <li>
                <span className="icon">💳</span>
                <span>Incorrect card information</span>
              </li>
              <li>
                <span className="icon">💰</span>
                <span>Insufficient account balance</span>
              </li>
              <li>
                <span className="icon">🔒</span>
                <span>Card not activated for online payments</span>
              </li>
              <li>
                <span className="icon">⏰</span>
                <span>Transaction session expired</span>
              </li>
              <li>
                <span className="icon">🌐</span>
                <span>Network connection error</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="failed-actions">
            <button 
              className="btn-retry"
              onClick={() => navigate('/book-ticket')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 4v6h6M23 20v-6h-6" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Retry
            </button>
            <button 
              className="btn-contact"
              onClick={() => navigate('/help')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
              </svg>
              Contact Support
            </button>
            <button 
              className="btn-home"
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </button>
          </div>

          {/* Support Info */}
          <div className="support-info">
            <h3>Need Help?</h3>
            <div className="contact-methods">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <p className="contact-label">Hotline</p>
                  <p className="contact-value">1900 6688</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <p className="contact-label">Email</p>
                  <p className="contact-value">support@metro.vn</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <div>
                  <p className="contact-label">Live Chat</p>
                  <p className="contact-value">8:00 AM - 10:00 PM daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default PaymentFailed
