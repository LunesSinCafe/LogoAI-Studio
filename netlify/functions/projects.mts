import type { Config, Context } from "@netlify/functions";
import { eq, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import { projects } from "../../db/schema.js";

const MAX_PAYLOAD = 200_000;

const newId = (bytes: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(36).padStart(2, "0")).join("").slice(0, bytes * 2);

const publicProject = (p: typeof projects.$inferSelect) => ({
  id: p.id,
  brandName: p.brandName,
  slogan: p.slogan,
  brief: p.brief,
  concepts: p.concepts,
  design: p.design,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

async function readBody(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_PAYLOAD) throw new Error("too_large");
  const body = JSON.parse(raw);
  const brandName = typeof body.brandName === "string" ? body.brandName.trim().slice(0, 40) : "";
  const slogan = typeof body.slogan === "string" ? body.slogan.trim().slice(0, 80) : "";
  if (!brandName || !Array.isArray(body.concepts) || body.concepts.length === 0 || body.concepts.length > 12) {
    throw new Error("invalid");
  }
  if (typeof body.design !== "object" || body.design === null) throw new Error("invalid");
  return { brandName, slogan, brief: body.brief ?? {}, concepts: body.concepts, design: body.design };
}

const badRequest = (e: unknown) =>
  Response.json(
    { error: (e as Error).message === "too_large" ? "El proyecto es demasiado grande" : "Datos del proyecto no válidos" },
    { status: 400 },
  );

export default async (req: Request, context: Context) => {
  const id = context.params.id;

  if (!id) {
    if (req.method === "GET") {
      const ids = (new URL(req.url).searchParams.get("ids") || "").split(",").filter(Boolean).slice(0, 50);
      if (ids.length === 0) return Response.json([]);
      const rows = await db.select().from(projects).where(inArray(projects.id, ids));
      return Response.json(rows.map(publicProject));
    }

    if (req.method === "POST") {
      let data;
      try {
        data = await readBody(req);
      } catch (e) {
        return badRequest(e);
      }
      const [row] = await db
        .insert(projects)
        .values({ id: newId(6), editKey: newId(16), ...data })
        .returning();
      return Response.json({ ...publicProject(row), editKey: row.editKey }, { status: 201 });
    }

    return new Response("Method not allowed", { status: 405 });
  }

  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  if (!row) return Response.json({ error: "Proyecto no encontrado" }, { status: 404 });

  if (req.method === "GET") return Response.json(publicProject(row));

  if (req.headers.get("x-edit-key") !== row.editKey) {
    return Response.json({ error: "No tienes permiso para modificar este proyecto" }, { status: 403 });
  }

  if (req.method === "PUT") {
    let data;
    try {
      data = await readBody(req);
    } catch (e) {
      return badRequest(e);
    }
    const [updated] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return Response.json(publicProject(updated));
  }

  if (req.method === "DELETE") {
    await db.delete(projects).where(eq(projects.id, id));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: ["/api/projects", "/api/projects/:id"],
};
