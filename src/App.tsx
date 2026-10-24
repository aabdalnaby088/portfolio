import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import {
  faq, heroBlurb, inventory, links, marquee, projects, releases, roles, stickers,
} from './data'
import type { Copy } from './data'

// Recruiter Mode swaps every joke for its serious twin.
const ModeContext = createContext(false)
function useCopy() {
  const serious = useContext(ModeContext)
  return (c: Copy) => (serious ? c.serious : c.fun)
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const show = (text: string) => {
    setMsg(text)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMsg(null), 2600)
  }
  return { msg, show }
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
function useKonami(onUnlock: () => void) {
  useEffect(() => {
    let i = 0
    const onKey = (e: KeyboardEvent) => {
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        onUnlock()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onUnlock])
}

export default function App() {
  const [serious, setSerious] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch { /* storage blocked */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [party, setParty] = useState(false)
  const toast = useToast()
  useReveal()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* storage blocked */ }
  }, [theme])

  useKonami(() => {
    setParty(p => !p)
    toast.show('Cheat code accepted. Ahmed gains +10 charisma.')
  })

  useEffect(() => {
    console.log(
      '%cHey, fellow inspector of elements 👋\n%cSince you are here: try the Konami code. Or just email me: ' + links.email,
      'font: 700 16px system-ui; color: #ff5fa2',
      'font: 13px system-ui',
    )
  }, [])

  return (
    <ModeContext.Provider value={serious}>
      <div className={`app ${party ? 'party' : ''}`}>
        <a className="skip" href="#main">Skip to content</a>
        <Nav
          serious={serious}
          onSerious={() => {
            setSerious(s => !s)
            toast.show(serious ? 'Fun restored. Jokes back online.' : 'Recruiter Mode on. Jokes safely stored.')
          }}
          theme={theme}
          onTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        />
        <main id="main">
          <Hero />
          <Marquee />
          <Changelog />
          <Projects />
          <Inventory />
          <Faq />
          <Contact onCopy={toast.show} />
        </main>
        <Footer />
        <div className={`toast ${toast.msg ? 'show' : ''}`} role="status" aria-live="polite">
          {toast.msg}
        </div>
      </div>
    </ModeContext.Provider>
  )
}

