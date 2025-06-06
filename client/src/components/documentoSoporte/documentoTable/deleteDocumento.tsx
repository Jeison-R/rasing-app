import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { eliminarDocumentoSoporte } from '../../services/documento/documentoService'

interface DeleteDocumentoModalProps {
  isOpen: boolean
  onClose: () => void
  documentoId: string
  nombreDocumento: string
  onDeleteSuccess: () => void
}

export function DeleteDocumentoModal({ isOpen, onClose, documentoId, nombreDocumento, onDeleteSuccess }: DeleteDocumentoModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await eliminarDocumentoSoporte(documentoId)

      toast.success('Documento eliminado', {
        description: `El documento "${nombreDocumento}" ha sido eliminado.`
      })

      onDeleteSuccess()
      onClose()
    } catch (error) {
      toast.error('Error al eliminar', {
        description: 'No se pudo eliminar el documento. Inténtalo nuevamente.'
      })
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
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar el documento `{nombreDocumento}`? Esta acción no se puede deshacer.</p>
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
