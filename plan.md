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

- **Judy is the interface** between Bhaumik and the project
- Bhaumik tells Judy what to write → Judy updates code in local folder
- Local preview link for Bhaumik to review before anything goes live
- Builds get pushed to deployment when ready
- **Wiki is for knowledge only** — decisions, plans, important stuff. No code dumps.
- Content lives in the repo as Markdown/MDX files
- No external CMS — file-based, git-managed

---

## Tech Stack

### Decision: Astro ✅

**Chosen:** Astro

Why:
- Purpose-built for content-heavy static sites
- MDX native — write notes in Markdown/MDX, render beautifully
- Zero JS by default — pages ship as static HTML, hydrate only where needed
- Fast on every device and browser
- Easy deployment to Azure Static Web Apps or GitHub Pages
- Can add React components later if needed
- Modern, well-maintained, great DX
- Matches the minimal aesthetic we want
- Built-in content collections, RSS, sitemap, image optimization

This is the right choice for a content-first site. The portfolio uses React, but a blog doesn't need React on every page.

---

## Visual Identity

- **For now:** standalone — the blog lives separately from the portfolio
- **Eventually:** sibling to portfolio — shared visual language, consistent typography and design tokens
- Typography, color, and spacing choices should be portable enough to share with the portfolio later

---

## Reference Site Analysis — hvpandya.com

**Reference site:** https://hvpandya.com/notes/ — Hardik Pandya's personal site

### Overall site structure

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
- **Notes are grouped in small clusters of 3–5**, creating subtle visual rhythm.
- **"Start reading here" section** — 3 curated notes to onboard new readers.
- **Clean, no-sidebar layout.** Two-column on desktop: heading left, list right.

### Individual note page structure

```
/[slug]
├── Title (h1)
├── Subtitle/opening line
├── Body content (markdown-rendered)
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
- **No dates displayed on notes**
- **No author byline** — obvious whose site it is
- **No "back to notes" breadcrumb** — just the nav header
- **Reactions are custom**, not likes/comments

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
- Sitemap (`/sitemap.xml`)

### CSS & performance

- Single CSS file — versioned for cache busting
- No CSS framework — custom CSS
- Minimal JS
- Image CDN with preconnect + dns-prefetch
- Accessibility: skip-to-main-content link, ARIA roles, semantic HTML

### Category system (Hardik's)

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
16. **Reaction buttons** — custom, emoji-free

### What we're doing differently

- Bhaumik's categories: Tech, Design, AI, Career, Observations, Life
- Bhaumik's voice is his own — not emulating Hardik's writing style
- Private analytics dashboard built into the same project
- Local preview link for reviewing before deploy

### General design principles

- **Typography-first** — this is a reading experience
- **Dark mode** supported
- **Minimal distractions** — content is the product
- **Should feel like Bhaumik** — not a template
- **Standalone for now, portable to sibling with portfolio later**

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
   - `og:title`, `og:description`, `og:image`, `og:type`, `og:site_name`, `og:url`
   - `twitter:card` → `summary_large_image`
   - Default image: high-quality portrait (Bhaumik to provide)
   - Per-note override available
10. **Newsletter signup** — Substack integration (like reference site)
11. **Contact/social links** — Twitter/email, minimal footer
12. **Reactions** — inspired by hvpandya.com
    - Types: thoughtful / relatable / good / loved it / blew my mind
    - Custom, emoji-free, tasteful
    - Needs backend/storage (TBD)

---

## Rich Text Rendering — Pretext

**Library:** [@chenglou/pretext](https://github.com/chenglou/pretext) — MIT licensed, 44k+ stars

### What it does
Pretext is a pure JS/TS library for multiline text measurement and layout. It:
- Measures text height without DOM layout reflow
- Handles line breaking, word wrapping, and multi-language text
- Renders to DOM, Canvas, SVG
- Supports rich inline flow (code spans, mentions, chips)
- Enables custom text layouts: masonry, dynamic width, text-around-image, shrinkwrap
- Works with `Intl.Segmenter` for grapheme-aware breaking

### Why we're using it
Bhaumik wants high-quality text rendering and support for rich content blocks. Pretext gives us:

1. **HQ text rendering** — precise line measurement, no DOM reflow, clean typography
2. **Dynamic text layouts** — text around images, balanced multiline, shrinkwrap widths
3. **Rich inline flow** — code spans, inline chips/mentions, mixed fonts in one line
4. **Canvas/SVG rendering** — opens the door to custom visualizations, decorative text elements
5. **Future-rich content** — embedded visualizations, interactive text, kinetic typography

### Where it fits in the blog
- **Note pages:** precise paragraph measurement, better line breaks, balanced text
- **Code blocks:** rich inline rendering for inline code spans mixed with regular text
- **Category pills:** shrink-wrap width calculation
- **Dynamic layouts:** text flowing around images, custom hero layouts
- **Future:** interactive demos, canvas-based visualizations, decorative text treatments

### Integration approach
- Install as a dependency: `npm install @chenglou/pretext`
- Use for note page layout: measure paragraphs for virtualization and precise height
- Use for rich inline content: mixed formatting in note body text
- Use for dynamic layout elements: text-around-image, balanced headings
- Don't over-engineer in v1 — start with measurement and rich inline, add canvas/SVG rendering in later phases

### Important caveat
Pretext is powerful but adds complexity. For v1:
- Use it for text measurement and rich inline flow
- Don't build custom canvas renderers yet
- Add visual richness incrementally, not all at once

---

## Nice-to-Have (Post-MVP)

- Search (full-text)
- Code syntax highlighting with copy button
- Reading time estimates
- Series/linked posts
- "Start reading here" curated section (like hvpandya.com)
- Obsidian-to-blog pipeline (if Bhaumik wants to author there)
- Projects showcase section (like Hardik's Solari, Stop Slop, etc.)
- Canvas/SVG text rendering with Pretext
- Interactive visualizations and decorative text treatments
- Kinetic typography or animated text effects

---

## Hosting & Deployment

- **Decide later** when ready to launch
- **Azure Static Web Apps** (Bhaumik has Azure credits) — primary option
- **GitHub Pages** — backup option
- Deployment pipeline: local → preview link → push to production

## Custom Domain

- **Decide later** when ready to launch
- Examples: `notes.bhaumikkaji.com`, `bhaumiksnotes.com`

---

## Analytics Dashboard

- **Private analytics dashboard** built into the same project
- Password-protected, link not listed publicly
- Bhaumik accesses it via a secret URL
- **Metrics to design for:**
  - Page views (total, per note, over time)
  - Unique visitors
  - Referral sources
  - Geography
  - Time on page / reading depth
  - Popular notes
  - Reaction counts per note
  - Newsletter signups
  - Social shares / click-throughs
- **Tech options:** Plausible (privacy-respecting), Umami (self-hosted), or custom lightweight analytics
- Dashboard design: TBD in a later phase, but architecture must support it

---

## Comments & Reactions

- **No comments** for now
- **Yes to reactions** — inspired by hvpandya.com
  - Types: thoughtful / relatable / good / loved it / blew my mind
  - Custom, emoji-free, tasteful
  - Need backend/storage solution (likely simple API endpoint or third-party service)

---

## Categories

Start simple, based on Bhaumik's interests:

- **Tech** — tools, experiments, technical observations
- **Design** — design thinking, craft, opinions
- **AI** — AI experiments, product implications, hands-on work
- **Career** — career reflections, advice, observations
- **Observations** — things noticed, patterns, hot takes
- **Life** — personal reflections, non-tech

More categories can be added later as content evolves.

---

## Page Structure

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
├── Reactions (thoughtful / relatable / good / loved it / blew my mind)
├── "Read more" — 3–4 related notes
└── Back to notes index
```

