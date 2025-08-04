import { useState, useEffect } from 'react'
import CheckboxInput from '@/components/form/checkboxInput'
import { inputMapper } from '@/components/form/inputMapper'

import { getDisplayName } from '@/lib/helper'
import { validateForm } from '@/utils/formValidation' // Import the validation function

export default function EditParticipants({
  selectedParticipants,
  setIsEditParticipants,
  notifier,
  tableRef
}) {
  const [actions, setActions] = useState([])
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const [validationRules, setValidationRules] = useState({})
  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notifier

  const AWARD_TYPES = [
    { key: 'SCHOLARSHIP', title: 'Scholarship' },
    { key: 'CERTIFICATE', title: 'Certificate' },
    { key: 'TROPHY', title: 'Trophy' },
    { key: 'MEDAL', title: 'Medal' },
    { key: 'PLAQUE', title: 'Plaque' },
    { key: 'OTHER', title: 'Other' }
  ]

  const AWARD_STATUSES = [
    { key: 'RECEIVED', title: 'Received' },
    { key: 'WAITING', title: 'Waiting' }
  ]

  const elements = [
    { value: 'UPDATE_ROLE', title: 'Role' },
    { value: 'UPDATE_START_DATE', title: 'Start Date' },
    { value: 'UPDATE_END_DATE', title: 'End Date' },
    { value: 'UPDATE_ACHIEVEMENT', title: 'Achievement' },
    { value: 'UPDATE_HOURS', title: 'Hours' },
    { value: 'UPDATE_HIGHLIGHT', title: 'A Highlight for school' },
    { value: 'UPDATE_AWARD_NAME', title: 'Award Name' },
    { value: 'UPDATE_AWARD_TYPE', title: 'Award Type' },
    { value: 'UPDATE_AWARD_STATUS', title: 'Award Status' },
    { value: 'UPDATE_PRIZE_GIVING', title: 'Prize Giving' },
    { value: 'DELETE', title: 'Delete selected participants' }
  ]

  const handleSelectAction = (e) => {
    const { name, value, type, options } = e.target

    setActions((prevActions) => {
      if (value == 'DELETE') return ['DELETE']

      const newActions = prevActions.filter((a) => a != 'DELETE')

      if (newActions.includes(value)) {
        return newActions.filter((a) => a != value)
      }

      return [...newActions, value]
    })
  }

  const handleChange = (e) => {
    const { name, value, options, type } = e.target

    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value } // Update the formData object

      if (name == 'isHighlight' || name == 'isAward') {
        newFormData[name] = value == 'true'
      }

      if (name == 'hours') {
        newFormData[name] = parseFloat(value)
      }

      updateErrorsAndIsDisable(newFormData, actions)
      return newFormData // Return the updated formData
    })
  }

  const updateErrorsAndIsDisable = (formData, actions) => {
    console.log(actions)
    if (actions.filter((a) => a !== 'DELETE').length == 0) {
      setIsDisabled(true)
      setErrors({})
      return
    }
    const validationErrors = validateForm(formData, validationRules)
    setErrors(validationErrors)
    setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation
  }

  const handleSubmit = async () => {
    const rangeObjects = selectedParticipants.map((rowObj) => {
      return Object.keys(rowObj).reduce((prev, key) => {
        if (key in formData) {
          prev[key] = formData[key]
          return prev
        }
        prev[key] = rowObj[key]
        return prev
      }, {})
    })

    try {
      setLoadingMessage()
      const response = await fetch('/api/ole/participants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rangeObjects })
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }
      setSuccessMessage(`${result.totalUpdatedRows} records are updated`)
      tableRef.current?.dt().ajax.reload()
      tableRef.current.scrollTop = tableRef.current?.scrollHeight

      setActions([])
      setFormData({})
      setErrors({})
      setIsDisabled(true)
      setValidationRules({})
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleDelete = async () => {
    const ranges = selectedParticipants.map(({ range }) => range)
    try {
      setLoadingMessage()
      const response = await fetch('/api/ole/participants', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ranges })
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }
      setSuccessMessage(
        `${result.clearedParticipantRanges.length} records are deleted`
      )
      tableRef.current?.dt().ajax.reload()
      tableRef.current.scrollTop = tableRef.current?.scrollHeight

      setActions([])
      setFormData({})
      setErrors({})
      setIsDisabled(true)
      setValidationRules({})
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  useEffect(() => {
    updateErrorsAndIsDisable(formData, actions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationRules])

  useEffect(() => {
    const mappers = {
      UPDATE_ROLE: {
        name: 'role',
        defaultValue: '',
        rules: { required: true }
      },
      UPDATE_START_DATE: {
        name: 'startDate',
        defaultValue: '',
        rules: { required: true }
      },
      UPDATE_END_DATE: {
        name: 'endDate',
        defaultValue: ''
      },
      UPDATE_ACHIEVEMENT: {
        name: 'achievement',
        defaultValue: ''
      },
      UPDATE_HOURS: {
        name: 'hours',
        defaultValue: 1,
        rules: { required: true }
      },
      UPDATE_HIGHLIGHT: {
        name: 'isHighlight',
        defaultValue: true
      },
      UPDATE_AWARD_NAME: {
        name: 'awardName',
        defaultValue: ''
      },
      UPDATE_AWARD_TYPE: {
        name: 'awardType',
        defaultValue: ''
      },
      UPDATE_AWARD_STATUS: {
        name: 'awardStatus',
        defaultValue: ''
      },
      UPDATE_PRIZE_GIVING: {
        name: 'isAward',
        defaultValue: true
      }
    }
    const updateFormDataKey = () => {
      Object.keys(mappers).forEach((action) => {
        const { name, defaultValue, rules } = mappers[action]

        if (rules) {
          setValidationRules((prev) => {
            const newRules = { ...prev }
            if (actions.includes(action)) {
              if (name in newRules) return newRules
              newRules[name] = rules
              return newRules
            }

            delete newRules[name]
            return newRules
          })
        }

        setFormData((prevForm) => {
          let newForm = { ...prevForm }
          if (actions.includes(action)) {
            if (!(name in newForm)) {
              newForm[name] = defaultValue
            }
          } else {
            delete newForm[name]
          }

          updateErrorsAndIsDisable(newForm, actions)
          return newForm
        })
      })
    }

    updateFormDataKey()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions])

  const inputInfoMapper = {
    UPDATE_ROLE: { type: 'text', name: 'role' },
    UPDATE_START_DATE: { type: 'date', name: 'startDate' },
    UPDATE_END_DATE: { type: 'date', name: 'endDate' },
    UPDATE_ACHIEVEMENT: { type: 'text', name: 'achievement' },
    UPDATE_HOURS: { type: 'number', name: 'hours', options: { min: 1 } },
    UPDATE_HIGHLIGHT: {
      type: 'radio',
      name: 'isHighlight',
      options: {
        elements: [
          { value: true, title: 'Yes' },
          { value: false, title: 'No' }
        ]
      }
    },
    UPDATE_AWARD_NAME: { type: 'text', name: 'awardName' },
    UPDATE_AWARD_TYPE: {
      type: 'select',
      name: 'awardType',
      children: AWARD_TYPES.map(({ key, title }) => {
        return (
          <option key={key} value={key}>
            {title}
          </option>
        )
      }),
      options: { placeholder: 'Please select' }
    },
    UPDATE_AWARD_STATUS: {
      type: 'select',
      name: 'awardStatus',
      children: AWARD_STATUSES.map(({ key, title }) => {
        return (
          <option key={key} value={key}>
            {title}
          </option>
        )
      }),
      options: { placeholder: 'Please select' }
    },
    UPDATE_PRIZE_GIVING: {
      type: 'radio',
      name: 'isAward',
      options: {
        elements: [
          { value: true, title: 'Yes' },
          { value: false, title: 'No' }
        ]
      }
    }
  }

  return (
    <div className='box'>
      <div className='notification is-size-5 is-link'>Edit Participants</div>

      <div className='field is-horizontal'>
        <div className='field-label'>
          <label className='label'>Update</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <CheckboxInput
              elements={elements}
              name='action'
              handleChange={handleSelectAction}
              selectedBoxes={actions}
            />
          </div>
        </div>
      </div>

      {elements.map(({ value, title }, index) => {
        if (!actions.includes(value) || !inputInfoMapper[value]) return null
        const formInfo = { formData, errors, handleChange }
        const inputInfo = inputInfoMapper[value]

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

      {actions.includes('DELETE') ? (
        <>
          <h1 className='title'>Delete following participants</h1>
          <div className='tags'>
            {selectedParticipants.map((p, index) => {
              return (
                <span className='tag' key={index}>
                  {getDisplayName(p)}
                </span>
              )
            })}
          </div>
        </>
      ) : null}

      <div className='field is-horizontal'>
        <div className='field-label'></div>
        <div className='field-body'>
          <div className='field'>
            <div className='field is-grouped'>
              {actions.includes('DELETE') ? (
                <button className='button is-danger' onClick={handleDelete}>
                  Confirm
                </button>
              ) : (
                <button
                  className='button is-danger'
                  disabled={isDisabled}
                  onClick={handleSubmit}
                >
                  Save changes
                </button>
              )}
              <button
                className='button is-info'
                onClick={() => {
                  setActions([])
                  setIsEditParticipants(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
