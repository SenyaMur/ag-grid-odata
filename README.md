# ag-grid-odata

Odata provider for ag-grid

Ag-Grid Server Side Row Model [demo](https://codesandbox.io/s/ag-grid-server-side-row-model-sample-zqujt?fontsize=14&hidenavigation=1&theme=dark)


## Installation

  `npm install ag-grid-odata`

## Usage

### Client mode

Features in client mode:

* Fetch records
* Sorting
* Filter

<details>
  <summary>Code example</summary>

```js
import OdataProvider from 'ag-grid-odata'
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react"
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham-dark.css";

const onGridReady = (params) => {
    const gridApi = params.api;
    gridApi.setDatasource(
      new OdataProvider({
            callApi: (options) =>fetch(`yourOdataUrlService/EntitySet${options}`)
            .then(resp=>resp.json())
            .then(resp => { return resp.data });
        })
    )
  }

function(props) MyGrid(){
return (
    <AgGridReact
      rowModelType='infinite'
      // fetch 100 rows per at a time
      cacheBlockSize={100}
      onGridReady={onGridReady}
      rowGroupPanelShow='onlyWhenGrouping'
      suppressDragLeaveHidesColumns
      suppressMakeColumnVisibleAfterUnGroup
      autoGroupColumnDef={{
        pinned: 'left'
      }}
      defaultColDef={{
        sortable: true,
        resizable: true,
        filterParams: {
          newRowsAction: 'keep',
          browserDatePicker: true
        }
      }}
    >
      <AgGridColumn
        field="#"
        sortable={false}
        resizable={false}
        width={60}
        valueGetter='node.rowIndex + 1'
      />
      <AgGridColumn
        field="Order_ID"
        headerName="Order ID"
      />
      <AgGridColumn
        field="Order_Invoice_Number"
        headerName="Invoice Number"
      />
      <AgGridColumn
        enableRowGroup
        field="Order_Date"
        headerName="Date"
      />
      <AgGridColumn
        enableValue
        field="Order_Shipping_Amount"
        headerName="Shipping Amount"
      />
      <AgGridColumn
        enableValue
        field="Order_Total_Amount"
        headerName="Total Amount"
      />
    </AgGridReact>
  )
}
```

</details>

### Server mode

Features in client mode:

* Fetch records
* Sorting
* Filter
* Grouping
* Aggregation
* Pivot

<details>
  <summary>Code example</summary>

```js
import OdataProvider from 'ag-grid-odata'
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react"
import { AllModules } from "@ag-grid-enterprise/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham-dark.css";

const onGridReady = (params) => {
    const gridApi = params.api;
    gridApi.setServerSideDatasource(
      new OdataProvider({
            callApi: (options) =>fetch(`yourOdataUrlService/EntitySet${options}`)
            .then(resp=>resp.json())
            .then(resp => { return resp.data });
        })
    )
  }

function(props) MyGrid(){
return (
    <AgGridReact
      modules={AllModules}
      //Enable server mode DataSource
      rowModelType='serverSide'
      // fetch 100 rows per at a time
      cacheBlockSize={100}
      onGridReady={onGridReady}
      rowGroupPanelShow='onlyWhenGrouping'
      pivotPanelShow='always'
      suppressDragLeaveHidesColumns
      suppressMakeColumnVisibleAfterUnGroup
      autoGroupColumnDef={{
        pinned: 'left'
      }}
      //Get Group count
      getChildCount={(data) => {
        return data && data.childCount;
      }}
      defaultColDef={{
        sortable: true,
        resizable: true,
        enablePivot: true,
        allowedAggFuncs: ['sum', 'min', 'max', 'avg', 'count'],
        filterParams: {
        newRowsAction: 'keep',
        browserDatePicker: true
        }
      }}
    >
      <AgGridColumn
        field="#"
        sortable={false}
        resizable={false}
        width={60}
        valueGetter='node.rowIndex + 1'
      />
      <AgGridColumn
        field="Order_ID"
        headerName="Order ID"
      />
      <AgGridColumn
        field="Order_Invoice_Number"
        headerName="Invoice Number"
      />
      <AgGridColumn
        enableRowGroup
        field="Order_Date"
        headerName="Date"
      />
      <AgGridColumn
        enableValue
        field="Order_Shipping_Amount"
        headerName="Shipping Amount"
      />
      <AgGridColumn
        enableValue
        field="Order_Total_Amount"
        headerName="Total Amount"
      />
    </AgGridReact>
  )
}
```

</details>
