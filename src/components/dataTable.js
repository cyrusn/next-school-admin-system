import DataTable from 'datatables.net-react'
import DT from 'datatables.net-bm' // Import DataTables CSS

import 'datatables.net-select-bm'
import 'datatables.net-buttons-bm'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.print'
import 'datatables.net-fixedcolumns-bm'
import 'datatables.net-fixedheader-bm'
import 'datatables.net-searchbuilder-bm'
import 'datatables.net-searchpanes-bm'
import 'datatables.net-columncontrol-bm'
import 'datatables.net-datetime'

const DataTableInstance = ({
  id,
  columns,
  url,
  ref,
  options,
  className,
  data
}) => {
  DataTable.use(DT)

  return (
    <div className='table-container'>
      <DataTable
        id={id}
        ref={ref}
        className={`table is-bordered striped is-narrow is-hoverable is-fullwidth ${className ? className : ''}`}
        columns={columns}
        ajax={url}
        options={options}
        data={data}
      >
        <thead></thead>
      </DataTable>
    </div>
  )
}

export default DataTableInstance
