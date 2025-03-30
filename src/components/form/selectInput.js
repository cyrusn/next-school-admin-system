import ErrorLabel from '@/components/form/errorLabel'

const SelectInput = ({ name, error, children, handleChange, value }) => {
  return (
    <div className='control'>
      <div className={`select ${error && 'is-danger'}`}>
        <select name={name} onChange={handleChange} value={value}>
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
export default SelectInput
