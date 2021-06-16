import {
  IGetRowsParams,
  ColDef,
  ColGroupDef,
  ColumnVO,
  IServerSideGetRowsRequest
} from "@ag-grid-community/all-modules";
import { IServerSideGetRowsParams } from "@ag-grid-enterprise/all-modules";

import {
  OdataQueryExtendFull,
  OdataQueryExtendOptions,
  OdataQueryOptions,
  PivotResultDat,
} from "./types";

import {replaceAll} from './utils'
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
  beforeRequest?: (
    options: OdataQueryOptions,
    provider: OdataProvider,
    request: IGetRowsParams | IServerSideGetRowsRequest
  ) => void;
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
  beforeSetSecondaryColumns?: (
    secondaryColDefs: (ColDef | ColGroupDef)[]
  ) => void;
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
  afterLoadData?: (
    options: OdataQueryExtendOptions,
    rowData: any[],
    totalCount: number
  ) => void;
  /**
   * Callback for catch error
   */
  setError?: (error: any, params: IGetRowsParams | IServerSideGetRowsParams) => void;
  /**
   * List of columns by id/field are case sensitive for build odata query
   */
  caseSensitiveColumns?: string[];
  /**
   * Use for specified column custom filter implementation
   * <pre><code>
       customFilters: {
           "customer": (colName,col,isCaseSensitiveStringFilter,provider) =>{
             return provider.odataOperator.in(
              colName,
              col.values
            )
           }
       }
   */
  customFilters?: {
    [index: string] : (colName: string,
      col: any,
      isCaseSensitiveStringFilter: boolean,
      provider: OdataProvider)=> string
  } | ((provider: OdataProvider) => void)
}


declare interface CancelablePromise {
  promise: Promise<any>;
  cancel: () => void;
}
export class OdataProvider implements OdataProviderOptions {
  /**
   * Function for call odata api
   */
  callApi: (query: string) => Promise<any>;
  /**
   * Name of field contain count of record results in grouping odata query
   * @default childCount
   */
  groupCountFieldName: string = "childCount";
  /**
   * Use in odata build query
   * @default false
   */
  isCaseSensitiveStringFilter: boolean = false;
  /**
   * Callback for extend odata query options for implement user logic
   */
  beforeRequest: (
    options: OdataQueryOptions,
    provider: OdataProvider,
    request: IGetRowsParams | IServerSideGetRowsRequest
  ) => void;
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
  beforeSetSecondaryColumns: (
    secondaryColDefs: (ColDef | ColGroupDef)[]
  ) => void;
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
  afterLoadData: (
    options: OdataQueryExtendOptions,
    rowData: any[],
    totalCount: number
  ) => void;
  /**
   * Callback for catch error
   */
  setError: (error: any, params: IGetRowsParams | IServerSideGetRowsParams) => void;
  /**
   * List of columns by id/field are case sensitive for build odata query
   */
  caseSensitiveColumns?: string[];
  /**
   * Use for specified column custom filter implementation
   * <pre><code>
       customFilters: {
           "customer": (colName,col,isCaseSensitiveStringFilter,provider) =>{
             return provider.odataOperator.in(
              colName,
              col.values
            )
           }
       }
   */
  customFilters?: {
    [index: string] : (colName: string,
      col: any,
      isCaseSensitiveStringFilter: boolean,
      provider: OdataProvider)=> string
  }
  cancelPromice: CancelablePromise;
  constructor(options: OdataProviderOptions) {
    Object.assign(this, options);
    if (this.callApi == null) {
      throw new Error("callApi must be specified");
    }
    if (typeof this.callApi !== "function") {
      throw new Error("callApi must be a function");
    }
    if (
      this.beforeRequest != null &&
      typeof this.beforeRequest !== "function"
    ) {
      throw new Error("beforeRequest must be a function");
    }
    if (
      this.afterLoadData != null &&
      typeof this.afterLoadData !== "function"
    ) {
      throw new Error("afterLoadData must be a function");
    }
    if (this.setError != null && typeof this.setError !== "function") {
      throw new Error("setError must be a function");
    }
    this.cancelPromice = this.createCancelablePromise();
  }

