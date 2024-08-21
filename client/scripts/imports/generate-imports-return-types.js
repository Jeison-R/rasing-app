/* eslint-disable no-console */
const path = require('path')

const { Project } = require('ts-morph')

const { backendSrcDir, BRIGHT, RESET, GREEN, PURPLE, RETURN_TYPES } = require('../helpers/constants')
const { parseToKebabCase, getStructureToSaveFile, getAllFiles } = require('../helpers/commons')

const project = new Project()

function generateReturnTypesImports() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de returnTypes${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de returnTypes...${RESET}`)

  const returnTypes = getAllFiles(backendSrcDir, 'return-type.ts')

  const importsReturnTypes = new Set()

  returnTypes.forEach((returnTypeFile) => {
    const returnTypePath = path.resolve(backendSrcDir, returnTypeFile)
    const sourceFile = project.addSourceFileAtPath(returnTypePath)
    const returnTypesInterfacesInFile = sourceFile.getInterfaces()
    const returnTypesTypesInFile = sourceFile.getTypeAliases()

    returnTypesInterfacesInFile.forEach((returnTypeEntity) => {
      const returnTypeName = returnTypeEntity?.getName() ?? undefined

      if (!returnTypeName) return

      const nameParsed = parseToKebabCase(returnTypeName)
      const structure = getStructureToSaveFile(returnTypePath)
      const returnTypePathFrontend = `${RETURN_TYPES}/${structure}/${nameParsed}`

      importsReturnTypes.add({
        name: returnTypeName,
        path: returnTypePathFrontend
      })
    })

    returnTypesTypesInFile.forEach((returnTypeEntity) => {
      const returnTypeName = returnTypeEntity?.getName() ?? undefined

      if (!returnTypeName) return

      const nameParsed = parseToKebabCase(returnTypeName)
      const structure = getStructureToSaveFile(returnTypePath)
      const returnTypePathFrontend = `${RETURN_TYPES}/${structure}/${nameParsed}`

      importsReturnTypes.add({
        name: returnTypeName,
        path: returnTypePathFrontend
      })
    })
  })

  console.log(`${BRIGHT}${GREEN}returnTypes generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de returnTypes${RESET}`)

  return importsReturnTypes
}

module.exports = generateReturnTypesImports
