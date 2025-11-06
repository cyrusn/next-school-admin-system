import { useState, useRef, useEffect } from 'react'
import { GRADES, ROLES } from '@/lib/eca/constant'
import SelectInput from '@/components/form/selectInput'
import RadioInput from '@/components/form/radioInput'
import CheckboxInput from '@/components/form/checkboxInput'

import Notification, {
  notificationWrapper,
  defaultNotification
} from '@/components/notification'

export default function EditModal({
  isEdit,
  selectedMembers,
  setIsEdit,
  fetchSearch
}) {
  const defaultFormData = {
    role: '',
    grade: '',
    isNominated: ''
  }
  const [formData, setFormData] = useState({ ...defaultFormData })
  const [filters, setFilters] = useState([])
  const [notification, setNotification] = useState({ ...defaultNotification })
  const { setLoadingMessage, setErrorMessage, clearMessage } =
    notificationWrapper(setNotification)

  const handleFilters = (e) => {
    const { value, name } = e.target
    setFilters((filters) => {
      const newFilters = [...filters]
      let result
      if (newFilters.includes(value)) {
        result = newFilters.filter((filter) => filter != value)
      } else {
        result = [...newFilters, value]
      }

      console.log(result)

      setFormData((formData) => {
        const newFormData = {}
        Object.keys(formData).forEach((key) => {
          if (result.includes(key)) {
            newFormData[key] = formData[key]
          }
        })
        return newFormData
      })

      return result
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((formData) => {
      let newFormData
      if (name == 'isNominated') {
        newFormData = { ...formData, isNominated: value == 'true' }
      } else {
        newFormData = { ...formData, [name]: value }
      }
      return newFormData
    })
  }

  const handleDelete = async () => {
    const ranges = selectedMembers.current.map(({ range }) => range)
    console.log(ranges)
    try {
      setLoadingMessage()
      const response = await fetch('/api/eca/members', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ranges })
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.error)
      }
      fetchSearch()
      selectedMembers.current = []
      handleCancel()
      clearMessage()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleCancel = () => {
    setFilters([])
    setFormData({ ...defaultFormData })
    setIsEdit(false)
  }

  const handleConfirm = async () => {
    const rangeObjects = selectedMembers.current.map((rowData) => {
      const newData = { ...rowData }

      for (const key in formData) {
        newData[key] = formData[key]
      }

      return newData
    })

    try {
      setLoadingMessage()
      const response = await fetch('/api/eca/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rangeObjects })
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.error)
      }
      fetchSearch()
      handleCancel()
      clearMessage()
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className={`modal ${isEdit && 'is-active'}`}>
      <div className='modal-background'></div>
      <div className='modal-content' style={{ width: '70%' }}>
        <div className='box'>
          <Notification {...notification} />
          <h1 className='title'>Update members information</h1>
          <div className='tags'>
            {selectedMembers.current.map((member, index) => {
              const { classcodeAndNo, studentName } = member
              return (
                <span className='tag is-warning' key={index}>
                  {`${classcodeAndNo}${studentName}`}
                </span>
              )
            })}
          </div>
          <div className='field is-horizontal'>
            <div className='field-label is-normal'></div>
            <div className='field-body'>
              <div className='field'>
                <CheckboxInput
                  elements={[
                    { value: 'role', title: 'Role' },
                    { value: 'grade', title: 'Grade' },
                    { value: 'isNominated', title: 'Nominated' }
                  ]}
                  name='filters'
                  handleChange={handleFilters}
                  selectedBoxes={filters}
                />
                <span className='help is-info'>Select fields to update</span>
              </div>
            </div>
          </div>
          {filters.includes('role') && (
            <div className='field is-horizontal'>
              <div className='field-label is-normal'>
                <label className='label'>Role</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <SelectInput
                    name='role'
                    handleChange={handleChange}
                    value={formData.role}
                  >
                    <option value={undefined}>Unchange Role</option>
                    <option value=''>Clear Role</option>

                    {ROLES.map((role, index) => {
                      const { cname } = role
                      return (
                        <option value={cname} key={index}>
                          {cname}
                        </option>
                      )
                    })}
                  </SelectInput>
                </div>
              </div>
            </div>
          )}
          {filters.includes('grade') && (
            <div className='field is-horizontal'>
              <div className='field-label is-normal'>
                <label className='label'>Grade</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <SelectInput
                    name='grade'
                    handleChange={handleChange}
                    value={formData.grade}
                  >
                    <option value={undefined}>Unchange Grade</option>
                    <option value=''>Clear Grade</option>

                    {GRADES.map((grade, index) => {
                      return (
                        <option value={grade} key={index}>
                          {grade}
                        </option>
                      )
                    })}
                  </SelectInput>
                </div>
              </div>
            </div>
          )}
          {filters.includes('isNominated') && (
            <div className='field is-horizontal'>
              <div className='field-label is-normal'>
                <label className='label'>Nominated</label>
              </div>
              <div className='field-body'>
                <div className='field'>
                  <RadioInput
                    elements={[
                      { value: true, title: 'NOMINATED' },
                      { value: '', title: 'DO NOT NOMINATED' }
                    ]}
                    name='isNominated'
                    handleChange={handleChange}
                    checkedValue={formData.isNominated == true}
                  />
                </div>
              </div>
            </div>
          )}
          <div className='buttons is-grouped'>
            <button
              className='button is-info'
              disabled={selectedMembers.current?.length == 0}
              onClick={handleConfirm}
            >
              Confirm
            </button>
            <button className='button is-danger' onClick={handleDelete}>
              Delete
            </button>
            <button className='button is-warning' onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button
        className='modal-close is-large'
        aria-label='close'
        onClick={() => {
          setIsEdit(false)
        }}
      ></button>
    </div>
  )
}
