export interface Payment {
  valor: number
}

// Obtener todas las actividades
export const obtenerTotalValorSmmlvPart2 = async (): Promise<Payment[]> => {
  const response = await fetch('https://servidor-vercel-bice.vercel.app/dashboard/sum-valor-smmlv-part2')

  if (!response.ok) {
    throw new Error('Error al obtener las actividades')
  }

  return (await response.json()) as Payment[]
}

export const obtenerTotalValorSmmlv = async (): Promise<Payment[]> => {
  const response = await fetch('https://servidor-vercel-bice.vercel.app/wdashboard/sum-valor-smmlv')

  if (!response.ok) {
    throw new Error('Error al obtener las actividades')
  }

  return (await response.json()) as Payment[]
}
