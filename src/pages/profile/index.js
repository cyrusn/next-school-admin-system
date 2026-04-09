import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SCHOOL_YEAR } from '@/config/constant'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'

import _ from 'lodash'
import Image from 'next/image'

import { useStudentsContext } from '@/context/studentContext'
import Loading from '@/components/loading'

const TYPE_MAPPER = {
  LEARNING_TRAIT: '學習',
  FAMILY_BACKGROUND: '家庭',
  CLASSROOM_BEHAVIOUR: '課堂表現',
  PEER_RELATIONSHIP: '朋輩關係',
  COUNSELLING: '輔導',
  DISCIPLINE: '訓導',
  LIFE_PLANNING: '生涯規劃',
  OTHERS: '其他'
}

function TypeView({
  groupByTypeComments,
  initial,
  setComments,
  clearMessage,
  setLoadingMessage
}) {
  const onDelete = async (commentId) => {
    setLoadingMessage()
    try {
      const response = await fetch(`/api/profile?id=${commentId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message)
      }
      setComments((prev) => {
        return prev.filter((comment) => comment.commentId !== commentId)
      })
      clearMessage()
    } catch (e) {
      console.error(e)
    }
  }

  return Object.keys(groupByTypeComments).map((type, i) => {
    const comments = groupByTypeComments[type]
    return comments.map((comment, j) => {
      return (
        <div className='mb-2' key={`${i}-${j}`}>
          <h1 className='has-text-weight-bold'>
            <span>{TYPE_MAPPER[type]}</span>
          </h1>
          <p className='pl-4'>
            <span className='mr-2'>{comment.content}</span>
            {comment.createdBy == initial ? (
              <button
                className='delete'
                onClick={() => onDelete(comment.commentId)}
              ></button>
            ) : (
              <></>
            )}
          </p>
        </div>
      )
    })
  })
}

function DisplayComment({
  comments,
  initial,
  setComments,
  clearMessage,
  setLoadingMessage
}) {
  const groupedBySchoolYearAndCreatedByComments = _.groupBy(
    comments,
    ({ schoolYear, createdBy }) => {
      return `${createdBy}@${schoolYear}`
    }
  )

  const keys = Object.keys(groupedBySchoolYearAndCreatedByComments)
  return _.orderBy(keys, [(key) => key.split('@')[1]], ['desc']).map(
    (key, index) => {
      const comments = groupedBySchoolYearAndCreatedByComments[key]
      const groupByTypeComments = _.groupBy(comments, 'type')
      return (
        <div className='message' key={key + index}>
          <div className='message-header'>{key}</div>
          <div className='message-body'>
            <TypeView
              groupByTypeComments={groupByTypeComments}
              initial={initial}
              setComments={setComments}
              clearMessage={clearMessage}
              setLoadingMessage={setLoadingMessage}
            />
          </div>
        </div>
      )
    }
  )
}

function CreateComment({
  regno,
  initial,
  refresh,
  clearMessage,
  setLoadingMessage
}) {
  const defaultComment = {
    type: '',
    content: ''
  }
  const [comment, setComment] = useState({ ...defaultComment })

  const handleSubmit = async () => {
    setLoadingMessage()
    const { type, content } = comment
    const row = [regno, type, content, initial, SCHOOL_YEAR]

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ row })
    })

    const result = await response.json()
    if (!response.ok) {
      console.error(`Failed to submit data: ${result.error}`)
    } else {
      refresh()
      setComment({ ...defaultComment })
      clearMessage()
    }
  }
  const onSelectType = (e) => {
    setComment((prev) => {
      const newContent = { ...prev }
      newContent.type = e.target.value
      return newContent
    })
  }

  const onUpdateComment = (e) => {
    setComment((prev) => {
      const newContent = { ...prev }
      newContent.content = e.target.value
      return newContent
    })
  }

  return (
    <>
      <div className='mb-4'>
        <div className='field'>
          <div className='control'>
            <div className='select is-fullwidth'>
              <select onChange={onSelectType}>
                <option value=''>Please select type</option>

                {Object.keys(TYPE_MAPPER).map((type) => {
                  return (
                    <option key={type} value={type}>
                      {TYPE_MAPPER[type]}
                    </option>
                  )
                })}
              </select>
            </div>
            {comment.type ? (
              <></>
            ) : (
              <div className='help is-danger'>Please select type</div>
            )}
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <textarea
              className='textarea'
              onChange={onUpdateComment}
              value={comment.content}
            ></textarea>
            {comment.content ? (
              <></>
            ) : (
              <div className='help is-danger'>Content cannot be empty</div>
            )}
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <button
              className='button is-info'
              onClick={handleSubmit}
              disabled={comment.type == '' || comment.content == ''}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
function OnePageProfileButton({ onePageProfiles, regno }) {
  const found = onePageProfiles.find((p) => {
    return p.name == `lp${regno}.pdf`
  })
  if (!found) return null
  return (
    <a
      href={found.webViewLink}
      target='_blank'
      className='button is-info is-small'
    >
      一頁檔案
    </a>
  )
}

export default function StudentProfile() {
  const { data: session } = useSession()
  const initial = session.user.info.initial

  const [photos, setPhotos] = useState([])
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { students } = useStudentsContext()
  const [privileges, setPrivileges] = useState([])
  const [onePageProfiles, setOnePageProfiles] = useState([])

  const [notification, setNotification] = useState({ ...defaultNotification })
  const { setLoadingMessage, clearMessage } =
    notificationWrapper(setNotification)

  const groupedComments = _.groupBy(comments, 'regno')

  const classcodes = [
    '1A',
    '1B',
    '1C',
    '1D',
    '2A',
    '2B',
    '2C',
    '2D',
    '3A',
    '3B',
    '3C',
    '3D',
    '4A',
    '4B',
    '4C',
    '4D',
    '4E',
    '5A',
    '5B',
    '5C',
    '5D',
    '5E',
    '6A',
    '6B',
    '6C',
    '6D',
    '6E'
  ]

  const fetchData = async (targetStudents, signal) => {
    if (!targetStudents || targetStudents.length === 0) {
      setPhotos([])
      setComments([])
      return
    }

    const fetchStudents = targetStudents.slice(0, 100)
    const filenames = fetchStudents
      .map((s) => `lp${s.regno}`)
      .join("' or name contains '")
    const regnos = fetchStudents.map((s) => s.regno)

    try {
      const photoResPromise = fetch(
        `/api/photos?filenames=name contains '${filenames}'`,
        { signal }
      )
      const commentResPromise = fetch(
        `/api/profile?regnos=${regnos.join(',')}`,
        { signal }
      )

      const [photoRes, commentRes] = await Promise.all([
        photoResPromise,
        commentResPromise
      ])
      const photoJson = await photoRes.json()
      const commentJson = await commentRes.json()

      setPhotos(photoJson.files || [])
      setComments(commentJson || [])
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e)
    }
  }

  const refresh = async () => {
    let targetStudents = []
    if (filter) {
      targetStudents = students.filter((s) => s.classcode == filter)
    } else if (searchFilter) {
      const search = searchFilter.toLowerCase().trim()
      const exactMatch = search.match(/^([1-6][a-z])\s*0?(\d{1,2})$/)
      targetStudents = students.filter((s) => {
        if (exactMatch) {
          return (
            s.classcode?.toLowerCase() === exactMatch[1] &&
            String(s.classno) === exactMatch[2]
          )
        }
        const classcodeAndNo = `${s.classcode?.toLowerCase()}${String(s.classno).padStart(2, '0')}`
        const classcodeAndNoShort = `${s.classcode?.toLowerCase()}${String(s.classno)}`
        return (
          s.ename?.toLowerCase().includes(search) ||
          s.cname?.includes(search) ||
          String(s.regno).includes(search) ||
          s.classcode?.toLowerCase().includes(search) ||
          String(s.classno).includes(search) ||
          classcodeAndNo.includes(search) ||
          classcodeAndNoShort.includes(search)
        )
      })
    }
    await fetchData(targetStudents)
  }

  useEffect(() => {
    const abortController = new AbortController()

    const search = searchFilter.toLowerCase().trim()

    if (!searchFilter || search.length < 1) {
      if (!filter) {
        setPhotos([])
        setComments([])
      }
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const delayDebounceFn = setTimeout(async () => {
      const exactMatch = search.match(/^([1-6][a-z])\s*0?(\d{1,2})$/)

      const matchedStudents = students.filter((s) => {
        if (exactMatch) {
          return (
            s.classcode?.toLowerCase() === exactMatch[1] &&
            String(s.classno) === exactMatch[2]
          )
        }
        const classcodeAndNo = `${s.classcode?.toLowerCase()}${String(s.classno).padStart(2, '0')}`
        const classcodeAndNoShort = `${s.classcode?.toLowerCase()}${String(s.classno)}`
        return (
          s.ename?.toLowerCase().includes(search) ||
          s.cname?.includes(search) ||
          String(s.regno).includes(search) ||
          s.classcode?.toLowerCase().includes(search) ||
          String(s.classno).includes(search) ||
          classcodeAndNo.includes(search) ||
          classcodeAndNoShort.includes(search)
        )
      })

      if (matchedStudents.length === 0) {
        setPhotos([])
        setComments([])
        setIsLoading(false)
        return
      }

      await fetchData(matchedStudents, abortController.signal)
      setIsLoading(false)
    }, 500)

    return () => {
      clearTimeout(delayDebounceFn)
      abortController.abort()
    }
  }, [searchFilter, students, filter])

  const handleSelectChange = (e) => {
    const val = e.target.value
    setSearchFilter('')
    setFilter(val)
    if (val) {
      const targetStudents = students.filter((s) => s.classcode == val)
      fetchData(targetStudents)
    } else {
      setPhotos([])
      setComments([])
    }
  }

  const handleSearchChange = (e) => {
    setFilter('')
    setSearchFilter(e.target.value)
  }

  const fetchPrivileges = async () => {
    try {
      const response = await fetch(`/api/profile/privileges`)
      const json = await response.json()
      setPrivileges(json)
    } catch (e) {
      console.error(e)
    }
  }
  const fetchOnePageProfiles = async () => {
    try {
      const response = await fetch(`/api/profile/onepage`)
      const json = await response.json()
      setOnePageProfiles(json)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchPrivileges()
    fetchOnePageProfiles()
  }, [])

  if (notification.message) {
    return <Notification {...notification} />
  }

  let resultsToRender = []
  if (filter) {
    resultsToRender = students.filter((s) => s.classcode == filter)
  } else if (searchFilter) {
    const search = searchFilter.toLowerCase().trim()
    if (search.length >= 1) {
      const exactMatch = search.match(/^([1-6][a-z])\s*0?(\d{1,2})$/)

      resultsToRender = students.filter((s) => {
        if (exactMatch) {
          return (
            s.classcode?.toLowerCase() === exactMatch[1] &&
            String(s.classno) === exactMatch[2]
          )
        }

        const classcodeAndNo = `${s.classcode?.toLowerCase()}${String(s.classno).padStart(2, '0')}`
        const classcodeAndNoShort = `${s.classcode?.toLowerCase()}${String(s.classno)}`

        return (
          s.ename?.toLowerCase().includes(search) ||
          s.cname?.includes(search) ||
          String(s.regno).includes(search) ||
          s.classcode?.toLowerCase().includes(search) ||
          String(s.classno).includes(search) ||
          classcodeAndNo.includes(search) ||
          classcodeAndNoShort.includes(search)
        )
      })
    }
  }

  return (
    <>
      <h1 className='title has-text-centered'>Student Profile</h1>
      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
          <label className='label'>Filter</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <div className='control'>
              <input
                className='input'
                type='text'
                placeholder='Fuzzy Search: name, cname, regno, classcode, classno'
                onChange={handleSearchChange}
                value={searchFilter}
                autoFocus
              />
            </div>
          </div>
          <div className='field is-narrow'>
            <div className='control'>
              <p className='has-text-weight-bold my-2 px-2'>OR</p>
            </div>
          </div>
          <div className='field'>
            <div className='control'>
              <div className='select is-fullwidth'>
                <select onChange={handleSelectChange} value={filter}>
                  <option value=''>Select class</option>
                  {classcodes
                    .filter((classcode) => {
                      const found = privileges.find((p) => p.initial == initial)
                      if (!found) return false

                      const p = found.privileges
                      const c = found.classcodes
                      const i = found.initial
                      return (
                        c
                          .split(',')
                          .map((a) => a.trim())
                          .includes(classcode) ||
                        p
                          .split(',')
                          .map((a) => a.trim())
                          .find((p) => p[1] == classcode[0])
                      )
                    })
                    .map((classcode) => {
                      return (
                        <option key={classcode} value={classcode}>
                          {classcode}
                        </option>
                      )
                    })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='field is-horizontal'>
        <div className='field-label'>
          <label className='label'>Edit</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <label className='checkbox'>
              <input
                type='checkbox'
                checked={isEdit}
                onChange={() => setIsEdit((prev) => !prev)}
              />
            </label>
          </div>
        </div>
      </div>

      {searchFilter && isLoading && <Loading />}

      {(filter || (searchFilter && !isLoading)) && (
        <div>
          {resultsToRender.map((student) => {
            const {
              regno,
              ename,
              cname,
              sex,
              classcode,
              classno,
              isSen,
              isNcs,
              isNewlyArrived,
              x1,
              x2,
              x3
            } = student
            const classcodeAndNo = `${classcode}${String(classno).padStart(2, '0')}`
            const found = photos?.find(
              (file) => file.name.split('.')[0] == `lp${regno}`
            )
            return (
              <div className='box' key={regno}>
                <div className='columns'>
                  <div className='column is-one-quarter-desktop has-text-centered'>
                    <div className='is-flex is-justify-content-center'>
                      <figure className='is-3by4'>
                        {found ? (
                          <Image
                            alt={regno}
                            src={found.thumbnailLink}
                            width='0'
                            height='0'
                            sizes='250vw'
                            style={{ width: '100%', height: 'auto' }}
                          />
                        ) : (
                          <></>
                        )}
                      </figure>
                    </div>
                    <p>
                      {cname || ename}
                      {isSen && <span> ❤️</span>}
                      {isNcs && <span> 🌎</span>}
                      {isNewlyArrived && <span> 🇨🇳</span>}
                    </p>
                    <div className='tags is-justify-content-center'>
                      <span className='tag is-dark'>{classcodeAndNo}</span>
                      <span className='tag is-success'>{regno}</span>
                      <span
                        className={`tag ${sex == 'M' ? 'is-info' : 'is-danger'}`}
                      >
                        {sex}
                      </span>
                      {(x1 || x2 || x3) && (
                        <div className='tags is-justify-content-center mt-1'>
                          {x1 && <span className='tag is-warning'>{x1}</span>}
                          {x2 && <span className='tag is-warning'>{x2}</span>}
                          {x3 && <span className='tag is-warning'>{x3}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='column'>
                    {isEdit ? (
                      <CreateComment
                        regno={regno}
                        initial={initial}
                        refresh={() => refresh()}
                        setLoadingMessage={setLoadingMessage}
                        clearMessage={clearMessage}
                      />
                    ) : (
                      <></>
                    )}

                    <DisplayComment
                      comments={groupedComments[regno]}
                      initial={initial}
                      setComments={setComments}
                      setLoadingMessage={setLoadingMessage}
                      clearMessage={clearMessage}
                    />
                    <OnePageProfileButton
                      onePageProfiles={onePageProfiles}
                      regno={regno}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
