import Swal from 'sweetalert2'

export const deleteDocumento = async (
  id: string,
  nombre: string, // Agrega un nuevo parámetro para el nombre de la actividad
  fetchDocumentos: () => Promise<void>
) => {
  // Confirmar con SweetAlert antes de eliminar
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de eliminar el documento: ${nombre}. Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:3000/tiposDocumentos/eliminarTipoDocumento/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el documento')
      }

      // Mostrar éxito con SweetAlert
      void Swal.fire('Eliminado', `El documento '${nombre}' ha sido eliminado`, 'success')

      // Actualizar la lista de actividades después de eliminar
      await fetchDocumentos()
    } catch (error) {
      // Manejar errores y mostrar alerta
      void Swal.fire('Error', 'Hubo un problema al eliminar el documento', 'error')
    }
  }
}
