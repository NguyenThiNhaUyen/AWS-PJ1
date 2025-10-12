import React from 'react'
import MetroHeader from './MetroHeader'
import Footer from './Footer'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <MetroHeader />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
