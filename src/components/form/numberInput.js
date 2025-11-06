import ErrorLabel from '@/components/form/errorLabel'

const NumberInput = ({
  className,
  placeholder,
  error,
  value,
  handleChange,
  name,
  min,
  max,
  disabled = false,
  helptext
}) => {
  return (
    <div className={`control ${className || ''}`}>
      <input
        disabled={disabled}
        placeholder={placeholder}
        name={name}
        type='number'
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

export default NumberInput
