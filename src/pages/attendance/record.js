import Nav from './components/nav'
import EditModal from './components/editModal'
import DeleteModal from './components/deleteModal'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ROLE_ENUM } from '@/config/constant'
import { useState, useEffect, useRef } from 'react'
import { useStudentsContext } from '@/context/studentContext'
import { recordFilterInputMapper } from '@/lib/attendance/recordFilterInputMapper'
import { inputMapper } from '@/components/form/inputMapper'
import { TODAY, SCHOOL_YEAR } from '@/config/constant'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import DataTable from '@/components/dataTable'
import { getColumns } from '@/lib/attendance/columns'

import { getAttendanceSummary } from '@/utils/attendanceSummary'
export async function getServerSideProps() {
  // Fetch data from an API or database

  const attendanceSummary = await getAttendanceSummary()
  // Return the data as props
  return {
    props: {
      attendanceSummary // Pass users data to the page component
    }
  }
}

const AttendanceRecord = ({ attendanceSummary }) => {
  const { data: session } = useSession()
  const { students } = useStudentsContext()
  const defaultForm = {
    startDate: TODAY,
    endDate: TODAY,
    classcodes: [],
    regnos: [],
    types: [],
    isLeaveOfAbsence: ''
  }
  const [formData, setFormData] = useState({ ...defaultForm })
  const [isEditModalActive, setEditModalActive] = useState(false)
  const [isDeleteModalActive, setDeleteModalActive] = useState(false)
  const [errors, setErrors] = useState({})
  const [url, setUrl] = useState('')
  const tableRef = useRef(null)
  const isFirstRun = useRef(true)
  const [selectedRows, setSelectedRows] = useState([])

  const validationRules = {
    startDate: { required: true },
    endDate4: { required: true }
  }

  const handleChange = (e) => {
    const { name, value, options, type } = e.target
    const newForm = { ...formData }

    if (options && type == 'select-multiple') {
      const selectedOptions = Array.from(options).filter((o) => o.selected)
      newForm[name] = selectedOptions.map((o) => o.value)
    } else {
      newForm[name] = value
    }

    setFormData(newForm)

    const newErrors = validateForm(formData, validationRules)

    setErrors(newErrors)
  }

  const handleSubmit = () => {
    const { startDate, endDate, isLeaveOfAbsence } = formData
    let newUrl = ''
    newUrl += `/api/strapi/attendances?filters[schoolYear]=${SCHOOL_YEAR}`
    newUrl += `&filters[eventDate][$gte]=${startDate}&filters[eventDate][$lte]=${endDate}`

    if (isLeaveOfAbsence) {
      newUrl += `&filters[isLeaveOfAbsence]=${isLeaveOfAbsence}`
    }

    const arrayKeys = ['classcode', 'type', 'regno']

    arrayKeys.forEach((key) => {
      formData[`${key}s`].forEach((c, index) => {
        newUrl += `&filters[${key}][${index}]=${c}`
      })
    })

    if (CLASS_MASTER) {
      newUrl += `&filters[classcode]=${CLASS_MASTER}`
    }

    console.log(newUrl)
    setUrl(newUrl)

    if (tableRef.current) {
      tableRef.current.dt().ajax.url(newUrl).load()
    }
  }

  useEffect(() => {
    // update DataTable on start
    if (isFirstRun.current) {
      handleSubmit()
      isFirstRun.current = false
    }

    const events = ['select', 'deselect']
    events.forEach((event) => {
      tableRef.current?.dt().on(event, (_, dt) => {
        console.log('on select')
        const newSeletectedRows = dt
          .rows({
            selected: true
          })
          .data()
          .toArray()
        console.log(newSeletectedRows)
        setSelectedRows(newSeletectedRows)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstRun.current])

  const ROLE = session.user?.info?.role
  const CLASS_MASTER = session.user?.info?.classMaster

  const options = {
    layout: {
      topStart: 'pageLength',
      topEnd: ['buttons'],
      bottomStart: 'info',
      bottomEnd: 'paging'
    },
    pageLength: 25,
    searching: false,
    processing: true,
    serverSide: true,
    select: {
      selectable: (rowData) => {
        if (ROLE_ENUM[ROLE] >= ROLE_ENUM['OFFICE_STAFF']) {
          return true
        }

        return rowData.classcode == CLASS_MASTER
      }
    },
    order: [
      [8, 'desc'],
      [1, 'asc'],
      [2, 'asc']
    ]
  }

  options.buttons = [
    {
      text: 'Edit',
      className: 'is-info',
      action: function () {
        setEditModalActive(true)
      }
    }
  ]

  if (ROLE_ENUM[ROLE] >= ROLE_ENUM['OFFICE_STAFF']) {
    options.buttons.push({
      text: 'Delete',
      className: 'is-danger',
      action: function () {
        setDeleteModalActive(true)
      }
    })
  }

  options.buttons.push(
    {
      extend: 'copy',
      className: 'is-primary',
      exportOptions: {
        columns: [3, 4, 5, 6, 7, 8, 9, 10, 11]
      }
    },
    {
      extend: 'print',
      className: 'is-warning',
      text: 'Preview',
      autoPrint: false,
      exportOptions: {
        columns: [3, 4, 5, 6, 7, 8, 9, 10, 11],
        orthogonal: 'export'
      }
    }
  )

  if (
    ROLE_ENUM[ROLE] < ROLE_ENUM['OFFICE_STAFF'] &&
    !CLASS_MASTER &&
    ROLE !== 'SOCIAL_WORKER'
  ) {
    return (
      <>
        <Nav role={ROLE} />
        <div className='message is-warning'>
          <div className='message-body'>Only available for class masters</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav role={ROLE} />
      <div className='field is-horizontal'>
        <div className='field-body'>
          {recordFilterInputMapper(formData, students, {
            role: ROLE,
            classMaster: CLASS_MASTER
          }).map((inputInfo, key) => {
            const { title, name } = inputInfo
            const formInput = { formData, errors, handleChange }
            if (name == 'regnos' && formData.classcodes.length == 0) return null
            return (
              <div className='field' key={key}>
                <div className='control'>
                  <label className='label'>{title}</label>

                  {inputMapper(formInput, inputInfo)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='block'>
        <button className='button is-info' onClick={handleSubmit}>
          Filter
        </button>
      </div>
      {url ? (
        <DataTable
          ref={tableRef}
          columns={getColumns(attendanceSummary)}
          url={url}
          options={options}
        />
      ) : null}
      <EditModal
        tableRef={tableRef}
        isModalActive={isEditModalActive}
        setIsModalActive={setEditModalActive}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <DeleteModal
        tableRef={tableRef}
        isModalActive={isDeleteModalActive}
        setIsModalActive={setDeleteModalActive}
        selectedRows={selectedRows}
      />
    </>
  )
}
export default AttendanceRecord
