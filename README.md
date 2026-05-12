# ZhuuVIP — Vercel Deployment (Hobby Plan Compatible)

## Only 3 Serverless Functions (under Vercel's 12-function limit)
- api/ai.ts     → /api/openai/** (AI chat)
- api/admin.ts  → /api/admin/**  (admin panel + CRUD)
- api/data.ts   → /api/public/** (public data)

## Environment Variables (Vercel → Project → Settings → Env Vars)

| Variable                    | Required | Notes                              |
|-----------------------------|----------|------------------------------------|
| VITE_CLERK_PUBLISHABLE_KEY  | YES      | Clerk Dashboard → API Keys         |
| DATABASE_URL                | YES      | Neon/Supabase Postgres URL         |
| ADMIN_PASSWORD              | YES      | default: zhuu2026admin             |
| OPENAI_API_KEY              | YES (AI) | OpenAI secret key                  |
| GEMINI_API_KEY              | optional | Alternative AI provider            |
| CLERK_SECRET_KEY            | optional | Admin → Users tab                  |

## Database Setup (Neon — free at neon.tech)

Run this SQL in your Neon SQL editor after creating a project:

CREATE TABLE linktree_links (id SERIAL PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT, url TEXT NOT NULL, icon TEXT, icon_type TEXT, color TEXT DEFAULT '#00e5ff', badge TEXT, sort_order INT DEFAULT 0, active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE sounds (id SERIAL PRIMARY KEY, title TEXT NOT NULL, artist TEXT, url TEXT NOT NULL, cover TEXT, active BOOLEAN DEFAULT true, sort_order INT DEFAULT 0);
CREATE TABLE feedback (id SERIAL PRIMARY KEY, type TEXT, rating INT, name TEXT, email TEXT, message TEXT NOT NULL, read BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE community_links (id SERIAL PRIMARY KEY, name TEXT NOT NULL, icon TEXT, description TEXT, url TEXT NOT NULL, members TEXT, btn_text TEXT DEFAULT 'Join', color TEXT DEFAULT '#00e5ff', badge TEXT, sort_order INT DEFAULT 0, active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE site_settings (key TEXT PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ DEFAULT NOW());
INSERT INTO community_links (name,icon,description,url,members,btn_text,color,active) VALUES ('Circle Vendetta Noire','fire','Komunitas utama ZhuuVIP','https://chat.whatsapp.com/LC8ybe9WPZAEYO2lkmN4X4','500+','Join WA','#00e5ff',true);

## Deploy Steps
1. Upload this folder to a GitHub repository
2. Go to vercel.com → New Project → Import the repo
3. Framework: Vite (auto-detected), Build: npm run build, Output: dist
4. Add all env vars above
5. Deploy!

Admin panel: yoursite.vercel.app/admin
