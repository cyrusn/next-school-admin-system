import { TERM, HOMEBASES } from '@/config/constant/'
export default function ClassReport({ report, classlevel, classMasters }) {
  const sexes = ['F', 'M']
  return (
    <table
      className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'
      key={classlevel.title}
    >
      <thead>
        <tr>
          <th className='has-text-centered'>Class</th>
          {Object.keys(report.classcodes)
            .filter((classcode) => classcode[0] == classlevel.title[1])
            .map((classcode) => {
              return (
                <th className='has-text-centered' key={classcode}>
                  {classcode}
                </th>
              )
            })}
          <th className='has-text-centered'>Total</th>
        </tr>
      </thead>
      <tbody>
        {sexes.map((s) => {
          return (
            <tr key={s}>
              <th className='has-text-centered'>{s}</th>
              {Object.keys(report.classcodes)
                .filter((classcode) => classcode[0] == classlevel.title[1])
                .map((classcode) => {
                  return (
                    <td key={classcode}>
                      {report.classcodes[classcode].sexes[s] || 0}
                    </td>
                  )
                })}
              <td>
                {Object.keys(report.classcodes)
                  .filter((classcode) => classcode[0] == classlevel.title[1])
                  .reduce((prev, classcode) => {
                    prev += report.classcodes[classcode].sexes[s] || 0
                    return prev
                  }, 0)}
              </td>
            </tr>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <th className='has-text-centered'>Total</th>
          {Object.keys(report.classcodes)
            .filter((classcode) => classcode[0] == classlevel.title[1])
            .map((classcode) => {
              return (
                <td key={classcode}>
                  {report.classcodes[classcode].total || 0}
                </td>
              )
            })}
          <td>
            {Object.keys(report.classcodes)
              .filter((classcode) => classcode[0] == classlevel.title[1])
              .reduce((prev, classcode) => {
                prev += report.classcodes[classcode].total || 0
                return prev
              }, 0)}
          </td>
        </tr>
        <tr>
          <th className='has-text-centered'>Class Master</th>
          {Object.keys(report.classcodes)
            .filter((classcode) => classcode[0] == classlevel.title[1])
            .map((classcode) => {
              return (
                <th className='has-text-centered' key={classcode}>
                  {classMasters[classcode]
                    ?.map(({ initial }) => initial)
                    ?.join(', ')}
                </th>
              )
            })}
        </tr>
        <tr>
          <th className='has-text-centered'>Homebase</th>
          {Object.keys(report.classcodes)
            .filter((classcode) => classcode[0] == classlevel.title[1])
            .map((classcode) => {
              return (
                <th className='has-text-centered' key={classcode}>
                  {HOMEBASES[TERM][classcode]}
                </th>
              )
            })}
        </tr>
      </tfoot>
    </table>
  )
}
