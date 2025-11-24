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
      '07': 'Giao dịch bị nghi ngờ gian lận',
      '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking',
      '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Đã hết hạn chờ thanh toán',
      '12': 'Thẻ/Tài khoản bị khóa',
      '13': 'Mật khẩu xác thực OTP không chính xác',
      '24': 'Giao dịch bị hủy',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Vượt quá giới hạn giao dịch',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Giao dịch vượt quá số lần nhập sai mật khẩu',
      '99': 'Giao dịch thất bại'
    }
    return errorMessages[code] || 'Giao dịch không thành công'
  }

  const getSupportAction = (code) => {
    if (['09', '12', '51', '65'].includes(code)) {
      return 'Vui lòng liên hệ ngân hàng của bạn để được hỗ trợ.'
    }
    if (['11', '24'].includes(code)) {
      return 'Bạn có thể thử lại giao dịch.'
    }
    if (['10', '13', '79'].includes(code)) {
      return 'Vui lòng kiểm tra lại thông tin và thử lại sau ít phút.'
    }
    return 'Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ bộ phận hỗ trợ.'
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
          <h1 className="failed-title">Thanh toán không thành công</h1>
          <p className="error-code">Mã lỗi: {responseCode || 'N/A'}</p>
          <p className="error-message">
            {message || getErrorMessage(responseCode)}
          </p>
          <p className="support-message">
            {getSupportAction(responseCode)}
          </p>

          {/* Possible Reasons */}
          <div className="error-details">
            <h3>Có thể do các nguyên nhân sau:</h3>
            <ul>
              <li>
                <span className="icon">💳</span>
                <span>Thông tin thẻ không chính xác</span>
              </li>
              <li>
                <span className="icon">💰</span>
                <span>Số dư tài khoản không đủ</span>
              </li>
              <li>
                <span className="icon">🔒</span>
                <span>Thẻ chưa kích hoạt thanh toán online</span>
              </li>
              <li>
                <span className="icon">⏰</span>
                <span>Phiên giao dịch đã hết hạn</span>
              </li>
              <li>
                <span className="icon">🌐</span>
                <span>Lỗi kết nối mạng</span>
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
              Thử lại
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
              Liên hệ hỗ trợ
            </button>
            <button 
              className="btn-home"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </button>
          </div>

          {/* Support Info */}
          <div className="support-info">
            <h3>Cần trợ giúp?</h3>
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
                  <p className="contact-value">8:00 - 22:00 hàng ngày</p>
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
