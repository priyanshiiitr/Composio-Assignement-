# OAuth Pathfinder

A focused take-home for Composio: help developers understand **bring-your-own OAuth app setup and approval** before they launch an AI agent integration.

**Problem we address:** Agent builders can use Composio managed OAuth for many toolkits, but production often needs a custom OAuth app (branding, scopes, quota) — or the toolkit is BYO-only. Docs and portals make it hard to tell whether that path is an afternoon of work or weeks of verification.

**What this ships:** a small curated library of shareable guides + a live Groq-powered investigator that drafts a guide for any app name/website, with **browser session memory**.

## Quick start

```bash
npm install
cp .env.example .env.local
# add GROQ_API_KEY from https://console.groq.com/keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo path for reviewers

1. Open the home page and browse curated guides: **GitHub**, **Notion**, **Slack**, **Gmail**, **Shopify**.
2. Compare difficulty/time: GitHub (same day) vs Gmail (verification-heavy) vs Shopify (BYO required).
3. Use **Generate guide** with an unfamiliar app (e.g. `HubSpot`, `Linear`, `DocuSign`).
4. Generate a second app — session memory lists prior guides and feeds prior app names into the next research prompt.
5. Read [Verification notes](/verification) for what we checked against sources.

## Key product decisions

- **Composio-first framing:** every guide covers managed vs BYO, the Composio redirect URI, and auth-config handoff — not a generic OAuth tutorial.
- **Difficulty and calendar time are first-class:** the hiring brief’s pain is uncertainty about effort and waiting, not OAuth code samples.
- **Agent vs human split:** agents research and draft; humans own portal login, secrets, legal pages, and approval submissions.
- **Evidence is visible:** confidence labels + sources + what remains uncertain.
- **Session memory:** generated guides and prior queries stay in this browser; the agent uses prior apps as contrast context.
- **Scope:** five varied curated guides + live generation, not a fake library of 100.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Vercel AI SDK + **Groq** (`@ai-sdk/groq`, default `openai/gpt-oss-120b`)
- Cheerio for lightweight page text extraction during live research
- Optional **Upstash Redis** for durable generated-guide links on Vercel
- Guides as JSON under `content/guides/`

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes for live generate | Groq API key |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-120b` |
| `UPSTASH_REDIS_REST_URL` | Recommended on Vercel | Durable guide storage |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended on Vercel | Durable guide storage |

## Deploy to Vercel

### 1. Push the repo to GitHub

```bash
git add .
git commit -m "Add OAuth Pathfinder take-home"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Do **not** commit `.env.local` (it is gitignored).

### 2. Create the Vercel project

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Before deploy, open **Environment Variables** and add:

| Name | Value |
| --- | --- |
| `GROQ_API_KEY` | your Groq key |
| `GROQ_MODEL` | `openai/gpt-oss-120b` |

### 3. (Recommended) Add Upstash Redis for shareable generated guides

Without Redis, generated guides still work in the **same browser** via session memory, but server links can break after serverless cold starts.

1. Create a free DB at [https://console.upstash.com/](https://console.upstash.com/)
2. Copy **REST URL** and **REST TOKEN**
3. In Vercel → Project → Settings → Environment Variables, add:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Redeploy

### 4. Deploy

Click **Deploy**, or from the CLI:

```bash
npm i -g vercel
vercel login
vercel
# production:
vercel --prod
```

When prompted, link to the same project and confirm env vars are set for Production.

### 5. Submit to Composio

Send:

- Production URL (e.g. `https://oauth-pathfinder.vercel.app`)
- GitHub repo URL
- Note that live generation needs a Groq key (already configured in Vercel)

## Limitations

- Live generation depends on public page fetch quality; some docs sites block bots — confidence drops to inferred/uncertain when fetches fail.
- Without Upstash on Vercel, generated-guide URLs rely on browser session memory after cold starts.
- We did not complete provider marketplace submissions, paid security assessments, or store real client secrets.
- Timelines are planning ranges from public docs, not SLAs.

## Verification highlights

See [`/verification`](./src/app/verification/page.tsx) in the running app.

- **Google:** corrected early bias that “creating the client” is the hard part; verification/assessment dominates calendar time.
- **Slack:** installable OAuth ≠ Marketplace approval; Marketplace has separate prerequisites and weeks-long review.
- **Composio directory:** confirmed managed availability for GitHub/Notion/Slack/Gmail and BYO for Shopify via [managed auth docs](https://docs.composio.dev/toolkits/managed-auth).

## Project layout

```
content/guides/     curated JSON guides
src/app/            pages + /api/generate
src/components/     UI (includes SessionMemory)
src/lib/            schema, research, storage, session-memory
```
