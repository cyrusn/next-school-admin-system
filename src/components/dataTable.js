import { useEffect, useRef } from 'react'
import $ from 'jquery'
import pdfmake from 'pdfmake'

import 'datatables.net-bm' // Import DataTables CSS
import 'datatables.net-select-bm'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.print'
import 'datatables.net-buttons-bm'

const DataTableInstance = ({ columns, data }) => {
  const tableRef = useRef()

  useEffect(() => {
    const options = {
      dom: '<"level" <"level-left"l> <"level-right" B> > frtip',
      data,
      columns
    }

    const tableElement = $(tableRef.current)

    const isDataTable = $.fn.DataTable.isDataTable(tableElement)
    if (!isDataTable) {
      tableElement.DataTable(options)
    } else {
      tableElement.DataTable().clear().rows.add(data).draw()
    }
  }, [columns, data])

  if (data.length) {
    return (
      <table
        ref={tableRef}
        className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'
      ></table>
    )
  }
  return <></>
}

export default DataTableInstance
