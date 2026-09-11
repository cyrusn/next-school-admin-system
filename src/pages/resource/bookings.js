import { useState, useEffect } from 'react'
import { groupBy } from 'lodash'
import Notification from '@/components/notification'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPeopleCarry } from '@fortawesome/free-solid-svg-icons'
import { TODAY } from '@/config/constant'
import ResourceNav from './components/resourceNav'

export function parseStartEndDate(start, end) {
  const startDateData = start.slice(0, 16).split('T')
  const endDateData = end.slice(0, 16).split('T')

  if (startDateData[1] === endDateData[1] && startDateData[1] === '00:00') {
    return 'All Day'
  }

  return `${startDateData[1]}-${endDateData[1]}`
}

export function parseTitleWithResources(title, resourcesList = []) {
  const dashIndex = title.indexOf(' - ')
  if (dashIndex === -1) {
    return { teacherInitial: '', resourceName: '', eventTitle: title }
  }

  const prefix = title.substring(0, dashIndex)
  const eventTitle = title.substring(dashIndex + 3)

  const atIndex = prefix.indexOf('@')
  if (atIndex === -1) {
    return { teacherInitial: '', resourceName: '', eventTitle }
  }

  const teacherInitial = prefix.substring(0, atIndex)
  const potentialResourceName = prefix.substring(atIndex + 1)

  const matchedResource = resourcesList.find(
    (res) => res.resourceName === potentialResourceName
  )

  if (matchedResource) {
    return {
      teacherInitial,
      resourceName: matchedResource.resourceName,
      eventTitle
    }
  }

  return {
    teacherInitial: '',
    resourceName: '',
    eventTitle: title
  }
}

export default function AllBookings({ onBack }) {
  const [events, setEvents] = useState([])
  const [resourcesList, setResourcesList] = useState([])
  const [start, setStart] = useState(TODAY)
  const [fetchedDate, setFetchedDate] = useState(null)
  const [includeDevices, setIncludeDevices] = useState(true)
  const [hasFetched, setHasFetched] = useState(false)
  const [notification, setNotification] = useState({
    className: 'is-info',
    message: 'Please select a date and press Submit'
  })

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch('/api/resources/list')
        if (response.ok) {
          const data = await response.json()
          setResourcesList(data.items || [])
        }
      } catch (err) {
        console.error('Error fetching resources list:', err)
      }
    }
    fetchResources()
  }, [])

  async function fetchEvents() {
    console.log('fetching events')
    setEvents([])
    setFetchedDate(start)
    setHasFetched(true)
    setNotification({
      className: 'is-warning',
      message: 'Loading...'
    })

    const response = await fetch(
      `/api/janitor_calendar/all?startDate=${start}&endDate=${start}&includeDevices=${includeDevices}`
    )
    if (!response.ok) {
      console.error(response)
      setNotification({
        className: 'is-danger',
        message: 'Failed to load: ' + response.statusText
      })
      return
    }
    const data = await response.json()
    setEvents(data)

    setNotification({
      className: '',
      message: ''
    })
  }

  function StartForm() {
    return (
      <div className='field is-grouped is-grouped-centered my-4 is-align-items-center'>
        <div className='control'>
          <input
            type='date'
            className='input'
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className='control'>
          <label className='checkbox'>
            <input
              type='checkbox'
              checked={includeDevices}
              onChange={(e) => setIncludeDevices(e.target.checked)}
              className='mr-2'
            />
            Include iPad/Notebook
          </label>
        </div>
        <div className='control'>
          <button className='button is-info' onClick={fetchEvents}>
            Submit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ResourceNav />
      <div className='container is-max-widescreen'>
        <div className='is-flex is-justify-content-space-between is-align-items-center mb-4'>
          <h1 className='title is-3 mb-0 has-text-centered is-flex-grow-1'>
            All Bookings
          </h1>
          <div className='is-hidden-mobile px-5'></div>
        </div>
        <StartForm />
        <Notification
          className={notification.className}
          message={notification.message}
        />
        {hasFetched &&
          (events && events.length > 0 ? (
            <div className='box'>
              <p className='title is-3'>{fetchedDate}</p>
              <GroupByLocation events={events} resourcesList={resourcesList} />
            </div>
          ) : (
            <p className='has-text-centered has-text-grey my-5'>
              No bookings for this date.
            </p>
          ))}
      </div>
    </div>
  )
}

