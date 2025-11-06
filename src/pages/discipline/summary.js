import DisciplineNav from './components/nav'
import { useState, useEffect, useRef } from 'react'
import { columns as defaultColumns } from '@/lib/discipline/summary/columns'
import DataTable from '@/components/dataTable'
import { useStudentsContext } from '@/context/studentContext'
import _ from 'lodash'

import {
  TODAY,
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  ITEM_CODES,
  MERIT_DEMERIT_CODES,
  ATTENDANCE_TYPES,
  FIRST_TERM_START_DATE
} from '@/config/constant'

import MultiSelectInput from '@/components/form/multiSelectInput'
import SelectInput from '@/components/form/selectInput'
import DateInput from '@/components/form/dateInput'
import HideformButton from '@/components/hideFormButton'

export default function DisciplineSummary() {
  const tableRef = useRef()
  const buttonRef = useRef()
  const attendanceRef = useRef()
  const itemRef = useRef()
  const [url, setUrl] = useState('')

  const [columns, setColumns] = useState(defaultColumns)

  const defaultFilters = {
    startDate: START_TERM_DATE,
    endDate: TODAY,
    classcodes: [],
    attendances: [],
    items: [],
    term: TERM
  }
  const { students } = useStudentsContext()
  const [isShowFilters, setIsShowFilters] = useState(true)

  const [filters, setFilters] = useState({ ...defaultFilters })
  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)

  const handleSubmitFilter = async () => {
    const { classcodes, term, startDate, endDate } = filters
    let newUrl = ''
    newUrl += `/api/discipline/summaries?filters[schoolYear]=${SCHOOL_YEAR}&filters[term]=${term}&filters[status]=ACTIVE`
    if (startDate) {
      newUrl += `&filters[eventDate][$gte]=${startDate}`
    }
    if (endDate) {
      newUrl += `&filters[eventDate][$lte]=${endDate}`
    }

    classcodes.forEach((c, index) => {
      newUrl += `&filters[classcode][${index}]=${c}`
    })
    setUrl(newUrl)
    if (tableRef.current) {
      tableRef.current.dt().ajax.url(newUrl).load()
    }

    setIsShowFilters(false)
  }

  const options = {
    dom: '<"level" <"level-left" l> <"level-right" B> > fr <"table-container" t>ip',
    searching: false,
    processing: true,
    serverSide: true,
    scrollX: true,
    fixedColumns: true,
    fixedHeader: true,
    pageLength: 35,
    lengthMenu: [
      [10, 25, 35, 50, -1],
      ['10 rows', '25 rows', '35 rows', '50 rows', 'Show all']
    ],
    scrollCollapse: true,
    buttons: [
      { extend: 'copy', className: 'is-primary' },
      {
        extend: 'print',
        className: 'is-warning',
        autoPrint: false,
        text: 'Preview'
      }
    ],
    rowId: 'id',
    columnDefs: [
      { orderData: [3, 4], targets: 0 },
      { orderable: false, targets: '_all' },
      { orderable: true, targets: 0 },
      { className: 'has-text-centered', targets: '_all' }
    ],
    order: [
      [3, 'asc'],
      [4, 'asc']
    ]
  }

  const handleChange = (e) => {
    const { name, value, type, options } = e.target

    if (name == 'attendances' || name == 'items') {
      const newColumns = [...defaultColumns]
      attendanceRef
      const selectedOptions = [
        ...Array.from(attendanceRef.current.options),
        ...Array.from(itemRef.current.options)
      ].filter((o) => o.selected)
      const values = selectedOptions.map((o) => {
        return {
          data: value,
          title: o.text,
          name: value
        }
      })
      newColumns.push(...values)
      setColumns(newColumns)
    }

    setFilters((prevFilters) => {
      if (options && type == 'select-multiple') {
        const newFilters = { ...prevFilters, [name]: [] } // Update the formData object

        const selectedOptions = Array.from(options).filter((o) => o.selected)
        newFilters[name] = selectedOptions.map((o) => o.value)
        return newFilters
      }

      const newFilters = { ...prevFilters, [name]: value }
      newFilters[name] = value

      if (name == 'term' && value == 1) {
        newFilters['startDate'] = FIRST_TERM_START_DATE
      }
      if (name == 'term' && value == 2) {
        newFilters['startDate'] = SECOND_TERM_START_DATE
      }
      return newFilters
    })
  }

  return (
    <>
      {
        // <pre>{JSON.stringify(filters, null, '\t')}</pre>
      }
      <DisciplineNav />
      <HideformButton
        isShow={isShowFilters}
        handleShowClick={() => {
          setIsShowFilters(true)
        }}
        handleHideClick={() => setIsShowFilters(false)}
      />
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
                size='4'
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

              <p className='help is-info'>
                To select / deselect multiple classes or students, press and
                hold down Ctrl (Window) or ⌘ (macOS) key and click the items.
              </p>
            </div>
            <div className='control column'>
              <div className='control mb-2'>
                <label className='heading'>Term</label>

                <SelectInput
                  value={filters.term}
                  name='term'
                  handleChange={handleChange}
                >
                  <option value={1}>Term 1</option>
                  <option value={2}>Term 2</option>
                </SelectInput>
              </div>
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
              <div className='control'>
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

          <button
            ref={buttonRef}
            className='button is-info'
            onClick={handleSubmitFilter}
          >
            Get Data
          </button>
        </div>
      ) : null}
      <div className='tags'>
        {ITEM_CODES.map((item) => {
          const { code, title } = item
          return (
            <span key={code} className='tag is-light is-info'>
              {code} {title}
            </span>
          )
        })}
      </div>
      {url ? (
        <DataTable
          ref={tableRef}
          columns={columns}
          url={{ url, method: 'POST' }}
          options={options}
        />
      ) : null}
    </>
  )
}
