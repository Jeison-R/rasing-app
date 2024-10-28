// utils/deleteExperience.ts

import Swal from 'sweetalert2'

import { eliminarExperiences } from '../../services/experiencia/experienciaService'

export const deleteExperience = async (id: string) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `No podrás revertir esta acción.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await eliminarExperiences(id) // Llama a la API para eliminar la experiencia
      await Swal.fire({
        title: 'Eliminado',
        text: `La experiencia ha sido eliminado.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      return true // Confirma que se eliminó correctamente
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la experiencia. Inténtalo de nuevo.',
        icon: 'error'
      })

      return false // Indica que la eliminación falló
    }
  }

  return false // Indica que se canceló la eliminación
}
