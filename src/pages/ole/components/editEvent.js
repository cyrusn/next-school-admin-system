import CheckboxInput from '@/components/form/checkboxInput'
import { useState, useEffect } from 'react'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { inputMapper } from '@/components/form/inputMapper'
import { useUsersContext } from '@/context/usersContext'
import {
  inputInfoMapper,
  mappers,
  elements
} from '@/lib/ole/editEventInputMapper'

export default function EditModal({
  selectedEvent,
  notifier,
  setIsEditEvent,
  fetchEvents
}) {
  const [actions, setActions] = useState([])
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const [validationRules, setValidationRules] = useState({})
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } = notifier
  const { users } = useUsersContext()

  const handleSelectAction = (e) => {
    const { value } = e.target

    setActions((prevActions) => {
      const newActions = prevActions.filter((a) => a != 'DELETE')

      if (value == 'DELETE') {
        if (actions.includes('DELETE')) return newActions
        return ['DELETE']
      }

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

      if (options) {
        const selectedOptions = Array.from(options).filter((o) => o.selected)
        if (type == 'select-multiple' && selectedOptions.length !== 0) {
          newFormData[name] = selectedOptions.map((o) => o.value)
        }
      }

      updateErrorsAndIsDisable(newFormData, actions)
      return newFormData // Return the updated formData
    })
  }

  const handleSubmit = async () => {
    const rangeObject = Object.keys(selectedEvent).reduce((prev, key) => {
      let value
      if (key in formData) {
        value = formData[key]
      } else {
        value = selectedEvent[key]
      }

      prev[key] = Array.isArray(value) ? value.join(',') : value
      return prev
    }, {})
    try {
      setLoadingMessage()
      const response = await fetch(`/api/ole/events`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rangeObjects: [rangeObject] })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error)
      }
      setSuccessMessage(`Record is updated`)
      fetchEvents()
      setIsEditEvent(false)

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
    // console.log(selectedEvent)
    // console.log('delete')

    const { range, eventId, imageFolderUrl } = selectedEvent
    try {
      setLoadingMessage()
      const response = await fetch(`/api/ole/events`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ranges: [range], eventId, imageFolderUrl })
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error)
      }
      setSuccessMessage(`Record is updated`)
      fetchEvents()
      setIsEditEvent(false)

      setActions([])
      setFormData({})
      setErrors({})
      setIsDisabled(true)
      setValidationRules({})
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const updateErrorsAndIsDisable = (formData, actions) => {
    if (actions.filter((a) => a !== 'DELETE').length == 0) {
      setIsDisabled(true)
      setErrors({})
      return
    }
    const validationErrors = validateForm(formData, validationRules)
    setErrors(validationErrors)
    setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation
  }

  useEffect(() => {
    updateErrorsAndIsDisable(formData, actions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationRules])

  useEffect(() => {
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

  return (
    <div className='box'>
      <div className='notification is-size-5 is-link'>Edit Event</div>

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
        if (!actions.includes(value) || !inputInfoMapper(users)[value])
          return null
        const formInfo = { formData, errors, handleChange }
        const inputInfo = inputInfoMapper(users)[value]

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
        <div className='field-label'></div>
        <div className='field-body'>
          <div className='field'>
            <div className='field is-grouped'>
              {actions.includes('DELETE') ? (
                <button className='button is-danger' onClick={handleDelete}>
                  Delete
                </button>
              ) : null}
              <button
                className='button is-warning'
                disabled={isDisabled}
                onClick={handleSubmit}
              >
                Save changes
              </button>
              <button
                className='button is-info'
                onClick={() => {
                  setActions([])
                  setIsEditEvent(false)
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
