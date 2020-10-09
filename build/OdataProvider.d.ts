import { IGetRowsParams, ColDef, ColGroupDef, IServerSideGetRowsRequest } from "@ag-grid-community/all-modules";
import { IServerSideGetRowsParams } from "@ag-grid-enterprise/all-modules";
import { OdataQueryExtendFull, OdataQueryExtendOptions, OdataQueryOptions } from "./types";
export declare class OdataProviderOptions {
    /**
     * Function for call odata api
     */
    callApi: (query: string) => Promise<any>;
    /**
     * Name of field contain count of record results in grouping odata query
     * @default childCount
     */
    groupCountFieldName?: string;
    /**
     * Use in odata build query
     * @default false
     */
    isCaseSensitiveStringFilter?: boolean;
    /**
     * Callback for extend odata query options for implement user logic
     */
    beforeRequest?: (options: OdataQueryOptions, provider: OdataProvider, request: IGetRowsParams | IServerSideGetRowsRequest) => void;
    /**
    * Callback for pivot or group for aplly column ag-grid settings
    * @example
    * <pre><code>
    * beforeSetSecondaryColumns = secondaryColumns => {
     for (let i = 0; i < secondaryColumns.length; i++) {
       const col = secondaryColumns[i]
       if (col.children) {
         beforeSetSecondaryColumns(col.children)
       } else {
         //Aplly new setting for group dyncamic created column
         // col.cellClassRules =
         // col.valueFormatter =
       }
     }
   }
    * </pre></code>
    */
    beforeSetSecondaryColumns?: (secondaryColDefs: (ColDef | ColGroupDef)[]) => void;
    /**
    * Callback invoked after load data
    * @param options odata provider options
    * @param rowData data for ag-grid
    * @param totalCount total count records
    *
    * @example
    * <pre><code>
         afterLoadData = (options, rowData, totalCount) => {
             if (options.skip === 0 && rowData.length > 0) {
             gridApi.columnController.autoSizeAllColumns()
             }
         }
    * </code></pre>
    */
    afterLoadData?: (options: OdataQueryExtendOptions, rowData: any[], totalCount: number) => void;
    /**
     * Callback for catch error
     */
    setError?: (error: any) => void;
}
declare interface CancelablePromise {
    promise: Promise<any>;
    cancel: () => void;
}
export declare class OdataProvider implements OdataProviderOptions {
    /**
     * Function for call odata api
     */
    callApi: (query: string) => Promise<any>;
    /**
     * Name of field contain count of record results in grouping odata query
     * @default childCount
     */
    groupCountFieldName: string;
    /**
     * Use in odata build query
     * @default false
     */
    isCaseSensitiveStringFilter: boolean;
    /**
     * Callback for extend odata query options for implement user logic
     */
    beforeRequest: (options: OdataQueryOptions, provider: OdataProvider, request: IGetRowsParams | IServerSideGetRowsRequest) => void;
    /**
      * Callback for pivot or group for aplly column ag-grid settings
      * @example
      * <pre><code>
      * beforeSetSecondaryColumns = secondaryColumns => {
       for (let i = 0; i < secondaryColumns.length; i++) {
         const col = secondaryColumns[i]
         if (col.children) {
           beforeSetSecondaryColumns(col.children)
         } else {
           //Aplly new setting for group dyncamic created column
           // col.cellClassRules =
           // col.valueFormatter =
         }
       }
     }
      * </pre></code>
      */
    beforeSetSecondaryColumns: (secondaryColDefs: (ColDef | ColGroupDef)[]) => void;
    /**
      * Callback invoked after load data
      * @param options odata provider options
      * @param rowData data for ag-grid
      * @param totalCount total count records
      *
      * @example
      * <pre><code>
           afterLoadData = (options, rowData, totalCount) => {
               if (options.skip === 0 && rowData.length > 0) {
               gridApi.columnController.autoSizeAllColumns()
               }
           }
      * </code></pre>
      */
    afterLoadData: (options: OdataQueryExtendOptions, rowData: any[], totalCount: number) => void;
    /**
     * Callback for catch error
     */
    setError: (error: any) => void;
    cancelPromice: CancelablePromise;
    constructor(options: OdataProviderOptions);
    /**Creator a cancelable Promise */
    createCancelablePromise: () => CancelablePromise;
    /**Odata query operations */
    odataOperator: {
        equals: (col: string, value1: string) => string;
        notEqual: (col: string, value1: string) => string;
        lessThan: (col: string, value1: string) => string;
        lessThanOrEqual: (col: string, value1: string) => string;
        greaterThan: (col: string, value1: string) => string;
        greaterThanOrEqual: (col: string, value1: string) => string;
        inRange: (col: string, value1: string, value2: any) => string;
        equalsStr: (col: string, value1: string, isCaseSensitiveStringFilter: boolean) => string;
        notEqualStr: (col: string, value1: string, isCaseSensitiveStringFilter: boolean) => string;
        contains: (col: string, value1: string, isCaseSensitiveStringFilter: boolean) => string;
        notContains: (col: string, value1: string, isCaseSensitiveStringFilter: boolean) => string;
        startsWith: (col: string, value1: string, isCaseSensitiveStringFilter: boolean) => string;
        endsWith: (col: string, value1: string, isCaseSensitiveStringFilter: boolean) => string;
        inStr: (col: string, values: string[], isCaseSensitiveStringFilter: boolean) => string;
        in: (col: string, values: string[]) => string;
        notIn: (col: string, values: string[]) => string;
        trunc: (col: string) => string;
    };
    /**
     * Apply tolower for column in odata syntax
     * @param col column name
     * @param isCaseSensitiveStringFilter need apply tolower
     */
    ifTolowerCol: (col: string, isCaseSensitiveStringFilter: boolean) => string;
    /**
     *
     * @param value string value
     * @param isCaseSensitiveStringFilter  need apply tolower
     */
    ifTolower: (value: string, isCaseSensitiveStringFilter: boolean) => string;
    /**
     * Odata aggregation operations
     */
    odataAggregation: {
        sum: (col: string, asField?: any) => string;
        min: (col: string, asField?: any) => string;
        max: (col: string, asField?: any) => string;
        avg: (col: string, asField?: any) => string;
        count: (col: string, asField?: any) => string;
    };
    /**
     * Odata query builder
     * @param options parameter for odata query
     */
    toQuery: (options: OdataQueryExtendFull) => string;
    /**
     * Add quotes for string value
     * @param value string value
     */
    encode: (value: string) => string;
    /**
     * Conctat to date a time for create datetime format for odata query
     * @param value date string
     */
    toDateTime: (value: string) => string | null;
    /**
     * Convert ag-grid column filter to odata query
     * @param colName columnName
     * @param col ag-grid column
     */
    private getFilterOdata;
    /**
     * Caclulate pivot data for ag-grid from odata
     * @param pivotCols pivot columns
     * @param rowGroupCols row group columns
     * @param valueCols value columns
     * @param data odata result
     * @param countField count field name
     */
    private getPivot;
    /**
     *
     * @param rowData array odata result
     * @param rowGroupCols row group columns
     * @param groupKeys what groups the user is viewing
     * @param countField count field name
     */
    private buildGroupsFromData;
    /**
     * Internal function for execute callback function for each property of object
     * @param object object contained odata grouped result
     * @param callback function do somthing
     */
    private iterateObject;
    /**
     * Prepeare grouped data
     * @param rowData array odata result
     * @param field grouping field
     */
    private groupBy;
    /**
     * Calculate total count records in group
     * @param rowData array odata result data
     * @param countField field contained count of all records
     */
    private aggregateList;
    /**
       * Calculate distinct values for input field from Odata api
       * @param field The field of the row to get the cells data from
       * @param callback The function for return distinct values for input field
       * @example
       * <pre><code>
       *  const setFilterValuesFuncParams = params => {
       *    const me = this
       *    const col = params.colDef.field
       *    const storeName = me.getStoreName(col)
       *    const callback = data => {
       *      if (data) {
       *        me.setState({ [storeName]: data })
       *        params.success(data)
       *      }
       *    }
       *    odataProviderInstance.getFilterValuesParams(params.colDef.field, callback)
       *  }
       *
       * ///....
       *      <AgGridColumn
                    field="product"
                    headerName={'PRODUCT'}
                    filter="agSetColumnFilter"
                    // rowGroup
                    // enablePivot
                    enableRowGroup
                    filterParams={{
                      values: setFilterValuesFuncParams,
                      newRowsAction: 'keep'
                    }}
                    // filterParams={{caseSensitive: true}}
                  />
       * </code></pre>
       */
    getFilterValuesParams: (field: string, callback: (data: any[]) => void) => void;
    /**
     * Detect is string value
     * @param value
     */
    isStrVal: (value: any) => boolean;
    /**
     * Extartc values from odata response
     * @param response
     */
    private getOdataResult;
    /**
     * Endocing column name to odata notation
     * @param colName column name
     */
    private getWrapColumnName;
    /**
     * grid calls this to get rows
     * @param params ag-grid details for the request
     */
    getRows: (params: IGetRowsParams | IServerSideGetRowsParams) => void;
    /**
     * Generate odata options for build query from ag-grid request
     * @param params ag-grid details for the request
     */
    getOdataOptions: (params: IGetRowsParams | IServerSideGetRowsParams) => OdataQueryExtendFull;
    /**
     * Generate odata query from ag-grid request
     * @param params ag-grid details for the request
     */
    getOdataQuery: (params: IGetRowsParams | IServerSideGetRowsParams) => string;
}
export {};
