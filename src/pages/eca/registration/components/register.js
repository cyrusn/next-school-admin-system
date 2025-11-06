import { WEEKDAYS, MODE_TYPES, ACTIVITY_TYPES } from '@/lib/eca/constant'
import { useState } from 'react'
import { compact, throttle } from 'lodash'
import { DateTime } from 'luxon'
import { TIMEZONE } from '@/config/constant.js'

export default function EcaRegister({
  selectedClub,
  mode,
  setView,
  regInfo,
  fetchClubs,
  ref
}) {
  const [info, setInfo] = useState(regInfo || {})
  const [isClicked, setIsClicked] = useState(false)
  const { cname, category, pic, associates, location } = selectedClub

  const reset = () => {
    setInfo(regInfo || {})
    setView('init')
  }

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
  } = info

  const modeValues = (modeValue || '').split(',').map((v) => v.trim())

  const onSubmit = async () => {
    setIsClicked(true)
    if (mode == 'register') {
      await onRegister()
    } else if (mode == 'edit') {
      await onEdit()
    }

    ref.current = true
    setView('next')
    setIsClicked(false)
    await fetchClubs()
  }
  const onEdit = async () => {
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
    } catch (e) {
      console.error(e)
    }
  }

  const onRegister = async () => {
    const now = DateTime.now()
      .setZone(TIMEZONE)
      .toFormat("yyyy-MM-dd'T'HH:mm:ss")
    const {
      activityType,
      activityTypeValue,
      modeType,
      modeValue,
      modeValues,
      resources,
      requireRegularAnnoucement,
      sessionPlan1,
      sessionPlan2,
      sessionPlan3,
      sessionPlan4,
      sessionPlan5,
      noOfActivity,
      fee
    } = info

    const row = [
      selectedClub.id,
      String(activityType),
      activityTypeValue,
      modeType,
      modeType == 'exact' ? String(modeValues) : modeValue,
      resources,
      requireRegularAnnoucement,
      sessionPlan1,
      sessionPlan2,
      sessionPlan3,
      sessionPlan4,
      sessionPlan5,
      noOfActivity,
      fee,
      true,
      now
    ]

    try {
      const response = await fetch('/api/eca/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rows: [row] })
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onChange = (e) => {
    const { name, value, type } = e.target
    // console.log(name, value, type)
    const RESET_FIELDS = [{ name: 'modeType', target: 'modeValue' }]

    setInfo((prev) => {
      let newInfo = { ...prev }

      RESET_FIELDS.forEach((clearName) => {
        if (clearName.name == name) {
          newInfo[clearName.target] = ''
        }
      })

      if (name == 'modeValue' && type == 'checkbox') {
        let newValue = ''
        if (modeValues.includes(value)) {
          newValue = compact(modeValues.filter((v) => v != value)).join(',')
        } else {
          newValue = compact([...modeValues, value]).join(',')
        }
        newInfo = { ...newInfo, [name]: newValue }
        return newInfo
      }

      if (name == 'activityType') {
        let newValue = ''
        const activityTypes = newInfo?.activityType?.split(',') || []
        if (activityTypes?.includes(value)) {
          newValue = activityTypes.filter((a) => a != value).join(',')
        } else {
          activityTypes.push(value)
          newValue = activityTypes.join(',')
        }
        newInfo = { ...newInfo, [name]: newValue }
        return newInfo
      }

      if (name == 'requireRegularAnnoucement') {
        newInfo = { ...newInfo, [name]: !newInfo[name] }
        return newInfo
      }

      if (type == 'number') {
        newInfo = { ...newInfo, [name]: Number(value) }
        return newInfo
      }

      newInfo = { ...newInfo, [name]: value }
      return newInfo
    })
  }

  return (
    <div>
      {/* <pre>{JSON.stringify(info, null, '\t')}</pre> */}
      <h1 className='title has-text-centered'>聯課活動學會註冊</h1>
      {/* <h1>Mode: {mode}</h1> */}
      <div className='box'>
        <h1 className='title is-size-4 has-text-centered'>
          <span>{cname}</span>
        </h1>

        <div className='field'>
          <label className='label'>學會活動類別 (可多選)</label>
          <div className='control'>
            {Object.keys(ACTIVITY_TYPES).map((type, key) => {
              return (
                <label className='checkbox mr-2' key={key}>
                  <input
                    name='activityType'
                    type='checkbox'
                    value={type}
                    checked={activityType?.split(',').includes(type)}
                    onChange={onChange}
                  />
                  <span>{ACTIVITY_TYPES[type].cname}</span>
                </label>
              )
            })}
          </div>
        </div>

        {activityType?.split(',').includes('others') && (
          <div className='field'>
            <label className='label'>如選其他，請詳述</label>
            <div className='control'>
              <textarea
                className='textarea'
                type='text'
                name='activityTypeValue'
                value={activityTypeValue}
                onChange={onChange}
              ></textarea>
            </div>
          </div>
        )}

        <div className='field'>
          <label className='label'>活動進行模式</label>
          <div className='control'>
            <div className='select'>
              <select name='modeType' onChange={onChange} value={modeType}>
                <option value='' disabled>
                  請選擇
                </option>
                {Object.keys(MODE_TYPES).map((mode, key) => {
                  return (
                    <option key={key} value={mode}>
                      {MODE_TYPES[mode].cname}{' '}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>

        <div className='field'>
          {modeType == 'exact' && (
            <>
              <div className='control'>
                {WEEKDAYS.map((weekday, key) => {
                  return (
                    <label className='checkbox mr-2' key={key}>
                      <input
                        name='modeValue'
                        type='checkbox'
                        value={weekday}
                        checked={modeValues.includes(weekday)}
                        onChange={onChange}
                      />
                      <span>{weekday}</span>
                    </label>
                  )
                })}
              </div>
              <p className='help is-primary'>{MODE_TYPES[modeType].example}</p>
            </>
          )}

          {modeType == 'regular' && (
            <div className='control'>
              <textarea
                className='textarea'
                type='text'
                name='modeValue'
                onChange={onChange}
                value={modeValue}
                placeholder={MODE_TYPES[modeType].example}
              ></textarea>
            </div>
          )}

          {modeType === 'date' && (
            <div className='control'>
              <textarea
                onChange={onChange}
                className='textarea'
                type='text'
                value={modeValue}
                name='modeValue'
                placeholder={MODE_TYPES[modeType].example}
              ></textarea>
            </div>
          )}
        </div>

        <div className='field'>
          <label className='label'>學會所需資源／設施 </label>
          <div className='control'>
            <textarea
              className='textarea'
              type='text'
              name='resources'
              value={resources}
              placeholder='儲物櫃×1, 佈告板×1'
              onChange={onChange}
            ></textarea>
          </div>
          <p className='help is-info'>
            除學會儲物櫃外，其他資源/設施需由負責老師額外自行申請。
          </p>
        </div>

        <div className='field'>
          <label className='label'>學會經費申請</label>

          <div className='control'>
            <input
              className='input'
              min='0'
              max='350'
              step='50'
              type='number'
              name='fee'
              value={fee}
              onChange={onChange}
            />
          </div>
          <p className='help is-info'>
            申請上限為350元，如須超額申請，煩請聯絡吳詠棠老師。
          </p>
        </div>

        <div className='field'>
          <label className='label'>全年擬舉辦活動次數</label>
          <div className='control'>
            <input
              className='input'
              min='0'
              type='number'
              name='noOfActivity'
              value={noOfActivity}
              onChange={onChange}
            />
          </div>
        </div>

        <div className='field'>
          <div className='control'>
            <label className='checkbox'>
              <span className='label'>
                是否需要由本組作定期早會活動宣布{' '}
                <input
                  type='checkbox'
                  name='requireRegularAnnoucement'
                  checked={requireRegularAnnoucement}
                  onChange={onChange}
                />
              </span>
            </label>
          </div>
        </div>

        <div className='field'>
          <label className='label' htmlFor='sessionPlan1'>
            9-10月活動計劃
          </label>
          <div className='control'>
            <textarea
              className='textarea'
              name='sessionPlan1'
              onChange={onChange}
              value={sessionPlan1}
              placeholder='每星期舉辦一次訓練班(測考週及假期除外)，10月下旬參加校際比賽。'
            ></textarea>
          </div>
        </div>

        <div className='field'>
          <label className='label' htmlFor='sessionPlan2'>
            11-12月活動計劃
          </label>
          <div className='control'>
            <textarea
              className='textarea'
              name='sessionPlan2'
              onChange={onChange}
              value={sessionPlan2}
              placeholder='20/12為區內慈善機構作活動表演。'
            ></textarea>
          </div>
        </div>

        <div className='field'>
          <label className='label' htmlFor='sessionPlan3'>
            1-2月活動計劃
          </label>
          <div className='control'>
            <textarea
              className='textarea'
              name='sessionPlan3'
              onChange={onChange}
              value={sessionPlan3}
              placeholder='於一月份舉辦校內賀佳節活動；二月份舉辦校內攤位遊戲。'
            ></textarea>
          </div>
        </div>

        <div className='field'>
          <label className='label' htmlFor='sessionPlan4'>
            3-4月活動計劃
          </label>
          <div className='control'>
            <textarea
              className='textarea'
              name='sessionPlan4'
              onChange={onChange}
              value={sessionPlan4}
              placeholder='3月10-13日期間，協助校內健康周推行活動。'
            ></textarea>
          </div>
        </div>

        <div className='field'>
          <label className='label' htmlFor='sessionPlan5'>
            5-7月活動計劃
          </label>
          <div className='control'>
            <textarea
              className='textarea'
              value={sessionPlan5}
              name='sessionPlan5'
              onChange={onChange}
              placeholder='於五月份邀請校外機構到校舉辦工作坊。'
            ></textarea>
          </div>
        </div>

        <div className='buttons'>
          <button
            className='button is-info'
            onClick={throttle(onSubmit, 1000)}
            disabled={isClicked}
          >
            遞交
          </button>
          <a className='button is-success' onClick={reset}>
            返回首頁
          </a>
        </div>
      </div>
    </div>
  )
}
