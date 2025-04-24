import ErrorLabel from '@/components/form/errorLabel'
import MultiSelectInput from '@/components/form/multiSelectInput'

const TargetForm = ({ handleChange, errors, formData }) => {
  const forms = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']
  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <MultiSelectInput
            name='target'
            error={errors.target}
            size='7'
            value={formData.target}
            handleChange={handleChange}
          >
            {forms.map((f, i) => (
              <option value={f} key={i}>
                {f}
              </option>
            ))}
          </MultiSelectInput>
        </div>
      </div>
    </div>
  )
}
export default TargetForm
