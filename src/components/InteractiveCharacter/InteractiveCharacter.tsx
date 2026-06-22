'use client';

import { RefObject, useRef, useState } from 'react';
import { useInteractiveVideoScrub } from '@/hooks/useInteractiveVideoScrub';
import styles from './InteractiveCharacter.module.css';

export default function InteractiveCharacter({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const lookVideoRef = useRef<HTMLVideoElement>(null);
  const [lookLoaded, setLookLoaded] = useState(false);
  useInteractiveVideoScrub({ containerRef, videoRef: lookVideoRef });

  return (
    <div className={styles.wrap} data-cursor="character">
      {!lookLoaded && <div className={styles.loading}><span /></div>}
      <video
        ref={lookVideoRef}
        className={`${styles.video} ${lookLoaded ? styles.loaded : ''}`}
        src="/videos/andrey-chibi-scrub.mp4"
        poster="/videos/andrey-chibi-poster.jpg"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setLookLoaded(true)}
      />
      <div className={styles.glass} aria-hidden="true" />
      <p className={styles.hint}><span /> Mova o cursor — eu acompanho.</p>
    </div>
  );
}
