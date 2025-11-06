import DateInput from '@/components/form/dateInput'

const Date = ({ handleChange, errors, formData, min }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>Date</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <DateInput
            name='date'
            error={errors.date}
            min={min}
            handleChange={handleChange}
            value={formData.date}
          />
        </div>
      </div>
    </div>
  )
}
export default Date
