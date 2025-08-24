import { groupBy } from 'lodash'
import { getDisplayName } from '@/lib/helper'

export const createRecordsInputInfoMapper = (
  formData,
  students,
  records,
  initial
) => {
  const groupedStudents = groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents).sort()

  return [
    {
      title: 'Students',
      doms: [
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
            .filter((s) => formData.classcodes?.includes(s.classcode))
            .map((s) => {
              let isDisabled = false
              const found = records.find((r) => r.regno == s.regno)

              if (found) {
                const { teacher_1, teacher_2, teacher_3 } = found
                const teachers = [teacher_1, teacher_2, teacher_3]
                isDisabled = teachers.includes(initial)
              }

              if (found?.status == 'ACTIVE' || found?.status == 'PENDING') {
                isDisabled = true
              }

              if (found?.freq >= 3) {
                isDisabled = true
              }

              return (
                <option key={s.regno} value={s.regno} disabled={isDisabled}>
                  {getDisplayName(s)}
                </option>
              )
            }),
          rules: { nonEmpty: true }
        }
      ]
    }
  ]
}
