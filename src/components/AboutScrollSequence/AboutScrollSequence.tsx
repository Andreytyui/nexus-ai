'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './AboutScrollSequence.module.css';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function AboutScrollSequence() {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const duration = useRef(0);
  const targetTime = useRef(0);
  const currentTime = useRef(0);
  const frame = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    const safeTime = (value: number) =>
      Math.max(0.04, Math.min(Math.max(0.04, duration.current - 0.04), value));

    const update = () => {
      const rect = track.getBoundingClientRect();
      const start = window.innerHeight * 0.72;
      const distance = Math.max(1, rect.height - window.innerHeight * 0.5);
      const progress = clamp((start - rect.top) / distance);
      const visibility = clamp(progress * 7);
      targetTime.current = safeTime(progress * duration.current);
      track.style.setProperty('--sequence-progress', progress.toFixed(4));
      track.style.setProperty('--sequence-opacity', visibility.toFixed(4));
      track.style.setProperty('--sequence-shift', `${((1 - visibility) * 34).toFixed(2)}px`);
    };

    const animate = () => {
      currentTime.current += (targetTime.current - currentTime.current) * 0.14;
      if (!reducedMotion && video.readyState >= 2 && Math.abs(video.currentTime - currentTime.current) > 0.012) {
        video.currentTime = safeTime(currentTime.current);
      }
      frame.current = requestAnimationFrame(animate);
    };

    const onMetadata = () => {
      duration.current = Number.isFinite(video.duration) ? video.duration : 0;
      update();
      currentTime.current = targetTime.current;
      video.currentTime = reducedMotion ? safeTime(duration.current * 0.55) : safeTime(currentTime.current);
      if (frame.current === null) frame.current = requestAnimationFrame(animate);
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    if (video.readyState >= 1) onMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [reducedMotion]);

  return (
    <div ref={trackRef} className={styles.track} aria-hidden="true">
      <div className={styles.sticky}>
        <div className={styles.frame}>
          {!loaded && <div className={styles.loading}><span /></div>}
          <video
            ref={videoRef}
            className={loaded ? styles.loaded : ''}
            src="/videos/andrey-chibi-fall-scroll.mp4"
            poster="/videos/andrey-chibi-fall-poster.jpg"
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            onCanPlay={() => setLoaded(true)}
          />
          <div className={styles.overlay} />
          <div className={styles.label}><span>SEQUENCE / 02</span><i /> SCROLL CONTROLLED</div>
        </div>
      </div>
    </div>
  );
}
