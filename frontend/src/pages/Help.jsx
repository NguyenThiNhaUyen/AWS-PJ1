import React from 'react'
import Layout from '../components/Layout'
import './Help.css'

const Help = () => {
  const faqs = [
    {
      category: 'Buying Tickets',
      questions: [
        {
          q: 'How do I purchase Metro tickets?',
          a: 'You can buy tickets online via our website or app, or purchase directly at Metro stations. Choose your ticket type, pay via VNPay, and receive your e-ticket instantly.'
        },
        {
          q: 'What types of tickets are available?',
          a: 'We offer: Single Trip (distance-based), 1-Day Pass (40,000 VND), 3-Day Pass (90,000 VND), Monthly Pass (300,000 VND), and Student Monthly Pass (150,000 VND).'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'Currently we accept payments via VNPay. You can pay with domestic ATM cards, credit cards, or e-wallets.'
        }
      ]
    },
    {
      category: 'Using Tickets',
      questions: [
        {
          q: 'How do I activate my ticket?',
          a: 'Tickets are automatically activated when you scan the QR code for the first time at the ticket gate. Single trip tickets are valid for 2 hours, other tickets are valid according to their type.'
        },
        {
          q: 'Can tickets be used multiple times?',
          a: 'Single trip tickets can only be used once. Day passes, 3-day passes, and monthly passes can be used unlimited times within their validity period.'
        },
        {
          q: 'What if I forget my ticket?',
          a: 'E-tickets are saved in your account. You can access "My Tickets" to view your QR code and scan it at the station.'
        }
      ]
    },
    {
      category: 'Refunds & Cancellations',
      questions: [
        {
          q: 'Can I cancel my ticket and get a refund?',
          a: 'Unactivated tickets can be refunded within 24 hours of purchase with a 10% processing fee. Activated tickets are non-refundable.'
        },
        {
          q: 'Are expired tickets refundable?',
          a: 'Unfortunately, expired or used tickets are not eligible for refunds.'
        },
        {
          q: 'How long does refund processing take?',
          a: 'Refund requests are processed within 5-7 business days. Funds will be returned to your original payment method.'
        }
      ]
    },
    {
      category: 'Account',
      questions: [
        {
          q: 'What if I forgot my password?',
          a: 'Click "Forgot Password" on the login page and enter your registered email. We will send you a 6-digit verification code to reset your password.'
        },
        {
          q: 'How do I change my personal information?',
          a: 'Log in and go to "Profile". You can update your name, email, and change your password.'
        },
        {
          q: 'I did not receive the verification email?',
          a: 'Check your spam/junk folder. If still not found, go to the registration page and select "Resend verification email".'
        }
      ]
    }
  ]

  return (
    <Layout>
      <div className="help-container">
        <div className="help-header">
          <h1>Support Center</h1>
          <p>We're here to help you</p>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
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
      </div>
    </Layout>
  )
}

export default Help
