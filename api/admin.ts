import type { VercelRequest, VercelResponse } from "@vercel/node";
import postgres from "postgres";

const PW = process.env.ADMIN_PASSWORD || "zhuu2026admin";
let _sql: ReturnType<typeof postgres> | null = null;
function db() {
  if (!_sql) _sql = postgres(process.env.DATABASE_URL!, { ssl: "require", max: 1 });
  return _sql;
}

function auth(req: VercelRequest, res: VercelResponse): boolean {
  if (req.headers["x-admin-token"] !== PW) { res.status(401).json({ error: "Unauthorized" }); return false; }
  return true;
}

// Parse path like /api/admin/linktree/5 → { resource: "linktree", id: 5 }
// or /api/admin/feedback/5/read → { resource: "feedback", id: 5, sub: "read" }
function parsePath(url: string) {
  const parts = url.split("?")[0].replace(/^\/api\/admin\/?/, "").split("/").filter(Boolean);
  return { resource: parts[0] ?? "", id: parts[1] ? Number(parts[1]) || parts[1] : null, sub: parts[2] ?? null };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { resource, id, sub } = parsePath(req.url ?? "");
  const method = req.method ?? "GET";

  // ── Login (no auth required) ─────────────────────────────────
  if (resource === "login" && method === "POST") {
    const { password } = req.body ?? {};
    return password === PW ? res.json({ success: true, token: PW }) : res.status(401).json({ error: "Wrong password" });
  }

  if (!auth(req, res)) return;
  const sql = db();

  try {
    // ── Clerk Users ───────────────────────────────────────────
    if (resource === "users" && method === "GET") {
      const key = process.env.CLERK_SECRET_KEY;
      if (!key) return res.json({ data: [], error: "CLERK_SECRET_KEY not configured" });
      const r = await fetch("https://api.clerk.com/v1/users?limit=100&order_by=-created_at", { headers: { Authorization: `Bearer ${key}` } });
      return res.json(await r.json());
    }

    // ── Linktree ──────────────────────────────────────────────
    if (resource === "linktree") {
      if (method === "GET" && !id) return res.json(await sql`SELECT * FROM linktree_links ORDER BY sort_order`);
      if (method === "POST") {
        const { title, subtitle, url, icon, iconType: icon_type, color, badge, sortOrder: sort_order, active } = req.body;
        const [r] = await sql`INSERT INTO linktree_links (title,subtitle,url,icon,icon_type,color,badge,sort_order,active) VALUES (${title},${subtitle},${url},${icon},${icon_type},${color},${badge},${sort_order??0},${active??true}) RETURNING *`;
        return res.json(r);
      }
      if (method === "PUT" && id) {
        const { title, subtitle, url, icon, iconType: icon_type, color, badge, sortOrder: sort_order, active } = req.body;
        const [r] = await sql`UPDATE linktree_links SET title=${title},subtitle=${subtitle},url=${url},icon=${icon},icon_type=${icon_type},color=${color},badge=${badge},sort_order=${sort_order},active=${active},updated_at=NOW() WHERE id=${id} RETURNING *`;
        return res.json(r);
      }
      if (method === "DELETE" && id) { await sql`DELETE FROM linktree_links WHERE id=${id}`; return res.json({ success: true }); }
    }

    // ── Sounds ────────────────────────────────────────────────
    if (resource === "sounds") {
      if (method === "GET" && !id) return res.json(await sql`SELECT * FROM sounds ORDER BY sort_order`);
      if (method === "POST") {
        const { title, artist, url, cover, active, sortOrder: sort_order } = req.body;
        const [r] = await sql`INSERT INTO sounds (title,artist,url,cover,active,sort_order) VALUES (${title},${artist},${url},${cover},${active??true},${sort_order??0}) RETURNING *`;
        return res.json(r);
      }
      if (method === "PUT" && id) {
        const { title, artist, url, cover, active, sortOrder: sort_order } = req.body;
        const [r] = await sql`UPDATE sounds SET title=${title},artist=${artist},url=${url},cover=${cover},active=${active},sort_order=${sort_order} WHERE id=${id} RETURNING *`;
        return res.json(r);
      }
      if (method === "DELETE" && id) { await sql`DELETE FROM sounds WHERE id=${id}`; return res.json({ success: true }); }
    }

    // ── Feedback ──────────────────────────────────────────────
    if (resource === "feedback") {
      if (method === "GET" && !id) return res.json(await sql`SELECT * FROM feedback ORDER BY created_at DESC`);
      if (method === "PUT" && id && sub === "read") { await sql`UPDATE feedback SET read=true WHERE id=${id}`; return res.json({ success: true }); }
      if (method === "DELETE" && id) { await sql`DELETE FROM feedback WHERE id=${id}`; return res.json({ success: true }); }
    }

    // ── Community ─────────────────────────────────────────────
    if (resource === "community") {
      if (method === "GET" && !id) return res.json(await sql`SELECT * FROM community_links ORDER BY sort_order`);
      if (method === "POST") {
        const { name, icon, description, url, members, btnText: btn_text, color, badge, sortOrder: sort_order, active } = req.body;
        const [r] = await sql`INSERT INTO community_links (name,icon,description,url,members,btn_text,color,badge,sort_order,active) VALUES (${name},${icon},${description},${url},${members},${btn_text??'Join'},${color},${badge},${sort_order??0},${active??true}) RETURNING *`;
        return res.json(r);
      }
      if (method === "PUT" && id) {
        const { name, icon, description, url, members, btnText: btn_text, color, badge, sortOrder: sort_order, active } = req.body;
        const [r] = await sql`UPDATE community_links SET name=${name},icon=${icon},description=${description},url=${url},members=${members},btn_text=${btn_text},color=${color},badge=${badge},sort_order=${sort_order},active=${active},updated_at=NOW() WHERE id=${id} RETURNING *`;
        return res.json(r);
      }
      if (method === "DELETE" && id) { await sql`DELETE FROM community_links WHERE id=${id}`; return res.json({ success: true }); }
    }

    // ── Settings ──────────────────────────────────────────────
    if (resource === "settings") {
      if (method === "GET") {
        const rows = await sql`SELECT key,value FROM site_settings`;
        const s: Record<string, string> = {};
        rows.forEach((r: any) => { s[r.key] = r.value; });
        return res.json(s);
      }
      if (method === "PUT") {
        for (const [k, v] of Object.entries(req.body ?? {}) as [string, string][])
          await sql`INSERT INTO site_settings (key,value,updated_at) VALUES (${k},${v},NOW()) ON CONFLICT (key) DO UPDATE SET value=${v},updated_at=NOW()`;
        return res.json({ success: true });
      }
    }

    res.status(404).json({ error: "Not found" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
