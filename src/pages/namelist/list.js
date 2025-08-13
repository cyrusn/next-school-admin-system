import { useStudentsContext } from '@/context/studentContext'
import DataTable from '@/components/dataTable'
import { useRef } from 'react'
import Nav from './components/nav'
import Loading from '@/components/loading'

const Namelist = () => {
  const { students } = useStudentsContext()
  const ref = useRef(null)
  const id = 'namelistTable'

  const columnDefs = [
    {
      title: 'Regno',
      data: 'regno',
      target: 0,
      width: '8%',
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'Classcode',
      data: 'classcode',
      visible: false,
      target: 1,
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'Class',
      data(row) {
        const { classcode, classno } = row
        return `${classcode}${String(classno).padStart(2, 0)}`
      },
      width: '8%',
      target: 2
    },
    {
      title: 'Name',
      data: 'ename',
      target: 3,
      width: '15%',
      searchBuilder: {
        defaultCondition: 'contains'
      }
    },
    {
      title: '姓名',
      data: 'cname',
      target: 4,
      width: '10%',
      searchBuilder: {
        defaultCondition: 'contains'
      }
    },
    {
      title: 'Sex',
      data: 'sex',
      target: 5,
      width: '5%',
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'House',
      data: 'house',
      target: 6,
      width: '5%',
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'DOB',
      data: 'dob',
      target: 7,
      width: '10%',
      searchPanes: { show: false },
      searchBuilder: {
        defaultCondition: '<'
      },
      visible: true
    },
    {
      title: 'X1',
      target: 8,
      data: 'x1',
      width: '5%',
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'X2',
      data: 'x2',
      target: 9,
      width: '5%',
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'X3',
      data: 'x3',
      target: 10,
      width: '5%',
      searchBuilder: {
        defaultCondition: '='
      }
    },
    {
      title: 'Groups',
      data(row) {
        return row.groups?.sort() || []
      },
      render: {
        _: '[, ]',
        sb: '[]',
        sp: '[]'
      },
      width: '10%',
      searchBuilder: {
        orthogonal: 'sb',
        defaultCondition: 'contains'
      },
      searchBuilderType: 'array',
      searchPanes: {
        show: true,
        orthogonal: 'sp'
      },
      target: 11
    },
    {
      title: 'Info',
      data(row) {
        const result = []
        if (row.isNcs) result.push('NCS')
        if (row.isNewlyArrived) result.push('Newly-Arrived')
        return result
      },
      width: '8%',
      render: {
        sb: '[]',
        _: function (row) {
          return row
            .map((type) => {
              if (type == 'NCS') return '🌎'
              if (type == 'Newly-Arrived') return '🇨🇳'
            })
            .join(' ')
        }
      },
      searchBuilder: {
        orthogonal: 'sb',
        defaultCondition: 'contains'
      },
      searchBuilderType: 'array',
      searchPanes: {
        options: [
          {
            label: 'NCS',
            value: function (rowData) {
              return rowData.isNcs == true
            }
          },
          {
            label: 'Newly-Arrived',
            value: function (rowData) {
              return rowData.isNewlyArrived == true
            }
          }
        ]
      },
      target: 12
    }
  ]

  const options = {
    fixedHeader: true,
    buttons: [
      { extend: 'copy', className: 'is-primary' },
      { extend: 'print', className: 'is-warning' }
    ],
    language: {
      searchBuilder: {
        title: {
          0: 'Search Filter',
          _: 'Search Filter (%d)'
        }
      }
    },
    layout: {
      top2: {
        searchPanes: {
          columns: [1, 5, 6, 8, 9, 10, 11, 12],
          viewTotal: true,
          initCollapsed: true,
          cascadePanes: true,
          liveSearch: false
        }
      },
      top1: {
        searchBuilder: {
          columns: [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          cascadePanes: true,
          viewTotal: true
        }
      },
      topStart: ['pageLength'],
      topEnd: ['pageLength', 'buttons'],
      bottomStart: 'info',
      bottomEnd: 'paging'
    },
    columnDefs,
    lengthMenu: [35, 60, -1],
    order: [1]
  }

  return (
    <>
      <Nav />
      {students.length ? (
        <DataTable id={id} ref={ref} options={options} data={students} />
      ) : (
        <Loading />
      )}
    </>
  )
}
export default Namelist
