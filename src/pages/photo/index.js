import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import Image from 'next/image'

import { useStudentsContext } from '@/context/studentContext'
import Loading from '@/components/loading'

export default function StudentPhoto() {
  const router = useRouter()
  const { query, isReady } = router

  const [files, setFiles] = useState([])
  const [filter, setFilter] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [isShowDetails, setIsShowDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { students } = useStudentsContext()

  const initialized = useRef(false)

  const classcodes = _(students).map('classcode').uniq().value()

  const fetchData = async (filter) => {
    const filenames = students
      .filter((s) => {
        return s.classcode == filter
      })
      .map((s) => `lp${s.regno}`)
      .join("' or name contains '")

    if (!filenames) {
      setFiles([])
      return
    }

    try {
      const url = `/api/photos?filenames=name contains '${filenames}'`

      const response = await fetch(url)
      const json = await response.json()
      setFiles(json.files || [])
    } catch (e) {
      console.error(e)
      setFiles([])
    }
  }

  // Hydrate state from query params
  useEffect(() => {
    if (isReady && !initialized.current) {
      const { classcode, search } = query
      if (classcode) {
        setFilter(String(classcode).toUpperCase())
      } else if (search) {
        setSearchFilter(search)
      }
      initialized.current = true
    }
  }, [isReady, query])

  // Sync URL with state
  useEffect(() => {
    if (initialized.current) {
      const params = new URLSearchParams()
      if (filter) {
        params.set('classcode', filter)
      } else if (searchFilter) {
        params.set('search', searchFilter)
      }

      const newQuery = params.toString()
      const newPath = `/photo${newQuery ? `?${newQuery}` : ''}`

      if (window.location.search !== `?${newQuery}` && (window.location.search || newQuery)) {
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath)
      }
    }
  }, [filter, searchFilter])

  useEffect(() => {
    const abortController = new AbortController()
    const search = searchFilter.toLowerCase().trim()

    if (!searchFilter || search.length < 1) {
      if (!filter) {
        setFiles([])
      } else {
        // If there is a filter (classcode), fetch its data
        fetchData(filter)
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
        setFiles([])
        setIsLoading(false)
        return
      }

      const filenames = matchedStudents
        .slice(0, 100)
        .map((s) => `lp${s.regno}`)
        .join("' or name contains '")

      try {
        const url = `/api/photos?filenames=name contains '${filenames}'`

        const response = await fetch(url, { signal: abortController.signal })
        const json = await response.json()
        setFiles(json.files || [])
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error(e)
          setFiles([])
        }
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(delayDebounceFn)
      abortController.abort()
    }
  }, [searchFilter, students, filter])

  const handleSelectChange = (e) => {
    setSearchFilter('')
    setFilter(e.target.value)
  }

  const handleSearchChange = (e) => {
    setFilter('')
    setSearchFilter(e.target.value)
  }

  if (files.length == 0 && filter !== '' && !searchFilter) {
    return <Loading />
  }

  let resultsToRender = []
  let displayTitle = ''

  if (filter) {
    displayTitle = filter
    resultsToRender = students.filter(
      (s) => s.classcode == filter && (s.ename || s.cname)
    )
  } else if (searchFilter) {
    const search = searchFilter.toLowerCase().trim()
    if (search.length >= 1) {
      displayTitle = 'Search Results'
      const exactMatch = search.match(/^([1-6][a-z])\s*0?(\d{1,2})$/)

      resultsToRender = students.filter((s) => {
        if (!(s.ename || s.cname)) return false

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
      <div className='not-print'>
        <h1 className='title has-text-centered'>Student Photo</h1>
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
                    <option value={''}>Select class</option>
                    {classcodes.map((classcode) => {
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

        <div className='columns is-centered mt-4'>
          <div className='column is-half has-text-centered'>
            <div className='help is-info has-text-centered'>
              If you want to print the photos, remember to adjust the margins
              and scaling settings for optimal viewing quality. e.g. set the
              scale to 50%
            </div>
          </div>
        </div>
      </div>

      {searchFilter && isLoading && <Loading />}

      {(filter || (searchFilter && !isLoading)) && (
        <div className='section'>
          <div className='level'>
            <div className='level-item'>
              <h1 className='title has-text-centered mr-4'>{displayTitle}</h1>
              <button
                className={`button ${isShowDetails ? 'is-info' : 'is-warning'}`}
                onClick={() => setIsShowDetails(!isShowDetails)}
              >
                {isShowDetails ? 'Hide' : 'Show'} Details
              </button>
            </div>
          </div>
          <div className='grid is-col-min-8'>
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
                isAllowAccessories,
                x1,
                x2,
                x3
              } = student
              const classcodeAndNo = `${classcode}${String(classno).padStart(2, '0')}`
              const found = files?.find(
                (file) => file.name.split('.')[0] == `lp${regno}`
              )
              return (
                <div className='cell has-text-centered' key={regno}>
                  <div className='box'>
                    <div className='is-flex is-justify-content-center'>
                      {found && (
                        <figure>
                          <Image
                            alt={String(regno)}
                            src={found.thumbnailLink}
                            width='160'
                            height='320'
                          />
                        </figure>
                      )}
                    </div>
                    <p>
                      {cname || ename}
                      {isShowDetails && (
                        <span>
                          {isSen && <span> ❤️</span>}
                          {isNcs && <span> 🌎</span>}
                          {isAllowAccessories && <span> ✝️</span>}
                          {isNewlyArrived && <span> 🇨🇳</span>}
                        </span>
                      )}
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
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
