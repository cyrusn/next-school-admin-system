import { useSession } from 'next-auth/react'
import { useUsersContext } from '@/context/usersContext'

export default function SubstitutionRecord() {
  const { data: session } = useSession()
  const { users } = useUsersContext()

  const currentTeacherInitial = session?.user?.info?.initial
  const currentUserRecord = users.find((u) => u.initial === currentTeacherInitial)

  return (
    <>
      <h1 className='title'>代課紀錄 (Substitution Records)</h1>

      {!currentUserRecord ? (
        <div className='notification is-warning'>
          載入中或未找到相關教師的代課紀錄。 (Loading or no substitution record found for the current teacher.)
        </div>
      ) : (
        <div className='table-container'>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
            <thead>
              <tr>
                <th>教師</th>
                <th>上學年結餘</th>
                <th>代課節數</th>
                <th>請假節數</th>
                <th>代課淨值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {currentUserRecord.cname || currentUserRecord.name} ({currentUserRecord.initial})
                </td>
                <td>{currentUserRecord.base || 0}</td>
                <td>{currentUserRecord.pureSubNumber || 0}</td>
                <td>{currentUserRecord.pureNegative || 0}</td>
                <td>{currentUserRecord.substitutionNumber || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
