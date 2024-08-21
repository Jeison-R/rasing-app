/* eslint-disable no-console */
const path = require('path')

const { Project } = require('ts-morph')

const { backendSrcDir, BRIGHT, RESET, GREEN, PURPLE, MODELS_PATH } = require('../helpers/constants')
const { parseToKebabCase, getStructureToSaveFile, getAllFiles } = require('../helpers/commons')

const project = new Project()

function generateImportsModels() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de modelos${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de modelos...${RESET}`)

  const files = getAllFiles(backendSrcDir, 'entity.ts')
  const importsModels = new Set()

  files.forEach((entityFile) => {
    const entityPath = path.resolve(backendSrcDir, entityFile)
    const sourceFile = project.addSourceFileAtPath(entityPath)
    const classEntity = sourceFile.getClasses()[0]
    const entityName = classEntity.getName()

    const nameParsed = parseToKebabCase(entityName)

    const structure = getStructureToSaveFile(entityPath)

    const modelPath = `${MODELS_PATH}/${structure}/${nameParsed}`

    importsModels.add({
      name: entityName,
      path: modelPath
    })
  })

  console.log(`${BRIGHT}${GREEN}Importaciones de modelos generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de modelos${RESET}`)

  return importsModels
}

module.exports = generateImportsModels
