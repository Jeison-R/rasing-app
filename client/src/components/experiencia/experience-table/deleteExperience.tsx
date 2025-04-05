import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { getStorage, ref, deleteObject } from 'firebase/storage'

import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { eliminarExperiences } from '../../services/experiencia/experienciaService'

interface DeleteExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  experienceId: string
  filePaths: string[]
  onDeleteSuccess: () => void
}

export function DeleteExperienceModal({ isOpen, onClose, experienceId, filePaths, onDeleteSuccess }: DeleteExperienceModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Eliminar la experiencia de la base de datos
      await eliminarExperiences(experienceId)

      // Eliminar archivos de Firebase Storage
      const storage = getStorage()

      for (const filePath of filePaths) {
        if (filePath) {
          const fileRef = ref(storage, filePath)

          await deleteObject(fileRef)
        }
      }

      toast.success('Eliminado', {
        description: `La experiencia ha sido eliminada junto con sus archivos asociados.`,
        position: 'bottom-right'
      })

      onDeleteSuccess()
      onClose()
    } catch (error) {
      toast.error('Error', {
        description: 'No se pudo eliminar la experiencia. Inténtalo de nuevo.',
        position: 'bottom-right'
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
          <h2 className="text-lg font-semibold">Eliminar Experiencia</h2>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">¿Estás seguro de que deseas eliminar esta experiencia? Esta acción no se puede deshacer.</p>
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
