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

## Reference Site Analysis — hvpandya.com

**Reference site:** https://hvpandya.com/notes/ — Hardik Pandya's personal site

### Overall site structure

The site is a personal homepage with multiple sections:

```
hvpandya.com/
├── /               → Home (intro + latest notes + projects + contact)
├── /work           → Work experience page
├── /notes           → Notes index (the main blog)
├── /interviews     → Talks/interviews page
├── /working-with-me → "Manual" — how to work with Hardik
├── /what-i-use     → Stuff/tools page
├── /iconic         → Curated photo collection
├── /solari         → Project: split-flap display
└── /[slug]         → Individual note pages
```

### Navigation pattern

- **Top nav:** Minimal. Author name left-aligned, section links right.
  - `Hardik Pandya` | `Work` `Notes` `Talks` `Manual` `Stuff`
- **No hamburger menu.** All nav items visible on desktop.
- **Mobile:** Likely collapses to simpler nav.
- **Active state:** Current section highlighted (`nav-active` class).

### Notes index page structure

```
/notes
├── Title: "Notes on products, design & leadership."
├── Intro paragraph (personal, honest voice)
├── Newsletter signup (Substack link)
├── Contact links (Twitter, email)
├── Divider
├── "Start reading here" — 3 curated/featured notes
├── Full chronological list of all notes
│   ├── Each note: title (linked) + category tag (lozenge/pill)
│   ├── No dates visible in the list
│   ├── No thumbnails or excerpts
│   └── No pagination (infinite scroll or single page)
└── Footer
```

Key observations:
- **No dates on the index.** Notes are ordered by recency but dates aren't shown.
- **No excerpts.** Just title + category tag.
- **Category tags are small colored pills/lozenges.** They appear inline after the title.
- **Notes are grouped in small clusters of 3–5** (visible in the HTML structure), creating subtle visual rhythm.
- **"Start reading here" section** — 3 curated notes to onboard new readers.
- **Clean, no-sidebar layout.** Two-column on desktop: heading left, list right.

### Individual note page structure

From the Solari note (which I could fetch):

```
/[slug]
├── Title (h1)
├── Body content (long-form, markdown-rendered)
│   ├── Rich text with links
│   ├── Images (with lightbox support)
│   ├── Code blocks (syntax highlighted)
│   └── Blockquotes
├── Reaction buttons (thoughtful / relatable / good / loved it / blew my mind)
├── "Read more" section — 4 related notes
└── Footer with links
```

Key observations:
- **Clean single-column reading layout**
- **Rich typography** — Tiempos Text (body) + Tiempos Headline (headings) + Geist Mono (code)
- **Self-hosted fonts** (WOFF2, preloaded)
- **Code blocks with syntax highlighting** (via code-block.js)
- **Image lightbox** — click to expand
- **Reactions** — custom emoji-free reaction buttons (not likes, not comments)
- **"Read more" section** at the bottom with related notes
- **No comments**
- **No visible date on the note itself** (though likely in metadata)

### Typography choices

- **Body:** Tiempos Text (variable font, roman + italic)
- **Headings:** Tiempos Headline (variable font)
- **Code:** Geist Mono (variable)
- All **self-hosted WOFF2** with `preload` and `fetchpriority="high"`
- **Monospace for code, serif for everything else** — editorial feel

### SEO & Social Previews

- Full JSON-LD structured data (BlogPosting, BreadcrumbList, Person)
- OpenGraph tags (title, description, image, type, site_name, url)
- Twitter Card tags (summary_large_image)
- Canonical URLs
- `robots`: index, follow
- `color-scheme`: light dark
- **Rich OG preview cards** when links are shared:
  - `og:site_name` → "Bhaumik's Notes" (colored accent)
  - `og:title` → Note title (bold)
  - `og:description` → Note summary or site description
  - `og:image` → Default: high-quality portrait; per-note override available
  - `twitter:card` → `summary_large_image`
  - Should render beautifully in Telegram, Discord, Twitter/X, LinkedIn, iMessage, Slack
- Default OG image: professional portrait or branded image (to be provided by Bhaumik)
- Per-note OG image: optional, notes can specify their own
- RSS feed (`/feed.xml`)
- Atom feed (`/atom.xml`)
- Sitemap (`/sitemap.xml`) (dark mode support)

### CSS & performance

- Single CSS file (`/styles.css?v=4.7.21`) — versioned for cache busting
- No CSS framework detected (custom CSS)
- Minimal JS — only `code-block.js` (deferred)
- Image CDN: `images.hvpandya.com` (preconnect + dns-prefetch)
- Accessibility: skip-to-main-content link, ARIA roles, semantic HTML

