import House from './target/house'
import TargetForm from './target/targetForm'
import FormInput from '@/components/form/formInput'

const Target = (props) => {
  const { handleChange, formData, errors } = props
  const { targetType, target } = formData

  switch (parseInt(targetType)) {
    case 0:
      return null
    case 1:
      return <House {...props} />
    case 2:
      return <TargetForm {...props} />
    default:
      return (
        <div className='field is-horizontal'>
          <div className='field-label is-normal'>
            <label className='label'></label>
          </div>
          <div className='field-body'>
            <div className='field'>
              <FormInput
                name='target'
                label='target'
                handleChange={handleChange}
                value={target}
                placeholder=''
                error={errors.target}
              />
            </div>
          </div>
        </div>
      )
  }
}

export default Target
