import ErrorLabel from '@/components/form/errorLabel'

const SelectInput = ({
  className,
  name,
  error,
  children,
  handleChange,
  value,
  placeholder,
  disabled = false,
  helptext
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
          ) : null}
          {children}
        </select>
      </div>
      <ErrorLabel error={error} />
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
    </div>
  )
}
export default SelectInput
