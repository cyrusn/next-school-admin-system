export default function MainTable({ report, classlevels }) {
  return (
    <div className='box'>
      <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
        <caption>Main</caption>
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
                      prev -= report.classcodes[key].total
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
                  prev += report.classcodes[key].total
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
                      prev += report.classcodes[key].total
                    }
                    return prev
                  }, 0)}
                </td>
              )
            })}

            <td>
              {Object.keys(report.classcodes).reduce((prev, key) => {
                prev += report.classcodes[key].total
                return prev
              }, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
