import SelectInput from '@/components/form/selectInput'
import FormInput from '@/components/form/formInput'
import { useState, useEffect } from 'react'
import { TODAY } from '@/config/constant'

const RecurrenceInput = ({ handleChange, formData, errors }) => {
  const { rruleType, rruleFreq, rruleValue } = formData
  const [helpText, setHelpText] = useState('')
  const [valueType, setValueType] = useState('')

  useEffect(() => {
    switch (rruleType) {
      case 'REPEAT_UNTIL':
        setValueType('date')
        setHelpText('Please select the end date of the recurrence')
        break
      case 'REPEAT_COUNT':
        setValueType('number')
        setHelpText('Please enter the number of occurrences')
        break
      case 'RDATE':
        setValueType('text')
        setHelpText(
          'Please enter the dates of occurrences, separated by comma. e.g. 20230312,20230315'
        )
        break
      case 'CUSTOM':
        setValueType('text')
        setHelpText(
          'Please make sure you understand of RRULE and RDATE are. <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank">ref. rfc5545</a>'
        )
        break
      default:
        setValueType('')
        setHelpText('')
    }
  }, [rruleType])

  return (
    <>
      <div className='field is-horizontal'>
        <div className='field-label is-normal'>
          <label className='label'>Recurrence</label>
        </div>
        <div className='field-body'>
          <div className='field'>
            <SelectInput
              handleChange={handleChange}
              value={rruleType}
              name='rruleType'
              error={errors.rruleType}
            >
              <option value=''>Please select recurrence type in need</option>
              <option value='REPEAT_UNTIL'>Repeat until given date</option>
              <option value='REPEAT_COUNT'>Repeat by no of occurrences</option>
              <option value='RDATE'>Repeat on certain dates</option>
              <option value='CUSTOM'>Use pure RRULE strings</option>
            </SelectInput>
          </div>
        </div>
      </div>

      {rruleType == 'REPEAT_COUNT' || rruleType == 'REPEAT_UNTIL' ? (
        <div className='field is-horizontal'>
          <div className='field-label'></div>
          <div className='field-body'>
            <div className='field'>
              <SelectInput
                name='rruleFreq'
                handleChange={handleChange}
                value={rruleFreq}
                error={errors.rruleFreq}
              >
                <option value=''>Please select the frequency</option>
                <option value='DAILY'>Daily</option>
                <option value='WEEKLY'>Weekly</option>
                <option value='MONTHLY'>Monthly</option>
              </SelectInput>
            </div>
          </div>
        </div>
      ) : null}

      {rruleType == 'RDATE' ||
      rruleType == 'CUSTOM' ||
      (rruleType == 'REPEAT_UNTIL' && rruleFreq) ||
      (rruleType == 'REPEAT_COUNT' && rruleFreq) ? (
        <div className='field is-horizontal'>
          <div className='field-label'></div>
          <div className='field-body'>
            <div className='field'>
              <FormInput
                type={valueType}
                name='rruleValue'
                handleChange={handleChange}
                value={rruleValue || `${valueType == 'date' ? TODAY : ''}`}
                error={errors.rruleValue}
              />
              <p className='help'>{helpText}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default RecurrenceInput
