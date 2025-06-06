import type { Metadata } from 'next'

import { CustomTable } from '@/components/salario/salarioTable/salarios'

export const metadata: Metadata = {
  title: 'Salarios Minimos' // Título específico para la página de login
}

export default function SalaryPage() {
  return (
    <div className="w-full">
      <CustomTable />
    </div>
  )
}
