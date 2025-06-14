import { REASON_TYPES, ATTENDANCE_TYPES } from '@/config/constant'
import { getDisplayName } from '@/lib/helper'
import { camelCase } from 'lodash'
import { useRef } from 'react'

function CustomSelect({ handleChange, value }) {
  return (
    <div className='field'>
      <div className='control'>
        <div className='select'>
          <select onChange={handleChange} value={value}>
            <option value=''>未交 - Not yet submit</option>
            {REASON_TYPES.map(({ key, cTitle, title }) => (
              <option value={key} key={key}>
                {cTitle} - {title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function CustomFileInput({ handleFileChange, files, row }) {
  // if same regno, file can be share

  return (
    <>
      <div className='field has-addons'>
        <div className='control'>
          <div className='file has-name is-fullwidth'>
            <label className='file-label' />
            <input
              className='file-input'
              type='file'
              accept='image/*,.pdf'
              onChange={handleFileChange}
            />
            <span className='file-cta'>
              <span className='file-label'> 選擇檔案 </span>
            </span>
          </div>
        </div>
        <div className='control'>
          <div className='select is-expanded'>
            <select onChange={handleSelectFile}>
              <option value=''>不適用</option>
              {files?.map((file, key) => {
                return <option key={key}>{file.name}</option>
              })}
            </select>
          </div>
        </div>
      </div>
    </>
  )
}

export default function EditModal({
  tableRef,
  isModalActive,
  setIsModalActive,
  selectedRows,
  setSelectedRows
}) {
  const handleChange = (e, index) => {
    const { value } = e.target
    setSelectedRows((prevRows) => {
      const newRows = prevRows.map((row, n) => {
        if (index == n || index == undefined) {
          return Object.assign({}, row, { reasonForAbsence: value })
        }
        return row
      })
      return newRows
    })
  }
  const handleConfirm = () => {
    tableRef?.current.dt().ajax.reload()
    setIsModalActive(false)
  }

  const getFilenameFromRow = (row) => {
    const { id, eventDate, regno, classcode, classno, name, cname, type } = row
    return `${id}|${eventDate}_${regno}_${classcode}${String(classno).padStart(2, 0)}_${cname || name}`
  }
  const handleFileChange = (e, idx) => {
    const filename = getFilenameFromRow(rows[idx])
    const files = e.target.files
  }

  if (!isModalActive) return null
  return (
    <>
      <div className={`modal ${isModalActive && 'is-active'}`}>
        <div className='modal-background'></div>
        <div className='modal-content' style={{ width: '70%' }}>
          <div className='box'>
            <h1 className='title'>Edit Record</h1>
            <CustomSelect handleChange={handleChange} />

            <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Upload</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row, index) => {
                  const { eventDate, type } = row
                  return (
                    <tr key={index}>
                      <td>{eventDate}</td>
                      <td>
                        {(() => {
                          const found = ATTENDANCE_TYPES.find(
                            ({ key }) => key === camelCase(type)
                          )
                          const { title, cTitle } = found
                          return `${cTitle} - ${title}`
                        })()}
                      </td>

                      <td>{getDisplayName(row)}</td>
                      <td>
                        <CustomSelect
                          value={row.reasonForAbsence}
                          handleChange={(e) => handleChange(e, index)}
                        />
                      </td>
                      <td>
                        <CustomFileInput
                          handleFileChange={(e) => handleFileChange(e, index)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className='buttons is-grounded'>
              <button className='button is-danger' onClick={handleConfirm}>
                Confirm
              </button>
              <button
                className='button is-info'
                onClick={() => {
                  setIsModalActive(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <button
          className='modal-close is-large'
          aria-label='close'
          onClick={() => {
            setIsModalActive(false)
          }}
        ></button>
      </div>
    </>
  )
}
