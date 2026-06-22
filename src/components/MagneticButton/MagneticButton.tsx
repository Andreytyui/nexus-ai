'use client';

import { MouseEvent, ReactNode, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean;
  cursor?: string;
  focusTarget?: string;
};

export default function MagneticButton({
  href,
  children,
  className = '',
  target,
  rel,
  download,
  cursor = 'button',
  focusTarget,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)';
  };

  const activate = (event: MouseEvent<HTMLAnchorElement>) => {
    reset();

    if (!href.startsWith('#')) return;
    const destination = document.querySelector<HTMLElement>(href);
    if (!destination) return;

    event.preventDefault();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const top = destination.getBoundingClientRect().top + window.scrollY - 88;

    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, Math.max(0, top));
    window.history.pushState(null, '', href);
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });

    if (focusTarget) {
      window.setTimeout(() => {
        document.querySelector<HTMLElement>(focusTarget)?.focus({ preventScroll: true });
      }, reduced ? 0 : 100);
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      target={target}
      rel={rel}
      download={download}
      data-cursor={cursor}
      onMouseMove={move}
      onMouseLeave={reset}
      onClick={activate}
    >
      {children}
    </a>
  );
}
