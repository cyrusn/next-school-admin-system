import { useState } from 'react'
import _ from 'lodash'
import Image from 'next/image'

import { useStudentsContext } from '@/context/studentContext'

export default function StudentPhoto() {
  const [files, setFiles] = useState([])
  const [filter, setFilter] = useState('')
  const { students } = useStudentsContext()

  const classcodes = _(students).map('classcode').uniq().value()

  const fetchData = async (filter) => {
    const filenames = students
      .filter((s) => {
        return s.classcode == filter
      })
      .map((s) => `lp${s.regno}`)
      .join("' or name contains '")

    try {
      const url = `/api/photos?filenames=name contains '${filenames}'`

      const response = await fetch(url)
      const json = await response.json()
      setFiles(json.files)
    } catch (e) {
      console.error(e)
    }
  }

  const handleChange = (e) => {
    setFilter(e.target.value)
    fetchData(e.target.value)
  }

  if (files.length == 0 && filter !== '') {
    return <div className='notification is-warning'>Loading ...</div>
  }

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
                    <div className='is-flex is-justify-content-center'>
                      <figure className='is-3by4'>
                        {found && (
                          <Image
                            alt={regno}
                            src={found.thumbnailLink}
                            width='0'
                            height='0'
                            sizes='250vw'
                            style={{ width: '100%', height: 'auto' }}
                          />
                        )}
                      </figure>
                    </div>
                    {cname && <p>{cname}</p>}
                    <p>{name}</p>
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
