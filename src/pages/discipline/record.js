// discipline record show all conduct relate to user in the given period of time
import { useContext, useState, useEffect, useRef } from 'react'
import { setLazyProp } from 'next/dist/server/api-utils'
import { useSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import _ from 'lodash'

import MultiSelectInput from '@/components/form/multiSelectInput'
import DateInput from '@/components/form/dateInput'
import DataTable from '@/components/dataTable'
import { StudentsContext } from '@/context/studentContext'
import { TODAY, COHORT_START_DATE, SCHOOL_YEAR, TERM } from '@/config/constant'
import { ITEM_CODES, MERIT_DEMERIT_CODES } from '@/config/constant'
import DisciplineNav from './components/nav'

export default function DisciplineRecord() {
  const { data: session, status } = useSession()
  const { students } = useContext(StudentsContext)
  const [url, setUrl] = useState('')
  const [filters, setFilters] = useState({
    classcodes: [],
    regnos: [],
    startDate: COHORT_START_DATE,
    endDate: TODAY
  })

  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)
  const tableRef = useRef()
  const buttonRef = useRef()

  const [conductData, setConductData] = useState([])

  const [loading, setLoading] = useState(true) // Loading state
  const handleChange = (e) => {
    const { name, value, type, options } = e.target

    setFilters((prevFilters) => {
      if (options && type == 'select-multiple') {
        const newFilters = { ...prevFilters, [name]: [] } // Update the formData object

        const selectedOptions = Array.from(options).filter((o) => o.selected)
        newFilters[name] = selectedOptions.map((o) => o.value)
        return newFilters
      }

      const newFilters = { ...prevFilters, [name]: value }
      newFilters[name] = value
      return newFilters
    })
  }

  const columns = [
    { name: 'id', data: 'id' },
    {
      name: 'classcode',
      data: 'classcode'
    },
    {
      name: 'classno',
      data: 'classno'
    },
    {
      title: 'Student',
      data(data, type) {
        const { classcode, classno, name, cname } = data
        if (type === 'set') {
          return
        }

        if (type === 'display' || type === 'filter') {
          return `${classcode}${String(classno).padStart(2, '0')} ${cname || name}`
        }

        if (type === 'sort') {
          return ['classcode', 'classno']
        }

        return 'regno'
      }
    },
    {
      title: 'Date',
      data: 'eventDate'
    },
    {
      title: 'Item',
      data: 'itemCode',
      render(itemCode) {
        const itemObject = [...ITEM_CODES, ...MERIT_DEMERIT_CODES].find(
          ({ code }) => {
            return code === parseInt(itemCode)
          }
        )
        return `${itemCode} - ${itemObject['cTitle']}`
      }
    },
    {
      title: 'Mark',
      data: 'mark'
    },
    {
      title: 'Description',
      data: 'description',
      orderable: false
    },
    {
      title: 'Teacher',
      data: 'teacher'
    },
    {
      title: 'Created At',
      data: 'createdAt',
      render(createdAt) {
        return createdAt.slice(0, 10)
      }
    },
    {
      title: 'From Journal',
      orderable: false,
      data: 'isImportFromJournal',
      render(isImportFromJournal) {
        return isImportFromJournal ? '📘' : '🖊️'
      }
    },
    {
      title: 'Status',
      data: 'informedAt',
      render(informedAt) {
        return informedAt ? '👍' : '⏳'
      },
      orderable: false
    }
  ]


  const handleSubmitFilter = async () => {
    const { startDate, endDate, classcodes, regnos } = filters
    let newUrl = ''
    newUrl += `/api/discipline/conduct?filters[schoolYear]=${SCHOOL_YEAR}&filters[term]=${TERM}`
    newUrl += `&filters[eventDate][$gte]=${startDate}&filters[eventDate][$lte]=${endDate}`
    if (session.user.info.initial) {
      newUrl += `&filters[teacher]=${session.user.info.initial}`
    }

    classcodes.forEach((c, index) => {
      newUrl += `&filters[classcode][${index}]=${c}`
    })

    regnos.forEach((c, index) => {
      newUrl += `&filters[regno][${index}]=${c}`
    })

    setUrl(newUrl)

    if (tableRef.current) {
      tableRef.current.dt().ajax.url(newUrl).load()
    }
  }

  const options = {
    dom: '<"level" <"level-left"l> <"level-right" B> > frtip',
    select: {
      items: 'row',
      style: 'multi'
    },
    searching: false,
    processing: true,
    serverSide: true,
    buttons: ['copy', 'print'],
    rowId: 'id',
    columnDefs: [
      { orderData: [1, 2], targets: 3 },
      { targets: [0, 1, 2], visible: false },
      {
        className: 'has-text-centered',
        targets: [6, 8, 9, 10, 11]
      }
    ],
    order: [
      {
        name: 'eventDate',
        dir: 'desc'
      },
      {
        name: 'classcode',
        dir: 'asc'
      },
      {
        name: 'classno',
        dir: 'asc'
      }
    ]
  }

  useEffect(() => {
    console.log('run onclick at start')
    buttonRef.current.click()
  }, [])

  return (
    <div>
      <DisciplineNav />
      <form
        id='filterForm'
        className='field is-grouped is-grouped-centered columns'
      >
        <div className='control column'>
          <label className='heading'>Class</label>
          <MultiSelectInput
            className='is-fullwidth'
            name='classcodes'
            size='4'
            handleChange={handleChange}
            //value={filters.classcodes}
          >
            {classcodes.map((classcode) => {
              return (
                <option value={classcode} key={classcode}>
                  {classcode}
                </option>
              )
            })}
          </MultiSelectInput>
        </div>

        <div className='control is-one-third column'>
          <label className='heading'>Student</label>
          <MultiSelectInput
            name='regnos'
            size='4'
            className='is-fullwidth'
            handleChange={handleChange}
          >
            {filters.classcodes.length ? (
              students
                .filter((s) => filters.classcodes.includes(s.classcode))
                .map((s) => {
                  const classcodeAndNo = `${s.classcode}${String(s.classno).padStart(2, 0)}`
                  const displayName = `${classcodeAndNo}-${s.cname || s.ename}`
                  return (
                    <option value={s.regno} key={s.regno}>
                      {displayName}
                    </option>
                  )
                })
            ) : (
              <></>
            )}
          </MultiSelectInput>
        </div>

        <div className='control column'>
          <div className='control'>
            <label className='heading'>Start Date</label>

            <DateInput
              value={filters.startDate}
              name='startDate'
              placeholder='Start Date'
              min={COHORT_START_DATE}
              handleChange={handleChange}
            />
          </div>
          <div className='control mt-2'>
            <label className='heading'>End Date</label>

            <DateInput
              value={filters.endDate}
              name='endDate'
              placeholder='End Date'
              max={TODAY}
              handleChange={handleChange}
            />
          </div>
        </div>
      </form>

      <p className='help is-info'>
        To select / deselect multiple classes or students, press and hold down
        Ctrl (Window) or ⌘ (macOS) key and click the items.
      </p>
      <div className='my-2'>
        <button
          className='button is-info'
          onClick={handleSubmitFilter}
          ref={buttonRef}
        >
          Filter
        </button>
      </div>

      <div>
        {url ? (
          <DataTable
            ref={tableRef}
            columns={columns}
            url={url}
            options={options}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
