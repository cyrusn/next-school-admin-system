import { useState, useEffect } from 'react'

import SelectInput from '@/components/form/selectInput'

export default function SelectResource(props) {
  const { resources } = props
  if (!resources) return null

  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>Resource</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <SelectInput {...props}>
            <option value=''>Please select resource</option>
            {resources
              .sort((a, b) => a.resourceName.localeCompare(b.resourceName))
              .map((resource) => {
                const {
                  resourceEmail,
                  resourceId,
                  resourceName,
                  floorSection
                } = resource

                return (
                  <option value={resourceEmail} key={resourceId}>
                    {resourceName} {floorSection ? ` (${floorSection})` : ''}
                  </option>
                )
              })}
          </SelectInput>
        </div>
      </div>
    </div>
  )
}
