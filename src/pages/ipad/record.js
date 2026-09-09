import DataTable from '@/components/dataTable'
import { useEffect, useState, useRef, useMemo } from 'react'
import { getDisplayName, getTimestamp } from '@/lib/helper'
import Loading from '@/components/loading'
import { useSession } from 'next-auth/react'
import { ROLE_ENUM } from '@/config/constant'
import IpadNav from './nav.js'

export default function IPadResult() {
  const [records, setRecords] = useState([])
  const [isModalActive, setIsModalActive] = useState(false)
  const [modalAction, setModalAction] = useState('DELETE')
  const [selectedRecords, setSelectedRecords] = useState([])
  const tableRef = useRef(null)
  const { data: session } = useSession()
  const ROLE = session.user.info.role

  async function fetchRecords() {
    try {
      const response = await fetch('/api/ipad')
      if (!response.ok) throw new Error('Fail to fetch ipad data')
      const records = await response.json()
      setRecords(records)
    } catch (e) {
      console.error(e)
    }
  }

  const options = useMemo(() => {
    const buttons = []
    if (ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM']) {
      buttons.push({
        text: 'Delete',
        className: 'is-danger',
        action: function () {
          setModalAction('DELETE')
          setIsModalActive(true)
        }
      })
    }
    if (ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_ADMIN']) {
      buttons.push({
        text: 'Suspend',
        className: 'is-warning',
        action: function () {
          setModalAction('SUSPEND')
          setIsModalActive(true)
        }
      })
    }

    return {
      layout: {
        top1: 'searchBuilder',
        topStart: 'pageLength',
        topEnd: ['buttons'],
        bottomStart: 'info',
        bottomEnd: 'paging'
      },
      pageLength: 25,
      lengthMenu: [
        [10, 25, 50, 100, -1],
        ['10 rows', '25 rows', '35 rows', '50 rows', '100 rows', 'Show all']
      ],
      select: true,
      buttons,
      createdRow: (row, data) => {
        if (data && data.status === 'SUSPEND') {
          row.classList.add('is-danger')
        }
      },
      columns: [
        { data: 'classcode', title: 'Class' },
        { data: 'classno', title: 'No.' },
        { data: 'regno', title: 'regno' },
        { data: 'name', title: 'Name' },
        { data: 'status', title: 'Status' },
        { data: 'freq', title: 'Freq' },
        {
          data(row) {
            let teachers = []
            const { freq } = row
            for (let i = freq; i > 0; i--) {
              teachers.push(row[`teacher_${i}`])
            }
            return teachers.join(', ') || ''
          },
          title: 'Teacher'
        },
        {
          data(row) {
            let admins = []
            const { freq } = row
            for (let i = freq; i > 0; i--) {
              if (row[`admin_${i}`]) {
                admins.push(row[`admin_${i}`])
              }
            }
            return admins.join(', ') || ''
          },
          title: 'Admin'
        },
        {
          data(row) {
            let issueDates = []
            const { freq } = row
            for (let i = freq; i > 0; i--) {
              if (row[`issueDate_${i}`]) {
                issueDates.push(row[`issueDate_${i}`])
              }
            }
            return issueDates.join(', ') || ''
          },
          title: 'issueDate'
        }
      ]
    }
  }, [ROLE])

  const setInactiveStatus = async () => {
    const rangeObjects = selectedRecords.map((r) => {
      r['status'] = 'INACTIVE'
      r['timestamp'] = getTimestamp()
      return r
    })

    try {
      const response = await fetch('/api/ipad', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rangeObjects })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result)
      }

      setIsModalActive(false)
      setSelectedRecords([])
      await fetchRecords()
    } catch (e) {
      console.error(e)
    }
  }

  const setSuspendStatus = async () => {
    const hasPending = selectedRecords.some((r) => r.status === 'PENDING')
    if (hasPending) {
      alert('Student with PENDING status cannot be suspended.')
      return
    }

    const rangeObjects = selectedRecords.map((r) => {
      r['status'] = 'SUSPEND'
      r['timestamp'] = getTimestamp()
      const { freq } = r
      r[`issueDate_${freq}`] = getTimestamp().split('T')[0]
      const { initial } = session.user.info
      r[`admin_${freq}`] = initial
      return r
    })

    try {
      const response = await fetch('/api/ipad', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rangeObjects })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result)
      }

      setIsModalActive(false)
      setSelectedRecords([])
      await fetchRecords()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  useEffect(() => {
    const events = ['select', 'deselect']
    events.forEach((event) => {
      tableRef.current?.dt().on(event, (_, dt) => {
        const records = dt
          .rows({
            selected: true
          })
          .data()
          .toArray()
        setSelectedRecords(records)
      })
    })
  })

  if (!records.length) return <Loading />

  return (
    <>
      <IpadNav />
      <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
        <div className='modal-background'></div>
        <div className='modal-card' style={{ width: '70%' }}>
          {selectedRecords?.length == 0 ? (
            <>
              <header className='modal-card-head'>
                <h1 className='modal-card-title'>
                  Please select students first
                </h1>
              </header>
              <div className='modal-card-body'>
                <button
                  className='button is-info'
                  onClick={() => setIsModalActive(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <header className='modal-card-head'>
                <h1 className='modal-card-title'>
                  {modalAction === 'SUSPEND' ? 'Confirm to suspend' : 'Confirm to remove the right'}
                </h1>
              </header>
              <div className='modal-card-body'>
                {modalAction === 'SUSPEND' && selectedRecords.some(r => r.status === 'PENDING') && (
                  <div className='notification is-warning is-light'>
                    Students with <strong>PENDING</strong> status cannot be suspended.
                  </div>
                )}
                <div className='tags'>
                  {selectedRecords?.map((r, key) => {
                    return (
                      <span className='tag is-warning' key={key}>
                        {' '}
                        {getDisplayName(r)}
                      </span>
                    )
                  })}
                </div>

                <div className='buttons'>
                  <button
                    className='button is-danger'
                    onClick={modalAction === 'SUSPEND' ? setSuspendStatus : setInactiveStatus}
                    disabled={modalAction === 'SUSPEND' && selectedRecords.some(r => r.status === 'PENDING')}
                  >
                    Confirm
                  </button>
                  <button
                    className='button is-info'
                    onClick={() => setIsModalActive(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          className='modal-close is-large'
          aria-label='close'
          onClick={() => setIsModalActive(false)}
        ></button>
      </div>

      <DataTable ref={tableRef} options={options} data={records} />
    </>
  )
}
