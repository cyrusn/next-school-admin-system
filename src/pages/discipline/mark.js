import { useState } from 'react'
import { DateTime } from 'luxon'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  ITEM_CODES,
  TODAY,
  ROLE_ENUM,
  TIMEZONE
} from '@/config/constant'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { useStudentsContext } from '@/context/studentContext'
import { getDisplayName } from '@/lib/helper'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import SelectInput from '@/components/form/selectInput'
import NumberInput from '@/components/form/numberInput'
import DateInput from '@/components/form/dateInput'
import MultiSelectInput from '@/components/form/multiSelectInput'
import TextAreaInput from '@/components/form/textAreaInput'
import DisciplineNav from './components/nav'

export default function DisciplineForm() {
  const NEXT_PUBLIC_IS_DC_DOWN = process.env['NEXT_PUBLIC_IS_DC_DOWN']
  const router = useRouter()
  const defaultRow = {
    itemCode: '',
    type: '',
    mark: 0,
    eventDate: TODAY,
    classcodes: [],
    description: '',
    regnos: []
  }
  const [rows, setRows] = useState([Object.assign({}, defaultRow)])

  const { data: session } = useSession()
  const ROLE = session.user.info.role
  const TEACHER_INITIAL = session.user.info.initial

  const now = DateTime.now().setZone(TIMEZONE)
  const WEEKDAY = now.weekday
  const LAST_MONDAY = now
    .minus({ weeks: 1, days: WEEKDAY - 1 })
    .toFormat('yyyy-MM-dd')

  const MIN_DATE =
    ROLE_ENUM[ROLE] == ROLE_ENUM['DC_ADMIN'] ? START_TERM_DATE : LAST_MONDAY

  const { students } = useStudentsContext()
  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)

  const [errors, setErrors] = useState([{}])
  const [isDisabled, setIsDisabled] = useState(true)

  const addRows = () => {
    setRows([...rows, Object.assign({}, defaultRow)])
    setErrors([...errors, Object.assign({}, {})])
  }

  const validationRules = {
    itemCode: { required: true },
    type: { required: true },
    description: { required: true, minLength: 3 },
    mark: { nonZero: true },
    eventDate: { required: true },
    classcodes: { nonEmpty: true },
    regnos: { nonEmpty: true }
  }

  const [notification, setNotification] = useState({ ...defaultNotification })
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    notificationWrapper(setNotification)

  const getItemsOptions = (index) => {
    const type = rows[index].type
    if (!type) return []
    return ITEM_CODES.filter(({ code, isDcOnly }) => {
      const isDCTeam = ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM']

      if (isDcOnly && !isDCTeam) return false

      return type === 'merit'
        ? Math.floor(code / 100) === 3
        : Math.floor(code / 100) < 3
    }).map(({ title, code }) => {
      return {
        name: `${code} - ${title}`,
        code
      }
    })
  }

  const deleteRow = (index) => {
    setRows(rows.filter((row, n) => n != index))
    setErrors(errors.filter((row, n) => n != index))
  }

  const handleChange = (e, index) => {
    const newRows = [...rows]
    const { name, value, options, type } = e.target

    if (options && type == 'select-multiple') {
      const selectedOptions = Array.from(options).filter((o) => o.selected)
      newRows[index][name] = selectedOptions.map((o) => o.value)
    } else {
      newRows[index][name] = value
    }

    setRows(newRows)
    if (name == 'itemCode') {
      const { min } = getMarkDescriptions(index)
      setMarkToMin(index, min)
    }

    const newErrors = [...errors]
    newErrors[index] = validateForm(rows[index], validationRules)

    const isInvalid = newErrors.some((error) => {
      return Object.keys(error).length > 0
    })

    setErrors(newErrors)
    setIsDisabled(isInvalid) // Update disabled state based on validation
  }

  function setMarkToMin(index, min) {
    const newRows = [...rows]
    newRows[index]['mark'] = min
    setRows(newRows)
  }

  const getMarkDescriptions = (index) => {
    const result = {
      min: 0,
      max: 0,
      helpText: ''
    }

    if (!rows[index].itemCode) return result

    const { min, max } = ITEM_CODES.find(
      ({ code }) => code === parseInt(rows[index].itemCode)
    )
    const isDCTeam = ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM']
    const adjustedMax = isDCTeam ? max : Math.min(max, 3)

    if (min === adjustedMax) {
      result.helpText = `Can only enter ${min} mark.`
    } else {
      result.helpText = `Can choose from ${min} to ${adjustedMax}.`
    }

    result.min = min
    result.max = adjustedMax
    return result
  }

  const handleSubmit = async () => {
    setLoadingMessage()
    setIsDisabled(true)
    const data = rows.reduce((prev, row, index) => {
      const { regnos, mark, itemCode, eventDate, description } = row

      const records = regnos.map((regno) => ({
        regno,
        schoolYear: SCHOOL_YEAR,
        term: TERM,
        eventDate,
        itemCode,
        description,
        mark: String(itemCode)[0] == 3 ? mark : -mark,
        teacher: TEACHER_INITIAL
      }))
      prev.push(...records)
      return prev
    }, [])

    const response = await fetch('/api/strapi/conducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    })

    setRows([{ ...defaultRow }])
    setErrors([{}])

    const result = await response.json()
    if (!response.ok) {
      setErrorMessage(`Failed to submit data: ${result.error}`)
      setIsDisabled(false)
      return
    }

    setSuccessMessage(
      `Data submitted successfully: ${JSON.stringify(result)}`,
      () => {
        setIsDisabled(false)
        router.push('/discipline/record')
      }
    )
  }

  const removeSelectedStudent = (index, regno) => {
    const newRows = [...rows]
    newRows[index].regnos = newRows[index].regnos.filter((r) => r != regno)
    setRows(newRows)
  }

  if (
    NEXT_PUBLIC_IS_DC_DOWN == 'true' &&
    ROLE_ENUM[ROLE] < ROLE_ENUM['DC_ADMIN']
  ) {
    return (
      <article className='message is-danger'>
        <div className='message-body'>
          Sorry, we&apos;re down for the preparation of the DC report for this
          semesters, should you have any enquires, please contact DC head. Thank
          you.
        </div>
      </article>
    )
  }

  return (
    <>
      <DisciplineNav />

      <Notification {...notification} />
      {rows.map((_row, index) => {
        return (
          <div key={index} className='box'>
            <div className='field is-horizontal '>
              <div className='field-body columns'>
                <div className='field column is-2'>
                  <p className='heading'>Type</p>
                  <SelectInput
                    className='is-expanded'
                    required={true}
                    name='type'
                    error={errors[index]['type']}
                    value={rows[index]['type']}
                    handleChange={(e) => handleChange(e, index)}
                    placeholder='Please select'
                  >
                    <option value='demerit'>Demerit</option>
                    <option value='merit'>Merit</option>
                  </SelectInput>

                  <p className='heading mt-2'>Item</p>
                  <SelectInput
                    disabled={!rows[index]['type']}
                    className='is-expanded'
                    required={true}
                    name='itemCode'
                    error={errors[index]['itemCode']}
                    value={rows[index]['itemCode']}
                    handleChange={(e) => handleChange(e, index)}
                    placeholder='Please select'
                  >
                    {getItemsOptions(index).map((item, key) => {
                      return (
                        <option value={item.code} key={key}>
                          {item.name}
                        </option>
                      )
                    })}
                  </SelectInput>

                  <p className='heading mt-2'>Mark</p>
                  <NumberInput
                    placeholder='Mark'
                    name='mark'
                    min={getMarkDescriptions(index).min}
                    max={getMarkDescriptions(index).max}
                    value={rows[index]['mark']}
                    error={errors[index]['mark']}
                    handleChange={(e) => handleChange(e, index)}
                    disabled={!rows[index]['itemCode']}
                  />
                  <label className='help is-info'>
                    {getMarkDescriptions(index).helpText}
                  </label>
                </div>

                <div className='field column is-3'>
                  <label className='heading'>Event Date</label>
                  <DateInput
                    className='is-expanded'
                    disabled={!rows[index]['itemCode']}
                    name='eventDate'
                    max={TODAY}
                    min={MIN_DATE}
                    value={rows[index]['eventDate']}
                    error={errors[index]['eventDate']}
                    handleChange={(e) => handleChange(e, index)}
                  />
                  <TextAreaInput
                    className='mt-2'
                    name='description'
                    value={rows[index]['description']}
                    error={errors[index]['description']}
                    handleChange={(e) => handleChange(e, index)}
                    placeholder='Please clearly state the reason for the deduction, otherwise it will be difficult to check the records.'
                    rows='10'
                  />
                </div>

                <div className='field column is-1'>
                  <p className='heading'>Class</p>
                  <MultiSelectInput
                    className='is-fullwidth'
                    name='classcodes'
                    size='10'
                    handleChange={(e) => handleChange(e, index)}
                    error={errors[index]['classcodes']}
                    value={rows[index]['classcodes']}
                    disabled={!rows[index]['itemCode']}
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

                <div className='field column is-4'>
                  <p className='heading'>Student</p>
                  <MultiSelectInput
                    name='regnos'
                    size='10'
                    className='is-fullwidth'
                    error={errors[index]['regnos']}
                    handleChange={(e) => handleChange(e, index)}
                    value={rows[index]['regnos']}
                    disabled={!rows[index]['classcodes'].length}
                  >
                    {rows[index].classcodes.length
                      ? students
                        .filter((s) =>
                          rows[index].classcodes.includes(s.classcode)
                        )
                        .map((s) => {
                          const displayName = getDisplayName(s)
                          return (
                            <option value={s.regno} key={s.regno}>
                              {displayName}
                            </option>
                          )
                        })
                      : null}
                  </MultiSelectInput>
                </div>

                <div className='field column'>
                  <div className='control'>
                    <button
                      type='button'
                      className='delete'
                      onClick={() => deleteRow(index)}
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            <p className='is-info help'>
              To select / deselect multiple classes or students, press and hold
              down Ctrl (Window) or ⌘ (macOS) key and click the items.
            </p>
            <div className='tags mt-2'>
              {students
                .filter(({ regno }) => {
                  return rows[index].regnos
                    .map((regno) => parseInt(regno))
                    .includes(regno)
                })
                .map((s) => {
                  const { regno } = s
                  const displayName = getDisplayName(s)
                  return (
                    <span className='tag is-warning' key={regno}>
                      <span>{displayName}</span>
                      <button
                        className='delete is-small'
                        onClick={() => removeSelectedStudent(index, regno)}
                      ></button>
                    </span>
                  )
                })}
            </div>
          </div>
        )
      })}
      <div className='field is-horizontal'>
        <div className='field-body'>
          <div id='buttonGroup' className='field is-grouped'>
            <p className='control'>
              <a onClick={addRows} className='button is-primary'>
                Add row
              </a>
            </p>
            <p className='control'>
              <input
                className='button is-info'
                type='submit'
                value='Submit'
                onClick={_.throttle(handleSubmit, 1000)}
                disabled={isDisabled}
              />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
