/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

const { Project } = require('ts-morph')

const { backendSrcDir, BRIGHT, RESET, GREEN, frontendModelsSrcDir, PURPLE, MODELS_PATH } = require('../helpers/constants')
const { evaluateTypes, getPropertyType, parseToKebabCase, getStructureToSaveFile, createDirectoryIfNotExists, getImport, getAllFiles, getPropertyDeclaration } = require('../helpers/commons')
const generateImportsModels = require('../imports/generate-imports-models')

const generateEnums = require('./generate-enums')

const project = new Project()

const importsEnums = generateEnums()
const importsModels = generateImportsModels()

function generateModels() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar modelos${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando modelos...${RESET}`)

  const files = getAllFiles(backendSrcDir, 'entity.ts')

  files.forEach((entityFile) => {
    const importsArray = new Set()
    const entityPath = path.resolve(backendSrcDir, entityFile)
    const sourceFile = project.addSourceFileAtPath(entityPath)
    const classEntity = sourceFile.getClasses()[0]
    const entityName = classEntity.getName()

    const properties = classEntity.getProperties()

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

    const modelsCode = `${importsArray.size > 0 ? [...importsArray].map((type) => getImport(type, importsEnums, importsModels, undefined, undefined)).join('\n') : ''}
      export interface ${entityName} {
        ${properties
          .map((property) => getPropertyDeclaration(property))
          .join('\n')
          .trim()
          .replace(/;/g, '')}
      }
      `

    const nameParsed = parseToKebabCase(entityName)

    const structure = getStructureToSaveFile(entityPath)
    const outputPath = path.resolve(frontendModelsSrcDir, structure, `${nameParsed}.ts`)

    const modelPath = `${MODELS_PATH}/${structure}/${nameParsed}`

    importsModels.add({
      name: entityName,
      path: modelPath
    })

    createDirectoryIfNotExists(path.dirname(outputPath))

    fs.writeFileSync(outputPath, modelsCode, 'utf-8')
  })

  console.log(`${BRIGHT}${GREEN}Modelos generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar modelos${RESET}`)

  return { importsModels, importsEnums }
}

module.exports = generateModels
