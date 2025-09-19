import { useState } from 'react'
import { DateTime } from 'luxon'
import _ from 'lodash'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  START_TERM_DATE,
  SCHOOL_YEAR,
  TERM,
  TODAY,
  ROLE_ENUM,
  TIMEZONE,
  MERIT_DEMERIT_CODES
} from '@/config/constant'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { useStudentsContext } from '@/context/studentContext'
import { getDisplayName } from '@/lib/helper'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import SelectInput from '@/components/form/selectInput'
// import NumberInput from '@/components/form/numberInput'
import DateInput from '@/components/form/dateInput'
import MultiSelectInput from '@/components/form/multiSelectInput'
import TextAreaInput from '@/components/form/textAreaInput'
import DisciplineNav from './components/nav'

export default function MeritDemeritForm() {
  const NEXT_PUBLIC_IS_DC_DOWN = process.env['NEXT_PUBLIC_IS_DC_DOWN']
  const router = useRouter()
  const defaultForm = {
    code: '',
    eventDate: TODAY,
    classcodes: [],
    description: '',
    regnos: []
  }
  const [formData, setFormData] = useState({ ...defaultForm })

  const {
    data: session
    // status
  } = useSession()
  const ROLE = session.user.info.role
  // const TEACHER_INITIAL = session.user.info.initial

  const now = DateTime.now().setZone(TIMEZONE)
  const WEEKDAY = now.weekday
  const LAST_MONDAY = now
    .minus({ weeks: 1, days: WEEKDAY - 1 })
    .toFormat('yyyy-MM-dd')
  // const MIN_DATE =
  //   ROLE_ENUM[ROLE] == ROLE_ENUM['DC_ADMIN'] ? START_TERM_DATE : LAST_MONDAY

  const { students } = useStudentsContext()
  const groupedStudents = _.groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents)

  const [errors, setErrors] = useState({})
  const [isDisable, setIsDisabled] = useState(true)

  const validationRules = {
    code: { required: true },
    description: { required: true, minLength: 3 },
    eventDate: { required: true },
    classcodes: { nonEmpty: true },
    regnos: { nonEmpty: true }
  }

  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    // setMessage,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage
  } = notificationWrapper(setNotification)

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

    const isInvalid = Object.keys(newErrors).length > 0

    setErrors(newErrors)
    setIsDisabled(isInvalid) // Update disabled state based on validation
  }

  const handleSubmit = async () => {
    setIsDisabled(true)

    setLoadingMessage()

    const { regnos, eventDate, code: itemCode, description } = formData
    const data = regnos.map((regno) => ({
      regno,
      schoolYear: SCHOOL_YEAR,
      term: TERM,
      eventDate,
      itemCode,
      mark: 0,
      description,
      teacher: session.user?.info.initial
    }))

    const response = await fetch('/api/strapi/conducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    })

    setFormData({ ...defaultForm })
    setErrors({})

    const result = await response.json()
    setIsDisabled(false)

    if (!response.ok) {
      setErrorMessage(`Failed to submit data: ${result.error}`)

      return
    }
    setSuccessMessage(
      `Data submitted successfully: ${JSON.stringify(result)}`,
      () => router.push('/discipline/record')
    )
  }

  const removeSelectedStudent = (regno) => {
    const newForm = { ...formData }
    newForm.regnos = newForm.regnos.filter((r) => r != regno)
    setFormData(newForm)
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
      <div className='box'>
        <div className='field is-horizontal '>
          <div className='field-body columns'>
            <div className='field column is-2'>
              <p className='heading'>Information</p>
              <SelectInput
                className='is-expanded'
                required={true}
                name='code'
                error={errors['code']}
                value={formData['code']}
                handleChange={handleChange}
                placeholder='Choose one'
              >
                {MERIT_DEMERIT_CODES.filter(({ isDcOnly }) => {
                  if (!isDcOnly) return true

                  const isDCTeam = ROLE_ENUM[ROLE] >= ROLE_ENUM['DC_TEAM']
                  return isDcOnly && isDCTeam
                }).map(({ title, code, cTitle }, index) => {
                  return (
                    <option value={code} key={index}>
                      {title} - {cTitle}
                    </option>
                  )
                })}
              </SelectInput>
            </div>

            <div className='field column is-3'>
              <label className='heading'>Event Date</label>
              <DateInput
                className='is-expanded'
                disabled={!formData['code']}
                name='eventDate'
                max={TODAY}
                min={LAST_MONDAY}
                value={formData['eventDate']}
                error={errors['eventDate']}
                handleChange={handleChange}
              />
              <TextAreaInput
                className='mt-2'
                name='description'
                value={formData['description']}
                error={errors['description']}
                handleChange={handleChange}
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
                handleChange={handleChange}
                error={errors['classcodes']}
                value={formData['classcodes']}
                disabled={!formData['code']}
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
                error={errors['regnos']}
                handleChange={handleChange}
                value={formData['regnos']}
                disabled={!formData['classcodes'].length}
              >
                {formData.classcodes.length
                  ? students
                      .filter((student) =>
                        formData.classcodes.includes(student.classcode)
                      )
                      .map((student) => {
                        const displayName = getDisplayName(student)
                        return (
                          <option value={student.regno} key={student.regno}>
                            {displayName}
                          </option>
                        )
                      })
                  : null}
              </MultiSelectInput>
            </div>
          </div>
        </div>
        <p className='is-info help'>
          To select / deselect multiple classes or students, press and hold down
          Ctrl (Window) or ⌘ (macOS) key and click the items.
        </p>
        <div className='tags'>
          {students
            .filter(({ regno }) => {
              return formData.regnos
                .map((regno) => parseInt(regno))
                .includes(regno)
            })
            .map((student) => {
              const { regno } = student
              const displayName = getDisplayName(student)
              return (
                <span className='tag is-warning' key={regno}>
                  <span>{displayName}</span>
                  <button
                    className='delete is-small'
                    onClick={() => removeSelectedStudent(regno)}
                  ></button>
                </span>
              )
            })}
        </div>
      </div>
      <div className='field is-horizontal'>
        <div className='field-body'>
          <div id='buttonGroup' className='field is-grouped'>
            <p className='control'>
              <input
                className='button is-info'
                type='submit'
                value='Submit'
                onClick={_.throttle(handleSubmit, 1000)}
                disabled={isDisable}
              />
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
