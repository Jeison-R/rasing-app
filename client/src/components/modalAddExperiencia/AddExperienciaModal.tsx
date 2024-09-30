import type { MultiValue } from 'react-select'

import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import Select from 'react-select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { documentOptions } from '../actividad-documentos/documento-table'
import { activityOptions } from '../actividad-documentos/actividad-table'
import { tipoContratoOptions } from '../actividad-documentos/tipoContrato-table'
import { salariosMinimos } from '../salarios-table/salarios'

interface AddExperenciaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Payment) => void
}

interface OptionDocument {
  value: string
  label: string
}

interface OptionActivity {
  value: string
  label: string
}

interface OptionTipoContrato {
  value: string
  label: string
}

interface Adicion {
  id: string
  value: number
}

export interface Payment {
  id: string
  RUP: string
  Entidad: string
  Contrato: string
  Contratista: string
  Modalidad: string
  Objeto: string
  DocumentoSoporte: string
  TipoContrato: string
  ActividadPrincipal: string
  FechaInicio: string
  FechaTerminacion: string
  ValorSmmlv: number
  ValorSmmlvPart2: number
  ValorActual: number
  ValorInicial: number // Valor inicial del contrato
  PartPorcentaje: number // Participación porcentual
  ValorFinalAfectado: number // Valor final afectado después de adiciones
  AnioTerminacion: number // Año de terminación
  Adiciones?: Adicion[] // Array opcional de adiciones
}

export const opcionesModalidad = [
  { value: '', label: 'Seleccione una modalidad' },
  { value: 'Individual', label: 'Individual' },
  { value: 'Consorcio', label: 'Consorcio' },
  { value: 'Unión Temporal', label: 'Unión Temporal' }
]

