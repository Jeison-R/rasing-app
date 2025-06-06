import type { Metadata } from 'next'

import { CustomTable } from '@/components/experiencia/experience-table/experience-table'

export const metadata: Metadata = {
  title: 'Experiencias' // Título específico para la página de login
}

export default function ExperiencesPage() {
  return (
    <div className="w-full">
      <CustomTable />
    </div>
  )
}
