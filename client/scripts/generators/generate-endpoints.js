/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

const { Project } = require('ts-morph')
const { getDecorators } = require('typescript')

const generateReturnTypesImports = require('../imports/generate-imports-return-types')
const { backendSrcDir, BRIGHT, GREEN, PURPLE, RESET, RED, frontendEndpointsSrcDir } = require('../helpers/constants')
const { getHttpVerb, cleanReturnType, createGetFunction, createPostFunction } = require('../imports/generate-verbs')
const { getAllFiles, parseToKebabCase, getStructureToSaveFile, createDirectoryIfNotExists } = require('../helpers/commons')

const generateDtos = require('./generate-dtos')
const generateModels = require('./generate-models')

const project = new Project()

// const importsReturnTypes = generateReturnTypes()
const { importsModels, importsEnums } = generateModels()
const importsDtos = generateDtos()
const importsReturnTypes = generateReturnTypesImports()

function generateEndpoints() {
  // console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar endpoints${RESET}`)
  // console.log(`${BRIGHT}${PURPLE}Generando endpoints...${RESET}`)
  //   const controllers = getAllFiles(backendSrcDir, 'controller.ts')
  //
  //   controllers.forEach((controller) => {
  //     const controllerPath = path.resolve(backendSrcDir, controller)
  //     const sourceFile = project.addSourceFileAtPath(controllerPath)
  //     const controllerEntity = sourceFile.getClasses()[0]
  //     const controllerName = controllerEntity?.getName() ?? undefined
  //
  //     if (!controllerName) return
  //
  //     const methods = controllerEntity.getMethods()
  //
  //     methods.forEach((method) => {
  //       const methodName = method.getName()
  //       const methodParameters = method.getParameters().map((param) => {
  //         const paramType = param.getType().getSymbol()?.getName() ?? param.getType().getText()
  //
  //         if (paramType === 'RequestWithUser') return undefined
  //
  //         return {
  //           name: param.getName(),
  //           type: paramType
  //         }
  //       })
  //
  //       const httpVerb = getHttpVerb(method)
  //       const apiBase = controllerEntity.getDecorator('Controller')?.getArguments()[0]?.getText() || ''
  //       const apiRoute = method.getDecorator(httpVerb)?.getArguments()[0]?.getText() || ''
  //       const returnType = cleanReturnType(method.getReturnType().getText())
  //
  //       if (httpVerb === 'UNKNOWN') {
  //         console.log(`${RED}Método ${methodName} no tiene un verbo HTTP asociado${RESET}`)
  //
  //         return
  //       }
  //
  //       let functionCode = ''
  //
  //       const decorator = method.getParameters().map((param) => getDecorators(param))[0]
  //
  //       const parameters = methodParameters
  //         .filter((param) => param)
  //         .map((param) => {
  //           return `${param.name}: ${param.type}`
  //         })
  //         .join(', ')
  //
  //       if (httpVerb === 'Get') {
  //         functionCode = createGetFunction(
  //           methodName,
  //           parameters,
  //           returnType,
  //           apiBase,
  //           apiRoute,
  //           decorator ?? {
  //             isParam: false,
  //             isBody: false,
  //             isQuery: false
  //           },
  //           importsEnums,
  //           importsModels,
  //           importsReturnTypes,
  //           importsDtos
  //         )
  //       }
  //
  //       if (httpVerb === 'Post') {
  //         functionCode = createPostFunction(
  //           methodName,
  //           parameters,
  //           returnType,
  //           apiBase,
  //           apiRoute,
  //           decorator ?? {
  //             isParam: false,
  //             isBody: false,
  //             isQuery: false
  //           },
  //           importsEnums,
  //           importsModels,
  //           importsReturnTypes,
  //           importsDtos
  //         )
  //       }
  //       //
  //       //       if (httpVerb === 'Patch') {
  //       //         functionCode = createPatchFunction(methodName, parameters, returnType, apiBase, apiRoute)
  //       //       }
  //       //
  //       //       if (httpVerb === 'Delete') {
  //       //         functionCode = createDeleteFunction(methodName, parameters, returnType, apiBase, apiRoute)
  //       //       }
  //
  //       const nameParsed = parseToKebabCase(methodName)
  //       const structure = getStructureToSaveFile(controllerPath)
  //
  //       const outputPath = path.resolve(frontendEndpointsSrcDir, structure, `${nameParsed}.ts`)
  //
  //       createDirectoryIfNotExists(path.dirname(outputPath))
  //       fs.writeFileSync(outputPath, functionCode, 'utf-8')
  //     })
  //   })
  // console.log(`${BRIGHT}${GREEN}Endpoints generados correctamente${RESET}`)
  // console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar endpoints${RESET}`)
}

module.exports = generateEndpoints
