import { groupBy } from 'lodash'
import { getDisplayName } from '@/lib/helper'

export const createMembersInputInfoMapper = (formData, students, clubs) => {
  const groupedStudents = groupBy(students, 'classcode')
  const classcodes = Object.keys(groupedStudents).sort()

  return [
    {
      type: 'select',
      name: 'clubId',
      title: 'Club / Team',
      children: clubs.map((club, key) => {
        return (
          <option key={key} value={club.id}>
            {club.cname}
          </option>
        )
      }),
      options: { placeholder: 'Please select', helptext: 'Please select club and team' }
    },
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
              return (
                <option key={s.regno} value={s.regno}>
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
