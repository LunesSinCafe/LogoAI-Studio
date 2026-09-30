import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Download,
  Cpu, ShoppingBag, Utensils, Dumbbell, Palette,
  Minimize2, Box, Zap, Building2, Leaf,
  Moon, Sun, Layers, Eye, X
} from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────────────────────
const NICHES = [
  { id: 'tech', label: 'Tecnología', icon: Cpu, color: 'from-blue-500 to-cyan-400' },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, color: 'from-emerald-500 to-teal-400' },
  { id: 'food', label: 'Gastronomía', icon: Utensils, color: 'from-orange-500 to-amber-400' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'from-rose-500 to-pink-400' },
  { id: 'creative', label: 'Creativo', icon: Palette, color: 'from-violet-500 to-fuchsia-400' },
]

const STYLES = [
  { id: 'minimal', label: 'Minimalista', desc: 'Limpio, elegante y atemporal', icon: Minimize2 },
  { id: '3d', label: '3D Geométrico', desc: 'Formas volumétricas modernas', icon: Box },
  { id: 'cyber', label: 'Cyberpunk', desc: 'Neón, futurista y audaz', icon: Zap },
  { id: 'corporate', label: 'Corporativo', desc: 'Profesional y confiable', icon: Building2 },
  { id: 'organic', label: 'Orgánico / Línea', desc: 'Natural, fluido y humano', icon: Leaf },
]

const PALETTES = [
  { id: 'mono', label: 'Monocromático', colors: ['#0f172a', '#334155', '#94a3b8', '#f1f5f9'] },
  { id: 'neon', label: 'Neón Vibrante', colors: ['#0a0a0a', '#a855f7', '#22d3ee', '#f0abfc'] },
  { id: 'warm', label: 'Tierra Cálida', colors: ['#1c1917', '#b45309', '#f59e0b', '#fef3c7'] },
  { id: 'exec', label: 'Azul Ejecutivo', colors: ['#0c1929', '#1e40af', '#3b82f6', '#dbeafe'] },
]

const LOADING_MESSAGES = [
  'Analizando vectores de marca...',
  'Combinando tipografías y armonía de color...',
  'Explorando formas icónicas...',
  'Optimizando contraste y legibilidad...',
  'Renderizando variantes finales...',
  'Aplicando refinamiento estético...',
]

