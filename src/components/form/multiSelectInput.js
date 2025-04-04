import ErrorLabel from './errorLabel'

const MultiSelectInput = ({
  name,
  error,
  handleChange,
  size,
  value,
  children,
  className
}) => {
  return (
    <div className='control'>
      <div
        className={`select is-multiple ${error ? 'is-danger' : ''} ${className}`}
      >
        <select
          name={name}
          onChange={handleChange}
          value={value}
          multiple
          size={size}
        >
          <option value='' disabled>
            Please select
          </option>
          {children}
        </select>
      </div>
      <ErrorLabel error={error} />
    </div>
  )
}
export default MultiSelectInput
