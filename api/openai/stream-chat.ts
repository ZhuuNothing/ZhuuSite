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

function writeSSE(res: VercelResponse, data: string) { res.write(`data: ${data}\n\n`); }
function sendToken(res: VercelResponse, token: string) {
  writeSSE(res, JSON.stringify({ choices: [{ delta: { content: token }, finish_reason: null }] }));
}
function hasImage(messages: Msg[]): boolean {
  return messages.some(m => Array.isArray(m.content) && (m.content as MsgPart[]).some(p => p.type === "image_url" && p.image_url?.url));
}

async function tryOpenAI(messages: Msg[], apiKey: string, baseUrl: string, res: VercelResponse): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages], stream: true, max_tokens: 1500 }),
    });
    if (!response.ok || !response.body) return false;
    for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
      for (const line of new TextDecoder().decode(chunk, { stream: true }).split("\n")) {
        if (line.startsWith("data: ")) writeSSE(res, line.slice(6));
      }
    }
    writeSSE(res, "[DONE]"); res.end(); return true;
  } catch { return false; }
}

async function tryGemini(messages: Msg[], apiKey: string, res: VercelResponse): Promise<boolean> {
  try {
    const contents = messages.slice(-20).map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: typeof m.content === "string" ? [{ text: m.content }] :
        (m.content as MsgPart[]).map(p => p.type === "text" ? { text: p.text ?? "" } :
          p.type === "image_url" ? { inline_data: { mime_type: "image/jpeg", data: (p.image_url?.url ?? "").split(",")[1] ?? "" } } : { text: "" }),
    }));
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents, generationConfig: { maxOutputTokens: 1500 } }) });
    if (!response.ok || !response.body) return false;
    let buf = "";
    for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
      buf += new TextDecoder().decode(chunk, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try { const text = JSON.parse(line.slice(6))?.candidates?.[0]?.content?.parts?.[0]?.text; if (text) sendToken(res, text); } catch { }
        }
      }
    }
    writeSSE(res, "[DONE]"); res.end(); return true;
  } catch { return false; }
}

async function tryReplitAI(messages: Msg[], res: VercelResponse): Promise<boolean> {
  const baseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!baseUrl || !apiKey) return false;
  return tryOpenAI(messages, apiKey, baseUrl, res);
}

function streamVisionUnavailable(res: VercelResponse): void {
  const msg = "Saya bisa melihat gambar yang kamu kirim, tapi untuk menganalisisnya saya perlu API key vision. Tolong ceritakan apa yang ada di gambar tersebut dan saya akan membantu! 🌊";
  let i = 0; const words = msg.split(/(?<=\s)/);
  const send = () => { if (i >= words.length) { writeSSE(res, "[DONE]"); res.end(); return; } sendToken(res, words[i++]); setTimeout(send, 18); };
  send();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages } = req.body;
  if (!Array.isArray(messages)) return res.status(400).json({ error: "messages required" });
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const recentMsgs: Msg[] = messages.slice(-20);
  const imagePresent = hasImage(recentMsgs);
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_BASE = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (imagePresent) {
    if (OPENAI_KEY && await tryOpenAI(recentMsgs, OPENAI_KEY, OPENAI_BASE, res)) return;
    if (GEMINI_KEY && await tryGemini(recentMsgs, GEMINI_KEY, res)) return;
    streamVisionUnavailable(res); return;
  }
  if (OPENAI_KEY && await tryOpenAI(recentMsgs, OPENAI_KEY, OPENAI_BASE, res)) return;
  if (GEMINI_KEY && await tryGemini(recentMsgs, GEMINI_KEY, res)) return;
  if (await tryReplitAI(recentMsgs, res)) return;
  sendToken(res, "Maaf, AI sedang tidak dapat dijangkau. Silakan coba lagi sebentar! 🌊");
  writeSSE(res, "[DONE]"); res.end();
}
