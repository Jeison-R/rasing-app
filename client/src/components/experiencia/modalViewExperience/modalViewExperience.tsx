import type { Experiencia } from '../experience-table/interface'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ViewExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Experiencia | null
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES') // Formato con puntos de miles
}

export function ViewExperienceModal({ isOpen, onClose, payment }: ViewExperienceModalProps) {
  if (!isOpen || !payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalles</h2>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-sm font-medium">Empresa:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.Empresa}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">RUP:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.rup}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Entidad Contratante:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.entidad}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Contrato No:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.contrato}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Fecha de Inicio:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">
              {(() => {
                const [year, month, day] = payment.fechaInicio.split('-')

                return `${day}/${month}/${year}`
              })()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Fecha de Terminación:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">
              {(() => {
                const [year, month, day] = payment.fechaTerminacion.split('-')

                return `${day}/${month}/${year}`
              })()}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Año de terminación:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800"> {payment.anioTerminacion}</p>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-sm font-medium">Socio Aportante / Propio:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.socio}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Contratista:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.contratista}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Modalidad:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.modalidad}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Documentos Soporte:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">
              {Array.isArray(payment.documentoSoporte) ? payment.documentoSoporte.map((documento) => documento.nombre).join(', ') || 'No especificado' : 'No especificado'}
            </p>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <h4 className="text-sm font-medium">Objeto:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.objeto}</p>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-sm font-medium">Valor Inicial:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{formatNumber(payment.valorInicial)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Part. %:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.partPorcentaje}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Valor Final Afectado:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{formatNumber(payment.valorFinalAfectado)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Valor en SMMLV:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{formatNumber(payment.valorSmmlv)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Valor en SMMLV % PART2:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{formatNumber(payment.valorSmmlvPart2)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Valor Actual</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{formatNumber(payment.valorActual)}</p>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-sm font-medium">Tipo de Contrato:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">
              {Array.isArray(payment.tipoContrato) ? payment.tipoContrato.map((contrato) => contrato.nombre).join(', ') || 'No especificado' : 'No especificado'}
            </p>
          </div>

          {payment.tipoContrato?.some((contrato) => contrato.nombre === 'Vías') ? (
            <>
              <div>
                <h4 className="text-sm font-medium">Información 1:</h4>
                <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion?.find((item) => item.campo === 'informacion1')?.valor || 'No especificado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Información 2:</h4>
                <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion?.find((item) => item.campo === 'informacion2')?.valor || 'No especificado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Longitud Intervenida:</h4>
                <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion?.find((item) => item.campo === 'longitudIntervenida')?.valor || 'No especificado'}</p>
              </div>
            </>
          ) : null}

          {payment.tipoContrato?.some((contrato) => contrato.nombre === 'Edificación') ? (
            <>
              <div>
                <h4 className="text-sm font-medium">Información 1:</h4>
                <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion?.find((item) => item.campo === 'informacion1')?.valor || 'No especificado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Área Intervenida:</h4>
                <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion?.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Área bajo cubierta:</h4>
                <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion?.find((item) => item.campo === 'areaBajoCubierta')?.valor || 'No especificado'}</p>
              </div>
            </>
          ) : null}

          {payment.tipoContrato?.some((contrato) => contrato.nombre === 'Obras de Urbanismos') ? (
            <>
              {payment.informacion?.find((item) => item.campo === 'informacion1')?.valor === 'Parques' ? (
                <>
                  <div>
                    <h4 className="text-sm font-medium">Tipo de obra:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion1')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 1:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion2')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 2:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion3')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 3:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion4')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 4:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion5')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Área Intervenida:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
                  </div>
                </>
              ) : payment.informacion?.find((item) => item.campo === 'informacion1')?.valor === 'Espacio Publico' ? (
                <div>
                  <h4 className="text-sm font-medium">Área Intervenida:</h4>
                  <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
                </div>
              ) : payment.informacion?.find((item) => item.campo === 'informacion1')?.valor === 'Escenario Deportivo' ? (
                <>
                  <div>
                    <h4 className="text-sm font-medium">Información 1:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion2')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 2:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion3')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Área Intervenida:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
                  </div>
                </>
              ) : payment.informacion?.find((item) => item.campo === 'informacion1')?.valor === 'Plaza' ? (
                <div>
                  <h4 className="text-sm font-medium">Área Intervenida:</h4>
                  <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
                </div>
              ) : payment.informacion?.find((item) => item.campo === 'informacion1')?.valor === 'Cubierta polideportiva' ? (
                <div>
                  <h4 className="text-sm font-medium">Área Intervenida:</h4>
                  <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
                </div>
              ) : payment.informacion?.find((item) => item.campo === 'informacion1')?.valor === 'Cancha' ? (
                <>
                  <div>
                    <h4 className="text-sm font-medium">Área Intervenida:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'areaIntervenida')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 1:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion2')?.valor || 'No especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Información 2:</h4>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{payment.informacion.find((item) => item.campo === 'informacion3')?.valor || 'No especificado'}</p>
                  </div>
                </>
              ) : (
                <div>No hay información sobre el contrato</div>
              )}
            </>
          ) : null}

          <div>
            <h4 className="text-sm font-medium">Actividad Principal:</h4>
            <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">
              {Array.isArray(payment.actividadPrincipal) ? payment.actividadPrincipal.map((actividad) => actividad.nombre).join(', ') || 'No especificado' : 'No especificado'}
            </p>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="documentoCargado">
              Documentos Soporte Cargados
            </label>

            {/* Mostrar los documentos cargados */}
            <div className="space-y-2">
              {payment.documentoCargado.length > 0 ? (
                payment.documentoCargado.map((doc) => (
                  <div key={doc.name} className="flex items-center space-x-2">
                    <span className="max-w-[6rem] truncate text-sm text-gray-600">{doc.name}</span>
                    <a
                      className="text-blue-600 hover:underline"
                      href={doc.url} // Enlaza al archivo PDF
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Ver documento
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay documentos cargados.</p>
              )}
            </div>
          </div>
          <div className="mb-2 flex flex-col items-start lg:flex-col">
            {payment.adiciones && payment.adiciones.length > 0 ? (
              <div className="space-y-2">
                {payment.adiciones.map((adicion, index) => (
                  <div key={adicion.id}>
                    <span className="font-medium">Adición {index + 1}: </span>
                    <p className="rounded-lg border bg-gray-100 p-2 dark:bg-gray-800">{formatNumber(adicion.value)}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="default" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
