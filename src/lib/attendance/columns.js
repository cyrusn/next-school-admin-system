import {
  ATTENDANCE_TYPES,
  ABSENCE_TYPES,
  REASON_TYPES,
  LATE_TYPES,
  TODAY
} from '@/config/constant'
import { camelCase, map } from 'lodash'
import { DateTime } from 'luxon'

export const getColumns = (attendanceSummary) => [
  { data: 'id', visible: false },
  { data: 'classcode', visible: false },
  { data: 'classno', visible: false },
  { data: 'regno', visible: false },
  {
    data: null,

    title: 'Student',
    width: '15%',
    render(_, _type, row) {
      const { classcode, classno, name, cname } = row
      const display = `${classcode}${String(classno).padStart(2, '0')} ${cname || name}`

      return display
    },
    orderData: [1, 2]
  },
  {
    title: 'Date',
    data: 'eventDate',
    width: '12%'
  },
  {
    title: 'Type',
    data: 'type',
    width: '15%',
    render(type) {
      const { cTitle = '' } = ATTENDANCE_TYPES.find(({ key }) => {
        return key === camelCase(type)
      })
      return cTitle
    }
  },
  {
    title: `Acc up to ${TODAY}`,
    data: 'type',
    width: '10%',
    render(type, _type, row) {
      const { regno } = row

      try {
        const found = attendanceSummary.find(
          ({ regno: regno_ }) => regno_ === regno
        )

        if (found) {
          const { late, absent, absentOnlineLesson, earlyLeave } = found
          switch (true) {
            case map(ABSENCE_TYPES, 'key').includes(camelCase(type)):
              return absent
            case map(LATE_TYPES, 'key').includes(camelCase(type)):
              return late
            case type === 'EARLY_LEAVE':
              return earlyLeave
            case type === 'ABSENT_ONLINE_LESSON':
              return absentOnlineLesson
            default:
              return 0
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  {
    title: 'Has Letter?',
    data: 'isLeaveOfAbsence',
    width: '10%',
    render: {
      _(isLeaveOfAbsence, _, row) {
        if (!map(ABSENCE_TYPES, 'key').includes(camelCase(row.type))) return ''

        return isLeaveOfAbsence ? '✅' : '❌'
      },
      export(isLeaveOfAbsence, _, row) {
        if (!map(ABSENCE_TYPES, 'key').includes(camelCase(row.type))) return ''
        return String(isLeaveOfAbsence).toUpperCase()
      }
    }
  },
  {
    title: 'Reason for Absence',
    data: 'reasonForAbsence',
    width: '15%',
    render(reasonForAbsence) {
      if (!reasonForAbsence) return ''
      const { cTitle } = REASON_TYPES.find(
        ({ key }) => key === reasonForAbsence
      )
      return cTitle
    }
  },
  {
    title: 'Recorded By',
    data: 'recordedBy',
    width: '10%'
  },
  {
    title: 'Created At',
    data: 'createdAt',
    width: '15%',
    render(createdAt) {
      return DateTime.fromISO(createdAt).setZone().toFormat('yyyy-MM-dd HH:mm')
    }
  }
]
