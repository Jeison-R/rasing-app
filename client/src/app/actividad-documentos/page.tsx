import { CustomTableActividad } from '@/components/actividad/actividadTable/actividad-table'
import { CustomTableDocumento } from '@/components/documentoSoporte/documentoTable/documento-table'
import { CustomTableTipoContrato } from '@/components/tipoContrato/tipoContratoTable/tipoContrato-table'

export default function ActividadContratoPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/3">
          <CustomTableActividad />
        </div>
        <div className="w-full lg:w-1/3">
          <CustomTableDocumento />
        </div>
        <div className="w-full lg:w-1/3">
          <CustomTableTipoContrato />
        </div>
      </div>
    </div>
  )
}
