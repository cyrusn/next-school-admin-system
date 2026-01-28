import { groupBy } from 'lodash'
import { getDisplayName } from '@/lib/helper'
import {
  ATTENDANCE_TYPES,
  ABSENCE_TYPES,
  EARLY_LEAVE_TYPES,
  ROLE_ENUM
} from '@/config/constant'
import { snakeCase } from 'lodash'

export const recordFilterInputMapper = (
  formData,
  students,
  { role, classMaster, readingTeacher }
) => {
  const groupedStudents = groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents).sort()

  return [
    {
      type: 'date',
      title: 'Start Date',
      name: 'startDate',
      rules: { required: true }
    },
    {
      type: 'date',
      title: 'End Date',
      name: 'endDate',
      rules: { required: true }
    },
    {
      type: 'multi-select',
      title: 'Class',
      name: 'classcodes',
      children: classcodes
        .filter((classcode) => {
          if (ROLE_ENUM[role] >= ROLE_ENUM['OFFICE_STAFF']) {
            return true
          }
          return classcode == classMaster || classcode == readingTeacher
        })
        .map((classcode) => {
          return (
            <option key={classcode} value={classcode}>
              {classcode}
            </option>
          )
        }),
      rules: { nonEmpty: true }
    },
    {
      type: 'multi-select',
      title: 'Student',
      name: 'regnos',
      children: students
        .filter((s) => formData.classcodes.includes(s.classcode))
        .map((s) => {
          return (
            <option key={s.regno} value={s.regno}>
              {getDisplayName(s)}
            </option>
          )
        }),
      rules: { nonEmpty: true }
    },
    {
      type: 'multi-select',
      title: 'Type',
      name: 'types',
      rules: { nonEmpty: true },
      children: ATTENDANCE_TYPES.filter((type) => {
        if (ROLE_ENUM[role] >= ROLE_ENUM['OFFICE_STAFF']) {
          return true
        }
        const TYPES = [...ABSENCE_TYPES, ...EARLY_LEAVE_TYPES]
        return TYPES.map(({ key }) => key).includes(type.key)
      }).map(({ key, title }, index) => {
        return (
          <option key={index} value={snakeCase(key).toUpperCase()}>
            {title}
          </option>
        )
      })
    },
    {
      type: 'select',
      title: 'Documentation for Absence',
      name: 'isLeaveOfAbsence',
      children: [
        <option key={0} value=''>
          Please select
        </option>,
        <option key={1} value={true}>
          Yes
        </option>,
        <option key={2} value={false}>
          No
        </option>
      ]
    }
  ]
}