function Nav(props: { serious: boolean; onSerious: () => void; theme: string; onTheme: () => void }) {
  return (
    <header className="nav">
      <a href="#top" className="logo" aria-label="Back to top">
        <span className="logo-mark">A</span>
        <span className="logo-text">ahmed<span className="dot">.</span>dev</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        <a href="#changelog">Work</a>
        <a href="#projects">Projects</a>
        <a href="#inventory">Skills</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="nav-actions">
        <button
          className={`switch ${props.serious ? 'on' : ''}`}
          role="switch"
          aria-checked={props.serious}
          onClick={props.onSerious}
          title="Swap the jokes for the serious version"
        >
          <span className="switch-track"><span className="switch-thumb" /></span>
          <span className="switch-label">Recruiter mode</span>
        </button>
        <button
          className="icon-btn"
          onClick={props.onTheme}
          aria-label={`Switch to ${props.theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {props.theme === 'light' ? '☾' : '☀'}
        </button>
      </div>
    </header>
  )
}

function RoleTicker() {
  const t = useCopy()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setI(n => (n + 1) % roles.length), 2400)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="ticker" aria-live="off">
      <span key={i} className="ticker-word">{t(roles[i])}</span>
    </span>
  )
}

function Sticker({ text, color, x, y, r }: (typeof stickers)[number]) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ dx: 0, dy: 0 })
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  const down = (e: ReactPointerEvent) => {
    ref.current?.setPointerCapture(e.pointerId)
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.dx, oy: pos.dy }
  }
  const move = (e: ReactPointerEvent) => {
    if (!drag.current) return
    const d = drag.current
    setPos({ dx: d.ox + e.clientX - d.sx, dy: d.oy + e.clientY - d.sy })
  }
  const up = () => { drag.current = null }

  return (
    <div
      ref={ref}
      className={`sticker sticker-${color}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(${pos.dx}px, ${pos.dy}px) rotate(${r}deg)` }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      aria-hidden="true"
    >
      {text}
    </div>
  )
}

function Hero() {
  const t = useCopy()
  return (
    <section className="hero" id="top">
      <div className="stickers">
        {stickers.map(s => <Sticker key={s.text} {...s} />)}
      </div>
      <div className="hero-inner">
        <p className="status-pill">
          <span className="pulse" /> Currently working @{' '}
          <a className="status-link" href="https://saqaya.com" target="_blank" rel="noreferrer">Saqaya</a>
        </p>
        <h1 className="hero-title">
          <span className="line">
            {'Ahmed'.split('').map((c, i) => <span key={i} className="wobble">{c}</span>)}
          </span>
          <span className="line outline">
            {'Abdelnaby'.split('').map((c, i) => <span key={i} className="wobble">{c}</span>)}
          </span>
        </h1>
        <p className="hero-sub">
          <span className="hero-sub-prefix">{t({ fun: 'part-time human, full-time', serious: 'Software Engineer ·' })}</span>{' '}
          <RoleTicker />
        </p>
        <p className="hero-blurb">{t(heroBlurb)}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#contact">
            {t({ fun: 'Hire this human', serious: 'Get in touch' })} <span aria-hidden="true">→</span>
          </a>
          <a className="btn" href={links.cv} download>
            {t({ fun: 'Download the boring PDF', serious: 'Download CV' })}
          </a>
        </div>
        <p className="hint" aria-hidden="true">
          {t({ fun: 'psst: the stickers are draggable. go on, make a mess.', serious: 'Based in Cairo, Egypt. Working with UK clients.' })}
        </p>
      </div>
    </section>
  )
}

function Marquee() {
  const row = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-label="Tech stack">
      <div className="marquee-track">
        {row.map((m, i) => (
          <span key={i} className="marquee-item" aria-hidden={i >= marquee.length}>
            {m} <span className="star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function SectionHead({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="section-head reveal">
      <span className="section-num">{num}</span>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  )
}

function Changelog() {
  const t = useCopy()
  return (
    <section className="section" id="changelog">
      <SectionHead
        num="01"
        title={t({ fun: 'CHANGELOG.md', serious: 'Experience' })}
        sub={t({
          fun: 'My career, written the way developers actually read things: as release notes.',
          serious: 'Roles and responsibilities, most recent first.',
        })}
      />
      <ol className="releases">
        {releases.map(r => (
          <li key={r.version} className="release reveal">
            <div className="release-meta">
              <span className="version">{r.version}</span>
              <span className={`badge badge-${r.status}`}>
                {r.status === 'live' ? '● live' : r.status === 'shipped' ? '✓ shipped' : '◆ legacy'}
              </span>
              <span className="date">{r.date}</span>
            </div>
            <div className="release-card">
              <h3>{r.title} <span className="at">@ {r.org}</span></h3>
              {r.summary && <p className="release-summary">{r.summary}</p>}
              <ul className="changes">
                {r.changes.map((c, i) => (
                  <li key={i}>
                    <span className={`tag tag-${c.tag}`}>{c.tag}</span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
              <div className="chips">
                {r.stack.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
              {r.note && <p className="release-note">{t(r.note)}</p>}
              {r.link && (
                <a className="release-link" href={r.link.href} target="_blank" rel="noreferrer">
                  {r.link.label} ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function TiltCard({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null)
  const onMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const b = ref.current.getBoundingClientRect()
    const px = (e.clientX - b.left) / b.width - 0.5
    const py = (e.clientY - b.top) / b.height - 0.5
    ref.current.style.setProperty('--rx', `${-py * 8}deg`)
    ref.current.style.setProperty('--ry', `${px * 10}deg`)
  }
  const reset = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }
  return (
    <article ref={ref} className={className} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </article>
  )
}

function Projects() {
  const t = useCopy()
  return (
    <section className="section" id="projects">
      <SectionHead
        num="02"
        title={t({ fun: 'Things I made', serious: 'Selected projects' })}
        sub={t({
          fun: 'Some for clients, some for a grade, all with an unreasonable amount of care.',
          serious: 'Products, client work and academic projects.',
        })}
      />
      <div className="project-grid">
        {projects.map((p, i) => (
          <TiltCard key={p.name} className={`project project-${p.color} reveal`}>
            <div className="project-top">
              <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-emoji" aria-hidden="true">{p.emoji}</span>
            </div>
            <p className="project-kicker">{p.kicker}</p>
            <h3>{p.name}</h3>
            <p className="project-blurb">{t(p.blurb)}</p>
            <div className="chips">
              {p.stack.map(s => <span key={s} className="chip chip-solid">{s}</span>)}
            </div>
            {p.link && (
              <a className="project-link" href={p.link.href} target="_blank" rel="noreferrer">
                {p.link.label} ↗
              </a>
            )}
          </TiltCard>
        ))}
      </div>
    </section>
  )
}

function Inventory() {
  const t = useCopy()
  return (
    <section className="section" id="inventory">
      <SectionHead
        num="03"
        title={t({ fun: 'Inventory', serious: 'Technical skills' })}
        sub={t({
          fun: 'Equipped items. No microtransactions required.',
          serious: 'Languages, frameworks and tools I use in production.',
        })}
      />
      <div className="inventory">
        {inventory.map(g => (
          <div key={g.group} className="slot-group reveal">
            <h3><span aria-hidden="true">{g.icon}</span> {g.group}</h3>
            <ul className="slots">
              {g.items.map(item => <li key={item} className="slot">{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const t = useCopy()
  return (
    <section className="section" id="faq">
      <SectionHead
        num="04"
        title={t({ fun: 'Questions nobody asked', serious: 'FAQ' })}
        sub={t({ fun: 'Answered anyway, for your convenience.', serious: 'Quick answers to common questions.' })}
      />
      <div className="faq">
        {faq.map((f, i) => (
          <details key={f.q} className="faq-item reveal" open={i === 0}>
            <summary>{f.q}<span className="plus" aria-hidden="true">+</span></summary>
            <p>{t(f.a)}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

const BURST = ['✦', '@', '✉', '★', '♥', '✦', '@', '✉', '★', '♥', '✦', '@']
const BURST_COLORS = ['var(--pink)', 'var(--blue)', 'var(--orange)', 'var(--lime)']

function Contact({ onCopy }: { onCopy: (msg: string) => void }) {
  const t = useCopy()
  // `burst` keys the particle layer so every click replays it.
  const [burst, setBurst] = useState(0)
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const btn = useRef<HTMLButtonElement>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setBurst(b => b + 1)
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        btn.current?.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(0.9, 0.82)', offset: 0.25 },
            { transform: 'scale(1.1, 1.05) rotate(-2deg)', offset: 0.55 },
            { transform: 'scale(1)' },
          ],
          { duration: 500, easing: 'cubic-bezier(.3,1.8,.5,1)' },
        )
      }
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1800)
      onCopy('Email copied. Your move.')
    } catch {
      window.location.href = `mailto:${links.email}`
    }
  }
  return (
    <section className="section contact" id="contact">
      <div className="contact-card reveal">
        <p className="contact-kicker">05 · {t({ fun: 'the part where you say hi', serious: 'Contact' })}</p>
        <h2 className="contact-title">
          {t({ fun: "Let's build something", serious: "Let's work together" })}{' '}
          <span className="highlight">{t({ fun: 'weirdly good.', serious: 'on your next product.' })}</span>
        </h2>
        <div className="email-wrap">
          <button ref={btn} className={`email-btn ${copied ? 'copied' : ''}`} onClick={copy}>
            <span className="email-text">{links.email}</span>
            <span className="email-action" aria-live="polite">
              {copied
                ? t({ fun: 'yoinked to clipboard ✓', serious: 'copied ✓' })
                : t({ fun: 'click to copy', serious: 'copy' })}
            </span>
          </button>
          {burst > 0 && (
            <span key={burst} className="burst" aria-hidden="true">
              {BURST.map((c, i) => (
                <span
                  key={i}
                  className="particle"
                  style={{
                    '--a': `${(360 / BURST.length) * i}deg`,
                    '--d': `${110 + (i % 3) * 40}px`,
                    color: BURST_COLORS[i % BURST_COLORS.length],
                  } as CSSProperties}
                >
                  {c}
                </span>
              ))}
            </span>
          )}
        </div>
        <div className="socials">
          <a className="btn" href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="btn" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a className="btn" href={`mailto:${links.email}`}>Email ↗</a>
          <a className="btn" href={links.cv} download>CV.pdf ↓</a>
        </div>
      </div>
    </section>
  )
}

const YEAR = new Date().getFullYear()

function Footer() {
  const t = useCopy()
  return (
    <footer className="footer">
      <p>© {YEAR} Ahmed Abdelnaby · {t({ fun: 'built with React, TypeScript and questionable amounts of tea', serious: 'Built with React and TypeScript' })}</p>
      <p className="footer-egg">{t({ fun: '↑ ↑ ↓ ↓ ← → ← → B A', serious: 'Cairo, Egypt' })}</p>
    </footer>
  )
}
