'use client'

import type { Documento, Folder } from './interface'

import React from 'react'
import { useState, useEffect } from 'react'
import { Search, MoreHorizontal, FileText, RefreshCw, Clock, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle, CirclePlus, FolderPlus, FolderIcon, ChevronRight, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import { CustomTooltip } from '../commons/tooltip'

import { AgregarDocumento } from './agregar-documento'
import { VisualizarDocumento } from './visualizar-documento'
import { ActualizarDocumento } from './actualizar-documento'
import { EditarDocumento } from './editar-documento'
import { AgregarCarpeta } from './AgregarCarpeta'
import { getFileIcon } from './interface'
import { deleteDocument } from './borrar-documento'
import { deleteFolder } from './borrar-carpeta'
import { SonnerProvider } from './sonner-provider'
import { EditarCarpeta } from './EditarCarpeta'

// Función para determinar el estado del documento comparando fechas
const determinarEstadoDocumento = (documento: Documento) => {
  if (documento.tipo === 'permanente') {
    return 'Permanente'
  }

  // Para documentos periódicos, comparamos con la fecha actual
  const hoy = new Date()
  const proximaActualizacion = documento.proximaActualizacion ? new Date(documento.proximaActualizacion) : null

  // Si no hay fecha de próxima actualización o ya pasó la fecha
  if (!proximaActualizacion || hoy > proximaActualizacion) {
    return 'Por actualizar'
  }

  return 'Vigente'
}

export default function DocumentosRegulares() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false)
  const [isModalOpenAct, setIsModalOpenAct] = useState(false)
  const [isModalOpenView, setIsModalOpenView] = useState(false)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false)
  const [isFolderModalEdit, setIsFolderModalEdit] = useState(false)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [carpetas, setCarpetas] = useState<Folder[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Documento | null>(null)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})

  const obtenerDocumentos = async () => {
    try {
      const response = await fetch('http://localhost:3000/documentos/ConsultarDocumentos', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Error al obtener documentos')
      }

      const data = (await response.json()) as Documento[]

      setDocumentos(data)
    } catch (error) {
      setDocumentos([])
    }
  }

  const obtenerCarpetas = async () => {
    try {
      const response = await fetch('http://localhost:3000/carpetas/obtenerCarpetas', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Error al obtener carpetas')
      }

      const data = (await response.json()) as Folder[]

      setCarpetas(data)
    } catch (error) {
      setCarpetas([])
    }
  }

  useEffect(() => {
    void obtenerDocumentos()
    void obtenerCarpetas()
  }, [])

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Vigente':
        return (
          <Badge className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
            <CheckCircle className="h-3 w-3" />
            Vigente
          </Badge>
        )
      case 'Por actualizar':
        return (
          <Badge className="flex items-center gap-1 bg-red-100 text-red-800 hover:bg-red-100" variant="outline">
            <AlertCircle className="h-3 w-3" />
            Por actualizar
          </Badge>
        )
      case 'Permanente':
        return (
          <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100" variant="outline">
            <FileText className="h-3 w-3" />
            Permanente
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  // Función para contar documentos por actualizar en una carpeta
  const contarDocumentosPorActualizar = (folderId: string) => {
    const folder = carpetas.find((c) => c.id === folderId)

    if (!folder) return 0

    return documentos.filter((doc) => folder.documentos.includes(doc.id) && determinarEstadoDocumento(doc) === 'Por actualizar').length
  }

  const handleEliminarDocumento = async (id: string, filePath: string, folderId: string) => {
    // Asegurar que filePath tenga la ruta completa
    const fullPath = `documentos/${filePath}`

    const eliminado = await deleteDocument(id, fullPath, folderId)

    if (eliminado) {
      setDocumentos((prevDocumentos) => prevDocumentos.filter((doc) => doc.id !== id))

      // También eliminamos el documento de cualquier carpeta que lo contenga
      setCarpetas((prevCarpetas) =>
        prevCarpetas.map((carpeta) => ({
          ...carpeta,
          documentos: carpeta.documentos.filter((docId) => docId !== id)
        }))
      )
    }
  }

  const handleOpenModal = (folderId: string) => {
    setSelectedFolderId(folderId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedFolderId(null)
  }

  const handleOpenModalEdit = (payment: Documento) => {
    setSelectedPayment(payment)
    setIsModalOpenEdit(true)
  }

  const handleCloseModalEdit = () => {
    setIsModalOpenEdit(false)
  }

  const handleOpenModalAct = (payment: Documento) => {
    setSelectedPayment(payment)
    setIsModalOpenAct(true)
  }

  const handleCloseModalAct = () => {
    setIsModalOpenAct(false)
  }

  const handleOpenModalView = (payment: Documento) => {
    setSelectedPayment(payment)
    setIsModalOpenView(true)
  }

  const handleCloseModalView = () => {
    setIsModalOpenView(false)
  }

  const handleDocumentoAdded = () => {
    void Promise.all([obtenerCarpetas(), obtenerDocumentos()]).then(() => {
      setTimeout(() => 0)
    })
  }

  const handleDocumentoEdit = () => {
    void Promise.all([obtenerCarpetas(), obtenerDocumentos()]).then(() => {
      setTimeout(() => 0)
    })
  }

  const handleDocumentoAct = () => {
    void Promise.all([obtenerCarpetas(), obtenerDocumentos()]).then(() => {
      setTimeout(() => 0)
    })
  }

  const handleCarpetaEdit = () => {
    void Promise.all([obtenerCarpetas(), obtenerDocumentos()]).then(() => {
      setTimeout(() => 0)
    })
  }

  const handleOpenFolderModal = () => {
    setEditingFolder(null)
    setIsFolderModalOpen(true)
  }

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder)
    setIsFolderModalEdit(true)
  }

  const handleCloseFolderModal = () => {
    setIsFolderModalOpen(false)
    setEditingFolder(null)
  }

  const handleCloseFolderModalEdit = () => {
    setIsFolderModalEdit(false)
    setEditingFolder(null)
  }

  const handleFolderAdded = (folder: Folder) => {
    if (editingFolder) {
      setCarpetas((prevCarpetas) => prevCarpetas.map((c) => (c.id === folder.id ? folder : c)))
    } else {
      setCarpetas((prevCarpetas) => [...prevCarpetas, folder])
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    const eliminado = await deleteFolder(folderId)

    if (eliminado) {
      // Eliminar la carpeta del estado
      setCarpetas((prevCarpetas) => prevCarpetas.filter((carpeta) => carpeta.id !== folderId))
    }
  }

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  // Renderiza los documentos de una carpeta específica
  const renderFolderDocuments = (folderId: string) => {
    const folder = carpetas.find((c) => c.id === folderId)

    if (!folder) return null

    const folderDocuments = documentos.filter((doc) => folder.documentos.includes(doc.id))

    return (
      <div className="space-y-4">
        {folderDocuments.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No hay documentos en esta carpeta</div>
        ) : (
          folderDocuments.map((doc) => renderDocumentListItem(doc, folderId))
        )}
        <div className="flex justify-center pt-2">
          <Button
            className="flex items-center gap-2"
            variant="outline"
            onClick={() => {
              handleOpenModal(folderId)
            }}
          >
            <CirclePlus className="h-4 w-4" />
            Añadir documento
          </Button>
        </div>
      </div>
    )
  }

  // Renderiza un elemento de lista de documento con opciones de carpeta
  const renderDocumentListItem = (doc: Documento, folderId?: string) => (
    <div key={doc.id} className="flex overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
      <div className="flex w-16 items-center justify-center bg-muted sm:w-20">{getFileIcon(doc.archivo[0].tipo)}</div>
      <div className="flex-1 p-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-medium">{doc.nombre}</h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge className="font-normal" variant="outline">
                {doc.categoria}
              </Badge>
              {getEstadoBadge(determinarEstadoDocumento(doc))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      handleOpenModalView(doc)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver documento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Descargar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    handleOpenModalEdit(doc)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                {doc.tipo === 'periodico' && (
                  <DropdownMenuItem
                    onClick={() => {
                      handleOpenModalAct(doc)
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualizar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    void handleEliminarDocumento(doc.id, doc.archivo[0].nombre, folderId || '')
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
            {doc.tipo === 'periodico' && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Próxima actualización: {doc.proximaActualizacion}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>
                {doc.archivo[0].nombre} ({doc.archivo[0].tamaño})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <SonnerProvider />
      <div className="container mx-auto py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative mr-2 flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar documentos por nombre, categoría o descripción..."
              type="search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e.target.value)
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <CustomTooltip content="Añadir carpeta">
              <Button className="flex items-center gap-2 px-4" type="button" variant="outline" onClick={handleOpenFolderModal}>
                <FolderPlus className="h-5 w-5" />
                <span>Nueva carpeta</span>
              </Button>
            </CustomTooltip>
          </div>
        </div>

        <div className="space-y-4">
          {carpetas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <FolderIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No hay carpetas</h3>
              <p className="mb-4 text-sm text-muted-foreground">Crea una carpeta para organizar tus documentos</p>
              <Button onClick={handleOpenFolderModal}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Nueva carpeta
              </Button>
            </div>
          ) : (
            carpetas.map((carpeta) => (
              <Collapsible
                key={carpeta.id}
                className="rounded-lg border"
                open={expandedFolders[carpeta.id]}
                onOpenChange={() => {
                  toggleFolderExpand(carpeta.id)
                }}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50">
                  <div className="flex items-center">
                    <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg ${carpeta.color}`}>
                      <FolderIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{carpeta.nombre}</h3>
                      {carpeta.descripcion ? <p className="text-sm text-muted-foreground">{carpeta.descripcion}</p> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {carpeta.documentos.length} documento{carpeta.documentos.length !== 1 ? 's' : ''}
                      </Badge>
                      {contarDocumentosPorActualizar(carpeta.id) > 0 && (
                        <Badge className="bg-red-50 text-red-700" variant="outline">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          {contarDocumentosPorActualizar(carpeta.id)} por actualizar
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                        }}
                      >
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleOpenModal(carpeta.id)
                          }}
                        >
                          <CirclePlus className="mr-2 h-4 w-4" />
                          Añadir documento
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditFolder(carpeta)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            void handleDeleteFolder(carpeta.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {expandedFolders[carpeta.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t p-4">{renderFolderDocuments(carpeta.id)}</CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>

        <AgregarDocumento isOpen={isModalOpen} selectedFolderId={selectedFolderId} onClose={handleCloseModal} onDocumentoAdded={handleDocumentoAdded} />
        <VisualizarDocumento documento={selectedPayment} isOpen={isModalOpenView} onClose={handleCloseModalView} />
        <ActualizarDocumento documento={selectedPayment} isOpen={isModalOpenAct} onClose={handleCloseModalAct} onDocumentoAct={handleDocumentoAct} />
        <EditarDocumento documento={selectedPayment} isOpen={isModalOpenEdit} onClose={handleCloseModalEdit} onDocumentoEdit={handleDocumentoEdit} />
        <AgregarCarpeta isOpen={isFolderModalOpen} onClose={handleCloseFolderModal} onFolderAdded={handleFolderAdded} />
        <EditarCarpeta folder={editingFolder} isOpen={isFolderModalEdit} onClose={handleCloseFolderModalEdit} onFolderUpdated={handleCarpetaEdit} />
      </div>
    </>
  )
}
