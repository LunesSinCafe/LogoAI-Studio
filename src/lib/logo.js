import { findFont, nearestWeight } from '../../shared/catalog.js'

// ─── Icon sanitizing ─────────────────────────────────────────────────────────
// AI output and stored projects are untrusted: keep only a whitelist of SVG
// elements and attributes before anything is rendered or exported.

const ALLOWED_TAGS = new Set([
  'g', 'path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon',
  'defs', 'lineargradient', 'radialgradient', 'stop', 'clippath',
])

const ALLOWED_ATTRS = new Set([
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'fx', 'fy',
  'width', 'height', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-linecap',
  'stroke-linejoin', 'stroke-dasharray', 'stroke-miterlimit', 'opacity',
  'fill-opacity', 'stroke-opacity', 'fill-rule', 'clip-rule', 'transform', 'id',
  'offset', 'stop-color', 'stop-opacity', 'gradientunits', 'gradienttransform',
  'spreadmethod', 'clip-path', 'clippathunits',
])

const SAFE_VALUE = /^[\w\s.,#%(){}\-+:/]*$/

const sanitizeCache = new Map()

export function sanitizeIcon(markup) {
  if (!markup) return ''
  if (sanitizeCache.has(markup)) return sanitizeCache.get(markup)

  const doc = new DOMParser().parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`,
    'image/svg+xml',
  )
  const root = doc.documentElement
  if (root.querySelector('parsererror') || root.nodeName === 'parsererror') {
    sanitizeCache.set(markup, '')
    return ''
  }

  const clean = (el) => {
    for (const child of [...el.children]) {
      if (!ALLOWED_TAGS.has(child.nodeName.toLowerCase())) {
        child.remove()
        continue
      }
      for (const attr of [...child.attributes]) {
        const name = attr.name.toLowerCase()
        const value = attr.value
        const urlRefs = value.match(/url\(([^)]*)\)/g) || []
        const badUrl = urlRefs.some(u => !/^url\(#[\w-]+\)$/.test(u))
        if (!ALLOWED_ATTRS.has(name) || !SAFE_VALUE.test(value) || badUrl || /javascript/i.test(value)) {
          child.removeAttribute(attr.name)
        }
      }
      clean(child)
    }
    // Drop stray text nodes
    for (const node of [...el.childNodes]) if (node.nodeType === 3 && node.textContent.trim()) node.remove()
  }
  clean(root)

  const result = [...root.children].map(c => new XMLSerializer().serializeToString(c)).join('')
    .replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '')
  sanitizeCache.set(markup, result)
  return result
}

// Gradient / clipPath ids must be unique per rendered SVG on the page.
function scopeIds(markup, scope) {
  const ids = [...markup.matchAll(/\bid="([\w-]+)"/g)].map(m => m[1])
  let out = markup
  for (const id of ids) {
    out = out
      .replaceAll(`id="${id}"`, `id="${scope}-${id}"`)
      .replaceAll(`url(#${id})`, `url(#${scope}-${id})`)
  }
  return out
}

// Replace color tokens. In mono mode, every paint becomes the same color.
function colorize(markup, colors, mono) {
  return markup.replace(/(fill|stroke|stop-color)="([^"]*)"/g, (all, attr, value) => {
    if (value === 'none' || value.startsWith('url(')) return all
    if (mono) return `${attr}="${mono}"`
    const token = value.match(/^\{(primary|secondary|accent)\}$/)
    if (token) return `${attr}="${colors[token[1]]}"`
    return all
  })
}

// ─── Text measuring ──────────────────────────────────────────────────────────

let measureCtx
function measureText(text, family, weight, size, letterSpacingEm) {
  if (!text) return 0
  const spacing = letterSpacingEm * size * Math.max(text.length - 1, 0)
  if (typeof document !== 'undefined') {
    measureCtx ||= document.createElement('canvas').getContext('2d')
    measureCtx.font = `${weight} ${size}px "${family}"`
    return measureCtx.measureText(text).width + spacing
  }
  return text.length * size * 0.6 + spacing
}

const applyCase = (text, textCase) =>
  textCase === 'upper' ? text.toUpperCase() : textCase === 'lower' ? text.toLowerCase() : text

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ─── Design model ────────────────────────────────────────────────────────────

export function designFromConcept(concept, palette, previous = {}) {
  return {
    colors: previous.colors || { ...palette.colors, text: palette.colors.primary },
    font: concept.font,
    fontWeight: nearestWeight(concept.font, concept.fontWeight),
    letterSpacing: concept.letterSpacing,
    textCase: concept.textCase,
    layout: concept.layout,
    iconScale: 1,
    showSlogan: previous.showSlogan ?? true,
    background: previous.background || 'light',
  }
}

export const BACKGROUNDS = {
  light: '#ffffff',
  dark: '#111111',
  transparent: null,
}

let scopeCounter = 0

/**
 * Compose a full standalone SVG for a concept + design.
 * options: { mono, background (hex|null), fontCss, square, padding, scope }
 */
