// Definición de la interfaz para DocumentoSoporte
export interface DocumentoSoporte {
  id: string
  nombre: string // Asegúrate de que coincide con tu API
}

// Obtener todos los documentos de soporte
export const obtenerDocumentosSoporte = async (): Promise<DocumentoSoporte[]> => {
  const response = await fetch('http://localhost:3000/tiposDocumentos/obtenerTiposDocumentos')

  if (!response.ok) {
    throw new Error('Error al obtener los documentos de soporte')
  }

  return (await response.json()) as DocumentoSoporte[]
}

// Agregar un nuevo documento de soporte
export const agregarDocumentoSoporte = async (documentoSoporte: DocumentoSoporte): Promise<void> => {
  const response = await fetch('http://localhost:3000/tiposDocumentos/crearTipoDocumento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(documentoSoporte)
  })

  if (!response.ok) {
    throw new Error('Error al agregar el documento de soporte')
  }
}

// Eliminar un documento de soporte por ID
export const eliminarDocumentoSoporte = async (id: string): Promise<void> => {
  const response = await fetch(`http://localhost:3000/tiposDocumentos/eliminarTipoDocumento/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el documento de soporte')
  }
}
