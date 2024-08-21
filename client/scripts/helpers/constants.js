const path = require('path')

const RESET = '\x1b[0m'
const BRIGHT = '\x1b[1m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const BLUE = '\x1b[34m'
const PURPLE = '\x1b[35m'

const BASE_PATH_BACKEND = '../../../api/src'
const BASE_PATH_FRONTEND = '../../../app/src'

const MODELS_PATH = 'rest-client/models'
const DTOS_PATH = 'rest-client/dtos'
const ENUMS_PATH = 'rest-client/enums'
const ENDPOINTS_PATH = 'rest-client/endpoints'
const RETURN_TYPES = 'rest-client/return-types'

// Directorio de la fuente del backend
const backendSrcDir = path.resolve(__dirname, BASE_PATH_BACKEND)

// Directorio de la fuente del frontend
const frontendSrcDir = path.resolve(__dirname, BASE_PATH_FRONTEND)

// Directorio de los endpoints del frontend
const frontendEndpointsSrcDir = path.resolve(__dirname, `${frontendSrcDir}/${ENDPOINTS_PATH}`)

// Directorio de los modelos del frontend
const frontendModelsSrcDir = path.resolve(__dirname, `${frontendSrcDir}/${MODELS_PATH}`)

// Directorio de los enums del frontend
const frontendEnumsSrcDir = path.resolve(__dirname, `${frontendSrcDir}/${ENUMS_PATH}`)

// Directorio de los dtos del frontend
const frontendDtosSrcDir = path.resolve(__dirname, `${frontendSrcDir}/${DTOS_PATH}`)

// Directorio de los return types del frontend
const frontendReturnTypesSrcDir = path.resolve(__dirname, `${frontendSrcDir}/${RETURN_TYPES}`)

const types = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  Date: 'Date',
  any: 'any',
  null: 'null',
  undefined: 'undefined'
}

module.exports = {
  RESET,
  BRIGHT,
  RED,
  GREEN,
  BLUE,
  PURPLE,
  BASE_PATH_BACKEND,
  backendSrcDir,
  frontendEndpointsSrcDir,
  frontendModelsSrcDir,
  frontendEnumsSrcDir,
  types,
  frontendSrcDir,
  MODELS_PATH,
  ENUMS_PATH,
  DTOS_PATH,
  frontendDtosSrcDir,
  ENDPOINTS_PATH,
  RETURN_TYPES,
  frontendReturnTypesSrcDir
}
