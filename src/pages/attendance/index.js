import Nav from './components/nav'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getAttendanceSummary } from '@/utils/attendanceSummary'
import DateInput from '@/components/form/dateInput'
import SelectInput from '@/components/form/selectInput'
import {
  TODAY,
  TERM,
  SCHOOL_YEAR,
  ROLE_ENUM,
  ATTENDANCE_TYPES
} from '@/config/constant'
import { useState, useCallback } from 'react'
import { useStudentsContext } from '@/context/studentContext'
import { getDisplayName, isEmpty } from '@/lib/helper'
import { isEqual, snakeCase, throttle } from 'lodash'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'

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

const Attendance = ({ attendanceSummary }) => {
  const { students } = useStudentsContext()
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('')
  const [eventDate, setEventDate] = useState(TODAY)

  const defaultRowData = {
    classcodeAndNo: '',
    student: {},
    type: ''
  }
  const defaultRows = [
    { ...defaultRowData },
    { ...defaultRowData },
    { ...defaultRowData }
  ]
  const [rows, setRows] = useState([...defaultRows])
  const [isClicked, setIsClicked] = useState(false)
  const [notification, setNotification] = useState({ ...defaultNotification })
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    notificationWrapper(setNotification)

  const getStudent = (classcodeAndNo) => {
    if (!classcodeAndNo) return {}

    const regexClasscodeAndNo = /^(?<classcode>\d[a-zA-Z])(?<classno>\d{1,2})$/
    const regexPureDigit = /^(?<form>\d)(?<classDigit>\d)(?<classno>\d{1,2})$/
    const classMapper = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E',
      6: 'F'
    }

    const foundClasscodeAndNo = classcodeAndNo.match(regexClasscodeAndNo)
    const foundPureDigit = classcodeAndNo.match(regexPureDigit)
    let classcode, classno
    if (foundClasscodeAndNo) {
      classcode = foundClasscodeAndNo.groups.classcode.toUpperCase()
      classno = parseInt(foundClasscodeAndNo.groups.classno)
    } else if (foundPureDigit) {
      const form = foundPureDigit.groups.form
      const classDigit = foundPureDigit.groups.classDigit
      classcode = `${form}${classMapper[classDigit]}`
      classno = parseInt(foundPureDigit.groups.classno)
    } else {
      return undefined
    }

    const found = students.find((student) => {
      return (
        student.classcode === classcode && parseInt(student.classno) === classno
      )
    })
    return found
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target

    if (index == undefined) {
      setSelectedType(value)
      setRows(() => {
        const newRows = [...rows]
        return newRows.map((row) => {
          row[name] = value
          return row
        })
      })
      return
    }

    setRows(() => {
      const newRows = [...rows]
      newRows[index][name] = value
      if (name == 'classcodeAndNo') {
        newRows[index]['student'] = getStudent(value)
      }
      return newRows
    })
  }

  const addRow = () => {
    setRows((prevRows) => {
      const newRows = [
        ...prevRows,
        Object.assign({}, defaultRowData, {
          type: selectedType
        })
      ]

      return newRows
    })
  }

  const removeRow = () => {
    setRows((prevRows) => {
      const newRows = [...prevRows]
      if (prevRows.length <= 1) return newRows
      newRows.pop()
      return newRows
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      removeRow()
      // Add your logic for up arrow key press here
    } else if (event.key === 'ArrowDown') {
      addRow()
      // Add your logic for down arrow key press here
    }
  }

  const updateGrwthData = async () => {
    setLoadingMessage()
    const attendanceType = selectedType

    const TYPE_MAPPER = {
      absentHalfDay: {
        type: 'ABSENT',
        frequency: 'AM'
      },
      absentNormalAm: {
        type: 'ABSENT',
        frequency: 'AM'
      },
      absentNormalPm: {
        type: 'ABSENT',
        frequency: 'PM'
      },
      lateHalfDay: {
        type: 'LATE',
        frequency: 'AM'
      },
      lateNormalAm: {
        type: 'LATE',
        frequency: 'AM'
      },
      lateNormalPm: {
        type: 'LATE',
        frequency: 'PM'
      }
    }
    if (!Object.keys(TYPE_MAPPER).includes(attendanceType)) {
      setErrorMessage('Invalid Type selected')
      return []
    }
    const { type, frequency } = TYPE_MAPPER[attendanceType]

    const response = await fetch(
      `/api/attendances/grwth?eventDate=${eventDate}&type=${type}&frequency=${frequency}`
    )
    const data = await response.json()
    if (!response.ok) {
      setErrorMessage(JSON.stringify(data, null, '\t'))
      return
    }

    setSuccessMessage(`${data.length} records are loaded.`)

    const regnos = data.map(({ regno }) => parseInt(regno))
    const filteredStudents = students.filter(({ regno }) =>
      regnos.includes(regno)
    )

    setRows(() => {
      const grwthRows = filteredStudents.map((student) => {
        const { classcode, classno } = student
        return {
          classcodeAndNo: `${classcode}${String(classno).padStart(2, 0)}`,
          student,
          type: selectedType
        }
      })

      const newRows = [
        // ...prevRows.filter(({ classcodeAndNo }) => classcodeAndNo),
        ...grwthRows
      ]
      return newRows
    })
  }

  const isDisabled = (rows) => {
    if (isClicked) return true
    const modifiedRows = rows.filter((row) => !isEqual(row, defaultRowData))
    if (modifiedRows == 0) return true

    return !modifiedRows.every(({ type, student }) => {
      return !isEmpty(student) && type != ''
    })
  }

  const handleSubmit = async () => {
    setIsClicked(true)

    setLoadingMessage()
    const data = rows.reduce((prev, row) => {
      const { student, type } = row
      const { regno } = student
      if (!regno && !type) return prev

      prev.push({
        regno,
        type: snakeCase(type).toUpperCase(),
        schoolYear: SCHOOL_YEAR,
        term: TERM,
        recordedBy: session.user.info.initial,
        eventDate
      })
      return prev
    }, [])

    const response = await fetch('/api/strapi/attendances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    })

    setRows([...defaultRows])

    const result = await response.json()
    setIsClicked(false)

    if (!response.ok) {
      setErrorMessage(`Failed to submit data: ${result.error}`)
      return
    }

    const { count } = result
    setSuccessMessage(
      `${count} ${count == 1 ? 'record is' : 'records are'} submitted successfully`,
      () => {
        router.push('/attendance/record')
      }
    )
  }

  if (session.user?.info?.role < ROLE_ENUM['OFFICE_STAFF']) {
    router.push('/') // Redirect to home page
    return
  }

  return (
    <>
      <Nav />
      <Notification {...notification} />
      <div className='field is-horizontal'>
        <div className='field-body'>
          <div className='field'>
            <label className='label'>Type</label>
            <div className='control'>
              <SelectInput handleChange={handleChange} name='type'>
                <option value=''>Please select</option>
                {ATTENDANCE_TYPES.map(({ key, cTitle, title }, index) => {
                  return (
                    <option key={index} value={key}>
                      {title} - {cTitle}
                    </option>
                  )
                })}
              </SelectInput>
            </div>
          </div>
          <div className='field'>
            <label className='label'>Event Date</label>
            <div className='control'>
              <DateInput
                value={eventDate}
                handleChange={(e) => setEventDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='table-container'>
        <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
          <thead>
            <tr>
              <th>Classcode and no</th>
              <th>Type</th>
              <th>Student</th>
              <th>Late</th>
              <th>Absent</th>
              <th>Absent (Online)</th>
              <th>Early Leave</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const { student } = row

              const found = attendanceSummary.find(
                (a) => a.regno == student?.regno
              )
              return (
                <tr key={index}>
                  <td>
                    <input
                      name='classcodeAndNo'
                      type='text'
                      value={rows[index]['classcodeAndNo']}
                      onKeyDown={handleKeyDown}
                      className={`input ${row.student === undefined ? 'is-danger' : ''}`}
                      onChange={(e) => handleChange(e, index)}
                    />
                    <p className='help is-danger'>
                      {row.student == undefined ? 'Invalid entry' : ''}
                    </p>
                  </td>

                  <td>
                    <SelectInput
                      name='type'
                      error={
                        row['type'] == '' &&
                        !isEmpty(row['student'], defaultRowData)
                          ? 'Required'
                          : ''
                      }
                      value={row['type']}
                      tabIndex={-1}
                      handleChange={(e) => handleChange(e, index)}
                    >
                      <option value=''>Choose one</option>
                      {ATTENDANCE_TYPES.map(({ key, cTitle, title }, index) => {
                        return (
                          <option key={index} value={key}>
                            {title} - {cTitle}
                          </option>
                        )
                      })}
                    </SelectInput>
                  </td>
                  <td>{getDisplayName(student)}</td>
                  <td>
                    {(found?.late || 0) +
                      (['lateNormalAm', 'lateNormalPm', 'lateHalfDay'].includes(
                        row.type
                      )
                        ? 1
                        : 0)}
                  </td>
                  <td>
                    {(found?.absent || 0) +
                      ([
                        'absentNormalAm',
                        'absentNormalPm',
                        'absentHalfDay'
                      ].includes(row.type)
                        ? 1
                        : 0)}
                  </td>
                  <td>
                    {(found?.absentOnlineLesson || 0) +
                      (row.type == 'absentOnlineLesson' ? 1 : 0)}
                  </td>
                  <td>
                    {(found?.earlyLeave || 0) +
                      (row.type == 'earlyLeave' ? 1 : 0)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='buttons is-grouped'>
        <button
          className='button is-info'
          disabled={isDisabled(rows)}
          onClick={throttle(handleSubmit, 1000)}
        >
          Submit
        </button>
        <button
          className='button is-success'
          onClick={updateGrwthData}
          disabled={!selectedType}
        >
          Get Data from Grwth
        </button>
      </div>
    </>
  )
}
export default Attendance
