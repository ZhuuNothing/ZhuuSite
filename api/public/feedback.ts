import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../db";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { type, rating, name, email, message } = req.body ?? {};
  if (!message?.trim()) return res.status(400).json({ error: "Message required" });
  try {
    const [row] = await getDb()`INSERT INTO feedback (type,rating,name,email,message) VALUES (${type},${rating},${name},${email},${message}) RETURNING *`;
    res.json(row);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
}
