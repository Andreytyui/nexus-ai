'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PanelId, SiteContent } from '@/types';
import CustomCursor from '@/components/CustomCursor/CustomCursor';
import LightningSplit from '@/components/LightningSplit/LightningSplit';
import Hero from '@/components/Hero/Hero';
import Overlay from '@/components/Overlay/Overlay';

// Secret sequence: A → D → M (within 1.2s) opens /admin
const SECRET = ['a', 'd', 'm'];

export default function PortfolioShell({ content }: { content: SiteContent }) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const router  = useRouter();
  const buf     = useRef<string[]>([]);
  const timer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing inside an input / textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      buf.current.push(e.key.toLowerCase());

      // Keep only last N keys
      if (buf.current.length > SECRET.length) buf.current.shift();

      // Reset the window timer
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => { buf.current = []; }, 1200);

      // Check match
      if (buf.current.join('') === SECRET.join('')) {
        buf.current = [];
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [router]);

  return (
    <>
      <CustomCursor />
      <LightningSplit />
      <Hero activePanel={activePanel} onOpenPanel={setActivePanel} />
      <Overlay activePanel={activePanel} onClose={() => setActivePanel(null)} content={content} />
    </>
  );
}
