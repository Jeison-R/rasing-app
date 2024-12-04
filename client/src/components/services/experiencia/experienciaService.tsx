import type { Experiencia } from '../../experiencia/experience-table/interface'

export const obtenerExperiences = async (): Promise<Experiencia[]> => {
  const response = await fetch('https://servidor-rasing.onrender.com/experiencias/obtenerExperiencia', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al obtener los documentos de soporte')
  }

  return (await response.json()) as Experiencia[]
}

export const eliminarExperiences = async (id: string): Promise<void> => {
  const response = await fetch(`https://servidor-rasing.onrender.com/experiencias/eliminarExperiencia/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el documento de soporte')
  }
}

export const actualizarExperiences = async (id: string, experiencia: Experiencia): Promise<void> => {
  const response = await fetch(`https://servidor-rasing.onrender.com/experiencias/actualizarExperiencia/${id}`, {
    method: 'PUT', // O 'PATCH', según tu API
    headers: {
      'Content-Type': 'application/json' // Asegúrate de que tu backend acepte JSON
    },
    credentials: 'include',
    body: JSON.stringify(experiencia) // Convertir el objeto experiencia a JSON
  })

  if (!response.ok) {
    throw new Error('Error al actualizar la experiencia')
  }
}
