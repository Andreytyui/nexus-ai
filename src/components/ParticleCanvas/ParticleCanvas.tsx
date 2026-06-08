'use client';

import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import styles from './ParticleCanvas.module.css';

const COLORS = ['58,240,200', '183,36,255', '77,143,255'];

class Particle {
  x = 0; y = 0; s = 0; vx = 0; vy = 0; o = 0; phase = 0; hue = COLORS[0];
  w: number; h: number;

  constructor(w: number, h: number, initial = false) {
    this.w = w; this.h = h;
    this.reset(initial);
  }

  reset(initial = false) {
    this.x = Math.random() * this.w;
    this.y = initial ? Math.random() * this.h : this.h + 10;
    this.s = Math.random() * 1.1 + 0.2;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.o = Math.random() * 0.4 + 0.1;
    this.phase = Math.random() * Math.PI * 2;
    this.hue = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.phase += 0.01;
    this.o = 0.15 + Math.abs(Math.sin(this.phase)) * 0.35;
    if (this.y < -10 || this.x < -10 || this.x > this.w + 10) this.reset(false);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.hue},${this.o})`;
    ctx.fill();
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {}, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, parts: Particle[] = [], raf: number;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      parts = Array.from({ length: 50 }, () => new Particle(w, h, true));
    };
    window.addEventListener('resize', resize);
    resize();

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => { p.update(); p.draw(ctx); });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    let domInterval: ReturnType<typeof setInterval>;
    const spawnDom = () => {
      const host = hostRef.current;
      if (!host) return;
      const el = document.createElement('div');
      el.className = styles.particle;
      const c = `rgba(${COLORS[Math.floor(Math.random() * COLORS.length)]},0.8)`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = '100%';
      el.style.background = c;
      el.style.boxShadow = `0 0 8px ${c}`;
      el.style.width = el.style.height = `${1 + Math.random() * 3}px`;
      const dur = 12 + Math.random() * 16;
      el.style.animationDuration = `${dur}s`;
      host.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 200);
    };
    domInterval = setInterval(spawnDom, 280);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(domInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={hostRef} className={styles.host} aria-hidden="true" />
    </>
  );
}
