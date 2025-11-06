const ErrorLabel = ({ error }) => {
  return error && <label className='help is-danger'>{error}</label>
}

export default ErrorLabel
