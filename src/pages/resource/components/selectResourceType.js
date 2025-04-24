import { useState, useEffect } from 'react'
import SelectInput from '@/components/form/selectInput'

export default function SelectResourceType(props) {
  const { types } = props
  const [resourceTypes, setResourceTypes] = useState([])

  if (!types.length) return null

  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>Type</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <SelectInput {...props}>
            <option value=''>Please select type</option>
            {types.map((type, n) => {
              return (
                <option value={type} key={n}>
                  {type}
                </option>
              )
            })}
          </SelectInput>
        </div>
      </div>
    </div>
  )
}
