# GEO / AI-Search Analysis — garvarora.netlify.app

_Single-page React/Vite portfolio · analyzed 2026-06-23_

## GEO Readiness Score: 42 → ~72 / 100 (after fixes in this commit)

The dominant issue is architectural: the site is a **client-rendered SPA**.
Per Google's own guidance and this skill's criteria, **AI crawlers do not
execute JavaScript** — so before this commit, GPTBot / PerplexityBot / ClaudeBot
fetched `https://garvarora.netlify.app/` and saw an empty `<div id="root">`.
No identity, no projects, nothing citable. Everything else is secondary to that.

## Platform breakdown (pre-fix)

| Surface | Score | Why |
|---------|-------|-----|
| Google AI Overviews | Low | Ranking-correlated; thin static HTML, no schema |
| ChatGPT search | Very low | No JS execution → empty page; no entity signals |
| Perplexity | Very low | Same; relies on extractable text + community mentions |

## What was fixed in-repo (this commit)

1. **`<noscript>` content fallback in `index.html`** — name, role, bio, both
   projects (with the Moodify latency stat), and contact now exist as static,
   extractable HTML. This is the single highest-impact change for a JS SPA.
2. **JSON-LD `ProfilePage` → `Person`** schema in `<head>`, static: `jobTitle`,
   `alumniOf` (Manipal University Jaipur), `knowsAbout`, and `sameAs`
   (GitHub, LinkedIn) for entity disambiguation.
3. **`robots.txt`** explicitly allowing GPTBot, OAI-SearchBot, ChatGPT-User,
   ClaudeBot, PerplexityBot, Google-Extended + sitemap reference.
4. **`sitemap.xml`** (was 404).
5. **`llms.txt`** structured summary. _Caveat:_ Google's primary source and the
   SE Ranking / OtterlyAI studies show `llms.txt` is **not currently a citation
   lever**; included because it was requested and is harmless.
6. **OG/Twitter image + absolute URLs + canonical** (done in the main task) —
   improves how the page is represented when an AI surface links to it.

## AI Crawler Access — now

| Crawler | Status |
|---------|--------|
| GPTBot, OAI-SearchBot, ChatGPT-User | Allowed |
| ClaudeBot | Allowed |
| PerplexityBot | Allowed |
| Google-Extended | Allowed |

## Top 5 highest-impact changes still open (not code I can do for you)

1. **Real SSR/prerender** — the `<noscript>` block is a floor, not a ceiling.
   Prerendering the actual page (e.g. `vite-plugin-prerender`, or migrating the
   shell to Astro/Next) would let crawlers see the *full* content, not a summary.
2. **Brand mentions > backlinks** (Ahrefs: ~3× stronger correlation with AI
   citations). Get "Garv Arora" mentioned on **GitHub READMEs, LinkedIn posts,
   Reddit, and a YouTube demo of Moodify**. This is the biggest external lever.
3. **Ship the projects with public write-ups** — a short case study per project
   (problem → approach → the 83% latency number) is exactly the self-contained,
   stat-bearing passage AI engines cite.
4. **Recency signal** — add a visible "last updated" and refresh periodically;
   content <3 months old is ~3× more likely to be cited.
5. **Entity presence** — consistent name + same `sameAs` links everywhere builds
   the entity graph that ChatGPT (Wikipedia/LinkedIn-weighted) leans on.

## Note on verification

`robots.txt`, `sitemap.xml`, `llms.txt`, JSON-LD, and the `<noscript>` block are
confirmed present in the production build (`dist/`). They go live on next deploy.
After deploying, validate the schema at validator.schema.org and re-run this
analysis against the live URL for an updated score.
