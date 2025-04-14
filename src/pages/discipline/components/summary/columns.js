import { getDisplayName } from '@/lib/helper'
export const columns = [
  {
    title: '學生',
    name: 'displayName',
    orderable: true,
    width: 150,
    data(data, type) {
      const { classcode, classno, name, cname } = data
      if (type === 'set') {
        return
      }

      if (type === 'display' || type === 'filter') {
        return getDisplayName({ classcode, classno, name, cname })
      }

      if (type === 'sort') {
        return ['classcode', 'classno']
      }

      return 'regno'
    }
  },
  { title: 'regno', name: 'regno', data: 'regno', visible: false },
  { title: 'id', name: 'id', data: 'id', visible: false },
  { title: 'classcode', name: 'classcode', data: 'classcode', visible: false },
  { title: 'classno', name: 'classno', data: 'classno', visible: false },
  { title: 'name', name: 'name', data: 'name', visible: false },
  { title: 'cname', name: 'cname', data: 'cname', visible: false },
  { title: '性別', name: 'sex', data: 'sex' },
  { title: '社', name: 'house', data: 'house' },
  { title: 'status', name: 'status', data: 'status', visible: false },
  {
    title: 'schoolYear',
    name: 'schoolYear',
    data: 'schoolYear',
    visible: false
  },
  { title: 'Term', name: 'term', data: 'term', visible: false },

  {
    title: '總分',
    name: 'accMark',
    data: 'accMark',
    className: 'has-text-danger'
  },
  {
    title: '操行',
    name: 'accGrade',
    data: 'accGrade',
    className: 'has-text-danger'
  },
  {
    title: '缺席',
    name: 'accAbsence',
    data: 'accAbsence',
    className: 'has-text-link'
  },
  {
    title: '遲到',
    name: 'accLate',
    data: 'accLate',
    className: 'has-text-link'
  },
  {
    title: '早退',
    name: 'accEarlyLeave',
    data: 'accEarlyLeave',
    className: 'has-text-link'
  },
  {
    title: '加分',
    name: 'accAddition',
    data: 'accAddition',
    className: 'has-text-link'
  },
  {
    title: '扣分',
    name: 'accDeduction',
    data: 'accDeduction',
    className: 'has-text-link'
  },
  {
    title: '優點',
    name: 'accMerit',
    data: 'accMerit',
    className: 'has-text-link'
  },
  {
    title: '小功',
    name: 'accMinorCredit',
    data: 'accMinorCredit',
    className: 'has-text-link'
  },
  {
    title: '大功',
    name: 'accMajorCredit',
    data: 'accMajorCredit',
    className: 'has-text-link'
  },
  {
    title: '缺點',
    name: 'accDemerit',
    data: 'accDemerit',
    className: 'has-text-link'
  },
  {
    title: '小過',
    name: 'accMinorMisconduct',
    data: 'accMinorMisconduct',
    className: 'has-text-link'
  },
  {
    title: '大過',
    name: 'accSeriousMisconduct',
    data: 'accSeriousMisconduct',
    className: 'has-text-link'
  },

  { title: '缺席', name: 'absence', data: 'absence' },
  { title: '遲到', name: 'late', data: 'late' },
  { title: '早退', name: 'earlyLeave', data: 'earlyLeave' },
  { title: '加分', name: 'addition', data: 'addition' },
  { title: '扣分', name: 'deduction', data: 'deduction' },
  { title: '優點', name: 'merit', data: 'merit', visible: false },
  { title: '小功', name: 'minorCredit', data: 'minorCredit', visible: false },
  { title: '大功', name: 'majorCredit', data: 'majorCredit', visible: false },
  { title: '缺點', name: 'demerit', data: 'demerit', visible: false },
  {
    title: '小過',
    name: 'minorMisconduct',
    data: 'minorMisconduct',
    visible: false
  },
  {
    title: '大過',
    name: 'seriousMisconduct',
    data: 'seriousMisconduct',
    visible: false
  },

  { title: 'Late AM', name: 'lateNormalAm', data: 'lateNormalAm' },
  { title: 'Late PM', name: 'lateNormalPm', data: 'lateNormalPm' },
  { title: 'Late HD', name: 'lateHalfDay', data: 'lateHalfDay' },
  { title: 'ABS AM', name: 'absentNormalAm', data: 'absentNormalAm' },
  { title: 'ABS PM', name: 'absentNormalPm', data: 'absentNormalPm' },
  { title: 'ABS HD', name: 'absentHalfDay', data: 'absentHalfDay' },
  {
    title: 'ABS Online',
    name: 'absentOnlineLesson',
    data: 'absentOnlineLesson',
    visible: false
  },
  { title: '101', name: '101', data: '101' },
  { title: '103', name: '103', data: '103' },
  { title: '105', name: '105', data: '105' },
  { title: '107', name: '107', data: '107' },
  { title: '110', name: '110', data: '110' },
  { title: '117', name: '117', data: '117' },
  { title: '125', name: '125', data: '125' },
  { title: '130', name: '130', data: '130' },
  { title: '150', name: '150', data: '150' },
  { title: '170', name: '170', data: '170' },
  { title: '190', name: '190', data: '190' },
  { title: '210', name: '210', data: '210' },
  { title: '230', name: '230', data: '230' },
  { title: '240', name: '240', data: '240' },
  { title: '250', name: '250', data: '250' },
  { title: '270', name: '270', data: '270' },
  { title: '290', name: '290', data: '290' },
  { title: '293', name: '293', data: '293' },
  { title: '296', name: '296', data: '296' },
  { title: '340', name: '340', data: '340' },
  { title: '350', name: '350', data: '350' },
  { title: '360', name: '360', data: '360' },
  { title: '370', name: '370', data: '370' },
  { title: '380', name: '380', data: '380' },
  { title: '610', name: '610', data: '610' },
  { title: '620', name: '620', data: '620' },
  { title: '630', name: '630', data: '630' },
  { title: '900', name: '900', data: '900' },
  { title: '930', name: '930', data: '930' },
  { title: '950', name: '950', data: '950' }
]
