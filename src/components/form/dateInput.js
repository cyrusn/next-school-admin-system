import ErrorLabel from '@/components/form/errorLabel'

const DateInput = ({ error, value, handleChange, name, min }) => {
  return (
    <div className='control'>
      <input
        name={name}
        type='date'
        className={`input ${error && 'is-danger'}`}
        min={min}
        onChange={handleChange}
        value={value}
        required
      />
      <ErrorLabel error={error} />
    </div>
  )
}

export default DateInput
