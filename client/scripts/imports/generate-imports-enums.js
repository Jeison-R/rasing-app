/* eslint-disable no-console */
const path = require('path')

const { Project } = require('ts-morph')

const { backendSrcDir, BRIGHT, RESET, GREEN, PURPLE, ENUMS_PATH } = require('../helpers/constants')
const { parseToKebabCase, getStructureToSaveFile, getAllFiles } = require('../helpers/commons')

const project = new Project()

function generateImportsEnums() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar las importaciones de enums${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de enums...${RESET}`)
  const enums = getAllFiles(backendSrcDir, 'enum.ts')
  const importsEnums = new Set()

  enums.forEach((enumFile) => {
    const enumPath = path.resolve(backendSrcDir, enumFile)
    const sourceFile = project.addSourceFileAtPath(enumPath)
    const enumsInFile = sourceFile.getEnums()

    enumsInFile.forEach((enumEntity) => {
      const enumName = enumEntity?.getName() ?? undefined

      if (!enumName) return

      const nameParsed = parseToKebabCase(enumName)

      const structure = getStructureToSaveFile(enumPath)
      const enumPathFrontend = `${ENUMS_PATH}/${structure}/${nameParsed}`

      importsEnums.add({
        name: enumName,
        path: enumPathFrontend
      })
    })
  })

  console.log(`${BRIGHT}${GREEN}Enums generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar las importaciones de enums${RESET}`)

  return importsEnums
}

module.exports = generateImportsEnums
