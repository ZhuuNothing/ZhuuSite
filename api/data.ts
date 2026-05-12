import type { VercelRequest, VercelResponse } from "@vercel/node";
import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;
function db() {
  if (!_sql) _sql = postgres(process.env.DATABASE_URL!, { ssl: "require", max: 1 });
  return _sql;
}

function resource(url: string) {
  return (url.split("?")[0].replace(/^\/api\/public\/?/, "").split("/")[0]) ?? "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const r = resource(req.url ?? "");
  const sql = db();
  try {
    if (r === "linktree" && req.method === "GET")
      return res.json(await sql`SELECT * FROM linktree_links WHERE active=true ORDER BY sort_order`);
    if (r === "sounds" && req.method === "GET")
      return res.json(await sql`SELECT * FROM sounds WHERE active=true ORDER BY sort_order`);
    if (r === "community" && req.method === "GET")
      return res.json(await sql`SELECT * FROM community_links WHERE active=true ORDER BY sort_order`);
    if (r === "feedback" && req.method === "POST") {
      const { type, rating, name, email, message } = req.body ?? {};
      if (!message?.trim()) return res.status(400).json({ error: "Message required" });
      const [row] = await sql`INSERT INTO feedback (type,rating,name,email,message) VALUES (${type},${rating},${name},${email},${message}) RETURNING *`;
      return res.json(row);
    }
    res.status(404).json({ error: "Not found" });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
