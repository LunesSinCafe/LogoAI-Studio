import type { Config } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";
import { NICHES, STYLES, FONTS, LAYOUTS, DIRECTIONS } from "../../shared/catalog.js";

const MODEL = "claude-sonnet-5-5";

const SYSTEM = `Eres un director de arte senior especializado en identidad corporativa. Diseñas logotipos vectoriales originales, memorables y funcionales.

Reglas técnicas del símbolo (campo "icon"):
- Es el CONTENIDO interior de un <svg viewBox="0 0 100 100"> (no incluyas la etiqueta <svg>).
- Elementos permitidos: g, path, circle, rect, ellipse, line, polyline, polygon, defs, linearGradient, radialGradient, stop, clipPath.
- Prohibido: text, image, use, foreignObject, script, style, filtros, animaciones, atributos de eventos, enlaces.
- Colores: usa EXCLUSIVAMENTE los tokens {primary}, {secondary} y {accent} (por ejemplo fill="{primary}") o "none". Nunca escribas colores hexadecimales ni blanco.
- Para huecos y contraformas usa fill-rule="evenodd" en lugar de superponer formas de color de fondo, de modo que el símbolo funcione también en una sola tinta.
- El símbolo debe ocupar aproximadamente el área 8..92 y estar ópticamente centrado.
- Prefiere pocos elementos bien construidos (entre 2 y 12). Nada de detalles diminutos: debe leerse a 32px.
- Coordenadas con 1 decimal como máximo.

Tipografía: elige una familia de la lista proporcionada que refuerce el concepto.
Escribe los textos descriptivos en español.`;

const tool = {
  name: "entregar_logo",
  description: "Entrega un concepto de logotipo terminado.",
  input_schema: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "Nombre corto del concepto (2-4 palabras)" },
      rationale: { type: "string", description: "Explicación del concepto en 1-2 frases" },
      icon: { type: "string", description: "Marcado SVG interior del símbolo, viewBox 0 0 100 100" },
      font: { type: "string", enum: FONTS.map((f) => f.family) },
      fontWeight: { type: "integer", enum: [300, 400, 500, 600, 700, 800] },
      letterSpacing: { type: "number", description: "Espaciado entre letras en em, entre -0.05 y 0.4" },
      textCase: { type: "string", enum: ["original", "upper", "lower"] },
      layout: { type: "string", enum: LAYOUTS.filter((l) => l.id !== "wordmark").map((l) => l.id) },
    },
    required: ["title", "rationale", "icon", "font", "fontWeight", "letterSpacing", "textCase", "layout"],
  },
};

const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  const brandName = clip(body.brandName, 40);
  const slogan = clip(body.slogan, 80);
  const notes = clip(body.notes, 400);
  const niche = NICHES.find((n) => n.id === body.niche);
  const style = STYLES.find((s) => s.id === body.style);
  const direction = DIRECTIONS.find((d) => d.id === body.direction) || DIRECTIONS[0];

  if (!brandName || !niche || !style) {
    return Response.json({ error: "Faltan datos del brief" }, { status: 400 });
  }

  const prompt = `Diseña un logotipo para esta marca.

Marca: ${brandName}
${slogan ? `Eslogan: ${slogan}\n` : ""}Sector: ${niche.label} (${niche.hint})
Estilo visual: ${style.prompt}
${notes ? `Indicaciones del cliente: ${notes}\n` : ""}
Dirección creativa obligatoria para este concepto: ${direction.prompt}

Tipografías disponibles: ${FONTS.map((f) => `${f.family} (${f.category})`).join(", ")}.

Evita clichés obvios y resultados genéricos. Entrega el resultado con la herramienta entregar_logo.`;

  try {
    const anthropic = new Anthropic();
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3000,
      system: SYSTEM,
      tools: [tool],
      tool_choice: { type: "tool", name: tool.name },
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content.find((b) => b.type === "tool_use");
    if (!block || block.type !== "tool_use") throw new Error("Respuesta sin logo");
    const out = block.input as Record<string, unknown>;

    const icon = clip(out.icon, 20000);
    if (!icon) throw new Error("Símbolo vacío");
    const font = FONTS.find((f) => f.family === out.font)?.family || "Inter";
    const letterSpacing = Math.max(-0.05, Math.min(0.4, Number(out.letterSpacing) || 0));

    return Response.json({
      id: crypto.randomUUID(),
      direction: direction.id,
      title: clip(out.title, 60) || direction.label,
      rationale: clip(out.rationale, 400),
      icon,
      font,
      fontWeight: Number(out.fontWeight) || 600,
      letterSpacing,
      textCase: ["original", "upper", "lower"].includes(out.textCase as string) ? out.textCase : "original",
      layout: ["horizontal", "stacked", "icon"].includes(out.layout as string) ? out.layout : "horizontal",
    });
  } catch (error) {
    console.error("Logo generation failed", error);
    const status = (error as { status?: number })?.status === 429 ? 429 : 502;
    return Response.json(
      { error: status === 429 ? "Hay mucha demanda ahora mismo. Inténtalo de nuevo en unos segundos." : "No se pudo generar este concepto." },
      { status },
    );
  }
};

export const config: Config = {
  path: "/api/generate",
  method: "POST",
};
