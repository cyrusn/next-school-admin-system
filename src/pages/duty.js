export default function DutyList() {
  const id = process.env.NEXT_PUBLIC_DUTY_LIST_FOLDER_DRIVE_ID
  const src = `https://drive.google.com/embeddedfolderview?id=${id}#grid`
  return (
    <>
      <h1 className='title'>Duty List</h1>
      <iframe
        width='100%'
        height='500'
        src={src}
        style={{ border: 'none' }}
      ></iframe>
    </>
  )
}
