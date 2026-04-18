import Nav from './nav'
import { useSettings } from '@/context/settingsContext'

export default function DutyList() {
  const { settings } = useSettings()
  const id = settings.ACADEMIC_FOLDER_DRIVE_ID || process.env.ACADEMIC_FOLDER_DRIVE_ID
  const src = id ? `https://drive.google.com/embeddedfolderview?id=${id}#grid` : ''
  return (
    <>
      <Nav />
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
