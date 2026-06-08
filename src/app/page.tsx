import { readFileSync } from 'fs';
import path from 'path';
import PortfolioShell from '@/components/PortfolioShell/PortfolioShell';
import type { SiteContent } from '@/types';

export default function Home() {
  const filePath = path.join(process.cwd(), 'src/data/content.json');
  const content: SiteContent = JSON.parse(readFileSync(filePath, 'utf-8'));
  return <PortfolioShell content={content} />;
}
