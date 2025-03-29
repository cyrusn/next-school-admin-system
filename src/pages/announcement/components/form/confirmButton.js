const ConfirmButton = ({ isDisabled }) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <button
              type='submit'
              className='button is-info'
              disabled={isDisabled}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ConfirmButton
