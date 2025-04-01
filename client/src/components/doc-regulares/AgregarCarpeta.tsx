'use client'

import type { Folder as FolderType } from './interface'

import React, { useState } from 'react'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const FOLDER_COLORS = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-orange-100']

interface AgregarCarpetaProps {
  isOpen: boolean
  onClose: () => void
  onFolderAdded: (folder: FolderType) => void
}

export function AgregarCarpeta({ isOpen, onClose, onFolderAdded }: AgregarCarpetaProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const folderData = {
        id: crypto.randomUUID(),
        nombre,
        descripcion,
        documentos: [],
        color: selectedColor,
        createdAt: new Date().toISOString()
      }

      const response = await fetch('https://servidor-rasing.onrender.com/carpetas/agregarCarpeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(folderData)
      })

      if (!response.ok) {
        throw new Error('Error al crear la carpeta')
      }

      onFolderAdded(folderData)
      toast.success('Carpeta creada', { description: 'La carpeta ha sido creada correctamente', position: 'bottom-right' })

      onClose()
      setNombre('')
      setDescripcion('')
      setSelectedColor(FOLDER_COLORS[0])
    } catch (error) {
      toast.error('Error', { description: 'Ha ocurrido un error al crear la carpeta', position: 'bottom-right' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNombre('')
    setDescripcion('')
    setSelectedColor('')

    onClose()
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void handleSubmit(e) // Usar void para ignorar el valor devuelto
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nueva carpeta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la carpeta</Label>
              <Input
                required
                id="nombre"
                placeholder="Ej: Documentos financieros"
                value={nombre}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNombre(e.target.value)
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción breve de la carpeta"
                rows={3}
                value={descripcion}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDescripcion(e.target.value)
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color de la carpeta</Label>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button disabled={isLoading} type="submit">
              {isLoading ? 'Guardando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
