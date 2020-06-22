export class OdataProvider {
  callApi = null
  groupCountFieldName = 'childCount'
  isCaseSensitiveStringFilter = false
  beforeRequest = null
  beforeSetSecondaryColumns = null
  afterLoadData = null
  setError = null
  constructor (options = {}) {
    Object.assign(this, options)
    if (this.callApi == null) {
      throw new Error('callApi must be specified')
    }
    if (typeof this.callApi !== 'function') {
      throw new Error('callApi must be a function')
    }
    if (
      this.beforeRequest != null &&
      typeof this.beforeRequest !== 'function'
    ) {
      throw new Error('beforeRequest must be a function')
    }
    if (
      this.afterLoadData != null &&
      typeof this.afterLoadData !== 'function'
    ) {
      throw new Error('afterLoadData must be a function')
    }
    if (
      this.setError != null && 
      typeof this.setError !== 'function'
    ){
      throw new Error('setError must be a function')
    }
  }

  odataOperator = {
    // Logical
    equals: (col, value1) => `${col} eq ${value1}`,
    notEqual: (col, value1) => `${col} ne ${value1}`,
    lessThan: (col, value1) => `${col} lt ${value1}`,
    lessThanOrEqual: (col, value1) => `${col} le ${value1}`,
    greaterThan: (col, value1) => `${col} gt ${value1}`,
    greaterThanOrEqual: (col, value1) => `${col} ge ${value1}`,
    inRange: (col, value1, value2) =>
      `(${col} ge ${value1} and ${col} le ${value2})`,
    // String
    equalsStr: (col, value1, isCaseSensitiveStringFilter) =>
      `${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )} eq ${this.ifTolower(value1, isCaseSensitiveStringFilter)}`,
    notEqualStr: (col, value1, isCaseSensitiveStringFilter) =>
      `${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )} ne ${this.ifTolower(value1, isCaseSensitiveStringFilter)}`,
    contains: (col, value1, isCaseSensitiveStringFilter) =>
      `contains(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)})`,
    notContains: (col, value1, isCaseSensitiveStringFilter) =>
      `contains(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)}) eq false`,
    startsWith: (col, value1, isCaseSensitiveStringFilter) =>
      `startswith(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)})  eq true`,
    endsWith: (col, value1, isCaseSensitiveStringFilter) =>
      `endswith(${this.ifTolowerCol(
        col,
        isCaseSensitiveStringFilter
      )},${this.ifTolower(value1, isCaseSensitiveStringFilter)})  eq true`,
    inStr: (col, values, isCaseSensitiveStringFilter) =>
      `${this.ifTolowerCol(col, isCaseSensitiveStringFilter)} in (${values
        .map(x => `'${this.ifTolower(x, isCaseSensitiveStringFilter)}'`)
        .join()})`,
    in: (col, values) => `${col} in (${values.map(x => `${x}`).join()})`,
    notIn: (col, values) =>
      `not (${col} in (${values.map(x => `${x}`).join()}))`,
    // Date
    trunc: col => `date(${col})`
  }

  ifTolowerCol = (col, isCaseSensitiveStringFilter) =>
    isCaseSensitiveStringFilter ? col : `tolower(${col})`

  ifTolower = (value, isCaseSensitiveStringFilter) =>
    isCaseSensitiveStringFilter ? value : value ? value.toLowerCase() : value

  odataAggregation = {
    // Logical
    sum: (col, asField) => `${col} with sum as ${col || asField}`,
    min: (col, asField) => `${col} with min as ${col || asField}`,
    max: (col, asField) => `${col} with max as ${col || asField}`,
    avg: (col, asField) => `${col} with average as ${col || asField}`,
    count: (col, asField) => `$count as ${col || asField}`
  }

  toQuery = options => {
    let path = []
    if (options.count) {
      path.push('$count=true')
    }
    if (options.skip) {
      path.push(`$skip=${options.skip}`)
    }
    if (options.top) {
      path.push(`$top=${options.top}`)
    }
    if (options.sort && options.sort.length > 0) {
      path.push('$orderby=' + options.sort.join(','))
    }
    if (options.filter && options.filter.length > 0) {
      path.push('$filter=' + options.filter.join(' and '))
    }
    if (options.apply && options.apply.length > 0) {
      path.push('$apply=' + options.apply.join('/'))
    }
    if (options.expand && options.expand.length > 0) {
      path.push('$expand=' + options.expand.join(','))
    }
    if (path.length > 0) {
      path = '?' + path.join('&')
    } else {
      path = ''
    }
    return path
  }

  encode = value => (value ? value.replace("'", "''") : value)
  toDateTime = value => `${value}T00:00:00.000Z`
  getFilterOdata = (colName, col) => {
    colName = colName.replace('.', '/')
    const me = this
    colName = me.getWrapColumnName(colName)
    switch (col.filterType) {
      case 'number':
        return me.odataOperator[col.type](colName, col.filter, col.filterTo)
      case 'text': {
        let operatorName = col.type
        const filter = me.encode(col.filter)
        // let filterTo = me.encode(col.filterTo);
        if (
          (operatorName === 'equals' || operatorName === 'notEqual') &&
          !me.isCaseSensitiveStringFilter
        ) {
          operatorName += 'Str'
        }
        return me.odataOperator[operatorName](
          colName,
          `'${filter}'`,
          me.isCaseSensitiveStringFilter
        )
      }
      case 'date':
        return me.odataOperator[col.type](
          colName,
          `${me.toDateTime(col.dateFrom)}`,
          `${me.toDateTime(col.dateTo)}`
        )
      case 'set':
        return col.values.length > 0
          ? me.odataOperator.inStr(colName, col.values)
          : null
      default:
        break
    }
  }

  getPivot = (pivotCols, rowGroupCols, valueCols, data, countField) => {
    // assume 1 pivot col and 1 value col for this example

    const pivotData = []
    const aggColsList = []

    const colKeyExistsMap = {}

    const secondaryColDefs = []
    const secondaryColDefsMap = {}

    data.forEach(function (item) {
      var pivotValues = []
      pivotCols.forEach(function (pivotCol) {
        var pivotField = pivotCol.id
        var pivotValue = item[pivotField]
        if (
          pivotValue !== null &&
          pivotValue !== undefined &&
          pivotValue.toString
        ) {
          pivotValues.push(pivotValue.toString())
        } else {
          pivotValues.push('-')
        }
      })

      // var pivotValue = item[pivotField].toString();
      var pivotItem = {}

      valueCols.forEach(function (valueCol) {
        var valField = valueCol.id
        var colKey = createColKey(pivotValues, valField)

        var value = item[valField]
        pivotItem[colKey] = value

        if (!colKeyExistsMap[colKey]) {
          addNewAggCol(colKey, valueCol)
          addNewSecondaryColDef(colKey, pivotValues, valueCol)
          colKeyExistsMap[colKey] = true
        }
      })
      if (countField) {
        pivotItem[countField] = item[countField]
      }

      rowGroupCols.forEach(function (rowGroupCol) {
        var rowGroupField = rowGroupCol.id
        pivotItem[rowGroupField] = item[rowGroupField]
      })

      pivotData.push(pivotItem)
    })

    function addNewAggCol (colKey, valueCol) {
      var newCol = {
        id: colKey,
        field: colKey,
        aggFunc: valueCol.aggFunc
      }
      aggColsList.push(newCol)
    }

    function addNewSecondaryColDef (colKey, pivotValues, valueCol) {
      var parentGroup = null

      var keyParts = []

      pivotValues.forEach(function (pivotValue) {
        keyParts.push(pivotValue)
        var colKey = createColKey(keyParts)
        var groupColDef = secondaryColDefsMap[colKey]
        if (!groupColDef) {
          groupColDef = {
            groupId: colKey,
            headerName: pivotValue,
            children: []
          }
          secondaryColDefsMap[colKey] = groupColDef
          if (parentGroup) {
            parentGroup.children.push(groupColDef)
          } else {
            secondaryColDefs.push(groupColDef)
          }
        }
        parentGroup = groupColDef
      })

      parentGroup.children.push({
        colId: colKey,
        headerName: valueCol.aggFunc + '(' + valueCol.displayName + ')',
        field: colKey,
        suppressMenu: true,
        sortable: false
      })
    }

    function createColKey (pivotValues, valueField) {
      var result = pivotValues.join('|')
      if (valueField !== undefined) {
        result += '|' + valueField
      }
      result = result.replace('.', '*')
      return result
    }

    return {
      data: pivotData,
      aggCols: aggColsList,
      secondaryColDefs: secondaryColDefs
    }
  }

  buildGroupsFromData = (rowData, rowGroupCols, groupKeys, countField) => {
    const me = this
    var rowGroupCol = rowGroupCols[groupKeys.length]
    var field = rowGroupCol.id
    var mappedRowData = me.groupBy(rowData, field)
    var groups = []

    me.iterateObject(mappedRowData, function (key, rowData) {
      var groupItem = me.aggregateList(rowData, countField)
      groupItem[field] = key
      groups.push(groupItem)
    })
    return groups
  }

  iterateObject = (object, callback) => {
    if (!object) {
      return
    }
    const keys = Object.keys(object)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = object[key]
      callback(key, value)
    }
  }

  groupBy = (data, field) => {
    var result = {}
    data.forEach(function (item) {
      var key = item[field]
      var listForThisKey = result[key]
      if (!listForThisKey) {
        listForThisKey = []
        result[key] = listForThisKey
      }
      listForThisKey.push(item)
    })
    return result
  }

  aggregateList = (rowData, countField) => {
    var result = {}
    rowData.forEach(row => {
      if (countField && row[countField] != null) {
        const totalCount = (result[countField] || 0) + (row[countField] || 0)
        delete row[countField]
        result[countField] = totalCount
      }
      result = Object.assign(result, row)
    })
    return result
  }

  getFilterValuesParams = (field, callback) => {
    const me = this
    me.callApi(
      me.toQuery({
        apply: [`groupby((${me.getWrapColumnName(field)}))`]
      })
    ).then(x => {      
      if (x) {
        let values = me.getOdataResult(x)
        callback(values.map(x => x[field]))
      }
    })
  }
  isStrVal =(value) => (typeof value) === "string"
  getOdataResult = (response) =>  Array.isArray(response) ? response: response.value 
  getWrapColumnName = colName => colName.replace('.', '/')
  getRows = params => {
    const me = this
    const childCount = me.groupCountFieldName
    const options = {}
    const isServerMode = params.request != null
    const request = isServerMode ? params.request : params
    if (this.beforeRequest) {
      this.beforeRequest(options, this, request)
    }
    if (request.sortModel.length > 0) {
      const sort = options.sort || []
      for (let i = 0; i < request.sortModel.length; i++) {
        const col = request.sortModel[i]
        let colName = me.getWrapColumnName(col.colId)
        if (col.sort !== 'asc') {
          colName += ' desc'
        }
        sort.push(colName)
      }
      options.sort = sort
    }

    const filter = options.filter || []
    for (const colName in request.filterModel) {
      if (request.filterModel.hasOwnProperty(colName)) {
        const col = request.filterModel[colName]
        let colFilter = ''
        if (!col.operator) {
          colFilter = me.getFilterOdata(colName, col)
          if (colFilter) {
            filter.push(colFilter)
          }
        } else {
          const condition1 = me.getFilterOdata(colName, col.condition1)
          const condition2 = me.getFilterOdata(colName, col.condition2)
          if (condition1 && condition2) {
            colFilter = `(${condition1} ${col.operator.toLowerCase()} ${condition2})`
            filter.push(colFilter)
          }
        }
      }
    }

    const pivotActive = !isServerMode
      ? false
      : request.pivotMode &&
        request.pivotCols.length > 0 &&
        request.valueCols.length > 0

    const apply = options.apply || []
    if (isServerMode) {
      if (request.rowGroupCols.length > 0) {
        const filterGroupBy = []
        if (request.groupKeys.length < request.rowGroupCols.length) {
          // If request only groups
          for (let idx = 0; idx < request.groupKeys.length; idx++) {
            const colValue = request.groupKeys[idx]
            const condition = `${me.getWrapColumnName(
              request.rowGroupCols[idx].field
            )} eq ${(me.isStrVal(colValue)? "'":"")+me.encode(colValue)+(me.isStrVal(colValue)? "'":"")}`
            filterGroupBy.push(condition)
          }
          if (filterGroupBy.length > 0 || filter.length > 0) {
            // Filters must by first
            apply.push(`filter(${filterGroupBy.concat(filter).join(' and ')})`)
          }

          const aggregate = []
          if (childCount) {
            aggregate.push(me.odataAggregation.count(childCount))
          }
          if (request.valueCols.length > 0) {
            for (let idx = 0; idx < request.valueCols.length; idx++) {
              const colValue = request.valueCols[idx]
              aggregate.push(
                me.odataAggregation[colValue.aggFunc](
                  me.getWrapColumnName(colValue.field)
                )
              )
            }
          }
          let groups = [me.getWrapColumnName(request.rowGroupCols[request.groupKeys.length].field)]
          const sort = options.sort || []
          const sortColOnly = sort.map(x => x.split(' ')[0])
          if (pivotActive) {
            groups = groups.concat(
              request.pivotCols.map(x => me.getWrapColumnName(x.field))
            )
            groups.forEach(x => {
              if (sortColOnly.indexOf(x) < 0) {
                sort.push(x)
              }
            })
          }
          options.sort = sort
          apply.push(
            `groupby((${groups.join(',')})${
              aggregate.length > 0 ? `,aggregate(${aggregate.join(',')})` : ''
            })`
          )

          options.apply = apply
          delete options.sort
        } else {
          // If request rowData by group filter
          for (let idx = 0; idx < request.groupKeys.length; idx++) {
            const colValue = request.groupKeys[idx]
            const condition = `${me.getWrapColumnName(
              request.rowGroupCols[idx].field
            )} eq '${colValue}'`
            filter.push(condition)
          }
        }
      }
    }
    if (filter.length > 0) {
      options.filter = filter
    }
    if (apply.length > 0) {
      options.apply = apply
      options.filter = null
      options.expand = null;
      // options.sort = null;
    }
    options.skip = request.startRow
    options.top = request.endRow - request.startRow

    if (!options.apply && options.skip === 0) {
      options.count = true
    }
    const query = me.toQuery(options)

    if (!pivotActive) {
      params.parentNode.columnApi.setSecondaryColumns(null)
    }
    me.callApi(query).then(async x => {
      if (!x) {
        params.failCallback()
      } else {
        const values = me.getOdataResult(x);
        if (!pivotActive) {
          if (!options.apply) {
            params.successCallback(values, x['@odata.count'])
            if (this.afterLoadData) {
              this.afterLoadData(options, values, x['@odata.count'])
            }
          } else {
            let count = values.length
            if (count === options.top && options.skip === 0) {
              // Если мы получили группировку с числом экземпляров больше чем у мы запросили, то делаем запрос общего количества
              me.callApi(query + '/aggregate($count as count)').then(y => {
                count = y[0].count
                params.successCallback(values, count)
              })
            } else {
              params.successCallback(values, count)
              if (this.afterLoadData) {
                this.afterLoadData(options, values, count)
              }
            }
          }
        } else {
          let rowData = x
          // Check count
          if (
            rowData.length === options.top &&
            options.skip === 0 &&
            request.groupKeys.length === 0
          ) {
            let eof = false
            while (!eof) {
              options.skip += options.top
              const subQuery = me.toQuery(options)
              const newRowData = await me.callApi(subQuery)
              if (!newRowData) {
                params.failCallback()
                return
              }
              eof = newRowData.length !== options.top
              rowData = rowData.concat(newRowData)
            }
          }
          const pivotResult = me.getPivot(
            request.pivotCols,
            request.rowGroupCols,
            request.valueCols,
            rowData,
            childCount
          )
          rowData = pivotResult.data
          const secondaryColDefs = pivotResult.secondaryColDefs
          rowData = me.buildGroupsFromData(
            rowData,
            request.rowGroupCols,
            request.groupKeys,
            childCount
          )
          const totalCount =
            request.groupKeys.length === 0
              ? rowData.length
              : rowData.length === options.top
                ? null
                : rowData.length
          if (totalCount > options.top) {
            const serverSideBlock =
              params.parentNode.rowModel.rowNodeBlockLoader.blocks[0]
            serverSideBlock.rowNodeCacheParams.blockSize = totalCount
            serverSideBlock.endRow = serverSideBlock.startRow + totalCount
            serverSideBlock.createRowNodes()
          }
          params.successCallback(rowData, totalCount)
          if (this.afterLoadData) {
            this.afterLoadData(options, rowData, totalCount)
          }
          if (request.groupKeys.length === 0) {
            if (this.beforeSetSecondaryColumns) {
              this.beforeSetSecondaryColumns(secondaryColDefs)
            }
            params.parentNode.columnApi.setSecondaryColumns(secondaryColDefs)
          }
        }
      }
    },
    err => {
      if (this.setError) {
        setOnError(this.setError)
      }
      if (onError) {
        onError(err)
      }
      // params.successCallback([], 0)
    }
  ))
  }
}
