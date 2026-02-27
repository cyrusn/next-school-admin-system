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
            const { freq } = row
            return row[`issueDate_${freq}`] || ''
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
                  Confirm to remove the right
                </h1>
              </header>
              <div className='modal-card-body'>
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
                    onClick={setInactiveStatus}
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
