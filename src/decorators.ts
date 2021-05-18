import { TableBuilder, ColumnBuilder } from './types'

export function Table(_tableName: string) {
  return function (_constructor: Function) {}
}

export function Column(_expr: (t: TableBuilder) => ColumnBuilder) {
  return function (_target: any, _propertyKey: string) {}
}
