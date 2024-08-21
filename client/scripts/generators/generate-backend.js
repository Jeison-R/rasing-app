/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

const { Project } = require('ts-morph')

const {
  backendSrcDir,
  frontendEnumsSrcDir,
  BRIGHT,
  RESET,
  GREEN,
  frontendModelsSrcDir,
  PURPLE,
  ENUMS_PATH,
  MODELS_PATH,
  frontendDtosSrcDir,
  DTOS_PATH,
  frontendEndpointsSrcDir,
  RED,
  RETURN_TYPES,
  frontendReturnTypesSrcDir
} = require('./constants')
const { evaluateTypes, getPropertyType, parseToKebabCase, getStructureToSaveFile, createDirectoryIfNotExists, getImport, getAllFiles, getPropertyDeclaration, generateImports } = require('./commons')
const { getHttpVerb, cleanReturnType, getDecorators, createGetFunction, createPostFunction } = require('./generate-endpoints')

const project = new Project()

const importsEnums = new Set()
const importsInterfaces = new Set()
const importsDtos = new Set()
const importsReturnTypes = new Set()

generateEnums()
generateDtoImports()
generateInterfacesImports()
// generateReturnTypesImports()
generateDtos()
generateModels()
// generateEndpoints()

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
      const enumPathFrontend = `${ENUMS_PATH}/${structure}/${nameParsed}`

      importsEnums.add({
        name: enumName,
        path: enumPathFrontend
      })

      const outputPath = path.resolve(frontendEnumsSrcDir, structure, `${nameParsed}.ts`)

      createDirectoryIfNotExists(path.dirname(outputPath))

      fs.writeFileSync(outputPath, enumCode, 'utf-8')
    })
  })

  console.log(`${BRIGHT}${GREEN}Enums generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar enums${RESET}`)
}

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

    const dtoCode = `${importsArray.size > 0 ? [...importsArray].map((type) => getImport(type, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)).join('\n') : ''}

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
}

function generateInterfacesImports() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de interfaces${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de interfaces...${RESET}`)

  const interfaces = getAllFiles(backendSrcDir, 'entity.ts')

  interfaces.forEach((entityFile) => {
    const entityPath = path.resolve(backendSrcDir, entityFile)
    const sourceFile = project.addSourceFileAtPath(entityPath)
    const classEntity = sourceFile.getClasses()[0]
    const entityName = classEntity.getName()

    const nameParsed = parseToKebabCase(entityName)
    const structure = getStructureToSaveFile(entityPath)
    const modelPath = `${MODELS_PATH}/${structure}/${nameParsed}`

    importsInterfaces.add({
      name: entityName,
      path: modelPath
    })
  })
  console.log(`${BRIGHT}${GREEN}Interfaces generadas correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de interfaces${RESET}`)
}

function generateReturnTypesImports() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de returnTypes${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de returnTypes...${RESET}`)

  const returnTypes = getAllFiles(backendSrcDir, 'return-type.ts')

  returnTypes.forEach((returnTypeFile) => {
    const importsArray = new Set()
    const returnTypePath = path.resolve(backendSrcDir, returnTypeFile)
    const sourceFile = project.addSourceFileAtPath(returnTypePath)
    const returnTypesInterfacesInFile = sourceFile.getInterfaces()
    const returnTypesTypesInFile = sourceFile.getTypeAliases()

    returnTypesInterfacesInFile.forEach((returnTypeEntity) => {
      const returnTypeName = returnTypeEntity?.getName() ?? undefined

      if (!returnTypeName) return

      const properties = returnTypeEntity.getProperties()

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

      const returnTypeCode = `${importsArray.size > 0 ? [...importsArray].map((type) => getImport(type, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)) : ''}

export interface ${returnTypeName} {
  ${returnTypeEntity
    ?.getProperties()
    .map((property) => getPropertyDeclaration(property))
    .join('\n')
    .trim()
    .replace(/;/g, '')}
}
`

      const nameParsed = parseToKebabCase(returnTypeName)
      const structure = getStructureToSaveFile(returnTypePath)
      const returnTypePathFrontend = `${RETURN_TYPES}/${structure}/${nameParsed}`

      importsReturnTypes.add({
        name: returnTypeName,
        path: returnTypePathFrontend
      })

      const outputPath = path.resolve(frontendReturnTypesSrcDir, structure, `${nameParsed}.ts`)

      createDirectoryIfNotExists(path.dirname(outputPath))
      fs.writeFileSync(outputPath, returnTypeCode, 'utf-8')
    })

    returnTypesTypesInFile.forEach((returnTypeEntity) => {
      const returnTypeName = returnTypeEntity?.getName() ?? undefined

      if (!returnTypeName) return

      console.log(returnTypeEntity.getText())

      const returnTypeCode = generateImports(returnTypeEntity.getText())

      const nameParsed = parseToKebabCase(returnTypeName)
      const structure = getStructureToSaveFile(returnTypePath)
      const returnTypePathFrontend = `${RETURN_TYPES}/${structure}/${nameParsed}`

      importsReturnTypes.add({
        name: returnTypeName,
        path: returnTypePathFrontend
      })

      const outputPath = path.resolve(frontendReturnTypesSrcDir, structure, `${nameParsed}.ts`)

      createDirectoryIfNotExists(path.dirname(outputPath))
      fs.writeFileSync(outputPath, returnTypeCode, 'utf-8')
    })
  })

  console.log(`${BRIGHT}${GREEN}returnTypes generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de returnTypes${RESET}`)
}

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

    const interfaceCode = `${importsArray.size > 0 ? [...importsArray].map((type) => getImport(type, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)).join('\n') : ''}

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

    importsInterfaces.add({
      name: entityName,
      path: modelPath
    })

    createDirectoryIfNotExists(path.dirname(outputPath))

    fs.writeFileSync(outputPath, interfaceCode, 'utf-8')
  })

  console.log(`${BRIGHT}${GREEN}Modelos generados correctamente.${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar modelos${RESET}`)
}