// ─── Logo SVG Generators ────────────────────────────────────────────────────
function generateLogoSVG(brand, style, palette, variant) {
  const primary = palette.colors[1]
  const secondary = palette.colors[2]
  const accent = palette.colors[3]
  const initial = brand.charAt(0).toUpperCase() || 'L'
  const name = brand || 'Logo'

  if (style.id === 'minimal') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id={`g${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        {variant === 0 && (
          <>
            <circle cx="100" cy="85" r="40" fill={`url(#g${variant})`} />
            <text x="100" y="155" textAnchor="middle" fill={accent} fontSize="18" fontWeight="600" fontFamily="Inter, sans-serif">{name}</text>
          </>
        )}
        {variant === 1 && (
          <>
            <rect x="50" y="45" width="100" height="100" rx="20" fill="none" stroke={`url(#g${variant})`} strokeWidth="6" />
            <text x="100" y="108" textAnchor="middle" fill={primary} fontSize="36" fontWeight="700" fontFamily="Inter, sans-serif">{initial}</text>
            <text x="100" y="170" textAnchor="middle" fill={accent} fontSize="16" fontWeight="500" fontFamily="Inter, sans-serif">{name}</text>
          </>
        )}
        {variant === 2 && (
          <>
            <path d="M60 120 L100 50 L140 120 Z" fill="none" stroke={`url(#g${variant})`} strokeWidth="5" strokeLinejoin="round" />
            <circle cx="100" cy="95" r="12" fill={secondary} />
            <text x="100" y="160" textAnchor="middle" fill={accent} fontSize="16" fontWeight="500" fontFamily="Inter, sans-serif">{name}</text>
          </>
        )}
        {variant === 3 && (
          <>
            <line x1="40" y1="80" x2="160" y2="80" stroke={primary} strokeWidth="3" />
            <text x="100" y="115" textAnchor="middle" fill={secondary} fontSize="32" fontWeight="300" letterSpacing="4" fontFamily="Inter, sans-serif">{name.toUpperCase()}</text>
            <line x1="40" y1="130" x2="160" y2="130" stroke={primary} strokeWidth="3" />
          </>
        )}
      </svg>
    )
  }

  if (style.id === '3d') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id={`g3d${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="50%" stopColor={secondary} />
            <stop offset="100%" stopColor={primary} />
          </linearGradient>
          <filter id={`shadow${variant}`}>
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={primary} floodOpacity="0.4" />
          </filter>
        </defs>
        {variant === 0 && (
          <>
            <polygon points="100,40 150,80 150,140 100,180 50,140 50,80" fill={`url(#g3d${variant})`} filter={`url(#shadow${variant})`} />
            <text x="100" y="120" textAnchor="middle" fill="white" fontSize="28" fontWeight="700" fontFamily="Inter, sans-serif">{initial}</text>
          </>
        )}
        {variant === 1 && (
          <>
            <rect x="55" y="50" width="90" height="90" rx="16" fill={primary} filter={`url(#shadow${variant})`} transform="rotate(-8 100 95)" />
            <rect x="55" y="50" width="90" height="90" rx="16" fill={secondary} opacity="0.7" transform="rotate(8 100 95)" />
            <text x="100" y="110" textAnchor="middle" fill="white" fontSize="28" fontWeight="700">{initial}</text>
          </>
        )}
        {variant === 2 && (
          <>
            <circle cx="100" cy="95" r="50" fill={primary} filter={`url(#shadow${variant})`} />
            <circle cx="100" cy="95" r="35" fill={secondary} opacity="0.8" />
            <circle cx="100" cy="95" r="18" fill="white" opacity="0.9" />
            <text x="100" y="170" textAnchor="middle" fill={accent} fontSize="15" fontWeight="600">{name}</text>
          </>
        )}
        {variant === 3 && (
          <>
            <path d="M70 50 L130 50 L160 100 L130 150 L70 150 L40 100 Z" fill={`url(#g3d${variant})`} filter={`url(#shadow${variant})`} />
            <text x="100" y="110" textAnchor="middle" fill="white" fontSize="26" fontWeight="700">{initial}</text>
          </>
        )}
      </svg>
    )
  }

  if (style.id === 'cyber') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id={`gc${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        {variant === 0 && (
          <>
            <rect x="40" y="40" width="120" height="120" fill="none" stroke={`url(#gc${variant})`} strokeWidth="2" />
            <rect x="55" y="55" width="90" height="90" fill="none" stroke={secondary} strokeWidth="1" opacity="0.6" />
            <text x="100" y="110" textAnchor="middle" fill={secondary} fontSize="36" fontWeight="800" fontFamily="monospace">{initial}</text>
            <line x1="40" y1="100" x2="55" y2="100" stroke={primary} strokeWidth="2" />
            <line x1="145" y1="100" x2="160" y2="100" stroke={primary} strokeWidth="2" />
          </>
        )}
        {variant === 1 && (
          <>
            <polygon points="100,35 165,100 100,165 35,100" fill="none" stroke={`url(#gc${variant})`} strokeWidth="3" />
            <polygon points="100,55 145,100 100,145 55,100" fill="none" stroke={secondary} strokeWidth="1.5" opacity="0.7" />
            <text x="100" y="108" textAnchor="middle" fill={secondary} fontSize="24" fontWeight="700" fontFamily="monospace">{initial}</text>
          </>
        )}
        {variant === 2 && (
          <>
            <circle cx="100" cy="95" r="55" fill="none" stroke={primary} strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="100" cy="95" r="40" fill="none" stroke={secondary} strokeWidth="1.5" />
            <text x="100" y="102" textAnchor="middle" fill={secondary} fontSize="28" fontWeight="700" fontFamily="monospace">{initial}</text>
            <text x="100" y="175" textAnchor="middle" fill={primary} fontSize="12" fontWeight="500" letterSpacing="3" fontFamily="monospace">{name.toUpperCase()}</text>
          </>
        )}
        {variant === 3 && (
          <>
            <path d="M50 60 H150 V130 H50 Z" fill="none" stroke={`url(#gc${variant})`} strokeWidth="2" />
            <path d="M60 70 H140" stroke={secondary} strokeWidth="1" opacity="0.5" />
            <path d="M60 80 H120" stroke={secondary} strokeWidth="1" opacity="0.4" />
            <text x="100" y="115" textAnchor="middle" fill={secondary} fontSize="22" fontWeight="700" fontFamily="monospace">{name}</text>
          </>
        )}
      </svg>
    )
  }

  if (style.id === 'corporate') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id={`gcorp${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor={secondary} />
          </linearGradient>
        </defs>
        {variant === 0 && (
          <>
            <rect x="60" y="50" width="80" height="80" rx="8" fill={`url(#gcorp${variant})`} />
            <text x="100" y="105" textAnchor="middle" fill="white" fontSize="32" fontWeight="700">{initial}</text>
            <text x="100" y="155" textAnchor="middle" fill={accent} fontSize="14" fontWeight="600" letterSpacing="2">{name.toUpperCase()}</text>
          </>
        )}
        {variant === 1 && (
          <>
            <circle cx="70" cy="90" r="30" fill={primary} />
            <text x="70" y="98" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">{initial}</text>
            <text x="130" y="95" textAnchor="middle" fill={secondary} fontSize="18" fontWeight="600">{name}</text>
          </>
        )}
        {variant === 2 && (
          <>
            <path d="M50 100 L80 50 L110 100 L140 50 L170 100" fill="none" stroke={primary} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <text x="100" y="140" textAnchor="middle" fill={secondary} fontSize="16" fontWeight="600">{name}</text>
          </>
        )}
        {variant === 3 && (
          <>
            <rect x="45" y="70" width="110" height="50" rx="4" fill="none" stroke={primary} strokeWidth="3" />
            <text x="100" y="102" textAnchor="middle" fill={secondary} fontSize="20" fontWeight="700" letterSpacing="1">{name.toUpperCase()}</text>
          </>
        )}
      </svg>
    )
  }

  // organic
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id={`gorg${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
      </defs>
      {variant === 0 && (
        <>
          <path d="M100 40 C140 40 160 70 160 100 C160 140 130 160 100 160 C70 160 40 140 40 100 C40 70 60 40 100 40" fill="none" stroke={`url(#gorg${variant})`} strokeWidth="4" />
          <path d="M100 60 C125 60 140 80 140 100 C140 125 120 140 100 140 C80 140 60 125 60 100 C60 80 75 60 100 60" fill={primary} opacity="0.15" />
          <text x="100" y="110" textAnchor="middle" fill={secondary} fontSize="24" fontWeight="600">{initial}</text>
        </>
      )}
      {variant === 1 && (
        <>
          <path d="M50 120 Q100 40 150 120" fill="none" stroke={primary} strokeWidth="5" strokeLinecap="round" />
          <path d="M60 130 Q100 60 140 130" fill="none" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <text x="100" y="160" textAnchor="middle" fill={accent} fontSize="16" fontWeight="500">{name}</text>
        </>
      )}
      {variant === 2 && (
        <>
          <ellipse cx="100" cy="90" rx="50" ry="55" fill="none" stroke={`url(#gorg${variant})`} strokeWidth="3" />
          <ellipse cx="100" cy="90" rx="30" ry="35" fill={primary} opacity="0.2" />
          <text x="100" y="98" textAnchor="middle" fill={secondary} fontSize="26" fontWeight="600">{initial}</text>
          <text x="100" y="170" textAnchor="middle" fill={accent} fontSize="14" fontWeight="500">{name}</text>
        </>
      )}
      {variant === 3 && (
        <>
          <path d="M70 50 Q100 80 130 50 Q150 100 130 150 Q100 120 70 150 Q50 100 70 50" fill={`url(#gorg${variant})`} opacity="0.9" />
          <text x="100" y="110" textAnchor="middle" fill="white" fontSize="28" fontWeight="700">{initial}</text>
        </>
      )}
    </svg>
  )
}

