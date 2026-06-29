import { readFileSync } from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import GaleriaProjetosStellar from '@/components/GaleriaProjetosStellar/GaleriaProjetosStellar'
import type { SiteContent } from '@/types'

export const metadata: Metadata = {
  title: 'Projetos — Andrey Nonardo',
  description: 'Todos os projetos de Andrey Nonardo, AI Engineer e desenvolvedor full stack.',
}

export default function ProjetosPage() {
  const filePath = path.join(process.cwd(), 'src/data/content.json')
  const content: SiteContent = JSON.parse(readFileSync(filePath, 'utf-8'))
  return <GaleriaProjetosStellar projects={content.projects} />
}
