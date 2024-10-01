'use client'

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'

import { CaretSortIcon } from '@radix-ui/react-icons'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState, type ChangeEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { CustomTooltip } from '../commons/tooltip'
import { AddExperienciaModal } from '../modalAddExperiencia/AddExperienciaModal'
import { EditExperienceModal } from '../EditExperienceModal/EditExperienceModal'

import { ActionsMenu } from './ActionsMenu'

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    RUP: '123456789',
    Entidad: 'Ministerio de Salud',
    Contrato: '1234',
    Contratista: 'Salud Vida SAS',
    Modalidad: 'Licitación Pública',
    Objeto: 'gfdggfry tsbdgfddgdfgbdfgsfdbgfsgdf sdadffhghfghfghfghfghfghfghfggjhjghjghjghjghjhgjghjghj',
    TipoContrato: 'Prestación de Servicios',
    ActividadPrincipal: 'Suministro de medicamentos',
    FechaInicio: '15-05-2016',
    FechaTerminacion: '2023-12-31',
    ValorInicial: 5000000,
    PartPorcentaje: 50,
    ValorFinalAfectado: 7500000,
    AnioTerminacion: 2023,
    DocumentoSoporte: '',
    ValorSmmlv: 0,
    ValorSmmlvPart2: 0,
    ValorActual: 0,
    Adiciones: [
      {
        id: 'adicion1',
        value: 2500000
      }
    ]
  },
  {
    id: 'n3bv78k0',
    RUP: '123456789',
    Entidad: 'Ministerio de Educación',
    Contrato: '5678',
    Contratista: 'Educamos Juntos',
    Modalidad: 'Contratación Directa',
    Objeto: 'gfdggfry tsbdgfddgdfgbdfgsfdbgfsgdf',
    TipoContrato: 'Consultoría',
    ActividadPrincipal: 'Capacitación docente',
    FechaInicio: '2022-03-01',
    FechaTerminacion: '2022-11-30',
    ValorInicial: 3000000,
    PartPorcentaje: 100,
    ValorFinalAfectado: 3000000,
    AnioTerminacion: 2022,
    DocumentoSoporte: '',
    ValorActual: 0,
    ValorSmmlv: 0,
    ValorSmmlvPart2: 0,
    Adiciones: []
  },
  {
    id: 'z7gh93k2',
    RUP: '123456789',
    Entidad: 'Alcaldía de Bogotá',
    Contrato: '91011',
    Contratista: 'Bogotá Limpia S.A.',
    Modalidad: 'Licitación Pública',
    Objeto: 'gfdggfry tsbdgfddgdfgbdfgsfdbgfsgdf',
    TipoContrato: 'Obra Pública',
    ActividadPrincipal: 'Construcción de vías',
    FechaInicio: '2021-06-01',
    FechaTerminacion: '2022-12-15',
    ValorInicial: 10000000,
    PartPorcentaje: 75,
    ValorFinalAfectado: 13000000,
    AnioTerminacion: 2022,
    DocumentoSoporte: '',
    ValorSmmlv: 0,
    ValorSmmlvPart2: 0,
    ValorActual: 0,
    Adiciones: [
      {
        id: 'adicion2',
        value: 3000000
      }
    ]
  },
  {
    id: 'y9kl65n1',
    RUP: '123456789',
    Entidad: 'Gobernación de Antioquia',
    Contrato: '1213',
    Contratista: 'Antioquia Proyectos',
    Modalidad: 'Concesión',
    Objeto: 'gfdggfry tsbdgfddgdfgbdfgsfdbgfsgdf',
    TipoContrato: 'Concesión de Servicios',
    ActividadPrincipal: 'Operación de peajes',
    FechaInicio: '2020-09-01',
    FechaTerminacion: '2025-09-01',
    ValorInicial: 20000000,
    PartPorcentaje: 60,
    ValorFinalAfectado: 25000000,
    AnioTerminacion: 2025,
    DocumentoSoporte: '',
    ValorSmmlv: 0,
    ValorSmmlvPart2: 0,
    ValorActual: 0,
    Adiciones: [
      {
        id: 'adicion3',
        value: 5000000
      }
    ]
  },
  {
    id: 'p3dv72q5',
    RUP: '123456789',
    Entidad: 'Instituto Colombiano de Bienestar Familiar',
    Contrato: '1415',
    Contratista: 'Familias Felices SAS',
    Modalidad: 'Licitación Pública',
    Objeto: 'gfdggfry tsbdgfddgdfgbdfgsfdbgfsgdf',
    TipoContrato: 'Suministro',
    ActividadPrincipal: 'Suministro de alimentos',
    FechaInicio: '2023-02-01',
    FechaTerminacion: '2023-12-31',
    ValorInicial: 4000000,
    PartPorcentaje: 40,
    ValorFinalAfectado: 6000000,
    AnioTerminacion: 2023,
    DocumentoSoporte: '',
    ValorSmmlv: 0,
    ValorSmmlvPart2: 0,
    ValorActual: 0,
    Adiciones: [
      {
        id: 'adicion4',
        value: 2000000
      }
    ]
  }
]

export interface Payment {
  id: string
  RUP: string
  Entidad: string
  Contrato: string
  Contratista: string
  Modalidad: string
  Objeto: string
  TipoContrato: string
  ActividadPrincipal: string
  FechaInicio: string
  FechaTerminacion: string
  DocumentoSoporte: string
  ValorSmmlv: number
  ValorSmmlvPart2: number
  ValorActual: number
  ValorInicial: number // Valor inicial del contrato
  PartPorcentaje: number // Participación porcentual
  ValorFinalAfectado: number // Valor final afectado después de adiciones
  AnioTerminacion: number // Año de terminación
  Adiciones?: Adicion[] // Array opcional de adiciones
}

export interface Adicion {
  id: string
  value: number // Valor de la adición
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'Contrato',
    header: 'Contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Contrato')}</div>
  },
  {
    accessorKey: 'Entidad',
    header: 'Contratante',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Entidad')}</div>
  },
  {
    accessorKey: 'Contratista',
    header: 'Contratista',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Contratista')}</div>
  },
  {
    accessorKey: 'Modalidad',
    header: 'Modalidad',
    cell: ({ row }) => <div className="capitalize">{row.getValue('Modalidad')}</div>
  },
  {
    accessorKey: 'TipoContrato',
    header: 'Tipo de contrato',
    cell: ({ row }) => <div className="capitalize">{row.getValue('TipoContrato')}</div>
  },
  {
    accessorKey: 'ActividadPrincipal',
    header: 'Actividad Principal',
    cell: ({ row }) => <div className="capitalize">{row.getValue('ActividadPrincipal')}</div>
  },
  {
    accessorKey: 'FechaInicio',
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
    cell: ({ row }) => <div className="lowercase">{row.getValue('FechaInicio')}</div>
  },
  {
    accessorKey: 'FechaTerminacion',
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
    cell: ({ row }) => <div className="lowercase">{row.getValue('FechaTerminacion')}</div>
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
  const [tableData, setTableData] = useState<Payment[]>(data) // Usa tableData como el estado

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
        pageSize: 10
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
      <div className="flex items-center justify-between py-4">
        <Input
          className="max-w-sm"
          placeholder="Filtrar..."
          value={table.getColumn('Entidad')?.getFilterValue() as string}
          onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn('Entidad')?.setFilterValue(event.target.value)}
        />
        <CustomTooltip content="Añadir experiencia">
          <Button size="icon" type="button" variant="default" onClick={handleOpenModal}>
            <CirclePlus className="h-5 w-5" />
          </Button>
        </CustomTooltip>
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
