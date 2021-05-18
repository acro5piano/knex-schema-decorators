import { getSchema } from './schema'
import { MigrationGenerator } from './MigrationGenerator'
import { DatabaseSchema } from './DatabaseSchema'
import { resolve } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { knex } from 'knex'
import { setKnex } from './knex'

const knexStringcase = require('knex-stringcase')

const DB_SCHEMA_FILE = resolve(process.cwd(), 'db-schema.json')

export async function main(args: string[]) {
  const [cmd, ...files] = args
  if (files) {
    for (const file of files) {
      await import(resolve(file))
    }
  }

  setKnex(
    knex(
      knexStringcase({
        client: 'pg',
        connection: 'postgres://postgres:postgres@127.0.0.1:11000/postgres',
        useNullAsDefault: false,
      }),
    ),
  )

  switch (cmd) {
    case 'generate-initial':
      await generateInitial()
      return
    case 'generate':
      await generate()
      return
  }
}

async function generateInitial() {
  const schema = getSchema()
  const generator = new MigrationGenerator(schema)
  await generator.generate()
  await writeFile(
    DB_SCHEMA_FILE,
    JSON.stringify(schema.toJson(), undefined, 2),
    'utf8',
  )
}

async function generate() {
  const schema = getSchema()
  const oldSchema = DatabaseSchema.fromJson(
    JSON.parse(await readFile(DB_SCHEMA_FILE, 'utf8')),
  )
  const generator = new MigrationGenerator(schema, oldSchema)
  await generator.generate()
  await writeFile(
    DB_SCHEMA_FILE,
    JSON.stringify(schema.toJson(), undefined, 2),
    'utf8',
  )
}
