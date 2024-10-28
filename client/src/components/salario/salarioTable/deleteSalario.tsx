import Swal from 'sweetalert2'

import { eliminarSalario } from '../../services/salario/salarioService'

export const deleteSalario = async (id: string, año: string, fetchSalario: () => Promise<void>) => {
  // Confirmar con SweetAlert antes de eliminar
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de eliminar el salario: ${año}. Esta acción no se puede deshacer.`,
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
      await eliminarSalario(id)

      // Mostrar éxito con SweetAlert
      await Swal.fire('Eliminado', `El salario '${año}' ha sido eliminado`, 'success')

      // Actualizar la lista de actividades después de eliminar
      await fetchSalario()
    } catch (error) {
      // Manejar errores y mostrar alerta
      await Swal.fire('Error', 'Hubo un problema al eliminar el salario', 'error')
    }
  }
}
