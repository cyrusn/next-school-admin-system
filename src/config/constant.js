import { DateTime } from 'luxon'
export const COHORT_START_DATE = process.env.NEXT_PUBLIC_COHORT_START_DATE
export const SCHOOL_YEAR = process.env.NEXT_PUBLIC_SCHOOL_YEAR
export const TERM = process.env.NEXT_PUBLIC_TERM
export const TIMEZONE = 'Asia/Hong_Kong'

export const TODAY = DateTime.now()
  .setZone('Asia/Hong_Kong')
  .toFormat('yyyy-MM-dd')

export const ROLE_ENUM = {
  GENERAL: 0,
  TEACHER: 1,
  OFFICE_STAFF: 2,
  DC_TEAM: 3,
  DC_ADMIN: 4
}

export const ITEM_CODES = [
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
    isDcOnly: null
  },
  {
    code: 230,
    cTitle: '曠課',
    title: 'Truancy',
    min: 5,
    max: 15,
    isDcOnly: null
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
    isDcOnly: null
  },
  {
    code: 270,
    cTitle: '嚴重違規',
    title: 'Serious deviance',
    min: 1,
    max: 99,
    isDcOnly: null
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
  },
  {
    code: 380,
    cTitle: '學術表現',
    title: 'Academic',
    min: 1,
    max: 3,
    isDcOnly: null
  },
  {
    code: 340,
    cTitle: '良好品行',
    title: 'General Behaviour',
    min: 1,
    max: 3,
    isDcOnly: null
  },
  {
    code: 350,
    cTitle: '服務優異',
    title: 'Service',
    min: 1,
    max: 3,
    isDcOnly: null
  },
  {
    code: 360,
    cTitle: '課外活動',
    title: 'ECA Participation',
    min: 1,
    max: 3,
    isDcOnly: null
  },
  {
    code: 370,
    cTitle: '整體表現',
    title: 'Overall Performance',
    min: 1,
    max: 3,
    isDcOnly: true
  }
]

export const MERIT_DEMERIT_CODES = [
  { code: 610, title: 'Merit', cTitle: '優點' },
  { code: 620, title: 'Minor Credit', cTitle: '小功', isDcOnly: true },
  { code: 630, title: 'Major Credit', cTitle: '大功', isDcOnly: true },
  { code: 900, title: 'Demerit', cTitle: '缺點' },
  { code: 930, title: 'Minor Misconduct', cTitle: '小過', isDcOnly: true },
  { code: 950, title: 'Serious Misconduct', cTitle: '大過', isDcOnly: true }
]

export const ATTENDANCE_TYPES = [
  { key: 'lateNormalAm', title: 'Late (AM)', cTitle: '遲到(上午)' },
  { key: 'lateNormalPm', title: 'Late (PM)', cTitle: '遲到(下午)' },
  {
    key: 'lateHalfDay',
    title: 'Late (Half School Day)',
    cTitle: '遲到(半日課)'
  },
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
  },
  { key: 'earlyLeave', title: 'Early Leave', cTitle: '早退' }
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
