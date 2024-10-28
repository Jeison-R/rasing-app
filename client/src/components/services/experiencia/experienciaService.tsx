import type { Experiencia } from '../../experiencia/experience-table/experience-table'

export const obtenerExperiences = async (): Promise<Experiencia[]> => {
  const response = await fetch('http://localhost:3000/experiencias/obtenerExperiencia')

  if (!response.ok) {
    throw new Error('Error al obtener los documentos de soporte')
  }

  return (await response.json()) as Experiencia[]
}

export const eliminarExperiences = async (id: string): Promise<void> => {
  const response = await fetch(`http://localhost:3000/experiencias/eliminarExperiencia/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el documento de soporte')
  }
}

export const actualizarExperiences = async (id: string, experiencia: Experiencia): Promise<void> => {
  const response = await fetch(`http://localhost:3000/experiencias/actualizarExperiencia/${id}`, {
    method: 'PUT', // O 'PATCH', según tu API
    headers: {
      'Content-Type': 'application/json' // Asegúrate de que tu backend acepte JSON
    },
    body: JSON.stringify(experiencia) // Convertir el objeto experiencia a JSON
  })

  if (!response.ok) {
    throw new Error('Error al actualizar la experiencia')
  }
}
