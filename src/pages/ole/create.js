import { useUsersContext } from '@/context/usersContext'
import OleNav from './components/oleNav'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import { inputMapper } from '@/components/form/inputMapper'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { createEventInputInfoMapper } from '@/lib/ole/createEventInputMapper'
import { useRouter } from 'next/router'

const OleCreate = () => {
  const { data: session } = useSession()
  const { users } = useUsersContext()
  const { initial: INITIAL } = session.user.info
  const router = useRouter() // Get the current route

  const defaultFormData = {
    title: '',
    description: '',
    objective: '',
    pics: [INITIAL],
    components: [],
    category: '',
    committeeAndKla: '',
    isOrganizedBySchool: false,
    organization: ''
  }

  const [formData, setFormData] = useState({ ...defaultFormData })
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)

  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  const handleChange = (e) => {
    const { name, value, options, type } = e.target

    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value } // Update the formData object

      if (name == 'isOrganizedBySchool') {
        if (value == 'true') {
          newFormData.organization = '本校'
          newFormData.isOrganizedBySchool = true
        } else {
          newFormData.organization = ''
          newFormData.isOrganizedBySchool = false
        }
      }

      if (options) {
        const selectedOptions = Array.from(options).filter((o) => o.selected)
        if (type == 'select-multiple' && selectedOptions.length !== 0) {
          newFormData[name] = selectedOptions.map((o) => o.value)
        }
      }

      const validationRules = {
        title: { required: true, weekday: true },
        description: { required: true },
        objective: { required: true },
        pics: { required: true },
        components: { required: true },
        category: { required: true },
        committeeAndKla: { required: true },
        organization: { required: true }
      }

      const validationErrors = validateForm(newFormData, validationRules)
      setErrors(validationErrors)
      setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation
      return newFormData // Return the updated formData
    })
  }

  const handleSubmit = async () => {
    setLoadingMessage()
    setIsDisabled(true)

    const response = await fetch('/api/ole/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formData })
    })

    setFormData({ ...defaultFormData })
    setErrors({})

    const result = await response.json()
    setIsDisabled(false)

    if (!response.ok) {
      setErrorMessage(`Failed to submit data: ${result.error}`)
      return
    }

    setSuccessMessage(
      `Data submitted successfully: ${JSON.stringify(result)}`,
      () => router.push('/ole/event')
    )
  }

  const inputInfoMappers = createEventInputInfoMapper(users)

  return (
    <>
      <OleNav />
      <Notification {...notification} />
      {Object.keys(inputInfoMappers).map((key, index) => {
        const inputInfo = inputInfoMappers[key]
        const formInfo = { formData, errors, handleChange }
        const input = inputMapper(formInfo, inputInfo)

        return (
          <div className='field is-horizontal' key={index}>
            <div className='field-label'>
              <label className='label'>{inputInfo.title}</label>
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
            <button
              className='button is-info'
              disabled={isDisabled}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OleCreate
