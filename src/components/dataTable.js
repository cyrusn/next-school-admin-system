import { useEffect, useState, useRef } from 'react'
import $ from 'jquery'
import pdfmake from 'pdfmake'

import DataTable from 'datatables.net-react'
import DT from 'datatables.net-bm' // Import DataTables CSS

import 'datatables.net-select-bm'
import 'datatables.net-buttons-bm'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.print'

const DataTableInstance = ({ columns, url, ref, options }) => {
  DataTable.use(DT)

  return (
    <DataTable
      ref={ref}
      className='table is-bordered is-striped is-narrow is-hoverable is-fullwidth'
      columns={columns}
      ajax={url}
      options={options}
    >
      <thead></thead>
    </DataTable>
  )
}

export default DataTableInstance
