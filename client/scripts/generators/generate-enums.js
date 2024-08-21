/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

const { Project } = require('ts-morph')

const { parseToKebabCase, getStructureToSaveFile, createDirectoryIfNotExists, getAllFiles } = require('../helpers/commons')
const generateImportsEnums = require('../imports/generate-imports-enums')
const { backendSrcDir, frontendEnumsSrcDir, BRIGHT, RESET, GREEN, PURPLE } = require('../helpers/constants')

const project = new Project()

const enumsImports = generateImportsEnums()

function generateEnums() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar enums${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando enums...${RESET}`)
  const enums = getAllFiles(backendSrcDir, 'enum.ts')

  enums.forEach((enumFile) => {
    const enumPath = path.resolve(backendSrcDir, enumFile)
    const sourceFile = project.addSourceFileAtPath(enumPath)
    const enumsInFile = sourceFile.getEnums()

    enumsInFile.forEach((enumEntity) => {
      const enumName = enumEntity?.getName() ?? undefined

      if (!enumName) return

      const enumCode = `export enum ${enumName} {
        ${enumEntity
          ?.getMembers()
          .filter((member) => member.getValue() !== undefined)
          .map((member) => `  ${member.getName()} = "${member.getValue()}"`)
          .join(',\n')}
        }
        `

      const nameParsed = parseToKebabCase(enumName)

      const structure = getStructureToSaveFile(enumPath)

      const outputPath = path.resolve(frontendEnumsSrcDir, structure, `${nameParsed}.ts`)

      createDirectoryIfNotExists(path.dirname(outputPath))

      fs.writeFileSync(outputPath, enumCode, 'utf-8')
    })
  })

  console.log(`${BRIGHT}${GREEN}Enums generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar enums${RESET}`)

  return enumsImports
}

module.exports = generateEnums
