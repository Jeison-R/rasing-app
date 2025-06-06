import type { Folder } from './interface'

import { useState } from 'react'
import { X } from 'lucide-react'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface DeleteDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  documentId: string
  filePath: string
  folderId: string
  onDeleteSuccess: () => void
}

export function DeleteDocumentModal({ isOpen, onClose, documentId, filePath, folderId, onDeleteSuccess }: DeleteDocumentModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Eliminar el documento de la base de datos
      const response = await fetch(`https://servidor-vercel-bice.vercel.app/documentos/EliminarDocumento/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('No se pudo eliminar el documento de la base de datos.')
      }

      // Eliminar el archivo de Firebase Storage (si existe)
      if (filePath) {
        const storage = getStorage()
        const fileRef = ref(storage, filePath)

        await deleteObject(fileRef)
      }

      // Obtener la carpeta actualizada y eliminar el ID del documento
      if (folderId) {
        const folderResponse = await fetch(`https://servidor-vercel-bice.vercel.app/carpetas/obtenerCarpetaPorId/${folderId}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })

        if (!folderResponse.ok) {
          throw new Error('No se pudo obtener la carpeta.')
        }

        const folderData = (await folderResponse.json()) as Folder
        const documentosActualizados = folderData.documentos.filter((docId: string) => docId !== documentId)

        // Actualizar la carpeta con la nueva lista de documentos
        const updateFolderResponse = await fetch(`https://servidor-vercel-bice.vercel.app/carpetas/editarCarpeta/${folderId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentos: documentosActualizados })
        })

        if (!updateFolderResponse.ok) {
          throw new Error('No se pudo actualizar la carpeta.')
        }
      }

      toast.success('Eliminado', { description: 'El documento ha sido eliminado.', position: 'bottom-right' })

      onDeleteSuccess()
      onClose()
    } catch (error) {
      toast.warning('Error', { description: 'No se pudo eliminar el documento.', position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
        {isLoading ? (
          <div className="z-60 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <LoadingSpinner />
          </div>
        ) : null}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Eliminar Documento</h2>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end space-x-2">
          <Button disabled={isLoading} variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={() => void handleDelete()}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
