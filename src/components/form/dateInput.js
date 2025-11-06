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
  type = 'date',
  helptext
}) => {
  return (
    <div className={`control ${className || ''}`}>
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
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
      <ErrorLabel error={error} />
    </div>
  )
}

export default DateInput
