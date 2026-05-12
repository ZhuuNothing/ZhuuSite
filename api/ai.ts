import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `You are Zhuu AI — a friendly, helpful AI assistant for ZhuuVIP.

LANGUAGE RULES (critical — follow exactly):
- Detect the language the user is writing in.
- If the user writes in Indonesian, respond entirely in Indonesian.
- If the user writes in English, respond entirely in English.
- NEVER mix Indonesian and English words in the same sentence.
- Write every word completely — never cut letters out of words or merge words together.
- Write naturally and fluently as a native speaker would.

VISION RULES:
- When an image is provided, carefully examine and describe everything you see in it.
- Be specific: mention text, colors, layout, objects, people, code, UI elements, etc.
- If it is code or an error message, read it and explain what it shows.
- Never ask the user to describe the image yourself — you can see it.

ZhuuVIP information:
- Donate: sociabuzz.com/zhuuvip/tribe
- Buy/Order: wa.me/62882005730502
- Community (Circle Vendetta Noire): chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4
- Tools info: whatsapp.com/channel/0029VaXLuPM002TGAkbWtb3G

Keep replies concise, warm and helpful. Use ocean emojis occasionally 🌊.`;

type MsgPart = { type: string; text?: string; image_url?: { url: string } };
type Msg = { role: string; content: string | MsgPart[] };

function sse(res: VercelResponse, data: string) { res.write(`data: ${data}\n\n`); }
function token(res: VercelResponse, t: string) {
  sse(res, JSON.stringify({ choices: [{ delta: { content: t }, finish_reason: null }] }));
}
function hasImage(msgs: Msg[]) {
  return msgs.some(m => Array.isArray(m.content) && (m.content as MsgPart[]).some(p => p.type === "image_url" && p.image_url?.url));
}

async function tryOpenAI(msgs: Msg[], key: string, base: string, res: VercelResponse): Promise<boolean> {
  try {
    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "system", content: SYSTEM_PROMPT }, ...msgs], stream: true, max_tokens: 1500 }),
    });
    if (!r.ok || !r.body) return false;
    for await (const chunk of r.body as unknown as AsyncIterable<Uint8Array>)
      for (const line of new TextDecoder().decode(chunk, { stream: true }).split("\n"))
        if (line.startsWith("data: ")) sse(res, line.slice(6));
    sse(res, "[DONE]"); res.end(); return true;
  } catch { return false; }
}

async function tryGemini(msgs: Msg[], key: string, res: VercelResponse): Promise<boolean> {
  try {
    const contents = msgs.slice(-20).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: typeof m.content === "string" ? [{ text: m.content }] :
        (m.content as MsgPart[]).map(p => p.type === "text" ? { text: p.text ?? "" } :
          p.type === "image_url" ? { inline_data: { mime_type: "image/jpeg", data: (p.image_url?.url ?? "").split(",")[1] ?? "" } } : { text: "" }),
    }));
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents, generationConfig: { maxOutputTokens: 1500 } }) });
    if (!r.ok || !r.body) return false;
    let buf = "";
    for await (const chunk of r.body as unknown as AsyncIterable<Uint8Array>) {
      buf += new TextDecoder().decode(chunk, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const line of lines)
        if (line.startsWith("data: ")) try { const t = JSON.parse(line.slice(6))?.candidates?.[0]?.content?.parts?.[0]?.text; if (t) token(res, t); } catch { }
    }
    sse(res, "[DONE]"); res.end(); return true;
  } catch { return false; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages } = req.body ?? {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const msgs: Msg[] = messages.slice(-20);
  const img = hasImage(msgs);
  const OAI = process.env.OPENAI_API_KEY;
  const BASE = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const GEM = process.env.GEMINI_API_KEY;
  if (img) {
    if (OAI && await tryOpenAI(msgs, OAI, BASE, res)) return;
    if (GEM && await tryGemini(msgs, GEM, res)) return;
    let i = 0; const words = "Saya bisa melihat gambar yang kamu kirim, tapi untuk menganalisisnya saya perlu API key vision. Tolong ceritakan apa yang ada di gambar tersebut! 🌊".split(/(?<=\s)/);
    const s = () => { if (i >= words.length) { sse(res, "[DONE]"); res.end(); return; } token(res, words[i++]); setTimeout(s, 18); }; s(); return;
  }
  if (OAI && await tryOpenAI(msgs, OAI, BASE, res)) return;
  if (GEM && await tryGemini(msgs, GEM, res)) return;
  token(res, "Maaf, AI tidak dapat dijangkau. Tambahkan OPENAI_API_KEY atau GEMINI_API_KEY di Vercel Environment Variables! 🌊");
  sse(res, "[DONE]"); res.end();
}
