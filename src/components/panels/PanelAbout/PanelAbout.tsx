'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { SiteContent } from '@/types';
import styles from './PanelAbout.module.css';

interface Props {
  isActive: boolean;
  onClose: () => void;
  about: SiteContent['about'];
}

function wrapBio(text: string, max = 50): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; }
    else { cur = cur ? cur + ' ' + w : w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function PanelAbout({ isActive, onClose, about }: Props) {
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

        {/* ── Header ── */}
        <div className={styles.header}>
          <span className={styles.tag}>// 01 — About</span>
          <h2 className={styles.name}>{about.name}</h2>
          <p className={styles.role}>{about.role}</p>
        </div>

        <div className={styles.divider} />

        {/* ── Code block ── */}
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            <span className={styles.dot} style={{ background: '#ff5f57' }} />
            <span className={styles.dot} style={{ background: '#febc2e' }} />
            <span className={styles.dot} style={{ background: '#28c840' }} />
            <span className={styles.fileName}>profile.ts</span>
          </div>
          <pre className={styles.codeBody}>
            <code>
              <span className={styles.comment}>{'/**'}</span>{'\n'}
              {wrapBio(about.bio).map((line, i) => (
                <span key={i} className={styles.comment}>{` * ${line}`}{'\n'}</span>
              ))}
              <span className={styles.comment}>{' */'}</span>{'\n'}
              {'\n'}
              <span className={styles.kw}>const </span>
              <span className={styles.varName}>dev</span>
              <span className={styles.plain}>: </span>
              <span className={styles.type}>Profile</span>
              <span className={styles.plain}> = {'{'}</span>{'\n'}
              {'  '}<span className={styles.key}>role</span>
              <span className={styles.plain}>:      </span>
              <span className={styles.str}>&quot;{about.role.split(' · ')[0]}&quot;</span>
              <span className={styles.plain}>,</span>{'\n'}
              {'  '}<span className={styles.key}>focus</span>
              <span className={styles.plain}>:     </span>
              <span className={styles.str}>&quot;{about.role.split(' · ')[1] ?? 'Builder'}&quot;</span>
              <span className={styles.plain}>,</span>{'\n'}
              {'  '}<span className={styles.key}>location</span>
              <span className={styles.plain}>:  </span>
              <span className={styles.str}>&quot;{about.location}&quot;</span>
              <span className={styles.plain}>,</span>{'\n'}
              {'  '}<span className={styles.key}>stack</span>
              <span className={styles.plain}>:     </span>
              <span className={styles.plain}>[</span>
              {about.stack.slice(0, 3).map((s, i) => (
                <span key={i} className={styles.str}>&quot;{s.label}&quot;{i < 2 ? <span className={styles.plain}>, </span> : null}</span>
              ))}
              <span className={styles.plain}>, …],</span>{'\n'}
              {'  '}<span className={styles.key}>available</span>
              <span className={styles.plain}>: </span>
              <span className={styles.bool}>{about.available ? 'true' : 'false'}</span>
              <span className={styles.plain}>,</span>{'\n'}
              <span className={styles.plain}>{'}'}</span>
            </code>
          </pre>
        </div>

        {/* ── Bottom row ── */}
        <div className={styles.bottom}>
          <div className={styles.stackWrap}>
            <span className={styles.bottomLabel}>stack</span>
            <div className={styles.techRow}>
              {about.stack.map(({ label, color }) => (
                <span
                  key={label}
                  className={styles.techPill}
                  style={{ '--pill-color': color } as React.CSSProperties}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.metaWrap}>
            <div className={styles.statRow}>
              {[
                { v: about.stats.years,    l: 'yrs'  },
                { v: about.stats.projects, l: 'proj' },
                { v: about.stats.coffee,   l: 'café' },
              ].map(({ v, l }) => (
                <div key={l} className={styles.stat}>
                  <span className={styles.statVal}>{v}</span>
                  <span className={styles.statLbl}>{l}</span>
                </div>
              ))}
            </div>
            {about.available && (
              <div className={styles.badge}>
                <span className={styles.badgeDot} />
                open_to_work
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
