import TextAreaInput from '@/components/form/textAreaInput'

const DescriptionInput = (props) => {
  return (
    <div className='field is-horizontal'>
      <div className='field-label is-normal'>
        <label className='label'>Description</label>
      </div>
      <div className='field-body'>
        <div className='field'>
          <TextAreaInput {...props} rows='5'/>
        </div>
      </div>
    </div>
  )
}

export default DescriptionInput
