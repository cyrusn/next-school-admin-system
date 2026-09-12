import Nav from './nav'
import { useSettings } from '@/context/settingsContext'
import DriveFolderBrowser from '@/components/driveFolderBrowser'

export default function AcademicDocuments() {
  const { settings } = useSettings()
  const id = settings.ACADEMIC_FOLDER_DRIVE_ID
  return (
    <>
      <Nav />
      <DriveFolderBrowser rootFolderId={id} rootName="Academic Documents" />
    </>
  )
}
