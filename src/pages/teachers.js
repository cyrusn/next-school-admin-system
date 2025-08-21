import { useUsersContext } from '@/context/usersContext'

function CustomTable({ type }) {
  const { users } = useUsersContext()
  const mappers = {
    NON_TEACHING_STAFF: '非教職員',
    TEACHING_STAFF: '教職員',
    SOCIAL_WORKER: '社工'
  }
  return (
    <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth print-table'>
      {' '}
      <caption className='title'>{mappers[type]}</caption>
      <thead>
        <tr>
          <th>Initial</th>
          <th>Email</th>
          <th>Name</th>
          <th>姓名</th>
          <th>班主任</th>
        </tr>
      </thead>
      <tbody>
        {users
          .filter((u) => u.type == type)
          .map((u, key) => {
            return (
              <tr key={key}>
                <td>{u.initial}</td>
                <td>
                  <a href={`mailto:${u.email}`}>{u.email}</a>
                </td>
                <td>{u.name}</td>
                <td>
                  {u.cname}
                  {u.title}
                </td>
                <td>{u.classMaster}</td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}

export default function Teacher() {
  return (
    <div className='columns'>
      <div class='column'>
        <CustomTable type='TEACHING_STAFF' />
      </div>
      <div class='column'>
        <CustomTable type='NON_TEACHING_STAFF' />
        <CustomTable type='SOCIAL_WORKER' />
      </div>
    </div>
  )
}
