const SetupInput = ({ value, handleChange, name }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-narrow'>
        <label className='label'>Setup</label>
      </div>
      <div className='field-body'>
        <div className='field is-narrow'>
          <div className='control '>
            <label className='checkbox'>
              <input
                type='checkbox'
                name={name}
                checked={value}
                onChange={handleChange}
              />{' '}
              Ask help from janitors for setup?
            </label>
          </div>
          {Boolean(value) ? (
            <div>
              <p className='help'>
                !! Janitor can only setup at{' '}
                <span className='has-text-info'>
                  09:00 - 10:00 or 14:00 - 15:00.
                </span>{' '}
                Any further arrangements, please contact HL in person
              </p>
              <p className='help'>
                !!! Please state the{' '}
                <span className='has-text-sucess'>setup details</span> in
                description session. If you have a{' '}
                <span className='has-text-info'>
                  {' '}
                  further information of the setup{' '}
                </span>{' '}
                , Please{' '}
                <span className='has-text-danger'>
                  add an image attachment
                </span>{' '}
                through Google Calendar after submitted the form{' '}
                <span className='has-text-success'>successfully</span>{' '}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default SetupInput
