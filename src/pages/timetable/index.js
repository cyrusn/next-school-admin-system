import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import RadioInput from '@/components/form/radioInput'
import CheckboxInput from '@/components/form/checkboxInput'
import MultiSelectInput from '@/components/form/multiSelectInput'
import TimetableElement from './components/timetableElement'
import { startCase } from 'lodash'
import { TERM } from '@/config/constant'
import { useSettings } from '@/context/settingsContext'

export default function Timetable() {
  const router = useRouter()
  const { query, isReady } = router

  const { settings } = useSettings()
  const [term, setTerm] = useState(TERM || 1)

  useEffect(() => {
    if (settings.TERM && !query.term) {
      setTerm(parseInt(settings.TERM))
    }
  }, [settings.TERM, query.term])

  const [isMulti, setIsMulti] = useState(false)
  const [sheetName, setSheetName] = useState('')
  const [selectedTableNames, setSelectedTableNames] = useState([])
  const [timetables, setTimetables] = useState({})

  const initialized = useRef(false)

  useEffect(() => {
    if (isReady && Object.keys(timetables).length > 0 && !initialized.current) {
      const { term: qTerm, type, codes } = query

      if (qTerm) {
        setTerm(parseInt(qTerm))
      }

      if (type) {
        const currentTerm = qTerm ? parseInt(qTerm) : term
        // Find the matching sheet name case-insensitively
        const targetType = type.toLowerCase()
        const foundSheetName = Object.keys(timetables).find(key => {
          const isTermMatch = key.startsWith(currentTerm === 1 ? '1st' : '2nd')
          const isTypeMatch = key.split('_').slice(1).join('_').toLowerCase() === targetType
          return isTermMatch && isTypeMatch
        })
        
        if (foundSheetName) {
          setSheetName(foundSheetName)
          if (codes) {
            const codeList = String(codes).split(',')
            if (codeList.length > 1) {
              setIsMulti(true)
            }
            const foundNames = codeList.reduce((acc, c) => {
              const searchCode = c.trim().toLowerCase()
              const found = timetables[foundSheetName].find(
                (t) => String(t.ShortName).toLowerCase() === searchCode
              )
              if (found) acc.push(String(found.ShortName))
              return acc
            }, [])

            if (foundNames.length > 0) {
              setSelectedTableNames(foundNames)
            }
          }
        }
      }
      initialized.current = true
    }
  }, [isReady, timetables, query])

  const sheetNames = Object.keys(timetables).filter((key) =>
    key.startsWith(term === 1 ? '1st' : '2nd')
  )
  const tableNames =
    timetables[sheetName]?.map((t) => String(t.ShortName)) || []

  const handleTermChange = (newTerm) => {
    setTerm(newTerm)
    if (sheetName) {
      const parts = sheetName.split('_')
      const type = parts.slice(1).join('_')
      const newSheetName = `${newTerm === 1 ? '1st' : '2nd'}_${type}`
      setSheetName(newSheetName)
    }
  }

  const handleChangeType = (e) => {
    const { value } = e.target
    setSheetName(value)
    setSelectedTableNames([])
    setIsMulti(false)
  }
  const handleSelect = (e) => {
    setSelectedTableNames((tableNames) => {
      const { value, type } = e.target
      switch (type) {
        case 'checkbox':
          let newTableNames = [...tableNames]
          const found = newTableNames.includes(value)

          if (found) {
            return newTableNames.filter((a) => a !== value)
          } else {
            newTableNames.push(value)
            return newTableNames
          }

        case 'radio':
          return [value]
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/timetables`)
        const result = await response.json()
        if (!response.ok) throw new Error(result.message)
        setTimetables(result)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (initialized.current) {
      const params = new URLSearchParams()
      params.set('term', term)
      
      if (sheetName) {
        const type = sheetName.split('_').slice(1).join('_')
        params.set('type', type)
        if (selectedTableNames.length > 0) {
          params.set('codes', selectedTableNames.join(','))
        }
      }
      
      const newQuery = params.toString()
      const newPath = `/timetable${newQuery ? `?${newQuery}` : ''}`
      
      if (window.location.search !== `?${newQuery}` && (window.location.search || newQuery)) {
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath)
      }
    }
  }, [term, sheetName, selectedTableNames])

  return (
    <>
      <div className='not-print'>
        <div className='is-flex is-align-items-center mb-3' style={{ gap: '0.75rem' }}>
          <div className='tabs is-toggle is-small mb-0'>
            <ul>
              <li className={term === 1 ? 'is-active' : ''}>
                <a onClick={() => handleTermChange(1)}>
                  <span>Term 1</span>
                </a>
              </li>
              <li className={term === 2 ? 'is-active' : ''}>
                <a onClick={() => handleTermChange(2)}>
                  <span>Term 2</span>
                </a>
              </li>
            </ul>
          </div>
          <div className='tabs is-toggle is-small mb-0'>
            <ul>
              <li className={!isMulti ? 'is-active' : ''}>
                <a
                  onClick={() => {
                    setIsMulti(false)
                    setSelectedTableNames([])
                  }}
                >
                  <span>Single</span>
                </a>
              </li>
              <li className={isMulti ? 'is-active' : ''}>
                <a
                  onClick={() => {
                    setIsMulti(true)
                    setSelectedTableNames([])
                  }}
                >
                  <span>Multiple</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <RadioInput
          name='sheetName'
          elements={sheetNames.map((name) => ({
            title: startCase(name.replace(/^(1st|2nd)_/, '')),
            value: name
          }))}
          checkedValue={sheetName}
          handleChange={handleChangeType}
        />
        {tableNames?.length > 0 && (
          <>
            {!isMulti ? (
              <RadioInput
                elements={tableNames
                  .map((tableName) => ({
                    title: tableName,
                    value: tableName
                  }))
                  .sort((a, b) => a.title.localeCompare(b.title))}
                checkedValue={selectedTableNames}
                handleChange={handleSelect}
              />
            ) : (
              <CheckboxInput
                elements={tableNames
                  .map((tableName) => ({
                    title: tableName,
                    value: tableName
                  }))
                  .sort((a, b) => a.title.localeCompare(b.title))}
                selectedBoxes={selectedTableNames}
                handleChange={handleSelect}
              />
            )}
          </>
        )}
      </div>
      {sheetName &&
        selectedTableNames
          .reduce((prev, selectedTableName) => {
            const found = timetables[sheetName]?.find(
              (t) => t.ShortName == selectedTableName
            )
            if (found) prev.push(found)
            return prev
          }, [])
          .map((timetable, key, array) => {
            return (
              <TimetableElement
                key={key}
                timetable={timetable}
                isLast={array.length == key + 1}
              />
            )
          })}
    </>
  )
}
