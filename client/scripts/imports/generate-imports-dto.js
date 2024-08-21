/* eslint-disable no-console */
const path = require('path')

const { Project } = require('ts-morph')

const { backendSrcDir, BRIGHT, RESET, GREEN, PURPLE, DTOS_PATH } = require('../helpers/constants')
const { parseToKebabCase, getStructureToSaveFile, getAllFiles } = require('../helpers/commons')

const project = new Project()

function generateImportsDtos() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de dtos${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de dtos...${RESET}`)

  const dtos = getAllFiles(backendSrcDir, 'dto.ts')
  const importsDtos = new Set()

  dtos.forEach((dtoFile) => {
    const dtoPath = path.resolve(backendSrcDir, dtoFile)
    const sourceFile = project.addSourceFileAtPath(dtoPath)
    const classDto = sourceFile.getClasses()[0]
    const dtoName = classDto.getName()

    const nameParsed = parseToKebabCase(dtoName)
    const structure = getStructureToSaveFile(dtoPath)
    const modelPath = `${DTOS_PATH}/${structure}/${nameParsed}`

    importsDtos.add({
      name: dtoName,
      path: modelPath
    })
  })
  console.log(`${BRIGHT}${GREEN}Dtos generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de dtos${RESET}`)

  return importsDtos
}

module.exports = generateImportsDtos
