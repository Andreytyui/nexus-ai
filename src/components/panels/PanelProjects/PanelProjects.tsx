'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Project } from '@/types';
import styles from './PanelProjects.module.css';

interface Props {
  isActive: boolean;
  onClose: () => void;
  projects: Project[];
}

export default function PanelProjects({ isActive, onClose, projects }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!panelRef.current) return;
    if (isActive) {
      gsap.fromTo(
        panelRef.current,
        { y: 28, scale: 0.97, opacity: 0, pointerEvents: 'none' },
        { y: 0, scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.65, ease: 'power3.out' }
      );
      const cards = panelRef.current.querySelectorAll(`.${styles.card}`);
      gsap.fromTo(cards, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power3.out', delay: 0.28 });
    } else {
      gsap.to(panelRef.current, { opacity: 0, scale: 0.97, y: 16, pointerEvents: 'none', duration: 0.35, ease: 'power2.in' });
    }
  }, [isActive]);

  return (
    <div ref={panelRef} className={styles.panel}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.tag}>// 02 — Projects</div>
        <h2 className={styles.title}>Projetos</h2>
        <div className={styles.grid}>
          {projects.map((p) => {
            const thumb = (
              <div className={styles.thumb} style={!p.image && p.grad ? { background: p.grad } : undefined}>
                {p.image ? (
                  <img src={p.image} alt={p.name} className={styles.thumbImg} />
                ) : (
                  <>
                    <div className={styles.thumbGrad} />
                    <div className={styles.thumbLabel}>{p.name.split(' ').slice(0, 2).join('\n')}</div>
                  </>
                )}
              </div>
            );

            const info = (
              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <div className={styles.name}>{p.name}</div>
                  {p.url && <span className={styles.extIcon}>↗</span>}
                </div>
                <div className={styles.desc}>{p.desc}</div>
                <div className={styles.tags}>
                  {p.tags.map((t) => <span key={t} className={styles.tag2}>{t}</span>)}
                </div>
              </div>
            );

            return p.url ? (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                {thumb}
                {info}
              </a>
            ) : (
              <div key={p.id} className={styles.card}>
                {thumb}
                {info}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
