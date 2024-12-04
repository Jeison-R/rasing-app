// src/services/actividadService.ts
export interface Payment {
  id: string
  nombre: string // Asegúrate de que coincide con tu API
}

// Obtener todas las actividades
export const obtenerActividades = async (): Promise<Payment[]> => {
  const response = await fetch('https://servidor-rasing.onrender.com/actividades/obtenerActividades', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al obtener las actividades')
  }

  return (await response.json()) as Payment[]
}

// Agregar una nueva actividad
export const agregarActividad = async (actividad: Payment): Promise<void> => {
  const response = await fetch('https://servidor-rasing.onrender.com/actividades/crearActividad', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(actividad)
  })

  if (!response.ok) {
    throw new Error('Error al agregar la actividad')
  }
}

// Eliminar una actividad por ID
export const eliminarActividad = async (id: string): Promise<void> => {
  const response = await fetch(`https://servidor-rasing.onrender.com/actividades/eliminarActividad/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al eliminar la actividad')
  }
}
