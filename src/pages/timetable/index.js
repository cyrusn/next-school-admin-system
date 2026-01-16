import { useState, useEffect, useRef } from 'react'
import RadioInput from '@/components/form/radioInput'
import CheckboxInput from '@/components/form/checkboxInput'
import MultiSelectInput from '@/components/form/multiSelectInput'
import TimetableElement from './components/timetableElement'
import { startCase } from 'lodash'
import { TERM } from '@/config/constant'

export default function Timetable() {
  const [term, setTerm] = useState(TERM || 1)
  const [isMulti, setIsMulti] = useState(false)
  const [sheetName, setSheetName] = useState('')
  const [selectedTableNames, setSelectedTableNames] = useState([])
  const [timetables, setTimetables] = useState({})

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
        if (!response.ok) throw new Error(result.meesage)
        setTimetables(result)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

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
