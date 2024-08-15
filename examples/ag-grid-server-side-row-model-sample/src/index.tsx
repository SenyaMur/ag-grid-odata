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
        caseSensitiveColumns: ["Customer.Name"],
        callApi: options =>
          fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(`https://services.odata.org/V4/Northwind/Northwind.svc/Order_Details${options}`), {

          }).then(resp => resp.json()),
        beforeRequest: (query, provider) => {
          query.expand = ["Order"];
          query.select = ["OrderID",
            "ProductID",
            "UnitPrice",
            "Quantity",
            "Discount"]
        },
        afterLoadData: (options, rowData, totalCount) => {
          if (options.skip === 0 && rowData.length > 0) {
            params.columnApi.autoSizeAllColumns();
          }
        },
        customFilters: {
          "Amount": (colName, col, isCaseSensitive, provider) => {
            return provider.odataOperator[col.type](colName, col.filter, col.filterTo)
          }
        },
        rowCustomFilter: {
          "Order.ShippedDate": (colName, value) => {
            return colName + " eq " + value;
          },
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
          <AgGridColumn enableRowGroup field="OrderID" headerName="Order ID" />
          <AgGridColumn
            enableRowGroup
            field="Order.ShippedDate"
            valueGetter={param =>
              param.data && param.data.Order.ShippedDate
                ? new Date(param.data.Order.ShippedDate).toISOString().substring(0, 10)
                : ""
            }
            headerName="ShippedDate"
          />
          <AgGridColumn
            enableRowGroup
            field="Order.CustomerID"
            headerName="Customer"
            filter="agTextColumnFilter"
          />

          <AgGridColumn
            field="Order.Freight"
            headerName="Freight"
            enableValue
            filter="agNumberColumnFilter"
          />
          <AgGridColumn
            field="UnitPrice"
            headerName="UnitPrice"
            enableValue
            filter="agNumberColumnFilter"
          />
          <AgGridColumn
            field="Quantity"
            headerName="Quantity"
            enableValue
            filter="agNumberColumnFilter"
          />
          <AgGridColumn
            field="Discount"
            headerName="Discount"
            enableValue
            filter="agNumberColumnFilter"
          />

        </AgGridReact>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
