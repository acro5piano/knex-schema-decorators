// import { resolve } from 'path'
import * as ts from 'typescript'
// import { readFile, writeFile } from 'fs/promises'

// const DB_SCHEMA_FILE = resolve(process.cwd(), 'db-schema.json')

export async function main(args: string[]) {
  const [cmd, ...files] = args
  if (files) {
    for (const file of files) {
      const program = ts.createProgram([file], {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      })
      const sourceFile = program.getSourceFile(file)
      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

      if (sourceFile) {
        ts.forEachChild(sourceFile, (node) => {
          // console.log(node.getChildren())
          if (ts.isClassDeclaration(node)) {
            for (const property of node.members) {
              if (property.decorators) {
                for (const deco of property.decorators) {
                  deco.forEachChild((node) => {
                    console.log(node)
                    if (ts.isDecorator(node)) {
                      console.log(node)
                    }
                    if (ts.isArrowFunction(node)) {
                      console.log(node)
                    }
                  })

                  // const code = printer.printNode(
                  //   ts.EmitHint.Unspecified,
                  //   deco,
                  //   sourceFile,
                  // )
                  // if (code.startsWith('@Column')) {
                  //   const matches = code.match(/(t\..+)\)/i)
                  //   console.log(matches)
                  // }
                }
              }
            }
            // const printed = printer.printNode(
            //   ts.EmitHint.Unspecified,
            //   node,
            //   sourceFile,
            // )
            // console.log(printed)
          }
        })
      }
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
