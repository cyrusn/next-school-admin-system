import ErrorLabel from '@/components/form/errorLabel'

const SelectInput = ({
  className,
  name,
  error,
  children,
  handleChange,
  value,
  title = 'Please select'
}) => {
  return (
    <div className={`control ${className}`}>
      <div className={`select is-fullwidth ${error ? 'is-danger' : ''}`}>
        <select name={name} onChange={handleChange} value={value}>
          <option value='' disabled>
            {title}
          </option>
          {children}
        </select>
      </div>
      <ErrorLabel error={error} />
    </div>
  )
}
export default SelectInput
