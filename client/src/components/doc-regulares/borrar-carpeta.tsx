import type { Folder, Documento } from './interface'

import Swal from 'sweetalert2'
import { getStorage, ref, deleteObject } from 'firebase/storage'

export const deleteFolder = async (folderId: string) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la carpeta y todos sus documentos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      const storage = getStorage()

      // 1️⃣ Obtener la carpeta y sus documentos
      const folderResponse = await fetch(`http://localhost:3000/carpetas/obtenerCarpetaPorId/${folderId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!folderResponse.ok) {
        throw new Error('No se pudo obtener la carpeta.')
      }

      const folderData = (await folderResponse.json()) as Folder

      // 2️⃣ Recorrer documentos y eliminarlos por nombre en Firebase Storage
      for (const documento of folderData.documentos) {
        // Obtener el documento por su ID para encontrar su nombre
        const docResponse = await fetch(`http://localhost:3000/documentos/obtenerDocumentoPorId/${documento}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!docResponse.ok) {
          continue
        }

        const docData = (await docResponse.json()) as Documento
        const fileName = docData.archivo[0].nombre // Nombre del archivo en Storage

        if (fileName) {
          const fileRef = ref(storage, `documentos/${fileName}`)

          await deleteObject(fileRef)
        }

        // 3️⃣ Eliminar el documento en la colección "documentos"
        const deleteDocResponse = await fetch(`http://localhost:3000/documentos/EliminarDocumento/${documento}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (!deleteDocResponse.ok) {
        }
      }

      // 4️⃣ Eliminar la carpeta de la colección "carpetas"
      const deleteFolderResponse = await fetch(`http://localhost:3000/carpetas/EliminarCarpeta/${folderId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!deleteFolderResponse.ok) {
        throw new Error('No se pudo eliminar la carpeta de la base de datos.')
      }

      await Swal.fire({
        title: 'Eliminado',
        text: 'La carpeta, sus documentos y archivos han sido eliminados.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      return true // Confirmar eliminación exitosa
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar la carpeta. Inténtalo de nuevo.',
        icon: 'error'
      })

      return false
    }
  }

  return false
}
