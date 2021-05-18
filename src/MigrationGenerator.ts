import { writeFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { DatabaseSchema } from './DatabaseSchema'

export class MigrationGenerator {
  constructor(
    private schema: DatabaseSchema,
    private oldSchema?: DatabaseSchema,
  ) {}

  async generate() {
    // Thanks https://github.com/mikro-orm/mikro-orm/blob/9c37f6141d8723d6c472dfd3557a1d749d344455/packages/migrations/src/MigrationGenerator.ts#L14
    const timestamp = new Date().toISOString().replace(/[-T:]|\.\d{3}z$/gi, '')
    const dirPath = resolve(process.cwd(), `./migrations`)
    await mkdir(dirPath).catch((e) => {
      // Don't care
      if (e.code !== 'EEXIST') {
        throw e
      }
    })
    const filePath = resolve(dirPath, `${timestamp}.ts`)
    const code = await this.getCode()
    if (code) {
      await writeFile(filePath, code, 'utf8')
    }
  }

  async getCode() {
    const sqls = this.schema.tables
      .map((table) => {
        const old = this.oldSchema?.tables.find(
          (t) => table.tableName === t.tableName,
        )
        return table.toSql(old)
      })
      .filter(Boolean)
    if (sqls.length === 0) {
      return null
    }
    return `import { Knex } from 'knex'

export async function up(knex: Knex) {
  await knex.raw(\`${sqls.join(';\n')}\`)
}

export async function down(_knex: Knex) {
  // No down supported
}
        `
  }
}
