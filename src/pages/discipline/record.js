// discipline record show all conduct relate to user in the given period of time
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import _ from 'lodash'

import HideformButton from '@/components/hideFormButton'

import MultiSelectInput from '@/components/form/multiSelectInput'
import SelectInput from '@/components/form/selectInput'
import DateInput from '@/components/form/dateInput'
import DataTable from '@/components/dataTable'
import DisciplineNav from './components/nav'
import Modal from './components/modal'

import { useStudentsContext } from '@/context/studentContext'
import { useUsersContext } from '@/context/usersContext'
import { getDisplayName } from '@/lib/helper'
import {
  TODAY,
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  ITEM_CODES,
  MERIT_DEMERIT_CODES,
  ROLE_ENUM,
  FIRST_TERM_START_DATE,
  SECOND_TERM_START_DATE
} from '@/config/constant'

export default function DisciplineRecord() {
  const { data: session } = useSession()
  const { role: ROLE, initial: INITIAL } = session.user.info
  const { students } = useStudentsContext()
  const { users } = useUsersContext()

  const [url, setUrl] = useState('')
  const [isModalActive, setIsModalActive] = useState(false)
  const [isShowFilters, setIsShowFilters] = useState(false)
  const selectedRows = useRef([])
  const isFirstRun = useRef(true)

  const defaultFilters = {
    classcodes: [],
    regnos: [],
    startDate: START_TERM_DATE,
    endDate: TODAY,
    teacher: INITIAL,
    term: TERM
  }
  const [filters, setFilters] = useState({ ...defaultFilters })

  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)
  const tableRef = useRef()
  const buttonRef = useRef()

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
        newFilters['startDate'] = FIRST_TERM_START_DATE
      }
      if (name == 'term' && value == 2) {
        newFilters['startDate'] = SECOND_TERM_START_DATE
      }
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
      width: '15%',
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
      title: 'Date',
      data: 'eventDate',
      width: '10%'
    },
    {
      title: 'Item',
      data: 'itemCode',
      width: '20%',
      render(itemCode) {
        return getFullItemCode(itemCode)
      }
    },
    {
      title: 'Mark',
      data: 'mark',
      width: '5%'
    },
    {
      title: 'Description',
      data: 'description',
      orderable: false
    },
    {
      title: 'Teacher',
      data: 'teacher',
      orderable: false,
      width: '5%'
    },
    {
      title: 'Created',
      data: 'createdAt',
      width: '10%',
      render(createdAt) {
        return createdAt.slice(0, 10)
      }
    },
    {
      title: 'Journal',
      orderable: false,
      width: '5%',
      data: 'isImportFromJournal',
      orderable: false,
      render: {
        _(isImportFromJournal) {
          return isImportFromJournal ? '📘' : '🖊️'
        },
        export(isImportFromJournal) {
          return isImportFromJournal
        }
      }
    },
    {
      title: 'Status',
      data: 'informedAt',
      width: '5%',
      render: {
        _(informedAt) {
          return informedAt ? '🔒' : '⏳'
        },
        export(informedAt) {
          return informedAt
        }
      },
      orderable: false
    }
  ]

  const handleSubmitFilter = async () => {
    const { startDate, endDate, classcodes, regnos, teacher } = filters
    let newUrl = ''
    newUrl += `/api/strapi/conducts?filters[schoolYear]=${SCHOOL_YEAR}`
    newUrl += `&filters[eventDate][$gte]=${startDate}&filters[eventDate][$lte]=${endDate}`

    if (teacher) {
      newUrl += `&filters[teacher]=${teacher}`
    }

    classcodes.forEach((c, index) => {
      newUrl += `&filters[classcode][${index}]=${c}`
    })

    regnos.forEach((c, index) => {
      newUrl += `&filters[regno][${index}]=${c}`
    })

    console.log(newUrl)
    setUrl(newUrl)

    if (tableRef.current) {
      tableRef.current.dt().ajax.url(newUrl).load()
    }

    isFirstRun.current = false
  }

  const options = {
    dom: '<"level" <"level-left"l> <"level-right" B> > frtip',

    layout: {
      topStart: 'pageLength',
      topEnd: ['buttons'],
      bottomStart: 'info',
      bottomEnd: 'paging'
    },
    rowCallback: function (tr, rowData) {
      if (rowData.informedAt && ROLE_ENUM[ROLE] < ROLE_ENUM['DC_ADMIN']) {
        tr.classList.add('unselectable')
      }

      const itemCodeType = Math.floor(rowData.itemCode / 100)
      switch (itemCodeType) {
        case 1:
        case 2:
          tr.classList.add('has-background-danger-soft')
          break
        case 3:
          tr.classList.add('has-background-info-soft')
          break
        case 6:
          tr.classList.add('has-background-primary-soft')
          break
        case 9:
          tr.classList.add('has-background-warning-soft')
          break
      }
    },
    select: {
      items: 'row',
      style: 'multi',
      selectable: function (rowData) {
        return !rowData.informedAt || ROLE_ENUM[ROLE] == ROLE_ENUM['DC_ADMIN']
      }
    },
    searching: false,
    processing: true,
    serverSide: true,
    buttons: [
      {
        text: 'Delete',
        className: 'is-danger',
        action: function () {
          setIsModalActive(true)
        }
      },

      { extend: 'copy', className: 'is-primary' },
      {
        extend: 'print',
        className: 'is-warning',
        text: 'Preview',
        autoPrint: false,
        exportOptions: {
          orthogonal: 'export'
        }
      }
    ],
    rowId: 'id',
    pageLength: 25,
    lengthMenu: [
      [10, 25, 50, 100, -1],
      ['10 rows', '25 rows', '35 rows', '50 rows', '100 rows', 'Show all']
    ],
    columnDefs: [
      { orderData: [1, 2], targets: 3 },
      { targets: [0, 1, 2], visible: false },
      {
        className: 'has-text-centered',
        targets: [4, 6, 8, 9, 10, 11]
      },
      {
        className: 'has-text-left',
        targets: [3, 5, 7]
      }
    ],
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
    const response = await fetch(`/api/strapi/conducts?${qs}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const json = await response.json()
      console.error(json.error)
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
    if (isFirstRun.current) {
      handleSubmitFilter()
    }

    const events = ['select', 'deselect']
    events.forEach((event) => {
      tableRef.current?.dt().on(event, (_, dt) => {
        console.log('setting selectedRows')
        selectedRows.current = dt
          .rows({
            selected: true
          })
          .data()
          .toArray()
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstRun.current])

  return (
    <div>
      <DisciplineNav />
      <HideformButton
        isShow={isShowFilters}
        handleShowClick={() => {
          setIsShowFilters(true)
          setFilters({ ...defaultFilters })
        }}
        handleHideClick={() => setIsShowFilters(false)}
      />

      {isShowFilters ? (
        <div className='box'>
          <form id='filterForm' className='field grid '>
            <div className='control cell is-min-12'>
              <label className='heading'>Class</label>
              <MultiSelectInput
                className='is-fullwidth'
                name='classcodes'
                size='5'
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

            <div className='control cell is-min-12'>
              <label className='heading'>Student</label>
              <MultiSelectInput
                name='regnos'
                size='6'
                className='is-fullwidth'
                handleChange={handleChange}
                value={filters.regnos}
              >
                {filters.classcodes.length
                  ? students
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
                  : null}
              </MultiSelectInput>
            </div>

            <div className='control cell is-min-12'>
              {ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM'] ? (
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
              ) : null}
              <div className='control'>
                <label className='heading'>Start Date</label>

                <DateInput
                  value={filters.startDate}
                  name='startDate'
                  placeholder='Start Date'
                  min={START_TERM_DATE}
                  max={TODAY}
                  handleChange={handleChange}
                />
              </div>
              <div className='control mt-2'>
                <label className='heading'>End Date</label>

                <DateInput
                  value={filters.endDate}
                  name='endDate'
                  placeholder='End Date'
                  min={START_TERM_DATE}
                  max={TODAY}
                  handleChange={handleChange}
                />
              </div>
              {ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM'] ? (
                <div className='control mt-2'>
                  <label className='heading'>Teacher</label>
                  <SelectInput
                    name='teacher'
                    handleChange={handleChange}
                    value={filters.teacher}
                  >
                    <option value=''>Disable teacher filters</option>

                    {_(users)
                      .orderBy('initial')
                      .map((user, index) => {
                        const { initial } = user
                        return (
                          <option value={initial} key={index}>
                            {initial}
                          </option>
                        )
                      })
                      .value()}
                  </SelectInput>
                </div>
              ) : null}
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
      ) : null}

      <Modal
        isModalActive={isModalActive}
        selectedRows={selectedRows.current}
        confirmDelete={confirmDelete}
        setIsModalActive={setIsModalActive}
        handleCancel={handleCancel}
        helper={{ getDisplayName, getFullItemCode }}
      />
      {url ? (
        <DataTable
          ref={tableRef}
          columns={columns}
          url={url}
          options={options}
        />
      ) : null}
    </div>
  )
}
