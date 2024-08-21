const { evaluateTypes, getImport } = require('../helpers/commons')

function createGetFunction(name, parameters, returnType, apiBase, apiRoute, decorator, importsEnums, importsInterfaces, importsReturnTypes, importsDtos) {
  apiBase = apiBase.replace(/'/g, '')
  apiRoute = apiRoute.replace(/'/g, '')

  returnType = returnType.replace(/Promise<(.+)>/, '$1')

  let response = ''

  if (decorator.isParam) {
    apiRoute = apiRoute.replace(/:\w+/, '${' + parameters.split(':')[0] + '}')

    response = `const response = await get<${returnType}>(\`${apiRoute ? apiBase + '/' + apiRoute : apiBase}\`)`
  }

  if (decorator.isQuery) {
    response = `const response = await get<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}', { ...${parameters.split(':')[0]} })`
  }

  if (!decorator.isParam && !decorator.isQuery && !decorator.isBody) {
    response = `const response = await get<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}')`
  }

  const dtoTypeParsed = evaluateTypes(parameters.split(': ')[1])
  const returnTypeParsed = evaluateTypes(returnType)

  return `import { get } from '@/src/proxy/verbs'
import { ResponseType } from '@/src/proxy/verbs-types'
${getImport(dtoTypeParsed, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)}
${getImport(returnTypeParsed, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)}

export const ${name} = async (${parameters}) => {
  ${response}

  if (response.status === ResponseType.Error) {
    if (response.message) {
      return {
        error: response.message
      }
    } else {
      return {
        error: 'Error al obtener los datos -> (${name})'
      }
    }
  }

  return response
}
`
}

function createPostFunction(name, parameters, returnType, apiBase, apiRoute, decorator, importsEnums, importsInterfaces, importsReturnTypes, importsDtos) {
  apiBase = apiBase.replace(/'/g, '')
  apiRoute = apiRoute.replace(/'/g, '')

  returnType = returnType.replace(/Promise<(.+)>/, '$1')

  let response = ''

  if (decorator.isParam) {
    apiRoute = apiRoute.replace(/:\w+/, '${' + parameters.split(':')[0] + '}')

    response = `const response = await post<${returnType}>(\`${apiRoute ? apiBase + '/' + apiRoute : apiBase}\`)`
  }

  if (decorator.isQuery) {
    response = `const response = await post<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}', { ...${parameters.split(':')[0]} })`
  }

  if (decorator.isBody) {
    response = `const response = await post<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}', {}, { ...${parameters.split(':')[0]} })`
  }

  if (!decorator.isParam && !decorator.isQuery && !decorator.isBody) {
    response = `const response = await post<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}')`
  }

  const dtoTypeParsed = evaluateTypes(parameters.split(': ')[1])

  const returnTypeParsed = evaluateTypes(returnType)

  return `import { post } from '@/src/proxy/verbs'
import { ResponseType } from '@/src/proxy/verbs-types'
${getImport(dtoTypeParsed, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)}
${getImport(returnTypeParsed, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)}

export const ${name} = async (${parameters}) => {
  ${response}
      
  if (response.status === ResponseType.Error) {
    if (response.message) {
      return {
        error: response.message
      }
    } else {
      return {
        error: 'Error al obtener los datos -> (${name})'
      }
    }
  }

  return response
}
`
}

function createPatchFunction(name, parameters, returnType, apiBase, apiRoute) {
  apiBase = apiBase.replace(/'/g, '')
  apiRoute = apiRoute.replace(/'/g, '')

  return `import { patch } from '@/src/proxy/verbs'
import { ResponseType } from '@/src/proxy/verbs-types'
  
export const ${name} = async (${parameters}) => {
  const response = await patch<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}', ${parameters})
      
  if (response.status === ResponseType.Error) {
    if (response.message) {
      return {
        error: response.message
      }
    } else {
      return {
        error: 'Error al obtener los datos -> (${name})'
      }
    }
  }

  return response
}
`
}

function createDeleteFunction(name, parameters, returnType, apiBase, apiRoute) {
  apiBase = apiBase.replace(/'/g, '')
  apiRoute = apiRoute.replace(/'/g, '')

  return `import { remove } from '@/src/proxy/verbs'
import { ResponseType } from '@/src/proxy/verbs-types'
  
export const ${name} = async (${parameters}) => {
  const response = await remove<${returnType}>('${apiRoute ? apiBase + '/' + apiRoute : apiBase}', ${parameters})
      
  if (response.status === ResponseType.Error) {
    if (response.message) {
      return {
        error: response.message
      }
    } else {
      return {
        error: 'Error al obtener los datos -> (${name})'
      }
    }
  }

  return response
}
`
}

function getHttpVerb(method) {
  const decorators = method.getDecorators()
  const httpDecorator = decorators.find((decorator) => ['Get', 'Post', 'Patch', 'Delete'].includes(decorator.getName()))

  return httpDecorator?.getName() ?? 'UNKNOWN'
}

function cleanReturnType(returnType) {
  const regex = /import\([^)]+\)\./g
  const transformedType = returnType.replace(regex, '')

  return transformedType.trim()
}

function getDecorators(param) {
  const isParam = !!param.getDecorator('Param')
  const isBody = !!param.getDecorator('Body')
  const isQuery = !!param.getDecorator('Query')

  return {
    isParam,
    isBody,
    isQuery
  }
}

module.exports = {
  createGetFunction,
  createPostFunction,
  createPatchFunction,
  createDeleteFunction,
  getHttpVerb,
  cleanReturnType,
  getDecorators
}
