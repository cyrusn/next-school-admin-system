import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import Message from './message'

const Box = ({ date, events, onDelete }) => {
  const [userInfo, setUserInfo] = useState({})
  const { data: session, status } = useSession()

  function handlePrint(id) {
    const html = document
      .getElementById(id)
      .innerHTML.replace(/\<button.*\<\/button\>/gm, '')
      .replace(/is-info/gm, '')

    const printWindow = window.open('', 'PRINT')
    printWindow.document.write(`
          <!DOCTYPE html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
              <title>${id}</title>
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
            </head>
            <body>
              <div class='container is-max-desktop'>
                <div class='section'>
                  ${html}
                </div>
              </div>
            </body>
          </html>
        `)
  }

  return (
    <div className='box' id={`announcement_${date}`}>
      <nav className='level'>
        <div className='level-left'>
          <div className='level-item'>
            <p className='subtitle'>
              <span>{date}</span>
            </p>
          </div>
          <div className='level-item'>
            <p>
              <span className='tag'>共{events.length}項宣布</span>
            </p>
          </div>
        </div>

        <div className='level-right'>
          <div className='level-item'>
            <button
              className='button is-info'
              onClick={() => handlePrint(`announcement_${date}`)}
            >
              Print
            </button>
          </div>
        </div>
      </nav>
      {events.map((event, key) => {
        return (
          <Message
            event={event}
            key={key}
            index={key + 1}
            onDelete={onDelete}
          />
        )
      })}
    </div>
  )
}

export default Box
