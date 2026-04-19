# Bhaumik's Notes — Project Plan

## Purpose

A personal blog for Bhaumik Kaji to share thoughts on **tech and design**.  
Not a portfolio extension. Not a job application tool. A genuine outlet.

---

## Identity

- **Name:** Bhaumik's Notes
- **Tagline:** (TBD — something short that signals "tech + design thinking")
- **Author:** Bhaumik Kaji — Senior Product Designer (Microsoft, Copilot/Teams/Office Mobile)
- **Voice:** Direct, opinionated, warm. Not corporate. Not trying to sell.

---

## Audience

Primary: **Bhaumik himself** — this is an outlet first.  
Secondary: Designers, engineers, product people who care about craft.  
Tertiary: Recruiters/hiring managers who find it (but it's not written for them).

---

## Content Types

Inspired by Hardik's format: short notes, not long-form essays.

- **Notes** — short, opinionated, personal (2–10 min reads)
- Design observations and opinions
- Tech experiments and learnings
- AI + design intersection notes
- Career reflections
- Process notes and hot takes
- Not: company-confidential work, press-release content, performative thought leadership

---

## Content Authoring

- **Authoring tool:** TBD (Markdown/MDX likely, possibly Obsidian-sourced)
- **Content lives:** In the repo as Markdown/MDX files
- **No external CMS** — keep it simple, file-based, git-managed

---

## Tech Stack

TBD — options to evaluate:

### Option A: Astro
- Best for content-heavy static sites
- MDX built-in
- Fast, minimal JS
- Great for blogs
- Can use React components if needed
- Easy deployment (Vercel/Netlify/GitHub Pages)

### Option B: Next.js (App Router)
- Full React ecosystem
- SSG/SSR support
- MDX support
- Heavier than Astro for a blog
- Matches portfolio stack (Vite + React)

### Option C: Same stack as portfolio (Vite + React)
- Consistency with portfolio site
- Not purpose-built for content
- Would need more manual blog infrastructure
- Least recommended for a content-first project

### Recommendation
**Astro** — purpose-built for content sites, MDX-native, fast, minimal overhead.  
Blog doesn't need React runtime on every page. Astro renders to static HTML and hydrates only where needed.

But: this is Bhaumik's call. If he wants stack consistency with the portfolio, that's a valid reason to choose differently.

---

## Design Direction — Inspired by hvpandya.com/notes

**Reference site:** https://hvpandya.com/notes/ — Hardik Pandya's notes page

### What we're taking from the reference

- **Minimal aesthetic** — almost no visual noise, content dominates
- **Note-based format** — not "blog posts," notes. Short, opinionated, personal
- **Flat chronological list** — newest first, title + category tag, no thumbnails or hero images needed
- **Category tags** — small, unobtrusive labels (e.g., AI experiments, Design, Leadership, Career, Observations)
- **No comments** — notes, not discussions
- **Newsletter signup** — simple Substack integration for subscribers
- **Personal voice** — "these are my notes," honest, biased, empirical
- **Clean reading experience** — typography-first, minimal chrome
- **Subtle interactivity** — dark mode, smooth transitions, nothing heavy

### What we're doing differently

- Bhaumik's categories will reflect his focus: Tech, Design, AI, Career, Observations, Life
- Bhaumik's voice is his own — not emulating Hardik's writing style
- We may add: RSS, code syntax highlighting, reading time (lightweight)

### General design principles

- **Typography-first** — this is a reading experience
- **Dark mode** supported
- **Minimal distractions** — content is the product
- **Should feel like Bhaumik** — not a template
- Visual relationship to portfolio: TBD (sibling? standalone?)

---

## Core Features (MVP)

1. **Notes index** — flat chronological list, newest first, title + category tag (like hvpandya.com/notes)
2. **Individual note pages** — clean, minimal reading experience
3. **MDX/Markdown authoring** — write in files, not a CMS
4. **Category tags** — Tech, Design, AI, Career, Observations, Life (customizable)
5. **RSS feed** — respect the medium
6. **Responsive** — mobile-first, desktop-great
7. **Dark mode** — expected for this audience
8. **SEO basics** — meta tags, Open Graph, clean URLs
9. **Newsletter signup** — Substack integration (like reference site)
10. **Contact/social links** — Twitter/email, minimal footer

---

## Nice-to-Have (Post-MVP)

- Search (full-text)
- Code syntax highlighting with copy button
- Reading time estimates
- Series/linked posts
- "Start reading here" curated section (like hvpandya.com)
- Analytics (privacy-respecting, probably Plausible or none)
- Obsidian-to-blog pipeline (if Bhaumik wants to author there)
- Projects showcase section (like Hardik's Solari, Stop Slop, etc.)

---

## Hosting & Deployment

TBD — likely options:

- **Vercel** (free tier, easy deploys, custom domain)
- **Netlify** (similar to Vercel)
- **GitHub Pages** (free, simple, but less control over redirects/preview deploys)

Custom domain: TBD (e.g., notes.bhaumikkaji.com or bhaumiksnotes.com or similar)

---

## Project Structure (Astro draft)

```
bhaumiks-notes/
├── src/
│   ├── content/
│   │   └── blog/          # MDX posts live here
│   ├── layouts/           # Page layouts
│   ├── components/        # UI components
│   ├── styles/            # Global styles
│   └── pages/             # Route pages
├── public/                # Static assets
├── astro.config.mjs
├── package.json
└── README.md
```

---

## Git Workflow

- Main branch: `main`
- Feature branches: `judy/<descriptive-suffix>`
- No commits on `main` without Bhaumik's approval
- PR-based workflow for review

---

## Decision Log

| Decision | Choice | Date | Rationale |
|----------|--------|------|-----------|
| Project name | Bhaumik's Notes | 2026-04-18 | Bhaumik's choice |
| Location | `/Developer/Bhaumiks Notes/` | 2026-04-18 | Same folder as other projects |
| Content focus | Tech + Design | 2026-04-18 | Bhaumik's stated purpose |

---

## Open Questions

- [ ] Tech stack: Astro vs Next.js vs Vite+React
- [ ] Visual identity: sibling to portfolio or standalone?
- [ ] Hosting: Vercel / Netlify / GitHub Pages
- [ ] Custom domain
- [ ] Authoring workflow: Obsidian pipeline vs in-repo MDX
- [ ] Tag/category taxonomy
- [ ] Comment policy (likely: no comments)
- [ ] Analytics: none vs privacy-respecting
- [ ] First 3 posts Bhaumik wants to write (drives design priorities)

---

## Principles

1. **Content is the product.** Design serves reading.
2. **Simple over clever.** This is a blog, not a platform.
3. **File-based, git-managed.** No CMS dependency.
4. **Bhaumik's voice, not a template's.**
5. **Ship early, iterate.** MVP first, polish second.