export function AddExperienciaModal({ isOpen, onClose, onSave }: Readonly<AddExperenciaModalProps>) {
  const [adiciones, setAdiciones] = useState<Adicion[]>([])
  const [valorInicial, setValorInicial] = useState<number>(0)
  const [partPorcentaje, setPartPorcentaje] = useState<number>(0)
  const [valorSmmlvPart2, setValorSmmlvPart2] = useState<number>(0) // Para almacenar el valor en SMMLV % PART2
  const [valorFinalAfectado, setValorFinalAfectado] = useState<number>(0)
  const [fechaTerminacion, setFechaTerminacion] = useState<string>('')
  const [anioTerminacion, setAnioTerminacion] = useState<number>(new Date().getFullYear())
  const [rup, setRup] = useState<string>('')
  const [entidadContratante, setEntidadContratante] = useState<string>('')
  const [contratoNo, setContratoNo] = useState<string>('')
  const [socio, setSocio] = useState<string>('')
  const [objeto, setObjeto] = useState<string>('')
  const [modalidad, setModalidad] = useState<string>('')
  const [documentoSoporte, setDocumentoSoporte] = useState<string[]>([])
  const [tipoContrato, setTipoContrato] = useState<string[]>([])
  const [actividadPrincipal, setActividadPrincipal] = useState<string[]>([])
  const [fechaInicio, setFechaInicio] = useState<string>('')
  const [valorSmmlv, setValorSmmlv] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [valorActual, setValorActual] = useState<number>(0) // Para almacenar el valor actual basado en el año actual

  useEffect(() => {
    const totalAdiciones = adiciones.reduce((acc, curr) => acc + curr.value, 0)
    const valorFinal = valorInicial + totalAdiciones

    setValorFinalAfectado(valorFinal)
  }, [valorInicial, adiciones])

  useEffect(() => {
    if (fechaTerminacion) {
      const anio = new Date(fechaTerminacion).getFullYear()

      setAnioTerminacion(anio)
    }
  }, [fechaTerminacion])

  const handleSelectDocument = (selectedOptions: MultiValue<OptionDocument>) => {
    setDocumentoSoporte(selectedOptions.map((option) => option.value))
  }

  const handleSelectActivity = (selectedOptions: MultiValue<OptionActivity>) => {
    setActividadPrincipal(selectedOptions.map((option) => option.value))
  }

  const handleSelectTipoDocument = (selectedOptions: MultiValue<OptionTipoContrato>) => {
    setTipoContrato(selectedOptions.map((option) => option.value))
  }

  const addAdicion = () => {
    setAdiciones([...adiciones, { id: uuidv4(), value: 0 }])
  }

  const removeAdicion = (id: string) => {
    setAdiciones(adiciones.filter((adicion) => adicion.id !== id))
  }

  const updateAdicion = (id: string, valor: number) => {
    const newAdiciones = adiciones.map((adicion) => (adicion.id === id ? { ...adicion, value: valor } : adicion))

    setAdiciones(newAdiciones)
  }

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {}

    if (!rup) newErrors.rup = true

    if (!entidadContratante) newErrors.entidadContratante = true

    if (!contratoNo) newErrors.contratoNo = true

    if (!socio) newErrors.socio = true

    if (!objeto) newErrors.objeto = true

    if (!modalidad) newErrors.modalidad = true

    if (documentoSoporte.length === 0) newErrors.tipoContrato = true

    if (actividadPrincipal.length === 0) newErrors.actividadPrincipal = true

    if (!fechaInicio) newErrors.fechaInicio = true

    if (!fechaTerminacion) newErrors.fechaTerminacion = true

    if (!valorInicial) newErrors.valorInicial = true

    if (!partPorcentaje) newErrors.partPorcentaje = true

    if (fechaInicio && fechaTerminacion) {
      const startDate = new Date(fechaInicio)
      const endDate = new Date(fechaTerminacion)

      if (startDate > endDate) {
        // Mostrar alerta de error con SweetAlert2
        void Swal.fire({
          title: 'Error de Fechas',
          text: 'La fecha de inicio no puede ser mayor que la fecha de terminación',
          icon: 'error',
          confirmButtonText: 'OK'
        })

        // Retornar false para indicar que el formulario no es válido
        setErrors(newErrors)

        return false
      }
    }

    // Validar adiciones si existen
    adiciones.forEach((adicion, index) => {
      if (!adicion.value || adicion.value === 0) {
        newErrors[`adicion_${index}`] = true
      }
    })

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newData: Payment = {
      id: uuidv4(),
      RUP: rup,
      Entidad: entidadContratante,
      Contrato: contratoNo,
      Objeto: objeto,
      Contratista: socio,
      Modalidad: modalidad,
      DocumentoSoporte: documentoSoporte.join(', '),
      TipoContrato: tipoContrato.join(', '),
      ActividadPrincipal: actividadPrincipal.join(', '),
      FechaInicio: fechaInicio,
      FechaTerminacion: fechaTerminacion,
      ValorInicial: valorInicial,
      PartPorcentaje: partPorcentaje,
      ValorFinalAfectado: valorFinalAfectado,
      AnioTerminacion: anioTerminacion,
      ValorSmmlv: valorSmmlv,
      ValorActual: valorActual,
      ValorSmmlvPart2: valorSmmlvPart2,
      Adiciones: adiciones.map((adicion) => ({
        id: adicion.id,
        value: adicion.value
      }))
    }

    handleClose()
    onSave(newData)

    // Mostrar alerta de éxito
    void Swal.fire({
      title: 'Guardado',
      text: 'La experiencia se ha guardado exitosamente',
      icon: 'success',
      confirmButtonText: 'OK'
    })

    onClose()
  }

  const handleClose = () => {
    // Restablece todos los campos a sus valores iniciales
    setRup('')
    setEntidadContratante('')
    setContratoNo('')
    setSocio('')
    setObjeto('')
    setModalidad('')
    setDocumentoSoporte([])
    setTipoContrato([])
    setActividadPrincipal([])
    setFechaInicio('')
    setFechaTerminacion('')
    setValorSmmlv(0)
    setAdiciones([])
    setValorInicial(0)
    setPartPorcentaje(0)
    setValorFinalAfectado(0)
    setAnioTerminacion(new Date().getFullYear())
    setErrors({})

    onClose() // Llama a la función pasada como prop para cerrar el modal
  }

  const handleFieldChange = (field: string, value: string | number) => {
    switch (field) {
      case 'rup':
        setRup(value as string)
        break
      case 'entidadContratante':
        setEntidadContratante(value as string)
        break
      case 'contratoNo':
        setContratoNo(value as string)
        break
      case 'socio':
        setSocio(value as string)
        break
      case 'objeto':
        setObjeto(value as string)
        break
      case 'modalidad':
        setModalidad(value as string)
        break
      case 'documentoSoporte':
        setDocumentoSoporte([value as string])
        break
      case 'tipoContrato':
        setTipoContrato([value as string])
        break
      case 'actividadPrincipal':
        setActividadPrincipal([value as string])
        break
      case 'fechaInicio':
        setFechaInicio(value as string)
        break
      case 'fechaTerminacion':
        setFechaTerminacion(value as string)
        break
      case 'valorInicial':
        setValorInicial(value as number)
        break
      case 'valorSmmlv':
        setValorSmmlv(value as number)
        break
      case 'partPorcentaje':
        setPartPorcentaje(value as number)
        break
      case 'valorFinalAfectado':
        setValorFinalAfectado(value as number)
        break
      case 'anioTerminacion':
        setAnioTerminacion(value as number)
        break
      case 'adicion': // Este es un ejemplo de cómo manejar las adiciones si necesitas una adición individual
        setAdiciones((prevAdiciones) => prevAdiciones.map((adicion) => (adicion.id === field ? { ...adicion, value: value as number } : adicion)))
        break
      default:
        break
    }

    // Eliminar el error cuando el usuario comienza a escribir
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
  }

  const obtenerSalarioMinimo = (anio: number): number | undefined => {
    const salario = salariosMinimos.find((item) => item.año === anio)

    return salario ? salario.valor : undefined
  }

  const obtenerUltimoSalarioMinimo = (): number => {
    return salariosMinimos[salariosMinimos.length - 1].valor // Último salario mínimo en la tabla
  }

  useEffect(() => {
    const ultimoSalarioMinimo = obtenerUltimoSalarioMinimo()
    const valorCalculado = valorSmmlvPart2 * ultimoSalarioMinimo // Multiplicar por el salario mínimo actual

    setValorActual(valorCalculado)
  }, [valorSmmlvPart2, salariosMinimos])

  useEffect(() => {
    if (valorSmmlv && partPorcentaje) {
      const valorSmmlvPart2g = valorSmmlv * (partPorcentaje / 100) // Multiplicar el valor en SMMLV por el porcentaje

      setValorSmmlvPart2(valorSmmlvPart2g)
    } else {
      setValorSmmlvPart2(0) // Si no hay valor o porcentaje, el resultado es 0
    }
  }, [valorSmmlv, partPorcentaje])

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

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES') // Formato para español (puntos de miles)
  }

  // Función para quitar los separadores de miles y trabajar con el valor real
  const parseNumber = (formattedNumber: string): number => {
    return Number(formattedNumber.replace(/\./g, '').replace(/,/g, '.')) // Reemplaza puntos y comas correctamente
  }

  // Actualiza el valor del input mientras se escribe
  const handleValorInicialChange = (value: string) => {
    // Utilizar una expresión regular para permitir solo números
    const cleanedValue = value.replace(/[^0-9]/g, '') // Elimina cualquier carácter que no sea un número

    // Convierte el valor limpio a número y actualiza el estado
    const parsedValue = cleanedValue ? parseNumber(cleanedValue) : 0 // Si está vacío, es 0

    setValorInicial(parsedValue)

    if (!parsedValue) {
      setValorSmmlv(0)
    }
  }

  const handleValorFinalAfectadoChange = (value: string) => {
    const parsedValue = parseNumber(value) // Convierte a número real sin separadores

    setValorFinalAfectado(parsedValue)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Añadir Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium" htmlFor="rup">
              Nº RUP
            </label>
            <Input
              className={errors.rup ? 'border-red-500' : ''}
              id="rup"
              name="rup"
              placeholder="Nº RUP"
              value={rup}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('rup', e.target.value)
              }}
            />
            {errors.rup ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="entidadContratante">
              Entidad Contratante
            </label>
            <Input
              className={errors.entidadContratante ? 'border-red-500' : ''}
              id="entidadContratante"
              name="entidadContratante"
              placeholder="Entidad Contratante"
              value={entidadContratante}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('entidadContratante', e.target.value)
              }}
            />
            {errors.entidadContratante ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="contratoNo">
              Contrato No.
            </label>
            <Input
              className={errors.contratoNo ? 'border-red-500' : ''}
              id="contratoNo"
              name="contratoNo"
              placeholder="Contrato No."
              value={contratoNo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('contratoNo', e.target.value)
              }}
            />
            {errors.contratoNo ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="socio">
              Socio Aportante / Propio
            </label>
            <Input
              className={errors.socio ? 'border-red-500' : ''}
              id="socio"
              name="socio"
              placeholder="Socio Aportante / Propio"
              value={socio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('socio', e.target.value)
              }}
            />
            {errors.socio ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium" htmlFor="objeto">
              Objeto
            </label>
            <textarea
              className={`w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)] ${errors.objeto ? 'border-red-500' : ''}`}
              id="objeto"
              name="objeto"
              placeholder="Descripción del Objeto"
              value={objeto}
              onChange={(e) => {
                handleFieldChange('objeto', e.target.value)
              }}
            />
            {errors.objeto ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="modalidad">
              Modalidad
            </label>
            <select
              className={`w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)] ${errors.modalidad ? 'border-red-500' : ''}`}
              id="modalidad"
              name="modalidad"
              value={modalidad}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleFieldChange('modalidad', e.target.value)
              }}
            >
              {opcionesModalidad.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
            {errors.modalidad ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tipoContrato">
              Documentos de soporte
            </label>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={documentOptions}
              value={documentOptions.filter((option) => documentoSoporte.includes(option.value))}
              onChange={handleSelectDocument}
            />
            {errors.tipoContrato ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tipoContrato">
              Tipo Contrato
            </label>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={tipoContratoOptions}
              value={tipoContratoOptions.filter((option) => tipoContrato.includes(option.value))}
              onChange={handleSelectTipoDocument}
            />
            {errors.tipoContrato ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="actividadPrincipal">
              Actividad Principal
            </label>
            <Select
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={activityOptions}
              value={activityOptions.filter((option) => actividadPrincipal.includes(option.value))}
              onChange={handleSelectActivity}
            />
            {errors.actividadPrincipal ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="fechaInicio">
              Fecha de Inicio
            </label>
            <Input
              className={errors.fechaInicio ? 'border-red-500' : ''}
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('fechaInicio', e.target.value)
              }}
            />
            {errors.fechaInicio ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="fechaTerminacion">
              Fecha de Terminación
            </label>
            <Input
              className={errors.fechaTerminacion ? 'border-red-500' : ''}
              id="fechaTerminacion"
              name="fechaTerminacion"
              type="date"
              value={fechaTerminacion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('fechaTerminacion', e.target.value)
              }}
            />
            {errors.fechaTerminacion ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="anioTerminacion">
              Año de Terminación
            </label>
            <Input disabled id="anioTerminacion" name="anioTerminacion" type="number" value={anioTerminacion || ''} />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="partPorcentaje">
              Part. %
            </label>
            <Input
              className={errors.partPorcentaje ? 'border-red-500' : ''}
              id="partPorcentaje"
              name="partPorcentaje"
              placeholder="Part. %"
              type="number"
              value={partPorcentaje}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFieldChange('partPorcentaje', Number(e.target.value))
              }}
            />
            {errors.partPorcentaje ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="valorInicial">
              Valor Inicial
            </label>
            <Input
              id="valorInicial"
              name="valorInicial"
              placeholder="Valor Inicial"
              type="text"
              value={formatNumber(valorInicial)} // Formatea el valor con separadores de miles
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleValorInicialChange(e.target.value)
              }}
            />
            {errors.valorInicial ? <span className="text-red-500">Campo requerido</span> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorFinalAfectado">
              Valor Final Afectado (%) de Part.
            </label>
            <Input
              disabled
              id="valorFinalAfectado"
              name="valorFinalAfectado"
              placeholder="Valor Final Afectado"
              type="text"
              value={formatNumber(valorFinalAfectado)} // Mostrar con separadores de miles
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleValorFinalAfectadoChange(e.target.value)
              }} // Manejar el cambio del input
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorSmmlv">
              Valor en SMMLV
            </label>
            <Input disabled id="valorSmmlv" name="valorSmmlv" placeholder="Valor en SMMLV" type="text" value={formatNumber(valorSmmlv)} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorSmmlvPart2">
              Valor en SMMLV % PART2
            </label>
            <Input
              disabled
              id="valorSmmlvPart2"
              name="valorSmmlvPart2"
              placeholder="Valor en SMMLV % PART2"
              type="text"
              value={formatNumber(valorSmmlvPart2)} // Formatea el valor con separadores de miles
            />
          </div>
          <div>
            <h4 className="mb-1">Adiciones</h4>
            {adiciones.map((adicion, index) => (
              <div key={adicion.id} className="mb-2 flex flex-col items-center lg:flex-row">
                <Input
                  className={errors[`adicion_${index}`] ? 'border-red-500' : ''}
                  placeholder={`Adición ${index + 1}`}
                  type="text"
                  value={formatNumber(adicion.value)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateAdicion(adicion.id, Number(e.target.value))
                  }}
                />
                <Button
                  className="ml-0 mt-2 lg:ml-2 lg:mt-0"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeAdicion(adicion.id)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
                {errors[`adicion_${index}`] ? <span className="ml-2 text-red-500">Valor requerido</span> : null}
              </div>
            ))}
            <Button className="mt-2" type="button" variant="default" onClick={addAdicion}>
              + Agregar Adición
            </Button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="valorActual">
              Valor Actual
            </label>
            <Input disabled id="valorActual" name="valorActual" placeholder="Valor Actual" type="text" value={formatNumber(valorActual)} />
          </div>

          <div className="col-span-1 flex justify-end md:col-span-2 lg:col-span-4">
            <Button type="submit" variant="default">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
