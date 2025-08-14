import { useState, useRef } from 'react'
import { useStudentsContext } from '@/context/studentContext'
import { useUsersContext } from '@/context/usersContext'
import { groupBy, intersection, upperFirst } from 'lodash'
import CheckboxInput from '@/components/form/checkboxInput'
import Nav from './components/nav'
import { useReactToPrint } from 'react-to-print'
import NamelistTable from './components/namelistTable.js'
import { HOMEBASES, TERM } from '@/config/constant'

export default function BasicList() {
  const defaultFilters = {
    classlevels: [],
    groups: [],
    x1: [],
    x2: [],
    x3: []
  }

  const { students } = useStudentsContext()
  const { users } = useUsersContext()
  const [filters, setFilters] = useState({ ...defaultFilters })
  const contentRef = useRef(null)

  const filterData = {
    classlevels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    groups: [],
    x1: [],
    x2: [],
    x3: []
  }
  const reactToPrintFn = useReactToPrint({ contentRef })

  const studentsByLevel = students.reduce((prev, s) => {
    const classlevel = `S${s.classcode[0]}`

    if (filters.classlevels.length) {
      if (filters.classlevels.includes(classlevel)) {
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
  const usersByClassMaster = groupBy(users, 'classMaster')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFilters((filters) => {
      const newFilters = { ...filters }
      const found = newFilters[name].includes(value)

      if (found) {
        newFilters[name] = newFilters[name].filter((a) => a !== value)
      } else {
        newFilters[name].push(value)
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
      <div className='not-print'>
        <Nav />
        {Object.keys(filterData).map((key, index) => {
          if (filterData[key]?.length == 0) return <></>
          return (
            <div className='field is-horizontal' key={index}>
              <div className='field-label'>{upperFirst(key)}</div>
              <div className='field-body'>
                <div className='field is-expanded'>
                  <CheckboxInput
                    name={key}
                    elements={
                      filterData[key]
                        .map((v) => ({
                          title: v,
                          value: v
                        }))
                        .sort((a, b) => a.title.localeCompare(b.title)) || []
                    }
                    selectedBoxes={filters[key] || []}
                    handleChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )
        })}

        <div className='field is-horizontal'>
          <div className='field-label'></div>
          <div className='field-body'>
            <div className='field'>
              <button className='button is-info' onClick={reactToPrintFn}>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef}>
        {filters.classlevels.length !== 0 &&
          Object.keys(studentsByLevel)
            .filter((level) => filters.classlevels.includes(level))
            .map((classlevel, key) => {
              const groupFn = (s) => {
                const keys = ['groups', 'x1', 'x2', 'x3']
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
              return (
                <div key={key} className='hero'>
                  <div className='hero-body'>
                    <h1 className='title not-print'>{`${classlevel}`}</h1>
                    <div className='fixed-grid has-1-cols-mobile'>
                      <div className='grid is-gap-8'>
                        {Object.keys(groupedStudents).map((key, index) => {
                          if (!key) return <></>
                          return (
                            <div className='cell' key={key}>
                              <NamelistTable
                                key={index}
                                classTitle={`${classlevel}-${key}`}
                                students={groupedStudents[key]}
                                teacher={
                                  usersByClassMaster[key]
                                    ?.map((t) => t.initial)
                                    ?.join(', ') || ''
                                }
                                location={HOMEBASES[TERM][key]}
                              />
                              <div className='page-break' />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
      </div>
    </>
  )
}
