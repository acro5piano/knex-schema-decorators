import { resolve } from 'path'
// import { readFile, writeFile } from 'fs/promises'

// const DB_SCHEMA_FILE = resolve(process.cwd(), 'db-schema.json')

export async function main(args: string[]) {
  const [cmd, ...files] = args
  if (files) {
    for (const file of files) {
      await import(resolve(file))
    }
  }

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
  // await writeFile(
  //   DB_SCHEMA_FILE,
  //   JSON.stringify(schema.toJson(), undefined, 2),
  //   'utf8',
  // )
}

async function generate() {
  // const oldSchema = DatabaseSchema.fromJson(
  //   JSON.parse(await readFile(DB_SCHEMA_FILE, 'utf8')),
  // )
  // await generator.generate()
  // await writeFile(
  //   DB_SCHEMA_FILE,
  //   JSON.stringify(schema.toJson(), undefined, 2),
  //   'utf8',
  // )
}
