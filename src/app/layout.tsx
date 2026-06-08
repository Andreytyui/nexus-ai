import type { Metadata, Viewport } from 'next';
import LenisProvider from '@/providers/LenisProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXUS.AI — Portfolio',
  description: 'AI Engineer Portfolio',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
