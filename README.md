# ZhuuVIP — Vercel Deployment Guide

## Quick Deploy (No configuration needed!)

1. Extract this zip
2. Push to a new GitHub repo
3. Import the repo at **vercel.com/new**
4. Vercel auto-detects Vite — click **Deploy**

The AI chat works **out of the box** with smart built-in responses — no API key needed!

## Upgrade AI with OpenAI (Optional)

To get full GPT-powered AI responses, add this in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key (sk-...) |

When set, the AI automatically upgrades to real GPT-4o-mini responses.

## Structure

```
zhuuvip-vercel/
├── src/               # React frontend source
├── public/            # Static assets (avatar, logo, bgm.mp3)
├── api/
│   └── openai/
│       └── stream-chat.ts   # Vercel Edge Function (AI chat)
├── index.html
├── vite.config.ts
├── vercel.json        # Vercel build + rewrite config
└── package.json
```
