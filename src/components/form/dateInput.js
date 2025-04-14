import ErrorLabel from '@/components/form/errorLabel'

const DateInput = ({
  error,
  value,
  handleChange,
  name,
  min,
  max,
  className,
  disabled = false,
  type = 'date'
}) => {
  return (
    <div className={`control ${className}`}>
      <input
        name={name}
        disabled={disabled}
        type={type}
        className={`input ${error ? 'is-danger' : ''}`}
        min={min}
        max={max}
        onChange={handleChange}
        value={value}
      />
      <ErrorLabel error={error} />
    </div>
  )
}

export default DateInput
