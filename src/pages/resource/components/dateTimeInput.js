const DateTimeInput = ({ startTime, endTime, handleChange }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>Event Date</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control is-expanded '>
            <div className='field'>
              <input
                className='input'
                name='startTime'
                type='datetime-local'
                value={startTime}
                onChange={handleChange}
              />
            </div>
          </div>
          <p className='help is-info'>Start Time (Required) </p>
        </div>

        <div className='field'>
          <div className='control is-expanded'>
            <div className='field'>
              <input
                className='input'
                name='endTime'
                type='time'
                value={endTime}
                onChange={handleChange}
              />
            </div>
            <p className='help is-info'>End Time (Required)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateTimeInput
