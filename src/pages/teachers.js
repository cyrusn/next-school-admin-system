import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useUsersContext } from '@/context/usersContext'

function CustomTable({ type, searchTerm }) {
  const { users } = useUsersContext()
  const mappers = {
    NON_TEACHING_STAFF: '非教職員',
    TEACHING_STAFF: '教職員',
    SOCIAL_WORKER: '社工',
    SUBSTITUDE_TEACHING_STAFF: '代課老師'
  }
  
  let filteredUsers = users.filter((u) => u.type == type)

  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filteredUsers = filteredUsers.filter((u) => 
      (u.initial && u.initial.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.cname && u.cname.toLowerCase().includes(term)) ||
      (u.classMaster && u.classMaster.toLowerCase().includes(term))
    )
  }

  if (filteredUsers.length == 0) return <></>

  return (
    <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth print-table print-font-small'>
      <caption className='is-size-4'>{mappers[type]}</caption>
      <thead>
        <tr>
          <th>Initial</th>
          <th>Email</th>
          <th>Name</th>
          <th>姓名</th>
          {type == 'TEACHING_STAFF' && <th>班主任</th>}
          <th style={{ width: '5%' }} className='print-only'></th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((u, key) => {
          return (
            <tr key={key}>
              <td>{u.initial}</td>
              <td>
                <a href={`mailto:${u.email}`}>{u.email}</a>
              </td>
              <td
                className={
                  u.name?.length > 16
                    ? 'is-size-7 is-align-content-center'
                    : ''
                }
              >
                {u.name}
              </td>
              <td>
                {u.cname}
                {u.title}
              </td>
              {type == 'TEACHING_STAFF' && <td>{u.classMaster}</td>}
              <td style={{ width: '5%' }} className='print-only'></td>
            </tr>
          )
        })}
        <tr>
          <td colSpan={type == 'TEACHING_STAFF' ? 6 : 5} className='has-text-right'>
            Total: {filteredUsers.length}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default function Teacher() {
  const router = useRouter()
  const { query, isReady } = router

  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)
  const initialized = useRef(false)

  // Hydrate search from URL query
  useEffect(() => {
    if (isReady && !initialized.current) {
      if (query.search) {
        setSearchTerm(query.search)
      }
      initialized.current = true
    }
  }, [isReady, query])

  // Sync URL with search input
  useEffect(() => {
    if (initialized.current) {
      const params = new URLSearchParams()
      if (searchTerm) {
        params.set('search', searchTerm)
      }
      
      const newQuery = params.toString()
      const newPath = `/teachers${newQuery ? `?${newQuery}` : ''}`
      
      if (window.location.search !== `?${newQuery}` && (window.location.search || newQuery)) {
        window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath)
      }
    }
  }, [searchTerm])

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className='field mb-4 print-hidden'>
        <div className='control'>
          <input
            className='input'
            type='text'
            placeholder='Search by name, initial, email...'
            value={searchTerm}
            ref={searchInputRef}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='columns print-50'>
        <div className='column'>
          <CustomTable type='TEACHING_STAFF' searchTerm={searchTerm} />
        </div>
        <div className='column'>
          <CustomTable type='NON_TEACHING_STAFF' searchTerm={searchTerm} />
          <CustomTable type='SOCIAL_WORKER' searchTerm={searchTerm} />
          <CustomTable type='SUBSTITUDE_TEACHING_STAFF' searchTerm={searchTerm} />
        </div>
      </div>
    </>
  )
}
