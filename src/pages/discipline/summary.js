import DisciplineNav from './components/nav'
import { useContext, useState, useEffect, useRef } from 'react'
import { columns } from './components/summary/columns'
import DataTable from '@/components/dataTable'
import { StudentsContext } from '@/context/studentContext'
import _ from 'lodash'

import {
  TODAY,
  COHORT_START_DATE,
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  ITEM_CODES,
  MERIT_DEMERIT_CODES,
  ATTENDANCE_TYPES
} from '@/config/constant'

import MultiSelectInput from '@/components/form/multiSelectInput'
import SelectInput from '@/components/form/selectInput'
import DateInput from '@/components/form/dateInput'
import HideformButton from '@/components/hideFormButton'

export default function DisciplineSummary() {
  const tableRef = useRef()
  const buttonRef = useRef()
  const [url, setUrl] = useState('')

  const defaultFilters = {
    startDate: START_TERM_DATE,
    endDate: TODAY,
    classcodes: [],
    attendances: [],
    items: [],
    term: TERM
  }
  const { students } = useContext(StudentsContext)
  const [isShowFilters, setIsShowFilters] = useState(true)

  const [filters, setFilters] = useState({ ...defaultFilters })
  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)

  const handleSubmitFilter = async () => {
    const { classcodes, term } = filters
    let newUrl = ''
    newUrl += `/api/discipline/summary?filters[schoolYear]=${SCHOOL_YEAR}&filters[term]=${term}&filters[status]=ACTIVE`

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
      { extend: 'print', className: 'is-warning' }
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
        newFilters['startDate'] = COHORT_START_DATE
      }
      if (name == 'term' && value == 2) {
        newFilters['startDate'] = START_TERM_DATE
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
              <label className='heading'>Attendances</label>
              <MultiSelectInput
                name='attendances'
                size='6'
                className='is-fullwidth'
                handleChange={handleChange}
                value={filters.attendances}
              >
                {ATTENDANCE_TYPES.map((attendace) => {
                  const { title, type } = attendace
                  return (
                    <option value={type} key={type}>
                      {title}
                    </option>
                  )
                })}
              </MultiSelectInput>
            </div>

            <div className='control is-one-third column'>
              <label className='heading'>Items</label>
              <MultiSelectInput
                name='items'
                size='6'
                className='is-fullwidth'
                handleChange={handleChange}
                value={filters.items}
              >
                {ITEM_CODES.map((item) => {
                  const { code, title } = item
                  return (
                    <option value={code} key={code}>
                      {title}
                    </option>
                  )
                })}
              </MultiSelectInput>
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
              ref={buttonRef}
              className='button is-info'
              onClick={handleSubmitFilter}
            >
              Get Data
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className='table-container'>
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
    </>
  )
}
