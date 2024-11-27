'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { Experiencia } from './interface'
import type { Contrato } from '@/components/tipoContrato/tipoContratoTable/tipoContrato-table'
import type { Actividad } from '@/components/actividad/actividadTable/actividad-table'
import type { CheckedState } from '@radix-ui/react-checkbox'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { ChevronLeft, ChevronRight, CirclePlus, MoreHorizontal, Search, SlidersHorizontal } from 'lucide-react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState, useRef } from 'react'
import React from 'react'
import ReactSelect from 'react-select'
import { Toaster, toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

import { CustomTooltip } from '../../commons/tooltip'
import { AddExperienciaModal } from '../modalAddExperiencia/AddExperienciaModal'
import { EditExperienceModal } from '../EditExperienceModal/EditExperienceModal'
import { obtenerExperiences } from '../../services/experiencia/experienciaService'
import { obtenerTiposContrato } from '../../services/tipoContrato/contratoService'
import { obtenerActividades } from '../../services/actividad/actividadService'
import { getCustomSelectStyles } from '../../custom-select/customSelectStyles'

import { ActionsMenu } from './ActionsMenu'
import { deleteExperience } from './deleteExperience'

export const columns: ColumnDef<Experiencia>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Seleccionar todo"
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(checked: CheckedState) => {
          table.toggleAllRowsSelected(!!checked)
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Seleccionar fila"
        checked={row.getIsSelected()}
        onCheckedChange={(checked: CheckedState) => {
          row.toggleSelected(!!checked)
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'Empresa',
    header: 'Empresa',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Empresa')}</div>
  },
  {
    accessorKey: 'rup',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Rup
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center lowercase">{row.getValue('rup')}</div>
  },
  {
    accessorKey: 'entidad',
    header: 'Entidad',
    cell: ({ row }) => <div className="capitalize">{row.getValue('entidad')}</div>
  },
  {
    accessorKey: 'contrato',
    header: 'Contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('contrato')}</div>
  },
  {
    accessorKey: 'socio',
    header: 'Socio',
    cell: ({ row }) => <div className="capitalize">{row.getValue('socio')}</div>
  },
  {
    accessorKey: 'contratista',
    header: 'Contratista',
    cell: ({ row }) => <div className="capitalize">{row.getValue('contratista')}</div>
  },
  {
    accessorKey: 'modalidad',
    header: 'Modalidad',
    cell: ({ row }) => <div className="capitalize">{row.getValue('modalidad')}</div>
  },
  {
    accessorKey: 'tipoContrato',
    header: 'Tipo de Contrato',
    cell: ({ row }) => {
      const tiposContrato: Contrato[] = row.getValue('tipoContrato')

      return (
        <div>
          {tiposContrato.map((tipo, index) => (
            <span key={tipo.id} className="mr-2">
              {tipo.nombre}
              {index < tiposContrato.length - 1 && ', '}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, filterValue: string[]) => {
      const tiposContrato: Contrato[] = row.getValue(id)

      return filterValue.length === 0 || filterValue.some((filter: string) => tiposContrato.some((tipo: Contrato) => tipo.nombre === filter))
    }
  },
  {
    accessorKey: 'actividadPrincipal',
    header: 'Actividad Principal',
    cell: ({ row }) => {
      const actividad: Actividad[] = row.getValue('actividadPrincipal')

      return (
        <div>
          {actividad.map((tipo, index) => (
            <span key={tipo.id} className="mr-2">
              {tipo.nombre}
              {index < actividad.length - 1 && ', '}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, filterValue: string[]) => {
      const actividad: Actividad[] = row.getValue(id)

      return filterValue.length === 0 || filterValue.some((filter: string) => actividad.some((tipo: Actividad) => tipo.nombre === filter))
    }
  },
  {
    accessorKey: 'valorSmmlvPart2',
    header: 'Valor en SMMLV*%PART2',
    cell: ({ row }) => {
      const value = row.getValue('valorSmmlvPart2')
      const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(typeof value === 'number' ? value : parseFloat(value as string))
      const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

      return <div className="capitalize">{formattedWithoutSymbol}</div>
    }
  },
  {
    accessorKey: 'valorSmmlv',
    header: 'Valor en SMMLV',
    cell: ({ row }) => {
      const value = row.getValue('valorSmmlv')
      const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(typeof value === 'number' ? value : parseFloat(value as string))
      const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

      return <div className="capitalize">{formattedWithoutSymbol}</div>
    }
  },
  {
    accessorKey: 'objeto',
    header: 'Objeto',
    cell: ({ row }) => {
      const value = row.getValue('objeto')
      const formattedValue = typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value

      return <div>{formattedValue as string}</div>
    }
  },
  {
    accessorKey: 'fechaInicio',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Fecha Inicio
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('fechaInicio')}</div>
  },
  {
    accessorKey: 'fechaTerminacion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Fecha fin
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('fechaTerminacion')}</div>
  }
]

export interface OptionTipoContrato {
  value: string
  label: string
}

export interface OptionActividad {
  value: string
  label: string
}

export function CustomTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Experiencia | null>(null)
  const [data, setData] = useState<Experiencia[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [tipoContratoOptions, setTipoContratoOptions] = useState<OptionTipoContrato[]>([])
  const [selectedTiposContrato, setSelectedTiposContrato] = useState<string[]>([])
  const [actividadOptions, setActividadOptions] = useState<OptionActividad[]>([])
  const [selectedActividad, setSelectedActividad] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const tableEndRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (tableEndRef.current) {
      observer.observe(tableEndRef.current)
    }

    return () => {
      if (tableEndRef.current) {
        observer.unobserve(tableEndRef.current)
      }
    }
  }, [])

  const fetchFilters = async () => {
    try {
      // Cargar opciones de tipo de contrato
      const tiposContratos = await obtenerTiposContrato()
      const actividad = await obtenerActividades()

      setTipoContratoOptions(
        tiposContratos.map((contrato: Contrato) => ({
          value: contrato.id.toString(),
          label: contrato.nombre
        }))
      )

      setActividadOptions(
        actividad.map((act: Actividad) => ({
          value: act.id.toString(),
          label: act.nombre
        }))
      )
    } catch (error) {
      global.console.error('Error al cargar opciones:', error)
    }
  }

  const fetchExperiences = async () => {
    try {
      const experienciaData = await obtenerExperiences()

      setData(experienciaData)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error) {
        global.console.error('Error al obtener documentos:', error.message)
      } else {
        global.console.error('Error desconocido al obtener documentos')
      }
    }
  }

  // useEffect para cargar los datos cuando el componente se monta
  useEffect(() => {
    void fetchExperiences()
    void fetchFilters()
  }, [])

  const handleExperienciaAdded = () => {
    void fetchExperiences()
  }

  const handleExperienciaEdit = () => {
    void fetchExperiences()
  }

  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (newVisibility) => {
      setColumnVisibility(newVisibility)
    },
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection
    }
  })

  useEffect(() => {
    if (selectedTiposContrato.length > 0) {
      table.getColumn('tipoContrato')?.setFilterValue(selectedTiposContrato)
    } else {
      table.getColumn('tipoContrato')?.setFilterValue(undefined)
    }
  }, [selectedTiposContrato, table])

  useEffect(() => {
    if (selectedActividad.length > 0) {
      table.getColumn('actividadPrincipal')?.setFilterValue(selectedActividad)
    } else {
      table.getColumn('actividadPrincipal')?.setFilterValue(undefined)
    }
  }, [selectedActividad, table])

  useEffect(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const sum = selectedRows.reduce((acc, row) => acc + row.original.valorSmmlvPart2, 0)

    if (selectedRows.length > 0) {
      const formatted = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(sum)
      const formattedWithoutSymbol = formatted.replace(/[^0-9.,]/g, '')

      toast.success(`Suma total: ${formattedWithoutSymbol}`, {
        description: `${selectedRows.length} fila(s) seleccionada(s)`
      })
    }
  }, [rowSelection, table])

  const handleDeleteRow = async (id: string) => {
    const deleted = await deleteExperience(id)

    if (deleted) {
      setData((prevData) => prevData.filter((row) => row.id !== id)) // Actualiza el estado
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAddData = (newData: Experiencia) => {
    setData((prevData) => [...prevData, newData])
  }

  const handleOpenEditModal = (payment: Experiencia) => {
    setSelectedPayment(payment)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleSaveEdit = () => {
    setIsEditModalOpen(false)
  }

  const resetFilters = () => {
    table.setGlobalFilter('')
    table.setColumnFilters([])
    setSelectedActividad([])
    setSelectedTiposContrato([])
  }

  const pageCount = table.getPageCount()

  // Función para generar el array de páginas a mostrar
  const getPageRange = () => {
    const currentPage = table.getState().pagination.pageIndex + 1
    const totalPages = pageCount
    const delta = 2 // Número de páginas a mostrar antes y después de la página actual

    const range = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      range.unshift('...')
    }

    if (currentPage + delta < totalPages - 1) {
      range.push('...')
    }

    range.unshift(1)

    if (totalPages !== 1) {
      range.push(totalPages)
    }

    return range
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between py-4">
        <Toaster richColors expand={false} />
        <div className="relative mr-2 w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Buscar en todas las columnas..."
            value={globalFilter || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setGlobalFilter(e.target.value)
            }} // Setea el filtro global
          />
        </div>
        <div className="flex w-full flex-col sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>Aplica filtros específicos a cada columna</SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] px-1">
                <div className="space-y-4 py-4">
                  {/* Filtro por Empresa */}
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input
                      placeholder="Filtrar por empresa"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value

                        table.getColumn('Empresa')?.setFilterValue(value)
                      }}
                    />{' '}
                  </div>

                  {/* Filtro por Modalidad */}
                  <div className="space-y-2">
                    <Label>Modalidad</Label>
                    <Select
                      defaultValue="Todas"
                      onValueChange={(value: string) => {
                        if (value === 'Todas') {
                          table.getColumn('modalidad')?.setFilterValue(undefined)
                        } else {
                          table.getColumn('modalidad')?.setFilterValue(value)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todas">Todas</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Consorcio">Consorcio</SelectItem>
                        <SelectItem value="Unión Temporal">Unión Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Contrato</Label>
                    <ReactSelect
                      isMulti
                      aria-label="Seleccionar"
                      classNamePrefix="select"
                      name="tiposContrato"
                      options={tipoContratoOptions}
                      placeholder="Seleccionar Tipo C."
                      styles={getCustomSelectStyles}
                      value={tipoContratoOptions.filter((option) => selectedTiposContrato.includes(option.label))}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions.map((option) => option.label)

                        setSelectedTiposContrato(selectedValues)
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actividad Principal</Label>
                    <ReactSelect
                      isMulti
                      aria-label="Seleccionar"
                      classNamePrefix="select"
                      name="tiposContrato"
                      options={actividadOptions}
                      placeholder="Seleccionar Actividad"
                      styles={getCustomSelectStyles}
                      value={actividadOptions.filter((option) => selectedActividad.includes(option.label))}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions.map((option) => option.label)

                        setSelectedActividad(selectedValues)
                      }}
                    />
                  </div>

                  {/* Filtro por Objeto */}
                  <div className="space-y-2">
                    <Label>Objeto</Label>
                    <Input
                      placeholder="Buscar en el objeto del contrato"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value
                        const column = table.getColumn('objeto')

                        column?.setFilterValue(value)

                        if (value && !column?.getIsVisible()) {
                          column?.toggleVisibility()
                        }
                      }}
                    />
                  </div>

                  {/* Botón para restablecer filtros */}
                  <div className="mt-4">
                    <Button variant="outline" onClick={resetFilters}>
                      Restablecer Filtros
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-auto mt-4 sm:mt-0">
          <CustomTooltip content="Añadir experiencia">
            <Button size="icon" type="button" variant="default" onClick={handleOpenModal}>
              <CirclePlus className="h-5 w-5" />
            </Button>
          </CustomTooltip>
        </div>
        <div className="ml-3 mt-4 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <CustomTooltip content="Ocultar o Anadir Columnas"> */}
              <Button className="ml-auto" variant="outline">
                Columnas <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
              {/* </CustomTooltip> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      className="capitalize"
                      onCheckedChange={(value: boolean) => {
                        column.toggleVisibility(!!value)
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loader
              Array.from({ length: 10 }).map(() => (
                <TableRow key={uuidv4()}>
                  {Array.from({ length: columns.length + 1 }).map(() => (
                    <TableCell key={uuidv4()}>
                      <Skeleton className="h-8 w-full dark:bg-gray-800" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              // Datos reales
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell>
                    <ActionsMenu
                      row={row}
                      onDelete={() => {
                        void handleDeleteRow(row.original.id ?? '')
                      }}
                      onEdit={() => {
                        handleOpenEditModal(row.original)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Mensaje de "Sin resultados"
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length + 1}>
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div ref={tableEndRef} className="h-1" />
      <div
        ref={navRef}
        className={`flex items-center justify-center space-x-2 py-4 transition-all duration-500 ${
          isAtBottom ? 'static bg-transparent' : 'fixed bottom-2 left-1/2 max-w-max -translate-x-1/2 scale-x-100 transform rounded-lg bg-white px-4 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]'
        } z-50 ${isAtBottom ? '' : 'scale-x-90'}`}
      >
        <Button
          disabled={!table.getCanPreviousPage()}
          size="sm"
          variant="outline"
          onClick={() => {
            table.previousPage()
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {getPageRange().map((pageNumber) =>
          pageNumber === '...' ? (
            <span key={pageNumber} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={pageNumber}
              size="sm"
              variant={table.getState().pagination.pageIndex === Number(pageNumber) - 1 ? 'default' : 'outline'}
              onClick={() => {
                table.setPageIndex(Number(pageNumber) - 1)
              }}
            >
              {pageNumber}
            </Button>
          )
        )}
        <Button
          disabled={!table.getCanNextPage()}
          size="sm"
          variant="outline"
          onClick={() => {
            table.nextPage()
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <AddExperienciaModal isOpen={isModalOpen} onClose={handleCloseModal} onExperienciaAdded={handleExperienciaAdded} onSave={handleAddData} />
      {isEditModalOpen && selectedPayment ? (
        <EditExperienceModal isOpen={isEditModalOpen} payment={selectedPayment} onClose={handleCloseEditModal} onExperienciaEdit={handleExperienciaEdit} onSave={handleSaveEdit} />
      ) : null}
    </>
  )
}
