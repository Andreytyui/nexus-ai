'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { PanelId } from '@/types';
import styles from './Hero.module.css';

const ORBIT_ITEMS: { id: PanelId; angle: number; label: string; icon: React.ReactNode }[] = [
  {
    id: 'projects',
    angle: 55,
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'skills',
    angle: 115,
    label: 'Skills',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
  },
  {
    id: 'contact',
    angle: 180,
    label: 'Contact',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: 'cv',
    angle: 245,
    label: 'CV',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'about',
    angle: 305,
    label: 'About',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

const PHOTO_MAP: Record<PanelId | 'front', string> = {
  front:    '/uploads/WhatsApp Image 2026-04-24 at 17.20.39.jpeg',
  about:    '/uploads/ChatGPT Image 24_04_2026, 17_27_43.png',
  cv:       '/uploads/ChatGPT Image 24_04_2026, 17_34_36.png',
  contact:  '/uploads/ChatGPT Image 24_04_2026, 17_43_53.png',
  skills:   '/uploads/ChatGPT Image 24_04_2026, 17_55_22.png',
  projects: '/uploads/ChatGPT Image 24_04_2026, 18_11_53.png',
};

interface HeroProps {
  activePanel: PanelId | null;
  onOpenPanel: (id: PanelId) => void;
}

export default function Hero({ activePanel, onOpenPanel }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLElement>(null);
  const faceStageRef = useRef<HTMLDivElement>(null);
  const faceInnerRef = useRef<HTMLDivElement>(null);
  const bottombarRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = orbitRef.current?.querySelectorAll(`.${styles.orbitItem}`);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(topbarRef.current, { y: -36, opacity: 0, duration: 0.7 }, 0)
      .from(faceStageRef.current, { scale: 0.92, opacity: 0, duration: 0.9 }, 0.1)
      .from(items ? Array.from(items) : [], { scale: 0, opacity: 0, duration: 0.7, stagger: { amount: 0.35, from: 'random' } }, 0.45)
      .from(bottombarRef.current, { y: 36, opacity: 0, duration: 0.7 }, 0.2);
  }, []);

  useGSAP(() => {
    if (!heroRef.current) return;
    if (activePanel) {
      gsap.to(heroRef.current, { filter: 'blur(2px)', opacity: 0.5, duration: 0.45, ease: 'power2.out' });
    } else {
      gsap.to(heroRef.current, { filter: 'blur(0px)', opacity: 1, duration: 0.45, ease: 'power2.out' });
    }
  }, [activePanel]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!faceInnerRef.current) return;
    const r = faceInnerRef.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    gsap.to(faceInnerRef.current, { rotateY: dx * 6, rotateX: -dy * 6, duration: 0.35, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(faceInnerRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
  };

  const [hoveredId, setHoveredId] = useState<PanelId | null>(null);

  const currentPhoto = hoveredId
    ? PHOTO_MAP[hoveredId]
    : activePanel
    ? PHOTO_MAP[activePanel]
    : null;

  return (
    <div ref={heroRef} className={styles.hero}>
      <header ref={topbarRef} className={styles.topbar}>
        <div className={styles.logo}>NEXUS<span>.</span>AI</div>
        <div className={styles.topbarRight}>
          <span><span className={styles.statusDot} />Available</span>
          <span>AI Engineer</span>
        </div>
      </header>

      <div
        ref={faceStageRef}
        className={styles.faceStage}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={faceInnerRef} className={styles.faceInner}>
          <div className={styles.ring} />
          <div className={`${styles.ring} ${styles.ring2}`} />
          <div className={`${styles.ring} ${styles.ring3}`} />

          <div className={styles.faceFrame}>
            {Object.entries(PHOTO_MAP).map(([key, src]) => (
              <img
                key={key}
                src={src}
                alt="Developer"
                className={styles.facePhoto}
                style={{
                  opacity: key === 'front' ? (currentPhoto ? 0 : 1) : (currentPhoto === src ? 1 : 0),
                }}
              />
            ))}
            <div className={styles.scanLine} />
          </div>
        </div>

        <div ref={orbitRef} className={styles.orbitRing}>
          {ORBIT_ITEMS.map(({ id, angle, label, icon }) => (
            <div
              key={id}
              className={styles.orbitItem}
              style={{ '--angle': `${angle}deg` } as React.CSSProperties}
            >
              <button
                className={styles.navOrbBtn}
                onClick={() => onOpenPanel(id)}
                onMouseEnter={() => {
                  setHoveredId(id);
                  gsap.to(`.${styles.navOrbBtn}[data-id="${id}"] .${styles.orbIcon}`, {
                    boxShadow: '0 0 24px rgba(58,240,200,0.5)',
                    borderColor: 'rgba(58,240,200,0.6)',
                    duration: 0.28,
                    ease: 'power2.out',
                  });
                }}
                onMouseLeave={() => setHoveredId(null)}
                data-id={id}
              >
                <div className={styles.orbIcon}>{icon}</div>
                <span className={styles.orbLabel}>{label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile identity text — hidden on desktop via CSS */}
      <div className={styles.mobileInfo}>
        <span className={styles.mobileName}>Andrey Nonardo</span>
        <span className={styles.mobileRole}>AI Engineer</span>
      </div>

      {/* Mobile bottom navigation — hidden on desktop via CSS */}
      <nav className={styles.mobileNav}>
        {ORBIT_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            className={styles.mobileNavBtn}
            onClick={() => onOpenPanel(id)}
          >
            <div className={styles.mobileNavIcon}>{icon}</div>
            <span className={styles.mobileNavLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
