import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../db";
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try { res.json(await getDb()`SELECT * FROM sounds WHERE active=true ORDER BY sort_order`); }
  catch (e: any) { res.status(500).json({ error: e.message }); }
}
