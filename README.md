# Skill Setu

AI tool that helps women recognize household/caregiving experience as
income-generating skills, through a short conversation.

## How it's built

- `public/index.html` — the entire frontend (chat UI + results screen).
  Runs in the browser, never sees the API key.
- `api/chat.js` — a small backend function. Only this file talks to the
  Anthropic API, using a key that stays on the server.

## Deploy steps (no coding needed after this)

1. **Push to GitHub**
   - Create a new repo on github.com
   - Upload this whole folder to it (drag-and-drop on GitHub, or
     `git init && git add . && git commit -m "first" && git push`)
   - `.env` is already excluded via `.gitignore` — your real key never
     goes to GitHub

2. **Deploy on Vercel**
   - Go to vercel.com → New Project → Import your GitHub repo
   - Vercel auto-detects everything, no build settings needed
   - Before clicking Deploy, go to **Environment Variables** and add:
     - Name: `ANTHROPIC_API_KEY`
     - Value: (your key from console.anthropic.com/settings/keys)
   - Click Deploy

3. **Done**
   - You'll get a live link like `skillsetu.vercel.app`
   - This works from any device, doesn't touch your personal Claude.ai
     chat limit, and judges can open it directly

## Local testing (optional)

If you want to test on your laptop before deploying:
```
npm install -g vercel
vercel dev
```
This needs a real `.env` file (copy `.env.example` to `.env` and add
your key) — `vercel dev` reads it automatically.

## Notes

- The model used is `claude-sonnet-5` — change this in `api/chat.js`
  if you want a different one.
- No npm packages are required — `api/chat.js` uses the built-in
  `fetch`, so there's no `package.json` dependency install needed.
