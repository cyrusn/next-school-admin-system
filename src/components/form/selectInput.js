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
  helptext,
  tabIndex
}) => {
  return (
    <div className={`control ${className || ''}`}>
      <div className={`select is-fullwidth ${error ? 'is-danger' : ''}`}>
        <select
          name={name}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          tabIndex={tabIndex}
        >
          {placeholder ? (
            <option value='' disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
      </div>
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
      <ErrorLabel error={error} />
    </div>
  )
}
export default SelectInput
