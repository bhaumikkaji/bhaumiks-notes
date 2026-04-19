# Bhaumik's Notes — Brand & Style Guide

## Philosophy

Typography-first. Content-dominant. Nothing decorative that doesn't earn its place.
Inspired by hvpandya.com's minimalism — flat lists, category pills, no sidebar, no noise.

---

## Typography

### Font Stack

| Role | Font | Fallback |
|------|------|----------|
| Body | Inter | -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif |
| Code | JetBrains Mono | Fira Code, ui-monospace, monospace |

**Delivery:** Google Fonts (`fonts.googleapis.com`) with `preconnect` and `display=swap`.

### Root Size

- **Base font size:** `11px` (set on `<html>`)
- All component sizes use `rem` units relative to this root
- This produces a compact, dense reading experience optimized for content-heavy layouts

### Scale (in rem → px at 11px root)

| Token | rem | px | Usage |
|-------|-----|-----|-------|
| Display | 2.25rem | ~25px | Note title (h1) |
| Heading | 1.75rem | ~19px | Page heading |
| Subheading | 1.35rem | ~15px | Section heading (h2) |
| Body Large | 1rem | 11px | Body text, descriptions |
| Body | 0.95rem | ~10.5px | Note titles, secondary text |
| Small | 0.85rem | ~9.5px | View all links, footer |
| Label | 0.75rem | ~8px | Section labels (uppercase) |
| Pill | 10px | 10px | Category pills (px, not rem) |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Note titles, nav links |
| Semibold | 600 | Section labels, h2 |
| Bold | 700 | h1, hero heading |

### Letter Spacing

| Context | Value |
|---------|-------|
| Headings (h1, h2) | -0.02em to -0.03em |
| Body | 0 (default) |
| Section labels (uppercase) | 0.08em |
| Category pills (uppercase) | 0.04em |
| Nav | -0.01em |

### Line Height

| Context | Value |
|---------|-------|
| Headings | 1.15–1.3 |
| Body text | 1.65–1.75 |
| Note list items | 1.5 |

---

## Color System

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#fafafa` | Page background |
| `--text-primary` | `#111111` | Headings, primary text |
| `--text-secondary` | `#555555` | Descriptions, secondary text |
| `--text-tertiary` | `#888888` | Labels, muted text |
| `--border` | `#e8e8e8` | Dividers, borders |
| `--accent` | `#c2410c` | Links, interactive elements |
| `--accent-hover` | `#a83608` | Link hover state |

### Dark Mode (`prefers-color-scheme: dark`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#111111` | Page background |
| `--text-primary` | `#f0f0f0` | Headings, primary text |
| `--text-secondary` | `#a0a0a0` | Descriptions, secondary text |
| `--text-tertiary` | `#666666` | Labels, muted text |
| `--border` | `#2a2a2a` | Dividers, borders |
| `--accent` | `#fb923c` | Links, interactive elements |
| `--accent-hover` | `#f97316` | Link hover state |

### Category Colors

| Category | Light | Dark | Pill Background |
|----------|-------|------|-----------------|
| Tech | `#2563eb` | `#60a5fa` | 12% opacity blend |
| Design | `#7c3aed` | `#a78bfa` | 12% opacity blend |
| AI | `#d97706` | `#fbbf24` | 12% opacity blend |
| Career | `#059669` | `#34d399` | 12% opacity blend |
| Observations | `#6b7280` | `#9ca3af` | 12% opacity blend |
| Life | `#db2777` | `#f472b6` | 12% opacity blend |

Pill backgrounds use `color-mix(in srgb, var(--tag-*) 12%, transparent)` for translucent tinting.

---

## Layout

### Container

- **Max width:** `640px` (CSS var `--max-width`)
- **Padding:** `0 20px` horizontal
- **Centered** with `margin: 0 auto`

### Grid Philosophy

No grid. Single column. Content-dominant. Let the typography breathe.

### Key Spacing

| Context | Value |
|---------|-------|
| Header top padding | 48px |
| Content top padding | 24px |
| Section gap (homepage) | 56px |
| Section gap (note page) | 48px |
| Divider margin | 40px vertical |
| Read more separator | 72px top margin, 40px padding-top |
| Footer top | 24px |

