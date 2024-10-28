import Swal from 'sweetalert2'

import { eliminarActividad } from '../../services/actividad/actividadService'

export const deleteActividad = async (
  id: string,
  nombreActividad: string, // Parámetro para el nombre de la actividad
  fetchActividades: () => Promise<void> // Función para refrescar actividades
) => {
  // Confirmar con SweetAlert antes de eliminar
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de eliminar la actividad: ${nombreActividad}. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      // Llamar a la función `eliminarActividad` del servicio
      await eliminarActividad(id)

      // Mostrar éxito con SweetAlert
      await Swal.fire('Eliminado', `La actividad '${nombreActividad}' ha sido eliminada`, 'success')

      // Actualizar la lista de actividades después de eliminar
      await fetchActividades()
    } catch (error) {
      // Manejar errores y mostrar alerta
      await Swal.fire('Error', 'Hubo un problema al eliminar la actividad', 'error')
    }
  }
}
