import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useUsersContext } from '@/context/usersContext.js'

const Message = ({ event, index, onDelete }) => {
  const { users } = useUsersContext()
  const { data: session, status } = useSession()
  const { target, pic, from, content, range, date } = event
  const found = users.find((u) => u.initial == pic)
  const isPic = session?.user.info.initial == pic

  let picDisplayName = found
    ? `${found.cname || found.name}${found.title}`
    : pic

  return (
    <div className={`message ${isPic && 'is-info'}`}>
      <div className='message-header'>
        <p>
          {' '}
          #{index}：請{target == 'all' ? '全校同學' : target}留意，{from}的宣布{' '}
        </p>
        {isPic && (
          <button
            className='delete'
            onClick={() => {
              onDelete(date, range)
            }}
          ></button>
        )}
      </div>
      <div className='message-body'>
        <p>{content}</p>
        <p className='has-text-right'> – 由{picDisplayName}發出</p>
      </div>
    </div>
  )
}

export default Message