---

## Components

### Scroll Progress Bar

- **Position:** Fixed top, full width
- **Height:** `2px`
- **Background:** `linear-gradient(90deg, var(--accent), var(--accent-hover))`
- **Border radius:** `0 1px 1px 0` (right side rounded)
- **z-index:** 9999
- **Behavior:** Width = scroll percentage, updates on scroll + resize

### Category Pill

- **Font size:** `10px` (fixed, not rem)
- **Font weight:** 600
- **Letter spacing:** 0.04em
- **Text transform:** uppercase
- **Padding:** 2px 8px
- **Border radius:** 10px
- **Colors:** Dynamic per category (text + translucent background)

### Note Title (list view)

- **Font size:** 0.95rem
- **Font weight:** 500
- **Color:** `var(--text-primary)`
- **Hover:** `var(--accent)`
- **No underline by default**, color change on hover

### Section Label

- **Font size:** 0.75rem
- **Font weight:** 600
- **Text transform:** uppercase
- **Letter spacing:** 0.08em
- **Color:** `var(--text-tertiary)`
- **Margin bottom:** 12–20px

### Blockquote (in notes)

- **Left border:** 3px solid `var(--accent)`
- **Padding:** 12px 0 12px 20px
- **Color:** `var(--text-secondary)`
- **Font style:** normal (not italic)
- **Font size:** 1.05rem

### Code

**Inline:**
- Font: `var(--font-mono)`
- Font size: 0.85em (relative to parent)
- Background: 6% opacity blend of primary text
- Padding: 2px 6px
- Border radius: 4px

**Block:**
- Background: 4% opacity blend of primary text
- Border: 1px solid `var(--border)`
- Padding: 20px
- Border radius: 10px
- Font size: 0.85rem

### Links (in note body)

- Color: `var(--accent)`
- Underline: yes, with `text-underline-offset: 2px` and `text-decoration-thickness: 1px`
- Underline color: 40% opacity blend of accent (visible but subtle)
- Hover: underline becomes full accent color

---

## Dark Mode

- **Trigger:** `prefers-color-scheme: dark` media query
- **No manual toggle** (respects OS setting)
- **All colors** swap via CSS custom properties
- **Theme-color meta:** `#111111` dark / `#fafafa` light
- **Color-scheme meta:** `light dark`

---

## Responsive

| Breakpoint | Change |
|------------|--------|
| `≤640px` | Hero h1: 2.25rem → 1.75rem, hero h1 note page: 1.75rem → 1.5rem, masthead stacks vertically, base font stays 11px |

No other responsive breakpoints. Single column works at all sizes.

---

## Images & Media

- **Max width:** 100% of container
- **Border radius:** 10px
- **Border:** 1px solid `var(--border)`
- **Margin:** 1.5em top and bottom

### YouTube Embeds

- **Border radius:** 10px
- **Margin:** 1.5em top and bottom
- **Responsive:** `width="100%"` with fixed height

---

## Open Graph / Social Preview

- **Card type:** `summary_large_image`
- **Default OG image:** `/images/og-default.svg`
- **Twitter site:** `@bhaumikkaji`
- **Site name:** "Bhaumik's Notes"
- **Note pages use:** `type="article"` with per-note title, description, and image

---

## Interaction Patterns

### Hover States

| Element | Default | Hover |
|---------|---------|-------|
| Note title | `var(--text-primary)` | `var(--accent)` |
| Nav link | `var(--text-tertiary)` | `var(--text-primary)` |
| Accent link | `var(--accent)` | `var(--accent-hover)` |
| Masthead title | `var(--text-primary)` | `var(--text-secondary)` |

### Transitions

- All color transitions: `0.15s ease`
- Scroll progress: `0.05s linear`

---

## Accessibility

- Skip-to-content link (`#main-content`), hidden until focused
- Semantic HTML: `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`
- ARIA labels on navigation and main content
- `color-scheme: light dark` meta tag
- Sufficient contrast ratios in both modes
- All interactive elements are keyboard-navigable

---

## What This Is Not

- Not a portfolio site
- Not a CMS-driven blog
- Not a social platform
- Not a place for comments (reactions only, post-MVP)
- Not a place for long-form essays (notes, 2–10 min reads)