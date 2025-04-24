import { useState, useRef, useEffect } from 'react'

export const defaultNotification = {
  className: 'is-warning',
  message: ''
}

export const notificationWrapper = (setNotification) => {
  const notifier = (message = '', className = 'is-warning', duration) => {
    setNotification({ className, message })
    if (duration) {
      setTimeout(() => {
        setNotification({ ...defaultNotification })
      }, 5000)
    }
  }

  return {
    notifier,
    setErrorMessage(message, duration = 5000) {
      notifier(message, 'is-danger', duration)
    },
    setLoadingMessage() {
      notifier('Loading ...', 'is-warning')
    },
    setSuccessMessage(message, duration = 5000) {
      notifier(message, 'is-success', duration)
    },
    clearMessage() {
      notifier()
    }
  }
}

const Notification = ({ className, message }) => {
  const ref = useRef(null)
  useEffect(() => {
    if (message == '') return
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [message, className])

  if (!message) return null
  return (
    <div ref={ref} className={`message ${className}`}>
      <div className='message-body'>{message}</div>
    </div>
  )
}

export default Notification
