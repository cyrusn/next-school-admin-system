import RadioInput from '@/components/form/radioInput'

const targetType = ({ handleChange, formData }) => {
  const elements = [
    { value: 0, title: 'All' },
    { value: 1, title: 'House' },
    { value: 2, title: 'Forms' },
    { value: 3, title: 'Committee' },
    { value: 4, title: 'Club' },
    { value: 5, title: 'Others' }
  ]
  return (
    <div className='field is-horizontal'>
      <div className='field-label'>
        <label className='label'>To</label>
      </div>
      <div className='field-body'>
        <div className='field is-narrow'>
          <div className='control'>
            <RadioInput
              elements={elements}
              name='targetType'
              handleChange={handleChange}
              checkedValue={parseInt(formData.targetType)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default targetType
