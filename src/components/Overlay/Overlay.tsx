'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { PanelId, SiteContent } from '@/types';
import PanelAbout from '@/components/panels/PanelAbout/PanelAbout';
import PanelProjects from '@/components/panels/PanelProjects/PanelProjects';
import PanelSkills from '@/components/panels/PanelSkills/PanelSkills';
import PanelCV from '@/components/panels/PanelCV/PanelCV';
import PanelContact from '@/components/panels/PanelContact/PanelContact';
import styles from './Overlay.module.css';

interface OverlayProps {
  activePanel: PanelId | null;
  onClose: () => void;
  content: SiteContent;
}

export default function Overlay({ activePanel, onClose, content }: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!overlayRef.current) return;
    if (activePanel) {
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'all', duration: 0.42, ease: 'power2.out' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.38, ease: 'power2.in' });
    }
  }, [activePanel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <PanelAbout    isActive={activePanel === 'about'}    onClose={onClose} about={content.about} />
      <PanelProjects isActive={activePanel === 'projects'} onClose={onClose} projects={content.projects} />
      <PanelSkills   isActive={activePanel === 'skills'}   onClose={onClose} skills={content.skills} />
      <PanelCV       isActive={activePanel === 'cv'}       onClose={onClose} cv={content.cv} />
      <PanelContact  isActive={activePanel === 'contact'}  onClose={onClose} contact={content.contact} />
    </div>
  );
}
