import ErrorLabel from '@/components/form/errorLabel'

const SelectInput = ({
  className,
  name,
  error,
  children,
  handleChange,
  value,
  placeholder,
  disabled = false
}) => {
  return (
    <div className={`control ${className}`}>
      <div className={`select is-fullwidth ${error ? 'is-danger' : ''}`}>
        <select
          name={name}
          onChange={handleChange}
          value={value}
          disabled={disabled}
        >
          {placeholder ? (
            <option value='' disabled>
              {placeholder}
            </option>
          ) : (
            <></>
          )}
          {children}
        </select>
      </div>
      <ErrorLabel error={error} />
    </div>
  )
}
export default SelectInput
