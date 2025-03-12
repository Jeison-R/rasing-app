'use client'

import type { Documento, Archivo } from './interface'

import React, { type ChangeEvent } from 'react'
import { useState, useRef, useEffect } from 'react'
import { Upload, X, RefreshCw } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'
import Swal from 'sweetalert2'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { storage } from '../../firebase/firebase'

import { getFileIcon } from './interface'

interface ActualizarDocumentoProps {
  onClose: () => void
  isOpen: boolean
  documento: Documento | null
}

export function ActualizarDocumento({ onClose, isOpen, documento }: ActualizarDocumentoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [nombre, setNombre] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')
  const [categoria, setCategoria] = useState<string>('')
  const [documentoActualizado, setDocumentoActualizado] = useState<Documento | null>(null)
  const [archivoNuevo, setArchivoNuevo] = useState<Archivo[]>([])
  const [files, setFiles] = useState<Archivo[]>([])
  const [proximaActualizacion, setProximaActualizacion] = useState<string>('')
  const [documentoId, setDocumentoId] = useState<string>('')

  useEffect(() => {
    if (documento) {
      // Poblar los campos con los datos actuales de 'payment'
      setNombre(documento.nombre)
      setCategoria(documento.categoria)
      setTipo(documento.tipo)
      setProximaActualizacion(documento.proximaActualizacion)
      setFiles(documento.archivo)
    }
  }, [documento])

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

  // Cargar los datos del documento cuando se abre el modal
  useEffect(() => {
    if (documento && isOpen) {
      setDocumentoActualizado(documento)
      setProximaActualizacion(documento.proximaActualizacion !== '-' ? documento.proximaActualizacion : '')

      // Guardar el ID del documento si existe
      if ('id' in documento) {
        setDocumentoId(documento.id)
      }
    }
  }, [documento, isOpen])

  // Limpiar el estado cuando se cierra el diálogo
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setDocumentoActualizado(null)
        setProximaActualizacion('')
        setDocumentoId('')
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isOpen])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Liberar memoria de URLs anteriores que sean locales (blob:)
      files.forEach((file) => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      })

      // Reemplazar completamente los archivos existentes con los nuevos
      const newFiles = Array.from(e.target.files).map((file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
        const mimeType = fileExtension === 'pdf' ? 'application/pdf' : file.type

        return {
          nombre: file.name,
          tipo: mimeType,
          url: URL.createObjectURL(file),
          tamaño: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        }
      })

      setArchivoNuevo(newFiles)
    }
  }

  const removeFile = (index: number) => {
    // Liberar memoria del archivo eliminado si es local
    if (files[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(files[index].url)
    }

    // Actualizar la lista de archivos
    const updatedFiles = files.filter((_, i) => i !== index)

    setArchivoNuevo(updatedFiles)

    // Reiniciar el input si no hay archivos
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpdateDocumento = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      let archivosSubidos: Archivo[] = []

      // Obtener referencia al directorio de documentos en Firebase Storage
      const storageDirRef = ref(storage, 'documentos')

      // Si el documento original tiene archivos, buscarlos y eliminarlos antes de subir los nuevos
      if (documento?.archivo && documento.archivo.length > 0) {
        const existingFiles = await listAll(storageDirRef)

        for (const oldFile of documento.archivo) {
          const fileRef = existingFiles.items.find((item) => item.name === oldFile.nombre || item.name.startsWith(oldFile.nombre))

          if (fileRef) {
            try {
              const fileToDelete = ref(storage, `documentos/${fileRef.name}`)

              await deleteObject(fileToDelete)
            } catch (deleteError) {}
          }
        }
      }

      // Subir los nuevos archivos si existen
      if (archivoNuevo.length > 0) {
        const uploadPromises = archivoNuevo.map(async (file) => {
          // Si es un archivo local (blob URL), necesitamos subirlo
          if (file.url.startsWith('blob:')) {
            const response = await fetch(file.url)
            const blob = await response.blob()
            const fileData = new File([blob], file.nombre, { type: file.tipo })

            const storageRef = ref(storage, `documentos/${file.nombre}`)

            await uploadBytes(storageRef, fileData)

            const url = await getDownloadURL(storageRef)

            return { nombre: file.nombre, tipo: file.tipo, url, tamaño: file.tamaño }
          } else {
            // Si ya existe en Firebase, solo obtenemos su URL
            const existingFiles = await listAll(storageDirRef)
            const duplicateFile = existingFiles.items.find((item) => item.name === file.nombre)

            if (duplicateFile) {
              const url = await getDownloadURL(duplicateFile)

              return { nombre: file.nombre, tipo: file.tipo, url, tamaño: file.tamaño }
            } else {
              return file
            }
          }
        })

        archivosSubidos = await Promise.all(uploadPromises)
      }

      // Determinar el estado según el tipo de documento
      const estado = tipo === 'permanente' ? 'Permanente' : 'Vigente'
      const fechaActual = tipo === 'permanente' ? '-' : new Date().toISOString().split('T')[0]
      const proxActual = tipo === 'permanente' ? '-' : proximaActualizacion

      // Construir el objeto con los datos actualizados
      const documentoToUpdate: Documento = {
        id: documentoId,
        nombre,
        tipo,
        categoria,
        estado,
        fechaActualizacion: fechaActual,
        proximaActualizacion: proxActual,
        archivo: archivosSubidos
      }

      // Enviar los datos a la API
      const response = await fetch(`https://servidor-rasing.onrender.com/documentos/EditarDocumento/${documentoId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentoToUpdate)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el documento')
      }

      await Swal.fire({
        title: 'Actualizado',
        text: 'El documento se ha actualizado correctamente',
        icon: 'success',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      })
      onClose()
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el documento',
        icon: 'error',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void handleUpdateDocumento(e) // Usar void para ignorar el valor devuelto
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
            Actualizar Documento
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Actualice la fecha de próxima actualización y el archivo del documento si es necesario.</p>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="nombre">
                Nombre
              </Label>
              <div className="col-span-3">{nombre}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="tipo">
                Tipo
              </Label>
              <div className="col-span-3">{tipo}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="categoria">
                Categoría
              </Label>
              <div className="col-span-3">{categoria}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="fechaActualizacion">
                Fecha de actualización
              </Label>
              <Input readOnly className="col-span-3" id="fechaActualizacion" type="date" value={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="proximaActualizacion">
                Próxima actualización *
              </Label>
              <Input
                className="col-span-3"
                id="proximaActualizacion"
                type="date"
                value={proximaActualizacion}
                onChange={(e) => {
                  setProximaActualizacion(e.target.value)
                }}
              />
            </div>
            {files.length > 0 ? (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="pt-2 text-right">Archivo actual</Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    {getFileIcon(files[0].tipo)}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{files[0].nombre}</p>
                      <p className="text-xs text-muted-foreground">{files[0].tamaño}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-2 text-right">Nuevo archivo</Label>
              <div className="col-span-3">
                {!archivoNuevo.length ? (
                  <div className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Haga clic para seleccionar un archivo</p>
                    <p className="mt-1 text-xs text-muted-foreground">o arrastre y suelte aquí</p>
                    <input ref={fileInputRef} className="hidden" type="file" onChange={handleFileChange} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    {getFileIcon(archivoNuevo[0].tipo)}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{archivoNuevo[0].nombre}</p>
                      <p className="text-xs text-muted-foreground">{archivoNuevo[0].tamaño}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        removeFile(0)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {documentoActualizado ? (
          <div className="flex justify-end gap-2 border-t bg-muted/50 px-6 py-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button disabled={!proximaActualizacion} onClick={handleFormSubmit}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar Documento
            </Button>
          </div>
        ) : null}

        {/* Close button */}
        <button aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800" type="button" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
