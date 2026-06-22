'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './EducationSequence.module.css';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function EducationSequence({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const duration = useRef(0);
  const target = useRef(0);
  const current = useRef(0);
  const frame = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const safeTime = (value: number) =>
      Math.max(0.04, Math.min(Math.max(0.04, duration.current - 0.04), value));

    const update = () => {
      const rect = section.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.88 - rect.top) / (window.innerHeight * 0.82));
      target.current = safeTime(progress * duration.current);
    };

    const animate = () => {
      current.current += (target.current - current.current) * 0.12;
      if (!reducedMotion && video.readyState >= 2 && Math.abs(video.currentTime - current.current) > 0.012) {
        video.currentTime = safeTime(current.current);
      }
      frame.current = requestAnimationFrame(animate);
    };

    const onMetadata = () => {
      duration.current = Number.isFinite(video.duration) ? video.duration : 0;
      update();
      current.current = target.current;
      video.currentTime = reducedMotion ? safeTime(duration.current * 0.76) : safeTime(current.current);
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
  }, [reducedMotion, sectionRef]);

  return (
    <div className={styles.visual} aria-hidden="true">
      {!loaded && <div className={styles.loading}><span /></div>}
      <video
        ref={videoRef}
        className={loaded ? styles.loaded : ''}
        src="/videos/andrey-chibi-education-study.mp4"
        poster="/videos/andrey-chibi-education-poster.jpg"
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        onCanPlay={() => setLoaded(true)}
      />
      <div className={styles.overlay} />
      <div className={styles.meta}><span>LEARNING / CONTINUOUS</span><i /> 05</div>
    </div>
  );
}
