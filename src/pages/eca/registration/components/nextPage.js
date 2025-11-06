import { MODE_TYPES, ACTIVITY_TYPES } from '@/lib/eca/constant'

export default function NextPage({
  selectedClub,
  regInfo,
  setView,
  ref,
  fetchClubs
}) {
  const { cname, category, pic, associates, location } = selectedClub
  const {
    range,
    clubId,
    activityType,
    activityTypeValue,
    modeType,
    modeValue,
    resources,
    requireRegularAnnoucement,
    sessionPlan1,
    sessionPlan2,
    sessionPlan3,
    sessionPlan4,
    sessionPlan5,
    noOfActivity,
    fee,
    isConfirmed
  } = regInfo || {}

  const onConfirm = async () => {
    const rangeObjects = [
      {
        range,
        clubId,
        activityType,
        activityTypeValue,
        modeType,
        modeValue,
        resources,
        requireRegularAnnoucement,
        sessionPlan1,
        sessionPlan2,
        sessionPlan3,
        sessionPlan4,
        sessionPlan5,
        noOfActivity,
        fee,
        isConfirmed: true
      }
    ]
    try {
      const response = await fetch('/api/eca/registration', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rangeObjects })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result)
      }
      ref.current = true
      setView('next')
      fetchClubs()
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <>
      <h1 className='title has-text-centered'>聯課活動學會註冊</h1>
      <div className='card'>
        <div className='card-content'>
          <p className='subtitle is-size-4'>{cname}</p>
          {isConfirmed ? (
            <div className='notification is-success'>已完成註冊</div>
          ) : (
            <div className='notification is-danger'>尚未完成註冊</div>
          )}

          <div className='field is-grouped is-grouped-multiline'>
            <div className='control'>
              <div className='tags has-addons'>
                <span className='tag is-info is-light'>類別</span>
                <span className='tag is-info'>{category}</span>
              </div>
            </div>

            {pic ? (
              <div className='control'>
                <div className='tags has-addons'>
                  <span className='tag is-light is-warning'>負責</span>
                  {selectedClub?.pic.split(',').map((pic, key) => {
                    return (
                      <span className='tag is-warning' key={key}>
                        {pic.trim()}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            {associates ? (
              <div className='control'>
                <div className='tags has-addons'>
                  <span className='tag is-light is-success'>協助</span>
                  {selectedClub?.associates.split(',').map((associate, key) => {
                    return (
                      <span key={key} className='tag is-success'>
                        {associate}
                      </span>
                    )
                  })}
                </div>
              </div>
            ) : (
              <></>
            )}
            {location ? (
              <div className='control'>
                <div className='tags has-addons'>
                  <span className='tag is-info is-danger is-light'>地點</span>
                  <span className='tag is-danger'>{location}</span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          {!regInfo && <p>尚未註冊</p>}

          {!isConfirmed && (
            <div className='notification is-danger is-light'>
              請確定學會／校隊資料正確
            </div>
          )}

          {regInfo && (
            <table className='table is-fullwidth is-hoverable is-bordered'>
              <tbody>
                <tr>
                  <th
                    className='has-text-centered'
                    style={{ minWidth: '12em' }}
                  >
                    學會活動類別
                  </th>
                  <td className='has-text-centered'>
                    <div className='field is-grouped is-grouped-multiline is-justify-content-center'>
                      {activityType?.split(',').map((type, key) => {
                        return (
                          <div className='control' key={key}>
                            <div className='tags is-info has-addons'>
                              <span className='tag is-info'>
                                {ACTIVITY_TYPES[type]?.cname}
                              </span>
                              {type == 'others' && (
                                <span className='tag is-light'>
                                  {activityTypeValue}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>活動進行模式</th>
                  <td className='has-text-centered'>
                    <div>{MODE_TYPES[modeType]?.cname}</div>
                    {modeType == 'exact' && (
                      <span>
                        {(modeValue || '')
                          .split(',')
                          .map((s) => s.trim())
                          ?.join(', ')}
                      </span>
                    )}
                    {modeType != 'exact' && <span>{modeValue}</span>}
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>學會所需資源／設施</th>
                  <td className='has-text-centered'>{resources}</td>
                </tr>
                <tr>
                  <th className='has-text-centered'>全年擬舉辦活動次數</th>
                  <td className='has-text-centered'>
                    <span>{`${noOfActivity || ''}次`}</span>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>學會經費申請</th>
                  <td className='has-text-centered'>
                    <span>{`$${fee}`}</span>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>由本組作定期活動宣布</th>
                  <td className='has-text-centered'>
                    {requireRegularAnnoucement ? '✅' : '❌'}
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>9-10月活動計劃</th>
                  <td className='has-text-centered'>
                    <span>{sessionPlan1}</span>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>11-12月活動計劃</th>
                  <td className='has-text-centered'>
                    <span>{sessionPlan2}</span>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>1-2月活動計劃</th>
                  <td className='has-text-centered'>
                    <span>{sessionPlan3}</span>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>3-4月活動計劃</th>
                  <td className='has-text-centered'>
                    <span>{sessionPlan4}</span>
                  </td>
                </tr>
                <tr>
                  <th className='has-text-centered'>5-7月活動計劃</th>
                  <td className='has-text-centered'>
                    <span>{sessionPlan5}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <footer className='card-footer'>
          <p className='card-footer-item'>
            {isConfirmed && <a onClick={() => setView('edit')}> 修改</a>}

            {!isConfirmed && regInfo && (
              <a className='has-text-success' onClick={() => setView('edit')}>
                修改並確定資料
              </a>
            )}

            {!regInfo && <a onClick={() => setView('register')}> 登記 </a>}
          </p>
          {!isConfirmed && (
            <p className='card-footer-item'>
              <a className='has-text-danger' onClick={onConfirm}>
                確定以上資料正確
              </a>
            </p>
          )}
          <p className='card-footer-item'>
            <a onClick={() => setView('init')}>返回主頁</a>
          </p>
        </footer>
      </div>
    </>
  )
}
