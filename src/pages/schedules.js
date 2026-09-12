import { useSettings } from '@/context/settingsContext'
import DriveFolderBrowser from '@/components/driveFolderBrowser'

export default function Schedules() {
  const { settings } = useSettings()
  const id = settings.SCHEDULES_FOLDER_DRIVE_ID

  return (
    <>
      <h1 className='title'>Schedules</h1>
      <DriveFolderBrowser rootFolderId={id} rootName="Schedules" />
    </>
  )
}
