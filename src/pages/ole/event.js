import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { isEmpty } from '@/lib/helper'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import DataTable from '@/components/dataTable'

import OleNav from './components/oleNav'
import { inputMapper } from '@/components/form/inputMapper'
import EditEvent from './components/editEvent'
import ButtonGroup from './components/buttonGroup'
import Participants from './components/participants'
import FilterBy from '@/lib/ole/filterBy'
import { columns } from '@/lib/ole/columns'
const OleEvent = () => {
  const { data: session, status } = useSession()
  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  const { role: ROLE, initial: INITIAL } = session.user.info
  const defaultFilter = { type: 'pics', value: INITIAL }

  const [filter, setFilter] = useState(defaultFilter)
  const [events, setEvents] = useState([])
  const [isEditEvent, setIsEditEvent] = useState(false)
  const [isShowParticipants, setIsShowParticipants] = useState(false)
  const tableRef = useRef(null)
  const [selectedEvent, setSelectEvent] = useState({})

  const handleChange = (e) => {
    let { name, value } = e.target
    setFilter((prevFilter) => {
      const newFilter = { ...prevFilter, [name]: value }
      tableRef.current?.dt().rows().deselect()
      if (name !== 'type') return newFilter

      if (value == 'pics') {
        newFilter.value = INITIAL
        return newFilter
      }

      newFilter.value = ''
      return newFilter
    })
  }

  const fetchEvents = async () => {
    setLoadingMessage()
    try {
      const { type, value } = filter
      setEvents([])
      const response = await fetch(`/api/ole/events?filter=${type}:${value}`)
      const json = await response.json()
      setEvents([...json])
      clearMessage()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  useEffect(() => {
    if (!filter.value) return
    fetchEvents()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.value])

  useEffect(() => {
    if (isEmpty(selectedEvent)) {
      tableRef.current?.dt().column(3).search('').draw()
      setIsEditEvent(false)
      setIsShowParticipants(false)
      return
    }

    tableRef.current
      ?.dt()
      .column(3)
      .search(function (d) {
        return d == selectedEvent.eventId
      })
      .draw()

    setIsShowParticipants(false)
  }, [selectedEvent])

  useEffect(() => {
    const events = ['select', 'deselect']
    events.forEach((event) => {
      tableRef.current?.dt().on(event, (e, dt, type, indexes) => {
        const event = dt
          .rows({
            selected: true
          })
          .data()
          .toArray()[0]

        setSelectEvent(event)
      })
    })
  })

  const options = {
    layout: {
      topStart: 'pageLength',
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging'
    },
    select: {
      style: 'single',
      items: 'row'
      //selectable: function (rowData) {
      //  return rowData.pics.includes(INITIAL)
      //}
    },
    order: [2, 'desc']
  }

  return (
    <>
      <OleNav />
      <Notification {...notification} />
      <FilterBy
        handleChange={handleChange}
        filter={filter}
        userInitial={INITIAL}
      />
      {events.length ? (
        <DataTable
          ref={tableRef}
          data={events}
          columns={columns}
          options={options}
        />
      ) : null}
      <ButtonGroup
        isShow={!isEmpty(selectedEvent)}
        isPic={selectedEvent?.pics?.includes(INITIAL)}
        isEditEvent={isEditEvent}
        isShowParticipants={isShowParticipants}
        handleEdit={() => {
          setIsShowParticipants(false)
          setIsEditEvent(!isEditEvent)
        }}
        handleParticipants={() => {
          setIsEditEvent(false)
          setIsShowParticipants(!isShowParticipants)
        }}
        handlePhotos={() => {}}
      />
      {isEditEvent ? (
        <EditEvent
          isEditEvent={isEditEvent}
          setIsEditEvent={setIsEditEvent}
          selectedEvent={selectedEvent}
          notifier={notificationWrapper(setNotification)}
          fetchEvents={fetchEvents}
        />
      ) : null}
      {isShowParticipants ? (
        <Participants
          selectedEvent={selectedEvent}
          notifier={notificationWrapper(setNotification)}
        />
      ) : null}
    </>
  )
}
export default OleEvent
