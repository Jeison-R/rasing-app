import type { Actividad } from '../../actividad/actividadTable/actividad-table'
import type { Documento } from '../../documentoSoporte/documentoTable/documento-table'
import type { Contrato } from '../../tipoContrato/tipoContratoTable/tipoContrato-table'

export interface Adicion {
  id: string
  value: number // Valor de la adición
}

export interface Field {
  id: string
  label: string
  value: string
  type: 'numeric' | 'informative'
  unit?: string
  calculatedValue?: string
}

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
  informacion?: Field[]
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
