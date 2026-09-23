# Skill Setu — Agent & Contributor Guide

## Purpose

Skill Setu helps Indian women (especially 40+, returning to income after caregiving years) **recognize skills hidden in everyday life** and take a grounded first step toward monetizing them.

**Core philosophy:** *Don't ask women what skills they have. Ask them what they do.*  
Life experience → evidence → hidden skill → why it counts → possible directions → first proof of work → 30-day plan → Skill Passport.

## Target users

- Women who run households, care for family, organize functions, manage budgets, teach informally, or upskill on their own
- Hindi/Hinglish-first; English supported
- Mobile-first; low friction; no resume required

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Frontend | `public/index.html` | Single-page app: welcome, chat, results/passport. Calls `/api/chat` only — **never** holds API keys |
| Backend | `api/chat.js` | Vercel serverless: proxies Anthropic Messages API with `ANTHROPIC_API_KEY` from env |
| Config | `.env` (local), Vercel env (prod) | Secrets server-side only |
| Docs | `README.md`, `DESIGN.md`, this file | Deploy + design reference |

No `package.json` required for runtime; backend uses native `fetch`.

## Product flow (UI)

1. **Welcome** — warm headline, 2 min · 5 questions, start / demo
2. **Conversation** — 5 turns; progress “Discovering your skills · n/5”; adaptive evidence questions (not a form)
3. **Results** — Skill discovery cards, directions (2–3), first proof of work, 30-day plan, **Skill Passport** with copy/share

## AI rules (chat mode)

- Warm, respectful, never patronizing; 2–4 sentences per reply
- **Gather concrete evidence** before implying a skill; ask adaptive follow-ups (e.g. budget vs guests vs vendors)
- Turns 1–3: daily life and what they handle; turns 4–5: lightweight **fit** (time, home/local/online, starting investment, work preference)
- Do not extract skills or assign categories in chat — that happens in extract mode
- Match language: Hindi/Hinglish or English per user toggle

## AI rules (extract mode)

- Map only to the **grounding table** in `public/index.html` (`SKILL_TABLE`); do not invent categories
- If evidence is weak, return fewer skills or note uncertainty — **no fake confidence scores**
- Include: user quote, observed behaviour, why bullets, evidence chain, 2–3 **directions** (why match, has, missing, first step)
- **Never guarantee income** or invent salary figures
- Elder care: certification mandatory before income suggestions
- No medical/legal/financial decisions; frame as options to explore locally

## Safety (non-negotiable)

- No fabricated user experience
- No guaranteed earnings
- Verify locally before money or health decisions (shown in UI disclaimer)
- API keys only in `ANTHROPIC_API_KEY` on server

## Design system

Tokens (CSS variables in `index.html`):

- `--bg` / `--bg-soft`: cream `#FBF6ED`, `#F3ECDC`
- `--teal` / `--teal-light`: `#1B4B43`, `#2E6B5F`
- `--rust`: `#B5502A` (primary CTA)
- `--marigold` / `--marigold-soft`: `#E8A33D`, `#F6D9A6`
- `--ink` / `--ink-soft`: text
- Fonts: **Fraunces** (headlines), **Work Sans** (body)

Tone: warm + premium + human + empowering + modern AI — not government portal, generic chatbot, or HR dashboard.

Visual reference: see `DESIGN.md` for Figma link.

## Coding conventions

- Keep changes in existing files unless splitting is clearly needed
- Preserve `/api/chat` contract: `{ mode: "chat"|"extract", prompt: string }` → `{ text }`
- Escape user/AI content in DOM (`escapeHtml`)
- Support `prefers-reduced-motion` for animations
- Keyboard: Enter to send (Shift+Enter newline); focus management on screen change
- Bilingual strings live in `T.hi` / `T.en` in `index.html`

## Testing checklist

- [ ] Welcome copy and meta badge visible on mobile
- [ ] Full chat: 5 answers → results without console errors
- [ ] Demo persona completes end-to-end
- [ ] API errors show friendly messages (missing key / network)
- [ ] Skill Passport copy and Web Share (or fallback copy)
- [ ] Reduced-motion: hero animations disabled
- [ ] `.env` not tracked; `git status` clean of secrets
- [ ] `vercel dev` or deploy smoke test with env var set

## Local dev

```bash
npm install -g vercel   # optional
cp .env.example .env    # add ANTHROPIC_API_KEY
vercel dev
```

Open the served URL (not `file://` — API routes need a server).
