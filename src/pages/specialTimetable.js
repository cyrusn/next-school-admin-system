import { useSettings } from '@/context/settingsContext'

export default function SpecialTimetable() {
  const { settings } = useSettings()
  const id = settings.SPECIAL_TIMETABLE_FOLDER_DRIVE_ID || process.env.SPECIAL_TIMETABLE_FOLDER_DRIVE_ID

  const src = id ? `https://drive.google.com/embeddedfolderview?id=${id}#grid` : ''
  return (
    <>
      <h1 className='title'>Special Timetable</h1>
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
