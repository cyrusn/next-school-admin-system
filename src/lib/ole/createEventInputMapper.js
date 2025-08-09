import { COMPONENTS, CATEGORIES, COMMITTEES_AND_KLAS } from '@/config/constant'

export const createEventInputInfoMapper = (users) => ({
  TITLE: {
    title: 'Title',
    type: 'text',
    name: 'title',
    options: { placeholder: 'Title' }
  },
  COMPONENTS: {
    title: 'Components',
    type: 'multi-select',
    name: 'components',
    children: COMPONENTS.map(({ name, code }) => (
      <option key={code} value={code}>
        {name}
      </option>
    )),
    options: {
      placeholder: 'Please select',
      helptext:
        'To select multiple components or categories, press and hold down Ctrl (Window) or ⌘ (macOS) key and click the items.'
    }
  },
  CATEGORY: {
    title: 'Category',
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
    title: 'Committee & KLA',
    type: 'select',
    name: 'committeeAndKla',
    children: COMMITTEES_AND_KLAS.map((name, index) => (
      <option key={index} value={name}>
        {name}
      </option>
    )),
    options: { placeholder: 'Please select' }
  },
  DESCRIPTION: {
    title: 'Description',
    type: 'textarea',
    name: 'description',
    options: { placeholder: 'Description' }
  },
  OBJECTIVE: {
    title: 'Objective',
    type: 'textarea',
    name: 'objective',
    options: { placeholder: 'Objective' }
  },
  EFFICACY: {
    title: 'Efficacy',
    type: 'textarea',
    name: 'efficacy',
    options: {
      placeholder: 'Efficacy',
      helptext: 'Please update this after the event is completed'
    }
  },
  IS_ORGANIZIED_BY_SCHOOL: {
    type: 'radio',
    name: 'isOrganizedBySchool',
    title: 'Organzied by school',
    options: {
      elements: [
        { value: true, title: 'Yes' },
        { value: false, title: 'No' }
      ],
      helptext: '如校內舉辦活動，請選 Yes'
    }
  },
  ORGANIZATION: {
    title: 'Organization',
    type: 'text',
    name: 'organization',
    options: {
      placeholder: 'Organization',
      helptext: 'e.g. 香港學界體育聯會、香港學校音樂及朗誦協會 ...'
    }
  },
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
  }
})
