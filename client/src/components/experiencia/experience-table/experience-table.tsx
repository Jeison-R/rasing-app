'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import type { Actividad } from '../../actividad/actividadTable/actividad-table'
import type { Documento } from '../../documentoSoporte/documentoTable/documento-table'
import type { Contrato } from '../../tipoContrato/tipoContratoTable/tipoContrato-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useState, type ChangeEvent } from 'react'
import React from 'react'
import Select from 'react-select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CustomTooltip } from '../../commons/tooltip'
import { AddExperienciaModal } from '../modalAddExperiencia/AddExperienciaModal'
import { EditExperienceModal } from '../EditExperienceModal/EditExperienceModal'
// import { activityOptions } from '../../actividad/actividadTable/actividad-table'
// import { tipoContratoOptions } from '../../tipoContrato/tipoContratoTable/tipoContrato-table'
import { getCustomSelectStyles } from '../../custom-select/customSelectStyles'
import { obtenerExperiences } from '../../services/experiencia/experienciaService'

import { ActionsMenu } from './ActionsMenu'
import { deleteExperience } from './deleteExperience'

export interface Experiencia {
  Empresa: string
  id?: string
  rup: string
  entidad: string
  contrato: string
  socio: string
  contratista: string
  modalidad: string
  objeto: string
  tipoContrato?: Contrato[]
  actividadPrincipal?: Actividad[]
  fechaInicio: string
  fechaTerminacion: string
  documentoSoporte?: Documento[]
  valorSmmlv: number
  valorSmmlvPart2: number
  valorActual: number
  valorInicial: number // Valor inicial del contrato
  partPorcentaje: number // Participación porcentual
  valorFinalAfectado: number // Valor final afectado después de adiciones
  anioTerminacion: number // Año de terminación
  adiciones?: Adicion[] // Array opcional de adiciones
  documentoCargado: { name: string; url: string }[]
}

export interface Adicion {
  id: string
  value: number // Valor de la adición
}

export const columns: ColumnDef<Experiencia>[] = [
  {
    accessorKey: 'Empresa',
    header: 'Empresa',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Empresa')}</div>
  },
  {
    accessorKey: 'rup',
    header: 'RUP',
    cell: ({ row }) => <div className="capitalize">{row.getValue('rup')}</div>
  },
  {
    accessorKey: 'entidad',
    header: 'Contratante',
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
    header: 'Tipo de contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tipoContrato')}</div>
  },
  {
    accessorKey: 'actividadPrincipal',
    header: 'Actividad Principal',
    cell: ({ row }) => <div className="capitalize">{row.getValue('actividadPrincipal')}</div>
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

export function CustomTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Experiencia | null>(null)
  const [data, setData] = useState<Experiencia[]>([])

  const fetchExperiences = async () => {
    try {
      const experienciaData = await obtenerExperiences()

      setData(experienciaData)
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
  }, [])

  const handleExperienciaAdded = () => {
    void fetchExperiences() // Llama a la función para obtener la lista actualizada
  }

  const handleExperienciaEdit = () => {
    void fetchExperiences() // Llama a la función para obtener la lista actualizada
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage,
        pageSize: 8
      }
    }
  })

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
    // setData((prevData) => prevData.map((payment) => (payment.id === updatedPayment.id ? updatedPayment : payment)))
    setIsEditModalOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between py-4">
        <div className="flex w-full flex-col sm:w-auto">
          <label className="text-sm font-medium" htmlFor="tipoContrato">
            Tipo de Contrato
          </label>
          <Select
            isClearable
            isMulti
            className="mt-1 w-full sm:w-[250px]"
            id="tipoContrato"
            // options={tipoContratoOptions}
            placeholder="Seleccione"
            styles={getCustomSelectStyles}
            // value={selectedTipoContrato}
            // onChange={setSelectedTipoContrato}
          />
        </div>

        <div className="ml-2 flex w-full flex-col sm:w-auto">
          <label className="text-sm font-medium" htmlFor="actividad">
            Actividad
          </label>
          <Select
            isClearable
            isMulti
            className="mt-1 w-full sm:w-[250px]"
            id="actividad"
            // options={activityOptions}
            placeholder="Seleccione"
            styles={getCustomSelectStyles}
            // value={selectedActividad}
            // onChange={setSelectedActividad}
          />
        </div>

        <div className="ml-2 flex w-full flex-col sm:w-auto">
          {/* Label para el input de Contratante */}
          <label className="mb-1 text-sm font-medium" htmlFor="contratante">
            Contratante
          </label>
          <Input
            className="w-full sm:max-w-sm"
            placeholder="Filtrar por contratante..."
            value={table.getColumn('contratante')?.getFilterValue() as string}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('contratante')?.setFilterValue(event.target.value)}
          />
        </div>

        {/* Botón para añadir experiencia alineado a la derecha */}
        <div className="ml-auto mt-4 sm:mt-0">
          <CustomTooltip content="Añadir experiencia">
            <Button size="icon" type="button" variant="default" onClick={handleOpenModal}>
              <CirclePlus className="h-5 w-5" />
            </Button>
          </CustomTooltip>
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    // Manejo específico para "tipoContrato" y "actividadPrincipal"
                    if (cell.column.id === 'tipoContrato' || cell.column.id === 'actividadPrincipal') {
                      const value = row.original[cell.column.id]

                      return (
                        <TableCell key={cell.id}>
                          {Array.isArray(value)
                            ? value.map((item) => item.nombre).join(', ') // Muestra los nombres de los objetos dentro del array
                            : 'No especificado'}
                        </TableCell>
                      )
                    }

                    return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  })}
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
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {currentPage + 1} de {table.getPageCount()} páginas
        </div>
        <div className="space-x-2">
          <CustomTooltip content="Anterior">
            <Button
              disabled={!table.getCanPreviousPage()}
              size="icon"
              variant="outline"
              onClick={() => {
                table.previousPage()
                setCurrentPage(table.getState().pagination.pageIndex - 1)
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Siguiente">
            <Button
              disabled={!table.getCanNextPage()}
              size="icon"
              variant="outline"
              onClick={() => {
                table.nextPage()
                setCurrentPage(table.getState().pagination.pageIndex + 1)
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CustomTooltip>
        </div>
      </div>
      <AddExperienciaModal isOpen={isModalOpen} onClose={handleCloseModal} onExperienciaAdded={handleExperienciaAdded} onSave={handleAddData} />
      {isEditModalOpen && selectedPayment ? (
        <EditExperienceModal isOpen={isEditModalOpen} payment={selectedPayment} onClose={handleCloseEditModal} onExperienciaEdit={handleExperienciaEdit} onSave={handleSaveEdit} />
      ) : null}
    </>
  )
}
