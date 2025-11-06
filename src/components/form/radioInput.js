import ErrorLabel from '@/components/form/errorLabel'

const RadioInput = ({
  name,
  elements = [],
  checkedValue = '',
  handleChange,
  error,
  helptext
}) => {
  return (
    <div className='control'>
      {elements.map((el, index) => {
        return (
          <label className='radio mr-2' key={index}>
            <input
              type='radio'
              value={el.value}
              checked={
                Array.isArray(checkedValue)
                  ? checkedValue.includes(el.value)
                  : checkedValue == el.value
              }
              onChange={handleChange}
              name={name}
            />{' '}
            {el.title}
          </label>
        )
      })}
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
      <ErrorLabel error={error} />
    </div>
  )
}

export default RadioInput
