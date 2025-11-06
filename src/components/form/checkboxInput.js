export const CheckboxInput = ({
  selectedBoxes,
  elements,
  handleChange,
  name,
  className,
  helptext
}) => {
  return (
    <div className='control'>
      {elements.map((el, index) => {
        return (
          <label className={`checkbox mr-3 ${className || ''}`} key={index}>
            <input
              type='checkbox'
              name={name}
              value={el.value}
              checked={selectedBoxes.includes(el.value)}
              onChange={handleChange}
            />{' '}
            {el.title}
          </label>
        )
      })}
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
    </div>
  )
}

export default CheckboxInput
