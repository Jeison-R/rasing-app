// Definición de la interfaz para Salario
export interface Salario {
  id: string // ID generado automáticamente
  año: number // Año del salario
  valor: number // Valor del salario
}

// Obtener todos los salarios
export const obtenerSalarios = async (): Promise<Salario[]> => {
  const response = await fetch('https://servidor-rasing.onrender.com/salarios/obtenerSalarios', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Error al obtener los salarios')
  }

  return (await response.json()) as Salario[]
}

// Agregar un nuevo salario
export const agregarSalario = async (salario: Salario): Promise<void> => {
  const response = await fetch('https://servidor-rasing.onrender.com/salarios/crearSalario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(salario)
  })

  if (!response.ok) {
    throw new Error('Error al agregar el salario')
  }
}

// Eliminar un salario por ID
export const eliminarSalario = async (id: string): Promise<void> => {
  const response = await fetch(`https://servidor-rasing.onrender.com/salarios/eliminarSalario/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el salario')
  }
}

// Actualizar un salario
export const actualizarSalario = async (id: string, año: number, valor: number): Promise<void> => {
  const response = await fetch(`https://servidor-rasing.onrender.com/salarios/actualizarSalario/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ año, valor }) // Enviar año y valor como objeto
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el salario')
  }
}
