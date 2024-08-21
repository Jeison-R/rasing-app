/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

const { Project } = require('ts-morph')

const { parseToKebabCase, getStructureToSaveFile, getAllFiles, createDirectoryIfNotExists, getPropertyDeclaration, getImport, evaluateTypes, getPropertyType } = require('../helpers/commons')
const generateImportsDtos = require('../imports/generate-imports-dto')
const { BRIGHT, RESET, GREEN, PURPLE, backendSrcDir, frontendDtosSrcDir } = require('../helpers/constants')
const generateImportsModels = require('../imports/generate-imports-models')
const generateImportsEnums = require('../imports/generate-imports-enums')

const project = new Project()

const importsDtos = generateImportsDtos()
const importsModels = generateImportsModels()
const importsEnums = generateImportsEnums()

function generateDtos() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de dtos${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de dtos...${RESET}`)

  const dtos = getAllFiles(backendSrcDir, 'dto.ts')

  dtos.forEach((dtoFile) => {
    const importsArray = new Set()
    const dtoPath = path.resolve(backendSrcDir, dtoFile)
    const sourceFile = project.addSourceFileAtPath(dtoPath)
    const classDto = sourceFile.getClasses()[0]
    const dtoName = classDto.getName()

    const properties = classDto.getProperties()

    properties
      .map((property) => {
        const propertyType = evaluateTypes(getPropertyType(property))

        if (propertyType) {
          if (importsArray.has(propertyType)) return
          importsArray.add(propertyType)
        }

        return ''
      })
      .join('\n')

    const dtoCode = `${importsArray.size > 0 ? [...importsArray].map((type) => getImport(type, importsEnums, importsModels, undefined, importsDtos)).join('\n') : ''}

export interface ${dtoName} {
  ${properties
    .map((property) => getPropertyDeclaration(property))
    .join('\n')
    .trim()
    .replace(/;/g, '')}
}
`

    const nameParsed = parseToKebabCase(dtoName)

    const structure = getStructureToSaveFile(dtoPath)
    const outputPath = path.resolve(frontendDtosSrcDir, structure, `${nameParsed}.ts`)

    createDirectoryIfNotExists(path.dirname(outputPath))

    fs.writeFileSync(outputPath, dtoCode, 'utf-8')
  })
  console.log(`${BRIGHT}${GREEN}Dtos generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de dtos${RESET}`)

  return importsDtos
}

module.exports = generateDtos
