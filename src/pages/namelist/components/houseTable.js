import { TERM, HOMEBASES } from '@/config/constant/'

export default function HouseReport({ report, classlevel }) {
  console.log(report)
  const houses = ['R', 'Y', 'B', 'G']
  const sexes = ['F', 'M']

  return (
    <table
      className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'
      key={classlevel.title}
    >
      <thead>
        <tr>
          <th className='has-text-centered'>House</th>
          {houses.map((house) => {
            return (
              <th key={house} className='has-text-centered'>
                {house}
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
              {houses.map((house) => {
                return (
                  <td key={house}>
                    {report.houses[house][classlevel.title]?.sexes[s]}
                  </td>
                )
              })}
              <td>
                {houses.reduce((prev, house) => {
                  prev += report.houses[house][classlevel.title]?.sexes[s]
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
          {houses.map((house) => {
            return (
              <td key={house}>
                {report.houses[house][classlevel.title]?.total}
              </td>
            )
          })}
          <td>
            {houses.reduce((prev, house) => {
              prev += report.houses[house][classlevel.title]?.total
              return prev
            }, 0)}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
