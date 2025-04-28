import { COMPONENTS, CATEGORIES, COMMITTEES_AND_KLAS } from '@/config/constant'

export const elements = [
  {
    value: 'TITLE',
    title: 'Title'
  },
  {
    value: 'DESCRIPTION',
    title: 'Description'
  },
  {
    value: 'OBJECTIVE',
    title: 'Objective'
  },
  {
    value: 'EFFICACY',
    title: 'Efficacy'
  },
  { value: 'PICS', title: 'PIC(s)' },
  {
    value: 'COMPONENTS',
    title: 'Components'
  },
  {
    value: 'CATEGORY',
    title: 'Category'
  },
  {
    value: 'COMMITTEES_AND_KLAS',
    title: 'Committees & KLA'
  },
  {
    value: 'ORGANIZATION',
    title: 'Organization'
  },
  { value: 'DELETE', title: 'Delete event and participants' }
]

export const inputInfoMapper = (users) => ({
  TITLE: { type: 'text', name: 'title' },
  DESCRIPTION: { type: 'textarea', name: 'description' },
  OBJECTIVE: { type: 'textarea', name: 'objective' },
  EFFICACY: { type: 'textarea', name: 'efficacy' },
  PICS: {
    title: 'Pics',
    type: 'multi-select',
    name: 'pics',
    children: users.map(({ initial }) => (
      <option value={initial} key={initial}>
        {initial}
      </option>
    )),
    options: { placeholder: 'Please select' }
  },

  COMPONENTS: {
    type: 'multi-select',
    name: 'components',
    children: COMPONENTS.map(({ name, code }) => (
      <option key={code} value={code}>
        {name}
      </option>
    )),
    options: { placeholder: 'Please select' }
  },
  CATEGORY: {
    type: 'select',
    name: 'category',
    children: CATEGORIES.map(({ name, code }) => (
      <option key={code} value={code}>
        {name}
      </option>
    )),
    options: { placeholder: 'Please select' }
  },
  COMMITTEES_AND_KLAS: {
    type: 'select',
    name: 'committeeAndKla',
    children: COMMITTEES_AND_KLAS.map((name, index) => (
      <option key={index} value={name}>
        {name}
      </option>
    )),
    options: { placeholder: 'Please select' }
  },
  ORGANIZATION: { type: 'text', name: 'organization' }
})

export const mappers = (selectedEvent) => ({
  TITLE: {
    name: 'title',
    defaultValue: selectedEvent.title,
    rules: { required: true }
  },
  DESCRIPTION: {
    name: 'description',
    defaultValue: selectedEvent.description,
    rules: { required: true }
  },
  OBJECTIVE: {
    name: 'objective',
    defaultValue: selectedEvent.objective,
    rules: { required: true }
  },
  EFFICACY: {
    name: 'efficacy',
    defaultValue: selectedEvent.efficacy,
    rules: { required: true }
  },
  PICS: {
    name: 'pics',
    defaultValue: selectedEvent.pics.split(','),
    rules: { required: true }
  },
  CATEGORY: {
    name: 'category',
    defaultValue: selectedEvent.category,
    rules: { required: true }
  },
  COMPONENTS: {
    name: 'components',
    defaultValue: selectedEvent.components.split(','),
    rules: { required: true }
  },
  COMMITTEES_AND_KLAS: {
    name: 'committeeAndKla',
    defaultValue: selectedEvent.committeeAndKla,
    rules: { required: true }
  },
  ORGANIZATION: {
    name: 'organization',
    defaultValue: selectedEvent.organization,
    rules: { required: true }
  }
})
