import FormInput from '@/components/form/formInput'

const EmailInput = ({ name, value, handleChange, userInit, error }) => {
  const grandedUsers = ['SYSTEM']
  if (!grandedUsers.includes(userInit)) return null

  return (
    <div className='field is-horizontal'>
      <div className='field-label is-narrow'>
        <label className='label'>PIC Email</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <FormInput
            type='email'
            name={name}
            value={value}
            error={error}
            handleChange={handleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default EmailInput
