// discipline record show all conduct relate to user in the given period of time
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import _ from 'lodash'
import Image from 'next/image'

import SelectInput from '@/components/form/selectInput'
import { useStudentsContext } from '@/context/studentContext'

export default function StudentPhoto() {
  const [files, setFiles] = useState([])
  const [filter, setFilter] = useState('')
  const { students } = useStudentsContext()

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

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    const fetchData = async (filter) => {
      const filenames = students
        .filter((s) => {
          return s.classcode == filter
        })
        .map((s) => `lp${s.regno}`)
        .join("' or name contains '")
      try {
        const response = await fetch(
          `/api/photos?filename=name contains '${filenames}'`
        )
        const json = await response.json()
        setFiles(json.files)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData(filter)
  }, [filter, students])

  return (
    <>
      <h1 className='title has-text-centered'>Student Photo</h1>
      <div className='field is-horizontal'>
        <div className='field-label'>
          <label className='label'>class</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <div className='control'>
              <div className='select is-fullwidth'>
                <select onChange={handleChange}>
                  <option value='' selected={filter == ''}>
                    Select class
                  </option>
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
      {filter ? (
        <div className='columns is-multiline is-desktop'>
          {students
            .filter((s) => s.classcode == filter)
            .map((student) => {
              const { regno, name, cname, sex, classcode, classno } = student
              const classcodeAndNo = `${classcode}${String(classno).padStart(2, 0)}`
              const found = files?.find(
                (file) => file.name.split('.')[0] == `lp${regno}`
              )
              return (
                <div
                  className='column is-one-quarter-desktop has-text-centered'
                  key={regno}
                >
                  <div className='box'>
                    {cname ? <p>{cname}</p> : <></>}
                    <p>{name}</p>
                    <div className='is-flex is-justify-content-center'>
                      <figure className='is-128x128'>
                        {found ? (
                          <Image
                            alt={regno}
                            src={found.thumbnailLink}
                            width={180}
                            height={180}
                          />
                        ) : (
                          <></>
                        )}
                      </figure>
                    </div>
                    <div className='tags is-justify-content-center'>
                      <span className='tag is-dark'>{classcodeAndNo}</span>
                      <span className='tag is-success'>{regno}</span>
                      <span
                        className={`tag ${sex == 'M' ? 'is-info' : 'is-danger'}`}
                      >
                        {sex}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
