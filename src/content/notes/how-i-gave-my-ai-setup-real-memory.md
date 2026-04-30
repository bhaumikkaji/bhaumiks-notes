---
title: "How I Gave My AI Setup a Real Memory"
pubDate: 2026-04-07
category: ["AI", "OpenClaw"]
slug: "how-i-gave-my-ai-setup-real-memory"
summary: "A technical walkthrough of two layers that turn a stateless AI assistant into a compounding knowledge system."
summaryCompact: "Turning a stateless AI into a compounding knowledge system."
description: "How I gave my AI setup a real memory — Lossless Claw for session memory and Obsidian Knowledge Wiki for persistent knowledge."
tldr: "Running six specialized agents 24/7 revealed two hard limits of LLMs: conversations degrade once they hit context limits, and every session starts from zero with no memory of yesterday's insights. I fixed both with Lossless Claw, which compresses older conversation turns into structured summaries so context never silently drops, and an Obsidian Knowledge Wiki where agents incrementally compile persistent knowledge following a shared schema. The result is agents that remember your preferences from last week and can connect insights across months instead of re-deriving everything from scratch."
---

Most AI setups are stateless by default. Every session starts fresh. Every insight evaporates. You're perpetually re-explaining context, re-deriving conclusions, and re-discovering things you already figured out last week.

I've been running a personal multi-agent AI infrastructure on a Mac Mini — 6 specialized agents, each with a distinct role, all accessible via Telegram:

- **Ted** — generalist and orchestrator. Research, synthesis, day-to-day assistant work.
- **Nova** — cultural radar. Weekly drops on music, film, games, and internet culture.
- **Estelle** — headhunter. Daily job scans, scored and filtered ruthlessly.
- **Leo** — design and content specialist. UX critique, content review, design systems.
- **Mr. Atlas** — market and financial advisor. Macro trends, economic context.
- **Judy** — dev agent. Technical research, code, engineering concepts.

After months of daily use, two failure modes kept surfacing:

1. **Long sessions degraded.** Once a conversation hit the context limit, the model started dropping earlier parts of the thread. Critical context — decisions made, preferences established — would silently disappear.
2. **Good thinking evaporated.** An agent would produce genuinely useful synthesis — a framework, a comparison, a sharp recommendation — and it would vanish the moment the session ended. The next session started from zero.

I fixed both. Here's how.

![Agent architecture overview](/images/notes/ai-memory/article-1.jpeg)

## Layer 1: Lossless Claw — Giving Sessions a Working Memory

### The Problem in Depth

LLMs have a finite context window — a maximum amount of text they can "hold in mind" at once. Sounds like a lot until you're deep in a complex research session with tool calls, long responses, and iterative back-and-forth. Hit the limit and the model starts operating on a truncated version of the conversation — it literally can't see what was said earlier.

The naive fix is to start a new session. But then you lose continuity entirely.

### What Lossless Claw Does

Lossless Claw (LCM) is an OpenClaw plugin that sits between the conversation and the model. As the session grows, it monitors token usage. When older turns start threatening the limit, it compresses them into structured summaries — preserving the substance without the verbatim text — and keeps those summaries in context.

The model effectively sees: recent conversation in full + compressed summaries of older turns. The thread stays intact. Nothing is silently dropped.

### A Concrete Example

Imagine a 2-hour session where I'm working with Ted on setting up a new workflow. Early on we establish: "use isolated session targets for all cron jobs." Two hours later, when I ask about a new cron job, Ted doesn't need me to re-explain that preference — it's compressed into the context summary and still visible.

Without LCM: Ted might give advice that contradicts what we agreed on an hour ago.

With LCM: Ted has the full thread, compressed but intact.

The mental model: **LCM is RAM.** It keeps the active work usable without overflowing.

![Lossless Claw session memory diagram](/images/notes/ai-memory/article-2.jpeg)

## Layer 2: The Obsidian Knowledge Wiki — Giving the System a Hard Drive

### The Problem in Depth

Even with perfect session memory, each session is still an island. The synthesis from Tuesday's research doesn't carry into Thursday's session. The career intelligence Estelle built up doesn't inform what Ted knows. Good answers disappear into chat history — or worse, into my own fading memory.

This is the RAG trap. Most AI-document systems work by embedding your files, retrieving relevant chunks at query time, and generating an answer. The LLM re-derives the synthesis every single time. There's no accumulation. Ask a subtle question that requires connecting five different things you've learned over three months — and the AI has to find and reconnect all of it from scratch.

### The Karpathy Insight

Andrej Karpathy published an idea file describing a different approach: instead of retrieval-at-query-time, have the LLM incrementally build and maintain a persistent wiki. When a new source arrives, the LLM doesn't just index it — it reads it, extracts key ideas, integrates them into the existing wiki, updates entity pages, flags contradictions, and strengthens cross-references.

Knowledge is compiled once, not re-derived on every query.

### What I Built

A structured Obsidian vault — the Knowledge wiki — that all 6 agents write to following a shared schema:

```
Knowledge/
├── AGENTS.md       ← shared schema all agents follow
├── index.md        ← master catalog, updated every ingest
├── log.md          ← append-only activity log
├── raw/            ← full fetched source content (receipts)
├── sources/        ← structured summaries of ingested material
├── concepts/       ← evergreen idea and topic pages
├── entities/       ← people, companies, products, places
├── Nova/           ← cultural picks (music, film, games, visual)
├── Career/         ← job market intelligence
├── Design/         ← design concepts and references
└── Synthesis/      ← answers, comparisons, analyses worth keeping
```

### A Concrete Example — Agents Writing to Their Domains

- **Nova** recommends a film → creates `Nova/Films/Film Title.md` with mood, context, why it's worth it
- **Estelle** scans job listings → files `Career/Roles/Company - Title.md` with tier, fit, risks, action
- **Ted** answers a complex question worth keeping → it lands in `Synthesis/` permanently

Over time the graph gets genuinely interesting. Ideas connect across domains. A film Nova recommended linking to a design concept Leo filed, linking to something Atlas found in a market report.

The mental model: **The Obsidian wiki is the hard drive.** Agents write to it. I read it. It compounds.

![Obsidian Knowledge Wiki structure](/images/notes/ai-memory/article-3.jpeg)

## How They Work Together

```
Active session
    ↓  LCM compresses old turns → context stays usable
    ↓  Agent extracts insights → writes to Obsidian wiki
Permanent knowledge base
```

![System comparison table](/images/notes/ai-memory/article-4.jpeg)

| | Lossless Claw | Obsidian Wiki |
| --- | --- | --- |
| Stores | Compressed chat history | Structured knowledge |
| Who reads it | The model only | You + the model |
| Format | Database | Markdown |
| Scope | One session | All time |
| Compounding | No | Yes |

## What This Changes

The result isn't just a better AI assistant. It's a different kind of system — one that genuinely gets smarter the more you use it. Agents build on each other's work. Insights from months ago are still accessible. Good thinking compounds instead of evaporating.

It's still early. But the direction is clear: the most useful AI setup isn't the one with the best model. It's the one with the best memory architecture.