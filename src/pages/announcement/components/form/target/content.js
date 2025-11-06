import ErrorLabel from '@/components/form/errorLabel'
import { DateTime } from 'luxon'

const Content = (props) => {
  const { formData, handleChange, errors } = props

  const eventDay = DateTime.fromISO(formData.date).weekday
  let helpText = ''

  if (eventDay == 4) {
    helpText = 'English announcement on Thursday'
  }
  if (eventDay == 2) {
    helpText = 'Mandarin announcement on Tuesday'
  }

  return (
    <div className='field is-horizontal'>
      <div className='field-label'></div>
      <div className='field-body'>
        <div className='field'>
          <div className='control'>
            <textarea
              name='content'
              type='textarea'
              value={formData.content}
              className={`textarea ${errors.content && 'is-danger'}`}
              disabled={formData.announcedBy == 1}
              onChange={handleChange}
            />
            {helpText && <label className='help is-info'>{helpText}</label>}
            <ErrorLabel error={errors.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Content
