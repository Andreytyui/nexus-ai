'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './RpgScene.module.css';

export default function RpgScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const orbRefs = [orb1Ref, orb2Ref, orb3Ref, orb4Ref];

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      gsap.to(bgRef.current, { x: dx * 8, y: dy * 4, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(midRef.current, { x: dx * 18, y: dy * 10, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(fgRef.current, { x: dx * 30, y: dy * 14, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });

      orbRefs.forEach((ref) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const odx = e.clientX - (r.left + r.width / 2);
        const ody = e.clientY - (r.top + r.height / 2);
        const dist = Math.sqrt(odx * odx + ody * ody);
        if (dist < 200) {
          const f = (200 - dist) / 200;
          gsap.to(ref.current, {
            x: (-odx / dist) * f * 30,
            y: (-ody / dist) * f * 30,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        } else {
          gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
        }
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className={styles.stage} aria-hidden="true">
      <div className={styles.nebula} />
      <div className={styles.starfield} />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <linearGradient id="manaGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(58,240,200,0)" />
            <stop offset="50%" stopColor="rgba(58,240,200,1)" />
            <stop offset="100%" stopColor="rgba(58,240,200,0)" />
          </linearGradient>
          <linearGradient id="manaGradient2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(183,36,255,0)" />
            <stop offset="50%" stopColor="rgba(183,36,255,1)" />
            <stop offset="100%" stopColor="rgba(183,36,255,0)" />
          </linearGradient>
          <linearGradient id="manaGradient3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(77,143,255,0)" />
            <stop offset="50%" stopColor="rgba(77,143,255,1)" />
            <stop offset="100%" stopColor="rgba(77,143,255,0)" />
          </linearGradient>
          <radialGradient id="islandGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(58,240,200,0.5)" />
            <stop offset="100%" stopColor="rgba(58,240,200,0)" />
          </radialGradient>
        </defs>
      </svg>

      <svg className={styles.manaStream} viewBox="0 0 1600 900" preserveAspectRatio="none">
        <path className={styles.manaPath} d="M-100,200 C300,150 600,350 900,250 S1400,200 1700,300" />
        <path className={`${styles.manaPath} ${styles.manaPathAlt}`} d="M-100,500 C200,450 500,650 800,550 S1300,500 1700,600" />
        <path className={`${styles.manaPath} ${styles.manaPathAlt2}`} d="M-100,750 C400,700 700,800 1000,700 S1500,750 1700,720" />
      </svg>

      <div ref={bgRef} className={`${styles.layer} ${styles.layerBg}`}>
        <svg width="100%" height="320" viewBox="0 0 1600 320" preserveAspectRatio="xMidYEnd slice">
          <path d="M0,320 L0,200 L120,140 L240,180 L360,100 L480,160 L600,80 L720,150 L840,110 L960,170 L1080,90 L1200,160 L1320,130 L1440,180 L1560,120 L1600,160 L1600,320 Z" fill="rgba(58,240,200,0.18)" />
          <g className={styles.floatIsle} transform="translate(220,80)">
            <ellipse cx="0" cy="0" rx="80" ry="14" fill="rgba(77,143,255,0.4)" />
            <path d="M-80,0 L-60,40 L-30,60 L0,55 L30,45 L60,30 L80,0 Z" fill="rgba(40,55,90,0.85)" />
            <ellipse cx="0" cy="0" rx="90" ry="20" fill="url(#islandGlow)" opacity="0.6" />
          </g>
          <g className={`${styles.floatIsle} ${styles.floatIsleDelay1}`} transform="translate(1100,50)">
            <ellipse cx="0" cy="0" rx="100" ry="16" fill="rgba(183,36,255,0.35)" />
            <path d="M-100,0 L-70,50 L-30,70 L20,65 L60,50 L100,0 Z" fill="rgba(35,30,60,0.85)" />
            <ellipse cx="0" cy="0" rx="115" ry="22" fill="url(#islandGlow)" opacity="0.5" />
          </g>
          <g className={`${styles.floatIsle} ${styles.floatIsleDelay2}`} transform="translate(700,30)">
            <ellipse cx="0" cy="0" rx="50" ry="9" fill="rgba(58,240,200,0.4)" />
            <path d="M-50,0 L-30,28 L0,35 L30,25 L50,0 Z" fill="rgba(30,40,70,0.85)" />
          </g>
        </svg>
      </div>

      <div ref={midRef} className={`${styles.layer} ${styles.layerMid}`}>
        <div className={styles.arcaneCircle} style={{ left: '6%', top: '22%' }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <g className={styles.arcaneGlow} stroke="rgba(58,240,200,0.5)" fill="none">
              <circle cx="90" cy="90" r="80" strokeWidth="0.8" />
              <circle cx="90" cy="90" r="65" strokeWidth="0.5" strokeDasharray="2 6" />
              <circle cx="90" cy="90" r="50" strokeWidth="0.6" />
              <polygon points="90,30 142,120 38,120" strokeWidth="0.7" />
              <polygon points="90,150 38,60 142,60" strokeWidth="0.5" opacity="0.6" />
            </g>
          </svg>
        </div>
        <div className={`${styles.arcaneCircle} ${styles.arcaneCircleReverse}`} style={{ right: '5%', top: '52%' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <g className={styles.arcaneGlow} stroke="rgba(183,36,255,0.5)" fill="none">
              <circle cx="70" cy="70" r="62" strokeWidth="0.8" />
              <circle cx="70" cy="70" r="48" strokeWidth="0.5" strokeDasharray="3 4" />
              <circle cx="70" cy="70" r="32" strokeWidth="0.6" />
              <polygon points="70,20 110,90 30,90" strokeWidth="0.7" opacity="0.7" />
            </g>
          </svg>
        </div>
      </div>

      <div ref={orb1Ref} className={`${styles.magicOrb} ${styles.orbFloatA}`} style={{ left: '14%', top: '72%' }} />
      <div ref={orb2Ref} className={`${styles.magicOrb} ${styles.orbPurple} ${styles.orbFloatB}`} style={{ left: '84%', top: '28%' }} />
      <div ref={orb3Ref} className={`${styles.magicOrb} ${styles.orbBlue} ${styles.orbFloatC}`} style={{ left: '32%', top: '22%' }} />
      <div ref={orb4Ref} className={`${styles.magicOrb} ${styles.orbFloatB}`} style={{ left: '68%', top: '78%' }} />

      <div className={styles.rune} style={{ left: '12%', top: '42%', animationDelay: '0s' }}>⟁</div>
      <div className={styles.rune} style={{ left: '88%', top: '62%', animationDelay: '-2s', color: 'rgba(183,36,255,0.7)' }}>◈</div>
      <div className={styles.rune} style={{ left: '25%', top: '82%', animationDelay: '-4s', color: 'rgba(77,143,255,0.7)' }}>⟆</div>
      <div className={styles.rune} style={{ left: '75%', top: '18%', animationDelay: '-1s' }}>⟇</div>
      <div className={styles.rune} style={{ left: '50%', top: '88%', animationDelay: '-5s', color: 'rgba(183,36,255,0.7)' }}>◇</div>
      <div className={styles.rune} style={{ left: '8%', top: '60%', animationDelay: '-6s' }}>⟁</div>

      <div className={styles.wisp} style={{ top: '35%', animationDelay: '0s' }} />
      <div className={styles.wisp} style={{ top: '55%', animationDelay: '-8s' }} />
      <div className={styles.wisp} style={{ top: '75%', animationDelay: '-15s' }} />
      <div className={styles.wisp} style={{ top: '25%', animationDelay: '-4s' }} />

      <div ref={fgRef} className={`${styles.layer} ${styles.layerFg}`}>
        <svg
          width="100%"
          height="180"
          viewBox="0 0 1600 180"
          preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, left: 0, display: 'block' }}
        >
          <path d="M0,180 L0,80 L80,50 L160,90 L240,40 L320,70 L420,30 L520,80 L620,50 L720,90 L820,40 L920,70 L1020,55 L1120,90 L1220,45 L1320,80 L1420,60 L1520,90 L1600,70 L1600,180 Z" fill="rgba(15,25,50,0.95)" />
          <path d="M0,80 L80,50 L160,90 L240,40 L320,70 L420,30 L520,80 L620,50 L720,90 L820,40 L920,70 L1020,55 L1120,90 L1220,45 L1320,80 L1420,60 L1520,90 L1600,70" fill="none" stroke="rgba(58,240,200,0.4)" strokeWidth="1" />
        </svg>
        <div className={styles.fog}>
          <div className={styles.fogBand} />
          <div className={styles.fogBand} />
          <div className={styles.fogBand} />
        </div>
      </div>

      <div className={styles.ambientPulse} />
    </div>
  );
}
