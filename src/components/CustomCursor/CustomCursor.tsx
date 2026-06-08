'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useGSAP(() => {
    gsap.set([dotRef.current, ringRef.current], {
      xPercent: -50,
      yPercent: -50,
      x: -200,
      y: -200,
    });
    xTo.current = gsap.quickTo(ringRef.current, 'x', { duration: 0.22, ease: 'power3.out' });
    yTo.current = gsap.quickTo(ringRef.current, 'y', { duration: 0.22, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      gsap.set(dotRef.current!, { x: e.clientX, y: e.clientY });
      xTo.current?.(e.clientX);
      yTo.current?.(e.clientY);
    };

    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = styles.ripple;
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 0.55, xPercent: -50, yPercent: -50 },
        {
          scale: 4,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          onComplete: () => ripple.remove(),
        }
      );
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
