import Nav from './components/nav.js'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useStudentsContext } from '@/context/studentContext'
import { useSession } from 'next-auth/react'
import { groupBy } from 'lodash'
import { getDisplayName } from '@/lib/helper'
import DataTable from '@/components/dataTable'
import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import EditModal from './components/editModal'

export default function EcaMembershipRecord() {
  const { students } = useStudentsContext()
  const [clubs, setClubs] = useState([])

  const defaultFilter = {
    clubId: '',
    classcode: '',
    regno: ''
  }
  const [filter, setFilter] = useState({ ...defaultFilter })
  const [members, setMembers] = useState([])
  const selectedMembers = useRef([])
  const [notification, setNotification] = useState({ ...defaultNotification })
  const tableRef = useRef(null)
  const { data: session } = useSession()
  const { initial } = session?.user?.info
  const [isEdit, setIsEdit] = useState(false)

  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  const groupedStudents = groupBy(students, 'classcode')

  const fetchClubsInformation = async () => {
    setLoadingMessage()
    try {
      const response = await fetch('/api/eca/clubs')
      if (!response.ok) throw new Error('Fail to fetch clubs data')
      const clubs = await response.json()
      setClubs(clubs)
      clearMessage()
    } catch (e) {
      setErrorMessage(e)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilter((filter) => {
      if (name == 'clubId') {
        return { ...defaultFilter, [name]: value }
      }

      return { ...filter, [name]: value, clubId: defaultFilter.clubId }
    })
    setMembers([])
    selectedMembers.current = []
  }

  const handleSearch = async () => {
    setLoadingMessage()
    const filterText = filter.clubId
      ? `clubId:${filter.clubId}`
      : filter.regno
        ? `regno:${filter.regno}`
        : `classcode:${filter.classcode}`

    try {
      const response = await fetch(`/api/eca/members?filter=${filterText}`)
      if (!response.ok) throw new Error('Fail to fetch members data')
      const members = await response.json()
      setMembers(members)
      setSuccessMessage(`${members.length} members found`)
    } catch (e) {
      setErrorMessage(e)
    }
  }

  const options = useMemo(() => ({
    rowId: 'id',
    dom: `
                <"level mb-0" <"level-left" l> <"level-right" B>>
                t
                <"level mt-0 mb-2" <"level-left" i> <"level-right" p>>
                `,
    buttons: [
      {
        text: 'Edit',
        action() {
          setIsEdit((isEdit) => {
            console.log(selectedMembers.current)
            if (selectedMembers.current?.length > 0) return !isEdit
            return false
          })
        },
        className: 'is-info'
      },
      'copy',
      {
        extend: 'print',
        text: 'Preview',
        autoPrint: false
      }
    ],
    searching: false,
    select: {
      items: 'row',
      style: 'multi',

      selectable: function (rowData) {
        const { pic, associates, admininstrators } = rowData
        const relatedTeachers = [
          ...pic?.split(','),
          ...associates?.split(','),
          ...admininstrators?.split(',')
        ]
        return relatedTeachers.includes(initial)
      },
      order: [[0, 'asc']]
    },
    lengthMenu: [
      [50, 100, -1],
      [50, 100, 'All']
    ]
  }), [initial])

  const columns = [
    {
      title: 'CLASS & NO',
      data: 'classcodeAndNo',
      defaultContent: ''
    },
    { title: 'NAME', data: 'studentName', defaultContent: '' },
    { title: 'Club', data: 'information', defaultContent: '' },
    { title: 'Role', data: 'role', defaultContent: '' },
    { title: 'Grade', data: 'grade', defaultContent: '' },
    {
      title: 'Nominated',
      data: 'isNominated',
      render(isNominated) {
        return isNominated ? '✅' : ''
      },
      defaultContent: ''
    },
    { title: 'PIC', data: 'pic', defaultContent: '' },
    {
      title: 'ASSOCIATES',
      data: 'associates',
      defaultContent: ''
    }
  ]

  useEffect(() => {
    fetchClubsInformation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // update DataTable on start
    const events = ['select', 'deselect']
    const table = tableRef.current

    const handleEvent = (_, dt) => {
      selectedMembers.current = dt
        .rows({
          selected: true
        })
        .data()
        .toArray()
    }

    // Add event listeners
    events.forEach((event) => {
      table?.dt().on(event, handleEvent)
    })

    // Cleanup function
    return () => {
      events.forEach((event) => {
        table?.dt()?.off(event)
      })
    }
  }, [members.length])

  return (
    <>
      <Nav />
      <Notification {...notification} />
      <div className='field is-horizontal'>
        <div className='field-body'>
          <div className='field has-addons'>
            <div className='control is-expanded'>
              <div className='select is-fullwidth'>
                <select
                  value={filter.clubId}
                  onChange={handleChange}
                  name='clubId'
                >
                  <option value=''>
                    {' '}
                    Club / School Team / House / Student Council{' '}
                  </option>
                  {clubs.map((club, key) => {
                    return (
                      <option key={key} value={club.id}>
                        {club.cname}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            <p className='control'>
              <button
                className={`button ${filter.clubId ? 'is-info' : 'is-dark'}`}
                onClick={handleSearch}
                disabled={!filter.clubId}
              >
                Search
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className='field is-horizontal'>
        <div className='field-body'>
          <div className='field has-addons'>
            <div className='control'>
              <div className='select is-fullwidth'>
                <select
                  onChange={handleChange}
                  value={filter.classcode}
                  name='classcode'
                >
                  <option value=''>Class</option>
                  {Object.keys(groupedStudents).map((classcode) => {
                    return <option key={classcode}>{classcode}</option>
                  })}
                </select>
              </div>
            </div>

            <div className='control is-expanded'>
              <div className='select is-fullwidth'>
                <select
                  onChange={handleChange}
                  value={filter.regno}
                  name='regno'
                >
                  <option value=''>Student</option>
                  {groupedStudents[filter.classcode]?.map((s) => {
                    return (
                      <option key={s.regno} value={s.regno}>
                        {getDisplayName(s)}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
            <p className='control'>
              <button
                className={`button ${filter.regno || filter.classcode ? 'is-info' : 'is-dark'}`}
                onClick={handleSearch}
                disabled={!filter.regno && !filter.classcode}
              >
                Search
              </button>
            </p>
          </div>
        </div>
      </div>
      <label className='help is-info'>
        You may search for the results either by Club and Team or by Student.
      </label>

      {members.length ? (
        <DataTable
          ref={tableRef}
          data={members}
          columns={columns}
          options={options}
        />
      ) : null}

      <EditModal
        selectedMembers={selectedMembers}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        fetchSearch={handleSearch}
      />
    </>
  )
}
