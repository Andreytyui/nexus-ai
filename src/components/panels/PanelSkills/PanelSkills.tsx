'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Skill } from '@/types';
import styles from './PanelSkills.module.css';

interface Props {
  isActive: boolean;
  onClose: () => void;
  skills: Skill[];
}

export default function PanelSkills({ isActive, onClose, skills }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!panelRef.current) return;
    if (isActive) {
      gsap.fromTo(
        panelRef.current,
        { y: 28, scale: 0.97, opacity: 0, pointerEvents: 'none' },
        { y: 0, scale: 1, opacity: 1, pointerEvents: 'all', duration: 0.65, ease: 'power3.out' }
      );
      const bars = panelRef.current.querySelectorAll<HTMLElement>(`.${styles.fill}`);
      gsap.fromTo(
        bars,
        { width: '0%' },
        {
          width: (_i, el) => `${el.dataset.pct}%`,
          duration: 0.9,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    } else {
      const bars = panelRef.current.querySelectorAll<HTMLElement>(`.${styles.fill}`);
      gsap.set(bars, { width: '0%' });
      gsap.to(panelRef.current, { opacity: 0, scale: 0.97, y: 16, pointerEvents: 'none', duration: 0.35, ease: 'power2.in' });
    }
  }, [isActive]);

  return (
    <div ref={panelRef} className={styles.panel}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.tag}>// 03 — Skills</div>
        <h2 className={styles.title}>Technical Stack</h2>
        <div className={styles.grid}>
          {skills.map((s) => (
            <div key={s.name} className={styles.item}>
              <div className={styles.row}>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.pct}>{s.pct}%</span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} data-pct={s.pct} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
