'use client'

import { useEffect, useRef } from 'react'

interface Props {
  speed?: number
  density?: number
  pulse?: boolean
  comets?: boolean
  style?: React.CSSProperties
  className?: string
}

export default function PixelGalaxy({
  speed = 3,
  density = 6,
  pulse = true,
  comets = true,
  style,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef({ speed, density, pulse, comets })
  propsRef.current = { speed, density, pulse, comets }

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let W = 0, H = 0, maxR = 0

    function resize() {
      const w = c!.clientWidth || 520
      const h = c!.clientHeight || 520
      c!.width = Math.round(w * dpr)
      c!.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      W = w; H = h
      maxR = Math.min(w, h) / 2 * 0.94
    }

    function _g() {
      return Math.random() + Math.random() + Math.random() - 1.5
    }

    const arms = 2, turns = 0.95

    /* background field stars */
    type Star = { fx: number; fy: number; b: number; tw: number; ph: number; sz: number }
    const stars: Star[] = []
    for (let i = 0; i < 110; i++) {
      stars.push({
        fx: Math.random(), fy: Math.random(),
        b: 0.15 + Math.random() * 0.5,
        tw: 0.6 + Math.random() * 3,
        ph: Math.random() * 7,
        sz: Math.random() < 0.15 ? 1.4 : 0.8,
      })
    }

    /* nebula blobs */
    type Blob = { fr: number; a0: number; rad: number; col: number[]; al: number }
    const blobs: Blob[] = []
    for (let i = 0; i < 90; i++) {
      const f = Math.pow(Math.random(), 1.25)
      const arm = i % arms
      const a0 = arm * (Math.PI * 2 / arms) + turns * Math.PI * 2 * f + _g() * (0.45 + 0.4 * (1 - f))
      const rr = Math.random()
      const col = f < 0.28
        ? (rr < 0.5 ? [255, 150, 225] : [220, 110, 255])
        : f < 0.6
          ? (rr < 0.5 ? [180, 80, 245] : [150, 70, 235])
          : [110, 55, 215]
      blobs.push({ fr: f, a0, rad: (0.10 + Math.random() * 0.16) * (1 - 0.3 * f), col, al: 0.05 + 0.07 * Math.random() })
    }
    for (let i = 0; i < 14; i++) {
      blobs.push({ fr: Math.random() * 0.12, a0: Math.random() * Math.PI * 2, rad: 0.12 + Math.random() * 0.1, col: [255, 175, 235], al: 0.05 + 0.04 * Math.random() })
    }

    /* star particles */
    type Particle = { a0: number; fr: number; col: number[]; bb: number; r: number; halo: boolean; tw: number; ph: number }
    function genParticles(d: number): Particle[] {
      const count = Math.round(360 * d)
      const parts: Particle[] = []
      for (let i = 0; i < count; i++) {
        const f = Math.pow(Math.random(), 1.75)
        let fr = f
        const inArm = Math.random() < 0.8
        const base = inArm
          ? (i % arms) * (Math.PI * 2 / arms) + turns * Math.PI * 2 * f
          : Math.random() * Math.PI * 2
        const spread = inArm ? (0.13 + 0.5 * (1 - f)) : 1.0
        const a0 = base + _g() * spread
        fr += _g() * 0.012
        if (fr < 0.004) fr = 0.004
        let col: number[], bb: number
        if (f < 0.10)       { col = [255, 244, 252]; bb = 0.95 }
        else if (f < 0.30)  { col = [255, 150, 222]; bb = 0.78 }
        else if (f < 0.55)  { col = [210, 110, 255]; bb = 0.60 }
        else if (f < 0.78)  { col = [155, 85, 250];  bb = 0.46 }
        else                 { col = [110, 65, 225];  bb = 0.32 }
        bb *= 0.5 + 0.65 * Math.random()
        let halo = false
        if (Math.random() < 0.05) { col = [255, 235, 252]; bb = 1; halo = true }
        parts.push({ a0, fr, col, bb, r: 0.5 + Math.random() * 1.0, halo, tw: 0.8 + Math.random() * 3, ph: Math.random() * 7 })
      }
      return parts
    }
    const parts = genParticles(density)

    /* comet */
    type Comet = { x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[] } | null
    let comet: Comet = null
    let nextComet = 3000 + Math.random() * 4000

    function updateComet(t: number) {
      if (!propsRef.current.comets) { comet = null; return }
      const now = t * 1000
      if (!comet && now > nextComet) {
        const edge = Math.floor(Math.random() * 4)
        let x: number, y: number
        if      (edge === 0) { x = -20; y = Math.random() * H }
        else if (edge === 1) { x = W + 20; y = Math.random() * H }
        else if (edge === 2) { x = Math.random() * W; y = -20 }
        else                  { x = Math.random() * W; y = H + 20 }
        const tx = W / 2 + (Math.random() - 0.5) * W * 0.45
        const ty = H / 2 + (Math.random() - 0.5) * H * 0.45
        const dx = tx - x, dy = ty - y
        const len = Math.hypot(dx, dy)
        const sp = W * 0.32 + Math.random() * W * 0.2
        comet = { x, y, vx: dx / len * sp, vy: dy / len * sp, trail: [] }
      }
      if (comet) {
        const cm = comet, dt = 1 / 60
        cm.x += cm.vx * dt; cm.y += cm.vy * dt
        cm.trail.unshift({ x: cm.x, y: cm.y })
        if (cm.trail.length > 22) cm.trail.pop()
        ctx.globalCompositeOperation = 'lighter'
        for (let i = cm.trail.length - 1; i >= 0; i--) {
          const tp = cm.trail[i]
          const f = 1 - i / cm.trail.length
          ctx.globalAlpha = f * 0.85
          ctx.fillStyle = '#fff4fb'
          ctx.beginPath()
          ctx.arc(tp.x, tp.y, 0.6 + f * 1.6, 0, 6.2832)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        if (cm.x < -40 || cm.x > W + 40 || cm.y < -40 || cm.y > H + 40) {
          comet = null
          nextComet = now + 5000 + Math.random() * 9000
        }
      }
    }

    function draw(t: number) {
      const cx = W / 2, cy = H / 2
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      for (const s of stars) {
        const b = s.b * (0.45 + 0.55 * Math.sin(t * s.tw + s.ph))
        if (b <= 0) continue
        ctx.globalAlpha = b
        ctx.fillStyle = '#cdd6ff'
        ctx.beginPath()
        ctx.arc(s.fx * W, s.fy * H, s.sz, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      ctx.globalCompositeOperation = 'lighter'
      const ang = t * (propsRef.current.speed * 0.06)

      for (const d of blobs) {
        const a = d.a0 + ang
        const x = cx + Math.cos(a) * d.fr * maxR
        const y = cy + Math.sin(a) * d.fr * maxR
        const R = d.rad * maxR
        const grad = ctx.createRadialGradient(x, y, 0, x, y, R)
        grad.addColorStop(0, `rgba(${d.col[0]},${d.col[1]},${d.col[2]},${d.al.toFixed(3)})`)
        grad.addColorStop(1, `rgba(${d.col[0]},${d.col[1]},${d.col[2]},0)`)
        ctx.fillStyle = grad
        ctx.fillRect(x - R, y - R, R * 2, R * 2)
      }

      for (const p of parts) {
        const a = p.a0 + ang
        const x = cx + Math.cos(a) * p.fr * maxR
        const y = cy + Math.sin(a) * p.fr * maxR
        const tw = 0.7 + 0.3 * Math.sin(t * p.tw + p.ph)
        const b = p.bb * tw
        if (p.halo) {
          ctx.globalAlpha = b * 0.18
          ctx.fillStyle = `rgb(${p.col[0]},${p.col[1]},${p.col[2]})`
          ctx.beginPath()
          ctx.arc(x, y, p.r * 3.5, 0, 6.2832)
          ctx.fill()
        }
        ctx.globalAlpha = Math.min(1, b)
        ctx.fillStyle = `rgb(${p.col[0]},${p.col[1]},${p.col[2]})`
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      const pulseVal = propsRef.current.pulse ? 0.8 + 0.2 * Math.sin(t * 1.6) : 1
      const cr = maxR * 0.26 * pulseVal
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr)
      grad.addColorStop(0, `rgba(255,248,253,${(0.95 * pulseVal).toFixed(3)})`)
      grad.addColorStop(0.25, `rgba(255,200,240,${(0.6 * pulseVal).toFixed(3)})`)
      grad.addColorStop(0.6, `rgba(220,110,255,${(0.22 * pulseVal).toFixed(3)})`)
      grad.addColorStop(1, 'rgba(160,70,255,0)')
      ctx.fillStyle = grad
      ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2)

      updateComet(t)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(c)

    const t0 = performance.now()
    let raf = 0
    const loop = (now: number) => {
      draw((now - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, []) // props accessed via propsRef — stable closure

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
      className={className}
    />
  )
}
