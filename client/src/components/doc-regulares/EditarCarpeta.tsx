'use client'

import type { Folder } from './interface'

import React from 'react'
import { useRef, useEffect, useState } from 'react'
import { X, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const FOLDER_COLORS = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-orange-100']

interface EditarCarpetaProps {
  isOpen: boolean
  onClose: () => void
  onFolderUpdated: () => void
  folder: Folder | null
}

export function EditarCarpeta({ isOpen, onClose, onFolderUpdated, folder }: EditarCarpetaProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [nombre, setNombre] = useState<string>('')
  const [descripcion, setDescripcion] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [folderId, setFolderId] = useState<string>('')

  useEffect(() => {
    if (folder) {
      // Poblar los campos con los datos actuales de 'folder'
      setNombre(folder.nombre)
      setDescripcion(folder.descripcion ?? '')
      setSelectedColor(folder.color ?? '')
    }
  }, [folder])

  // Controlar la animación cuando cambia el estado de apertura
  useEffect(() => {
    if (isOpen) {
      setAnimationState('opening')

      const timer = setTimeout(() => {
        setAnimationState('open')
      }, 50)

      return () => {
        clearTimeout(timer)
      }
    } else {
      setAnimationState('closing')

      const timer = setTimeout(() => {
        setAnimationState('closed')
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isOpen])

  // Manejar clic fuera del diálogo para cerrarlo
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando el diálogo está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  // Manejar tecla Escape para cerrar el diálogo
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isOpen, onClose])

  // Cargar los datos de la carpeta cuando se abre el modal
  useEffect(() => {
    if (folder && isOpen) {
      // Guardar el ID de la carpeta si existe
      if ('id' in folder) {
        setFolderId(folder.id)
      }
    }
  }, [folder, isOpen])

  // Limpiar el estado cuando se cierra el diálogo
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setNombre('')
        setDescripcion('')
        setSelectedColor('')
        setFolderId('')
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isOpen])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const updatedFolder = { ...folder, nombre, descripcion, color: selectedColor }

      const response = await fetch(`https://servidor-vercel-bice.vercel.app/carpetas/editarCarpeta/${folderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedFolder)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la carpeta')
      }

      toast.success('Carpeta actualizada', { description: 'La carpeta ha sido actualizado correctamente', position: 'bottom-right' })

      onFolderUpdated()
      onClose()
    } catch (error) {
      toast.success('Error', { description: 'Ha ocurrido un error al actualizar la carpeta', position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void handleSubmit(e) // Usar void para ignorar el valor devuelto
  }

  const handleClose = () => {
    setNombre('')
    setDescripcion('')
    setSelectedColor('')

    onClose()
  }

  if (animationState === 'closed' && !isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        animationState === 'opening' || animationState === 'open' ? 'bg-black/50 backdrop-blur-[1px]' : 'bg-black/0 backdrop-blur-0'
      }`}
      style={{
        opacity: animationState === 'opening' || animationState === 'open' ? 1 : 0,
        pointerEvents: animationState === 'closing' || animationState === 'closed' ? 'none' : 'auto'
      }}
    >
      {isLoading ? (
        <div className="z-60 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      ) : null}
      <div
        ref={dialogRef}
        aria-labelledby="dialog-title"
        aria-modal="true"
        className="w-full max-w-[600px] rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-[hsl(20,14.3%,4.1%)]"
        role="dialog"
        style={{
          transform: animationState === 'opening' || animationState === 'open' ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          opacity: animationState === 'opening' || animationState === 'open' ? 1 : 0
        }}
      >
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold" id="dialog-title">
            Editar carpeta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Actualice el nombre, descripción y color de la carpeta.</p>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="nombre">
                Nombre de la carpeta *
              </Label>
              <Input
                required
                className="col-span-3"
                id="nombre"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNombre(e.target.value)
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-2 text-right" htmlFor="descripcion">
                Descripción (opcional)
              </Label>
              <Textarea
                className="col-span-3"
                id="descripcion"
                rows={3}
                value={descripcion}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDescripcion(e.target.value)
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-2 text-right">Color de la carpeta</Label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-2">
                  {FOLDER_COLORS.map((color) => (
                    <button
                      key={color}
                      aria-label={`Color ${color}`}
                      className={`h-8 w-8 rounded-full ${color} ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color)
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t bg-muted/50 px-6 py-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={!nombre || isLoading} onClick={handleFormSubmit}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar Carpeta
          </Button>
        </div>

        {/* Close button */}
        <button aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800" type="button" onClick={handleClose}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
