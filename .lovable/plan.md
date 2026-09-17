# Plan: Package Time Chat for copy to another Lovable instance

## Goal
Give you a single downloadable ZIP of the full app source that you can email to yourself and import into a new Lovable project, plus a short setup checklist of the external things that don't travel inside the ZIP.

## What gets packaged
A clean ZIP at `/mnt/documents/time-chat-source.zip` containing the project source, excluding build artifacts and dependencies:
- `src/` (all components, pages, data, services, assets — including the 12 persona portraits)
- `supabase/functions/chat-with-character/index.ts` (the OpenAI edge function)
- `public/`, `index.html`, `package.json`, `bun.lockb`, `tsconfig*.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `eslint.config.js`, `README.md`, `.gitignore`

Excluded (regenerated on install): `node_modules/`, `*.tsbuildinfo`, `.workspace/`, `.git/`.

A bundled `SETUP-NOTES.md` is included inside the ZIP listing the external dependencies to reconfigure in the new instance.

## What does NOT travel in the ZIP (you must set these up in the new instance)
1. **n8n webhook URL** — currently hardcoded in `src/services/chatService.ts`:
   `https://claritasllc.app.n8n.cloud/webhook/5b51b564-5628-4d9b-a4f0-a2c39f531673`
   This is the live chat engine. It still works from any instance, but note it's exposed in client-side code (the security finding from the earlier review).
2. **OpenAI API key** — stored as the `OPENAI_API_KEY` secret in this project's Supabase, used only by the unused `chat-with-character` edge function. Re-add it in the new project's secrets if you want that function to work.
3. **Lovable Cloud / Supabase** — currently enabled here but with **no database tables**. The new instance will need Cloud re-enabled; all current data lives in browser `localStorage`, so nothing is lost or needed from a DB.
4. **Persona portraits** — included in `src/assets/` inside the ZIP, so these transfer fine.

## How you import into a new Lovable instance
1. Download the ZIP from Files.
2. Email it to yourself.
3. In the new Lovable project, connect GitHub and push the unzipped source, **or** create a new project and paste the key files. (Lovable doesn't have a direct "upload ZIP" import, so GitHub transfer is the cleanest path.)
4. Re-add the webhook URL (already in the code) and re-enable Cloud + the `OPENAI_API_KEY` secret if you want the edge function.
5. Run the app — `localStorage`-based features work immediately with no DB.

## Deliverable
One file in Files: `time-chat-source.zip` — the complete source, ready to email and copy.
