import { useState } from 'react'
import _ from 'lodash'
import Image from 'next/image'

import { useStudentsContext } from '@/context/studentContext'
import Loading from '@/components/loading'

export default function StudentPhoto() {
  const [files, setFiles] = useState([])
  const [filter, setFilter] = useState('')
  const [isShowDetails, setIsShowDetails] = useState(false)
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
    return <Loading />
  }

  return (
    <>
      <div className='not-print'>
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
                  <div className='help is-info'>
                    If you want to print the photos, remember to adjust the
                    margins and scaling settings for optimal viewing quality.
                    e.g. set the scale to 50%
                  </div>
                </div>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <button
                  className={`button ${isShowDetails ? 'is-info' : 'is-warning'}`}
                  onClick={() => setIsShowDetails(!isShowDetails)}
                >
                  {isShowDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filter && (
        <div className='section'>
          <h1 className='title has-text-centered'>{filter}</h1>
          <div className='grid is-col-min-8'>
            {students
              .filter((s) => s.classcode == filter && (s.ename || s.cname))
              .map((student) => {
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
                  isAllowAccessories
                } = student
                const classcodeAndNo = `${classcode}${String(classno).padStart(2, 0)}`
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
                              alt={regno}
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
