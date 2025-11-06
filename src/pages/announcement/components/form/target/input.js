import ErrorLabel from '@/components/form/errorLabel'

const Input = (props) => {
  const { formData, handleChange, errors } = props
  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <input
              name='target'
              type='input'
              className={`input ${errors.target && 'is-danger'}`}
              onChange={handleChange}
            />
            <ErrorLabel error={errors.target} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Input
