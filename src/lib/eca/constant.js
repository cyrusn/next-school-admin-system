export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MODE_TYPES = {
  exact: {
    cname: '恆常',
    example: '如每逢星期三'
  },
  regular: {
    cname: '定期',
    example: '如每月/每雙月/每季等'
  },
  date: {
    cname: '指定日子或時段',
    example: '2024年12月,\n 2025年3月5、7日'
  }
}

export const ACTIVITY_TYPES = {
  course: {
    cname: '興趣班'
  },
  workshop: {
    cname: '工作坊'
  },
  training: {
    cname: '訓練'
  },
  competition: {
    cname: '比賽'
  },
  performance: {
    cname: '表演'
  },
  others: {
    cname: '其他'
  }
}

export const ROLES = [
  { cname: '會員-Member', name: 'Member' },
  { cname: '組員-Group Member', name: 'Group Member' },
  { cname: '組長-Group Leader', name: 'Group Leader' },
  { cname: '隊員-Team Member', name: 'Team Member' },
  { cname: '隊長-Captain', name: 'Captain' },
  { cname: '副隊長-Vice Captain', name: 'Vice Captain' },
  { cname: '團長-President', name: 'President' },
  { cname: '副團長-Vice-President', name: 'Vice-President' },
  { cname: '首席學生長-Head Prefect', name: 'Head Prefect' },
  { cname: '學生長隊長-Prefect Leader', name: 'Prefect Leader' },
  { cname: '學生長-Prefect', name: 'Prefect' },
  { cname: '主席-President', name: 'President' },
  { cname: '副主席-Vice-President', name: 'Vice-President' },
  {
    cname: '內務副主席-Vice-President (Internal)',
    name: 'Vice-President (Internal)'
  },
  {
    cname: '外務副主席-Vice-President (External)',
    name: 'Vice-President (External)'
  },
  { cname: '社長-House Captain', name: 'House Captain' },
  { cname: '副社長-Vice-House Captain', name: 'Vice-House Captain' },
  { cname: '文書-Secretary', name: 'Secretary' },
  { cname: '財政秘書-Financial Secretary', name: 'Financial Secretary' },
  {
    cname: '活動策劃幹事-Event Planning Officer',
    name: 'Event Planning Officer'
  },
  {
    cname: '總務幹事-General Affairs Officer',
    name: 'General Affairs Officer'
  },
  { cname: '宣傳幹事-Publicity Officer', name: 'Publicity Officer' },
  { cname: '體育幹事-Sport Officer', name: 'Sport Officer' },
  { cname: '福利幹事-Welfare Officer', name: 'Welfare Officer' },
  { cname: '助理幹事-Assistant Officer', name: 'Assistant Officer' },
  { cname: '幹事-Officer', name: 'Officer' },
  { cname: '其他-Others', name: 'Others' }
]

export const GRADES = ['A-優', 'B-良', 'C-常', 'D-須改進', 'E-中途退會']