export function parseLocation(location) {
  if (!location) return {}
  let floor, roomNo, roomName, type

  if (
    location.includes('Display Board') ||
    location.includes('iPad') ||
    location.includes('Notebook') ||
    location.includes('Computer')
  ) {
    let cleanName = location
      .replace(/^Main Building-/, '')
      .replace(/^\(.*?\)-/, '')
      .replace(/\s\(\d+\)$/, '')
      .trim()

    if (location.includes('Display Board')) {
      const match = /HB\d+/i.exec(location)
      if (match) {
        cleanName = `Display Board ${match[0].toUpperCase()}`
      }
    } else if (location.includes('iPad')) {
      if (location.includes('Delivery')) {
        cleanName = 'iPad （Delivery）'
      } else if (location.includes('Self')) {
        cleanName = 'iPad （Self-Service）'
      }
    }

    return {
      type: location.includes('iPad') ? 'iPad' : (location.includes('Display Board') ? 'Display Board' : 'Notebook'),
      floor: 'Devices and Board',
      roomNo: '',
      roomName: cleanName
    }
  }

  const locationRegexResult = /^Main Building-(.*)\s\(\d.*\)$/.exec(location)
  if (locationRegexResult) {
    const locationObject = locationRegexResult[1].split('-')
    floor = locationObject[0]
    roomNo = locationObject[1]
    roomName = locationObject.slice(2).join('-') || ''
  } else {
    const resourceRegexResult = /^\((.*)\)-Main Building-(.*)\s\(\d.*\)$/.exec(
      location
    )
    if (resourceRegexResult) {
      type = resourceRegexResult[1]
      const locationObject = resourceRegexResult[2].split('-')
      floor = locationObject[0]
      roomNo = locationObject[1]
      roomName = locationObject.slice(2).join('-') || ''
    }
  }

  return {
    type,
    floor,
    roomNo,
    roomName
  }
}

function GroupByLocation({ events, resourcesList }) {
  const modifiedEvents = events.map((event) => {
    const parsed = parseLocation(event.calendarName)
    const titleParsed = parseTitleWithResources(event.title, resourcesList)
    return {
      ...event,
      ...parsed,
      teacherInitial: titleParsed.teacherInitial,
      parsedResourceName: titleParsed.resourceName,
      cleanEventTitle: titleParsed.eventTitle
    }
  })
  const eventsByFloor = groupBy(modifiedEvents, 'floor')
  const order = [
    'LG',
    'G/F',
    '1/F',
    '2/F',
    '3/F',
    '4/F',
    '5/F',
    'Devices and Board'
  ]

  return (
    <>
      {Object.keys(eventsByFloor)
        .sort((a, b) => order.indexOf(a) - order.indexOf(b))
        .map((floor, n) => {
          const events = eventsByFloor[floor]
          return (
            <div key={`event-floor-${n}`} className='mb-4'>
              <h1 className='title is-4'>{floor || 'Other'}</h1>
              <div>
                <EventsByRoomOrType events={events} />
              </div>
            </div>
          )
        })}
    </>
  )
}

function EventsByRoomOrType({ events }) {
  const eventsByRoomOrType = groupBy(events, function (event) {
    if (event.parsedResourceName) {
      return event.parsedResourceName
    }
    if (event.floor === 'Devices and Board') {
      return event.roomName
    }
    return event.roomNo
  })

  return (
    <div className='columns is-multiline'>
      {Object.keys(eventsByRoomOrType)
        .sort()
        .map((key, n) => {
          const groupedEvents = eventsByRoomOrType[key]
          const firstEvent = groupedEvents[0]

          let heading = key
          if (firstEvent.floor !== 'Devices and Board' && !firstEvent.parsedResourceName) {
            heading = `${firstEvent.roomNo || 'Unspecified'} ${firstEvent.roomName}`
          }

          return (
            <div className='column is-half' key={`event-roomNo-${n}`}>
              <nav className='panel is-link'>
                <p className='panel-heading py-2'>{heading}</p>
                {groupedEvents
                  .sort((a, b) => {
                    if (!a.roomNo) return a.title.localeCompare(b.title)
                    return a.roomNo.localeCompare(b.roomNo)
                  })
                  .map((event, idx) => {
                    return (
                      <div
                        className='panel-block is-block'
                        key={`event-item-${idx}`}
                      >
                        <Event event={event} />
                      </div>
                    )
                  })}
              </nav>
            </div>
          )
        })}
    </div>
  )
}

function Event({ event }) {
  const { start, end, description, teacherInitial, cleanEventTitle, isRequireJanitor } =
    event

  const modifiedDescription = (description || '')
    .replace(/^Created.*?\n/gm, '')
    .replace(/^Last Modified.*?\n/gm, '')

  return (
    <div>
      <p>
        <strong>{parseStartEndDate(start, end)}</strong>:
        {teacherInitial && (
          <span className='tag is-warning mx-2'>{teacherInitial}</span>
        )}
        {cleanEventTitle}
        {isRequireJanitor && (
          <span className='ml-2'>
            <FontAwesomeIcon
              icon={faPeopleCarry}
              className='is-inline has-text-danger'
            />
          </span>
        )}
      </p>
      {modifiedDescription ? (
        <p className='is-size-7 is-italic ml-2'>{modifiedDescription}</p>
      ) : null}
    </div>
  )
}
