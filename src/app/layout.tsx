import type { Metadata, Viewport } from 'next';
import LenisProvider from '@/providers/LenisProvider';
import './globals.css';

const title = 'Andrey Nonardo — AI Engineer & Prompt Engineer';
const description = 'Portfólio de Andrey Nonardo, AI Engineer e Prompt Engineer especializado em inteligência artificial, automações, plataformas SaaS e desenvolvimento de produtos digitais.';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexus-ai-portfolio-ochre.vercel.app'),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'NEXUS.AI',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050608',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
