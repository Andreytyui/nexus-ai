'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('has-custom-cursor');
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor],a,button');
      const mode = target?.dataset.cursor || (target ? 'link' : 'default');
      ring.current?.setAttribute('data-mode', mode);
    };
    const render = () => {
      rx += (x - rx) * .18;
      ry += (y - ry) * .18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={dot} className={styles.dot} aria-hidden="true" />
      <div ref={ring} className={styles.ring} aria-hidden="true"><span /></div>
    </>
  );
}
