const Date = ({ handleChange, errors, formData, min }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label'>
        <label className='label'>Date</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <input
              name='date'
              type='date'
              className={`input ${errors.date && 'is-danger'}`}
              min={min}
              onChange={handleChange}
              value={formData.date}
              required
            />
            {errors.date && (
              <label className='help is-danger'>{errors.date}</label>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Date
