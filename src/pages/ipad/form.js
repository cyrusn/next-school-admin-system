import { useStudentsContext } from '@/context/studentContext'
import { useState, useEffect } from 'react'
import IpadNav from './nav.js'
import { getDisplayName, getTimestamp } from '@/lib/helper'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import { inputMapper } from '@/components/form/inputMapper'
import { createRecordsInputInfoMapper } from '@/lib/ipad/createRecordInputMapper'
import { throttle } from 'lodash'

export default function IpadForm() {
  const [records, setRecords] = useState([])
  const [isClicked, setIsClicked] = useState(false)

  const { students } = useStudentsContext()
  const { data: session } = useSession()
  const { initial } = session?.user?.info
  const [notification, setNotification] = useState({ ...defaultNotification })
  const router = useRouter() // Get the current route

  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  async function fetchRecords() {
    try {
      const response = await fetch('/api/ipad')
      if (!response.ok) throw new Error('Fail to fetch ipad data')
      const records = await response.json()
      setRecords(records)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  const defaultFormData = {
    regnos: [],
    classcodes: []
  }

  const [formData, setFormData] = useState({ ...defaultFormData })

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

      return newFormData // Return the updated formData
    })
  }

  const inputInfoMappers = createRecordsInputInfoMapper(
    formData,
    students,
    records,
    initial
  )

  const handleSubmit = async () => {
    setIsClicked(true)
    setLoadingMessage()
    try {
      const { regnos } = formData
      const postRegnos = []
      const putRangeObjects = []

      regnos.forEach((regno) => {
        const found = records.find((r) => r.regno == String(regno))
        if (found) {
          putRangeObjects.push(found)
        } else {
          postRegnos.push(parseInt(regno))
        }
      })

      const postResponse = await fetch('/api/ipad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          students: students.filter((s) => postRegnos.includes(s.regno)),
          initial
        })
      })

      const putResponse = await fetch('/api/ipad', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rangeObjects: putRangeObjects.map((rangeObject) => {
            const { freq } = rangeObject
            rangeObject.freq += 1
            rangeObject[`teacher_${freq + 1}`] = initial
            rangeObject.status = 'PENDING'
            rangeObject.timestamp = getTimestamp()
            return rangeObject
          })
        })
      })

      if (!postResponse.ok) {
        throw new Error(result)
      }
      if (!putResponse.ok) {
        throw new Error(result)
      }

      setIsClicked(false)
      setFormData({ ...defaultFormData })
      setSuccessMessage('Data submitted successfully', () => {
        router.push('/ipad/record')
      })
    } catch (e) {
      setIsClicked(false)
      setErrorMessage(JSON.stringify(e, null, '\t'))
    }
  }

  return (
    <>
      <IpadNav />

      <Notification {...notification} />
      {records.length > 0 && (
        <>
          {Object.keys(inputInfoMappers).map((key, index) => {
            const inputInfo = inputInfoMappers[key]
            const formInfo = { formData, handleChange }
            const input = inputMapper(formInfo, inputInfo)

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
              <div className='field tags'>
                {students
                  .filter((s) => formData.regnos.includes(String(s.regno)))
                  .map((s, key) => {
                    return (
                      <span className='tag is-warning' key={key}>
                        {getDisplayName(s)}
                      </span>
                    )
                  })}
              </div>
            </div>
          </div>
          <div className='field is-horizontal'>
            <div className='field-label'></div>
            <div className='field-body'>
              <div className='field'>
                <button
                  className='button is-info'
                  onClick={throttle(handleSubmit, 1000)}
                  disabled={formData.regnos?.length == 0 || isClicked}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