### Category system

Hardik's categories (used as tag pills):
- AI experiments
- Leadership
- Career
- Design
- Product
- Observations
- Life
- Travel

### What we're taking from the reference

1. **Minimal aesthetic** — almost no visual noise, content dominates
2. **Note-based format** — not "blog posts," notes. Short, opinionated, personal
3. **Flat chronological list** — newest first, title + category tag
4. **Category pills/lozenges** — small, unobtrusive labels
5. **"Start reading here"** curated section for new visitors
6. **No comments** — notes, not discussions
7. **Newsletter signup** — Substack integration
8. **Contact links** — social/email in the intro
9. **Personal voice** — "these are my notes," honest, biased, empirical
10. **Typography-first reading** — serif body, clean layout, minimal chrome
11. **Self-hosted fonts** — performance + aesthetic control
12. **Full SEO** — JSON-LD, OG tags, RSS, sitemap, canonical URLs
13. **Dark mode** — via `color-scheme: light dark`
14. **Code syntax highlighting** — for tech content
15. **"Read more" related notes** at bottom of each note
16. **Reaction buttons** — custom, emoji-free (optional for us)

### What we're doing differently

- Bhaumik's categories: Tech, Design, AI, Career, Observations, Life
- Bhaumik's voice is his own — not emulating Hardik's writing style
- We may skip reaction buttons for MVP (or add later)
- We may add reading time estimates
- We may add a projects/showcase section later (Hardik has /iconic and /solari)

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
9. **Rich social/OG previews** — when a note link is shared anywhere (Telegram, Discord, Twitter, LinkedIn, iMessage, Slack), it should render a compelling preview card with:
   - Site name (colored accent)
   - Note title (bold)
   - Description/summary
   - Large preview image (author photo or note-specific image)
   - This means: proper `og:title`, `og:description`, `og:image`, `og:type`, `og:site_name`, `og:url`
   - And: `twitter:card` set to `summary_large_image`
   - Default image: a high-quality portrait or branded image for the site
   - Per-note override: notes can specify their own OG image if desired
10. **Newsletter signup** — Substack integration (like reference site)
11. **Contact/social links** — Twitter/email, minimal footer

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

## Page Structure (Based on Reference)

### Homepage
```
/
├── Intro: who Bhaumik is (1–2 sentences)
├── Latest notes (3–5 recent)
└── Contact / social links
```

### Notes Index
```
/notes
├── Title + intro paragraph
├── Newsletter signup (Substack or similar)
├── "Start reading here" — 3 curated notes
└── Full chronological list
    └── Each note: linked title + category pill
```

### Individual Note
```
/notes/[slug]
├── Title (h1)
├── Body content (markdown-rendered)
│   ├── Rich text, links, images
│   ├── Code blocks (syntax highlighted)
│   └── Blockquotes
├── "Read more" — 3–4 related notes
└── Back to notes index
```

### Other Pages (Post-MVP)
```
/about          → About Bhaumik
/projects       → Showcase of side projects
/stuff          → Tools & setup (like Hardik's /what-i-use)
```

### Navigation
```
Header: Bhaumik Kaji | Notes [About] [Projects] [Stuff]
Footer: minimal — RSS, Twitter, email, © year
```

## Project Structure (Astro draft)

```
bhaumiks-notes/
├── src/
│   ├── content/
│   │   └── notes/           # MDX notes live here
│   │       ├── ai-experiments/
│   │       ├── career/
│   │       ├── design/
│   │       ├── observations/
│   │       ├── tech/
│   │       └── life/
│   ├── layouts/
│   │   ├── BaseLayout.astro     # HTML shell, meta, fonts
│   │   ├── NoteLayout.astro     # Individual note page
│   │   └── NotesListLayout.astro # Notes index page
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── NoteCard.astro       # Title + category pill
│   │   ├── CategoryPill.astro
│   │   ├── ReadMore.astro       # Related notes section
│   │   ├── NewsletterSignup.astro
│   │   └── CodeBlock.astro       # Syntax highlighting wrapper
│   ├── styles/
│   │   └── global.css
│   └── pages/
│       ├── index.astro          # Homepage
│       ├── notes/
│       │   ├── index.astro      # Notes listing
│       │   └── [...slug].astro   # Individual note
│       ├── about.astro
│       └── projects.astro
├── public/
│   ├── fonts/                  # Self-hosted WOFF2
│   ├── images/
│   └── favicon/
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