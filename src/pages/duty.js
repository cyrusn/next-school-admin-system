import { useSettings } from '@/context/settingsContext'
import DriveFolderBrowser from '@/components/driveFolderBrowser'

export default function DutyList() {
  const { settings } = useSettings()
  const id = settings.DUTY_LIST_FOLDER_DRIVE_ID

  return (
    <>
      <h1 className='title'>Duty List</h1>
      <DriveFolderBrowser rootFolderId={id} rootName="Duty List" />
    </>
  )
}
