'use client'

import type { Documento, Archivo, Folder } from './interface'

import React from 'react'
import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, X } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { storage } from '../../firebase/firebase'

import { getFileIcon } from './interface'

interface AgregarDocumentoProps {
  onClose: () => void
  isOpen: boolean
  onDocumentoAdded: () => void
  selectedFolderId?: string | null
}

export function AgregarDocumento({ onClose, isOpen, onDocumentoAdded, selectedFolderId }: AgregarDocumentoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<Archivo[]>([])
  const [nombre, setNombre] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')
  const [categoria, setCategoria] = useState<string>('')
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('')
  const [proximaActualizacion, setProximaActualizacion] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleAddDocumento = async (event: React.FormEvent) => {
    event.preventDefault()

    setIsLoading(true)

    try {
      // 1️⃣ Subimos los archivos a Firebase Storage
      const storageDirRef = ref(storage, 'Doc Regulares')
      const existingFiles = await listAll(storageDirRef)

      const uploadPromises = files.map(async (file) => {
        const duplicateFile = existingFiles.items.find((item) => item.name.startsWith(file.nombre))

        if (duplicateFile) {
          const existingUrl = await getDownloadURL(duplicateFile)

          return { nombre: file.nombre, tipo: file.tipo, url: existingUrl, tamaño: file.tamaño }
        } else {
          // Convertir un `Archivo` a `Blob`
          const response = await fetch(file.url)
          const blob = await response.blob()
          const fileData = new File([blob], file.nombre, { type: file.tipo })

          const storageRef = ref(storage, `Doc Regulares/${file.nombre}`)

          await uploadBytes(storageRef, fileData)

          const url = await getDownloadURL(storageRef)

          return { nombre: file.nombre, tipo: file.tipo, url, tamaño: file.tamaño }
        }
      })

      const documentosSubidos = await Promise.all(uploadPromises)

      // 2️⃣ Definir campos derivados según el tipo
      const estado = tipo === 'permanente' ? 'Permanente' : 'Vigente'
      const fechaActual = tipo === 'permanente' ? '-' : ultimaActualizacion
      const proxActual = tipo === 'permanente' ? '-' : proximaActualizacion

      const documentoId = uuidv4()
      // 3️⃣ Construir el objeto con los datos y archivos subidos
      const documentoToAdd: Documento = {
        id: documentoId,
        nombre,
        tipo,
        categoria,
        estado,
        fechaActualizacion: fechaActual,
        proximaActualizacion: proxActual,
        archivo: documentosSubidos
      }

      // 4️⃣ Enviar los datos a la API
      const response = await fetch('https://servidor-vercel-bice.vercel.app/documentos/agregarDocumento', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentoToAdd)
      })

      if (!response.ok) {
        throw new Error('Error al agregar el documento')
      }

      if (selectedFolderId) {
        try {
          // Obtener la carpeta actual para extraer los documentos existentes
          const folderResponse = await fetch(`https://servidor-vercel-bice.vercel.app/carpetas/obtenerCarpetaPorId/${selectedFolderId}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          })

          if (!folderResponse.ok) {
            throw new Error('Error al obtener la carpeta')
          }

          const folderData = (await folderResponse.json()) as Folder

          // Asegurar que "documentos" sea un array
          const documentosActuales = Array.isArray(folderData.documentos) ? folderData.documentos : []

          // Agregar el nuevo documento
          const documentosActualizados = [...documentosActuales, documentoId]

          // Enviar la actualización con el array completo
          const updateFolderResponse = await fetch(`https://servidor-vercel-bice.vercel.app/carpetas/editarCarpeta/${selectedFolderId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              documentos: documentosActualizados
            })
          })

          if (!updateFolderResponse.ok) {
            throw new Error('Error al actualizar la carpeta con el nuevo documento')
          }
        } catch (error) {}
      }

      toast.success('Documento guardado', { description: 'El documento se ha guardado correctamente', position: 'bottom-right' })
      onDocumentoAdded()
      handleClose()
    } catch (error) {
      global.console.error('Error al agregar el documento:', error)
      toast.error('Error', { description: 'Hubo un problema al agregar el documento', position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void handleAddDocumento(e) // Usar void para ignorar el valor devuelto
  }

  const handleFieldChange = (field: string, value: string | number | { id: string; nombre: string }) => {
    switch (field) {
      case 'nombre':
        setNombre(value as string)
        break
      case 'tipo':
        setTipo(value as string)
        break
      case 'categoria':
        setCategoria(value as string)
        break
      case 'ultimaActualizacion':
        setUltimaActualizacion(value as string)
        break
      case 'proximaActualizacion':
        setProximaActualizacion(value as string)
        break
      default:
        break
    }

    // Eliminar el error cuando el usuario comienza a escribir
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
  }

  const handleClose = () => {
    setNombre('')
    setTipo('')
    setCategoria('')
    setUltimaActualizacion('')
    setProximaActualizacion('')
    setFiles([])
    setErrors({})

    onClose()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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

      // Liberar memoria de URLs anteriores
      files.forEach((file) => {
        URL.revokeObjectURL(file.url)
      })

      setFiles(newFiles)
    }
  }

  const removeFile = (index: number) => {
    // Liberar memoria del archivo eliminado
    URL.revokeObjectURL(files[index].url)

    // Actualizar la lista de archivos
    const updatedFiles = files.filter((_, i) => i !== index)

    setFiles(updatedFiles)

    // Reiniciar el input si no hay archivos
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Documento</h3>
          <Button size="icon" variant="ghost" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {isLoading ? (
          <div className="z-60 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <LoadingSpinner />
          </div>
        ) : null}
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
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
                onValueChange={(value: 'Periódico' | 'Permanente') => {
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
                </div>
                {errors.proximaActualizacion ? <span className="text-red-500">Campo requerido</span> : null}
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
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button disabled={!nombre || !categoria || (tipo === 'periodico' && !proximaActualizacion) || !files.length} type="submit" variant="default">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
