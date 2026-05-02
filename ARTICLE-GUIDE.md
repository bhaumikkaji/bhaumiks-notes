# Article Publishing Guide — Bhaumik's Notes

**Version:** 1.0  
**Last Updated:** 2026-05-02  
**Applies To:** All new articles published on notes.bhaumikkaji.com

---

## Overview

Every article must follow a consistent structure, meet quality standards, and include all required metadata and assets before publishing. This guide ensures that.

**Goal:** One article = one markdown file + one audio file + properly formatted images + frontmatter + structured data.

---

## File Location

New articles go in:  
`src/content/notes/your-article-slug.md`

---

## Required Frontmatter

Every article MUST have this exact frontmatter block at the top:

```yaml
---
title: "Your Article Title"
pubDate: 2026-05-02              # ISO date format YYYY-MM-DD
category: ["AI"]                 # One category: AI, Design, Tech, Observations, Career, Life
slug: "your-article-slug"        # lowercase, hyphen-separated, no underscores
summary: "One-line description for cards and previews."
summaryCompact: "Short 3-5 word label for compact views."
description: "Longer SEO description, 150-160 characters max."
tldr: "2-3 sentence summary that appears in the TL;DR expandable section. This is the core takeaway."
---
```

### Frontmatter Rules

| Field | Required | Rules |
|---|---|---|
| `title` | ✅ | Sentence case, under 60 characters |
| `pubDate` | ✅ | ISO date `YYYY-MM-DD`. Future dates = scheduled |
| `category` | ✅ | One category from: AI, Design, Tech, Observations, Career, Life |
| `slug` | ✅ | Lowercase, hyphens only, matches filename base |
| `summary` | ✅ | 1 sentence, used in cards / OG description fallback |
| `summaryCompact` | ✅ | 3-5 words, used in bento grid / compact views |
| `description` | ✅ | 150-160 chars, SEO meta description |
| `tldr` | ✅ | 2-3 sentences. TL;DR section. Must exist. Never empty. |

### Category Mapping

Use these exact category strings:

| Category | Icon | Color |
|---|---|---|
| `"AI"` | sparkles | violet |
| `"Design"` | pencil-ruler | rose |
| `"Tech"` | code-2 | electric |
| `"Observations"` | eye | ember |
| `"Career"` | trending-up | emerald |
| `"Life"` | heart | warm |

---

## Article Structure

Every article MUST follow this structure:

```markdown
---
[frontmatter]
---

[Cover image — if there is one, place at top]
![Description](/images/notes/[article-slug]/01.webp)

[Opening paragraph — hook the reader]

## First Section

[Body text with images inline]

## Second Section

[More body text]

## In Conclusion / Wrap Up

[Closing thoughts]
```

### Structure Rules

1. **Cover image** goes immediately after frontmatter (if article has one)
2. **No H1 (`#`)** in body — the title is already the H1. Use H2 (`##`) and H3 (`###`)
3. **TL;DR section** is auto-generated from frontmatter `tldr` field. Do NOT write a TL;DR manually in the body
4. **Audio player** is auto-injected if `audio` field exists
5. **Conclusion section** recommended but not required
6. **Image captions** use `*Italic text*` on the line immediately after the image

---

## Images

### Location

Article images live in:  
`public/images/notes/[article-slug]/`

### Naming Convention

```
01.webp  — cover image (if any)
02.webp  — first body image
03.webp  — second body image
...
```

Use 2-digit numbers. WebP format preferred.

### Image Rules

| Rule | Required |
|---|---|
| All images are WebP or JPEG | Yes |
| Images are under 500KB each | Recommended |
| Images have alt text | Yes — `![Descriptive text](/path)` |
| Images have source credit if not original | Yes — `*Image Source: Name*` |
| Images are sequential `01.webp`, `02.webp` | Yes |
| No spaces in filenames | Yes — use hyphens |

### Image Placement in Markdown

```markdown
![IKEA store exterior](/images/notes/ikea/03.webp)

*Image Source: Wikimedia Commons*
```

The caption italic line goes on the line immediately after the image. No blank line between.

---

## Audio (TL;DR Voiceover)

Every article MUST have an audio TL;DR. This is non-optional.

### File

- Format: MP3, 128kbps
- Length: 1-3 minutes
- Location: `public/audio/[article-slug].mp3`

### Frontmatter

Add to frontmatter:
```yaml
audio: "/audio/[article-slug].mp3"
```

### Audio Content

The audio should read the `tldr` field almost verbatim, then add a brief invitation:

> "[TLDR content] ... Read the full article for more details."

### Audio Cover Art

The MP3 must have embedded cover art. Use the blog thumbnail image:
`public/images/og-default.jpg`

