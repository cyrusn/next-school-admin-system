import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Notification from '@/components/notification'
import Link from 'next/link'

import { DateTime } from 'luxon'
import _ from 'lodash'

import Box from './components/record/box'
import AnnoucnementNav from './components/nav'
import { fetchData } from 'next-auth/client/_utils'

export default function Record() {
  const { data: session, status } = useSession()
  const [announcements, setAnnouncements] = useState([])

  const dt = DateTime.now().setZone('Asia/Hong_Kong')
  const now = dt.toFormat('yyyy-MM-dd')
  const [startDate, setStartDate] = useState(now)

  const defaultNotification = {
    className: 'is-warning',
    message: ''
  }

  const [notification, setNotification] = useState({ ...defaultNotification })

  const onChangeDate = (e) => {
    const date = e.target.value
    setStartDate(date)
  }

  const onDelete = async (date, range) => {
    setNotification({
      className: 'is-warning',
      message: 'Loading ...'
    })

    try {
      const response = await fetch(`/api/announcement?range=${range}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(
          `Error: ${response.status} ${response.statusText} ${response.error}`
        )
      }

      const json = await response.json()

      _.remove(announcements[date], (event) => {
        return event.range == range
      })

      setNotification({ ...defaultNotification })
      setAnnouncements(announcements)
    } catch (error) {
      console.error('Error fetching data:', error)

      setNotification({
        className: 'is-danger',
        message: error.message
      })
    }
  }
  async function fetchData() {
    const url = `/api/announcement?start_date=${startDate}`
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Unauthorized access or error fetching data')
      }

      const data = await response.json()
      const groupedResult = _.groupBy(data, 'date')
      setNotification({ className: 'is-warning', message: '' })
      setAnnouncements(groupedResult)
    } catch (error) {
      console.error('Error fetching data:', error)
      setNotification({
        className: 'is-danger',
        message: error.message
      })
    }
  }

  const onClick = async () => {
    await fetchData()
  }

  useEffect(() => {
    if (session) {
      setNotification({
        className: 'is-warning',
        message: 'Loading ...'
      })

      fetchData()
    }
  }, [])

  return (
    <>
      {status === 'loading' && <p>Loading...</p>}
      <AnnoucnementNav />
      <Notification {...notification} />

      <div className='field has-addons'>
        <div className='control is-expanded'>
          <input
            name='startFrom'
            type='date'
            className='input'
            value={startDate}
            onChange={onChangeDate}
          />
        </div>
        <div class='control'>
          <button class='button is-success' onClick={onClick}>
            Search
          </button>
        </div>
      </div>

      {Object.keys(announcements)
        .sort()
        .map((date, index) => {
          return (
            <Box
              key={index}
              date={date}
              events={announcements[date]}
              onDelete={onDelete}
            />
          )
        })}
    </>
  )
}
