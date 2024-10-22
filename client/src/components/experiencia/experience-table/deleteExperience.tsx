import type { Payment } from './experience-table'

import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export const deleteExperience = async (payment: Payment) => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `No podrás revertir esta acción. Se eliminará el contrato: ${payment.contrato}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    // Aquí iría la lógica para eliminar el registro (llamada a API, etc.)
    await Swal.fire({
      title: 'Eliminado',
      text: `El contrato ${payment.contrato} ha sido eliminado.`,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    })
  }

  return result
}