function generateEndpoints() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de endpoints${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando endpoints...${RESET}`)

  const controllers = getAllFiles(backendSrcDir, 'controller.ts')

  controllers.forEach((controller) => {
    const controllerPath = path.resolve(backendSrcDir, controller)
    const sourceFile = project.addSourceFileAtPath(controllerPath)
    const controllerEntity = sourceFile.getClasses()[0]
    const controllerName = controllerEntity?.getName() ?? undefined

    if (!controllerName) return

    const methods = controllerEntity.getMethods()

    methods.forEach((method) => {
      const methodName = method.getName()
      const methodParameters = method.getParameters().map((param) => {
        const paramType = param.getType().getSymbol()?.getName() ?? param.getType().getText()

        if (paramType === 'RequestWithUser') return undefined

        return {
          name: param.getName(),
          type: paramType
        }
      })

      const httpVerb = getHttpVerb(method)
      const apiBase = controllerEntity.getDecorator('Controller')?.getArguments()[0]?.getText() || ''
      const apiRoute = method.getDecorator(httpVerb)?.getArguments()[0]?.getText() || ''
      const returnType = cleanReturnType(method.getReturnType().getText())

      if (httpVerb === 'UNKNOWN') {
        console.log(`${RED}Método ${methodName} no tiene un verbo HTTP asociado${RESET}`)

        return
      }

      let functionCode = ''

      const decorator = method.getParameters().map((param) => getDecorators(param))[0]

      const parameters = methodParameters
        .filter((param) => param)
        .map((param) => {
          return `${param.name}: ${param.type}`
        })
        .join(', ')

      if (httpVerb === 'Get') {
        functionCode = createGetFunction(
          methodName,
          parameters,
          returnType,
          apiBase,
          apiRoute,
          decorator ?? {
            isParam: false,
            isBody: false,
            isQuery: false
          },
          importsEnums,
          importsInterfaces,
          importsReturnTypes,
          importsDtos
        )
      }

      if (httpVerb === 'Post') {
        functionCode = createPostFunction(
          methodName,
          parameters,
          returnType,
          apiBase,
          apiRoute,
          decorator ?? {
            isParam: false,
            isBody: false,
            isQuery: false
          },
          importsEnums,
          importsInterfaces,
          importsReturnTypes,
          importsDtos
        )
      }
      //
      //       if (httpVerb === 'Patch') {
      //         functionCode = createPatchFunction(methodName, parameters, returnType, apiBase, apiRoute)
      //       }
      //
      //       if (httpVerb === 'Delete') {
      //         functionCode = createDeleteFunction(methodName, parameters, returnType, apiBase, apiRoute)
      //       }

      const nameParsed = parseToKebabCase(methodName)
      const structure = getStructureToSaveFile(controllerPath)

      const outputPath = path.resolve(frontendEndpointsSrcDir, structure, `${nameParsed}.ts`)

      createDirectoryIfNotExists(path.dirname(outputPath))
      fs.writeFileSync(outputPath, functionCode, 'utf-8')
    })
  })

  console.log(`${BRIGHT}${GREEN}Endpoints generados correctamente${RESET}`)
  console.timeEnd(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de endpoints${RESET}`)
}

function generateDtoImports() {
  console.time(`${BRIGHT}${GREEN}Tiempo transcurrido en generar importaciones de dtos${RESET}`)
  console.log(`${BRIGHT}${PURPLE}Generando importaciones de dtos...${RESET}`)

  const dtos = getAllFiles(backendSrcDir, 'dto.ts')

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
}
