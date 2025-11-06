import { useState, useEffect, useRef } from 'react'
import RadioInput from '@/components/form/radioInput'
import CheckboxInput from '@/components/form/checkboxInput'
import MultiSelectInput from '@/components/form/multiSelectInput'
import TimetableElement from './components/timetableElement'
import { startCase } from 'lodash'

export default function Timetable() {
  const [sheetName, setSheetName] = useState('')
  const [selectedTableNames, setSelectedTableNames] = useState([])
  const [timetables, setTimetables] = useState({})

  const sheetNames = Object.keys(timetables)
  const tableNames =
    timetables[sheetName]?.map((t) => String(t.ShortName)) || []

  const handleChangeType = (e) => {
    const { value } = e.target
    setSheetName(value)
    setSelectedTableNames([])
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
        <RadioInput
          name='sheetName'
          elements={sheetNames.map((name) => ({
            title: startCase(name),
            value: name
          }))}
          checkedValue={sheetName}
          handleChange={handleChangeType}
        />
        {tableNames?.length > 0 && (
          <>
            {(sheetName.includes('teacher') ||
              sheetName.includes('location')) && (
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
            )}
            {sheetName.includes('class') && (
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
