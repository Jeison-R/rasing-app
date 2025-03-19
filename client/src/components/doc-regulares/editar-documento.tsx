'use client'

import type { Documento, Archivo } from './interface'

import React from 'react'
import { useState, useRef, type ChangeEvent, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { storage } from '../../firebase/firebase'

import { getFileIcon } from './interface'

interface EditarDocumentoProps {
  onClose: () => void
  isOpen: boolean
  documento: Documento | null
  onDocumentoEdit: () => void
}

export function EditarDocumento({ onClose, isOpen, documento, onDocumentoEdit }: EditarDocumentoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [animationState, setAnimationState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [files, setFiles] = useState<Archivo[]>([])
  const [nombre, setNombre] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')
  const [categoria, setCategoria] = useState<string>('')
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('')
  const [proximaActualizacion, setProximaActualizacion] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [documentoId, setDocumentoId] = useState<string>('')

  // useEffect(() => {
  //   if (documento) {
  //     // Poblar los campos con los datos actuales de 'payment'
  //     setNombre(documento.nombre)
  //     setCategoria(documento.categoria)
  //     setUltimaActualizacion(documento.fechaActualizacion)
  //     setTipo(documento.tipo)
  //     setProximaActualizacion(documento.proximaActualizacion)
  //     setFiles(documento.archivo)
  //   }
  // }, [documento])

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
      setNombre(documento.nombre || '')
      setTipo(documento.tipo || '')
      setCategoria(documento.categoria || '')
      setUltimaActualizacion(documento.fechaActualizacion !== '-' ? documento.fechaActualizacion : '')
      setProximaActualizacion(documento.proximaActualizacion !== '-' ? documento.proximaActualizacion : '')

      // Si el documento tiene archivos, cargarlos
      if (documento.archivo.length > 0) {
        setFiles(documento.archivo)
      }

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
        setNombre('')
        setTipo('')
        setCategoria('')
        setUltimaActualizacion('')
        setProximaActualizacion('')
        setErrors({})
        setDocumentoId('')
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isOpen])

  const handleUpdateDocumento = async (event: React.FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      let documentosSubidos: Archivo[] = []

      // Obtener referencia al directorio de documentos
      const storageDirRef = ref(storage, 'documentos')

      // Si el documento original tiene archivos, buscarlos para eliminarlos
      if (documento?.archivo && documento.archivo.length > 0) {
        const existingFiles = await listAll(storageDirRef)

        // Buscar y eliminar los archivos antiguos asociados con este documento
        for (const oldFile of documento.archivo) {
          const fileRef = existingFiles.items.find((item) => item.name === oldFile.nombre || item.name.startsWith(oldFile.nombre))

          if (fileRef) {
            try {
              // Crear una referencia directa al archivo para eliminarlo
              const fileToDelete = ref(storage, `documentos/${fileRef.name}`)

              await deleteObject(fileToDelete)
            } catch (deleteError) {}
          }
        }
      }

      // Subir los nuevos archivos
      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          // Si es un archivo local (blob URL), necesitamos subirlo
          if (file.url.startsWith('blob:')) {
            // Convertir un `Archivo` a `Blob`
            const response = await fetch(file.url)
            const blob = await response.blob()
            const fileData = new File([blob], file.nombre, { type: file.tipo })

            // Crear referencia para el nuevo archivo
            const storageRef = ref(storage, `documentos/${file.nombre}`)

            // Subir el archivo
            await uploadBytes(storageRef, fileData)

            // Obtener la URL del archivo subido
            const url = await getDownloadURL(storageRef)

            return { nombre: file.nombre, tipo: file.tipo, url, tamaño: file.tamaño }
          } else {
            // Si no es un blob URL, podría ser un archivo que ya está en Firebase
            // pero lo trataremos como nuevo para asegurar consistencia
            const existingFiles = await listAll(storageDirRef)
            const duplicateFile = existingFiles.items.find((item) => item.name === file.nombre)

            if (duplicateFile) {
              const url = await getDownloadURL(duplicateFile)

              return { nombre: file.nombre, tipo: file.tipo, url, tamaño: file.tamaño }
            } else {
              // Si por alguna razón no encontramos el archivo, mantenemos la URL original
              return file
            }
          }
        })

        documentosSubidos = await Promise.all(uploadPromises)
      }

      // Definir campos derivados según el tipo
      const estado = tipo === 'permanente' ? 'Permanente' : 'Vigente'
      const fechaActual = tipo === 'permanente' ? '-' : ultimaActualizacion
      const proxActual = tipo === 'permanente' ? '-' : proximaActualizacion

      // Construir el objeto con los datos y archivos subidos
      const documentoToUpdate: Documento = {
        id: documentoId,
        nombre,
        tipo,
        categoria,
        estado,
        fechaActualizacion: fechaActual,
        proximaActualizacion: proxActual,
        archivo: documentosSubidos
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

      toast.success('Editado', { description: 'El documento se ha editado correctamente', position: 'bottom-right' })
      onDocumentoEdit()
      onClose()
    } catch (error) {
      toast.error('Error', { description: 'Hubo un problema al editar el documento', position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    void handleUpdateDocumento(e) // Usar void para ignorar el valor devuelto
  }

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'nombre':
        setNombre(value)
        break
      case 'tipo':
        setTipo(value)
        break
      case 'categoria':
        setCategoria(value)
        break
      case 'ultimaActualizacion':
        setUltimaActualizacion(value)
        break
      case 'proximaActualizacion':
        setProximaActualizacion(value)
        break
      default:
        break
    }

    // Eliminar el error cuando el usuario comienza a escribir
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
  }

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

      setFiles(newFiles)
    }
  }

  const removeFile = (index: number) => {
    // Liberar memoria del archivo eliminado si es local
    if (files[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(files[index].url)
    }

    // Actualizar la lista de archivos
    const updatedFiles = files.filter((_, i) => i !== index)

    setFiles(updatedFiles)

    // Reiniciar el input si no hay archivos
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
            Editar Documento
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Edite todos los campos del documento según sea necesario.</p>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="nombre">
                Nombre *
              </Label>
              <Input
                className="col-span-3"
                id="nombre"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleFieldChange('nombre', e.target.value)
                }}
              />
              {errors.nombre ? <span className="text-red-500">Campo requerido</span> : null}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="tipo">
                Tipo *
              </Label>
              <Select
                value={tipo}
                onValueChange={(value: 'periodico' | 'permanente') => {
                  handleFieldChange('tipo', value)
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="periodico">Periódico</SelectItem>
                  <SelectItem value="permanente">Permanente</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo ? <span className="text-red-500">Campo requerido</span> : null}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="categoria">
                Categoría *
              </Label>
              <Select
                value={categoria}
                onValueChange={(value: 'Legal' | 'Seguridad' | 'Operativo' | 'Técnico' | 'Administrativo') => {
                  handleFieldChange('categoria', value)
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Seguridad">Seguridad</SelectItem>
                  <SelectItem value="Operativo">Operativo</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                  <SelectItem value="Administrativo">Administrativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoria ? <span className="text-red-500">Campo requerido</span> : null}
            </div>
            {tipo === 'periodico' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="ultimaActualizacion">
                    Última actualización
                  </Label>
                  <Input
                    className="col-span-3"
                    id="ultimaActualizacion"
                    type="date"
                    value={ultimaActualizacion}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleFieldChange('ultimaActualizacion', e.target.value)
                    }}
                  />
                  {errors.ultimaActualizacion ? <span className="text-red-500">Campo requerido</span> : null}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleFieldChange('proximaActualizacion', e.target.value)
                    }}
                  />
                  {errors.proximaActualizacion ? <span className="text-red-500">Campo requerido</span> : null}
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="pt-2 text-right">Archivo *</Label>
              <div className="col-span-3">
                {files.length === 0 ? (
                  <div className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Haga clic para seleccionar un archivo</p>
                    <p className="mt-1 text-xs text-muted-foreground">o arrastre y suelte aquí</p>
                    <input ref={fileInputRef} className="hidden" type="file" onChange={handleFileChange} />
                  </div>
                ) : (
                  files[0] && (
                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      {getFileIcon(files[0].tipo)}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{files[0].nombre}</p>
                        <p className="text-xs text-muted-foreground">{files[0].tamaño}</p>
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
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t bg-muted/50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!nombre || !categoria || (tipo === 'periodico' && !proximaActualizacion) || files.length === 0} type="submit" onClick={handleFormSubmit}>
            Guardar Cambios
          </Button>
        </div>

        {/* Close button */}
        <button aria-label="Cerrar" className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800" type="button" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
