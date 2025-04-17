import { useState, useRef, useEffect } from 'react'

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
