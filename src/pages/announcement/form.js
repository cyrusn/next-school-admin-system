import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { DateTime } from 'luxon'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { TIMEZONE } from '@/config/constant'

const EXCLUDED_DATES = process.env['NEXT_PUBLIC_ANNOUNCEMENT_EXCLUDED_DATES']
  .split(',')
  .map((s) => {
    const [date, reason] = s.split(':')
    return { date, reason }
  })

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import AnnoucnementNav from './components/nav'
import DataTag from './components/form/date'
import From from './components/form/from'
import TargetType from './components/form/targetType'
import Target from './components/form/target'
import AnnouncedBy from './components/form/announcedBy'
import Content from './components/form/target/content'
import ConfirmButton from '@/components/form/confirmButton'

export default function FormPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const TIMEZONE = 'Asia/Hong_Kong'
  const now = DateTime.now().setZone(TIMEZONE)

  const minDate = () => {
    let dt =
      now.weekday === 0 ? now.plus({ hours: 39 }) : now.plus({ hours: 15 })

    while (dt.weekday === 6 || dt.weekday === 7) {
      dt = dt.plus({ days: 1 })
    }
    return dt.toFormat('yyyy-MM-dd')
  }

  const defaultFormDataState = {
    date: minDate(),
    from: '',
    targetType: 0,
    target: 'all',
    announcedBy: 0,
    content: ''
  }

  const [formData, setFormData] = useState({ ...defaultFormDataState })
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)
  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    setErrorMessage,
    setLoadingMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  const handleChange = (e) => {
    const { name, value, options, type } = e.target

    setFormData((prevData) => {
      const newFormData = { ...prevData, [name]: value } // Update the formData object

      // Handle multi-select for target
      if (options) {
        const selectedOptions = Array.from(options).filter((o) => o.selected)
        if (type == 'select-multiple' && selectedOptions.length !== 0) {
          newFormData[name] = selectedOptions.map((o) => o.value)
        }
      }

      // Additional logic for other fields
      if (name === 'targetType') {
        newFormData.targetType = parseInt(value)

        if (parseInt(value) == 0) {
          newFormData.target = 'all'
        } else if (parseInt(value) == 2) {
          newFormData.target = []
        } else {
          newFormData.target = ''
        }
      }

      if (name === 'announcedBy') {
        newFormData.announcedBy = parseInt(value)
        newFormData.content = ''
      }

      if (name === 'announcedBy' && parseInt(value) == 1) {
        newFormData.announcedBy = parseInt(value)
        const { name, cname, title } = session.user.info
        newFormData.content = `由${cname || name}${title}自行宣佈`
      }

      // Validate the form after updating formData
      const validationRules = {
        date: {
          required: true,
          weekday: true,
          custom({ date }, field) {
            const found = EXCLUDED_DATES.find((e) => {
              const eDateDT = DateTime.fromISO(e.date)
              const cDateDT = DateTime.fromISO(date)
              return eDateDT.hasSame(cDateDT, 'day')
            })

            if (found)
              return `No announcements on ${found.date} (${found.reason})`
          }
        },
        from: { required: true },
        target: { required: true },
        content: { required: true }
      }

      const validationErrors = validateForm(newFormData, validationRules)
      setErrors(validationErrors)
      setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation

      return newFormData // Return the updated formData
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Prevent default form submission
    if (isDisabled) {
      setErrorMessage('Invalid data in form')
      return
    }

    setLoadingMessage()

    try {
      const timestamp = now.toFormat("yyyy-MM-dd'T'HH:mm:ss")
      const { date, from, targetType, target, announcedBy, content } = formData
      const pic = session.user.info.initial // Assuming this is part of your session
      const values = [
        [
          timestamp,
          date,
          pic,
          from,
          targetType,
          Array.isArray(target) ? target.join(',') : target,
          announcedBy,
          content
        ]
      ]
      const range = 'A1:I' // Specify your range

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ range, values })
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error)
      }

      setSuccessMessage(
        `Data submitted successfully: ${JSON.stringify(result)}`,
        () => {
          router.push('/announcement/record')
        }
      )
      setFormData({ ...defaultFormDataState })

      // Clear form fields
    } catch (error) {
      setErrorMessage(`Failed to submit data: ${error.message}`)
    }
  }

  return (
    <>
      <AnnoucnementNav />
      <Notification {...notification} />
      <form id='form'>
        <DataTag {...{ formData, errors, handleChange, min: minDate() }} />
        <From {...{ formData, errors, handleChange }} />
        <TargetType {...{ formData, errors, handleChange }} />
        <Target {...{ formData, errors, handleChange }} />
        <AnnouncedBy {...{ formData, errors, handleChange }} />
        <Content {...{ formData, errors, handleChange }} />
        <ConfirmButton isDisabled={isDisabled} handleSubmit={handleSubmit} />
      </form>
    </>
  )
}
