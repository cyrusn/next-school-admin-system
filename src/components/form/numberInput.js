import ErrorLabel from '@/components/form/errorLabel'

const NumberInput = ({
  className,
  placeholder,
  error,
  value,
  handleChange,
  name,
  min,
  max
}) => {
  return (
    <div className={`control ${className}`}>
      <input
        placeholder={placeholder}
        name={name}
        type='number'
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

export default NumberInput
