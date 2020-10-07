

var types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function replaceAll(str, search, replacement) {
    return str.replace(new RegExp(escapeRegExp(search), "g"), replacement);
}
var OdataProvider = /** @class */ (function () {
    function OdataProvider(options) {
        var _this = this;
        /**
         * Name of field contain count of record results in grouping odata query
         * @default childCount
         */
        this.groupCountFieldName = "childCount";
        /**
         * Use in odata build query
         * @default false
         */
        this.isCaseSensitiveStringFilter = false;
        /**Creator a cancelable Promise */
        this.createCancelablePromise = function () {
            var cancel;
            var pr = new Promise(function (_, reject) {
                cancel = reject;
            }).catch(function () { });
            return {
                promise: pr,
                cancel: cancel,
            };
        };
        /**Odata query operations */
        this.odataOperator = {
            // Logical
            equals: function (col, value1) { return col + " eq " + value1; },
            notEqual: function (col, value1) { return col + " ne " + value1; },
            lessThan: function (col, value1) { return col + " lt " + value1; },
            lessThanOrEqual: function (col, value1) {
                return col + " le " + value1;
            },
            greaterThan: function (col, value1) { return col + " gt " + value1; },
            greaterThanOrEqual: function (col, value1) {
                return col + " ge " + value1;
            },
            inRange: function (col, value1, value2) {
                return "(" + col + " ge " + value1 + " and " + col + " le " + value2 + ")";
            },
            // String
            equalsStr: function (col, value1, isCaseSensitiveStringFilter) {
                return _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + " eq " + _this.ifTolower(value1, isCaseSensitiveStringFilter);
            },
            notEqualStr: function (col, value1, isCaseSensitiveStringFilter) {
                return _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + " ne " + _this.ifTolower(value1, isCaseSensitiveStringFilter);
            },
            contains: function (col, value1, isCaseSensitiveStringFilter) {
                return "contains(" + _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + "," + _this.ifTolower(value1, isCaseSensitiveStringFilter) + ")";
            },
            notContains: function (col, value1, isCaseSensitiveStringFilter) {
                return "contains(" + _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + "," + _this.ifTolower(value1, isCaseSensitiveStringFilter) + ") eq false";
            },
            startsWith: function (col, value1, isCaseSensitiveStringFilter) {
                return "startswith(" + _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + "," + _this.ifTolower(value1, isCaseSensitiveStringFilter) + ")  eq true";
            },
            endsWith: function (col, value1, isCaseSensitiveStringFilter) {
                return "endswith(" + _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + "," + _this.ifTolower(value1, isCaseSensitiveStringFilter) + ")  eq true";
            },
            inStr: function (col, values, isCaseSensitiveStringFilter) {
                return _this.ifTolowerCol(col, isCaseSensitiveStringFilter) + " in (" + values
                    .map(function (x) { return "'" + _this.ifTolower(x, isCaseSensitiveStringFilter) + "'"; })
                    .join() + ")";
            },
            in: function (col, values) {
                return col + " in (" + values.map(function (x) { return "" + x; }).join() + ")";
            },
            notIn: function (col, values) {
                return "not (" + col + " in (" + values.map(function (x) { return "" + x; }).join() + "))";
            },
            // Date
            trunc: function (col) { return "date(" + col + ")"; },
        };
        /**
         * Apply tolower for column in odata syntax
         * @param col column name
         * @param isCaseSensitiveStringFilter need apply tolower
         */
        this.ifTolowerCol = function (col, isCaseSensitiveStringFilter) {
            return isCaseSensitiveStringFilter ? col : "tolower(" + col + ")";
        };
        /**
         *
         * @param value string value
         * @param isCaseSensitiveStringFilter  need apply tolower
         */
        this.ifTolower = function (value, isCaseSensitiveStringFilter) {
            return isCaseSensitiveStringFilter ? value : value ? value.toLowerCase() : value;
        };
        /**
         * Odata aggregation operations
         */
        this.odataAggregation = {
            // Logical
            sum: function (col, asField) {
                return col + " with sum as " + (col || asField);
            },
            min: function (col, asField) {
                return col + " with min as " + (col || asField);
            },
            max: function (col, asField) {
                return col + " with max as " + (col || asField);
            },
            avg: function (col, asField) {
                return col + " with average as " + (col || asField);
            },
            count: function (col, asField) {
                return "$count as " + (col || asField);
            },
        };
        /**
         * Odata query builder
         * @param options parameter for odata query
         */
        this.toQuery = function (options) {
            var path = [];
            if (options.count) {
                path.push("$count=true");
            }
            if (options.skip) {
                path.push("$skip=" + options.skip);
            }
            if (options.top) {
                path.push("$top=" + options.top);
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
            var query = "";
            if (path.length > 0) {
                query = "?" + path.join("&");
            }
            return query;
        };
        /**
         * Add quotes for string value
         * @param value string value
         */
        this.encode = function (value) {
            return _this.isStrVal(value) ? replaceAll(value, "'", "''") : value;
        };
        /**
         * Conctat to date a time for create datetime format for odata query
         * @param value date string
         */
        this.toDateTime = function (value) {
            var dt = new Date(value);
            var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()));
            return dt1.toISOString();
        };
        /**
         * Convert ag-grid column filter to odata query
         * @param colName columnName
         * @param col ag-grid column
         */
        this.getFilterOdata = function (colName, col) {
            colName = replaceAll(colName, ".", "/");
            var me = _this;
            colName = me.getWrapColumnName(colName);
            switch (col.filterType) {
                case "number":
                    return me.odataOperator[col.type](colName, col.filter, col.filterTo);
                case "text": {
                    var operatorName = col.type;
                    var filter = me.encode(col.filter);
                    // let filterTo = me.encode(col.filterTo);
                    if ((operatorName === "equals" || operatorName === "notEqual") &&
                        !me.isCaseSensitiveStringFilter) {
                        operatorName += "Str";
                    }
                    return me.odataOperator[operatorName](colName, "'" + filter + "'", me.isCaseSensitiveStringFilter);
                }
                case "date":
                    return me.odataOperator[col.type](colName, "" + me.toDateTime(col.dateFrom), "" + me.toDateTime(col.dateTo));
                case "set":
                    return col.values.length > 0
                        ? me.odataOperator.inStr(colName, col.values, _this.isCaseSensitiveStringFilter)
                        : "";
            }
            return "";
        };
        /**
         * Caclulate pivot data for ag-grid from odata
         * @param pivotCols pivot columns
         * @param rowGroupCols row group columns
         * @param valueCols value columns
         * @param data odata result
         * @param countField count field name
         */
        this.getPivot = function (pivotCols, rowGroupCols, valueCols, data, countField) {
            // assume 1 pivot col and 1 value col for this example
            var pivotData = [];
            var aggColsList = [];
            var colKeyExistsMap = {};
            var secondaryColDefs = [];
            var secondaryColDefsMap = {};
            data.forEach(function (item) {
                var pivotValues = [];
                pivotCols.forEach(function (pivotCol) {
                    var pivotField = pivotCol.id;
                    var pivotValue = item[pivotField];
                    if (pivotValue !== null &&
                        pivotValue !== undefined &&
                        pivotValue.toString) {
                        pivotValues.push(pivotValue.toString());
                    }
                    else {
                        pivotValues.push("-");
                    }
                });
                // var pivotValue = item[pivotField].toString();
                var pivotItem = {};
                valueCols.forEach(function (valueCol) {
                    var valField = valueCol.id;
                    var colKey = createColKey(pivotValues, valField);
                    var value = item[valField];
                    pivotItem[colKey] = value;
                    if (!colKeyExistsMap[colKey]) {
                        addNewAggCol(colKey, valueCol);
                        addNewSecondaryColDef(colKey, pivotValues, valueCol);
                        colKeyExistsMap[colKey] = true;
                    }
                });
                if (countField) {
                    pivotItem[countField] = item[countField];
                }
                rowGroupCols.forEach(function (rowGroupCol) {
                    var rowGroupField = rowGroupCol.id;
                    pivotItem[rowGroupField] = item[rowGroupField];
                });
                pivotData.push(pivotItem);
            });
            function addNewAggCol(colKey, valueCol) {
                var newCol = {
                    id: colKey,
                    field: colKey,
                    aggFunc: valueCol.aggFunc,
                };
                aggColsList.push(newCol);
            }
            function addNewSecondaryColDef(colKey, pivotValues, valueCol) {
                var parentGroup = null;
                var keyParts = [];
                pivotValues.forEach(function (pivotValue) {
                    keyParts.push(pivotValue);
                    var colKey = createColKey(keyParts);
                    var groupColDef = secondaryColDefsMap[colKey];
                    if (!groupColDef) {
                        groupColDef = {
                            groupId: colKey,
                            headerName: pivotValue,
                            children: [],
                        };
                        secondaryColDefsMap[colKey] = groupColDef;
                        if (parentGroup) {
                            parentGroup.children.push(groupColDef);
                        }
                        else {
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
            function createColKey(pivotValues, valueField) {
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
        this.buildGroupsFromData = function (rowData, rowGroupCols, groupKeys, countField) {
            var me = _this;
            var rowGroupCol = rowGroupCols[groupKeys.length];
            var field = rowGroupCol.id;
            var mappedRowData = me.groupBy(rowData, field);
            var groups = [];
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
        this.iterateObject = function (object, callback) {
            if (!object) {
                return;
            }
            var keys = Object.keys(object);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = object[key];
                callback(key, value);
            }
        };
        /**
         * Prepeare grouped data
         * @param rowData array odata result
         * @param field grouping field
         */
        this.groupBy = function (rowData, field) {
            var result = {};
            rowData.forEach(function (item) {
                var key = item[field];
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
        this.aggregateList = function (rowData, countField) {
            var result = {};
            rowData.forEach(function (row) {
                if (countField && row[countField] != null) {
                    var totalCount = (result[countField] || 0) + (row[countField] || 0);
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
        this.getFilterValuesParams = function (field, callback) {
            var me = _this;
            me.callApi(me.toQuery({
                apply: ["groupby((" + me.getWrapColumnName(field) + "))"],
            })).then(function (x) {
                if (x) {
                    var values = me.getOdataResult(x);
                    callback(values.map(function (y) { return y[field]; }));
                }
            });
        };
        /**
         * Detect is string value
         * @param value
         */
        this.isStrVal = function (value) { return typeof value === "string"; };
        /**
         * Extartc values from odata response
         * @param response
         */
        this.getOdataResult = function (response) {
            return Array.isArray(response) ? response : response.value;
        };
        /**
         * Endocing column name to odata notation
         * @param colName column name
         */
        this.getWrapColumnName = function (colName) {
            return replaceAll(colName, ".", "/");
        };
        /**
         * grid calls this to get rows
         * @param params ag-grid details for the request
         */
        this.getRows = function (params) {
            var me = _this;
            var childCount = me.groupCountFieldName;
            var isServerMode = "request" in params;
            var request = isServerMode
                ? params.request
                : params;
            var requestSrv = request;
            var pivotActive = !isServerMode
                ? false
                : requestSrv.pivotMode &&
                    requestSrv.pivotCols.length > 0 &&
                    requestSrv.valueCols.length > 0;
            if (!pivotActive) {
                params.parentNode.columnApi.setSecondaryColumns([]);
            }
            var options = me.getOdataOptions(params);
            var query = me.toQuery(options);
            if (options.skip === 0 &&
                (!isServerMode ||
                    (isServerMode &&
                        params.parentNode.level === -1))) {
                me.cancelPromice.cancel();
                me.cancelPromice = me.createCancelablePromise();
            }
            Promise.race([me.cancelPromice.promise, me.callApi(query)]).then(function (x) { return __awaiter(_this, void 0, void 0, function () {
                var values_1, count_1, rowData, eof, subQuery, newRowData, pivotResult, secondaryColDefs, totalCount, serverSideBlock;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!x) return [3 /*break*/, 1];
                            params.failCallback();
                            return [3 /*break*/, 6];
                        case 1:
                            values_1 = me.getOdataResult(x);
                            if (!!pivotActive) return [3 /*break*/, 2];
                            if (!options.apply) {
                                params.successCallback(values_1, x["@odata.count"]);
                                if (this.afterLoadData) {
                                    this.afterLoadData(options, values_1, x["@odata.count"]);
                                }
                            }
                            else {
                                count_1 = values_1.length;
                                if (count_1 === options.top && options.skip === 0) {
                                    // Если мы получили группировку с числом экземпляров больше чем у мы запросили, то делаем запрос общего количества
                                    me.callApi(query + "/aggregate($count as count)").then(function (y) {
                                        count_1 = me.getOdataResult(y)[0].count;
                                        params.successCallback(values_1, count_1);
                                    });
                                }
                                else {
                                    if (options.skip != null && options.skip > 0) {
                                        count_1 = null;
                                    }
                                    params.successCallback(values_1, count_1);
                                    if (this.afterLoadData) {
                                        this.afterLoadData(options, values_1, count_1);
                                    }
                                }
                            }
                            return [3 /*break*/, 6];
                        case 2:
                            rowData = x;
                            if (!(rowData.length === options.top &&
                                options.skip === 0 &&
                                requestSrv.groupKeys.length === 0)) return [3 /*break*/, 5];
                            eof = false;
                            _a.label = 3;
                        case 3:
                            if (!!eof) return [3 /*break*/, 5];
                            options.skip += options.top || 0;
                            subQuery = me.toQuery(options);
                            return [4 /*yield*/, me.callApi(subQuery)];
                        case 4:
                            newRowData = _a.sent();
                            if (!newRowData) {
                                params.failCallback();
                                return [2 /*return*/];
                            }
                            eof = newRowData.length !== options.top;
                            rowData = rowData.concat(newRowData);
                            return [3 /*break*/, 3];
                        case 5:
                            pivotResult = me.getPivot(requestSrv.pivotCols, requestSrv.rowGroupCols, requestSrv.valueCols, rowData, childCount);
                            rowData = pivotResult.data;
                            secondaryColDefs = pivotResult.secondaryColDefs;
                            rowData = me.buildGroupsFromData(rowData, requestSrv.rowGroupCols, requestSrv.groupKeys, childCount);
                            totalCount = requestSrv.groupKeys.length === 0
                                ? rowData.length
                                : rowData.length === options.top
                                    ? null
                                    : rowData.length;
                            if (totalCount > (options.top || 0)) {
                                serverSideBlock = params.parentNode.rowModel
                                    .rowNodeBlockLoader.blocks[0];
                                serverSideBlock.rowNodeCacheParams.blockSize = totalCount;
                                serverSideBlock.endRow = serverSideBlock.startRow + totalCount;
                                serverSideBlock.createRowNodes();
                            }
                            params.successCallback(rowData, totalCount);
                            if (this.afterLoadData) {
                                this.afterLoadData(options, rowData, totalCount);
                            }
                            if (requestSrv.groupKeys.length === 0) {
                                if (this.beforeSetSecondaryColumns) {
                                    this.beforeSetSecondaryColumns(secondaryColDefs);
                                }
                                params.parentNode.columnApi.setSecondaryColumns(secondaryColDefs);
                            }
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            }); }, function (err) {
                if (_this.setError) {
                    _this.setError(err);
                }
                // params.successCallback([], 0)
            });
        };
        /**
         * Generate odata options for build query from ag-grid request
         * @param params ag-grid details for the request
         */
        this.getOdataOptions = function (params) {
            var me = _this;
            var options = {};
            var isServerMode = "request" in params;
            var request = isServerMode
                ? params.request
                : params;
            var childCount = me.groupCountFieldName;
            if (_this.beforeRequest) {
                _this.beforeRequest(options, _this, request);
            }
            if (request.sortModel.length > 0) {
                var sort = options.sort || [];
                for (var i = 0; i < request.sortModel.length; i++) {
                    var col = request.sortModel[i];
                    var colName = me.getWrapColumnName(col.colId);
                    if (col.sort !== "asc") {
                        colName += " desc";
                    }
                    sort.push(colName);
                }
                options.sort = sort;
            }
            var filter = options.filter || [];
            for (var colName in request.filterModel) {
                if (request.filterModel.hasOwnProperty(colName)) {
                    var col = request.filterModel[colName];
                    var colFilter = "";
                    if (!col.operator) {
                        colFilter = me.getFilterOdata(colName, col);
                        if (colFilter) {
                            filter.push(colFilter);
                        }
                    }
                    else {
                        var condition1 = me.getFilterOdata(colName, col.condition1);
                        var condition2 = me.getFilterOdata(colName, col.condition2);
                        if (condition1 && condition2) {
                            colFilter = "(" + condition1 + " " + col.operator.toLowerCase() + " " + condition2 + ")";
                            filter.push(colFilter);
                        }
                    }
                }
            }
            var pivotActive = false;
            var apply = options.apply || [];
            if (isServerMode) {
                var requestSrv = request;
                pivotActive =
                    requestSrv.pivotMode &&
                        requestSrv.pivotCols.length > 0 &&
                        requestSrv.valueCols.length > 0;
                if (requestSrv.rowGroupCols.length > 0) {
                    var filterGroupBy = [];
                    if (requestSrv.groupKeys.length < requestSrv.rowGroupCols.length) {
                        // If request only groups
                        for (var idx = 0; idx < requestSrv.groupKeys.length; idx++) {
                            var colValue = requestSrv.groupKeys[idx];
                            var condition = me.getWrapColumnName(requestSrv.rowGroupCols[idx].field) + " eq " + ((me.isStrVal(colValue) ? "'" : "") +
                                me.encode(colValue) +
                                (me.isStrVal(colValue) ? "'" : ""));
                            filterGroupBy.push(condition);
                        }
                        if (filterGroupBy.length > 0 || filter.length > 0) {
                            // Filters must by first
                            apply.push("filter(" + filterGroupBy.concat(filter).join(" and ") + ")");
                        }
                        var aggregate = [];
                        if (childCount) {
                            aggregate.push(me.odataAggregation.count(childCount));
                        }
                        if (requestSrv.valueCols.length > 0) {
                            for (var idx = 0; idx < requestSrv.valueCols.length; idx++) {
                                var colValue = requestSrv.valueCols[idx];
                                aggregate.push(me.odataAggregation[colValue.aggFunc](me.getWrapColumnName(colValue.field)));
                            }
                        }
                        var groups = [
                            me.getWrapColumnName(requestSrv.rowGroupCols[requestSrv.groupKeys.length].field),
                        ];
                        var sort_1 = options.sort || [];
                        var sortColOnly_1 = sort_1.map(function (x) { return x.split(" ")[0]; });
                        if (pivotActive) {
                            groups = groups.concat(requestSrv.pivotCols.map(function (x) { return me.getWrapColumnName(x.field); }));
                            groups.forEach(function (x) {
                                if (sortColOnly_1.indexOf(x) < 0) {
                                    sort_1.push(x);
                                }
                            });
                        }
                        options.sort = sort_1;
                        apply.push("groupby((" + groups.join(",") + ")" + (aggregate.length > 0 ? ",aggregate(" + aggregate.join(",") + ")" : "") + ")");
                        options.apply = apply;
                        delete options.sort;
                    }
                    else {
                        // If request rowData by group filter
                        for (var idx = 0; idx < requestSrv.groupKeys.length; idx++) {
                            var colValue = requestSrv.groupKeys[idx];
                            var condition = me.getWrapColumnName(requestSrv.rowGroupCols[idx].field) + " eq " + ((me.isStrVal(colValue) ? "'" : "") +
                                me.encode(colValue) +
                                (me.isStrVal(colValue) ? "'" : ""));
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
        this.getOdataQuery = function (params) {
            return _this.toQuery(_this.getOdataOptions(params));
        };
        Object.assign(this, options);
        if (this.callApi == null) {
            throw new Error("callApi must be specified");
        }
        if (typeof this.callApi !== "function") {
            throw new Error("callApi must be a function");
        }
        if (this.beforeRequest != null &&
            typeof this.beforeRequest !== "function") {
            throw new Error("beforeRequest must be a function");
        }
        if (this.afterLoadData != null &&
            typeof this.afterLoadData !== "function") {
            throw new Error("afterLoadData must be a function");
        }
        if (this.setError != null && typeof this.setError !== "function") {
            throw new Error("setError must be a function");
        }
        this.cancelPromice = this.createCancelablePromise();
    }
    return OdataProvider;
}());

export default OdataProvider;
export { types };
//# sourceMappingURL=index.es.js.map
