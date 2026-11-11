# ASCEND — Rise Beyond Reality
A calm real-life simulation chat game by ASCEND STUDIO. Powered by XM.

React + Vite + Supabase (Google auth, Postgres, Realtime, Presence), installable PWA.

## Setup
1. Run the SQL in the Supabase SQL editor.
2. Enable the Google provider in Supabase Auth and add redirect URLs.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (build-time).
4. `npm install && npm run build` (publish `dist`).

## Render (static site)
Build: `npm install && npm run build` · Publish dir: `dist` · Rewrite `/*` → `/index.html` (see render.yaml).
