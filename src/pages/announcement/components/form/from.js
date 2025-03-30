import ErrorLabel from '@/components/form/errorLabel'
import FormInput from '@/components/form/formInput'

const From = ({ errors, handleChange, formData }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>From</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <FormInput
            name='from'
            label='From'
            handleChange={handleChange}
            value={formData.from}
            placeholder='Announcement From (Committee / Department / House ...)'
            error={errors.from}
          />
        </div>
      </div>
    </div>
  )
}
export default From
