'use client'

import type { Documento } from './interface'

import { useState } from 'react'
import { Search, MoreHorizontal, FileText, RefreshCw, Clock, Calendar, Download, Eye, Edit, Trash2, CheckCircle, AlertCircle, Grid, List, CirclePlus } from 'lucide-react'
import { useEffect } from 'react'

import { CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CustomTooltip } from '../commons/tooltip'

import { AgregarDocumento } from './agregar-documento'
import { VisualizarDocumento } from './visualizar-documento'
import { ActualizarDocumento } from './actualizar-documento'
import { EditarDocumento } from './editar-documento'
import { getFileIcon } from './interface'
import { deleteDocument } from './borrar-documento'

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
  const [viewMode, setViewMode] = useState('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false)
  const [isModalOpenAct, setIsModalOpenAct] = useState(false)
  const [isModalOpenView, setIsModalOpenView] = useState(false)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Documento | null>(null)

  const obtenerDocumentos = async () => {
    const response = await fetch('https://servidor-rasing.onrender.com/documentos/ConsultarDocumentos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener los documentos de soporte')
    }

    const data = (await response.json()) as Documento[] | null

    if (data) {
      setDocumentos(data)
    } else {
      setDocumentos([])
    } // Guardar los datos en el estado
  }

  useEffect(() => {
    void obtenerDocumentos()
  }, [])

  const filteredDocumentos = documentos.filter(
    (doc) =>
      doc.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.archivo[0].nombre.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const handleEliminarDocumento = async (id: string, filePath: string) => {
    // Asegurar que filePath tenga la ruta completa
    const fullPath = `documentos/${filePath}`

    const eliminado = await deleteDocument(id, fullPath)

    if (eliminado) {
      setDocumentos((prevDocumentos) => prevDocumentos.filter((doc) => doc.id !== id))
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
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
    void obtenerDocumentos().then(() => {
      setTimeout(() => 0)
    })
  }

  const handleDocumentoEdit = () => {
    void obtenerDocumentos().then(() => {
      setTimeout(() => 0)
    })
  }

  const handleDocumentoAct = () => {
    void obtenerDocumentos().then(() => {
      setTimeout(() => 0)
    })
  }

  return (
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                  }}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{viewMode === 'grid' ? 'Vista de lista' : 'Vista de cuadrícula'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <CustomTooltip content="Añadir documento">
            <Button className="flex items-center gap-2 px-4" type="button" variant="default" onClick={handleOpenModal}>
              <CirclePlus className="h-5 w-5" />
              <span>Nuevo documento</span>
            </Button>
          </CustomTooltip>
        </div>
      </div>

      <Tabs className="w-full" defaultValue="todos">
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="periodicos">Periódicos</TabsTrigger>
          <TabsTrigger value="permanentes">Permanentes</TabsTrigger>
          <TabsTrigger value="porActualizar">Por actualizar</TabsTrigger>
        </TabsList>

        {/* Vista de todos los documentos */}
        <TabsContent className="mt-0" value="todos">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocumentos.map((doc: Documento) => (
                <Card key={doc.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {doc.archivo[0].tipo.startsWith('image/') ? (
                      <img alt="Vista previa" className="h-full w-full object-cover object-top" src={doc.archivo[0].url} />
                    ) : doc.archivo[0].tipo === 'application/pdf' ? (
                      <iframe className="h-full w-full translate-y-[-20%] scale-150" src={doc.archivo[0].url} style={{ pointerEvents: 'none' }} title="Vista previa del documento" />
                    ) : (
                      getFileIcon(doc.archivo[0].tipo)
                    )}

                    <div className="absolute right-2 top-2">{getEstadoBadge(determinarEstadoDocumento(doc))}</div>
                  </div>

                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-start justify-between">
                      <CardTitle className="truncate text-lg">{doc.nombre}</CardTitle>
                    </div>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <Badge className="font-normal" variant="outline">
                        {doc.categoria}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="mt-2 text-xs text-muted-foreground">
                      {doc.tipo === 'periodico' ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Próxima actualización: {doc.proximaActualizacion}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span className="text-xs text-muted-foreground">Documento permanente</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="max-w-[150px] truncate text-xs text-muted-foreground">{doc.archivo[0].nombre}</div>
                    <div className="flex gap-1">
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
                              void handleEliminarDocumento(doc.id, doc.archivo[0].nombre)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocumentos.map((doc) => (
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
                                void handleEliminarDocumento(doc.id, doc.archivo[0].nombre)
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
              ))}
            </div>
          )}
        </TabsContent>

        {/* Vista de documentos periódicos */}
        <TabsContent className="mt-0" value="periodicos">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocumentos
                .filter((doc) => doc.tipo === 'periodico')
                .map((doc) => (
                  <Card key={doc.id} className="overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {doc.archivo[0].tipo.startsWith('image/') ? (
                        <img alt="Vista previa" className="h-full w-full object-cover object-top" src={doc.archivo[0].url} />
                      ) : doc.archivo[0].tipo === 'application/pdf' ? (
                        <iframe className="h-full w-full translate-y-[-20%] scale-150" src={doc.archivo[0].url} style={{ pointerEvents: 'none' }} title="Vista previa del documento" />
                      ) : (
                        getFileIcon(doc.archivo[0].tipo)
                      )}

                      <div className="absolute right-2 top-2">{getEstadoBadge(determinarEstadoDocumento(doc))}</div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <CardTitle className="truncate text-lg">{doc.nombre}</CardTitle>
                      </div>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Badge className="font-normal" variant="outline">
                          {doc.categoria}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Próxima actualización: {doc.proximaActualizacion}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <div className="max-w-[150px] truncate text-xs text-muted-foreground">{doc.archivo[0].nombre}</div>
                      <div className="flex gap-1">
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
                            <DropdownMenuItem
                              onClick={() => {
                                handleOpenModalAct(doc)
                              }}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Actualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                void handleEliminarDocumento(doc.id, doc.archivo[0].nombre)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocumentos
                .filter((doc) => doc.tipo === 'periodico')
                .map((doc) => (
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
                              <DropdownMenuItem
                                onClick={() => {
                                  handleOpenModalAct(doc)
                                }}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Actualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  void handleEliminarDocumento(doc.id, doc.archivo[0].nombre)
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
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Próxima actualización: {doc.proximaActualizacion}</span>
                          </div>
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
                ))}
            </div>
          )}
        </TabsContent>

        {/* Vista de documentos permanentes */}
        <TabsContent className="mt-0" value="permanentes">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocumentos
                .filter((doc) => doc.tipo === 'permanente')
                .map((doc) => (
                  <Card key={doc.id} className="overflow-hidden transition-shadow hover:shadow-md">
                    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {doc.archivo[0].tipo.startsWith('image/') ? (
                        <img alt="Vista previa" className="h-full w-full object-cover object-top" src={doc.archivo[0].url} />
                      ) : doc.archivo[0].tipo === 'application/pdf' ? (
                        <iframe className="h-full w-full translate-y-[-20%] scale-150" src={doc.archivo[0].url} style={{ pointerEvents: 'none' }} title="Vista previa del documento" />
                      ) : (
                        getFileIcon(doc.archivo[0].tipo)
                      )}

                      <div className="absolute right-2 top-2">{getEstadoBadge(determinarEstadoDocumento(doc))}</div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <CardTitle className="truncate text-lg">{doc.nombre}</CardTitle>
                      </div>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Badge className="font-normal" variant="outline">
                          {doc.categoria}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="mt-2 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">Documento permanente</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <div className="max-w-[150px] truncate text-xs text-muted-foreground">{doc.archivo[0].nombre}</div>
                      <div className="flex gap-1">
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
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                void handleEliminarDocumento(doc.id, doc.archivo[0].nombre)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocumentos
                .filter((doc) => doc.tipo === 'permanente')
                .map((doc) => (
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
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  void handleEliminarDocumento(doc.id, doc.archivo[0].nombre)
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
                ))}
            </div>
          )}
        </TabsContent>

        {/* Vista de documentos por actualizar */}
        <TabsContent className="mt-0" value="porActualizar">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocumentos
                .filter((doc) => determinarEstadoDocumento(doc) === 'Por actualizar')
                .map((doc) => (
                  <Card key={doc.id} className="overflow-hidden border-red-200 transition-shadow hover:shadow-md">
                    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {doc.archivo[0].tipo.startsWith('image/') ? (
                        <img alt="Vista previa" className="h-full w-full object-cover object-top" src={doc.archivo[0].url} />
                      ) : doc.archivo[0].tipo === 'application/pdf' ? (
                        <iframe className="h-full w-full translate-y-[-20%] scale-150" src={doc.archivo[0].url} style={{ pointerEvents: 'none' }} title="Vista previa del documento" />
                      ) : (
                        getFileIcon(doc.archivo[0].tipo)
                      )}

                      <div className="absolute right-2 top-2">{getEstadoBadge(determinarEstadoDocumento(doc))}</div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <CardTitle className="truncate text-lg">{doc.nombre}</CardTitle>
                      </div>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Badge className="font-normal" variant="outline">
                          {doc.categoria}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="mt-2 text-xs text-red-500">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>Actualización pendiente: {doc.proximaActualizacion}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <div className="max-w-[150px] truncate text-xs text-muted-foreground">{doc.archivo[0].nombre}</div>
                      <div className="flex gap-1">
                        <Button
                          className="text-xs"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleOpenModalAct(doc)
                          }}
                        >
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Actualizar
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocumentos
                .filter((doc) => determinarEstadoDocumento(doc) === 'Por actualizar')
                .map((doc) => (
                  <div key={doc.id} className="flex overflow-hidden rounded-lg border border-red-200 transition-shadow hover:shadow-md">
                    <div className="flex w-16 items-center justify-center bg-red-50 sm:w-20">{getFileIcon(doc.archivo[0].tipo)}</div>
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            handleOpenModalAct(doc)
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Actualizar ahora
                        </Button>
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Última actualización: {doc.fechaActualizacion}</span>
                          </div>
                          <div className="flex items-center gap-1 text-red-500">
                            <AlertCircle className="h-3 w-3" />
                            <span>Actualización pendiente: {doc.proximaActualizacion}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AgregarDocumento isOpen={isModalOpen} onClose={handleCloseModal} onDocumentoAdded={handleDocumentoAdded} />

      <VisualizarDocumento documento={selectedPayment} isOpen={isModalOpenView} onClose={handleCloseModalView} />

      <ActualizarDocumento documento={selectedPayment} isOpen={isModalOpenAct} onClose={handleCloseModalAct} onDocumentoAct={handleDocumentoAct} />
      <EditarDocumento documento={selectedPayment} isOpen={isModalOpenEdit} onClose={handleCloseModalEdit} onDocumentoEdit={handleDocumentoEdit} />
    </div>
  )
}
