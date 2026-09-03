import { useSettings } from '@/context/settingsContext'

export default function Schedules() {
  const { settings } = useSettings()
  const id = settings.SCHEDULES_FOLDER_DRIVE_ID

  const src = id ? `https://drive.google.com/embeddedfolderview?id=${id}#grid` : ''
  return (
    <>
      <h1 className='title'>Schedules</h1>
      {id && (
        <div className='block mb-4'>
          <a
            className='button is-link'
            href={`https://drive.google.com/drive/folders/${id}`}
            target='_blank'
            rel='noreferrer'
          >
            Open in Google Drive
          </a>
        </div>
      )}
      {id && (
        <iframe
          width='100%'
          height='500'
          src={src}
          style={{ border: 'none' }}
        ></iframe>
      )}
    </>
  )
}
