import type { Metadata } from 'next'

import DocumentosRegulares from '../../components/doc-regulares/documentos-regulares'

export const metadata: Metadata = {
  title: 'Documentos Regulares'
}

export default function ExperiencesPage() {
  return (
    <div className="w-full">
      <DocumentosRegulares />
    </div>
  )
}
