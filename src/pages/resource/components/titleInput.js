import FormInput from '@/components/form/formInput'

const TitleInput = (props) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>Title</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          {' '}
          <FormInput {...props} />
          <p className='help is-warning'>
            同事請於活動後收拾好所帶來的物資，以便其他同事借用。如借用告示版，亦請清走告示版上的內容。
          </p>
        </div>
      </div>
    </div>
  )
}
export default TitleInput
