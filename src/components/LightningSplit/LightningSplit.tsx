'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const COLOR_SRC = '/videos/andrey-color.mp4'
const AURA_SRC  = '/videos/andrey-aura.mp4'
const VIDEO_POS = 'center 19%'   // ancora nos rostos — ajuste se necessário
const LERP      = 0.07

export default function LightningSplit() {
  const colorVideoRef = useRef<HTMLVideoElement>(null)
  const auraVideoRef  = useRef<HTMLDivElement>(null)
  const lineRef       = useRef<HTMLDivElement>(null)
  const splitX        = useRef(50)
  const targetX       = useRef(50)
  const rafId         = useRef(0)

  // Sync vídeos (mesmo currentTime)
  useEffect(() => {
    const id = setInterval(() => {
      const color = colorVideoRef.current
      const aura  = auraVideoRef.current?.querySelector('video') as HTMLVideoElement | null
      if (color && aura && Math.abs(color.currentTime - aura.currentTime) > 0.1) {
        aura.currentTime = color.currentTime
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // rAF loop — lerp sem re-renders
  useEffect(() => {
    const tick = () => {
      splitX.current += (targetX.current - splitX.current) * LERP
      const x = splitX.current

      if (auraVideoRef.current)
        auraVideoRef.current.style.clipPath =
          `polygon(${x}% 0%, 100% 0%, 100% 100%, ${x}% 100%)`

      if (lineRef.current)
        lineRef.current.style.left = `${x}%`

      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)

    // window bypassa o z-index 10 do Hero
    const onMove  = (e: MouseEvent)  => {
      targetX.current = Math.max(2, Math.min(98, (e.clientX / window.innerWidth) * 100))
    }
    const onLeave = () => { targetX.current = 50 }
    const onTouch = (e: TouchEvent) => {
      targetX.current = Math.max(2, Math.min(98, (e.touches[0].clientX / window.innerWidth) * 100))
    }

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchend', onLeave)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onLeave)
    }
  }, [])

  const videoStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: VIDEO_POS,
    display: 'block',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
        zIndex: 0,
      }}
    >
      {/* z-index 1 — vídeo colorido (esquerda, sempre visível) */}
      <video
        ref={colorVideoRef}
        autoPlay loop muted playsInline
        poster="/videos/ambos.png"
        style={{ ...videoStyle, zIndex: 1 }}
      >
        <source src={COLOR_SRC} type="video/mp4" />
      </video>

      {/* z-index 2 — vídeo aura (direita, clipped pelo mouse) */}
      <div
        ref={auraVideoRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
          willChange: 'clip-path',
        }}
      >
        <video
          autoPlay loop muted playsInline
          style={videoStyle}
        >
          <source src={AURA_SRC} type="video/mp4" />
        </video>
      </div>

      {/* z-index 3 — linha luminosa */}
      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          top: 0, height: '100%',
          width: '2px',
          left: '50%',
          zIndex: 3,
          pointerEvents: 'none',
          transform: 'translateX(-50%) skewX(-3deg)',
          willChange: 'left',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(58,240,200,0.95) 15%, #ffffff 50%, rgba(58,240,200,0.95) 85%, transparent 100%)',
          boxShadow: '0 0 14px rgba(58,240,200,1), 0 0 40px rgba(58,240,200,0.55), 0 0 100px rgba(58,240,200,0.2)',
        }}
      />
    </motion.div>
  )
}
