# ZhuuVIP — Vercel Deploy Guide

## Deploy in 3 Steps

1. Extract this zip and push to a new GitHub repo
2. Go to **vercel.com/new** → Import the repo
3. Click **Deploy** (Vite is auto-detected)

The AI chat works **out of the box** — no API key needed!

## Optional: Enable Full GPT AI

Add this in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `OPENAI_API_KEY` | Your key (sk-...) |

When set, the AI upgrades to real GPT-4o-mini responses automatically.
