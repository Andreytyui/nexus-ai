'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { SiteContent } from '@/types';
import styles from './PanelCV.module.css';

interface Props {
  isActive: boolean;
  onClose: () => void;
  cv: SiteContent['cv'];
}

export default function PanelCV({ isActive, onClose, cv }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!panelRef.current) return;
    if (isActive) {
      gsap.fromTo(
        panelRef.current,
        { y: 28, scale: 0.97, opacity: 0, pointerEvents: 'none' },
        { y: 0, scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.65, ease: 'power3.out' }
      );
    } else {
      gsap.to(panelRef.current, { opacity: 0, scale: 0.97, y: 16, pointerEvents: 'none', duration: 0.35, ease: 'power2.in' });
    }
  }, [isActive]);

  return (
    <div ref={panelRef} className={styles.panel}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.tag}>// 05 — Trajetória</div>
        <h2 className={styles.title}>Experiência</h2>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Carreira</div>
          {cv.experience.map((e, i) => (
            <div key={i} className={`${styles.entry} ${i === cv.experience.length - 1 ? styles.entryLast : ''}`}>
              <div className={styles.entryRow}>
                <span className={styles.role}>{e.role}</span>
                <span className={styles.period}>{e.period}</span>
              </div>
              <div className={styles.company}>{e.company}</div>
              {e.desc && <div className={styles.entryDesc}>{e.desc}</div>}
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Formação</div>
          {cv.education.map((e, i) => (
            <div key={i} className={`${styles.entry} ${i === cv.education.length - 1 ? styles.entryLast : ''}`}>
              <div className={styles.entryRow}>
                <span className={styles.role}>{e.role}</span>
                <span className={styles.period}>{e.period}</span>
              </div>
              <div className={styles.company}>{e.company}</div>
              {e.desc && <div className={styles.entryDesc}>{e.desc}</div>}
            </div>
          ))}
        </div>

        {cv.cvUrl ? (
          <a href={cv.cvUrl} download="Curriculo-Andrey-Nonardo.pdf" target="_blank" rel="noopener noreferrer" className={styles.download}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Baixar Currículo
          </a>
        ) : null}
      </div>
    </div>
  );
}