### Analytics Dashboard (Post-MVP)
```
/dashboard (password-protected, unlisted)
├── Overview: page views, visitors, referrals
├── Notes: popular notes, reading depth, reaction counts
├── Growth: subscribers, shares, trends
└── Geography & sources
```

### Other Pages (Post-MVP)
```
/about          → About Bhaumik
/projects       → Showcase of side projects
/stuff          → Tools & setup
```

### Navigation
```
Header: Bhaumik Kaji | Notes [About] [Projects] [Stuff]
Footer: minimal — RSS, Twitter, email, © year
```

---

## Project Structure (Astro)

```
bhaumiks-notes/
├── src/
│   ├── content/
│   │   └── notes/           # MDX notes live here
│   │       ├── ai/
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
│   │   ├── Reactions.astro      # Reaction buttons
│   │   ├── NewsletterSignup.astro
│   │   └── CodeBlock.astro       # Syntax highlighting wrapper
│   ├── styles/
│   │   └── global.css
│   └── pages/
│       ├── index.astro          # Homepage
│       ├── notes/
│       │   ├── index.astro      # Notes listing
│       │   └── [...slug].astro   # Individual note
│       ├── dashboard.astro      # Analytics dashboard (password-protected)
│       ├── about.astro
│       └── projects.astro
├── public/
│   ├── fonts/                  # Self-hosted WOFF2
│   ├── images/
│   │   └── og-default.jpg      # Default OG image (portrait)
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
| Tech stack | Astro | 2026-04-18 | Modern, content-first, fast, MDX-native, good DX |
| Visual identity | Standalone for now, sibling to portfolio eventually | 2026-04-18 | Design should be portable for future alignment |
| Hosting | Azure or GitHub Pages, decide later | 2026-04-18 | Bhaumik has Azure credits |
| Domain | Decide later | 2026-04-18 | Pick when ready to launch |
| Authoring | Judy is the interface | 2026-04-18 | Bhaumik tells Judy, Judy updates local, preview locally, push to deploy |
| Categories | Tech, Design, AI, Career, Observations, Life | 2026-04-18 | Start simple, expand later |
| Comments | No comments | 2026-04-18 | |
| Reactions | Yes, inspired by hvpandya.com | 2026-04-18 | Thoughtful / relatable / good / loved it / blew my mind |
| Analytics | Private dashboard in same project | 2026-04-18 | Password-protected, not listed publicly |
| Rich text rendering | Pretext (for HQ text + future rich content) | 2026-04-18 | Start with measurement/rich-inline, add canvas/SVG later |

---

## Open Questions

- [ ] First 3 posts Bhaumik wants to write (drives design priorities)
- [ ] Analytics dashboard design and tech choice
- [ ] Reaction storage solution (backend needed)
- [ ] Default OG image (portrait or branded — Bhaumik to provide)
- [ ] Font choice (serif editorial like Tiempos, or different?)
- [ ] Newsletter platform choice (Substack or other)

---

## Principles

1. **Content is the product.** Design serves reading.
2. **Simple over clever.** This is a blog, not a platform.
3. **File-based, git-managed.** No CMS dependency.
4. **Bhaumik's voice, not a template's.**
5. **Ship early, iterate.** MVP first, polish second.
6. **Judy is the interface.** Bhaumik directs, Judy implements, Bhaumik approves.
7. **Wiki is for knowledge, not code.** Decisions and plans go there, code stays in the repo.