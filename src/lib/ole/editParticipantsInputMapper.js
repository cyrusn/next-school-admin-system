import { AWARD_TYPES, AWARD_STATUSES } from '@/config/constant'

export const elements = [
  { value: 'UPDATE_ROLE', title: 'Role' },
  { value: 'UPDATE_START_DATE', title: 'Start Date' },
  { value: 'UPDATE_END_DATE', title: 'End Date' },
  { value: 'UPDATE_ACHIEVEMENT', title: 'Achievement' },
  { value: 'UPDATE_HOURS', title: 'Hours' },
  { value: 'UPDATE_HIGHLIGHT', title: 'A Highlight for school' },
  { value: 'UPDATE_AWARD_NAME', title: 'Award Name' },
  { value: 'UPDATE_AWARD_TYPE', title: 'Award Type' },
  { value: 'UPDATE_AWARD_STATUS', title: 'Award Status' },
  { value: 'UPDATE_PRIZE_GIVING', title: 'Prize Giving' },
  { value: 'DELETE', title: 'Delete selected participants' }
]

export const mappers = {
  UPDATE_ROLE: {
    name: 'role',
    defaultValue: '',
    rules: { required: true }
  },
  UPDATE_START_DATE: {
    name: 'startDate',
    defaultValue: '',
    rules: { required: true }
  },
  UPDATE_END_DATE: {
    name: 'endDate',
    defaultValue: ''
  },
  UPDATE_ACHIEVEMENT: {
    name: 'achievement',
    defaultValue: ''
  },
  UPDATE_HOURS: {
    name: 'hours',
    defaultValue: 1,
    rules: { required: true, nonZero: true }
  },
  UPDATE_HIGHLIGHT: {
    name: 'isHighlight',
    defaultValue: true,
    options: {
      helptext:
        'Highlight the event and students in School Promotion Publications.'
    }
  },
  UPDATE_AWARD_NAME: {
    name: 'awardName',
    defaultValue: ''
  },
  UPDATE_AWARD_TYPE: {
    name: 'awardType',
    defaultValue: ''
  },
  UPDATE_AWARD_STATUS: {
    name: 'awardStatus',
    defaultValue: ''
  },
  UPDATE_PRIZE_GIVING: {
    name: 'isAward',
    defaultValue: true
  }
}

export const inputInfoMapper = {
  UPDATE_ROLE: { type: 'text', name: 'role' },
  UPDATE_START_DATE: { type: 'date', name: 'startDate' },
  UPDATE_END_DATE: { type: 'date', name: 'endDate' },
  UPDATE_ACHIEVEMENT: { type: 'text', name: 'achievement' },
  UPDATE_HOURS: {
    type: 'number',
    name: 'hours',
    options: { min: 1, helptext: 'Number of participation hours' }
  },
  UPDATE_HIGHLIGHT: {
    type: 'radio',
    name: 'isHighlight',
    options: {
      elements: [
        { value: true, title: 'Yes' },
        { value: false, title: 'No' }
      ]
    }
  },
  UPDATE_AWARD_NAME: { type: 'text', name: 'awardName' },
  UPDATE_AWARD_TYPE: {
    type: 'select',
    name: 'awardType',
    children: AWARD_TYPES.map(({ key, title }) => {
      return (
        <option key={key} value={key}>
          {title}
        </option>
      )
    }),
    options: { placeholder: 'Please select' }
  },
  UPDATE_AWARD_STATUS: {
    type: 'select',
    name: 'awardStatus',
    children: AWARD_STATUSES.map(({ key, title }) => {
      return (
        <option key={key} value={key}>
          {title}
        </option>
      )
    }),
    options: { placeholder: 'Please select' }
  },
  UPDATE_PRIZE_GIVING: {
    type: 'radio',
    name: 'isAward',
    options: {
      elements: [
        { value: true, title: 'Yes' },
        { value: false, title: 'No' }
      ],
      helptext: 'To be presented in prize-giving'
    }
  }
}
