import { TableBuilder, ColumnBuilder } from './types'
import { getSchema } from './schema'

export function Table(tableName: string) {
  const schema = getSchema()
  schema.addTable(tableName)
  schema.flushThunk()
  return function (_constructor: Function) {}
}

export function Column(expr: (t: TableBuilder) => ColumnBuilder) {
  return function (_target: any, propertyKey: string) {
    const schema = getSchema()
    schema.addThunk(() => {
      schema.getCurrentTable().addColumn(propertyKey, expr)
    })
  }
}
