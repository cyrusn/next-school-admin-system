const targetType = ({ handleChange, formData }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label'>
        <label className='label'>To</label>
      </div>
      <div className='field-body'>
        <div className='field is-narrow'>
          <div className='control'>
            <label className='radio'>
              <input
                type='radio'
                value='0'
                checked={parseInt(formData.targetType) == 0}
                name='targetType'
                onChange={handleChange}
              />{' '}
              All
            </label>{' '}
            <label className='radio'>
              <input
                type='radio'
                value='1'
                name='targetType'
                checked={parseInt(formData.targetType) == 1}
                onChange={handleChange}
              />{' '}
              House
            </label>{' '}
            <label className='radio'>
              <input
                type='radio'
                value='2'
                name='targetType'
                checked={parseInt(formData.targetType) == 2}
                onChange={handleChange}
              />{' '}
              Forms
            </label>{' '}
            <label className='radio'>
              <input
                type='radio'
                value='3'
                name='targetType'
                checked={parseInt(formData.targetType) == 3}
                onChange={handleChange}
              />{' '}
              Committee
            </label>{' '}
            <label className='radio'>
              <input
                type='radio'
                value='4'
                name='targetType'
                checked={parseInt(formData.targetType) == 4}
                onChange={handleChange}
              />{' '}
              Club
            </label>{' '}
            <label className='radio'>
              <input
                type='radio'
                value='5'
                name='targetType'
                checked={parseInt(formData.targetType) == 5}
                onChange={handleChange}
              />{' '}
              Others
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
export default targetType
