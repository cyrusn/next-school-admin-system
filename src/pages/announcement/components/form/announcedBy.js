import { useSession } from 'next-auth/react'
import RadioInput from '@/components/form/radioInput'
import { parseInt } from 'lodash'

const AnnouncedBy = ({ handleChange, formData }) => {
  const { data: session, status } = useSession()
  const elements = [
    { value: 0, title: 'Student announcer' },
    { value: 1, title: `Teacher in charge (${session.user.info.initial})` }
  ]
  return session ? (
    <div className='field is-horizontal'>
      <div className='field-label'>
        <label className='label'>Announced by</label>
      </div>
      <div className='field-body'>
        <div className='field is-narrow'>
          <RadioInput
            elements={elements}
            name='announcedBy'
            handleChange={handleChange}
            checkedValue={parseInt(formData.announcedBy)}
          />
        </div>
      </div>
    </div>
  ) : (
    <div />
  )
}
export default AnnouncedBy
