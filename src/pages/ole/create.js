import { useUsersContext } from '@/context/usersContext'
import OleNav from './components/oleNav'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import { COMPONENTS, CATEGORIES, COMMITTEES_AND_KLAS } from '@/config/constant'
import { inputMapper } from '@/components/form/inputMapper'
import { validateForm } from '@/utils/formValidation' // Import the validation function

const OleCreate = () => {
  const { data: session, status } = useSession()
  const { users } = useUsersContext()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objective: '',
    pics: [session.user?.info?.initial],
    components: [],
    category: '',
    committeeAndKla: '',
    organization: ''
  })
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)

  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)
  const { role: ROLE, initial: INITIAL } = session.user.info

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

  const updateErrorsAndIsDisable = (formData) => {
    const validationErrors = validateForm(formData, validationRules)
    setErrors(validationErrors)
    setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation
  }

  const inputInfoMappers = {
    TITLE: {
      title: 'Title',
      type: 'text',
      name: 'title',
      options: { placeholder: 'Title' }
    },
    COMPONENTS: {
      title: 'Components',
      type: 'multi-select',
      name: 'components',
      children: COMPONENTS.map(({ name, code }) => (
        <option key={code} value={code}>
          {name}
        </option>
      )),
      options: {
        placeholder: 'Please select',
        helptext:
          'To select multiple components or categories, press and hold down Ctrl (Window) or ⌘ (macOS) key and click the items.'
      }
    },
    CATEGORY: {
      title: 'Category',
      type: 'select',
      name: 'category',
      children: CATEGORIES.map(({ name, code }) => (
        <option key={code} value={code}>
          {name}
        </option>
      )),
      options: { placeholder: 'Please select' }
    },
    COMMITTEES_AND_KLAS: {
      title: 'committee & KLA',
      type: 'select',
      name: 'committeeAndKla',
      children: COMMITTEES_AND_KLAS.map((name, index) => (
        <option key={index} value={name}>
          {name}
        </option>
      )),
      options: { placeholder: 'Please select' }
    },
    DESCRIPTION: {
      title: 'Description',
      type: 'textarea',
      name: 'description',
      options: { placeholder: 'Description' }
    },
    OBJECTIVE: {
      title: 'Objective',
      type: 'textarea',
      name: 'objective',
      options: { placeholder: 'Objective' }
    },
    EFFICACY: {
      title: 'Efficacy',
      type: 'textarea',
      name: 'efficacy',
      options: {
        placeholder: 'Efficacy',
        helptext: 'Please update this after the event is completed'
      }
    },
    ORGANIZATION: {
      title: 'Organization',
      type: 'text',
      name: 'organization',
      options: {
        placeholder: 'Organization',
        helptext: 'e.g. 本校、香港學界體育聯會、香港學校音樂及朗誦協會 ...'
      }
    },
    PICS: {
      title: 'Pics',
      type: 'multi-select',
      name: 'pics',
      children: users.map(({ initial }) => (
        <option value={initial} key={initial}>
          {initial}
        </option>
      )),
      options: { placeholder: 'Please select' }
    }
  }

  return (
    <>
      <OleNav />
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
    </>
  )
}
export default OleCreate
