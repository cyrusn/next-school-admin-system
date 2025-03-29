import ErrorLabel from './errorLabel'
const From = ({ errors, handleChange, formData }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label'>
        <label className='label'>From</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <input
              name='from'
              type='text'
              className={`input ${errors.from && 'is-danger'}`}
              onChange={handleChange}
              value={formData.from}
              placeholder='Announcement From (Committee / Department / House ...)'
            ></input>
            <ErrorLabel error={errors.from} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default From
