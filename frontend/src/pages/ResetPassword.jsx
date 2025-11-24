import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import './ResetPassword.css'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [step, setStep] = useState('request') // request, verify, reset, success
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (token) {
      setStep('reset')
    }
  }, [token])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (response.ok) {
        setStep('verify')
        setMessage('Mã xác nhận đã được gửi đến email của bạn')
        setCountdown(60)
      } else {
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    
    if (formData.code.length !== 6) {
      setError('Mã xác nhận phải có 6 số')
      return
    }

    setError('')
    setLoading(true)

    try {
      // In real app, verify the code with backend
      // For now, simulate success
      setTimeout(() => {
        setStep('reset')
        setMessage('Mã xác nhận hợp lệ. Vui lòng đặt mật khẩu mới.')
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError('Mã xác nhận không hợp lệ hoặc đã hết hạn')
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || formData.code,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStep('success')
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      if (response.ok) {
        setMessage('Mã xác nhận mới đã được gửi')
        setCountdown(60)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setError('Không thể gửi lại mã. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="reset-password-container">
        <div className="reset-card">
          {/* Step Indicator */}
          {step !== 'success' && (
            <div className="step-indicator">
              <div className={`step ${step === 'request' ? 'active' : step === 'verify' || step === 'reset' ? 'completed' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-label">Email</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step === 'verify' ? 'active' : step === 'reset' ? 'completed' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-label">Xác nhận</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step === 'reset' ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-label">Đặt lại</div>
              </div>
            </div>
          )}

          {/* Request Reset */}
          {step === 'request' && (
            <>
              <h2>Quên mật khẩu?</h2>
              <p className="subtitle">Nhập email đã đăng ký để nhận mã xác nhận</p>

              <form onSubmit={handleRequestReset}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                </button>
              </form>

              <div className="form-footer">
                <a href="/login">Quay lại đăng nhập</a>
              </div>
            </>
          )}

          {/* Verify Code */}
          {step === 'verify' && (
            <>
              <h2>Xác nhận mã</h2>
              <p className="subtitle">Nhập mã 6 số đã được gửi đến {formData.email}</p>

              {message && <div className="success-message">{message}</div>}

              <form onSubmit={handleVerifyCode}>
                <div className="form-group">
                  <label>Mã xác nhận</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="123456"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                </button>
              </form>

              <div className="form-footer">
                <button 
                  className="btn-link" 
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                </button>
              </div>
            </>
          )}

          {/* Reset Password */}
          {step === 'reset' && (
            <>
              <h2>Đặt mật khẩu mới</h2>
              <p className="subtitle">Tạo mật khẩu mới cho tài khoản của bạn</p>

              {message && <div className="success-message">{message}</div>}

              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Tối thiểu 8 ký tự"
                    required
                  />
                  <small>Mật khẩu phải có ít nhất 8 ký tự</small>
                </div>

                <div className="form-group">
                  <label>Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                </button>
              </form>
            </>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h2>Đặt lại mật khẩu thành công!</h2>
              <p>Bạn có thể đăng nhập bằng mật khẩu mới</p>
              <p className="redirect-text">Đang chuyển đến trang đăng nhập...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ResetPassword
