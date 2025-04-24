import { when } from 'jquery'

const RadioInput = ({
  name,
  elements = [],
  checkedValue = '',
  handleChange,
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
              checked={checkedValue == el.value}
              onChange={handleChange}
              name={name}
            />{' '}
            {el.title}
          </label>
        )
      })}
      {helptext ? <p className='help is-info'>{helptext} </p> : null}
    </div>
  )
}

export default RadioInput
