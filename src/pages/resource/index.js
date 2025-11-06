import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import _ from 'lodash'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import ConfirmButton from '@/components/form/confirmButton'
import { TODAY } from '@/config/constant'
import { validateForm } from '@/utils/formValidation' // Import the validation function

import Instruction from './components/instruction'
import Availability from './components/availability'
import SelectResourceType from './components/selectResourceType'
import SelectResource from './components/selectResource'
import ResourceInfo from './components/resourceInfo'
import Calendar from './components/calendar'
import TitleInput from './components/titleInput'
import DescriptionInput from './components/descriptionInput'
import SetupInput from './components/setupInput'
import DateTimeInput from './components/dateTimeInput'
import RecurrenceInput from './components/recurrenceInput'
import EmailInput from './components/emailInput'

const Resource = () => {
  const { data: session, status } = useSession()

  const defaultFormData = {
    resourceType: '',
    resourceEmail: '',
    picEmail: session.user.email,
    title: '',
    description: '',
    startTime: `${TODAY}T15:45`,
    endTime: '18:00',
    requireJanitor: false,
    rruleType: '',
    rruleFreq: '',
    rruleValue: ''
  }
  const [resources, setResources] = useState({})
  const [selectedResource, setSelectedResource] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const [formData, setFormData] = useState({ ...defaultFormData })
  const [errors, setErrors] = useState({})
  const calendarRef = useRef(null)
  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    setErrorMessage,
    setLoadingMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  const validationRules = {
    resourceType: { required: true },
    resourceEmail: { required: true },
    title: { required: true },
    description: { required: true },
    picEmail: { requird: true, email: true },
    rruleValue: {
      custom({ rruleType, rruleFreq, rruleValue }, field) {
        if (rruleType && rruleValue == '') return 'Required'
      }
    },
    rruleFreq: {
      custom({ rruleType, rruleFreq, rruleValue }, field) {
        if (
          (rruleType == 'REPEAT_COUNT' || rruleType == 'REPEAT_UNTIL') &&
          rruleFreq == ''
        )
          return 'Required'
      }
    }
  }

  const handleChange = (e) => {
    let { name, value, options, type } = e.target

    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value } // Update the formData object

      // reset rruleValue and rruleFreq when reselect rruleType
      if (name == 'rruleType') {
        newFormData['rruleFreq'] = ''
        newFormData['rruleValue'] = ''
      }

      // Handle multi-select for target
      if (options) {
        const selectedOptions = Array.from(options).filter((o) => o.selected)
        if (name === 'target' && selectedOptions.length !== 0) {
          newFormData.target = selectedOptions.map((o) => o.value).join(',')
        }
      }

      if (type == 'checkbox') {
        newFormData.requireJanitor = !formData.requireJanitor
        newFormData.description = newFormData.requireJanitor
          ? '- 請安排工友開燈\n- 如溫度高於22度，請安排開冷氣'
          : ''
      }

      if (type == 'number') {
        newFormData[name] = parseInt(value)
      }

      const validationErrors = validateForm(newFormData, validationRules)
      setErrors(validationErrors)
      setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation

      return newFormData // Return the updated formData
    })
  }

  const handleSubmit = async () => {
    try {
      setLoadingMessage()
      const response = await fetch('/api/calendars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, ...selectedResource })
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.error)
      }
      const { resourceType, resourceEmail, picEmail, startTime, endTime } =
        formData

      setFormData(
        Object.assign({}, defaultFormData, {
          resourceType,
          resourceEmail,
          picEmail,
          startTime,
          endTime
        })
      )
      calendarRef.current.src += ''
      clearMessage()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  useEffect(() => {
    const found = resources[formData.resourceType]?.find(
      ({ resourceEmail }) => resourceEmail == formData?.resourceEmail
    )
    if (found) {
      setSelectedResource({ ...found })
    }
  }, [formData.resourceEmail, formData.resourceType, resources])

  const getResources = async () => {
    setLoadingMessage()
    try {
      const response = await fetch('/api/resources/list')
      const data = await response.json()
      const excludedResources = [
        'Visual Art Room 1',
        'Visual Art Room 2',
        'Music Room',
        'Biology Lab',
        'Physics Lab',
        'Chemistry Lab',
        'IS Lab',
        'Computer Room',
        'Geography Room'
      ]
      setResources(
        _.groupBy(
          data.items.filter(
            ({ resourceName }) => !excludedResources.includes(resourceName)
          ),
          'resourceType'
        )
      )
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      clearMessage()
    }
  }

  useEffect(() => {
    getResources()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h1 className='title has-text-centered'>Resource Booking</h1>
      <Notification
        className={notification.className}
        message={notification.message}
      />

      <Instruction />
      <Availability
        resourceType={formData.resourceType}
        startTime={formData.startTime}
        endTime={formData.endTime}
        handleChange={handleChange}
        resources={resources[formData.resourceType]}
        onSelectResource={(email) => {
          handleChange({ target: { name: 'resourceEmail', value: email } })
        }}
      />
      <ResourceInfo resource={selectedResource} />
      <Calendar ref={calendarRef} selectedResource={selectedResource} />

      <SelectResourceType
        types={Object.keys(resources)}
        name='resourceType'
        handleChange={handleChange}
        value={formData.resourceType}
        error={errors.resourceType}
      />
      <SelectResource
        resources={resources[formData.resourceType]}
        value={formData.resourceEmail}
        name='resourceEmail'
        handleChange={handleChange}
        error={errors.resourceEmail}
      />
      {formData.resourceEmail ? (
        <>
          <TitleInput
            name='title'
            value={formData.title}
            error={errors.title}
            handleChange={handleChange}
          />
          <EmailInput
            name='picEmail'
            userInit={session.user.info?.initial}
            value={formData.picEmail}
            error={errors.picEmail}
            handleChange={handleChange}
          />
          <SetupInput
            name='requireJanitor'
            value={formData.requireJanitor}
            handleChange={handleChange}
          />
          <DescriptionInput
            name='description'
            value={formData.description}
            error={errors.description}
            handleChange={handleChange}
          />
          <DateTimeInput
            startTime={formData.startTime}
            endTime={formData.endTime}
            error={errors.description}
            handleChange={handleChange}
          />
          <RecurrenceInput
            handleChange={handleChange}
            formData={formData}
            errors={errors}
          />
          <ConfirmButton isDisabled={isDisabled} handleSubmit={handleSubmit} />
        </>
      ) : null}
    </>
  )
}

export default Resource
