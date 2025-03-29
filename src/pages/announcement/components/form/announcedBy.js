import { useSession } from 'next-auth/react'

const AnnouncedBy = ({ handleChange, formData }) => {
  const { data: session, status } = useSession()
  return session ? (
    <div className='field is-horizontal'>
      <div className='field-label'>
        <label className='label'>Announced by</label>
      </div>
      <div className='field-body'>
        <div className='field is-narrow'>
          <div className='control'>
            <label className='radio'>
              <input
                type='radio'
                value='0'
                checked={parseInt(formData.announcedBy) == 0}
                onChange={handleChange}
                name='announcedBy'
              />{' '}
              Student announcer
            </label>{' '}
            <label className='radio'>
              <input
                type='radio'
                value='1'
                checked={parseInt(formData.announcedBy) == 1}
                onChange={handleChange}
                name='announcedBy'
              />{' '}
              Teacher in charge (<span>{session.user.info.initial}</span>)
            </label>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div />
  )
}
export default AnnouncedBy
