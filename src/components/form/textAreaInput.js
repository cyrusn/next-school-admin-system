import ErrorLabel from '@/components/form/errorLabel'

const FormInput = (props) => {
  const {
    value,
    className,
    handleChange,
    error,
    name,
    placeholder,
    rows = 3
  } = props
  return (
    <div className={`control ${className || ''}`}>
      <textarea
        name={name}
        type='textarea'
        rows={rows}
        value={value}
        className={`textarea ${error ? 'is-danger' : ''}`}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <ErrorLabel error={error} />
    </div>
  )
}
export default FormInput
