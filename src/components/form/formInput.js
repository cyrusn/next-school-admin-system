import ErrorLabel from '@/components/form/errorLabel'

const FormInput = (props) => {
  const {
    value,
    handleChange,
    error,
    name,
    placeholder,
    helptext,
    type = 'input'
  } = props
  return (
    <div className='control'>
      <input
        name={name}
        type={type}
        value={value}
        className={`input ${error ? 'is-danger' : ''}`}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <ErrorLabel error={error} />
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
    </div>
  )
}
export default FormInput
