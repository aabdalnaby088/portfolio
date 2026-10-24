import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

const COLORS = ['#c8f53b', '#ff7ab6', '#7aa2ff', '#ff9a4d', '#b9a2ff']
const SIZE = 38
const MAX_BUGS = 3

type Bug = {
  id: number
  color: string
  x: number
  y: number
  angle: number
  turn: number
  speed: number
  age: number
  life: number
  dead: boolean
}

type Splat = { id: number; x: number; y: number; color: string }

const rand = (a: number, b: number) => a + Math.random() * (b - a)

// Bugs walk in from a random screen edge, pointing inward.
function spawnBug(id: number): Bug {
  const w = window.innerWidth
  const h = window.innerHeight
  const edge = Math.floor(Math.random() * 4)
  const pad = SIZE
  const [x, y, angle] =
    edge === 0 ? [rand(0, w), -pad, Math.PI / 2] :
    edge === 1 ? [w + pad, rand(0, h), Math.PI] :
    edge === 2 ? [rand(0, w), h + pad, -Math.PI / 2] :
    [-pad, rand(0, h), 0]
  return {
    id,
    color: COLORS[id % COLORS.length],
    x, y,
    angle: angle + rand(-0.5, 0.5),
    turn: 0,
    speed: rand(55, 85),
    age: 0,
    life: rand(12, 20),
    dead: false,
  }
}

function BugSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" width={SIZE} height={SIZE} aria-hidden="true">
      <g className="legs legs-a" stroke="#141414" strokeWidth="2.6" strokeLinecap="round">
        <line x1="12" y1="17" x2="4" y2="13" />
        <line x1="12" y1="31" x2="4" y2="35" />
        <line x1="28" y1="24" x2="36" y2="24" />
      </g>
      <g className="legs legs-b" stroke="#141414" strokeWidth="2.6" strokeLinecap="round">
        <line x1="28" y1="17" x2="36" y2="13" />
        <line x1="28" y1="31" x2="36" y2="35" />
        <line x1="12" y1="24" x2="4" y2="24" />
      </g>
      <path d="M17 7 Q14 2 10 2 M23 7 Q26 2 30 2" stroke="#141414" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="20" cy="24" rx="10" ry="12" fill={color} stroke="#141414" strokeWidth="3" />
      <line x1="20" y1="13" x2="20" y2="35" stroke="#141414" strokeWidth="2" />
      <circle cx="15.5" cy="22" r="2" fill="#141414" />
      <circle cx="24.5" cy="28" r="2" fill="#141414" />
      <circle cx="20" cy="10" r="6" fill="#141414" />
      <circle cx="17.6" cy="8.6" r="1.6" fill="#fff" />
      <circle cx="22.4" cy="8.6" r="1.6" fill="#fff" />
    </svg>
  )
}

