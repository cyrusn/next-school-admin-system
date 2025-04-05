import { useState } from 'react'

const Notification = (notification) => {
  const { className, message } = notification
  return message ? (
    <div className={`message ${className}`}>
      <div className='message-body'>{message}</div>
    </div>
  ) : (
    <></>
  )
}

export default Notification
