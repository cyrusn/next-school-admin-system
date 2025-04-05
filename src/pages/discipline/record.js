// discipline record show all conduct relate to user in the given period of time
import { useContext, useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { DateTime } from 'luxon'
import $ from 'jquery'
import _ from 'lodash'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

import MultiSelectInput from '@/components/form/multiSelectInput'
import DateInput from '@/components/form/dateInput'
import DataTable from '@/components/dataTable'
import DisciplineNav from './components/nav'

import { StudentsContext } from '@/context/studentContext'
import { getDisplayName } from '@/lib/helper'
import {
  TODAY,
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  ITEM_CODES,
  MERIT_DEMERIT_CODES
} from '@/config/constant'

export default function DisciplineRecord() {
  const { data: session, status } = useSession()
  const { role: ROLE, initial: INITIAL } = session.user.info

  const { students } = useContext(StudentsContext)
  const [url, setUrl] = useState('')
  const [isModalActive, setIsModalActive] = useState(false)
  const [isShowFilters, setIsShowFilters] = useState(false)
  const selectedRows = useRef([])

  const defaultFilters = {
    classcodes: [],
    regnos: [],
    startDate: START_TERM_DATE,
    endDate: TODAY
  }
  const [filters, setFilters] = useState({ ...defaultFilters })

  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)
  const tableRef = useRef()
  const buttonRef = useRef()

  const [conductData, setConductData] = useState([])

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
  const getFullItemCode = (itemCode) => {
    const itemObject = [...ITEM_CODES, ...MERIT_DEMERIT_CODES].find(
      ({ code }) => {
        return code === parseInt(itemCode)
      }
    )
    return `${itemCode} - ${itemObject['cTitle']}`
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
          return getDisplayName({ classcode, classno, ename: name, cname })
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
        return getFullItemCode(itemCode)
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
        return informedAt ? '🔒' : '⏳'
      },
      orderable: false
    }
  ]

  const handleSubmitFilter = async () => {
    const { startDate, endDate, classcodes, regnos } = filters
    let newUrl = ''
    newUrl += `/api/discipline/conduct?filters[schoolYear]=${SCHOOL_YEAR}&filters[term]=${TERM}`
    newUrl += `&filters[eventDate][$gte]=${startDate}&filters[eventDate][$lte]=${endDate}`
    if (INITIAL) {
      newUrl += `&filters[teacher]=${INITIAL}`
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
    rowCallback: function (tr, rowData) {
      if (rowData.informedAt) {
        tr.classList.add('unselectable')
      }
    },
    select: {
      items: 'row',
      style: 'multi',
      selectable: function (rowData) {
        return !rowData.informedAt
      }
    },
    searching: false,
    processing: true,
    serverSide: true,
    buttons: [
      {
        text: 'Delete',
        className: 'is-danger',
        action: function (e, dt, button, config) {
          setIsModalActive(true)
        }
      },

      { extend: 'copy', className: 'is-primary' },
      { extend: 'print', className: 'is-warning' }
    ],
    rowId: 'id',
    columnDefs: [
      { orderData: [1, 2], targets: 3 },
      { targets: [0, 1, 2], visible: false },
      {
        className: 'has-text-centered',
        targets: [6, 8, 9, 10, 11]
      }
    ],
    fnRowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      // set different color for merit and demerit
      const itemCodeType = Math.floor(aData.itemCode / 100)
      switch (itemCodeType) {
        case 1:
        case 2:
          $('td', nRow).addClass('has-background-danger-light')
          break
        case 3:
          $('td', nRow).addClass('has-background-success-light')
          break
        case 6:
          $('td', nRow).addClass('has-background-success')
          break
        case 9:
          $('td', nRow).addClass('has-background-danger has-text-light')
          break
      }
    },
    order: [
      [4, 'desc'],
      [1, 'asc'],
      [2, 'asc']
    ]
  }

  const confirmDelete = async () => {
    if (selectedRows.current.length == 0) return
    const qs = selectedRows.current.reduce((api, row, n) => {
      const { id } = row
      if (n === 0) {
        return (api += `filters[id][$in][${n}]=${id}`)
      }
      return (api += `&filters[id][$in][${n}]=${id}`)
    }, '')
    const response = await fetch(`/api/discipline/conduct?${qs}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const json = await response.json()
      console.error(json.message)
      return
    }
    tableRef.current.dt().ajax.reload()
    handleCancel()
  }

  const handleCancel = async () => {
    setIsModalActive(false)
    selectedRows.current = []
    tableRef.current.dt().rows().deselect()
  }

  useEffect(() => {
    // update DataTable on start
    handleSubmitFilter()

    const events = ['select', 'deselect']
    events.forEach((event) => {
      tableRef.current?.dt().on(event, (e, dt, type, indexes) => {
        selectedRows.current = dt
          .rows({
            selected: true
          })
          .data()
          .toArray()
      })
    })
  })

  return (
    <div>
      <DisciplineNav />
      {isShowFilters ? (
        <button
          className='button is-fullwidth is-small mb-2 is-light'
          onClick={() => setIsShowFilters(false)}
        >
          <span className='mr-2'>Hide Filters </span>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      ) : (
        <button
          className='button is-fullwidth is-small mb-2 is-warning is-light'
          onClick={() => {
            setIsShowFilters(true)
            setFilters({ ...defaultFilters })
          }}
        >
          <span className='mr-2'>Show Filters </span>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}

      {isShowFilters ? (
        <div className='box'>
          <form
            id='filterForm'
            className='field is-grouped is-grouped-centered columns'
          >
            <div className='control column'>
              <label className='heading'>Class</label>
              <MultiSelectInput
                className='is-fullwidth'
                name='classcodes'
                size='6'
                handleChange={handleChange}
                value={filters.classcodes}
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
                size='6'
                className='is-fullwidth'
                handleChange={handleChange}
                value={filters.regnos}
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
                  min={START_TERM_DATE}
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
            To select / deselect multiple classes or students, press and hold
            down Ctrl (Window) or ⌘ (macOS) key and click the items.
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
        </div>
      ) : (
        <></>
      )}

      <div className={`modal ${isModalActive && 'is-active'}`}>
        <div className='modal-background'></div>
        <div className='modal-content' style={{ width: '70%' }}>
          <div className='box'>
            <h1 className='title'>Confirm to delete the selected records?</h1>
            <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
              <thead>
                <tr>
                  <th>Event Date</th>
                  <th>Student</th>
                  <th>Item</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.current.map((row) => {
                  const {
                    classcode,
                    classno,
                    name,
                    cname,
                    eventDate,
                    itemCode,
                    mark
                  } = row
                  return (
                    <tr key={row.regno}>
                      <td>{eventDate}</td>
                      <td>
                        {getDisplayName({ classcode, classno, name, cname })}
                      </td>
                      <td>{getFullItemCode(itemCode)}</td>
                      <td>{mark}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className='buttons has-addons'>
              <button
                className='button is-info'
                onClick={confirmDelete}
                disabled={selectedRows.current.length == 0}
              >
                Confirm
              </button>
              <button className='button is-warning' onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <button
          className='modal-close is-large'
          aria-label='close'
          onClick={() => {
            setIsModalActive(false)
          }}
        ></button>
      </div>

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
  )
}