  /**Creator a cancelable Promise */
  createCancelablePromise = (): CancelablePromise => {
    let cancel;
    const pr = new Promise((_, reject) => {
      cancel = reject;
    }).catch(() => {});
    return {
      promise: pr,
      cancel,
    };
  };
  /**Odata query operations */
  odataOperator = {
    // Logical
    equals: (col: string, value1: string): string => `${col} eq ${value1}`,
    notEqual: (col: string, value1: string): string => `${col} ne ${value1}`,
    lessThan: (col: string, value1: string): string => `${col} lt ${value1}`,
    lessThanOrEqual: (col: string, value1: string): string =>
      `${col} le ${value1}`,
    greaterThan: (col: string, value1: string): string => `${col} gt ${value1}`,
    greaterThanOrEqual: (col: string, value1: string): string =>
      `${col} ge ${value1}`,
    inRange: (col: string, value1: string, value2: any): string =>
      `(${col} ge ${value1} and ${col} le ${value2})`,
    // String
    equalsStr: (
      col: string,
      value1: string,
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )} eq ${this.ifTolower(value1, isCaseSensitiveStringFilter)}`,
    notEqualStr: (
      col: string,
      value1: string,
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )} ne ${this.ifTolower(value1, isCaseSensitiveStringFilter)}`,
    contains: (
      col: string,
      value1: string,
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `contains(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)})`,
    notContains: (
      col: string,
      value1: string,
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `contains(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)}) eq false`,
    startsWith: (
      col: string,
      value1: string,
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `startswith(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)})  eq true`,
    endsWith: (
      col: string,
      value1: string,
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `endswith(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)})  eq true`,
    inStr: (
      col: string,
      values: string[],
      isCaseSensitiveStringFilter: boolean
    ): string =>
      `${this.ifTolowerCol(col, isCaseSensitiveStringFilter)} in (${values
        .map((x) => `'${this.ifTolower(this.encode(x), isCaseSensitiveStringFilter)}'`)
        .join()})`,
    in: (col: string, values: string[]) =>
      `${col} in (${values.map((x) => `${this.encode(x)}`).join()})`,
    notIn: (col: string, values: string[]) =>
      `not (${col} in (${values.map((x) => `${x}`).join()}))`,
    // Date
    trunc: (col: string): string => `date(${col})`,
  };

  /**
   * Apply tolower for column in odata syntax
   * @param col column name
   * @param isCaseSensitiveStringFilter need apply tolower
   */
  ifTolowerCol = (col: string, isCaseSensitiveStringFilter: boolean): string =>
    isCaseSensitiveStringFilter ? col : `tolower(${col})`;

  /**
   *
   * @param value string value
   * @param isCaseSensitiveStringFilter  need apply tolower
   */
  ifTolower = (value: string, isCaseSensitiveStringFilter: boolean): string =>
    isCaseSensitiveStringFilter ? value : value ? value.toLowerCase() : value;
  /**
   * Odata aggregation operations
   */
  odataAggregation = {
    // Logical
    sum: (col: string, asField?: any): string =>
      `${col} with sum as ${col || asField}`,
    min: (col: string, asField?: any): string =>
      `${col} with min as ${col || asField}`,
    max: (col: string, asField?: any): string =>
      `${col} with max as ${col || asField}`,
    avg: (col: string, asField?: any): string =>
      `${col} with average as ${col || asField}`,
    count: (col: string, asField?: any): string =>
      `$count as ${col || asField}`,
  };
  /**
   * Odata query builder
   * @param options parameter for odata query
   */
  toQuery = (options: OdataQueryExtendFull): string => {
    let path: string[] = [];
    if (options.count) {
      path.push("$count=true");
    }
    if (options.skip) {
      path.push(`$skip=${options.skip}`);
    }
    if (options.top) {
      path.push(`$top=${options.top}`);
    }
    if (options.sort && options.sort.length > 0) {
      path.push("$orderby=" + options.sort.join(","));
    }
    if (options.filter && options.filter.length > 0) {
      path.push("$filter=" + options.filter.join(" and "));
    }
    if (options.apply && options.apply.length > 0) {
      path.push("$apply=" + options.apply.join("/"));
    }
    if (options.expand && options.expand.length > 0) {
      path.push("$expand=" + options.expand.join(","));
    }
    if (options.select  && options.select.length > 0) {
      path.push("$select=" + options.select.join(","));
    }
    let query: string = "";
    if (path.length > 0) {
      query = "?" + path.join("&");
    }
    return query;
  };
  /**
   * Add quotes for string value
   * @param value string value
   */
  encode = (value: string): string =>
    this.isStrVal(value) ? replaceAll(value, "'", "''") : value;
  /**
   * Conctat to date a time for create datetime format for odata query
   * @param value date string
   */
  toDateTime = (value: string): string | null => {
    const dt = new Date(value);
    if (isNaN(dt.getTime())) return null;
    const dt1 = new Date(
      Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())
    );
    return dt1.toISOString();
  };
  /**
   * 
   * @param colName columnName
   * @returns is CaseSensitive for column
   */
  private getIsNeedCaseSensitive =(colName: string)=>{
    if(!this.isCaseSensitiveStringFilter && 
      this.caseSensitiveColumns &&
      this.caseSensitiveColumns.length > 0){
      return this.caseSensitiveColumns.indexOf(colName) >= 0;
    } 
    return this.isCaseSensitiveStringFilter;
  }
  /**
   * Convert ag-grid column filter to odata query
   * @param colName columnName
   * @param col ag-grid column
   */
  private getFilterOdata = (colName: string, col: any): string => {
    const me = this;
    const isCaseSensitiveStringFilter = me.getIsNeedCaseSensitive(colName)
    const customFilter = me.customFilters && me.customFilters[colName]
    colName = replaceAll(colName, ".", "/");
    colName = me.getWrapColumnName(colName);
    if (customFilter){
      return customFilter(colName,col,isCaseSensitiveStringFilter,me)
    }else{
      switch (col.filterType) {
        case "number":
          return me.odataOperator[col.type](colName, col.filter, col.filterTo);
        case "text": {
          let operatorName = col.type;
          const filter = me.encode(col.filter);
          // let filterTo = me.encode(col.filterTo);
          if (
            (operatorName === "equals" || operatorName === "notEqual") &&
            !isCaseSensitiveStringFilter
          ) {
            operatorName += "Str";
          }
          return me.odataOperator[operatorName](
            colName,
            `'${filter}'`,
            isCaseSensitiveStringFilter
          );
        }
        case "date":
          if (col.dateFrom != null  && me.toDateTime(col.dateFrom) != null && 
          (col.dateTo== null || (col.dateTo != null && me.toDateTime(col.dateTo) != null)) ){
            return me.odataOperator[col.type](
              colName,
              `${me.toDateTime(col.dateFrom)}`,
              `${me.toDateTime(col.dateTo)}`
            );
          }
          break;
        case "set":
          return col.values.length > 0
            ? me.odataOperator.inStr(
                colName,
                col.values,
                isCaseSensitiveStringFilter
              )
            : "";
        default:
          break;
      }
    }
    return "";
  };

  /**
   * Extract value from record by path to field
   * @param field path to column value 
   * @param obj  record
   */
  private getValue(field: string, obj : any): any{
    const paths = field.split('.');
    if (paths.length === 1){
      return obj[field]
    }else{
      return paths.reduce((object, path) => {
        return (object || {})[path]; // Oliver Steele's pattern
    }, obj)
    }
  }

  /**
   * Caclulate pivot data for ag-grid from odata
   * @param pivotCols pivot columns
   * @param rowGroupCols row group columns
   * @param valueCols value columns
   * @param data odata result
   * @param countField count field name
   */
  private getPivot = (
    pivotCols: ColumnVO[],
    rowGroupCols: ColumnVO[],
    valueCols: ColumnVO[],
    data: any[],
    countField: string
  ): PivotResultDat => {
    // assume 1 pivot col and 1 value col for this example
    const me = this;
    const pivotData: any[] = [];
    const aggColsList: any[] = [];

    const colKeyExistsMap: any = {};

    const secondaryColDefs: any[] = [];
    const secondaryColDefsMap = {};

    data.forEach(function (item) {
      var pivotValues: string[] = [];
      pivotCols.forEach(function (pivotCol) {
        var pivotField = pivotCol.id;
        var pivotValue = me.getValue(pivotField, item);
        if (
          pivotValue !== null &&
          pivotValue !== undefined &&
          pivotValue.toString
        ) {
          pivotValues.push(pivotValue.toString());
        } else {
          pivotValues.push("-");
        }
      });

      // var pivotValue = item[pivotField].toString();
      var pivotItem = {};

      valueCols.forEach(function (valueCol) {
        var valField = valueCol.id;
        var colKey = createColKey(pivotValues, valField);

        var value = me.getValue(valField, item);
        pivotItem[colKey] = value;

        if (!colKeyExistsMap[colKey]) {
          addNewAggCol(colKey, valueCol);
          addNewSecondaryColDef(colKey, pivotValues, valueCol);
          colKeyExistsMap[colKey] = true;
        }
      });
      if (countField) {
        pivotItem[countField] = me.getValue(countField, item);
      }

      rowGroupCols.forEach(function (rowGroupCol) {
        var rowGroupField = rowGroupCol.id.split('.')[0];
        pivotItem[rowGroupField] = item[rowGroupField];
      });

      pivotData.push(pivotItem);
    });

    function addNewAggCol(colKey: string, valueCol: ColumnVO): void {
      var newCol = {
        id: colKey,
        field: colKey,
        aggFunc: valueCol.aggFunc,
      };
      aggColsList.push(newCol);
    }

    function addNewSecondaryColDef(colKey, pivotValues, valueCol) {
      var parentGroup: any = null;

      var keyParts: any = [];

      pivotValues.forEach(function (pivotValue: any) {
        keyParts.push(pivotValue);
        var colKey = createColKey(keyParts);
        var groupColDef: any = secondaryColDefsMap[colKey];
        if (!groupColDef) {
          groupColDef = {
            groupId: colKey,
            headerName: pivotValue,
            children: [],
          };
          secondaryColDefsMap[colKey] = groupColDef;
          if (parentGroup) {
            parentGroup.children.push(groupColDef);
          } else {
            secondaryColDefs.push(groupColDef);
          }
        }
        parentGroup = groupColDef;
      });

      parentGroup.children.push({
        colId: colKey,
        headerName: valueCol.aggFunc + "(" + valueCol.displayName + ")",
        field: colKey,
        suppressMenu: true,
        sortable: false,
      });
    }

    function createColKey(pivotValues: string[], valueField?: string): string {
      var result = pivotValues.join("|");
      if (valueField !== undefined) {
        result += "|" + valueField;
      }
      result = replaceAll(result, ".", "*");
      return result;
    }

    return {
      data: pivotData,
      aggCols: aggColsList,
      secondaryColDefs: secondaryColDefs,
    };
  };

  /**
   *
   * @param rowData array odata result
   * @param rowGroupCols row group columns
   * @param groupKeys what groups the user is viewing
   * @param countField count field name
   */
  private buildGroupsFromData = (
    rowData: any[],
    rowGroupCols: ColumnVO[],
    groupKeys: string[],
    countField: string
  ): any[] => {
    const me = this;
    let rowGroupCol = rowGroupCols[groupKeys.length];
    let field = rowGroupCol.id;
    let mappedRowData = me.groupBy(rowData, field);
    let groups: any = [];

    me.iterateObject(mappedRowData, function (key, rowData) {
      var groupItem = me.aggregateList(rowData, countField);
      groupItem[field] = key;
      groups.push(groupItem);
    });
    return groups;
  };

  /**
   * Internal function for execute callback function for each property of object
   * @param object object contained odata grouped result
   * @param callback function do somthing
   */
  private iterateObject = (
    object: any,
    callback: (key: string, rowData: any[]) => void
  ): void => {
    if (!object) {
      return;
    }
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = object[key];
      callback(key, value);
    }
  };

  /**
   * Prepeare grouped data
   * @param rowData array odata result
   * @param field grouping field
   */
  private groupBy = (rowData: any[], field: string): any => {
    var result = {};
    const me = this;
    rowData.forEach(function (item) {
      var key = me.getValue(field, item);
      var listForThisKey = result[key];
      if (!listForThisKey) {
        listForThisKey = [];
        result[key] = listForThisKey;
      }
      listForThisKey.push(item);
    });
    return result;
  };

  /**
   * Calculate total count records in group
   * @param rowData array odata result data
   * @param countField field contained count of all records
   */
  private aggregateList = (rowData: any[], countField: string): any => {
    var result = {};
    rowData.forEach((row) => {
      if (countField && row[countField] != null) {
        const totalCount = (result[countField] || 0) + (row[countField] || 0);
        delete row[countField];
        result[countField] = totalCount;
      }
      result = Object.assign(result, row);
    });
    return result;
  };

  /**
     * Calculate distinct values for input field from Odata api
     * @param field The field of the row to get the cells data from 
     * @param callback The function for return distinct values for input field
     * @param beforeRequest The function for customize request
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
  getFilterValuesParams = (
    field: string,
    callback: (data: any[]) => void,
    beforeRequest: (options: OdataQueryExtendFull) => void | undefined
  ): void => {
    const me = this;
    const options: OdataQueryExtendFull = {
        apply: [`groupby((${me.getWrapColumnName(field)}))`],
      }
    if (beforeRequest) {
      beforeRequest(options)
    }
    me.callApi(
      me.toQuery(options)
    ).then((x) => {
      if (x) {
        let values = me.getOdataResult(x);
        callback(values.map((y) => y[field]));
      }
    });
  };
  /**
   * Detect is string value
   * @param value
   */
  isStrVal = (value: any): boolean => typeof value === "string";
  /**
   * Extartc values from odata response
   * @param response
   */
  private getOdataResult = (response: any): any =>
    Array.isArray(response) ? response : response.value;
  /**
   * Endocing column name to odata notation
   * @param colName column name
   */
  private getWrapColumnName = (colName: string | undefined): string =>
    colName ? replaceAll(colName, ".", "/") : '';
  /**
   * grid calls this to get rows for IServerSideDatasource
   * @param params ag-grid details for the request
   */
  /**
   * grid calls this to get rows implement
   * @param params ag-grid details for the request
   */
  public getRows (params: IGetRowsParams | IServerSideGetRowsParams): void {
    const me = this;
    const childCount = me.groupCountFieldName;
    const isServerMode = "request" in params;
    const request = isServerMode
      ? (params as IServerSideGetRowsParams).request
      : (params as IGetRowsParams);
    const requestSrv = request as IServerSideGetRowsRequest;

    const pivotActive = !isServerMode
      ? false
      : requestSrv.pivotMode &&
        requestSrv.pivotCols.length > 0 &&
        requestSrv.valueCols.length > 0;

    if (!pivotActive) {
      (params as any).parentNode.columnApi.setSecondaryColumns([]);
    }
    const options = me.getOdataOptions(params);
    const query = me.toQuery(options);
    if (
      options.skip === 0 &&
      (!isServerMode ||
        (isServerMode &&
          (params as IServerSideGetRowsParams).parentNode.level === -1))
    ) {
      me.cancelPromice.cancel();
      me.cancelPromice = me.createCancelablePromise();
    }
    Promise.race([me.cancelPromice.promise, me.callApi(query)]).then(
      async (x) => {
        if (!x) {
          params.failCallback();
        } else {
          const values = me.getOdataResult(x);
          if (!pivotActive) {
            if (!options.apply) {
              params.successCallback(values, x["@odata.count"]);
              if (this.afterLoadData) {
                this.afterLoadData(options, values, x["@odata.count"]);
              }
            } else {
              let count = values.length;
              if (count === options.top && options.skip === 0) {
                // If received grouped count of value large than requested then request total count of values
                me.callApi(query + "/aggregate($count as count)").then((y) => {
                  count = me.getOdataResult(y)[0].count;
                  params.successCallback(values, count);
                });
              } else {
                if (options.skip != null && options.skip > 0) {
                  count = null;
                }
                params.successCallback(values, count);
                if (this.afterLoadData) {
                  this.afterLoadData(options, values, count);
                }
              }
            }
          } else {
            let rowData = me.getOdataResult(x);
            // Check count
            if (
              rowData.length === options.top &&
              options.skip === 0 &&
              requestSrv.groupKeys.length === 0
            ) {
              let eof = false;
              while (!eof) {
                options.skip += options.top || 0;
                const subQuery = me.toQuery(options);
                const newRowData = await me.callApi(subQuery);
                if (!newRowData) {
                  params.failCallback();
                  return;
                }
                eof = newRowData.length !== options.top;
                rowData = rowData.concat(newRowData);
              }
            }
            const pivotResult = me.getPivot(
              requestSrv.pivotCols,
              requestSrv.rowGroupCols,
              requestSrv.valueCols,
              rowData,
              childCount
            );
            rowData = pivotResult.data;
            const secondaryColDefs = pivotResult.secondaryColDefs;
            rowData = me.buildGroupsFromData(
              rowData,
              requestSrv.rowGroupCols,
              requestSrv.groupKeys,
              childCount
            );
            const totalCount =
              requestSrv.groupKeys.length === 0
                ? rowData.length
                : rowData.length === options.top
                ? null
                : rowData.length;
            // if (totalCount > (options.top || 0)) {
            //   const serverSideBlock = (params as any).parentNode.rowModel
            //     .rowNodeBlockLoader.blocks[0];
            //   serverSideBlock.rowNodeCacheParams.blockSize = totalCount;
            //   serverSideBlock.endRow = serverSideBlock.startRow + totalCount;
            //   serverSideBlock.createRowNodes();
            // }
            params.successCallback(rowData, totalCount);
            if (this.afterLoadData) {
              this.afterLoadData(options, rowData, totalCount);
            }
            if (requestSrv.groupKeys.length === 0) {
              if (this.beforeSetSecondaryColumns) {
                this.beforeSetSecondaryColumns(secondaryColDefs);
              }
              (params as any).parentNode.columnApi.setSecondaryColumns(
                secondaryColDefs
              );
            }
          }
        }
      },
      (err) => {
        params.successCallback([], 0)
        if (this.setError) {
          this.setError(err,params);
        }
      }
    );
  };
  /**
   * Generate odata options for build query from ag-grid request
   * @param params ag-grid details for the request
   */
  getOdataOptions = (
    params: IGetRowsParams | IServerSideGetRowsParams
  ): OdataQueryExtendFull => {
    const me = this;
    const options: OdataQueryExtendFull = {};
    const isServerMode = "request" in params;
    const request = isServerMode
      ? (params as IServerSideGetRowsParams).request
      : (params as IGetRowsParams);
    const childCount = me.groupCountFieldName;
    if (this.beforeRequest) {
      this.beforeRequest(options, this, request);
    }
    if (request.sortModel.length > 0) {
      const sort = options.sort || [];
      for (let i = 0; i < request.sortModel.length; i++) {
        const col = request.sortModel[i];
        let colName = me.getWrapColumnName(col.colId);
        if (col.sort !== "asc") {
          colName += " desc";
        }
        sort.push(colName);
      }
      options.sort = sort;
    }

    const filter = options.filter || [];
    for (const colName in request.filterModel) {
      if (request.filterModel.hasOwnProperty(colName)) {
        const col = request.filterModel[colName];
        let colFilter = "";
        if (!col.operator) {
          colFilter = me.getFilterOdata(colName, col);
          if (colFilter) {
            filter.push(colFilter);
          }
        } else {
          const condition1 = me.getFilterOdata(colName, col.condition1);
          const condition2 = me.getFilterOdata(colName, col.condition2);
          if (condition1 && condition2) {
            colFilter = `(${condition1} ${col.operator.toLowerCase()} ${condition2})`;
            filter.push(colFilter);
          }
        }
      }
    }

    let pivotActive = false;

    const apply = options.apply || [];
    if (isServerMode) {
      const requestSrv = request as IServerSideGetRowsRequest;
      pivotActive =
        requestSrv.pivotMode &&
        requestSrv.pivotCols.length > 0 &&
        requestSrv.valueCols.length > 0;
      if (requestSrv.rowGroupCols.length > 0) {
        const filterGroupBy: string[] = [];
        if (requestSrv.groupKeys.length < requestSrv.rowGroupCols.length) {
          // If request only groups
          for (let idx = 0; idx < requestSrv.groupKeys.length; idx++) {
            const colValue = requestSrv.groupKeys[idx];
            const condition = `${me.getWrapColumnName(
              requestSrv.rowGroupCols[idx].field
            )} eq ${
              (me.isStrVal(colValue) ? "'" : "") +
              me.encode(colValue) +
              (me.isStrVal(colValue) ? "'" : "")
            }`;
            filterGroupBy.push(condition);
          }
          if (filterGroupBy.length > 0 || filter.length > 0) {
            // Filters must by first
            apply.push(`filter(${filterGroupBy.concat(filter).join(" and ")})`);
          }

          const aggregate: string[] = [];
          if (childCount) {
            aggregate.push(me.odataAggregation.count(childCount));
          }
          if (requestSrv.valueCols.length > 0) {
            for (let idx = 0; idx < requestSrv.valueCols.length; idx++) {
              const colValue = requestSrv.valueCols[idx];
              colValue.aggFunc && aggregate.push(
                me.odataAggregation[colValue.aggFunc](
                  me.getWrapColumnName(colValue.field)
                )
              );
            }
          }
          let groups = [
            me.getWrapColumnName(
              requestSrv.rowGroupCols[requestSrv.groupKeys.length].field
            ),
          ];
          const sort = options.sort || [];
          const sortColOnly = sort.map((x) => x.split(" ")[0]);
          if (pivotActive) {
            groups = groups.concat(
              requestSrv.pivotCols.map((x) => me.getWrapColumnName(x.field))
            );
            groups.forEach((x) => {
              if (sortColOnly.indexOf(x) < 0) {
                sort.push(x);
              }
            });
          }
          options.sort = sort;
          apply.push(
            `groupby((${groups.join(",")})${
              aggregate.length > 0 ? `,aggregate(${aggregate.join(",")})` : ""
            })`
          );

          options.apply = apply;
          if (options.sort && options.sort.length> 0){
            options.sort = options.sort.filter(x=>groups.indexOf(x.split(' ')[0]) >=0);
          }
          // delete options.sort;
        } else {
          // If request rowData by group filter
          for (let idx = 0; idx < requestSrv.groupKeys.length; idx++) {
            const colValue = requestSrv.groupKeys[idx];
            const condition = `${me.getWrapColumnName(
              requestSrv.rowGroupCols[idx].field
            )} eq ${
              (me.isStrVal(colValue) ? "'" : "") +
              me.encode(colValue) +
              (me.isStrVal(colValue) ? "'" : "")
            }`;
            filter.push(condition);
          }
        }
      }
    }
    if (filter.length > 0) {
      options.filter = filter;
    }
    if (apply.length > 0) {
      options.apply = apply;
      delete options.filter;
      delete options.expand;
      // options.sort = null;
    }
    options.skip = request.startRow;
    options.top = request.endRow - request.startRow;

    if (!options.apply && options.skip === 0) {
      options.count = true;
    }
    return options;
  };
  /**
   * Generate odata query from ag-grid request
   * @param params ag-grid details for the request
   */
  getOdataQuery = (params: IGetRowsParams | IServerSideGetRowsParams): string =>
    this.toQuery(this.getOdataOptions(params));
}

export class OdataProviderClient extends OdataProvider {
  public override getRows (params: IServerSideGetRowsParams){
    super.getRows(params);
  } 
} 
export class OdataServerSideProvider  extends OdataProvider {
  public override getRows (params: IServerSideGetRowsParams): void {
    super.getRows(params);
  } 
}   }
