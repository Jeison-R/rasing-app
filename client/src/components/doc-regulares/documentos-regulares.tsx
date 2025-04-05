'use client'

import type { Documento, Folder } from './interface'

import React from 'react'
import { useState, useEffect } from 'react'
import {
  Search,
  MoreHorizontal,
  FileText,
  RefreshCw,
  Clock,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  CirclePlus,
  FolderPlus,
  FolderIcon,
  ChevronRight,
  ChevronDown,
  ListIcon,
  LayoutGrid
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import { AgregarDocumento } from './agregar-documento'
import { VisualizarDocumento } from './visualizar-documento'
import { ActualizarDocumento } from './actualizar-documento'
import { EditarDocumento } from './editar-documento'
import { AgregarCarpeta } from './AgregarCarpeta'
import { getFileIcon } from './interface'
import { DeleteDocumentModal } from './borrar-documento'
import { DeleteFolderModal } from './borrar-carpeta'
import { SonnerProvider } from './sonner-provider'
import { EditarCarpeta } from './EditarCarpeta'

// Modify the determinarEstadoDocumento function to add a new state for documents about to expire
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

  // Calcular la diferencia en días
  const diferenciaDias = Math.ceil((proximaActualizacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

  // Si está a 10 días o menos de vencer
  if (diferenciaDias <= 10) {
    return 'Próximo a vencer'
  }

  return 'Vigente'
}

// Update the getEstadoBadge function to include the new state
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
    case 'Próximo a vencer':
      return (
        <Badge className="flex items-center gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100" variant="outline">
          <Clock className="h-3 w-3" />
          Próximo a vencer
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

// Modify the contarDocumentosPorActualizar function to only count documents that are specifically "Por actualizar"
const contarDocumentosPorActualizar = (folderId: string, documentos: Documento[], carpetas: Folder[]) => {
  const folder = carpetas.find((c) => c.id === folderId)

  if (!folder) return 0

  return documentos.filter((doc) => folder.documentos.includes(doc.id) && determinarEstadoDocumento(doc) === 'Por actualizar').length
}

// Add a new function to count only documents about to expire
const contarDocumentosProximosAVencer = (folderId: string, documentos: Documento[], carpetas: Folder[]) => {
  const folder = carpetas.find((c) => c.id === folderId)

  if (!folder) return 0

  return documentos.filter((doc) => folder.documentos.includes(doc.id) && determinarEstadoDocumento(doc) === 'Próximo a vencer').length
}

// Helper function to find folder ID by document ID
const findFolderIdByDocumentId = (documentId: string, carpetas: Folder[]): string | null => {
  for (const carpeta of carpetas) {
    if (carpeta.documentos.includes(documentId)) {
      return carpeta.id
    }
  }

  return null
}

export default function DocumentosRegulares() {
  const searchParams = useSearchParams()
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
  const [isModalOpenDeleteFolder, setIsModalOpenDeleteFolder] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('')
  const [isModalOpenDeleteDocument, setIsModalOpenDeleteDocument] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{ documentId: string; fullPath: string; folderId: string }>({
    documentId: '',
    fullPath: '',
    folderId: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    // Recuperar preferencia del localStorage o usar "list" como valor predeterminado
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('documentosRegularesViewMode')

      return savedViewMode === 'grid' || savedViewMode === 'list' ? savedViewMode : 'list'
    }

    return 'list'
  })
  const [selectedFolderForView, setSelectedFolderForView] = useState<string | null>(null)

  const obtenerDocumentos = async () => {
    try {
      const response = await fetch('https://servidor-rasing.onrender.com/documentos/ConsultarDocumentos', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Error al obtener documentos')
      }

      const data = (await response.json()) as Documento[]

      setDocumentos(data)

      return data
    } catch (error) {
      setDocumentos([])

      return []
    }
  }

  const obtenerCarpetas = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('https://servidor-rasing.onrender.com/carpetas/obtenerCarpetas', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Error al obtener carpetas')
      }

      const data = (await response.json()) as Folder[]

      setCarpetas(data)

      return data
    } catch (error) {
      setCarpetas([])

      return []
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchDataAndProcessParams = async () => {
      // Fetch data first
      const [docs, folders] = await Promise.all([obtenerDocumentos(), obtenerCarpetas()])

      // Check for URL parameters
      const documentId = searchParams.get('documentId')
      const action = searchParams.get('action')

      if (documentId) {
        // Find the document
        const document = docs.find((doc) => doc.id === documentId)

        if (document) {
          setSelectedPayment(document)

          // Find the folder that contains this document and expand it
          const folderId = findFolderIdByDocumentId(documentId, folders)

          if (folderId) {
            setExpandedFolders((prev) => ({
              ...prev,
              [folderId]: true
            }))
          }

          // Open the appropriate modal based on action
          if (action === 'actualizar' && document.tipo === 'periodico') {
            setIsModalOpenAct(true)
          } else if (action === 'ver') {
            setIsModalOpenView(true)
          }
        }
      }
    }

    void fetchDataAndProcessParams()
  }, [searchParams])

  // Función para contar documentos por actualizar en una carpeta

  const handleEliminarDocumento = (documentId: string, filePath: string, folderId: string) => {
    // Asegurar que filePath tenga la ruta completa
    const fullPath = `Doc Regulares/${filePath}`

    setSelectedDocument({ documentId, fullPath, folderId })
    setIsModalOpenDeleteDocument(true)
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

  const handleDeleteFolderSuccess = () => {
    void Promise.all([obtenerCarpetas(), obtenerDocumentos()]).then(() => {
      setTimeout(() => 0)
    })
  }

  const handleDeleteDocumentSuccess = () => {
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

  const handleCloseFolderModalDelete = () => {
    setIsModalOpenDeleteFolder(false)
  }

  const handleCloseDocumentModalDelete = () => {
    setIsModalOpenDeleteDocument(false)
  }

  const handleDeleteFolder = (folderId: string) => {
    setSelectedFolder(folderId)
    setIsModalOpenDeleteFolder(true)
  }

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }))
  }

  const handleViewFolder = (folderId: string) => {
    setSelectedFolderForView(folderId)
  }

  // Renderiza los documentos de una carpeta específica
  const renderFolderDocuments = (folderId: string) => {
    const folder = carpetas.find((c) => c.id === folderId)

    if (!folder) return null

    const folderDocuments = documentos.filter((doc) => folder.documentos.includes(doc.id)).sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordena alfabéticamente

    return (
      <div className="space-y-4">
        {folderDocuments.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No hay documentos en esta carpeta</div>
        ) : (
          folderDocuments.map((doc) => renderDocumentListItem(doc, folderId))
        )}
        <div className="flex justify-center pt-4">
          <Button
            className="flex items-center gap-2 rounded-full px-4 shadow-sm transition-all duration-200 hover:shadow-md"
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
    <div key={doc.id} className="flex overflow-hidden rounded-lg border transition-all duration-200 hover:border-primary/20 hover:shadow-md">
      <div className="flex w-16 items-center justify-center bg-muted/50 sm:w-20">{getFileIcon(doc.archivo[0].tipo)}</div>
      <div className="flex-1 p-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-medium">{doc.nombre}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge className="font-normal shadow-sm" variant="outline">
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
                    className="rounded-full hover:bg-primary/10"
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
                  <Button
                    className="rounded-full hover:bg-primary/10"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (doc.archivo[0].url) {
                        const url = doc.archivo[0].url
                        const nombreArchivo = doc.archivo[0].nombre

                        // Si es PDF, abrir en una nueva pestaña
                        if (nombreArchivo.toLowerCase().endsWith('.pdf')) {
                          window.open(url, '_blank')
                        } else {
                          // Si es otro tipo de archivo, descargarlo
                          const link = document.createElement('a')

                          link.href = url
                          link.download = nombreArchivo
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      } else {
                      }
                    }}
                  >
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
                <Button className="rounded-full hover:bg-primary/10" size="icon" variant="ghost">
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
                    handleEliminarDocumento(doc.id, doc.archivo[0].nombre, folderId || '')
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

  const changeViewMode = (mode: 'list' | 'grid') => {
    setViewMode(mode)

    if (typeof window !== 'undefined') {
      localStorage.setItem('documentosRegularesViewMode', mode)
    }
  }

  const showToast = () => {
    toast.success('Eliminado', {
      description: 'La experiencia ha sido eliminada junto con sus archivos asociados.',
      position: 'top-center'
    })
  }

  return (
    <>
      <SonnerProvider />
      <div className="container mx-auto py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Documentos Regulares</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="rounded-md border-muted-foreground/20 pl-9 pr-4"
                placeholder="Buscar por nombre de carpeta..."
                type="search"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value)
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  className="px-4"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => {
                    changeViewMode('list')
                  }}
                >
                  <ListIcon className="mr-2 h-4 w-4" />
                  Lista
                </Button>
                <Button
                  className="px-4"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => {
                    changeViewMode('grid')
                  }}
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Cuadrícula
                </Button>
              </div>
              <Button className="flex items-center gap-2 px-4" onClick={handleOpenFolderModal}>
                <FolderPlus className="h-4 w-4" />
                <span>Nueva carpeta</span>
              </Button>
              <Button className="flex items-center gap-2 px-4" onClick={showToast}>
                <FolderPlus className="h-4 w-4" />
                <span>prueba</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'space-y-4'}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex h-32 flex-col justify-between rounded-lg border p-4">
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 animate-pulse rounded-lg bg-muted" />
                  <div className="flex-1">
                    <div className="mb-2 h-5 w-2/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : carpetas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <FolderIcon className="mb-4 h-12 w-12 text-muted-foreground dark:text-black" />
            <h3 className="mb-2 text-lg font-medium">No hay carpetas</h3>
            <p className="mb-4 text-sm text-muted-foreground">Crea una carpeta para organizar tus documentos</p>
            <Button onClick={handleOpenFolderModal}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Nueva carpeta
            </Button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {carpetas
                  .filter((carpeta) => carpeta.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((carpeta) => {
                    const porActualizar = contarDocumentosPorActualizar(carpeta.id, documentos, carpetas)
                    const proximosVencer = contarDocumentosProximosAVencer(carpeta.id, documentos, carpetas)

                    return (
                      <div
                        key={carpeta.id}
                        className="relative cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-sm"
                        onClick={() => {
                          if (selectedFolderForView === carpeta.id) {
                            setSelectedFolderForView(null)
                          } else {
                            handleViewFolder(carpeta.id)
                          }
                        }}
                      >
                        <div className="mb-2 flex items-start">
                          <div className={`mr-3 flex h-12 w-12 items-center justify-center rounded-lg ${carpeta.color || 'bg-amber-100'}`}>
                            <FolderIcon className="h-6 w-6 dark:text-black" />
                          </div>
                          <div className="flex-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <h3 className="max-w-[calc(100%-30px)] cursor-default truncate text-sm font-medium">{carpeta.nombre}</h3>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{carpeta.nombre}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="mt-1 flex items-center gap-1">
                              <Badge className="text-xs" variant="outline">
                                {carpeta.documentos.length} documento{carpeta.documentos.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation()
                              }}
                            >
                              <Button className="absolute right-2 top-2 h-8 w-8" size="icon" variant="ghost">
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
                                  handleDeleteFolder(carpeta.id)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {porActualizar > 0 && (
                          <div className="mt-2 flex items-center">
                            <Badge className="bg-red-50 text-xs text-red-700" variant="outline">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {porActualizar} por actualizar
                            </Badge>
                          </div>
                        )}

                        {proximosVencer > 0 && (
                          <div className="mt-2 flex items-center">
                            <Badge className="bg-amber-50 text-xs text-amber-700" variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              {proximosVencer} próximos a vencer
                            </Badge>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="space-y-4">
                {carpetas
                  .filter((carpeta) => carpeta.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((carpeta) => (
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
                          <div className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg ${carpeta.color || 'bg-amber-100'}`}>
                            <FolderIcon className="h-5 w-5 dark:text-black" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{carpeta.nombre}</h3>
                            {carpeta.descripcion ? <p className="text-sm text-muted-foreground">{carpeta.descripcion}</p> : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {carpeta.documentos.length} documento{carpeta.documentos.length !== 1 ? 's' : ''}
                          </Badge>
                          {contarDocumentosPorActualizar(carpeta.id, documentos, carpetas) > 0 && (
                            <Badge className="bg-red-50 text-red-700" variant="outline">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {contarDocumentosPorActualizar(carpeta.id, documentos, carpetas)} por actualizar
                            </Badge>
                          )}
                          {contarDocumentosProximosAVencer(carpeta.id, documentos, carpetas) > 0 && (
                            <Badge className="bg-amber-50 text-amber-700" variant="outline">
                              <Clock className="mr-1 h-3 w-3" />
                              {contarDocumentosProximosAVencer(carpeta.id, documentos, carpetas)} próximos a vencer
                            </Badge>
                          )}
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
                                  handleDeleteFolder(carpeta.id)
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
                  ))}
              </div>
            )}

            {/* Vista de documentos cuando se selecciona una carpeta en modo cuadrícula */}
            {viewMode === 'grid' && selectedFolderForView ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-white dark:bg-[hsl(20,14.3%,4.1%)]">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4 dark:bg-[hsl(20,14.3%,4.1%)]">
                    <h2 className="text-xl font-semibold">{carpetas.find((c) => c.id === selectedFolderForView)?.nombre || 'Documentos'}</h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedFolderForView(null)
                      }}
                    >
                      <svg
                        className="lucide lucide-x"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </div>
                  <div className="p-6">{renderFolderDocuments(selectedFolderForView)}</div>
                </div>
              </div>
            ) : null}
          </>
        )}

        <AgregarDocumento isOpen={isModalOpen} selectedFolderId={selectedFolderId} onClose={handleCloseModal} onDocumentoAdded={handleDocumentoAdded} />
        <VisualizarDocumento documento={selectedPayment} isOpen={isModalOpenView} onClose={handleCloseModalView} />
        <ActualizarDocumento documento={selectedPayment} isOpen={isModalOpenAct} onClose={handleCloseModalAct} onDocumentoAct={handleDocumentoAct} />
        <EditarDocumento documento={selectedPayment} isOpen={isModalOpenEdit} onClose={handleCloseModalEdit} onDocumentoEdit={handleDocumentoEdit} />
        <AgregarCarpeta isOpen={isFolderModalOpen} onClose={handleCloseFolderModal} onFolderAdded={handleFolderAdded} />
        <EditarCarpeta folder={editingFolder} isOpen={isFolderModalEdit} onClose={handleCloseFolderModalEdit} onFolderUpdated={handleCarpetaEdit} />
        <DeleteFolderModal folderId={selectedFolder} isOpen={isModalOpenDeleteFolder} onClose={handleCloseFolderModalDelete} onDeleteSuccess={handleDeleteFolderSuccess} />
        <DeleteDocumentModal
          documentId={selectedDocument.documentId}
          filePath={selectedDocument.fullPath}
          folderId={selectedDocument.folderId}
          isOpen={isModalOpenDeleteDocument}
          onClose={handleCloseDocumentModalDelete}
          onDeleteSuccess={handleDeleteDocumentSuccess}
        />
      </div>
    </>
  )
}
