const fs = require('fs')
const path = require('path')

const { types, backendSrcDir } = require('../helpers/constants')

/**
 * Evalúa los tipos de datos.
 * @param {string} type - El tipo de dato a evaluar.
 * @returns {string} - El tipo de dato evaluado.
 */
function evaluateTypes(type) {
  // Si el tipo no está definido, devuelve una cadena vacía.
  if (!type) return ''

  // Obtiene el tipo evaluado de la constante 'types'.
  const typeEvaluated = types[type]

  // Si el tipo está definido en 'types', devuelve el mismo tipo.
  if (typeEvaluated) return type

  // Si el tipo termina con '[]', devuelve el tipo sin los corchetes.
  return type.endsWith('[]') ? type.slice(0, -2) : type
}

/**
 * Obtiene la importación correspondiente para un tipo dado.
 * @param {string} type - El tipo para el cual se desea obtener la importación.
 * @param {Array} importsEnums - Array de objetos que representan las importaciones de enums.
 * @param {Array} importsModels - Array de objetos que representan las importaciones de interfaces.
 * @param {Array} importsReturnTypes - Array de objetos que representan las importaciones de tipos de retorno.
 * @param {Array} importsDtos - Array de objetos que representan las importaciones de DTOs.
 * @returns {string} - La importación correspondiente al tipo dado.
 */
function getImport(type, importsEnums = [], importsModels = [], importsReturnTypes = [], importsDtos = []) {
  // Si el tipo no está definido, devuelve una cadena vacía.
  if (!type) return ''

  // Busca la importación correspondiente al tipo en el array de importaciones de enums.
  const enumPath = [...importsEnums].find((enumPath) => enumPath.name === type)

  // Busca la importación correspondiente al tipo en el array de importaciones de interfaces.
  const entityPath = [...importsModels].find((entityPath) => entityPath.name === type)

  // Busca la importación correspondiente al tipo en el array de importaciones de tipos de retorno.
  const returnTypePath = [...importsReturnTypes].find((returnTypePath) => returnTypePath.name === type)

  // Busca la importación correspondiente al tipo en el array de importaciones de DTOs.
  const dtoPath = [...importsDtos].find((dtoPath) => dtoPath.name === type)

  // Si se encontró una importación de enum para el tipo, devuelve la importación correspondiente.
  if (enumPath) {
    return `import type { ${type} } from '@/src/${enumPath.path}'`
  }

  // Si se encontró una importación de interface para el tipo, devuelve la importación correspondiente.
  if (entityPath) {
    return `import type { ${type} } from '@/src/${entityPath.path}'`
  }

  // Si se encontró una importación de DTO para el tipo, devuelve la importación correspondiente.
  if (dtoPath) {
    return `import type { ${type} } from '@/src/${dtoPath.path}'`
  }

  // Si se encontró una importación de tipo de retorno para el tipo, devuelve la importación correspondiente.
  if (returnTypePath) {
    return `import type { ${type} } from '@/src/${returnTypePath.path}'`
  }
}

/**
 * Obtiene el tipo de propiedad para una propiedad dada.
 * @param {PropertyDeclaration} property - La declaración de la propiedad.
 * @returns {string} - El tipo de propiedad.
 */
function getPropertyType(property) {
  // Obtiene el nodo de tipo de la propiedad.
  const propertyTypeNode = property.getTypeNode()

  // Si existe un nodo de tipo de propiedad, devuelve el texto del nodo.
  if (propertyTypeNode) {
    return propertyTypeNode.getText()
  } else {
    // Si no existe un nodo de tipo de propiedad, obtiene el tipo de la propiedad y devuelve su texto.
    const propertyType = property.getType()

    return propertyType.getText()
  }
}

/**
 * Crea un directorio si no existe.
 * @param {string} directoryPath - La ruta del directorio a crear.
 */
function createDirectoryIfNotExists(directoryPath) {
  // Verifica si el directorio no existe.
  if (!fs.existsSync(directoryPath)) {
    // Crea el directorio de forma recursiva.
    fs.mkdirSync(directoryPath, { recursive: true })
  }
}

/**
 * Convierte un texto a formato kebab-case.
 * @param {string} text - El texto a convertir.
 * @returns {string} - El texto convertido a kebab-case.
 */
