import JSZip from 'jszip'
import { jsPDF } from 'jspdf'
import { nearestWeight } from '../../shared/catalog.js'
import { buildLogoSVG, buildIconSVG, BACKGROUNDS } from './logo.js'

// ─── Fonts ───────────────────────────────────────────────────────────────────
// SVGs drawn into a canvas can't reach web fonts, so the used glyphs are
// fetched from Google Fonts and inlined as data URLs.

const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

export async function getEmbeddedFontCss(family, weights, text) {
  try {
    const unique = [...new Set(weights.map(w => nearestWeight(family, w)))].sort((a, b) => a - b)
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${unique.join(';')}&text=${encodeURIComponent(text)}`
    let css = await (await fetch(url)).text()
    const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))]
    for (const fontUrl of urls) {
      const data = await blobToDataURL(await (await fetch(fontUrl)).blob())
      css = css.replaceAll(fontUrl, data)
    }
    return css
  } catch {
    return ''
  }
}

// ─── Rasterizing ─────────────────────────────────────────────────────────────

export function svgToPngBlob(svg, width) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }))
    img.onload = () => {
      const ratio = img.naturalHeight / img.naturalWidth || 1
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = Math.round(width * ratio)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob(b => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('SVG could not be rendered'))
    }
    img.src = url
  })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const slugify = (s) =>
  (s || 'marca').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'marca'

const fontCssFor = (design, brand) =>
  getEmbeddedFontCss(
    design.font,
    [design.fontWeight, 400],
    `${brand.brandName}${brand.brandName.toUpperCase()}${brand.brandName.toLowerCase()}${brand.slogan || ''}`,
  )

// ─── Single downloads ────────────────────────────────────────────────────────

export async function downloadSvg(concept, design, brand) {
  const fontCss = await fontCssFor(design, brand)
  const svg = buildLogoSVG(concept, design, brand, { background: BACKGROUNDS[design.background], fontCss })
  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `${slugify(brand.brandName)}-logo.svg`)
}

export async function downloadPng(concept, design, brand, width = 2048) {
  const fontCss = await fontCssFor(design, brand)
  const svg = buildLogoSVG(concept, design, brand, { background: BACKGROUNDS[design.background], fontCss })
  downloadBlob(await svgToPngBlob(svg, width), `${slugify(brand.brandName)}-logo-${width}.png`)
}

// ─── Brand kit ───────────────────────────────────────────────────────────────

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const hexToCmyk = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255)
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return [0, 0, 0, 100]
  return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map(v => Math.round(v * 100))
}

const blobToDataUrl = blobToDataURL

async function buildGuidePdf({ concept, design, brand, pngs }) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const H = 297
  const ink = [17, 17, 17]
  const muted = [110, 110, 110]

  const header = (title, n) => {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...muted)
    pdf.text(`${brand.brandName.toUpperCase()} — GUÍA DE MARCA`, 18, 16)
    pdf.text(String(n).padStart(2, '0'), W - 18, 16, { align: 'right' })
    pdf.setDrawColor(220)
    pdf.line(18, 20, W - 18, 20)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(22)
    pdf.setTextColor(...ink)
    pdf.text(title, 18, 38)
  }

  const fit = async (blob, maxW, maxH) => {
    const url = await blobToDataUrl(blob)
    const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = url })
    const ratio = img.naturalWidth / img.naturalHeight
    let w = maxW
    let h = w / ratio
    if (h > maxH) { h = maxH; w = h * ratio }
    return { url, w, h }
  }

  // Cover
  const cover = await fit(pngs.colorLight, 130, 90)
  pdf.addImage(cover.url, 'PNG', (W - cover.w) / 2, 100 - cover.h / 2, cover.w, cover.h)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(26)
  pdf.setTextColor(...ink)
  pdf.text('Guía de marca', 18, 230)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  pdf.setTextColor(...muted)
  pdf.text(`${brand.brandName}${brand.slogan ? ` · ${brand.slogan}` : ''}`, 18, 240)
  pdf.text(`Generado con LogoAI Studio · ${new Date().toLocaleDateString('es-ES')}`, 18, 280)

  // Concept & logo versions
  pdf.addPage()
  header('Logotipo', 1)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...muted)
  pdf.text(pdf.splitTextToSize(`${concept.title}. ${concept.rationale || ''}`, W - 36), 18, 48)

  const boxes = [
    { label: 'Versión principal', blob: pngs.colorLight, bg: [255, 255, 255] },
    { label: 'Sobre fondo oscuro', blob: pngs.colorDark, bg: [17, 17, 17] },
    { label: 'Monocromo negro', blob: pngs.monoBlack, bg: [245, 243, 238] },
    { label: 'Monocromo blanco', blob: pngs.monoWhite, bg: [17, 17, 17] },
  ]
  let y = 66
  for (let i = 0; i < boxes.length; i++) {
    const col = i % 2
    const x = 18 + col * 89
    if (i === 2) y += 78
    pdf.setFillColor(...boxes[i].bg)
    pdf.setDrawColor(225)
    pdf.rect(x, y, 85, 64, 'FD')
    const img = await fit(boxes[i].blob, 65, 40)
    pdf.addImage(img.url, 'PNG', x + (85 - img.w) / 2, y + (64 - img.h) / 2, img.w, img.h)
    pdf.setFontSize(9)
    pdf.setTextColor(...muted)
    pdf.text(boxes[i].label, x, y + 70)
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(...ink)
  pdf.text('Área de protección y tamaño mínimo', 18, 236)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...muted)
  pdf.text(pdf.splitTextToSize(
    'Deja alrededor del logotipo un espacio libre equivalente, como mínimo, a la altura de la inicial del nombre. ' +
    'No reproduzcas la versión completa por debajo de 25 mm (120 px) de ancho; para tamaños menores usa solo el símbolo. ' +
    'No deformes, rotes, cambies los colores ni añadas efectos al logotipo.',
    W - 36,
  ), 18, 244)

  // Colors
  pdf.addPage()
  header('Colores', 2)
  const swatches = [
    ['Primario', design.colors.primary],
    ['Secundario', design.colors.secondary],
    ['Acento', design.colors.accent],
    ['Texto', design.colors.text],
  ]
  swatches.forEach(([label, hex], i) => {
    const x = 18 + (i % 2) * 89
    const top = 52 + Math.floor(i / 2) * 92
    pdf.setFillColor(...hexToRgb(hex))
    pdf.setDrawColor(225)
    pdf.rect(x, top, 85, 52, 'FD')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.setTextColor(...ink)
    pdf.text(label, x, top + 60)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(...muted)
    pdf.text(`HEX ${hex.toUpperCase()}`, x, top + 66)
    pdf.text(`RGB ${hexToRgb(hex).join(', ')}`, x, top + 71)
    pdf.text(`CMYK ${hexToCmyk(hex).join(', ')}`, x, top + 76)
  })

  // Typography
  pdf.addPage()
  header('Tipografía', 3)
  const typeImg = await fit(pngs.typeSample, W - 36, 60)
  pdf.addImage(typeImg.url, 'PNG', 18, 50, typeImg.w, typeImg.h)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(...muted)
  pdf.text([
    `Familia: ${design.font}`,
    `Peso del nombre: ${nearestWeight(design.font, design.fontWeight)}`,
    `Espaciado: ${design.letterSpacing.toFixed(2)} em`,
    `Disponible gratis en fonts.google.com`,
  ], 18, 50 + typeImg.h + 14)

  return pdf.output('blob')
}

export async function downloadBrandKit(concept, design, brand, onProgress = () => {}) {
  const zip = new JSZip()
  const slug = slugify(brand.brandName)
  const fontCss = await fontCssFor(design, brand)
  onProgress(0.1)

  const variants = {
    'logo-color': buildLogoSVG(concept, design, brand, { fontCss }),
    'logo-color-fondo-blanco': buildLogoSVG(concept, design, brand, { fontCss, background: '#ffffff' }),
    'logo-color-fondo-oscuro': buildLogoSVG(concept, { ...design, colors: { ...design.colors, text: '#ffffff' } }, brand, { fontCss, background: '#111111' }),
    'logo-mono-negro': buildLogoSVG(concept, design, brand, { fontCss, mono: '#111111' }),
    'logo-mono-blanco': buildLogoSVG(concept, design, brand, { fontCss, mono: '#ffffff' }),
  }
  const horizontal = { ...design, layout: 'horizontal' }
  const stacked = { ...design, layout: 'stacked' }
  const layouts = {
    'logo-horizontal': buildLogoSVG(concept, horizontal, brand, { fontCss }),
    'logo-apilado': buildLogoSVG(concept, stacked, brand, { fontCss }),
    'simbolo': buildIconSVG(concept, design, { width: 512 }),
  }

  const svgDir = zip.folder('svg')
  for (const [name, svg] of Object.entries({ ...variants, ...layouts })) svgDir.file(`${slug}-${name}.svg`, svg)
  onProgress(0.25)

  const pngDir = zip.folder('png')
  for (const [name, svg] of Object.entries(variants)) {
    for (const w of [1024, 2048]) pngDir.file(`${slug}-${name}-${w}.png`, await svgToPngBlob(svg, w))
  }
  for (const [name, svg] of Object.entries(layouts)) pngDir.file(`${slug}-${name}-1024.png`, await svgToPngBlob(svg, 1024))
  onProgress(0.55)

  const web = zip.folder('web')
  web.file('favicon.svg', buildIconSVG(concept, design, { width: 64 }))
  for (const size of [32, 180, 192, 512]) {
    const bg = size === 32 ? null : '#ffffff'
    web.file(
      size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`,
      await svgToPngBlob(buildIconSVG(concept, design, { width: size, background: bg, inset: bg ? 16 : 0 }), size),
    )
  }
  const social = zip.folder('redes-sociales')
  social.file(
    'avatar-1080.png',
    await svgToPngBlob(buildIconSVG(concept, design, { width: 1080, background: BACKGROUNDS.light, inset: 20 }), 1080),
  )
  onProgress(0.7)

  const typeSampleSvg = buildLogoSVG(concept, { ...design, layout: 'wordmark', showSlogan: true }, brand, { fontCss, background: '#ffffff' })
  const pdf = await buildGuidePdf({
    concept,
    design,
    brand,
    pngs: {
      colorLight: await svgToPngBlob(variants['logo-color-fondo-blanco'], 1600),
      colorDark: await svgToPngBlob(variants['logo-color-fondo-oscuro'], 1200),
      monoBlack: await svgToPngBlob(variants['logo-mono-negro'], 1200),
      monoWhite: await svgToPngBlob(variants['logo-mono-blanco'], 1200),
      typeSample: await svgToPngBlob(typeSampleSvg, 1600),
    },
  })
  zip.file(`${slug}-guia-de-marca.pdf`, pdf)
  onProgress(0.9)

  zip.file('LEEME.txt', [
    `Kit de marca de ${brand.brandName}`,
    '',
    'svg/            Logotipo vectorial en todas sus versiones (escalable, ideal para imprenta y web).',
    'png/            Versiones rasterizadas en alta resolución, con y sin fondo.',
    'web/            Favicon e iconos para web y móvil.',
    'redes-sociales/ Imagen de perfil cuadrada.',
    '',
    `Tipografía: ${design.font} (Google Fonts)`,
    `Colores: primario ${design.colors.primary} · secundario ${design.colors.secondary} · acento ${design.colors.accent} · texto ${design.colors.text}`,
  ].join('\n'))

  const blob = await zip.generateAsync({ type: 'blob' })
  onProgress(1)
  downloadBlob(blob, `${slug}-kit-de-marca.zip`)
}
