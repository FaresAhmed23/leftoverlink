import { useState } from 'react'

function Header({ onNavigate, currentView }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>🍽️ LeftoverLink</h1>
          <p className="tagline">Connecting food to those in need</p>
        </div>
        
        <nav className="nav">
          <button 
            className={`nav-btn ${currentView === 'listings' ? 'active' : ''}`}
            onClick={() => onNavigate('listings')}
          >
            📍 Find Food
          </button>
          <button 
            className={`nav-btn ${currentView === 'add' ? 'active' : ''}`}
            onClick={() => onNavigate('add')}
          >
            ➕ Share Food
          </button>
          <button 
            className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            👤 Profile
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header