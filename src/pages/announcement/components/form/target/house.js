import ErrorLabel from '@/components/form/errorLabel'
import SelectInput from '@/components/form/selectInput'

const House = ({ handleChange, errors, formData }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <SelectInput
            name='target'
            error={errors.target}
            value={formData.target}
            handleChange={handleChange}
          >
            <option value='Red'>Red</option>
            <option value='Yellow'>Yellow</option>
            <option value='Blue'>Blue</option>
            <option value='Green'>Green</option>
          </SelectInput>
        </div>
      </div>
    </div>
  )
}
export default House
