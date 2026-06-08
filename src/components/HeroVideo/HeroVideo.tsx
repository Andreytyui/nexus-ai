'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './HeroVideo.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  videoSrc: string;
  headline?: string;
  subHeadline?: string;
}

export default function HeroVideo({
  videoSrc,
  headline = 'Crafting Intelligence One Layer at a Time',
  subHeadline = 'AI Engineer building systems that think, adapt, and evolve.',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = headlineRef.current?.querySelectorAll(`.${styles.word}`);
    const wordArr = words ? Array.from(words) : [];

    gsap.set(overlayRef.current, { opacity: 0 });
    gsap.set(hudRef.current, { y: -30, opacity: 0 });
    gsap.set(wordArr, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(subRef.current, { y: 28, opacity: 0 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.4, defaults: { ease: 'power3.out' } });

    tl.to(overlayRef.current, { opacity: 1, duration: 0.8 })
      .to(hudRef.current, { y: 0, opacity: 1, duration: 0.7 }, 0.3)
      .to(wordArr, { clipPath: 'inset(0% 0 0 0)', duration: 0.9, stagger: 0.08 }, 0.7)
      .to(subRef.current, { y: 0, opacity: 1, duration: 0.7 }, '-=0.28')
      .to(scrollIndicatorRef.current, { opacity: 0.4, duration: 0.7 }, '-=0.1')
      .call(() => {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 1,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

    // Scroll-driven exit: spacer drives the scroll trigger, container fades out
    const scrollConfig = {
      trigger: spacerRef.current,
      start: 'top top',
      end: '+=540',
      scrub: 0.7,
    };

    gsap.to(videoRef.current, {
      scale: 1.07,
      ease: 'none',
      scrollTrigger: scrollConfig,
    });

    gsap.to(containerRef.current, {
      opacity: 0,
      ease: 'power1.in',
      scrollTrigger: {
        ...scrollConfig,
        onUpdate: (self) => {
          if (self.progress > 0.06) {
            gsap.to(scrollIndicatorRef.current, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.in',
              overwrite: true,
            });
          }
        },
        onLeave: () => {
          if (containerRef.current) containerRef.current.style.pointerEvents = 'none';
        },
        onEnterBack: () => {
          if (containerRef.current) {
            containerRef.current.style.pointerEvents = '';
            gsap.to(scrollIndicatorRef.current, {
              opacity: 1,
              duration: 0.4,
              ease: 'power3.out',
              overwrite: true,
            });
          }
        },
      },
    });
  }, []);

  const words = headline.split(' ');

  return (
    <>
      <div ref={containerRef} className={styles.container}>
        <video
          ref={videoRef}
          className={styles.video}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
        />

        <div ref={overlayRef} className={styles.overlay} />

        <header ref={hudRef} className={styles.hud}>
          <div className={styles.logo}>
            NEXUS<span className={styles.logoDot}>.</span>AI
          </div>
          <nav className={styles.nav}>
            {['Home', 'Sobre', 'Projetos', 'Contato'].map((item) => (
              <a
                key={item}
                href="#"
                className={styles.navLink}
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            ))}
          </nav>
        </header>

        <div className={styles.center}>
          <div
            ref={headlineRef}
            className={styles.headline}
            aria-label={headline}
          >
            {words.map((word, i) => (
              <span key={i} className={styles.wordWrap}>
                <span className={styles.word}>{word}</span>
              </span>
            ))}
          </div>
          <p ref={subRef} className={styles.sub}>
            {subHeadline}
          </p>
        </div>

        <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
          <span className={styles.scrollText}>scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </div>

      {/* Invisible spacer — gives the page scrollable height to drive the exit animation */}
      <div ref={spacerRef} className={styles.spacer} aria-hidden="true" />
    </>
  );
}
