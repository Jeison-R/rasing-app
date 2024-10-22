'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState, type ChangeEvent } from 'react'
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

import { ActionsMenu } from './ActionsMenu'

const data: Payment[] = [
  {
    id: 'y9kl65n1',
    rup: '123456789',
    entidad: 'Gobernación de Antioquia',
    contrato: '1213',
    contratista: 'Antioquia Proyectos',
    modalidad: 'Concesión',
    objeto: 'gfdggfry tsbdgfddgdfgbdfgsfdbgfsgdf',
    tipoContrato: 'Concesión de Servicios',
    actividadPrincipal: 'Operación de peajes',
    fechaInicio: '2020-09-01',
    fechaTerminacion: '2025-09-01',
    valorInicial: 20000000,
    partPorcentaje: 60,
    valorFinalAfectado: 25000000,
    anioTerminacion: 2025,
    documentoSoporte: '',
    valorSmmlv: 0,
    valorSmmlvPart2: 0,
    valorActual: 0,
    documentoCargado: [
      { name: 'tema 1.pdf', url: 'https://ejemplo.com/documentos/tema1.pdf' },
      { name: 'tema 2.pdf', url: 'https://ejemplo.com/documentos/tema2.pdf' }
    ],
    adiciones: [
      {
        id: 'adicion3',
        value: 5000000
      }
    ]
  }
]

export interface Payment {
  id: string
  rup: string
  entidad: string
  contrato: string
  contratista: string
  modalidad: string
  objeto: string
  tipoContrato: string
  actividadPrincipal: string
  fechaInicio: string
  fechaTerminacion: string
  documentoSoporte: string
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

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'contrato',
    header: 'Contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('contrato')}</div>
  },
  {
    accessorKey: 'entidad',
    header: 'Contratante',
    cell: ({ row }) => <div className="capitalize">{row.getValue('entidad')}</div>
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
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [tableData, setTableData] = useState<Payment[]>(data)
  //   const [selectedTipoContrato, setSelectedTipoContrato] = React.useState([])
  //   const [selectedActividad, setSelectedActividad] = React.useState([])
  //
  //   const filteredData = useMemo(() => {
  //     return tableData.filter((payment) => {
  //       const matchesTipoContrato = selectedTipoContrato.length ? selectedTipoContrato.some((option) => payment.TipoContrato.toLowerCase().includes(option.value.toLowerCase())) : true
  //
  //       const matchesActividad = selectedActividad.length ? selectedActividad.some((option) => payment.ActividadPrincipal.toLowerCase().includes(option.value.toLowerCase())) : true
  //
  //       return matchesTipoContrato && matchesActividad
  //     })
  //   }, [tableData, selectedTipoContrato, selectedActividad])

  const table = useReactTable({
    data: tableData,
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

  const handleDeleteRow = (id: string) => {
    setTableData((prevData) => prevData.filter((row) => row.id !== id))
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleAddData = (newData: Payment) => {
    setTableData((prevData) => [...prevData, newData])
  }

  const handleOpenEditModal = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleSaveEdit = (updatedPayment: Payment) => {
    setTableData((prevData) => prevData.map((payment) => (payment.id === updatedPayment.id ? updatedPayment : payment)))
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
            value={table.getColumn('Entidad')?.getFilterValue() as string}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('Entidad')?.setFilterValue(event.target.value)}
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
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell>
                    <ActionsMenu
                      row={row}
                      onDelete={() => {
                        handleDeleteRow(row.original.id)
                      }}
                      onEdit={() => {
                        handleOpenEditModal(row.original)
                      }} // Pass the payment to edit
                    />{' '}
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
      <AddExperienciaModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleAddData} />
      {isEditModalOpen && selectedPayment ? <EditExperienceModal isOpen={isEditModalOpen} payment={selectedPayment} onClose={handleCloseEditModal} onSave={handleSaveEdit} /> : null}
    </>
  )
}
