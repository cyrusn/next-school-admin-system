import { useStudentsContext } from '@/context/studentContext'
import DataTable from '@/components/dataTable'
import { useRef } from 'react'
import Nav from './components/nav'
import Loading from '@/components/loading'

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
    title: 'Class',
    data(row) {
      const { classcode, classno } = row
      return `${classcode}${String(classno).padStart(2, 0)}`
    },
    width: '8%',
    target: 1
  },
  {
    title: 'Classcode',
    data: 'classcode',
    visible: false,
    target: 2,
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'Classno',
    data: 'classno',
    visible: false,
    target: 3
  },
  {
    title: 'Name',
    data: 'ename',
    target: 4,
    width: '15%',
    searchBuilder: {
      defaultCondition: 'contains'
    }
  },
  {
    title: '姓名',
    data: 'cname',
    target: 5,
    width: '10%',
    searchBuilder: {
      defaultCondition: 'contains'
    }
  },
  {
    title: 'Sex',
    data: 'sex',
    target: 6,
    width: '5%',
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'House',
    data: 'house',
    target: 7,
    width: '5%',
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'DOB',
    data: 'dob',
    target: 8,
    width: '10%',
    visible: true,
    searchPanes: { show: false },
    searchBuilder: {
      defaultCondition: '<'
    }
  },
  {
    title: 'X1',
    target: 9,
    data: 'x1',
    width: '5%',
    visible: false,
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'X2',
    data: 'x2',
    target: 10,
    width: '5%',
    visible: false,
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'X3',
    data: 'x3',
    target: 11,
    width: '5%',
    visible: false,
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
    visible: false,
    searchBuilder: {
      orthogonal: 'sb',
      defaultCondition: 'contains'
    },
    searchBuilderType: 'array',
    searchPanes: {
      show: true,
      orthogonal: 'sp'
    },
    target: 12
  },
  {
    title: 'Info',
    data(row) {
      const result = []
      if (row.isNcs) result.push('NCS')
      if (row.isNewlyArrived) result.push('Newly-Arrived')
      if (row.isSen) result.push('SEN')
      return result
    },
    visible: false,
    width: '8%',
    render: {
      sb: '[]',
      _: function (row) {
        return row
          .map((type) => {
            if (type == 'NCS') return '🌎'
            if (type == 'Newly-Arrived') return '🇨🇳'
            if (type == 'SEN') return '❤️'
          })
          .join(' ')
      },
      export: '[]'
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
        },

        {
          label: 'SEN',
          value: function (rowData) {
            return rowData.isSen == true
          }
        }
      ]
    },
    target: 13
  }
]

const options = {
  fixedHeader: true,
  language: {
    searchBuilder: {
      title: {
        0: 'Search Filter',
        _: 'Search Filter (%d)'
      }
    }
  },
  layout: {
    top3: {
      searchPanes: {
        columns: [1, 6, 7, 9, 10, 11, 12, 13],
        viewTotal: true,
        initCollapsed: true,
        cascadePanes: true,
        liveSearch: false
      }
    },
    top2: {
      searchBuilder: {
        columns: [0, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        cascadePanes: true,
        viewTotal: true
      }
    },
    top1: {
      buttons: [
        {
          extend: 'columnsToggle'
        }
      ]
    },
    topStart: ['pageLength'],
    topEnd: {
      buttons: [
        {
          extend: 'copy',
          className: 'is-primary',
          exportOptions: {
            columns: ':visible',
            orthogonal: 'export'
          }
        },
        {
          extend: 'print',
          text: 'Preview',
          className: 'is-warning',
          autoPrint: false,
          exportOptions: {
            columns: ':visible',
            orthogonal: 'export'
          }
        }
      ]
    },
    bottomStart: 'info',
    bottomEnd: 'paging'
  },
  columnDefs,
  lengthMenu: [35, 60, -1],
  order: [1]
}

const AdvanceList = () => {
  const { students } = useStudentsContext()
  const ref = useRef(null)
  const id = 'namelistTable'


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
export default AdvanceList
