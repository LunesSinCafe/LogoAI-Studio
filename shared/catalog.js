// Shared between the frontend and Netlify Functions.

export const NICHES = [
  { id: 'tech', label: 'Tecnología', hint: 'software, SaaS, innovación digital' },
  { id: 'ecommerce', label: 'E-commerce', hint: 'tienda online, retail, productos' },
  { id: 'food', label: 'Gastronomía', hint: 'restaurante, café, alimentación' },
  { id: 'fitness', label: 'Fitness y deporte', hint: 'gimnasio, entrenamiento, energía' },
  { id: 'health', label: 'Salud y bienestar', hint: 'clínica, cuidado, calma, confianza' },
  { id: 'finance', label: 'Finanzas', hint: 'banca, inversión, seguridad, solidez' },
  { id: 'education', label: 'Educación', hint: 'academia, aprendizaje, crecimiento' },
  { id: 'realestate', label: 'Inmobiliaria', hint: 'hogar, arquitectura, espacios' },
  { id: 'fashion', label: 'Moda y belleza', hint: 'estética, elegancia, tendencia' },
  { id: 'creative', label: 'Creativo', hint: 'agencia, estudio, diseño, arte' },
]

export const STYLES = [
  { id: 'minimal', label: 'Minimalista', desc: 'Limpio, elegante y atemporal', prompt: 'minimalista: formas geométricas simples, mucho espacio negativo, pocos elementos, trazos precisos' },
  { id: 'geometric', label: 'Geométrico', desc: 'Formas modulares y construidas', prompt: 'geométrico: construcción modular a base de círculos, cuadrados y triángulos, simetría y retícula' },
  { id: 'bold', label: 'Audaz', desc: 'Contundente, gráfico y con impacto', prompt: 'audaz: formas sólidas y pesadas, alto contraste, silueta muy reconocible' },
  { id: 'tech', label: 'Tecnológico', desc: 'Futurista, digital y preciso', prompt: 'tecnológico/futurista: líneas técnicas, ángulos, sensación digital, modular' },
  { id: 'corporate', label: 'Corporativo', desc: 'Profesional y confiable', prompt: 'corporativo: sobrio, estable, equilibrado, transmite confianza y solidez' },
  { id: 'organic', label: 'Orgánico', desc: 'Natural, fluido y humano', prompt: 'orgánico: curvas suaves, formas fluidas inspiradas en la naturaleza, cálido y humano' },
  { id: 'luxury', label: 'Lujo', desc: 'Refinado, sutil y exclusivo', prompt: 'lujo/premium: líneas finas, simetría, elegancia sobria, detalles refinados' },
  { id: 'playful', label: 'Divertido', desc: 'Amigable, cercano y con energía', prompt: 'divertido: formas redondeadas, amigable, dinámico, con personalidad' },
]

export const PALETTES = [
  { id: 'ink', label: 'Tinta y papel', colors: { primary: '#111111', secondary: '#4a4a4a', accent: '#c8b89a' } },
  { id: 'signal', label: 'Señal', colors: { primary: '#ff4f1f', secondary: '#1a1a1a', accent: '#ffc2a8' } },
  { id: 'ocean', label: 'Océano', colors: { primary: '#0b3d91', secondary: '#1e88e5', accent: '#7fd1ff' } },
  { id: 'forest', label: 'Bosque', colors: { primary: '#1f4d3a', secondary: '#3f8f63', accent: '#c7e8a7' } },
  { id: 'sunset', label: 'Atardecer', colors: { primary: '#d9480f', secondary: '#f59f00', accent: '#ffe8a3' } },
  { id: 'violet', label: 'Violeta eléctrico', colors: { primary: '#5b21b6', secondary: '#a855f7', accent: '#22d3ee' } },
  { id: 'rose', label: 'Rosa empolvado', colors: { primary: '#9d174d', secondary: '#e76f96', accent: '#fbcfe8' } },
  { id: 'gold', label: 'Negro y oro', colors: { primary: '#141414', secondary: '#b08d3c', accent: '#e8d7a9' } },
]

// Families available on Google Fonts. `weights` are the ones that exist for each family.
export const FONTS = [
  { family: 'Inter', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Manrope', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Montserrat', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Poppins', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Space Grotesk', category: 'sans', weights: [300, 400, 500, 600, 700] },
  { family: 'Syne', category: 'display', weights: [400, 500, 600, 700, 800] },
  { family: 'Outfit', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Sora', category: 'sans', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Fraunces', category: 'serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800] },
  { family: 'Cormorant Garamond', category: 'serif', weights: [300, 400, 500, 600, 700] },
  { family: 'DM Serif Display', category: 'serif', weights: [400] },
  { family: 'Orbitron', category: 'display', weights: [400, 500, 600, 700, 800] },
  { family: 'Righteous', category: 'display', weights: [400] },
  { family: 'Baloo 2', category: 'display', weights: [400, 500, 600, 700, 800] },
  { family: 'JetBrains Mono', category: 'mono', weights: [300, 400, 500, 600, 700, 800] },
]

export const LAYOUTS = [
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'stacked', label: 'Apilado' },
  { id: 'icon', label: 'Solo símbolo' },
  { id: 'wordmark', label: 'Solo texto' },
]

export const TEXT_CASES = [
  { id: 'original', label: 'Aa' },
  { id: 'upper', label: 'AA' },
  { id: 'lower', label: 'aa' },
]

// One creative direction per generated concept, so the four results differ.
export const DIRECTIONS = [
  { id: 'monogram', label: 'Monograma', prompt: 'MONOGRAMA: un símbolo construido a partir de la inicial o iniciales de la marca, transformadas en una forma gráfica original (no escribas la letra con texto, dibújala con paths).' },
  { id: 'abstract', label: 'Símbolo abstracto', prompt: 'SÍMBOLO ABSTRACTO: una marca geométrica abstracta que exprese los valores y la personalidad de la marca, sin letras.' },
  { id: 'pictorial', label: 'Pictograma', prompt: 'PICTOGRAMA: una ilustración muy simplificada e icónica de un objeto o concepto relacionado con el sector, con un giro ingenioso.' },
  { id: 'emblem', label: 'Emblema', prompt: 'EMBLEMA: un símbolo contenido en una forma (escudo, círculo, sello o insignia) con un motivo interior relacionado con la marca.' },
]

export const findFont = (family) => FONTS.find(f => f.family === family) || FONTS[0]

export const nearestWeight = (family, weight) => {
  const { weights } = findFont(family)
  return weights.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), weights[0])
}
