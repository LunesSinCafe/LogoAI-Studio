# LogoAI Studio

Prototipo MVP interactivo de generación de logos con IA.

## Stack

- React 18 + Vite
- Tailwind CSS
- Lucide React (iconos)
- Framer Motion (animaciones)

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Flujo de la aplicación

1. **Onboarding / Brief** — Nombre de marca, eslogan y selección de nicho
2. **Estilo visual** — Selector de estilo + paleta de colores
3. **Generación IA** — Pantalla de carga con mensajes dinámicos (simulación)
4. **Galería** — 4 variantes de logo generadas como SVG
5. **Editor de detalle** — Cambio de fondo, mockups y descarga del kit de marca

No se requieren claves de API. Toda la generación está simulada con SVGs dinámicos basados en las selecciones del usuario.
