export default function SpecialTimetable() {
  const id = process.env.NEXT_PUBLIC_SPECIAL_TIMETABLE_FOLDER_DRIVE_ID

  const src = `https://drive.google.com/embeddedfolderview?id=${id}#grid`
  return (
    <>
      <h1 className='title'>Special Timetable</h1>
      <iframe
        width='100%'
        height='500'
        src={src}
        style={{ border: 'none' }}
      ></iframe>
    </>
  )
}
