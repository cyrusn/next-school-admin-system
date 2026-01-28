import { useUsersContext } from '@/context/usersContext'

function CustomTable({ type }) {
  const { users } = useUsersContext()
  const mappers = {
    NON_TEACHING_STAFF: '非教職員',
    TEACHING_STAFF: '教職員',
    SOCIAL_WORKER: '社工',
    SUBSTITUDE_TEACHING_STAFF: '代課老師'
  }
  const filteredUsers = users.filter((u) => u.type == type)

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
            <>
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
            </>
          )
        })}
        <tr>
          <td colSpan='5' className='has-text-right'>
            Total: {filteredUsers.length}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default function Teacher() {
  return (
    <div className='columns print-50'>
      <div class='column'>
        <CustomTable type='TEACHING_STAFF' />
      </div>
      <div class='column'>
        <CustomTable type='NON_TEACHING_STAFF' />
        <CustomTable type='SOCIAL_WORKER' />
        <CustomTable type='SUBSTITUDE_TEACHING_STAFF' />
      </div>
    </div>
  )
}
