import { DateTime } from 'luxon'
export const FIRST_TERM_START_DATE =
  process.env.NEXT_PUBLIC_FIRST_TERM_START_DATE
export const SECOND_TERM_START_DATE =
  process.env.NEXT_PUBLIC_SECOND_TERM_START_DATE
export const SCHOOL_YEAR = process.env.NEXT_PUBLIC_SCHOOL_YEAR
export const TERM = parseInt(process.env.NEXT_PUBLIC_TERM)
export const START_TERM_DATE =
  TERM == 2 ? SECOND_TERM_START_DATE : FIRST_TERM_START_DATE
export const TIMEZONE = 'Asia/Hong_Kong'

export const SPECIAL_ACKNOWLEDGE_EMAIL_MAPPER = {
  'Career and Life Planning Activity Room': 'lpjy@liping.edu.hk',
  'Library Study Hub': 'lpkpf@liping.edu.hk,lpypl@liping.edu.hk',
  'English Centre': 'lpycl@liping.edu.hk',
  'Band Room': 'lpsfs@liping.edu.hk',
  Notebook: 'itsupport@liping.edu.hk',
  'iPad (Delivery)': 'itsupport@liping.edu.hk',
  'iPad (Self-Service)': 'itsupport@liping.edu.hk',
  "60' Television (Fixed on G03)": 'itsupport@liping.edu.hk',
  "75' Television (Movable)": 'itsupport@liping.edu.hk'
}

export const TODAY = DateTime.now()
  .setZone('Asia/Hong_Kong')
  .toFormat('yyyy-MM-dd')

export const ROLE_ENUM = {
  SOCIAL_WORKER: 0,
  GENERAL: 0,
  TEACHER: 1,
  OFFICE_STAFF: 2,
  DC_TEAM: 3,
  DC_ADMIN: 4
}

export const DEDUCTION_ITEM_CODES = [
  {
    code: 101,
    cTitle: '遲到',
    title: 'Late',
    min: 1,
    max: 1,
    isDcOnly: true
  },
  {
    code: 103,
    cTitle: '欠帶課本及文具',
    title: 'No book or stationery',
    min: 1,
    max: 1,
    isDcOnly: null
  },
  {
    code: 105,
    cTitle: '欠交功課',
    title: 'Not hand in homework',
    min: 1,
    max: 1,
    isDcOnly: null
  },
  {
    code: 107,
    cTitle: '校服儀容',
    title: 'Inappropriate appearance',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 110,
    cTitle: '不守課室規則',
    title: 'Violating classroom regulation',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 117,
    cTitle: '缺席網課',
    title: 'Absent online lesson',
    min: 1,
    max: 1,
    isDcOnly: true
  },
  {
    code: 125,
    cTitle: '阻礙課堂學習',
    title: 'Disturbance in the class',
    min: 1,
    max: 15,
    isDcOnly: null
  },
  {
    code: 130,
    cTitle: '攜帶或使用未經批准物品',
    title: 'Possessing unapproved items',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 150,
    cTitle: '不禮貌行為',
    title: 'Impolite manner',
    min: 1,
    max: 15,
    isDcOnly: null
  },
  {
    code: 170,
    cTitle: '不恰當言詞',
    title: 'Inappropriate language',
    min: 2,
    max: 5,
    isDcOnly: null
  },
  {
    code: 190,
    cTitle: '破壞公物',
    title: 'Damaging school property',
    min: 2,
    max: 15,
    isDcOnly: null
  },
  {
    code: 210,
    cTitle: '打架',
    title: 'Fighting',
    min: 5,
    max: 15,
    isDcOnly: true
  },
  {
    code: 230,
    cTitle: '曠課',
    title: 'Truancy',
    min: 5,
    max: 15,
    isDcOnly: true
  },
  {
    code: 240,
    cTitle: '破壞學校文件',
    title: 'Damaging school document',
    min: 1,
    max: 1,
    isDcOnly: null
  },
  {
    code: 250,
    cTitle: '不誠實行為',
    title: 'Acts of dishonesty',
    min: 5,
    max: 15,
    isDcOnly: true
  },
  {
    code: 270,
    cTitle: '嚴重違規',
    title: 'Serious deviance',
    min: 15,
    max: 99,
    isDcOnly: true
  },
  {
    code: 290,
    cTitle: '其他',
    title: 'Others',
    min: 1,
    max: 99,
    isDcOnly: null
  },
  {
    code: 293,
    cTitle: '遺失學生證',
    title: 'Lost student card',
    min: 1,
    max: 1,
    isDcOnly: true
  },
  {
    code: 296,
    cTitle: '遺失手冊',
    title: 'Lost student handbook',
    min: 1,
    max: 1,
    isDcOnly: true
  }
]

