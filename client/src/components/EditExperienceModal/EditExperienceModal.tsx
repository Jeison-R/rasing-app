import type { Payment, Adicion } from '../experience-table/experience-table'

import { useState, useEffect, type ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import Select from 'react-select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Importamos las opciones de tipo de contrato y actividad principal desde experience-table
import { activityOptions } from '../actividad-documentos/actividad-table'
import { documentOptions } from '../actividad-documentos/documento-table'
import { tipoContratoOptions } from '../actividad-documentos/tipoContrato-table'
import { salariosMinimos } from '../salarios-table/salarios'

interface EditExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Payment | null
  onSave: (updatedPayment: Payment) => void
}

export function EditExperienceModal({ isOpen, onClose, payment, onSave }: EditExperienceModalProps): JSX.Element | null {
  const [rup, setRup] = useState<string>('')
  const [entidadContratante, setEntidadContratante] = useState<string>('')
  const [contratoNo, setContratoNo] = useState<string>('')
  const [socio, setSocio] = useState<string>('')
  const [modalidad, setModalidad] = useState<string>('')
  const [objeto, setObjeto] = useState<string>('')
  const [documentoSoporte, setDocumentoSoporte] = useState<string[]>([])
  const [tipoContrato, setTipoContrato] = useState<string[]>([])
  const [actividadPrincipal, setActividadPrincipal] = useState<string[]>([])
  const [fechaInicio, setFechaInicio] = useState<string>('')
  const [fechaTerminacion, setFechaTerminacion] = useState<string>('')
  const [valorInicial, setValorInicial] = useState<number>(0)
  const [partPorcentaje, setPartPorcentaje] = useState<number>(0)
  const [valorFinalAfectado, setValorFinalAfectado] = useState<number>(0)
  const [anioTerminacion, setAnioTerminacion] = useState<number>(new Date().getFullYear())
  const [valorSmmlv, setValorSmmlv] = useState<number>(0)
  const [valorSmmlvPart2, setValorSmmlvPart2] = useState<number>(0)
  const [adiciones, setAdiciones] = useState<Adicion[]>([])
  const [valorActual, setValorActual] = useState<number>(0)

  useEffect(() => {
    if (payment) {
      // Poblar los campos con los datos actuales de 'payment'
      setRup(payment.RUP) // Poblar el campo RUP
      setEntidadContratante(payment.Entidad)
      setContratoNo(payment.Contrato)
      setSocio(payment.Contratista)
      setModalidad(payment.Modalidad)
      setObjeto(payment.Objeto)
      setTipoContrato(payment.TipoContrato.split(', '))
      setActividadPrincipal(payment.ActividadPrincipal.split(', '))
      setDocumentoSoporte(payment.DocumentoSoporte.split(', '))
      setFechaInicio(payment.FechaInicio)
      setFechaTerminacion(payment.FechaTerminacion)
      setValorInicial(payment.ValorInicial)
      setPartPorcentaje(payment.PartPorcentaje)
      setValorFinalAfectado(payment.ValorFinalAfectado)
      setValorSmmlv(payment.ValorSmmlv) // Poblar el Valor en SMMLV
      setValorSmmlvPart2(payment.ValorSmmlvPart2) // Poblar Valor en SMMLV % Part2
      setAnioTerminacion(payment.AnioTerminacion)
      setAdiciones(payment.Adiciones || [])
      setValorActual(payment.ValorActual)
    }
  }, [payment])

  const handleSave = (): void => {
    if (!payment) return

    const updatedPayment: Payment = {
      ...payment,
      RUP: rup, // Guardar RUP
      Entidad: entidadContratante,
      Contrato: contratoNo,
      Contratista: socio,
      Modalidad: modalidad,
      TipoContrato: tipoContrato.join(', '),
      ActividadPrincipal: actividadPrincipal.join(', '),
      DocumentoSoporte: documentoSoporte.join(', '),
      FechaInicio: fechaInicio,
      FechaTerminacion: fechaTerminacion,
      ValorInicial: valorInicial,
      PartPorcentaje: partPorcentaje,
      ValorFinalAfectado: valorFinalAfectado,
      AnioTerminacion: anioTerminacion,
      ValorSmmlv: valorSmmlv, // Guardar el valor SMMLV
      ValorSmmlvPart2: valorSmmlvPart2, // Guardar el valor SMMLV Part2
      Adiciones: adiciones,
      ValorActual: valorActual
    }

    onSave(updatedPayment)
    onClose()

    // Mostrar mensaje de guardado exitoso
    void Swal.fire({
      title: 'Guardado',
      text: 'Los cambios se han guardado exitosamente',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }

  const addAdicion = (): void => {
    setAdiciones([...adiciones, { id: uuidv4(), value: 0 }])
  }

  const removeAdicion = (id: string): void => {
    setAdiciones(adiciones.filter((adicion) => adicion.id !== id))
  }

  const updateAdicion = (id: string, value: number): void => {
    setAdiciones(adiciones.map((adicion) => (adicion.id === id ? { ...adicion, value } : adicion)))
  }

  const obtenerSalarioMinimo = (anio: number): number | undefined => {
    const salario = salariosMinimos.find((item) => item.año === anio)

    return salario ? salario.valor : undefined
  }

  useEffect(() => {
    if (fechaTerminacion) {
      const anio = new Date(fechaTerminacion).getFullYear()

      setAnioTerminacion(anio)
    }
  }, [fechaTerminacion])

  const obtenerUltimoSalarioMinimo = (): number => {
    return salariosMinimos[salariosMinimos.length - 1].valor // Último salario mínimo en la tabla
  }

  useEffect(() => {
    const ultimoSalarioMinimo = obtenerUltimoSalarioMinimo()
    const valorCalculado = valorSmmlvPart2 * ultimoSalarioMinimo // Multiplicar por el salario mínimo actual

    setValorActual(valorCalculado)
  }, [valorSmmlvPart2])

  // Actualizar el valor en SMMLV cuando cambia el año de terminación o el valor final afectado
  useEffect(() => {
    if (anioTerminacion && valorFinalAfectado) {
      const salarioMinimo = obtenerSalarioMinimo(anioTerminacion)

      if (salarioMinimo) {
        const valorEnSmmlv = valorFinalAfectado / salarioMinimo

        setValorSmmlv(valorEnSmmlv)
      } else {
        setValorSmmlv(0) // Manejar si no se encuentra el salario mínimo para ese año
      }
    }
  }, [anioTerminacion, valorFinalAfectado])

  useEffect(() => {
    if (valorSmmlv && partPorcentaje) {
      const valorSmmlvPart2g = valorSmmlv * (partPorcentaje / 100) // Multiplicar el valor en SMMLV por el porcentaje

      setValorSmmlvPart2(valorSmmlvPart2g)
    } else {
      setValorSmmlvPart2(0) // Si no hay valor o porcentaje, el resultado es 0
    }
  }, [valorSmmlv, partPorcentaje])

  useEffect(() => {
    // Calculate total value of all additions
    const totalAdiciones = adiciones.reduce((total, current) => total + current.value, 0)

    // Update valorFinalAfectado with the sum of valorInicial and totalAdiciones
    setValorFinalAfectado(valorInicial + totalAdiciones)
  }, [adiciones, valorInicial])

  if (!isOpen || !payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-black">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <div>
            <label className="block text-sm font-medium" htmlFor="rup">
              Nº RUP
            </label>
            <Input
              id="rup"
              value={rup}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRup(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="entidad">
              Entidad
            </label>
            <Input
              id="entidad"
              value={entidadContratante}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEntidadContratante(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contratoNo">
              Contrato No
            </label>
            <Input
              id="contratoNo"
              value={contratoNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setContratoNo(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="socio">
              Contratista
            </label>
            <Input
              id="socio"
              value={socio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSocio(e.target.value)
              }}
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium" htmlFor="objeto">
              Objeto
            </label>
            <textarea
              className="w-full rounded-lg border p-2"
              id="objeto"
              name="objeto"
              placeholder="Descripción del Objeto"
              value={objeto}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setObjeto(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="modalidad">
              Modalidad
            </label>
            <Input
              id="modalidad"
              value={modalidad}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setModalidad(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contrato">
              Documento Soporte
            </label>
            <Select
              isMulti
              options={documentOptions} // Opciones importadas desde experience-table
              value={documentoSoporte.map((tc) => ({ value: tc, label: tc }))}
              onChange={(selected) => {
                setDocumentoSoporte(selected.map((option) => option.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="contrato">
              Tipo Contrato
            </label>
            <Select
              isMulti
              options={tipoContratoOptions} // Opciones importadas desde experience-table
              value={tipoContrato.map((tc) => ({ value: tc, label: tc }))}
              onChange={(selected) => {
                setTipoContrato(selected.map((option) => option.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="actividad">
              Actividad Principal
            </label>
            <Select
              isMulti
              options={activityOptions} // Opciones importadas desde experience-table
              value={actividadPrincipal.map((ap) => ({ value: ap, label: ap }))}
              onChange={(selected) => {
                setActividadPrincipal(selected.map((option) => option.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="fechaInicio">
              Fecha de Inicio
            </label>
            <Input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFechaInicio(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="fechaFin">
              Fecha de Terminación
            </label>
            <Input
              id="fechaFin"
              type="date"
              value={fechaTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFechaTerminacion(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorInicial">
              Año de Terminación
            </label>
            <Input
              disabled
              id="valorInicial"
              type="number"
              value={anioTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAnioTerminacion(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorInicial">
              Valor Inicial
            </label>
            <Input
              id="valorInicial"
              type="number"
              value={valorInicial}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValorInicial(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="Part">
              Part. %
            </label>
            <Input
              id="Part"
              type="number"
              value={partPorcentaje}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartPorcentaje(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorFinal">
              Valor Final Afectado
            </label>
            <Input
              disabled
              type="number"
              value={valorFinalAfectado}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValorFinalAfectado(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorSmmlv">
              Valor en SMMLV
            </label>
            <Input disabled id="valorSmmlv" type="number" value={valorSmmlv.toFixed(2)} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorSmmlvPart2">
              Valor en SMMLV % Part2
            </label>
            <Input disabled id="valorSmmlvPart2" type="number" value={valorSmmlvPart2.toFixed(2)} />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="adiciones">
              Adiciones
            </label>
            {adiciones.map((adicion) => (
              <div key={adicion.id} className="mb-2 flex items-center">
                <Input
                  type="number"
                  value={adicion.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateAdicion(adicion.id, Number(e.target.value))
                  }}
                />
                <Button
                  className="ml-2"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeAdicion(adicion.id)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addAdicion}>
              + Agregar Adición
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="valorSmmlv">
              Valor Actual
            </label>
            <Input disabled id="valorSmmlv" type="number" value={valorActual.toFixed(2)} />
          </div>
        </form>
        <div className="mt-6 flex justify-end">
          <Button variant="default" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}