To embed:
```bash
python3 -c "
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC
import sys

audio = MP3(sys.argv[1])
if audio.tags is None: audio.add_tags()

with open('public/images/og-default.jpg', 'rb') as f:
    audio.tags['APIC'] = APIC(
        encoding=3, mime='image/jpeg',
        type=3, desc='Cover', data=f.read()
    )
audio.save()
" public/audio/your-article.mp3
```

---

## SEO Checklist

Before publishing, verify:

- [ ] `title` is under 60 characters
- [ ] `description` is 150-160 characters
- [ ] `slug` matches filename base
- [ ] `pubDate` is correct and not in the future (unless scheduling)
- [ ] Article has at least one image with alt text
- [ ] All images have source credits if borrowed
- [ ] `tldr` is 2-3 sentences, genuinely summarizes the article
- [ ] `category` is one of the 6 allowed values
- [ ] No H1 (`#`) in article body
- [ ] Article has a conclusion or closing section
- [ ] `summary` and `summaryCompact` are filled

### What Happens Automatically

These are generated by the site — you do NOT write them manually:

| Feature | Source |
|---|---|
| TL;DR section | `tldr` frontmatter field |
| JSON-LD schema | `title`, `description`, `pubDate`, `category`, `slug` |
| OG image | `og-default.jpg` (blog thumbnail) |
| Sitemap entry | Auto-generated by `@astrojs/sitemap` |
| Canonical URL | Auto from `slug` |
| Twitter Card | Auto from `title`, `description`, `image` |
| Author name | Auto — "Bhaumik Kalpesh Kaji" |

---

## Publishing Steps

1. **Write article** in `src/content/notes/[slug].md`
2. **Add images** to `public/images/notes/[slug]/`
3. **Record audio** TL;DR, save to `public/audio/[slug].mp3`
4. **Embed cover art** in MP3 using Python script above
5. **Run checklist** — go through every item in SEO Checklist
6. **Build site:** `npm run build`
7. **Test locally:** Check `http://localhost:4321/notes/[slug]/`
   - Does it render?
   - Is the TL;DR visible?
   - Does the audio play?
   - Are images loading?
   - Are reactions showing?
8. **Deploy:** `swa deploy ./dist --env production --deployment-token [token]`
9. **Verify live:** Visit `https://notes.bhaumikkaji.com/notes/[slug]/`
10. **Test social share:** Use LinkedIn/Twitter card validator to preview
11. **Check analytics dashboard:** Visit analytics URL, confirm page view tracked

---

## Post-Publishing Verification

After going live, verify these within 10 minutes:

- [ ] Article loads at `https://notes.bhaumikkaji.com/notes/[slug]/`
- [ ] No console errors
- [ ] Images load correctly
- [ ] Audio plays
- [ ] Reactions work (click one, refresh, count persists)
- [ ] Scroll to bottom — does analytics track scroll_75?
- [ ] Share link on social — does preview card show?
- [ ] Check analytics dashboard — page view appears

---

## For Agents / Automated Checks

When processing a new article, verify these in order:

```
CHECK frontmatter_exists
CHECK frontmatter_has_all_required_fields
CHECK category_is_valid
CHECK slug_matches_filename
CHECK no_h1_in_body
CHECK images_have_alt_text
CHECK images_sequentially_named
CHECK tldr_not_empty
CHECK audio_file_exists
CHECK audio_has_cover_art
CHECK build_succeeds
CHECK no_console_errors
CHECK page_renders_correctly
CHECK reactions_functional
CHECK analytics_tracks
```

If any check fails, block publishing and report which check failed.

---

## Example: Complete New Article

**File:** `src/content/notes/my-new-article.md`

```markdown
---
title: "My New Article"
pubDate: 2026-05-02
category: ["AI"]
slug: "my-new-article"
summary: "Exploring how AI is changing design workflows."
summaryCompact: "AI in design"
description: "A deep dive into how AI tools are reshaping product design workflows, from ideation to handoff."
tldr: "AI is not replacing designers—it's augmenting them. The real value is in the loop: generate, critique, refine. Designers who master this workflow will outproduce those who don't."
audio: "/audio/my-new-article.mp3"
---

![Cover image description](/images/notes/my-new-article/01.webp)

This is the opening paragraph that hooks the reader.

## The Problem

Body text here.

![Supporting image](/images/notes/my-new-article/02.webp)

*Image Source: Original*

## The Solution

More body text.

## In Conclusion

Closing thoughts here.
```

**Images:**
- `public/images/notes/my-new-article/01.webp` — cover
- `public/images/notes/my-new-article/02.webp` — body image

**Audio:**
- `public/audio/my-new-article.mp3` — TL;DR voiceover

---

## Questions?

If something is unclear, check existing articles in `src/content/notes/` as examples. The IKEA and Workspace articles are good references.

---

*This guide lives at: `/Users/oepnclaw-agent/Developer/Bhaumiks Notes/ARTICLE-GUIDE.md`*
