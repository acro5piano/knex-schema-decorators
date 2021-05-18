import type { Knex } from 'knex/types'

export type TableBuilder = ReturnType<Knex.Client['tableBuilder']>

export type ColumnBuilder = ReturnType<Knex.Client['columnBuilder']>

export type SchemaBuilder = ReturnType<Knex.Client['schemaBuilder']>
