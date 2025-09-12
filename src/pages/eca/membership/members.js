import Nav from './components/nav.js'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useStudentsContext } from '@/context/studentContext.js'
import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'
import { inputMapper } from '@/components/form/inputMapper'
import { validateForm } from '@/utils/formValidation' // Import the validation function
import { createMembersInputInfoMapper } from '@/lib/eca/createMembersInputMapper'
import { useRouter } from 'next/router'
import NoClubAndTeamMessage from '../components/noClubAndTeamMessage'

const EcaMembers = () => {
  const { students } = useStudentsContext()
  const { data: session } = useSession()
  const { initial } = session?.user?.info
  const [clubs, setClubs] = useState([])
  const [notification, setNotification] = useState({ ...defaultNotification })
  const {
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    clearMessage
  } = notificationWrapper(setNotification)

  const fetchClubsInformation = async () => {
    setLoadingMessage()
    try {
      const response = await fetch('/api/eca/clubs')
      if (!response.ok) throw new Error('Fail to fetch clubs data')
      const clubs = await response.json()
      setClubs(clubs)
      clearMessage()
    } catch (e) {
      setErrorMessage(JSON.stringify(e, null, '\t'))
    }
  }

  const router = useRouter() // Get the current route

  const defaultFormData = {
    clubId: '',
    regnos: [],
    classcodes: []
  }

  const [formData, setFormData] = useState({ ...defaultFormData })
  const [errors, setErrors] = useState({})
  const [isDisabled, setIsDisabled] = useState(true)

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
        regnos: { nonEmpty: true },
        clubId: { required: true }
      }

      const validationErrors = validateForm(newFormData, validationRules)
      setErrors(validationErrors)
      setIsDisabled(Object.keys(validationErrors).length > 0) // Update disabled state based on validation
      return newFormData // Return the updated formData
    })
  }

  useEffect(() => {
    fetchClubsInformation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async () => {
    setLoadingMessage()
    setIsDisabled(true)
    try {
      const club = clubs.find(({ id }) => formData.clubId == id)

      const selectedStudents = students.filter(({ regno }) => {
        return formData.regnos.includes(String(regno))
      })
      const response = await fetch('/api/eca/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          students: selectedStudents,
          club
        })
      })

      setFormData({ ...defaultFormData })
      setErrors({})
      setIsDisabled(false)

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result)
      }

      setSuccessMessage(`${result?.updates?.updatedRows} records are updated`)
      setFormData({ ...defaultFormData })
    } catch (e) {
      setErrorMessage(JSON.stringify(e, null, '\t'))
    }
  }

  const filteredClubs = clubs.filter((club) => {
    const { pic, associates, admininstrators } = club
    const relatedTeachers = [
      ...pic?.split(','),
      ...associates?.split(','),
      ...admininstrators?.split(',')
    ]
    return relatedTeachers.includes(initial)
  })

  const inputInfoMappers = createMembersInputInfoMapper(
    formData,
    students,
    filteredClubs
  )

  if (clubs.length == 0) {
    return (
      <>
        <Nav />
        <Notification {...notification} />
      </>
    )
  }

  if (filteredClubs.length == 0) {
    return (
      <>
        <Nav />
        <NoClubAndTeamMessage />
      </>
    )
  }

  return (
    <>
      <Nav />
      <Notification {...notification} />
      <div className='notification is-warning is-light'>
        <button className='delete'></button>
        <div className='content '>
          <p>
            各學會負責老師須於以下表單輸入學會或校隊會員名單。如有疑問，請聯絡吳詠棠老師。
          </p>
          <p className='mb-0'>
            <b>注意事項:</b>
          </p>
          <ol className='mt-0'>
            <li>名單只限舉辦恆常或定期活動的學會或校隊輸入。</li>
            <li>如學會名單有更新，請適時更改。（可在「Record」欄刪改）</li>
            <li>
              如須填寫學生會籍評估表，完成輸入學員名單後，在「Record」欄點選學生名字，按下「UPDATE」鍵進行評估。
            </li>
          </ol>
        </div>
      </div>
      {filteredClubs.length > 0 && (
        <>
          {Object.keys(inputInfoMappers).map((key, index) => {
            const inputInfo = inputInfoMappers[key]
            const formInfo = { formData, errors, handleChange }
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
      )}
    </>
  )
}
export default EcaMembers
