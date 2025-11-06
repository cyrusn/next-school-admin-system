import ErrorLabel from '@/components/form/errorLabel'

const FormInput = (props) => {
  const {
    value,
    className,
    handleChange,
    error,
    name,
    placeholder,
    rows = 3,
    disabled = false,
    helptext
  } = props
  return (
    <div className={`control ${className || ''}`}>
      <textarea
        name={name}
        disabled={disabled}
        type='textarea'
        rows={rows}
        value={value}
        className={`textarea ${error ? 'is-danger' : ''}`}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
      <ErrorLabel error={error} />
    </div>
  )
}
export default FormInput