export default function BugHunt({ swarm, onSquash }: {
  /** bump this number to release a swarm */
  swarm: number
  onSquash: () => void
}) {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [splats, setSplats] = useState<Splat[]>([])
  const live = useRef(new Map<number, Bug>())
  const els = useRef(new Map<number, HTMLButtonElement>())
  const nextId = useRef(1)
  const mouse = useRef({ x: -999, y: -999 })

  const add = (count: number) => {
    const fresh = Array.from({ length: count }, () => spawnBug(nextId.current++))
    fresh.forEach(b => live.current.set(b.id, b))
    setBugs(prev => [...prev, ...fresh])
  }
  const remove = (id: number) => {
    live.current.delete(id)
    els.current.delete(id)
    setBugs(prev => prev.filter(b => b.id !== id))
  }

  // Trickle in a bug every so often. The first one shows up quickly.
  useEffect(() => {
    let timer = window.setTimeout(function tick() {
      if (live.current.size < MAX_BUGS && document.visibilityState === 'visible') add(1)
      timer = window.setTimeout(tick, rand(9000, 16000))
    }, 3500)
    return () => window.clearTimeout(timer)
  }, [])

  // Only swarms requested while mounted count, not ones from before.
  const seenSwarm = useRef(swarm)
  useEffect(() => {
    if (swarm === seenSwarm.current) return
    seenSwarm.current = swarm
    add(10)
  }, [swarm])

  useEffect(() => {
    const onMove = (e: PointerEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // One rAF loop moves every bug by writing transforms straight to the DOM.
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const w = window.innerWidth
      const h = window.innerHeight
      const gone: number[] = []

      live.current.forEach(b => {
        if (b.dead) return
        b.age += dt
        const leaving = b.age > b.life

        // wander: the turn rate drifts randomly
        b.turn += rand(-1, 1) * 6 * dt
        b.turn = Math.max(-1.6, Math.min(1.6, b.turn))
        let desired = b.angle + b.turn * dt * 2

        // flee the cursor when it gets close
        const dx = b.x - mouse.current.x
        const dy = b.y - mouse.current.y
        const dist = Math.hypot(dx, dy)
        const scared = dist < 90
        if (scared) desired = Math.atan2(dy, dx)

        // stay on screen until it's time to go
        const m = 60
        if (!leaving && !scared && (b.x < m || b.x > w - m || b.y < m || b.y > h - m)) {
          desired = Math.atan2(h / 2 - b.y, w / 2 - b.x)
        }

        let diff = desired - b.angle
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        b.angle += diff * Math.min(1, (scared ? 6 : 2.2) * dt)

        const speed = b.speed * (scared ? 2.4 : 1)
        b.x += Math.cos(b.angle) * speed * dt
        b.y += Math.sin(b.angle) * speed * dt

        if (leaving && (b.x < -80 || b.x > w + 80 || b.y < -80 || b.y > h + 80)) gone.push(b.id)

        const el = els.current.get(b.id)
        if (el) {
          el.style.transform = `translate(${b.x - SIZE / 2}px, ${b.y - SIZE / 2}px) rotate(${b.angle + Math.PI / 2}rad)`
          el.style.setProperty('--gait', `${Math.max(0.12, 0.3 - speed / 1000)}s`)
        }
      })
      gone.forEach(remove)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const squash = (id: number) => {
    const b = live.current.get(id)
    if (!b || b.dead) return
    b.dead = true
    els.current.get(id)?.classList.add('squashed')
    const splat = { id, x: b.x, y: b.y, color: b.color }
    setSplats(prev => [...prev, splat])
    window.setTimeout(() => remove(id), 350)
    window.setTimeout(() => setSplats(prev => prev.filter(s => s !== splat)), 1600)
    onSquash()
  }

  return (
    <div className="bug-layer" aria-hidden="true">
      {splats.map(s => (
        <div key={s.id} className="splat" style={{ left: s.x, top: s.y, '--c': s.color } as CSSProperties}>
          <svg viewBox="0 0 60 60" width="60" height="60">
            <path
              d="M30 6 L35 20 L50 12 L42 26 L56 32 L41 37 L47 52 L33 42 L27 56 L24 41 L9 48 L18 35 L4 27 L19 23 L12 9 L26 18 Z"
              fill="var(--c)" stroke="#141414" strokeWidth="3" strokeLinejoin="round"
            />
          </svg>
          <span className="splat-score">+1</span>
        </div>
      ))}
      {bugs.map(b => (
        <button
          key={b.id}
          className="bug"
          tabIndex={-1}
          // starting spot only; the rAF loop owns the transform after this
          style={{ transform: `translate(${b.x - SIZE / 2}px, ${b.y - SIZE / 2}px) rotate(${b.angle + Math.PI / 2}rad)` }}
          ref={el => { if (el) els.current.set(b.id, el) }}
          onPointerDown={e => { e.preventDefault(); squash(b.id) }}
        >
          <BugSvg color={b.color} />
        </button>
      ))}
    </div>
  )
}
