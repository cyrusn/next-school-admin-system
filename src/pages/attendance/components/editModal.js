import { REASON_TYPES, ATTENDANCE_TYPES } from '@/config/constant'
import { getDisplayName } from '@/lib/helper'
import { camelCase } from 'lodash'
import { useState } from 'react'

import { useSession } from 'next-auth/react'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'

const getFilenameFromRow = (row) => {
  const { eventDate, classcode, classno, name, cname, type } = row

  const found = ATTENDANCE_TYPES.find(({ key }) => key === camelCase(type))
  const { cTitle } = found

  return `${eventDate}|${classcode}${String(classno).padStart(2, 0)}_${cname || name}|${cTitle}`
}

function CustomSelect({ handleChange, value }) {
  return (
    <div className='field'>
      <div className='control'>
        <div className='select'>
          <select onChange={handleChange} value={value}>
            <option value=''>未交</option>
            {REASON_TYPES.map(({ key, cTitle }) => (
              <option value={key} key={key}>
                {cTitle}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function CustomFileInput({
  handleFileChange,
  selectFile,
  unCheckFile,
  files,
  row
}) {
  const { id, regno } = row

  return (
    <>
      <div className='field has-addons'>
        <div className='control'>
          <div className='file has-name is-fullwidth'>
            <label className='file-label'>
              <input
                className='file-input'
                type='file'
                accept='image/*,.pdf'
                onChange={handleFileChange}
              />
              {files.find((file) => file.checkedIds?.includes(id)) ? (
                <div></div>
              ) : (
                <span className='file-label'> 選擇檔案 </span>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className='field'>
        <div className='control'>
          <div className='checkboxes'>
            {files
              .filter((file) => {
                const { key, checkedIds } = file
                if (key == id) {
                  return true
                }

                if (files.some((file) => file.checkedIds.includes(id))) {
                  return checkedIds.includes(id)
                }

                return file.owner == regno
              })
              ?.map(({ filename, checkedIds, key }, _, files) => {
                if (checkedIds.includes(id)) {
                  return (
                    <span className='tag is-success ml-2' key={key}>
                      {filename}
                      <button
                        className='delete is-small'
                        onClick={() => unCheckFile(key, id)}
                      ></button>
                    </span>
                  )
                } else {
                  return (
                    <div className='select is-expanded' key={key}>
                      <select onChange={() => selectFile(key, id)}>
                        <option value=''>不適用</option>
                        {files
                          ?.filter((file) => {
                            return file.owner == regno
                          })
                          .map((file) => {
                            const { key, filename } = file
                            return <option key={key}>{filename}</option>
                          })}
                      </select>
                    </div>
                  )
                }
              })}
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
  const [files, setFiles] = useState([])

  const { data: session } = useSession()

  const initial = session.user?.info?.initial

  const [notification, setNotification] = useState({ ...defaultNotification })

  const { setErrorMessage, setLoadingMessage, setSuccessMessage } =
    notificationWrapper(setNotification)

  const handleChange = (e, index) => {
    const { value } = e.target
    setSelectedRows((prevRows) => {
      const newRows = prevRows.map((row, n) => {
        if (index == n || index == undefined) {
          return Object.assign({}, row, {
            reasonForAbsence: value,
            isLeaveOfAbsence: value !== ''
          })
        }
        return row
      })
      return newRows
    })
  }

  const handleConfirm = async () => {
    setLoadingMessage()
    if (selectedRows.length === 0) {
      setErrorMessage('Please select files to upload')
      return
    }
    const formData = new FormData()

    selectedRows.forEach((row) => {
      formData.append('rows', JSON.stringify({ ...row, initial }))
    })

    files.forEach(({ key, checkedIds, file }) => {
      const relatedRows = selectedRows.filter(({ id }) =>
        checkedIds.includes(id)
      )

      const eventDates = relatedRows.map((row) => row.eventDate).join(',')
      const { regno, classcode, classno, cname, ename } = relatedRows[0]

      const filename = `${eventDates}_${regno}_${classcode}${String(classno).padStart(2, 0)}_${cname || ename}_${initial}.pdf`

      formData.append(
        'fileData',
        JSON.stringify({
          key,
          checkedIds,
          filename
        })
      )

      formData.append('files', file, filename)
    })

    try {
      console.log(formData)
      const response = await fetch('/api/attendances/edit', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message)
      }
      setSuccessMessage(
        `Files uploaded successfully: ${result.data.length} images are uploaded`
      )
      // setFiles([])
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`)
    }
    //
    // do something to submit
    tableRef?.current.dt().ajax.reload()
    clearFiles()

    setIsModalActive(false)
  }

  const handleFileChange = (row, e) => {
    const { id, regno } = row
    const key = id
    const owner = regno
    const filename = getFilenameFromRow(row)

    setFiles((files) => {
      const newFiles = files.filter((file) => file.key != id)

      newFiles.push({
        key,
        filename,
        owner,
        file: e.target.files[0],
        checkedIds: [id]
      })

      return newFiles
    })
  }

  const selectFile = (key, id) => {
    setFiles((files) => {
      const newFiles = [...files]

      const found = newFiles.find((file) => file.key == key)

      if (found) {
        found.checkedIds.push(id)
      }
      return newFiles
    })
  }

  const unCheckFile = (key, id) => {
    setFiles((files) => {
      const newFiles = [...files]

      if (key == id) {
        return newFiles.filter((file) => file.key !== key)
      }

      const found = newFiles.find((file) => file.key == key)

      if (found) {
        found.checkedIds = found.checkedIds.filter(
          (checkedId) => checkedId !== id
        )
      }

      return newFiles
    })
  }

  const clearFiles = () => {
    setFiles([])
  }

  if (!isModalActive) return null
  return (
    <>
      <div className={`modal ${isModalActive && 'is-active'}`}>
        <div className='modal-background'></div>
        <div className='modal-content' style={{ width: '70%' }}>
          <div className='box'>
            <h1 className='title'>Edit Record</h1>

            <Notification {...notification} />
            <CustomSelect handleChange={handleChange} />

            <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Date</th>
                  <th style={{ width: '10%' }}>Type</th>
                  <th style={{ width: '15%' }}>Student</th>
                  <th style={{ width: '20%' }}>Status</th>
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
                          return `${cTitle}`
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
                          files={files}
                          row={row}
                          selectFile={selectFile}
                          unCheckFile={unCheckFile}
                          handleFileChange={(e) => handleFileChange(row, e)}
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
                  clearFiles()
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
            clearFiles()
          }}
        ></button>
      </div>
    </>
  )
}
