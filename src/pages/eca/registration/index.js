import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

import NextPage from './components/nextPage.js'
import Register from './components/register.js'
import NoClubAndTeamMessage from '../components/noClubAndTeamMessage.js'
import { SCHOOL_YEAR } from '@/config/constant.js'

export default function EcaRegistration() {
  const [clubs, setClubs] = useState([])
  const [regInfos, setRegInfos] = useState([])
  const isFirstLoadRef = useRef(true)
  const [view, setView] = useState('init')
  const [selectedClubId, setSelectedClubId] = useState(0)
  const selectedClub = clubs.find((club) => club.id == selectedClubId)
  const selectedRegInfo = regInfos.find((info) => info.clubId == selectedClubId)

  const { data: session } = useSession()
  const { initial } = session.user.info

  async function fetchClubs() {
    try {
      const clubResponse = await fetch(`/api/eca/clubs?initial=${initial}`)
      const clubsResult = await clubResponse.json()
      if (!clubResponse.ok) {
        throw new Error(clubsResult.message)
      }

      const regInfosResponse = await fetch(`/api/eca/registration`)
      const regInfoResult = await regInfosResponse.json()
      if (!regInfosResponse.ok) {
        throw new Error(regInfoResult.message)
      }

      setClubs(clubsResult)
      setRegInfos(regInfoResult)
      isFirstLoadRef.current = false
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    fetchClubs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isFirstLoadRef.current) {
    return (
      <>
        <h1 className='title has-text-centered'>聯課活動學會註冊</h1>
        <div className='message is-warning'>
          <div className='message-body'>
            <span>Loading ...</span>
          </div>
        </div>
      </>
    )
  }

  if (clubs.length == 0 && view == 'init') {
    return (
      <>
        <h1 className='title has-text-centered'>聯課活動學會註冊</h1>
        <NoClubAndTeamMessage />
      </>
    )
  }

  if (view == 'next') {
    return (
      <NextPage
        selectedClub={selectedClub}
        regInfo={selectedRegInfo}
        setView={setView}
        ref={isFirstLoadRef}
        fetchClubs={fetchClubs}
      />
    )
  }

  if (view == 'register') {
    return (
      <Register
        mode='register'
        selectedClub={selectedClub}
        regInfo={selectedRegInfo}
        setView={setView}
        ref={isFirstLoadRef}
        fetchClubs={fetchClubs}
      />
    )
  }

  if (view == 'edit') {
    return (
      <Register
        mode='edit'
        selectedClub={selectedClub}
        regInfo={selectedRegInfo}
        setView={setView}
        ref={isFirstLoadRef}
        fetchClubs={fetchClubs}
      />
    )
  }

  return (
    <div>
      <h1 className='title has-text-centered'>聯課活動學會註冊</h1>
      <div>
        <h2 className='subtitle'>
          以下為{SCHOOL_YEAR}-
          {String(parseInt(SCHOOL_YEAR) + 1 - 2000).padStart(2, 0)}
          年度閣下負責的聯課活動學會，請選擇：
        </h2>
        <div className='field has-addons'>
          <div className='control is-expanded'>
            <div className='select is-fullwidth'>
              <select
                onChange={(e) => {
                  setSelectedClubId(e.target.value)
                }}
              >
                <option value={0}>請選擇學會／校隊</option>
                {clubs.map((club, key) => {
                  const { cname, category } = club
                  return (
                    <option
                      value={club.id}
                      key={key}
                    >{`${cname} - ${category}`}</option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className='control'>
            <button className='button is-info' onClick={() => setView('next')}>
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
