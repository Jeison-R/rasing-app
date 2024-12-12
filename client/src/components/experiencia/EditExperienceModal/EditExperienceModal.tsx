import type { Experiencia, Adicion } from '../experience-table/interface'
import type { Salario } from '../../services/salario/salarioService'
import type { Actividad } from '../../actividad/actividadTable/actividad-table'
import type { Documento } from '../../documentoSoporte/documentoTable/documento-table'
import type { Contrato } from '../../tipoContrato/tipoContratoTable/tipoContrato-table'
import type { OptionActivity } from '../modalAddExperiencia/AddExperienciaModal'
import type { OptionDocument } from '../modalAddExperiencia/AddExperienciaModal'
import type { OptionTipoContrato } from '../modalAddExperiencia/AddExperienciaModal'

import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'
import { useState, useEffect, type ChangeEvent } from 'react'
import { X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'
import Select from 'react-select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

import { storage } from '../../../firebase/firebase'
import { obtenerDocumentosSoporte } from '../../services/documento/documentoService'
import { obtenerActividades } from '../../services/actividad/actividadService'
import { obtenerTiposContrato } from '../../services/tipoContrato/contratoService'
import { obtenerSalarios } from '../../services/salario/salarioService'
import { opcionesModalidad } from '../modalAddExperiencia/AddExperienciaModal'
import { getCustomSelectStyles } from '../../custom-select/customSelectStyles'

interface EditExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  payment: Experiencia | null
  onSave: (updatedPayment: Experiencia) => void
  onExperienciaEdit: () => void
}

