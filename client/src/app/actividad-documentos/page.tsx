import { CustomTableActividad } from '@/components/actividad/actividadTable/actividad-table'
import { CustomTableDocumento } from '@/components/documentoSoporte/documentoTable/documento-table'
import { CustomTableTipoContrato } from '@/components/tipoContrato/tipoContratoTable/tipoContrato-table'

export default function ActividadContratoPage() {
  return (
    <>
      <div className="w-1/3">
        <CustomTableActividad />
      </div>
      <div className="w-1/3">
        <CustomTableDocumento />
      </div>
      <div className="w-1/3">
        <CustomTableTipoContrato />
      </div>
    </>
  )
}
