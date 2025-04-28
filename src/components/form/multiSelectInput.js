import ErrorLabel from './errorLabel'

const MultiSelectInput = ({
  name,
  error,
  handleChange,
  size = 6,
  value,
  children,
  className,
  placeholder,
  ref,
  disabled = false,
  helptext
}) => {
  return (
    <div className={`control ${className || ''}`}>
      <div
        className={`select is-multiple is-fullwidth ${error ? 'is-danger' : ''}`}
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
          ) : null}
          {children}
        </select>
      </div>
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
      <ErrorLabel error={error} />
    </div>
  )
}
export default MultiSelectInput
