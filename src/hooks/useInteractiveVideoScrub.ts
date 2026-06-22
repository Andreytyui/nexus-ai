'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

type Options = {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  smoothing?: number;
};

export function useInteractiveVideoScrub({
  containerRef,
  videoRef,
  smoothing = 0.11,
}: Options) {
  const targetTime = useRef(0);
  const currentTime = useRef(0);
  const duration = useRef(0);
  const frame = useRef<number | null>(null);
  const interacting = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const center = () => duration.current * 0.5;
    const clamp = (value: number) =>
      Math.max(0.04, Math.min(Math.max(0.04, duration.current - 0.04), value));

    const seek = (clientX: number) => {
      const rect = container.getBoundingClientRect();
      const normalized = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      targetTime.current = clamp(normalized * duration.current);
    };

    const animate = () => {
      const delta = targetTime.current - currentTime.current;
      currentTime.current += delta * smoothing;
      if (Math.abs(video.currentTime - currentTime.current) > 0.012 && video.readyState >= 2) {
        video.currentTime = clamp(currentTime.current);
      }
      frame.current = requestAnimationFrame(animate);
    };

    const onMetadata = () => {
      duration.current = Number.isFinite(video.duration) ? video.duration : 0;
      targetTime.current = center();
      currentTime.current = center();
      video.currentTime = clamp(center());
      if (!reducedMotion && frame.current === null) frame.current = requestAnimationFrame(animate);
    };

    const onMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === 'touch' && !interacting.current) return;
      const rect = container.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) {
        targetTime.current = center();
        return;
      }
      seek(event.clientX);
    };
    const onDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        reducedMotion ||
        event.pointerType !== 'touch' ||
        target?.closest('a, button, input, textarea, select, [role="button"]')
      ) return;
      interacting.current = true;
      container.setPointerCapture?.(event.pointerId);
      seek(event.clientX);
    };
    const onUp = (event: PointerEvent) => {
      interacting.current = false;
      if (container.hasPointerCapture?.(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    };
    const onLeave = () => {
      interacting.current = false;
      targetTime.current = center();
    };
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) targetTime.current = center();
    };

    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    container.addEventListener('pointerleave', onLeave);

    if (video.readyState >= 1) onMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      container.removeEventListener('pointerleave', onLeave);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [containerRef, videoRef, reducedMotion, smoothing]);
}
