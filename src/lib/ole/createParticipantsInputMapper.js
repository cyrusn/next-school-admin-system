import { AWARD_TYPES, AWARD_STATUSES } from '@/config/constant'

export const inputInfoMappers = [
  {
    type: 'text',
    title: 'Role',
    name: 'role',
    rules: { required: true },
    options: {
      helptext: 'e.g. 參與者、表演者、活動策劃、活動助理...'
    }
  },
  {
    title: 'Date',
    doms: [
      {
        title: 'Start Date',
        type: 'date',
        name: 'startDate',
        rules: { required: true },
        options: { helptext: 'Start Date' }
      },
      {
        title: 'End Date',
        type: 'date',
        name: 'endDate',
        options: { helptext: 'End Date (Optional)' }
      }
    ]
  },
  {
    title: '',
    doms: [
      {
        type: 'number',
        title: 'Term',
        name: 'term',
        rules: { required: true, nonZero: true },
        options: {
          min: 1,
          helptext: 'Term'
        }
      },
      {
        type: 'number',
        title: 'Hours',
        name: 'hours',
        rules: { required: true, nonZero: true },
        options: { min: 1, helptext: 'Hours' }
      }
    ]
  },
  {
    type: 'text',
    title: 'Achievement',
    name: 'achievement',
    options: { placeholder: 'Optional' }
  },
  {
    type: 'radio',
    title: 'Highlight',
    name: 'isHighlight',
    options: {
      elements: [
        { value: true, title: 'Yes' },
        { value: false, title: 'No' }
      ],
      helptext:
        'Highlight the event and students in School Promotion Publications.'
    }
  },
  {
    type: 'text',
    name: 'awardName',
    title: 'Award Name',
    options: { placeholder: 'Optional' }
  },
  {
    title: '',
    doms: [
      {
        type: 'select',
        name: 'awardType',
        title: 'Award Type',
        children: AWARD_TYPES.map(({ key, title }) => {
          return (
            <option key={key} value={key}>
              {title}
            </option>
          )
        }),
        options: { placeholder: 'Please select', helptext: 'Award Type' }
      },
      {
        type: 'select',
        name: 'awardStatus',
        title: 'Award Status',
        children: AWARD_STATUSES.map(({ key, title }) => {
          return (
            <option key={key} value={key}>
              {title}
            </option>
          )
        }),
        options: { placeholder: 'Please select', helptext: 'Award Status' }
      }
    ]
  },
  {
    type: 'radio',
    name: 'isAward',
    title: 'Prize Giving',
    options: {
      elements: [
        { value: true, title: 'Yes' },
        { value: false, title: 'No' }
      ],
      helptext: 'To be presented in prize-giving'
    }
  }
]
