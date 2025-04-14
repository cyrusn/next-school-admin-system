import ErrorLabel from './errorLabel'

const MultiSelectInput = ({
  name,
  error,
  handleChange,
  size,
  value,
  children,
  className,
  placeholder,
  ref,
  disabled = false
}) => {
  return (
    <div className='control'>
      <div
        className={`select is-multiple ${error ? 'is-danger' : ''} ${className}`}
      >
        <select
          ref={ref}
          disabled={disabled}
          name={name}
          onChange={handleChange}
          value={value}
          multiple
          size={size}
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
export default MultiSelectInput
