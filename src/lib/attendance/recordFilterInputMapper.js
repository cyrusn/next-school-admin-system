import { groupBy } from 'lodash'
import { getDisplayName } from '@/lib/helper'
import { ATTENDANCE_TYPES } from '@/config/constant'
import { snakeCase } from 'lodash'

export const recordFilterInputMapper = (formData, students) => {
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
      children: classcodes.map((classcode) => {
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
      children: ATTENDANCE_TYPES.map(({ key, title }, index) => {
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
