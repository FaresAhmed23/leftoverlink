import { useState, useEffect } from 'react'

function NotificationBanner({ type, message, onClose, autoClose = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, autoClose)

      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return 'ℹ️'
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  return (
    <div className={`notification-banner ${type}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default NotificationBanner