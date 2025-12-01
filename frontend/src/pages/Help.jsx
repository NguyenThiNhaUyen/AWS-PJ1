import React from 'react'
import Layout from '../components/Layout'
import './Help.css'

const Help = () => {
  const faqs = [
    {
      category: 'Mua vé',
      questions: [
        {
          q: 'Làm thế nào để mua vé Metro?',
          a: 'Bạn có thể mua vé trực tuyến qua website hoặc app, hoặc mua trực tiếp tại các ga Metro. Chọn loại vé phù hợp, thanh toán qua VNPay, và nhận vé điện tử ngay lập tức.'
        },
        {
          q: 'Có những loại vé nào?',
          a: 'Chúng tôi cung cấp: Vé tuyến (theo khoảng cách), Vé 1 ngày (40,000đ), Vé 3 ngày (90,000đ), Vé tháng (300,000đ), và Vé tháng sinh viên (150,000đ).'
        },
        {
          q: 'Thanh toán như thế nào?',
          a: 'Hiện tại chúng tôi chấp nhận thanh toán qua VNPay. Bạn có thể thanh toán bằng thẻ ATM nội địa, thẻ tín dụng, hoặc ví điện tử.'
        }
      ]
    },
    {
      category: 'Sử dụng vé',
      questions: [
        {
          q: 'Làm sao để kích hoạt vé?',
          a: 'Vé sẽ tự động được kích hoạt khi bạn quét QR code lần đầu tiên tại cổng soát vé ở ga Metro. Vé tuyến có thời hạn 2 giờ, các vé khác có thời hạn theo loại vé.'
        },
        {
          q: 'Vé có thể sử dụng nhiều lần không?',
          a: 'Vé tuyến chỉ dùng 1 lần. Vé 1 ngày, 3 ngày, và vé tháng có thể sử dụng không giới hạn số lần trong thời hạn.'
        },
        {
          q: 'Nếu quên mang vé thì sao?',
          a: 'Vé điện tử được lưu trong tài khoản của bạn. Bạn có thể truy cập mục "Vé của tôi" để xem lại mã QR và quét tại ga.'
        }
      ]
    },
    {
      category: 'Hoàn tiền & Hủy vé',
      questions: [
        {
          q: 'Có thể hủy vé và hoàn tiền không?',
          a: 'Vé chưa kích hoạt có thể được hoàn tiền trong vòng 24 giờ kể từ khi mua với phí xử lý 10%. Vé đã kích hoạt không được hoàn tiền.'
        },
        {
          q: 'Vé hết hạn có được hoàn tiền?',
          a: 'Rất tiếc, vé đã hết hạn hoặc đã sử dụng không được hoàn tiền.'
        },
        {
          q: 'Thời gian xử lý hoàn tiền?',
          a: 'Yêu cầu hoàn tiền sẽ được xử lý trong vòng 5-7 ngày làm việc. Tiền sẽ được hoàn về tài khoản thanh toán ban đầu.'
        }
      ]
    },
    {
      category: 'Tài khoản',
      questions: [
        {
          q: 'Quên mật khẩu phải làm sao?',
          a: 'Nhấn "Quên mật khẩu" ở trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận 6 số để bạn đặt lại mật khẩu.'
        },
        {
          q: 'Làm sao để thay đổi thông tin cá nhân?',
          a: 'Đăng nhập và vào mục "Hồ sơ". Bạn có thể cập nhật họ tên, email, và đổi mật khẩu.'
        },
        {
          q: 'Email xác thực không nhận được?',
          a: 'Kiểm tra thư mục spam/junk. Nếu vẫn không thấy, vào trang đăng ký và chọn "Gửi lại email xác thực".'
        }
      ]
    }
  ]

  return (
    <Layout>
      <div className="help-container">
        <div className="help-header">
          <h1>Trung tâm hỗ trợ</h1>
          <p>Chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
        </div>

        <div className="faq-section">
          <h2>Câu hỏi thường gặp</h2>
          
          {faqs.map((category, index) => (
            <div key={index} className="faq-category">
              <h3 className="category-title">{category.category}</h3>
              <div className="faq-list">
                {category.questions.map((faq, fIndex) => (
                  <details key={fIndex} className="faq-item">
                    <summary className="faq-question">
                      <span>{faq.q}</span>
                      <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </summary>
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="feedback-section">
          <h2>Gửi phản hồi</h2>
          <form className="feedback-form">
            <div className="form-row">
              <div className="form-group">
                <label>Họ tên</label>
                <input type="text" placeholder="Nhập họ tên của bạn" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Chủ đề</label>
              <select required>
                <option value="">Chọn chủ đề</option>
                <option>Góp ý dịch vụ</option>
                <option>Báo lỗi kỹ thuật</option>
                <option>Yêu cầu hỗ trợ</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <textarea rows="5" placeholder="Nhập nội dung phản hồi..." required></textarea>
            </div>
            <button type="submit" className="btn-submit">Gửi phản hồi</button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Help
