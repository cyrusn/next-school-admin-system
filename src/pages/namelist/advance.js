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
    title: 'Email',
    data(row) {
      return `lp${row.regno}@liping.edu.hk`
    },
    width: '15%',
    visible: false,
    searchBuilder: {
      defaultCondition: 'contains'
    },
    target: 1
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
    title: 'Classcode',
    data: 'classcode',
    visible: false,
    target: 3,
    width: '5%',
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'Classno',
    data: 'classno',
    visible: false,
    width: '5%',
    target: 4
  },
  {
    title: 'Name',
    data: 'ename',
    target: 5,
    width: '15%',
    searchBuilder: {
      defaultCondition: 'contains'
    }
  },
  {
    title: '姓名',
    data: 'cname',
    target: 6,
    width: '10%',
    searchBuilder: {
      defaultCondition: 'contains'
    }
  },
  {
    title: 'Sex',
    data: 'sex',
    target: 7,
    width: '5%',
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'House',
    data: 'house',
    target: 8,
    width: '5%',
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'DOB',
    data: 'dob',
    target: 9,
    width: '10%',
    visible: true,
    searchPanes: { show: false },
    searchBuilder: {
      defaultCondition: '<'
    }
  },
  {
    title: 'X1',
    target: 10,
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
    target: 11,
    width: '5%',
    visible: false,
    searchBuilder: {
      defaultCondition: '='
    }
  },
  {
    title: 'X3',
    data: 'x3',
    target: 12,
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
    target: 13
  },
  {
    title: 'NCS',
    data(row) {
      const { isNcs } = row
      return `${isNcs ? 'Y' : ''}`
    },
    visible: false,
    width: '5%',
    searchBuilder: {
      defaultCondition: '='
    },
    target: 14
  },
  {
    title: 'SEN Type',
    data: 'senType',
    width: '5%',
    visible: false,
    searchBuilder: {
      defaultCondition: 'contains'
    },
    target: 15
  },
  {
    title: 'Exam Arrangement',
    data: 'examArrangement',
    width: '5%',
    visible: false,
    searchBuilder: {
      defaultCondition: 'contains'
    },
    target: 16
  },
  {
    title: 'First Arrival Date',
    data: 'firstArrivedDate',
    width: '10%',
    visible: false,
    searchBuilder: {
      defaultCondition: '>'
    },
    target: 17
  },
  {
    title: 'School From Type',
    data: 'schFromType',
    width: '10%',
    visible: false,
    searchBuilder: {
      defaultCondition: '='
    },
    target: 18
  },
  {
    title: 'School From',
    data: 'schFrom',
    width: '15%',
    visible: false,
    searchBuilder: {
      defaultCondition: 'contains'
    },
    target: 19
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
        columns: [2, 3, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        viewTotal: true,
        initCollapsed: true,
        cascadePanes: true,
        liveSearch: false
      }
    },
    top2: {
      searchBuilder: {
        columns: [0, 1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
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
  order: [
    [3, 'asc'],
    [4, 'asc']
  ]
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
