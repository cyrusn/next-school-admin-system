import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStudentsContext } from '@/context/studentContext'
import { useUsersContext } from '@/context/usersContext'
import { groupBy, intersection, upperFirst } from 'lodash'
import CheckboxInput from '@/components/form/checkboxInput'
import RadioInput from '@/components/form/radioInput'
import Nav from './components/nav'
import NamelistTable from './components/namelistTable.js'
import { HOMEBASES, TERM } from '@/config/constant'
import { useSettings } from '@/context/settingsContext'

export default function Namelist() {
  const router = useRouter()
  const { query, isReady } = router

  const { settings } = useSettings()
  const term = settings.TERM || TERM
  const CLASSCODES = Object.keys(HOMEBASES[term] || HOMEBASES[1])

  const defaultFilters = {
    classlevels: [],
    classcode: [],
    groups: [],
    x1: [],
    x2: [],
    x3: []
  }

  const { students } = useStudentsContext()
  const { users } = useUsersContext()
  const [filters, setFilters] = useState({ ...defaultFilters })
  const [isMulti, setIsMulti] = useState(false)
  const contentRef = useRef(null)
  const initialized = useRef(false)

  // Pre-calculate available filter data based on either active state or incoming query
  let activeClassLevels = initialized.current ? filters.classlevels : (query.classlevels ? String(query.classlevels).toUpperCase().split(',') : [])
  
  // If classlevels are missing but classcode is provided, infer classlevels
  if (!initialized.current && activeClassLevels.length === 0) {
    const rawClassCodeQuery = query.classcode || query.classcodes
    if (rawClassCodeQuery) {
      const rawClassCodes = String(rawClassCodeQuery).toUpperCase().split(',')
      activeClassLevels = [...new Set(rawClassCodes.map(code => `S${code[0]}`))]
    }
  }

  const filterData = {
    classlevels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    classcode: CLASSCODES.filter((classcode) =>
      activeClassLevels.some((classlevel) => classcode[0] == classlevel[1])
    ),
    groups: [],
    x1: [],
    x2: [],
    x3: []
  }

  const studentsByLevel = students.reduce((prev, s) => {
    const classlevel = `S${s.classcode[0]}`

    if (activeClassLevels.length) {
      if (activeClassLevels.includes(classlevel)) {
        s.groups.forEach((g) => {
          if (!filterData.groups.includes(g)) filterData.groups.push(g)
        })
        const electives = ['x1', 'x2', 'x3']

        electives.forEach((x) => {
          if (s[x] && !filterData[x].includes(s[x])) filterData[x].push(s[x])
        })
      }
    }
    if (prev[classlevel]) {
      prev[classlevel].push(s)
    } else {
      prev[classlevel] = [s]
    }

    return prev
  }, {})

  // Hydrate from query params
  useEffect(() => {
    if (isReady && students.length > 0 && !initialized.current) {
      const newFilters = { ...defaultFilters }
      let hasFilters = false
      let multiDetected = false

      // If we inferred activeClassLevels from classcodes, ensure they are set in the filters
      const classCodeQuery = query.classcodes || query.classcode
      if (activeClassLevels.length > 0 && !query.classlevels) {
        newFilters.classlevels = activeClassLevels
        hasFilters = true
        if (activeClassLevels.length > 1) {
          multiDetected = true
        }
      }

      const queryMap = {
        classlevels: 'classlevels',
        classcode: 'classcodes',
        groups: 'groups',
        x1: 'x1s',
        x2: 'x2s',
        x3: 'x3s'
      }

      Object.keys(defaultFilters).forEach((key) => {
        const queryKey = queryMap[key] || key
        const queryVal = query[queryKey] || (key === 'classcode' ? query.classcode : null)
        
        if (queryVal) {
          const rawValues = String(queryVal).split(',')
          // Match against available options case-insensitively
          const validValues = rawValues.reduce((acc, val) => {
            const searchVal = val.trim().toLowerCase()
            const found = filterData[key]?.find(option => option.toLowerCase() === searchVal)
            if (found) acc.push(found)
            return acc
          }, [])

          if (validValues.length > 0) {
            newFilters[key] = validValues
            hasFilters = true
            if (validValues.length > 1) {
              multiDetected = true
            }
          }
        }
      })

      if (hasFilters) {
        setFilters(newFilters)
      }
      setIsMulti(multiDetected)
      initialized.current = true
    }
  }, [isReady, query, filterData, students])

  // Sync URL with filters
  useEffect(() => {
    if (initialized.current) {
      const params = new URLSearchParams()
      
      const queryMap = {
        classlevels: 'classlevels',
        classcode: 'classcodes',
        groups: 'groups',
        x1: 'x1s',
        x2: 'x2s',
        x3: 'x3s'
      }

      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].length > 0) {
          const queryKey = queryMap[key] || key
          params.set(queryKey, filters[key].join(','))
        }
      })

      const newQuery = params.toString()
      const newPath = `/namelist/basic${newQuery ? `?${newQuery}` : ''}`

      if (window.location.search !== `?${newQuery}` && (window.location.search || newQuery)) {
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath)
      }
    }
  }, [filters])

  const usersByClassMaster = groupBy(users, 'classMaster')

  const handleChange = (e) => {
    const { name, value, type } = e.target

    setFilters((filters) => {
      let newFilters = null

      if (name == 'classlevels') {
        newFilters = { ...defaultFilters }
        newFilters.classlevels = [...filters['classlevels']]
      } else {
        newFilters = { ...filters }
      }

      if (type === 'radio') {
        newFilters[name] = [value]
      } else {
        const found = newFilters[name].includes(value)

        if (found) {
          newFilters[name] = newFilters[name].filter((a) => a !== value)
        } else {
          newFilters[name].push(value)
        }
      }

      if (name == 'classlevels') return newFilters

      const keysToChange = Object.keys(filterData).filter(
        (f) => f !== 'classlevels'
      )

      keysToChange.forEach((key) => {
        if (key == name) {
        } else {
          newFilters[key] = []
        }
      })
      return newFilters
    })
  }

  return (
    <>
      <div className='not-print mb-4'>
        <Nav />
        <div className='tabs is-toggle is-small mb-3'>
          <ul>
            <li className={!isMulti ? 'is-active' : ''}>
              <a
                onClick={() => {
                  setIsMulti(false)
                  setFilters({ ...defaultFilters })
                }}
              >
                <span>Single</span>
              </a>
            </li>
            <li className={isMulti ? 'is-active' : ''}>
              <a
                onClick={() => {
                  setIsMulti(true)
                  setFilters({ ...defaultFilters })
                }}
              >
                <span>Multiple</span>
              </a>
            </li>
          </ul>
        </div>
        {Object.keys(filterData).map((key, index) => {
          if (filterData[key]?.length == 0) return null
          return (
            <div className='field is-horizontal' key={index}>
              <div className='field-label'>{upperFirst(key)}</div>
              <div className='field-body'>
                <div className='field is-expanded'>
                  {!isMulti ? (
                    <RadioInput
                      name={key}
                      elements={
                        filterData[key]
                          .map((v) => ({
                            title: v,
                            value: v
                          }))
                          .filter(({ value }) => value)
                          .sort((a, b) => a.title.localeCompare(b.title)) || []
                      }
                      checkedValue={filters[key] || []}
                      handleChange={handleChange}
                    />
                  ) : (
                    <CheckboxInput
                      name={key}
                      elements={
                        filterData[key]
                          .map((v) => ({
                            title: v,
                            value: v
                          }))
                          .filter(({ value }) => value)
                          .sort((a, b) => a.title.localeCompare(b.title)) || []
                      }
                      selectedBoxes={filters[key] || []}
                      handleChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div ref={contentRef}>
        <div className='hero'>
          <div className='hero-body p-0 m-1'>
            <div className='fixed-grid has-1-cols-mobile'>
              <div className='grid is-gap-6'>
                {filters.classlevels.length !== 0 &&
                  Object.keys(studentsByLevel)
                    .filter((level) => filters.classlevels.includes(level))
                    .map((classlevel) => {
                      const groupFn = (s) => {
                        const keys = ['classcode', 'groups', 'x1', 'x2', 'x3']
                        for (const key of keys) {
                          if (filters[key].length !== 0)
                            return intersection(
                              filters[key],
                              typeof s[key] == 'string' ? [s[key]] : s[key]
                            )
                        }

                        return s.classcode
                      }

                      const groupedStudents = groupBy(
                        studentsByLevel[classlevel],
                        groupFn
                      )
                      return Object.keys(groupedStudents).map(
                        (key, index, array) => {
                          if (!key) return null
                          return (
                            <div className='cell' key={key}>
                              <NamelistTable
                                key={key}
                                classTitle={`${classlevel}-${key}`}
                                students={groupedStudents[key]}
                                teacher={
                                  usersByClassMaster[key]
                                    ?.map((t) => t.initial)
                                    ?.join(', ') || ''
                                }
                                location={HOMEBASES[term]?.[key] || ''}
                              />
                              {array.length !== index + 1 && (
                                <div className='page-break' />
                              )}
                            </div>
                          )
                        }
                      )
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