export function buildLogoSVG(concept, design, brand, options = {}) {
  const scope = options.scope || `l${++scopeCounter}`
  const colors = design.colors
  const family = design.font
  const weight = nearestWeight(family, design.fontWeight)
  const sloganWeight = nearestWeight(family, 400)
  const layout = design.layout
  const name = applyCase(brand.brandName || 'Marca', design.textCase)
  const slogan = design.showSlogan && brand.slogan && layout !== 'icon' ? brand.slogan : ''
  const textColor = options.mono || colors.text
  const sloganColor = options.mono || colors.secondary
  const fallback = findFont(family).category === 'serif' ? 'serif' : findFont(family).category === 'mono' ? 'monospace' : 'sans-serif'

  const pad = options.padding ?? 24
  const iconMarkup = colorize(scopeIds(sanitizeIcon(concept.icon), scope), colors, options.mono)
  const showIcon = layout !== 'wordmark' && iconMarkup
  const showText = layout !== 'icon'

  let nameSize, iconSize, width, height
  const parts = []
  const textAttrs = (size, w, ls) =>
    `font-family="'${family}', ${fallback}" font-weight="${w}" font-size="${size}" letter-spacing="${(ls * size).toFixed(2)}"`

  if (layout === 'horizontal') {
    iconSize = 88 * design.iconScale
    nameSize = 40
    const sloganSize = 13
    const nameW = measureText(name, family, weight, nameSize, design.letterSpacing)
    const sloganW = measureText(slogan, family, sloganWeight, sloganSize, 0.08)
    const textW = Math.max(nameW, sloganW)
    const textH = nameSize * 0.78 + (slogan ? 10 + sloganSize : 0)
    const gap = showIcon ? 22 : 0
    const contentH = Math.max(showIcon ? iconSize : 0, textH)
    width = pad * 2 + (showIcon ? iconSize : 0) + gap + textW
    height = pad * 2 + contentH
    if (showIcon) parts.push(`<g transform="translate(${pad} ${pad + (contentH - iconSize) / 2}) scale(${iconSize / 100})">${iconMarkup}</g>`)
    const tx = pad + (showIcon ? iconSize : 0) + gap
    const top = pad + (contentH - textH) / 2
    parts.push(`<text x="${tx}" y="${top + nameSize * 0.78}" fill="${textColor}" ${textAttrs(nameSize, weight, design.letterSpacing)}>${escapeXml(name)}</text>`)
    if (slogan) parts.push(`<text x="${tx}" y="${top + nameSize * 0.78 + 10 + sloganSize}" fill="${sloganColor}" ${textAttrs(sloganSize, sloganWeight, 0.08)}>${escapeXml(slogan)}</text>`)
  } else {
    // stacked, icon-only and wordmark are all centered compositions
    iconSize = (layout === 'icon' ? 160 : 110) * design.iconScale
    nameSize = layout === 'wordmark' ? 56 : 38
    const sloganSize = layout === 'wordmark' ? 16 : 13
    const nameW = showText ? measureText(name, family, weight, nameSize, design.letterSpacing) : 0
    const sloganW = measureText(slogan, family, sloganWeight, sloganSize, 0.08)
    width = pad * 2 + Math.max(showIcon ? iconSize : 0, nameW, sloganW)
    let y = pad
    const cx = width / 2
    if (showIcon) {
      parts.push(`<g transform="translate(${cx - iconSize / 2} ${y}) scale(${iconSize / 100})">${iconMarkup}</g>`)
      y += iconSize + (showText ? 20 : 0)
    }
    if (showText) {
      y += nameSize * 0.78
      // letter-spacing adds trailing space; shift to keep optical center
      const shift = (design.letterSpacing * nameSize) / 2
      parts.push(`<text x="${cx + shift}" y="${y}" text-anchor="middle" fill="${textColor}" ${textAttrs(nameSize, weight, design.letterSpacing)}>${escapeXml(name)}</text>`)
      if (slogan) {
        y += 12 + sloganSize
        parts.push(`<text x="${cx + (0.08 * sloganSize) / 2}" y="${y}" text-anchor="middle" fill="${sloganColor}" ${textAttrs(sloganSize, sloganWeight, 0.08)}>${escapeXml(slogan)}</text>`)
      }
    }
    height = y + pad + (showText ? nameSize * 0.12 : 0)
  }

  let vx = 0, vy = 0, vw = width, vh = height
  if (options.square) {
    const side = Math.max(width, height)
    vx = -(side - width) / 2
    vy = -(side - height) / 2
    vw = vh = side
  }

  const bg = options.background
  const outW = options.width || vw
  const outH = options.width ? (options.width * vh) / vw : vh

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" width="${outW.toFixed(0)}" height="${outH.toFixed(0)}">`,
    options.fontCss ? `<defs><style>${options.fontCss}</style></defs>` : '',
    bg ? `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="${bg}"/>` : '',
    ...parts,
    '</svg>',
  ].join('')
}

// Just the symbol (for favicons and app icons).
export function buildIconSVG(concept, design, options = {}) {
  const scope = options.scope || `i${++scopeCounter}`
  const iconMarkup = colorize(scopeIds(sanitizeIcon(concept.icon), scope), design.colors, options.mono)
  const size = options.width || 512
  const inset = options.inset ?? 0
  const bg = options.background
  const s = (100 - inset * 2) / 100
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">${
    bg ? `<rect width="100" height="100" rx="${options.radius ?? 0}" fill="${bg}"/>` : ''
  }<g transform="translate(${inset} ${inset}) scale(${s})">${iconMarkup}</g></svg>`
}

// ─── Font loading ────────────────────────────────────────────────────────────

const loadedFamilies = new Set()

export function ensureFontsLoaded(families) {
  const missing = families.filter(f => !loadedFamilies.has(f))
  if (missing.length === 0) return Promise.resolve()
  missing.forEach(f => loadedFamilies.add(f))
  const query = missing
    .map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@${findFont(f).weights.join(';')}`)
    .join('&')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${query}&display=swap`
  document.head.appendChild(link)
  return new Promise(resolve => {
    link.onload = () => {
      Promise.all(missing.map(f => document.fonts.load(`400 20px "${f}"`).catch(() => {})))
        .then(() => document.fonts.ready)
        .then(resolve)
    }
    link.onerror = resolve
  })
}
