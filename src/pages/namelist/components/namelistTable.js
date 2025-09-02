import { HOMEBASES, TERM, SCHOOL_YEAR } from '@/config/constant'
import _ from 'lodash'

export default function NamelistTable({
  students,
  teacher,
  location,
  classTitle
}) {
  return (
    <div className='table-container'>
      <table className='table is-bordered is-narrow is-hoverable is-fullwidth print-table'>
        <thead>
          <tr>
            <td style={{ border: 'none' }} colSpan='8' className='underline'>
              <span>統一收功課名單／點名紙</span>
            </td>
          </tr>
          <tr>
            <td style={{ border: 'none' }} colSpan='6' className='underline'>
              <span className='is-underlined content'>
                科目：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ border: 'none' }} colSpan='6'>
              <span className='is-underlined content'>
                任教老師：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ border: 'none' }} colSpan='6'>
              <span className='is-underlined content'>
                收回功課總數：&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ border: 'none' }} colSpan='2'>
              {'Year: '}
              {`${SCHOOL_YEAR}-${parseInt(SCHOOL_YEAR) + 1}`}
            </td>
            <td colSpan='6' style={{ border: 'none' }}>
              {location && `Homebase: ${location}`}
            </td>
          </tr>
          <tr>
            <td style={{ border: 'none' }} colSpan='2'>
              {`Class: ${classTitle}`}
            </td>
            <td style={{ border: 'none' }} colSpan='6'>
              {`Teacher: ${teacher}`}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: '10%' }}>No.</td>
            <td style={{ width: '40%' }}>Name</td>
            <td style={{ width: '20%' }}>姓名</td>
            <td style={{ width: '5%' }}>S</td>
            <td style={{ width: '5%' }}>H</td>
            <td style={{ width: '5%' }}></td>
            <td style={{ width: '5%' }}></td>
            <td style={{ width: '5%' }}></td>
          </tr>
          {_.sortBy(students, ['classcode', 'classno']).map((s) => {
            return (
              <tr key={s.regno}>
                <td>{`${s.classcode}${String(s.classno).padStart(2, 0)}`}</td>
                <td
                  className={
                    s.ename?.length > 14
                      ? 'is-size-7 is-align-content-center'
                      : ''
                  }
                >
                  {s.isHidden ? '' : s.ename}
                </td>
                <td>{s.isHidden ? '' : s.cname || ''}</td>
                <td>{s.isHidden ? '' : s.sex}</td>
                <td>{s.isHidden ? '' : s.house}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )
          })}
          <tr>
            <td
              colSpan='8'
              className='has-text-right'
            >{`No of students: ${students.length}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