export const ADDITION_ITEM_CODES = [
  {
    code: 380,
    cTitle: '學術表現',
    title: 'Academic',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 340,
    cTitle: '良好品行',
    title: 'General Behaviour',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 350,
    cTitle: '服務優異',
    title: 'Service',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 360,
    cTitle: '課外活動',
    title: 'ECA Participation',
    min: 1,
    max: 5,
    isDcOnly: null
  },
  {
    code: 370,
    cTitle: '整體表現',
    title: 'Overall Performance',
    min: 1,
    max: 5,
    isDcOnly: true
  }
]

export const CREDIT_ITEM_CODES = [
  { code: 610, title: 'Merit', cTitle: '優點', key: 'merit' },
  {
    code: 620,
    title: 'Minor Credit',
    cTitle: '小功',
    isDcOnly: true,
    key: 'minorCredit'
  },
  {
    code: 630,
    title: 'Major Credit',
    cTitle: '大功',
    isDcOnly: true,
    key: 'majorCredit'
  }
]
export const MISCONDUCT_ITEM_CODES = [
  { code: 900, title: 'Demerit', cTitle: '缺點', key: 'demerit' },
  {
    code: 930,
    title: 'Minor Misconduct',
    cTitle: '小過',
    isDcOnly: true,
    key: 'minorMisconduct',
    cTitle: '小過'
  },
  {
    code: 950,
    title: 'Serious Misconduct',
    cTitle: '大過',
    isDcOnly: true,
    key: 'seriousMisconduct'
  }
]

export const MERIT_DEMERIT_CODES = [
  ...CREDIT_ITEM_CODES,
  ...MISCONDUCT_ITEM_CODES
]
export const ITEM_CODES = [...DEDUCTION_ITEM_CODES, ...ADDITION_ITEM_CODES]

export const ABSENCE_TYPES = [
  { key: 'absentNormalAm', title: 'Absent (AM)', cTitle: '缺席(上午)' },
  { key: 'absentNormalPm', title: 'Absent (PM)', cTitle: '缺席(下午)' },
  {
    key: 'absentHalfDay',
    title: 'Absent (Half School Day)',
    cTitle: '缺席(半日課)'
  },
  {
    key: 'absentOnlineLesson',
    title: 'Absent (Online Lesson)',
    cTitle: '缺席(網課)'
  }
]
export const LATE_TYPES = [
  { key: 'lateNormalAm', title: 'Late (AM)', cTitle: '遲到(上午)' },
  { key: 'lateNormalPm', title: 'Late (PM)', cTitle: '遲到(下午)' },
  {
    key: 'lateHalfDay',
    title: 'Late (Half School Day)',
    cTitle: '遲到(半日課)'
  }
]
export const EARLY_LEAVE_TYPES = [
  { key: 'earlyLeave', title: 'Early Leave', cTitle: '早退' }
]
export const ATTENDANCE_TYPES = [
  ...LATE_TYPES,
  ...ABSENCE_TYPES,
  ...EARLY_LEAVE_TYPES
]

export const REASON_TYPES = [
  { key: 'SICK_LEAVE', cTitle: '病假 ', title: 'Sick Leave' },
  {
    key: 'SICK_LEAVE_WITH_MEDICAL_CERTIFICATE',
    cTitle: '病假(醫生紙) ',
    title: 'Sick Leave with Medical Certificate'
  },
  { key: 'PERSONAL_LEAVE', cTitle: '事假 ', title: 'Personal Leave' },
  { key: 'OFFICIAL_LEAVE', cTitle: '公假 ', title: 'Official Leave' },
  { key: 'FUNERAL_LEAVE', cTitle: '喪假 ', title: 'Funeral Leave' },
  { key: 'VACCINATION_LEAVE', cTitle: '針假 ', title: 'Vaccination Leave' },
  { key: 'TRUANCY', cTitle: '曠課', title: 'Truancy' },
  { key: 'OTHERS', cTitle: '其他', title: 'Others' }
]

