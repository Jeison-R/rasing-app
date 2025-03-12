// utils/deleteDocument.ts

import Swal from 'sweetalert2'
import { getStorage, ref, deleteObject } from 'firebase/storage'

export const deleteDocument = async (id: string, filePath: string) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      // Eliminar el documento de la base de datos
      const response = await fetch(`https://servidor-rasing.onrender.com/documentos/EliminarDocumento/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar el documento de la base de datos.')
      }

      // Eliminar el archivo de Firebase Storage
      if (filePath) {
        const storage = getStorage()
        const fileRef = ref(storage, filePath)

        await deleteObject(fileRef)
      }

      await Swal.fire({
        title: 'Eliminado',
        text: 'El documento ha sido eliminado junto con su archivo.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      return true // Confirmar eliminación exitosa
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el documento. Inténtalo de nuevo.',
        icon: 'error'
      })

      return false // Indicar que la eliminación falló
    }
  }

  return false // Indicar que la eliminación fue cancelada
}
