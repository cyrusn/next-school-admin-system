import Nav from './nav'

export default function DutyList() {
  const id = process.env.NEXT_PUBLIC_ACADEMIC_FOLDER_DRIVE_ID
  const src = `https://drive.google.com/embeddedfolderview?id=${id}#grid`
  return (
    <>
      <Nav />
      <iframe
        width='100%'
        height='500'
        src={src}
        style={{ border: 'none' }}
      ></iframe>
    </>
  )
}
