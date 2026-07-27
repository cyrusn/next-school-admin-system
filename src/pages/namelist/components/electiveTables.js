import React from 'react'

const X1_SUBJECTS = ['BIO', 'PHY', 'CHIST', 'VA', 'THS', 'BAFS']
const X2_SUBJECTS = ['CHEM', 'BIO2', 'ECON', 'GEOG', 'HIST', 'HMSC', 'ICT']
const X3_SUBJECTS = ['HMSC3', 'M2']

function ElectiveSubTable({ title, subjects, data }) {
  const total = subjects.reduce((prev, sub) => prev + (data[sub] || 0), 0)

  return (
    <div className='column'>
      <div className='card'>
        <header className='card-header'>
          <p className='card-header-title'>{title}</p>
        </header>
        <div className='card-content'>
          <table className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'>
            <thead>
              <tr>
                {subjects.map((sub) => (
                  <th key={sub} className='has-text-centered'>
                    {sub}
                  </th>
                ))}
                <th className='has-text-centered'>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {subjects.map((sub) => (
                  <td key={sub} className='has-text-centered'>
                    {data[sub] || '-'}
                  </td>
                ))}
                <td className='has-text-centered'>{total || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function ElectiveTable({ report, level }) {
  if (!report || !report.electives || !report.electives[level]) return null
  const levelData = report.electives[level]

  return (
    <div className='mt-4'>
      <div className='columns'>
        <ElectiveSubTable
          title='X1'
          subjects={X1_SUBJECTS}
          data={levelData.x1 || {}}
        />
        <ElectiveSubTable
          title='X2'
          subjects={X2_SUBJECTS}
          data={levelData.x2 || {}}
        />
        <ElectiveSubTable
          title='X3'
          subjects={X3_SUBJECTS}
          data={levelData.x3 || {}}
        />
      </div>
    </div>
  )
}
