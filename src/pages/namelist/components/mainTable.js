export default function MainTable({ report, classlevels }) {
  const houses = ['R', 'Y', 'B', 'G']
  const sexes = ['F', 'M']

  return (
    <div className='box '>
      <h1 className='subtitle'>Main</h1>
      <div className='columns'>
        <div className='column is-two-thirds'>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth '>
            <thead>
              <tr>
                <th className='has-text-centered'>Level</th>
                <th className='has-text-centered'>F1</th>
                <th className='has-text-centered'>F2</th>
                <th className='has-text-centered'>F3</th>
                <th className='has-text-centered'>F4</th>
                <th className='has-text-centered'>F5</th>
                <th className='has-text-centered'>F6</th>
                <th className='has-text-centered'>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className='has-text-centered'>Max</th>
                {classlevels.map((cl) => {
                  return <td key={cl.title}>{cl.vacancy}</td>
                })}
                <td>
                  {classlevels.reduce((prev, cl) => {
                    prev += cl.vacancy
                    return prev
                  }, 0)}
                </td>
              </tr>

              <tr>
                <th className='has-text-centered'>Vacancy</th>
                {classlevels.map((cl) => {
                  return (
                    <td key={cl.title}>
                      {Object.keys(report.classcodes).reduce((prev, key) => {
                        if (key[0] == cl.title[1]) {
                          prev -= report.classcodes[key].total || 0
                        }
                        return prev
                      }, cl.vacancy)}
                    </td>
                  )
                })}

                <td>
                  {classlevels.reduce((prev, current) => {
                    prev += current.vacancy
                    return prev
                  }, 0) -
                    Object.keys(report.classcodes).reduce((prev, key) => {
                      prev += report.classcodes[key].total || 0
                      return prev
                    }, 0)}
                </td>
              </tr>
              <tr></tr>
            </tbody>
            <tfoot>
              <tr>
                <th className='has-text-centered'>Summary</th>
                {classlevels.map((cl) => {
                  return (
                    <td key={cl.title}>
                      {Object.keys(report.classcodes).reduce((prev, key) => {
                        if (key[0] == cl.title[1]) {
                          prev += report.classcodes[key].total || 0
                        }
                        return prev
                      }, 0)}
                    </td>
                  )
                })}

                <td>
                  {Object.keys(report.classcodes).reduce((prev, key) => {
                    prev += report.classcodes[key].total || 0
                    return prev
                  }, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className='column auto'>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
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
                        <td key={house}>{report.houses[house]?.sexes[s]}</td>
                      )
                    })}
                    <td>
                      {houses.reduce((prev, house) => {
                        prev += report.houses[house]?.sexes[s]
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
                  return <td key={house}>{report.houses[house]?.total}</td>
                })}
                <td>
                  {houses.reduce((prev, house) => {
                    prev += report.houses[house]?.total
                    return prev
                  }, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
