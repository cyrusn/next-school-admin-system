// discipline record show all conduct relate to user in the given period of time
import DisciplineNav from './components/nav'
import { StudentsContext } from '@/context/studentContext'
import { useContext, useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import MultiSelectInput from '@/components/form/multiSelectInput'
import DateInput from '@/components/form/dateInput'
import _ from 'lodash'
import { DateTime } from 'luxon'
import DataTable from '@/components/dataTable'
import { setLazyProp } from 'next/dist/server/api-utils'
import { ITEM_CODES, MERIT_DEMERIT_CODES } from './components/code'

export default function DisciplineRecord() {
  const COHORT_START_DATE = '2025-01-24'
  const today = DateTime.now().setZone('Asia/Hong_Kong').toFormat('yyyy-MM-dd')

  const { data: session, status } = useSession()
  const { students } = useContext(StudentsContext)
  const [url, setUrl] = useState('')
  const [filters, setFilters] = useState({
    classcodes: [],
    regnos: [],
    startDate: COHORT_START_DATE,
    endDate: today
  })

  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)
  const tableRef = useRef()

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
      name: 'classcode',
      data: 'classcode'
    },
    {
      name: 'classno',
      data: 'classno'
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
    let newUrl = `/api/discipline/conducts?filters[schoolYear]=2024&filters[term]=2`
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
    searching: false,
    processing: true,
    serverSide: true,
    columnDefs: [
      { orderData: [1, 2], targets: 0 },
      { targets: [1, 2], visible: false }
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
              max={today}
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
        <a className='button is-info' onClick={handleSubmitFilter}>
          Filter
        </a>
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
