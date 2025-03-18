// utils/deleteDocument.ts

import type { Folder } from './interface'

import Swal from 'sweetalert2'
import { getStorage, ref, deleteObject } from 'firebase/storage'

export const deleteDocument = async (id: string, filePath: string, folderId: string) => {
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
      // 1️⃣ Eliminar el documento de la base de datos
      const response = await fetch(`https://servidor-rasing.onrender.com/documentos/EliminarDocumento/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar el documento de la base de datos.')
      }

      // 2️⃣ Eliminar el archivo de Firebase Storage (si existe)
      if (filePath) {
        const storage = getStorage()
        const fileRef = ref(storage, filePath)

        await deleteObject(fileRef)
      }

      // 3️⃣ Obtener la carpeta actualizada y eliminar el ID del documento
      if (folderId) {
        const folderResponse = await fetch(`http://localhost:3000/carpetas/obtenerCarpetaPorId/${folderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!folderResponse.ok) {
          throw new Error('No se pudo obtener la carpeta.')
        }

        const folderData = (await folderResponse.json()) as Folder

        // Filtrar el documento eliminado
        const documentosActualizados = folderData.documentos.filter((docId: string) => docId !== id)

        // 4️⃣ Actualizar la carpeta con la nueva lista de documentos
        const updateFolderResponse = await fetch(`http://localhost:3000/carpetas/editarCarpeta/${folderId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentos: documentosActualizados
          })
        })

        if (!updateFolderResponse.ok) {
          throw new Error('No se pudo actualizar la carpeta.')
        }
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
