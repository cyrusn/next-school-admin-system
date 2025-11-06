import { createParticipantsInputInfoMapper } from '@/lib/ole/createParticipantsInputMapper'
import { inputMapper } from '@/components/form/inputMapper'
import { useStudentsContext } from '@/context/studentContext'
import { useState } from 'react'
import { TODAY, TERM } from '@/config/constant'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { getTimestamp } from '@/lib/helper'

export default function AddParticipants({ notifier, tableRef, selectedEvent }) {
  // const { data: session, status } = useSession()
  const { students } = useStudentsContext()
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } = notifier

  const defaultFormData = {
    regnos: [],
    startDate: TODAY,
    endDate: TODAY,
    term: TERM,
    hours: 0,
    role: '',
    achievement: '',
    isHighlight: false,
    isAward: false,
    awardName: '',
    awardType: '',
    awardStatus: '',
    classcodes: []
  }
  const [formData, setFormData] = useState({ ...defaultFormData })

  const handleChange = (e) => {
    const { name, value, options, type } = e.target
    console.log(value, type)

    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value } // Update the formData object

      if (options) {
        const selectedOptions = Array.from(options).filter((o) => o.selected)
        if (type == 'select-multiple' && selectedOptions.length !== 0) {
          newFormData[name] = selectedOptions.map((o) => o.value)
        }
      }

      if (type == 'radio') {
        newFormData[name] = value == 'true'
      }

      if (type == 'number') {
        newFormData[name] = parseInt(value)
      }

      const validationRules = {
        regnos: { nonEmpty: true },
        startDate: { required: true },
        term: { nonZero: true },
        hours: { nonZero: true },
        role: { required: true },
        classcodes: { nonEmpty: true }
      }

      const validationErrors = validateForm(newFormData, validationRules)
      setErrors(validationErrors)
      // console.log(errors)
      setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation
      return newFormData // Return the updated formData
    })
  }
  const onAddParticipants = async () => {
    console.log(formData)
    const { eventId } = selectedEvent
    const {
      regnos,
      startDate,
      endDate,
      term,
      hours,
      role,
      achievement,
      isHighlight,
      isAward,
      awardName,
      awardType,
      awardStatus
    } = formData

    const timestamp = getTimestamp()

    const rows = students
      .filter((s) => regnos.includes(String(s.regno)))
      .map((s) => {
        const { ename, cname, classcode, classno, regno } = s

        const name = cname || ename
        return [
          eventId,
          regno,
          classcode,
          classno,
          name,
          startDate,
          endDate,
          term,
          role,
          achievement,
          hours,
          isHighlight,
          isAward,
          awardName,
          awardType,
          awardStatus,
          timestamp
        ]
      })

    try {
      setLoadingMessage()
      const response = await fetch('/api/ole/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rows })
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }
      setSuccessMessage(`${result?.updates?.updatedRows} records are updated`)
      tableRef.current?.dt().ajax.reload()
      tableRef.current.scrollTop = tableRef.current?.scrollHeight

      setFormData({ ...defaultFormData })
      setErrors({})
      setIsDisabled(true)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const inputInfoMapper = createParticipantsInputInfoMapper(formData, students)

  return (
    <>
      {inputInfoMapper.map((inputInfo, index) => {
        const formInfo = { formData, errors, handleChange }
        const { title, doms } = inputInfo
        if (doms) {
          return (
            <div className='field is-horizontal' key={index}>
              <div className='field-label'>
                <label className='label'>{title}</label>
              </div>
              <div className='field-body'>
                {doms.map((dom, n) => {
                  const input = inputMapper(formInfo, dom)
                  return (
                    <div className='field' key={n}>
                      {input}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }

        const input = inputMapper(formInfo, inputInfo)

        return (
          <div className='field is-horizontal' key={index}>
            <div className='field-label'>
              <label className='label'>{title}</label>
            </div>
            <div className='field-body'>
              <div className='field'>{input}</div>
            </div>
          </div>
        )
      })}

      <div className='field is-horizontal'>
        <div className='field-label'>
          <label className='label'></label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <button
              className='button is-info'
              disabled={isDisabled}
              onClick={onAddParticipants}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
