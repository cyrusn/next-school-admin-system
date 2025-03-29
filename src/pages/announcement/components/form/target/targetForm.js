import ErrorLabel from '../errorLabel'

const TargetForm = ({ handleChange, errors, formData }) => {
  const forms = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']
  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <div
              className={`select is-multiple ${errors.target && 'is-danger'}`}
            >
              <select name='target' onChange={handleChange} multiple size='7'>
                <option value='' disabled>
                  Please select Form
                </option>
                {forms.map((f, i) => (
                  <option value={f} key={i}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <ErrorLabel error={errors.target} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default TargetForm
