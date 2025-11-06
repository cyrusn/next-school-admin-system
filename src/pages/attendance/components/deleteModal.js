import { getDisplayName } from '@/lib/helper'
import { ATTENDANCE_TYPES, TIMEZONE } from '@/config/constant'
import { camelCase } from 'lodash'
import { DateTime } from 'luxon'

export default function DeleteModal({
  tableRef,
  isModalActive,
  setIsModalActive,
  selectedRows
}) {
  const handleDelete = async () => {
    if (selectedRows.length == 0) return
    const qs = selectedRows.reduce((api, row, n) => {
      const { id } = row
      if (n === 0) {
        return (api += `filters[id][$in][${n}]=${id}`)
      }
      return (api += `&filters[id][$in][${n}]=${id}`)
    }, '')

    const response = await fetch(`/api/strapi/attendances?${qs}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const json = await response.json()
      console.error(json.error)
      return
    }
    tableRef?.current.dt().ajax.reload()
    setIsModalActive(false)
  }

  if (!isModalActive) return null
  return (
    <>
      <div className={`modal ${isModalActive && 'is-active'}`}>
        <div className='modal-background'></div>
        <div className='modal-content' style={{ width: '70%' }}>
          <div className='box'>
            <h1 className='title'>Confirm to delete?</h1>
            <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Record by</th>
                  <th>Update at</th>
                </tr>
              </thead>
              <tbody>
                {selectedRows.map((row, index) => {
                  const { eventDate, type, recordedBy, updatedAt } = row
                  return (
                    <tr key={index}>
                      <td>{getDisplayName(row)}</td>
                      <td>{eventDate}</td>
                      <td>
                        {
                          ATTENDANCE_TYPES.find(
                            ({ key }) => key === camelCase(type)
                          )?.cTitle
                        }
                      </td>
                      <td>{recordedBy}</td>
                      <td>
                        {DateTime.fromISO(updatedAt)
                          .setZone(TIMEZONE)
                          .toFormat('yyyy-MM-dd HH:mm')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className='buttons is-grounded'>
              <button className='button is-danger' onClick={handleDelete}>
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
