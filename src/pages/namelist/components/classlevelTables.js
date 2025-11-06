import { TERM, HOMEBASES } from '@/config/constant/'
import ClassReport from './classTable'
import HouseReport from './houseTable'
import { useUsersContext } from '@/context/usersContext'
import { groupBy } from 'lodash'

export default function ClasslevelReports({ report, classlevels }) {
  const { users } = useUsersContext()
  const classMasters = groupBy(
    users.filter(({ classMaster }) => classMaster),
    'classMaster'
  )
  return (
    <>
      {classlevels.map((classlevel, index) => {
        return (
          <div className='box' key={index}>
            <h2 className='subtitle'>{classlevel.title}</h2>
            <div className='columns'>
              {' '}
              <div className='column is-two-thirds'>
                <ClassReport
                  report={report}
                  classlevel={classlevel}
                  classMasters={classMasters}
                />
              </div>
              <div className='column auto'>
                <HouseReport report={report} classlevel={classlevel} />
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
