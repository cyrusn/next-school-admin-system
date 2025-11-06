import { useEffect, useState } from 'react'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'

import { DateTime } from 'luxon'
import _ from 'lodash'

import Box from './components/record/box'
import AnnoucnementNav from './components/nav'
import Loading from '@/components/loading'

export default function Record() {
  const [announcements, setAnnouncements] = useState({})

  const dt = DateTime.now().setZone('Asia/Hong_Kong')
  const now = dt.toFormat('yyyy-MM-dd')
  const [startDate, setStartDate] = useState(now)

  const [notification, setNotification] = useState({ ...defaultNotification })
  const { setErrorMessage, setLoadingMessage, clearMessage } =
    notificationWrapper(setNotification)

  const onChangeDate = (e) => {
    const date = e.target.value
    setStartDate(date)
  }

  const onDelete = async (date, range) => {
    setLoadingMessage()

    try {
      const response = await fetch(`/api/announcements?range=${range}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(
          `Error: ${response.status} ${response.statusText} ${response.error}`
        )
      }

      _.remove(announcements[date], (event) => {
        return event.range == range
      })

      clearMessage()
      setAnnouncements(announcements)
    } catch (error) {
      console.error('Error fetching data:', error)

      setErrorMessage(error.message)
    }
  }
  async function fetchData() {
    const url = `/api/announcements?start_date=${startDate}`
    try {
      setLoadingMessage()

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Unauthorized access or error fetching data')
      }

      const data = await response.json()
      const groupedResult = _.groupBy(data, 'date')
      clearMessage()
      setAnnouncements(groupedResult)
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrorMessage(error.message)
    }
  }

  const onClick = async () => {
    await fetchData()
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
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
        <div className='control'>
          <button className='button is-success' onClick={onClick}>
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