// ─── Components ─────────────────────────────────────────────────────────────

function Header({ step }) {
  const steps = ['Brief', 'Estilo', 'Generando', 'Galería']
  return (
    <header className="w-full max-w-5xl mx-auto px-4 pt-6 pb-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">LogoAI <span className="gradient-text">Studio</span></span>
        </div>
        {step < 3 && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            {steps.slice(0, 2).map((s, i) => (
              <React.Fragment key={s}>
                <span className={step === i ? 'text-violet-400 font-medium' : step > i ? 'text-slate-300' : ''}>
                  {s}
                </span>
                {i < 1 && <span className="text-slate-600">→</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      {step < 3 && (
        <div className="flex gap-2 mb-2">
          {[0, 1].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-slate-800'}`} />
          ))}
        </div>
      )}
    </header>
  )
}

function Onboarding({ data, setData, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Cuéntanos sobre tu <span className="gradient-text">marca</span>
        </h1>
        <p className="text-slate-400 text-lg">Definamos la identidad visual perfecta para tu negocio</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nombre de la marca *</label>
          <input
            type="text"
            value={data.brandName}
            onChange={e => setData({ ...data, brandName: e.target.value })}
            placeholder="Ej: NovaTech"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Eslogan <span className="text-slate-500">(opcional)</span></label>
          <input
            type="text"
            value={data.slogan}
            onChange={e => setData({ ...data, slogan: e.target.value })}
            placeholder="Ej: Innovación sin límites"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Sector o Nicho *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NICHES.map(niche => {
              const Icon = niche.icon
              const selected = data.niche === niche.id
              return (
                <button
                  key={niche.id}
                  type="button"
                  onClick={() => setData({ ...data, niche: niche.id })}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left card-interactive ${
                    selected
                      ? 'border-violet-500 bg-violet-500/10 glow-violet'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${niche.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-sm">{niche.label}</span>
                  {selected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!data.brandName.trim() || !data.niche}
          className="w-full mt-4 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
        >
          Continuar al diseño
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

function StyleSelector({ data, setData, onNext, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Define el <span className="gradient-text">estilo visual</span>
        </h1>
        <p className="text-slate-400 text-lg">Elige la dirección estética y la paleta de colores</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Estilo del logo</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STYLES.map(style => {
              const Icon = style.icon
              const selected = data.style === style.id
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setData({ ...data, style: style.id })}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left card-interactive ${
                    selected
                      ? 'border-cyan-500 bg-cyan-500/10 glow-cyan'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
                      <Icon className={`w-5 h-5 ${selected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <span className="font-medium text-sm block">{style.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">{style.desc}</span>
                    </div>
                  </div>
                  {selected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Paleta de colores</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PALETTES.map(palette => {
              const selected = data.palette === palette.id
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => setData({ ...data, palette: palette.id })}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left card-interactive ${
                    selected
                      ? 'border-fuchsia-500 bg-fuchsia-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{palette.label}</span>
                    {selected && (
                      <div className="w-5 h-5 rounded-full bg-fuchsia-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {palette.colors.map((c, i) => (
                      <div key={i} className="h-8 flex-1 rounded-md" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-6 py-4 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Atrás
          </button>
          <button
            onClick={onNext}
            disabled={!data.style || !data.palette}
            className="flex-1 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
          >
            <Sparkles className="w-5 h-5" />
            Generar Logos con IA
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function LoadingScreen({ onComplete }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
    }, 1500)

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval)
          clearInterval(msgInterval)
          setTimeout(onComplete, 400)
          return 100
        }
        return p + 1.2
      })
    }, 50)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4">
        <div className="relative w-24 h-24 mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-cyan-400 animate-spin" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-fuchsia-500 animate-spin" style={{ animationDuration: '1.8s', animationDirection: 'reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-lg text-slate-300 font-medium mb-8 text-center min-h-[28px]"
          >
            {LOADING_MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>

        <div className="w-64 sm:w-80 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-3 tabular-nums">{Math.min(Math.round(progress), 100)}%</p>
      </div>
    </motion.div>
  )
}

function Gallery({ data, onSelect, onBack }) {
  const style = STYLES.find(s => s.id === data.style) || STYLES[0]
  const palette = PALETTES.find(p => p.id === data.palette) || PALETTES[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl mx-auto px-4 pb-16"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Tus logos <span className="gradient-text">generados</span>
        </h1>
        <p className="text-slate-400">
          4 variaciones únicas para <span className="text-white font-medium">{data.brandName}</span>
          {data.slogan && <span className="text-slate-500"> — "{data.slogan}"</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[0, 1, 2, 3].map(variant => (
          <motion.div
            key={variant}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: variant * 0.1 }}
            className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden card-interactive hover:border-violet-500/50"
          >
            <div className="aspect-square p-8 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
              <div className="w-full max-w-[200px] aspect-square">
                {generateLogoSVG(data.brandName, style, palette, variant)}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-slate-800">
              <div>
                <p className="text-sm font-medium">Variante {variant + 1}</p>
                <p className="text-xs text-slate-500">{style.label}</p>
              </div>
              <button
                onClick={() => onSelect(variant)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-violet-600 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                Personalizar
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Ajustar estilo y regenerar
        </button>
      </div>
    </motion.div>
  )
}

function DetailEditor({ data, variant, onClose }) {
  const [bgMode, setBgMode] = useState('dark')
  const [showSuccess, setShowSuccess] = useState(false)
  const style = STYLES.find(s => s.id === data.style) || STYLES[0]
  const palette = PALETTES.find(p => p.id === data.palette) || PALETTES[0]

  const bgClasses = {
    dark: 'bg-slate-900',
    light: 'bg-white',
    transparent: 'bg-[url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23334155\' fill-opacity=\'0.4\'%3E%3Crect x=\'0\' y=\'0\' width=\'10\' height=\'10\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\'/%3E%3C/g%3E%3C/svg%3E")]',
  }

  const handleDownload = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
          <div>
            <h2 className="font-semibold text-lg">{data.brandName} — Variante {variant + 1}</h2>
            <p className="text-sm text-slate-400">{style.label} · {PALETTES.find(p => p.id === data.palette)?.label}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={`aspect-video rounded-xl flex items-center justify-center transition-colors duration-300 ${bgClasses[bgMode]}`}>
            <div className="w-48 h-48 sm:w-56 sm:h-56">
              {generateLogoSVG(data.brandName, style, palette, variant)}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">Fondo del lienzo</p>
            <div className="flex gap-2">
              {[
                { id: 'dark', label: 'Oscuro', icon: Moon },
                { id: 'light', label: 'Claro', icon: Sun },
                { id: 'transparent', label: 'Transparente', icon: Layers },
              ].map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.id}
                    onClick={() => setBgMode(opt.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      bgMode === opt.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Vista previa en mockup</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-5">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Tarjeta de presentación</p>
                <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-lg">
                  <div className="w-14 h-14 shrink-0">
                    {generateLogoSVG(data.brandName, style, palette, variant)}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{data.brandName}</p>
                    {data.slogan && <p className="text-slate-500 text-xs mt-0.5">{data.slogan}</p>}
                    <p className="text-slate-400 text-[10px] mt-2">www.{data.brandName.toLowerCase().replace(/\s/g, '')}.com</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-5">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Icono de app</p>
                <div className="flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 shadow-xl flex items-center justify-center overflow-hidden border border-slate-700">
                    <div className="w-20 h-20">
                      {generateLogoSVG(data.brandName, style, palette, variant)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
          >
            <Download className="w-5 h-5" />
            Descargar Kit de Marca (PNG, SVG, PDF)
          </button>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            >
              <Check className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium text-sm">¡Kit de marca descargado!</p>
                <p className="text-xs text-emerald-400/70">Archivos PNG, SVG y PDF listos (simulación)</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [data, setData] = useState({
    brandName: '',
    slogan: '',
    niche: null,
    style: null,
    palette: null,
  })

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/5 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10">
        {step !== 2 && <Header step={step} />}

        <main className="py-6 sm:py-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <Onboarding
                key="onboarding"
                data={data}
                setData={setData}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <StyleSelector
                key="style"
                data={data}
                setData={setData}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 3 && (
              <Gallery
                key="gallery"
                data={data}
                onSelect={setSelectedVariant}
                onBack={() => setStep(1)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {step === 2 && (
        <LoadingScreen onComplete={() => setStep(3)} />
      )}

      <AnimatePresence>
        {selectedVariant !== null && (
          <DetailEditor
            data={data}
            variant={selectedVariant}
            onClose={() => setSelectedVariant(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
