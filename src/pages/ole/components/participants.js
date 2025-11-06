import { useState, useRef, useEffect } from 'react'
import DataTable from '@/components/dataTable'
import EditParticipants from './editParticipants'
import AddParticipants from './addParticipants'
import { getDisplayName } from '@/lib/helper'

export default function Participants({ selectedEvent, notifier }) {
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [isAddParticipants, setIsAddParticipants] = useState(false)
  const [isEditParticipants, setIsEditParticipants] = useState(false)
  const eventId = selectedEvent?.eventId
  const tableRef = useRef(null)

  const columns = [
    {
      title: 'Name',
      name: 'displayName',
      width: '14%',
      data(data, type) {
        const { classcode, classno, name, cname } = data
        if (type === 'set') {
          return
        }

        if (type === 'display' || type === 'filter') {
          return getDisplayName({ classcode, classno, name, cname })
        }

        if (type === 'sort') {
          return ['classcode', 'classno']
        }

        return 'regno'
      }
    },
    {
      title: 'Period',
      width: '20%',
      data(data, type) {
        const { startDate, endDate } = data
        if (type != 'display') return startDate

        if (startDate == endDate) {
          return startDate
        }
        return `${startDate} to ${endDate}`
      }
    },
    {
      title: 'Role and Achievement',
      width: '25%',
      data(data, type) {
        const { role, achievement, hours } = data
        if (type != 'display') return role
        if (!achievement) {
          return `<p>${role} - ${hours}hrs</p>`
        }
        return `<p><b>${String(achievement).replace('\n', '<br/>')}</b><br/>${role} - ${hours}hrs</p>`
      }
    },
    {
      title: 'Highlight',
      data: 'isHighlight',
      width: '8%',
      render(isHighlight) {
        return isHighlight ? '✅' : '❌'
      }
    },
    {
      title: 'Present Award',
      data: 'isAward',
      width: '8%',
      render(isAward) {
        return isAward ? '✅' : '❌'
      }
    },
    {
      title: 'Award',
      width: '25%',
      data(data, type) {
        const { isAward, awardName, awardType, awardStatus } = data
        if (type != 'display') return isAward
        if (!isAward) return ''
        return `
<div class='content'>
<dl>
  <dt class='has-text-weight-bold'>Name of Award</dt>
  <dd>${awardName}</dd>
  <dt class='has-text-weight-bold'>Type of Award</dt>
  <dd>${awardType}</dd>
  <dt class='has-text-weight-bold'>Award Status</dt>
  <dd>${awardStatus}</dd>
</dl>
</div>
`
      }
    },
    { data: 'range', visible: false },
    { data: 'eventId', visible: false },
    { data: 'participantId', visible: false },
    { data: 'regno', visible: false }
  ]

  const options = {
    serverSide: true,
    select: true,
    ordering: false,
    processing: true,
    columnDefs: [{ className: 'has-text-centered', targets: [0, 1, 3, 4] }]
  }

  useEffect(() => {
    const events = ['select', 'deselect']
    events.forEach((event) => {
      tableRef.current?.dt().on(event, (_, dt) => {
        const selectedParticipants = dt
          .rows({
            selected: true
          })
          .data()
          .toArray()

        setSelectedParticipants(selectedParticipants)
      })
    })
  }, [])

  if (!eventId) return null

  return (
    <>
      <DataTable
        id='participantsTable'
        ref={tableRef}
        url={`/api/ole/participants?eventId=${eventId}`}
        columns={columns}
        options={options}
      />
      <div className='buttons'>
        <button
          className='button is-warning'
          onClick={() => {
            setIsAddParticipants(!isAddParticipants)
            setIsEditParticipants(false)
          }}
        >
          {isAddParticipants ? 'Close Add' : 'Add'} Participants
        </button>
        {selectedParticipants.length ? (
          <button
            className='button is-info'
            onClick={() => {
              setIsEditParticipants(!isEditParticipants)
              setIsAddParticipants(false)
            }}
          >
            {isEditParticipants ? 'Close' : 'Edit'} Selected Participants
          </button>
        ) : null}
      </div>
      {isAddParticipants ? (
        <AddParticipants
          notifier={notifier}
          tableRef={tableRef}
          selectedEvent={selectedEvent}
        />
      ) : null}
      {isEditParticipants ? (
        <EditParticipants
          selectedParticipants={selectedParticipants}
          setIsEditParticipants={setIsEditParticipants}
          notifier={notifier}
          tableRef={tableRef}
        />
      ) : null}
    </>
  )
}
