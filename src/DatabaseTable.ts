import { SchemaBuilder, ColumnBuilder, TableBuilder } from './types'
import { knexInstance } from './knex'

interface Column {
  columnName: string
  expr: (t: TableBuilder) => ColumnBuilder
}

export interface DatabaseTableJson {
  tableName: string
  columns: Column[]
}

export class DatabaseTable {
  columns: Column[] = []

  constructor(public tableName: string) {}

  addColumn(columnName: string, expr: (t: TableBuilder) => any) {
    this.columns.push({ columnName, expr })
  }

  toSql(oldTable?: DatabaseTable) {
    if (!oldTable) {
      // console.log(this.toCreateTableSql())
      return this.toCreateTableSql()
    }
    const toBeDeletedColumns = oldTable.columns
      .filter((oldColumn) => {
        return (
          this.columns.find(
            (column) => oldColumn.columnName === column.columnName,
          ) === undefined
        )
      })
      .map((oldColumn) => {
        return this.toDropColumnSql(oldColumn)
      })
    const newOrAlteredColumns = this.columns
      .map((column) => {
        const oldColumn = oldTable.columns.find(
          (c) => c.columnName === column.columnName,
        )
        if (oldColumn) {
          if (oldColumn.expr === column.expr) {
            return null
          }
          return this.toAlterColumnSql(column)
        }
        return this.toAddColumnSql(column)
      })
      .filter(Boolean)
    return [...toBeDeletedColumns, ...newOrAlteredColumns].join(';\n')
  }

  toCreateTableSql() {
    return getRawSql(
      knexInstance.schema.createTable(this.tableName, (t) => {
        for (const column of this.columns) {
          column.expr(t)
        }
      }),
    )
  }

  toAddColumnSql(column: Column) {
    return getRawSql(
      knexInstance.schema.alterTable(this.tableName, (t) => {
        column.expr(t)
      }),
    )
  }

  toAlterColumnSql(column: Column) {
    return getRawSql(
      knexInstance.schema.alterTable(this.tableName, (t) => {
        column.expr(t).alter()
      }),
    )
  }

  toDropColumnSql(column: Column) {
    return getRawSql(
      knexInstance.schema.alterTable(this.tableName, (t) => {
        t.dropColumn(column.columnName)
      }),
    )
  }

  toJson(): DatabaseTableJson {
    return {
      tableName: this.tableName,
      columns: this.columns,
    }
  }

  static fromJson(json: DatabaseTableJson) {
    const table = new DatabaseTable(json.tableName)
    table.columns = json.columns
    return table
  }
}

function getRawSql(schemaBuilder: SchemaBuilder) {
  const rows = schemaBuilder.toSQL()
  if (Array.isArray(rows)) {
    return rows[0].sql
  }
  return rows.sql
}

// function compileColumn(column: Column) {
//   column.expr
//   return `knex`
//   column.columnName
// }