export const CATEGORIES = [
  { name: 'Award', cname: '獎項', code: 'AWARD' },
  { name: 'Competition', cname: '比賽', code: 'COMP' },
  { name: 'Course', cname: '課程', code: 'COURSE' },
  { name: 'Field Trip', cname: '考察', code: 'FT' },
  { name: 'Performing Arts', cname: '表演藝術', code: 'ARTS' },
  { name: 'Service', cname: '服務', code: 'SERVICE' },
  { name: 'Talk', cname: '講座', code: 'TALK' },
  { name: 'Visit', cname: '參觀', code: 'VISIT' },
  { name: 'Workshop', cname: '工作坊', code: 'WS' },
  { name: 'Others', cname: '其他', code: 'OTHERS' }
]

export const COMPONENTS = [
  { name: 'National Education', cname: '國民教育', code: 'NE' },
  { name: 'STEAM Education', cname: 'STEAM教育', code: 'ST' },
  { name: 'Language Education', cname: '語文教育', code: 'LE' },
  { name: 'Physical Development', cname: '體育發展', code: 'PD' },
  { name: 'Intellectual Development', cname: '智育發展', code: 'ID' },
  { name: 'Moral and Civic Education', cname: '德育及公民教育', code: 'MCE' },
  { name: 'Community Service', cname: '社會服務', code: 'CS' },
  { name: 'Aesthetic Development', cname: '藝術發展', code: 'AD' },
  { name: 'Career-related Experiences', cname: '與工作有關的經驗', code: 'CE' },
  { name: 'Others', cname: '其他', code: 'OTHERS' }
]

export const COMMITTEES_AND_KLAS = [
  'Committee - Academic Affairs Committee',
  'Committee - Career and Life Planning Committee',
  'Committee - ECA Committee',
  'Committee - External Liaison Team',
  'Committee - Home Affairs Committee',
  'Committee - IT and AV Management Team',
  'Committee - Moral Development Council',
  'Committee - Pastoral Care Council',
  'Committee - Professional Development Team',
  'Committee - Student Support Committee',
  'KLA - Arts Education',
  'KLA - Chinese',
  'KLA - English',
  'KLA - Personal, Social & Humanities Education',
  'KLA - Mathematics',
  'KLA - Physical Education',
  'KLA - Science',
  'KLA - Technology Education'
]

export const AWARD_TYPES = [
  { key: 'SCHOLARSHIP', title: 'Scholarship' },
  { key: 'CERTIFICATE', title: 'Certificate' },
  { key: 'TROPHY', title: 'Trophy' },
  { key: 'MEDAL', title: 'Medal' },
  { key: 'PLAQUE', title: 'Plaque' },
  { key: 'OTHER', title: 'Other' }
]

export const AWARD_STATUSES = [
  { key: 'RECEIVED', title: 'Received' },
  { key: 'WAITING', title: 'Waiting' }
]

export const HOMEBASES = {
  1: {
    '1A': '202',
    '1B': '203',
    '1C': '204',
    '1D': '205',
    '2A': '401',
    '2B': '402',
    '2C': '403',
    '2D': '404',
    '3A': '301',
    '3B': '302',
    '3C': '303',
    '3D': '304',
    '4A': '207',
    '4B': '208',
    '4C': '206',
    '4D': 'Geog Rm',
    '4E': 'AD2',
    '5A': '307',
    '5B': '308',
    '5C': '305',
    '5D': '306',
    '5E': '310B',
    '6A': '101',
    '6B': '102',
    '6C': '103',
    '6D': '405',
    '6E': '406'
  },
  2: {
    '1A': '202',
    '1B': '203',
    '1C': '204',
    '1D': '205',
    '2A': '401',
    '2B': '402',
    '2C': '403',
    '2D': '404',
    '3A': '301',
    '3B': '302',
    '3C': '303',
    '3D': '304',
    '4A': '207',
    '4B': '208',
    '4C': '206',
    '4D': '405',
    '4E': '406',
    '5A': '307',
    '5B': '308',
    '5C': '305',
    '5D': '306',
    '5E': '310B',
    '6A': '',
    '6B': '',
    '6C': '',
    '6D': '',
    '6E': ''
  }
}
