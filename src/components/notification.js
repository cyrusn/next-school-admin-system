import { useState, useRef, useEffect } from 'react'

export const defaultNotification = {
  className: 'is-warning',
  message: ''
}

export const notificationWrapper = (setNotification) => {
  const setMessage = (message = '', className = 'is-warning', duration, cb) => {
    setNotification({ className, message })
    if (duration) {
      setTimeout(() => {
        setNotification({ ...defaultNotification })
        if (cb) cb()
      }, 5000)
    }
  }

  return {
    setMessage,
    setErrorMessage(message, duration = 5000) {
      setMessage(message, 'is-danger', duration)
    },
    setLoadingMessage() {
      setMessage('Loading ...', 'is-warning')
    },
    setSuccessMessage(message, cb, duration = 5000) {
      setMessage(message, 'is-success', duration, cb)
    },
    clearMessage() {
      setMessage()
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
