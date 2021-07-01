import ReactDOM from "react-dom";
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { OdataServerSideProvider } from "ag-grid-odata";

import { GridReadyEvent } from "ag-grid-community";
import "./styles.css";

function App() {
  const onGridReady = (params: GridReadyEvent) => {
    params.api.setServerSideDatasource(
      new OdataServerSideProvider({
        isCaseSensitiveStringFilter: false,
        caseSensitiveColumns:["Customer.Name"],
        callApi: options =>
          fetch(`https://odatav4sample.herokuapp.com/odata/Orders${options}`, {
            headers: {
              "Content-type": "application/json",
              Accept: "application/json"
            }
          }).then(resp => resp.json()),
        beforeRequest: (query, provider) => {
          query.expand = ["customer"];
          query.select = ["Id","Price","Amount","Created"]
        },
        afterLoadData: (options, rowData, totalCount) => {
          if (options.skip === 0 && rowData.length > 0) {
            params.columnApi.autoSizeAllColumns();
          }
        },
        customFilters:{
          "Amount": (colName,col,isCaseSensitive,provider)=>{
            return provider.odataOperator[col.type](colName, col.filter, col.filterTo)
          }
        }
      })
    );
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h3>Odata provider for server side mode. Features:</h3>
      <ol>
        <li>Fetch records</li>
        <li>Sorting</li>
        <li>Filter</li>
        <li>Grouping</li>
        <li>Aggregation</li>
        <li>Pivot</li>
      </ol>
      <div
        id="myGrid"
        style={{
          height: "100%",
          width: "100%"
        }}
        className="ag-theme-balham"
      >
        <AgGridReact
          sideBar={true}
          //Enable server mode DataSource
          rowModelType="serverSide"
          //@ts-ignore
          serverSideStoreType="partial"
          // fetch 100 rows per at a time
          cacheBlockSize={100}
          onGridReady={onGridReady}
          rowGroupPanelShow="onlyWhenGrouping"
          pivotPanelShow="always"
          suppressDragLeaveHidesColumns
          suppressMakeColumnVisibleAfterUnGroup
          autoGroupColumnDef={{
            pinned: "left"
          }}
          //Get Group count
          getChildCount={data => {
            return data && data.childCount;
          }}
          defaultColDef={{
            filter: true,
            sortable: true,
            resizable: true,
            enablePivot: true,
            allowedAggFuncs: ["sum", "min", "max", "avg", "count"],
            filterParams: {
              newRowsAction: "keep",
              browserDatePicker: true
            }
          }}
        >
          {/* <AgGridColumn
            field="#"
            sortable={false}
            resizable={false}
            width={60}
            valueGetter="node.rowIndex + 1"
          /> */}
          {/* enableRowGroup */}
          <AgGridColumn enableRowGroup field="Id" headerName="Order ID" />
          <AgGridColumn
            enableRowGroup
            field="Customer.Name"
            headerName="Customer"
            filter="agTextColumnFilter"
          />
          <AgGridColumn
            field="Price"
            headerName="Price"
            enableValue
            filter="agNumberColumnFilter"
          />
          <AgGridColumn field="Amount" headerName="Amount" enableValue filter="agNumberColumnFilter" />
          <AgGridColumn
            field="Created"
            valueGetter={param =>
              param.data && param.data.Created
                ? new Date(param.data.Created).toISOString().substring(0, 10)
                : ""
            }
            headerName="Created"
          />
        </AgGridReact>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
