import Swal from 'sweetalert2'

export const deleteActividad = async (
  id: string,
  nombreActividad: string, // Agrega un nuevo parámetro para el nombre de la actividad
  fetchActividades: () => Promise<void>
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
      const response = await fetch(`http://localhost:3000/actividades/eliminarActividad/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la actividad')
      }

      // Mostrar éxito con SweetAlert
      void Swal.fire('Eliminado', `La actividad '${nombreActividad}' ha sido eliminada`, 'success')

      // Actualizar la lista de actividades después de eliminar
      await fetchActividades()
    } catch (error) {
      // Manejar errores y mostrar alerta
      void Swal.fire('Error', 'Hubo un problema al eliminar la actividad', 'error')
    }
  }
}
