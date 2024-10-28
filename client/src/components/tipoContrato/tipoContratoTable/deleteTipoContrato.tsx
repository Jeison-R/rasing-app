import Swal from 'sweetalert2'

import { eliminarTipoContrato } from '../../services/tipoContrato/contratoService'

export const deleteContrato = async (
  id: string,
  nombre: string, // Agrega un nuevo parámetro para el nombre de la actividad
  fetchTipoContrato: () => Promise<void>
) => {
  // Confirmar con SweetAlert antes de eliminar
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de eliminar el Contrato: ${nombre}. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await eliminarTipoContrato(id)
      // Mostrar éxito con SweetAlert
      await Swal.fire('Eliminado', `El contrato '${nombre}' ha sido eliminado`, 'success')

      // Actualizar la lista de actividades después de eliminar
      await fetchTipoContrato()
    } catch (error) {
      // Manejar errores y mostrar alerta
      await Swal.fire('Error', 'Hubo un problema al eliminar el contrato', 'error')
    }
  }
}
