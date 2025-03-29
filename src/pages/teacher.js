import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function Teacher() {
  const { data: session, status } = useSession()
  const [sheetData, setSheetData] = useState([])
  const [error, setError] = useState(null)

  //useEffect(() => {
  //  if (session) {
  //    fetch('/api/teacher')
  //      .then((res) => {
  //        if (!res.ok) {
  //          throw new Error('Unauthorized access or error fetching data')
  //        }
  //        return res.json()
  //      })
  //      .then((data) => setSheetData(data))
  //      .catch((err) => setError(err.message))
  //  }
  //}, [session])

  const onClick = async () => {
    const res = await fetch('/api/teacher')
    if (!res.ok) {
      throw new Error('Unauthorized access or error fetching data')
    }
    const data = await res.json()
    setSheetData(data)
  }
  return (
    <div>
      <h1>This is Teacher Page</h1>

      {status === 'loading' && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {sheetData.map((teacher, index) => (
          <li key={index}>{teacher.email}</li>
        ))}
      </ul>
      <button className='button' onClick={onClick}>
        Click me
      </button>
    </div>
  )
}
