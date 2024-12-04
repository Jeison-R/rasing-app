// Definición de la interfaz para TipoContrato
export interface TipoContrato {
  id: string
  nombre: string // Asegúrate de que coincide con tu API
}

// Obtener todos los tipos de contrato
export const obtenerTiposContrato = async (): Promise<TipoContrato[]> => {
  const response = await fetch('https://servidor-rasing.onrender.com/tiposContratos/obtenerTiposContratos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al obtener los tipos de contrato')
  }

  return (await response.json()) as TipoContrato[]
}

// Agregar un nuevo tipo de contrato
export const agregarTipoContrato = async (tipoContrato: TipoContrato): Promise<void> => {
  const response = await fetch('https://servidor-rasing.onrender.com/tiposContratos/crearTipoContrato', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tipoContrato)
  })

  if (!response.ok) {
    throw new Error('Error al agregar el tipo de contrato')
  }
}

// Eliminar un tipo de contrato por ID
export const eliminarTipoContrato = async (id: string): Promise<void> => {
  const response = await fetch(`https://servidor-rasing.onrender.com/tiposContratos/eliminarTipoContrato/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el tipo de contrato')
  }
}