function parseToKebabCase(text) {
  // Si el texto no está definido, devuelve undefined.
  if (!text) return

  // Divide el texto en partes separadas por mayúsculas.
  const parts = text.split(/(?=[A-Z])/)

  // Une las partes con un guión y convierte todo a minúsculas.
  const kebabCaseText = parts.join('-').toLowerCase()

  // Devuelve el texto convertido a kebab-case.
  return kebabCaseText
}

/**
 * Obtiene la estructura para guardar un archivo.
 * @param {string} filePath - La ruta del archivo.
 * @returns {string} - La estructura para guardar el archivo.
 */
function getStructureToSaveFile(filePath) {
  // Obtiene la ruta relativa al directorio de backend.
  const relativePathToBackend = path.relative(backendSrcDir, filePath)

  // Divide la ruta en partes separadas por el separador de ruta.
  const structure = relativePathToBackend.split(path.sep)[0]

  // Devuelve la estructura para guardar el archivo.
  return structure
}

/**
 * Obtiene todos los archivos de un directorio y sus subdirectorios con una extensión específica.
 * @param {string} dir - La ruta del directorio.
 * @param {string} ext - La extensión de los archivos a buscar.
 * @returns {Array} - Un array con las rutas relativas de los archivos encontrados.
 */
function getAllFiles(dir, ext) {
  // Obtiene la lista de archivos en el directorio.
  const files = fs.readdirSync(dir)
  let result = []

  // Recorre cada archivo en el directorio.
  files.forEach((file) => {
    // Obtiene la ruta completa del archivo.
    const filePath = path.join(dir, file)
    // Obtiene la información del archivo.
    const stat = fs.statSync(filePath)

    // Si el archivo es un directorio, se llama recursivamente a la función para obtener los archivos dentro de él.
    if (stat.isDirectory()) {
      result = result.concat(getAllFiles(filePath, ext))
    } else if (file.endsWith(ext)) {
      // Si el archivo tiene la extensión deseada, se agrega su ruta relativa al resultado.
      result.push(path.relative(backendSrcDir, filePath))
    }
  })

  // Devuelve el array con las rutas relativas de los archivos encontrados.
  return result
}

/**
 * Obtiene la declaración de una propiedad.
 * @param {PropertyDeclaration} property - La declaración de la propiedad.
 * @returns {string} - La declaración de la propiedad.
 */
function getPropertyDeclaration(property) {
  // Obtiene el nombre de la propiedad.
  const propertyName = property.getName()

  // Obtiene el tipo de la propiedad.
  const propertyType = getPropertyType(property)

  // Verifica si la propiedad es opcional.
  const isOptional = property.hasQuestionToken()

  // Retorna la declaración de la propiedad con el nombre, tipo y opcionalidad.
  return `  ${propertyName}${isOptional ? '?' : ''}: ${propertyType};`
}

/**
 * Genera las importaciones correspondientes para un tipo dado.
 * @param {string} type - El tipo para el cual se desean generar las importaciones.
 * @param {Array} importsEnums - Array de objetos que representan las importaciones de enums.
 * @param {Array} importsInterfaces - Array de objetos que representan las importaciones de interfaces.
 * @param {Array} importsReturnTypes - Array de objetos que representan las importaciones de tipos de retorno.
 * @param {Array} importsDtos - Array de objetos que representan las importaciones de DTOs.
 * @returns {string} - Las importaciones correspondientes al tipo dado.
 */
function generateImports(type, importsEnums, importsInterfaces, importsReturnTypes, importsDtos) {
  // Verifica si el tipo incluye el operador '&'.
  if (type?.includes('&')) {
    // Divide el tipo en dos partes separadas por el signo '='.
    const types = type.split('=')
    // Divide la segunda parte en un array de tipos separados por el operador '&', y los limpia de espacios en blanco.
    const typesArray = types[1].split('&').map((type) => type.trim())

    // Genera las importaciones correspondientes para cada tipo del array y las une con saltos de línea.
    return `${typesArray.map((type) => getImport(type, importsEnums, importsInterfaces, importsReturnTypes, importsDtos)).join('\n')}

${type}`
  }

  // Si el tipo no incluye el operador '&', devuelve el tipo sin modificaciones.
  return type
}

module.exports = {
  evaluateTypes,
  getImport,
  getPropertyType,
  createDirectoryIfNotExists,
  parseToKebabCase,
  getStructureToSaveFile,
  getAllFiles,
  getPropertyDeclaration,
  generateImports
}
