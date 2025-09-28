import _ from 'lodash'

export default function TimetableElement({ timetable, isLast }) {
  const {
    ShortName,
    EngName,
    ChiName,
    Master1_ShortName,
    Master1_EngName,
    Master1_ChiName,
    Master2_ShortName,
    Master2_EngName,
    Master2_ChiName,
    HomeRoom_ShortName
  } = timetable
  //
  const periodMappers = {
    P1: '08:20 -08:45',
    P2: '08:45 -09:40',
    P3: '09:40 -10:35',
    P4: '10:55 -11:50',
    P5: '11:50 -12:45',
    P6: '13:55 -14:50',
    P7: '14:50 -15:45',
    P8: '15:45 -16:10',
    AF: 'After School'
  }

  const dayKeyNames = ['D1', 'D2', 'D3', 'D4', 'D5']
  const periodKeyNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'AF']

  const breakSessions = {
    0: [{ title: 'Assembly', time: '08:00 - 08:20' }],
    3: [{ title: 'Recess', time: '10:35 - 10:55' }],
    5: [{ title: 'Lunch', time: '12:45 - 13:55' }]
  }

  return (
    <>
      <table className='table is-bordered is-narrow is-hoverable is-fullwidth print-table'>
        <caption className='mb-1'>
          <h1 className='title'>
            {ShortName} {HomeRoom_ShortName || ''}
          </h1>
          <h2 className='subtitle'>
            {Master1_ShortName || ''} {Master2_ShortName || ''}
          </h2>
        </caption>
        <thead>
          <tr>
            <th className='has-text-centered ' style={{ width: '10%' }}></th>
            <th className='has-text-centered' style={{ width: '18%' }}>
              Mon
            </th>
            <th className='has-text-centered' style={{ width: '18%' }}>
              Tue
            </th>
            <th className='has-text-centered' style={{ width: '18%' }}>
              Wed
            </th>
            <th className='has-text-centered' style={{ width: '18%' }}>
              Thu
            </th>
            <th className='has-text-centered' style={{ width: '18%' }}>
              Fri
            </th>
          </tr>
        </thead>
        <tbody>
          {periodKeyNames.map((periodKey, idx) => {
            return (
              <>
                {breakSessions[idx] &&
                  breakSessions[idx].map(({ title, time }, index) => (
                    <tr key={index}>
                      <td className='has-text-centered'>{time}</td>
                      <td colSpan='5' className='has-text-centered'>
                        <h1>{title}</h1>
                      </td>
                    </tr>
                  ))}
                <tr key={idx}>
                  <td
                    className='has-text-centered is-dark-border'
                    style={{ height: '80px' }}
                  >
                    {periodMappers[periodKey]}
                  </td>
                  {dayKeyNames.map((dayKey, idx) => {
                    const cl = String(
                      timetable[`${dayKey}${periodKey}Cl`] || ''
                    )
                      .split('/')
                      .map((c) => {
                        const regex =
                          /(?<startClasscode>[4-6][A|B])(,[4-6]B)?(,[4-6]C,[4-6]D,[4-6]E)/
                        const result = regex.exec(c)
                        if (result) {
                          return `${result.groups.startClasscode}-E`
                        }
                        return c
                      })
                    const su = String(
                      timetable[`${dayKey}${periodKey}Su`] || ''
                    ).split('/')
                    const rm = String(
                      timetable[`${dayKey}${periodKey}Rm`] || ''
                    ).split('/')
                    const te = String(
                      timetable[`${dayKey}${periodKey}Te`] || ''
                    ).split('/')

                    let zipContents
                    if (cl.length == su.length) {
                      zipContents = _.zip(cl, su, rm, te)
                    } else {
                      const modifiedSu = cl.map(() => su.join(', '))
                      zipContents = _.zip(cl, modifiedSu, rm, te)
                    }

                    return (
                      <td key={idx} className='px-0'>
                        {zipContents.map((value, key) => {
                          return (
                            <div key={key} className='has-text-centered'>
                              {value.map((c, key) => {
                                if (!c) return null

                                if (key == 0) {
                                  return (
                                    <span key={key} className=''>
                                      [{c}]{' '}
                                    </span>
                                  )
                                }

                                if (key == 2) {
                                  return (
                                    <span key={key} className=''>
                                      @{c}{' '}
                                    </span>
                                  )
                                }

                                if (key == 3) {
                                  const splited = c.split(',')

                                  return splited.map((t, k) => {
                                    return (
                                      <>
                                        {splited.length > 1 && k == 0 && <br />}
                                        <span key={k} className='is-italic'>
                                          #{t}{' '}
                                        </span>
                                      </>
                                    )
                                  })
                                }
                                return (
                                  <span key={key} className=''>
                                    {c}{' '}
                                  </span>
                                )
                              })}
                            </div>
                          )
                        })}
                      </td>
                    )
                  })}
                </tr>
              </>
            )
          })}
        </tbody>
      </table>
      {!isLast && <div className='page-break' />}
    </>
  )
}