export function EditExperienceModal({ isOpen, onClose, payment, onSave, onExperienciaEdit }: EditExperienceModalProps): JSX.Element | null {
  const [rup, setRup] = useState<string>('')
  const [entidadContratante, setEntidadContratante] = useState<string>('')
  const [contratoNo, setContratoNo] = useState<string>('')
  const [socio, setSocio] = useState<string>('')
  const [modalidad, setModalidad] = useState<string>('')
  const [objeto, setObjeto] = useState<string>('')
  const [contratista, setContratista] = useState<string>('')
  const [empresa, setEmpresa] = useState<string>('')
  const [documentoSoporte, setDocumentoSoporte] = useState<Documento[]>([])
  const [tipoContrato, setTipoContrato] = useState<Contrato[]>([])
  const [actividadPrincipal, setActividadPrincipal] = useState<Actividad[]>([])
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
  const [salariosMinimos, setSalariosMinimos] = useState<Salario[]>([])
  const [files, setFiles] = useState<File[]>([]) // Para almacenar nuevos archivos cargados
  const [documentoSoporteUrls, setDocumentoSoporteUrls] = useState<{ name: string; url: string }[]>([])
  const [opcionesDocumentoSoporte, setOpcionesDocumentoSoporte] = useState<OptionDocument[]>([])
  const [opcionesActividadPrincipal, setOpcionesActividadPrincipal] = useState<OptionActivity[]>([])
  const [opcionesTipoContrato, setOpcionesTipoContrato] = useState<OptionTipoContrato[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (payment) {
      // Poblar los campos con los datos actuales de 'payment'
      setRup(payment.rup)
      setEntidadContratante(payment.entidad)
      setContratoNo(payment.contrato)
      setSocio(payment.socio)
      setContratista(payment.contratista)
      setEmpresa(payment.Empresa)
      setModalidad(payment.modalidad)
      setObjeto(payment.objeto)
      setTipoContrato(payment.tipoContrato ?? [])
      setActividadPrincipal(payment.actividadPrincipal ?? [])
      setDocumentoSoporte(payment.documentoSoporte ?? [])
      setFiles(
        payment.documentoCargado.map((file) => {
          const newFile = new File([file.url], file.name, {
            type: 'application/octet-stream'
          })

          return newFile
        })
      )
      setFechaInicio(payment.fechaInicio)
      setFechaTerminacion(payment.fechaTerminacion)
      setValorInicial(payment.valorInicial)
      setPartPorcentaje(payment.partPorcentaje)
      setValorFinalAfectado(payment.valorFinalAfectado)
      setValorSmmlv(payment.valorSmmlv)
      setValorSmmlvPart2(payment.valorSmmlvPart2)
      setAnioTerminacion(payment.anioTerminacion)
      setAdiciones(payment.adiciones || [])
      setValorActual(payment.valorActual)
    }
  }, [payment])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files

    if (selectedFiles) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)])
    }
  }

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        // Cargar opciones de documento soporte
        const documentos = await obtenerDocumentosSoporte()

        setOpcionesDocumentoSoporte(
          documentos.map((doc: Documento) => ({ value: doc.id, label: doc.nombre })) // Ajusta según los campos reales
        )

        // Cargar opciones de actividad principal
        const actividades = await obtenerActividades()

        setOpcionesActividadPrincipal(actividades.map((act: Actividad) => ({ value: act.id, label: act.nombre })))

        // Cargar opciones de tipo de contrato
        const tiposContratos = await obtenerTiposContrato()

        setOpcionesTipoContrato(
          tiposContratos.map((contrato: Contrato) => ({ value: contrato.id, label: contrato.nombre })) // Ajusta según los campos reales
        )
      } catch (error) {
        global.console.error('Error al cargar opciones:', error)
      }
    }

    void cargarOpciones()
  }, [])

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)) // Eliminar archivo de la lista de nuevos archivos
  }

  const validateForm = (): boolean => {
    let isValid = true

    // Verificar campos vacíos
    if (!rup.trim()) {
      void Swal.fire('Error', 'El campo Nº RUP no puede estar vacío', 'error')
      isValid = false
    } else if (!entidadContratante.trim()) {
      void Swal.fire('Error', 'El campo Entidad no puede estar vacío', 'error')
      isValid = false
    } else if (!empresa.trim()) {
      void Swal.fire('Error', 'El campo Empresa no puede estar vacío', 'error')
      isValid = false
    } else if (!contratoNo.trim()) {
      void Swal.fire('Error', 'El campo Contrato No no puede estar vacío', 'error')
      isValid = false
    } else if (!socio.trim()) {
      void Swal.fire('Error', 'El campo Socio no puede estar vacío', 'error')
      isValid = false
    } else if (!contratista.trim()) {
      void Swal.fire('Error', 'El campo Contratista no puede estar vacío', 'error')
      isValid = false
    } else if (!modalidad.trim()) {
      void Swal.fire('Error', 'El campo Modalidad no puede estar vacío', 'error')
      isValid = false
    } else if (!objeto.trim()) {
      void Swal.fire('Error', 'El campo Objeto no puede estar vacío', 'error')
      isValid = false
    } else if (!documentoSoporte.length) {
      void Swal.fire('Error', 'Debe seleccionar al menos un Documento Soporte', 'error')
      isValid = false
    } else if (!tipoContrato.length) {
      void Swal.fire('Error', 'Debe seleccionar al menos un Tipo Contrato', 'error')
      isValid = false
    } else if (!actividadPrincipal.length) {
      void Swal.fire('Error', 'Debe seleccionar al menos una Actividad Principal', 'error')
      isValid = false
    } else if (!fechaInicio.trim()) {
      void Swal.fire('Error', 'El campo Fecha de Inicio no puede estar vacío', 'error')
      isValid = false
    } else if (!fechaTerminacion.trim()) {
      void Swal.fire('Error', 'El campo Fecha de Terminación no puede estar vacío', 'error')
      isValid = false
    } else if (!valorInicial) {
      void Swal.fire('Error', 'El campo Valor Inicial no puede estar vacío', 'error')
      isValid = false
    } else if (!partPorcentaje) {
      void Swal.fire('Error', 'El campo Part. % no puede estar vacío', 'error')
      isValid = false
    }

    if (documentoSoporteUrls.length === 0 && files.length === 0) {
      void Swal.fire('Error', 'Debe tener al menos un documento cargado', 'error')
      isValid = false
    }

    return isValid
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Primero subimos los archivos y verificamos duplicados
      const storageDirRef = ref(storage, 'documentos')
      const existingFiles = await listAll(storageDirRef)
      const documentosSubidos: { name: string; url: string }[] = []

      for (const file of files) {
        const duplicateFile = existingFiles.items.find((item) => item.name.startsWith(file.name))

        if (duplicateFile) {
          // Si el archivo ya existe, obtenemos la URL existente
          const existingUrl = await getDownloadURL(duplicateFile)

          documentosSubidos.push({ name: file.name, url: existingUrl })
        } else {
          // Si no existe, subimos el archivo y obtenemos su URL
          const storageRef = ref(storage, `documentos/${file.name}-${uuidv4()}`)

          await uploadBytes(storageRef, file)

          const url = await getDownloadURL(storageRef)

          documentosSubidos.push({ name: file.name, url })
        }
      }
      // Esperamos que todas las promesas de carga se resuelvan

      // Actualizamos el objeto de experiencia con los nuevos datos y URLs de los documentos subidos
      const updatedPayment: Experiencia = {
        ...payment,
        Empresa: empresa,
        rup: rup,
        entidad: entidadContratante,
        contrato: contratoNo,
        contratista: contratista,
        socio: socio,
        modalidad: modalidad,
        objeto: objeto,
        tipoContrato: tipoContrato,
        actividadPrincipal: actividadPrincipal,
        documentoSoporte: documentoSoporte,
        documentoCargado: [
          ...documentoSoporteUrls.map((doc) => ({
            name: doc.name,
            url: doc.url
          })),
          ...documentosSubidos // Agregamos las URLs de los nuevos documentos subidos
        ],
        fechaInicio: fechaInicio,
        fechaTerminacion: fechaTerminacion,
        valorInicial: valorInicial,
        partPorcentaje: partPorcentaje,
        valorFinalAfectado: valorFinalAfectado,
        anioTerminacion: anioTerminacion,
        valorSmmlv: valorSmmlv,
        valorSmmlvPart2: valorSmmlvPart2,
        adiciones: adiciones,
        valorActual: valorActual
      }

      // Enviar los datos actualizados a la API
      const response = await fetch(`https://servidor-rasing.onrender.com/experiencias/ActualizarExperiencia/${updatedPayment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updatedPayment)
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la experiencia')
      }

      // Mostrar mensaje de éxito
      void Swal.fire({
        title: 'Actualizado',
        text: 'Los cambios se han guardado exitosamente',
        icon: 'success',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      })
      onSave(updatedPayment)
      onExperienciaEdit()
      resetForm()
      onClose()
    } catch (error) {
      global.console.error('Error:', error)
      void Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar la experiencia',
        icon: 'error',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = (): void => {
    // Restablecer el formulario
    setRup('')
    setEntidadContratante('')
    setContratoNo('')
    setSocio('')
    setModalidad('')
    setObjeto('')
    setDocumentoSoporte([])
    setTipoContrato([])
    setActividadPrincipal([])
    setFechaInicio('')
    setFechaTerminacion('')
    setValorInicial(0)
    setPartPorcentaje(0)
    setValorFinalAfectado(0)
    setAnioTerminacion(new Date().getFullYear())
    setValorSmmlv(0)
    setValorSmmlvPart2(0)
    setAdiciones([])
    setValorActual(0)
    setDocumentoSoporteUrls([])
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-ES') // Formato para español (puntos de miles)
  }

  // Función para quitar los separadores de miles y trabajar con el valor real
  const parseNumber = (formattedNumber: string): number => {
    return Number(formattedNumber.replace(/\./g, '').replace(/,/g, '.')) // Reemplaza puntos y comas correctamente
  }

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

  const addAdicion = (): void => {
    setAdiciones([...adiciones, { id: uuidv4(), value: 0 }])
  }

  const removeAdicion = (id: string): void => {
    setAdiciones(adiciones.filter((adicion) => adicion.id !== id))
  }

  const updateAdicion = (id: string, value: number): void => {
    setAdiciones(adiciones.map((adicion) => (adicion.id === id ? { ...adicion, value } : adicion)))
  }

  useEffect(() => {
    const cargarSalarios = async () => {
      try {
        const salarios = await obtenerSalarios() // Llamada a tu servicio API

        setSalariosMinimos(salarios) // Almacena los salarios en el estado
      } catch (error) {
        global.console.error('Error al cargar salarios mínimos:', error)
      }
    }

    void cargarSalarios()
  }, [])

  const obtenerSalarioMinimo = (anio: number): number | undefined => {
    const salario = salariosMinimos.find((item) => item.año === anio) // Asegúrate de que 'anio' coincida con la clave correcta de tu respuesta

    return salario ? salario.valor : undefined
  }

  const obtenerUltimoSalarioMinimo = (): number => {
    if (salariosMinimos.length === 0) return 0

    // Encontrar el salario mínimo con el año más reciente
    const salarioUltimoAno = salariosMinimos.reduce((max, salario) => (salario.año > max.año ? salario : max))

    return salarioUltimoAno.valor
  }

  useEffect(() => {
    const ultimoSalarioMinimo = obtenerUltimoSalarioMinimo()
    const valorCalculado = valorSmmlvPart2 * ultimoSalarioMinimo // Multiplicar por el salario mínimo actual

    setValorActual(valorCalculado)
  }, [valorSmmlvPart2, salariosMinimos])

  useEffect(() => {
    if (fechaTerminacion) {
      const anio = new Date(fechaTerminacion).getFullYear()

      setAnioTerminacion(anio)
    }
  }, [fechaTerminacion])

  useEffect(() => {
    const salarioMinimo = obtenerSalarioMinimo(anioTerminacion)

    if (salarioMinimo) {
      const valorEnSmmlv = valorFinalAfectado / salarioMinimo

      setValorSmmlv(valorEnSmmlv)
    }
  }, [anioTerminacion, valorFinalAfectado])

  useEffect(() => {
    const valorSmmlvPart2g = valorSmmlv * (partPorcentaje / 100)

    setValorSmmlvPart2(valorSmmlvPart2g)
  }, [valorSmmlv, partPorcentaje])

  useEffect(() => {
    const totalAdiciones = adiciones.reduce((total, current) => total + current.value, 0)

    setValorFinalAfectado(valorInicial + totalAdiciones)
  }, [adiciones, valorInicial])

  if (!isOpen || !payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-[hsl(20,14.3%,4.1%)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar Experiencia</h3>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {isLoading ? (
          <div className="z-60 absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <LoadingSpinner />
          </div>
        ) : null}
        <form
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault()
            void handleEdit(e)
          }}
        >
          <div>
            <label className="block text-sm font-medium" htmlFor="empresa">
              Empresa
            </label>
            <Input
              className="w-full rounded-lg border p-2"
              id="empresa"
              name="empresa"
              placeholder="Nombre empresa"
              value={empresa}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmpresa(e.target.value)
              }}
            />
          </div>
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
              Entidad Contratante
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
              Socio Aportante / Propio
            </label>
            <Input
              id="socio"
              value={socio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSocio(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="socio">
              Contratista
            </label>
            <Input
              id="contratista"
              value={contratista}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setContratista(e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="documento-soporte">
              Documento Soporte
            </label>
            <Select
              isMulti
              options={opcionesDocumentoSoporte} // Asegúrate de que opcionesDocumentoSoporte esté definido
              styles={getCustomSelectStyles}
              value={documentoSoporte.map((ds) => ({ value: ds.id, label: ds.nombre }))} // Ajusta según la estructura de los datos
              onChange={(selected) => {
                setDocumentoSoporte(
                  selected.map((option) => ({
                    id: option.value, // Asegúrate de que 'value' sea el ID correspondiente
                    nombre: option.label // Asegúrate de que 'label' sea el nombre correspondiente
                  }))
                ) // Asignamos un array de tipo Documento
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="modalidad">
              Modalidad
            </label>
            <select
              className="w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)]"
              id="modalidad"
              name="modalidad"
              value={modalidad}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setModalidad(e.target.value)
              }}
            >
              {opcionesModalidad.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <label className="block text-sm font-medium" htmlFor="objeto">
              Objeto
            </label>
            <textarea
              className="w-full rounded-lg border p-2 dark:bg-[hsl(20,14.3%,4.1%)]"
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
            <label className="block text-sm font-medium" htmlFor="tipo-contrato">
              Tipo Contrato
            </label>
            <Select
              isMulti
              options={opcionesTipoContrato} // Asegúrate de que opcionesTipoContrato esté definido
              styles={getCustomSelectStyles}
              value={tipoContrato.map((tc) => ({ value: tc.id, label: tc.nombre }))} // Ajusta según la estructura de los datos
              onChange={(selected) => {
                setTipoContrato(
                  selected.map((option) => ({
                    id: option.value, // Asegúrate de que 'value' sea el ID correspondiente
                    nombre: option.label // Asegúrate de que 'label' sea el nombre correspondiente
                  }))
                ) // Asignamos un array de tipo Contrato
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="actividad-principal">
              Actividad Principal
            </label>
            <Select
              isMulti
              options={opcionesActividadPrincipal} // Asegúrate de que opcionesActividadPrincipal esté definido
              styles={getCustomSelectStyles}
              value={actividadPrincipal.map((ap) => ({ value: ap.id, label: ap.nombre }))} // Ajusta según la estructura de los datos
              onChange={(selected) => {
                setActividadPrincipal(
                  selected.map((option) => ({
                    id: option.value, // Asegúrate de que 'value' sea el ID correspondiente
                    nombre: option.label // Asegúrate de que 'label' sea el nombre correspondiente
                  }))
                ) // Asignamos un array de tipo Actividad
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
            <label className="block text-sm font-medium" htmlFor="anioTerminacion">
              Año de Terminación
            </label>
            <Input
              disabled
              id="anioTerminacion"
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
              name="valorInicial"
              placeholder="Valor Inicial"
              type="text"
              value={formatNumber(valorInicial)} // Formatea el valor con separadores de miles
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleValorInicialChange(e.target.value)
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
            <Input disabled type="text" value={formatNumber(valorFinalAfectado)} />
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
            <label className="block text-sm font-medium" htmlFor="valorActual">
              Valor Actual
            </label>
            <Input disabled id="valorActual" type="text" value={formatNumber(valorActual)} />
          </div>

          <br />

          <div>
            <label className="block text-sm font-medium" htmlFor="adiciones">
              Adiciones
            </label>
            {adiciones.map((adicion) => (
              <div key={adicion.id} className="mb-2 flex items-center">
                <Input
                  type="text"
                  value={formatNumber(adicion.value)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateAdicion(adicion.id, parseFloat(e.target.value.replace(/\./g, '')) || 0)
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
            <label className="mb-2 block text-sm font-medium" htmlFor="documentosCargados">
              Documentos Soporte Cargados
            </label>

            {files.map((file) => (
              <li key={file.name} className="flex items-center justify-between text-sm text-gray-600">
                <span className="truncate">{file.name}</span>
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  type="button"
                  onClick={() => {
                    removeFile(files.indexOf(file))
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
            {/* Campo para cargar nuevos documentos */}
            <div className="relative flex w-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-400 p-4 transition-colors hover:border-gray-500">
              <input
                multiple
                accept="application/pdf"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                id="documentosCargados"
                name="documentosCargados"
                type="file"
                onChange={handleFileChange}
              />
              <span className="text-xs text-gray-600">{files.length > 0 ? `${files.length} documentos seleccionados` : 'Haz clic aquí para cargar documentos PDF'}</span>
            </div>

            {/* Mostrar nombres de los nuevos archivos seleccionados */}
          </div>
          <div className="col-span-1 flex justify-end md:col-span-2 lg:col-span-4">
            <Button disabled={isLoading} type="submit" variant="default">
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
