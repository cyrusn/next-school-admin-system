import ErrorLabel from '../errorLabel'

const House = ({ handleChange, errors, formData }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <div className={`select ${errors.target && 'is-danger'}`}>
              <select
                name='target'
                onChange={handleChange}
                value={formData.target}
              >
                <option value='' disabled>
                  Please select House
                </option>
                <option value='Red'>Red</option>
                <option value='Yellow'>Yellow</option>
                <option value='Blue'>Blue</option>
                <option value='Green'>Green</option>
              </select>
            </div>
            <ErrorLabel error={errors.target} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default House
