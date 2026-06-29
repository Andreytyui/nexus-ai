'use client'

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Plane } from '@react-three/drei'
import { X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/types'
import PixelGalaxy from './PixelGalaxy'
import styles from './GaleriaProjetosStellar.module.css'

/* ── Context ── */

type GaleriaContextType = {
  selected: Project | null
  setSelected: (p: Project | null) => void
  projects: Project[]
  interactingRef: React.MutableRefObject<boolean>
  onInteract: () => void
}

const GaleriaContext = createContext<GaleriaContextType | undefined>(undefined)

function useGaleria() {
  const ctx = useContext(GaleriaContext)
  if (!ctx) throw new Error('useGaleria fora do provider')
  return ctx
}

function GaleriaProvider({
  children,
  projects,
}: {
  children: React.ReactNode
  projects: Project[]
}) {
  const [selected, setSelected] = useState<Project | null>(null)
  const interactingRef = useRef(false)
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onInteract = useCallback(() => {
    interactingRef.current = true
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    clearTimerRef.current = setTimeout(() => {
      interactingRef.current = false
    }, 1600)
  }, [])

  return (
    <GaleriaContext.Provider value={{ selected, setSelected, projects, interactingRef, onInteract }}>
      {children}
    </GaleriaContext.Provider>
  )
}

/* ── Starfield ── */

function StarfieldBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    el.appendChild(renderer.domElement)

    const geo = new THREE.BufferGeometry()
    const count = 8000
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 2000
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2000
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2000
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, sizeAttenuation: true })
    const stars = new THREE.Points(geo, mat)
    scene.add(stars)
    camera.position.z = 10

    let rafId = 0
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      stars.rotation.y += 0.0001
      stars.rotation.x += 0.00005
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
    }
  }, [])

  return <div ref={mountRef} className={styles.starfield} />
}

/* ── Floating Card ── */

function FloatingCard({
  project,
  position,
}: {
  project: Project
  position: [number, number, number]
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { setSelected } = useGaleria()

  useFrame(({ camera }) => {
    groupRef.current?.lookAt(camera.position)
  })

  return (
    <group ref={groupRef} position={position}>
      <Plane
        args={[5.2, 7.2]}
        onClick={(e) => { e.stopPropagation(); setSelected(project) }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>

      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0.01]}
        style={{
          transition: 'transform 0.28s ease',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '180px',
            borderRadius: '14px',
            overflow: 'hidden',
            background: 'rgba(9,13,24,0.96)',
            padding: '12px',
            boxShadow: hovered
              ? '0 24px 56px rgba(58,240,200,0.35), 0 0 28px rgba(58,240,200,0.18)'
              : '0 14px 32px rgba(0,0,0,0.65)',
            border: hovered
              ? '1px solid rgba(58,240,200,0.52)'
              : '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.name}
              draggable={false}
              style={{
                width: '100%',
                height: '96px',
                objectFit: 'cover',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '96px',
                borderRadius: '8px',
                background: project.grad || 'rgba(58,240,200,0.08)',
              }}
            />
          )}
          <p
            style={{
              marginTop: '9px',
              textAlign: 'center',
              color: '#e8e4d9',
              fontSize: '11px',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.name}
          </p>
        </div>
      </Html>
    </group>
  )
}

/* ── Modal ── */

function CardModal() {
  const { selected, setSelected } = useGaleria()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSelected])

  if (!selected) return null

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) - rect.height / 2) / 16
    const ry = (rect.width / 2 - (e.clientX - rect.left)) / 16
    el.style.transition = 'none'
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transition = 'transform 0.5s ease-out'
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      className={styles.modalBackdrop}
      onClick={(e) => { if (e.target === e.currentTarget) setSelected(null) }}
    >
      <div className={styles.modalWrap}>
        <button className={styles.modalClose} onClick={() => setSelected(null)} aria-label="Fechar">
          <X size={26} />
        </button>

        <div style={{ perspective: '1000px' }}>
          <div
            ref={cardRef}
            className={styles.modalCard}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {selected.image ? (
              <div className={styles.modalImgWrap}>
                <img src={selected.image} alt={selected.name} className={styles.modalImg} />
              </div>
            ) : (
              <div
                className={styles.modalImgPlaceholder}
                style={{ background: selected.grad }}
              />
            )}

            <h2 className={styles.modalTitle}>{selected.name}</h2>
            <p className={styles.modalDesc}>{selected.desc}</p>

            <div className={styles.modalTags}>
              {selected.tags.map((t) => (
                <span key={t} className={styles.modalTag}>{t}</span>
              ))}
            </div>

            {selected.url && (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalBtn}
              >
                Ver Projeto <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Card Galaxy ── */

function CardGalaxy() {
  const { projects } = useGaleria()

  const positions = useMemo<[number, number, number][]>(() => {
    const n = projects.length
    const golden = (1 + Math.sqrt(5)) / 2
    const radius = 10

    return projects.map((_, i) => {
      const y = 1 - (i / Math.max(n - 1, 1)) * 2
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = (2 * Math.PI * i) / golden
      return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius]
    })
  }, [projects.length])

  return (
    <>
      {projects.map((project, i) => (
        <FloatingCard key={project.id} project={project} position={positions[i]} />
      ))}
    </>
  )
}

/* ── Export ── */

export default function GaleriaProjetosStellar({ projects }: { projects: Project[] }) {
  return (
    <GaleriaProvider projects={projects}>
      <div className={styles.root}>
        <StarfieldBackground />

        <div className={styles.galaxyLayer}>
          <PixelGalaxy className={styles.galaxyCanvas} />
        </div>

        <Canvas
          camera={{ position: [0, 0, 20], fov: 58 }}
          className={styles.canvas}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
            gl.domElement.style.pointerEvents = 'auto'
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[12, 12, 12]} intensity={0.9} />
            <pointLight position={[-12, -12, -12]} intensity={0.4} color="#3af0c8" />

            <CardGalaxy />

            <SceneControls />
          </Suspense>
        </Canvas>

        <CardModal />

        <div className={styles.overlay}>
          <div className={styles.overlayInfo}>
            <h1 className={styles.overlayTitle}>Todos os Projetos</h1>
            <p className={styles.overlayHint}>
              Arraste para explorar · Scroll para zoom · Clique no card para detalhes
            </p>
          </div>
          <Link href="/" className={styles.backBtn}>← Voltar</Link>
        </div>
      </div>
    </GaleriaProvider>
  )
}

function SceneControls() {
  const { onInteract } = useGaleria()
  const { gl } = useThree()

  useEffect(() => {
    const el = gl.domElement
    const onDown = () => onInteract()
    const onWheel = () => onInteract()
    const onMove = (e: PointerEvent) => { if (e.buttons > 0) onInteract() }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('pointermove', onMove)

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointermove', onMove)
    }
  }, [gl, onInteract])

  return (
    <OrbitControls
      enablePan
      enableZoom
      enableRotate
      minDistance={6}
      maxDistance={28}
      autoRotate
      autoRotateSpeed={0.7}
      rotateSpeed={0.45}
      zoomSpeed={1.1}
      target={[0, 0, 0]}
    />
  )
}
