---
title: "The AI 5-Layer Cake"
pubDate: 2026-04-21
category: ["AI", "OpenClaw"]
slug: "the-ai-five-layer-cake"
summary: "NVIDIA CEO Jensen Huang’s framework — what happens when you bake the whole AI stack yourself instead of renting a slice."
summaryCompact: "NVIDIA CEO Jensen Huang’s framework — what happens when you bake the whole AI stack yourself instead of renting a slice."
description: "NVIDIA CEO Jensen Huang’s framework — what happens when you bake the whole AI stack yourself instead of renting a slice."
---

Not sponsored. I run OpenClaw on a Mac Mini M4 with 6 agents, 24/7. These are real numbers from April 2026.

### LinkedIn Post

> NVIDIA CEO Jensen Huang’s 5-layer AI cake (Energy → Chips → Infrastructure → Models → Applications) is one of the most useful mental models I’ve found for understanding where AI actually lives.

It helped me see the whole stack clearly. And it got me thinking: what happens when you don’t rent a slice, but bake the whole thing yourself?

I wrote about what that looks like in practice.

## The Premise

![](/images/notes/ai-five-layer-cake/img1.jpeg)

Jensen Huang says AI is a 5-layer cake. Energy, Chips, Infrastructure, Models, Applications. He was talking about nations building trillion-dollar data centers. But the same stack applies to one person running AI from their desk. And here is what nobody is saying: when one company owns the whole cake, you are just renting a slice. You pay a markup on every layer, and you cannot leave because they own the recipe.

This is not a theoretical argument. For the past few months I have been running a personal AI system with six agents. Ted handles orchestration. Judy does coding. Nova does research. Estelle does career. Atlas does learning. Leo does design. They handle heartbeats every 55 minutes, daily crons, research tasks, coding reviews, and ongoing conversations. The whole thing runs on a Mac Mini M4 in my living room.

The question I keep coming back to: what does Jensen's cake cost when you bake it yourself?

## The Walk

Start at the bottom and walk up.

![](/images/notes/ai-five-layer-cake/img2.jpeg)

Layer 1: Energy. Jensen calls this the binding constraint. In a closed platform you never see the cost. It is baked into your subscription. But data centers draw megawatts, and you are paying for them whether you see the line item or not. My Mac Mini M4 idles at 4W and peaks at 65W. Running OpenClaw 24/7 averages about 15W. At Ontario electricity rates, that is $1.40 per month. I can measure it. I can optimize it. When was the last time you saw your share of ChatGPT's power bill?

Layer 2: Chips. Closed platforms run on NVIDIA H100s in someone else's data center. You pay the amortized cost, the cooling overhead, and the margin. All hidden in per-token pricing. My M4 has a 10-core CPU and 10-core GPU with 16GB unified memory. No NVIDIA tax. It runs smaller models locally through Ollama and routes to cloud APIs only when I need scale. For personal AI, you do not need a $25,000 GPU. You need the right chip for your workload.

Layer 3: Infrastructure. This is where the abstraction starts to hurt. Rate limits. Service outages. ToS changes that kill your workflow overnight. When Claude had its December 2025 outage, I fell back to Kimi. When Kimi hiccups, I fall back to Azure. My uptime is not dependent on one company's SLA. It is my hardware, my network, my rules. And my data stays on my machine. Not in someone else's training pipeline.

Layer 4: Models. This is where the real money lives. And where most people overpay. Closed platforms give you one model family. You pay flagship prices even for tasks a budget model handles perfectly. I do not. I tier by task:

- Routine work to GLM-5.1:cloud via Ollama at $0

- Primary reasoning to Kimi K2.6:cloud via Ollama at $0

- Complex tasks to Claude Sonnet 4.6 at $3/$15 per MTok

- Multimodal to Azure GPT-5.4 at $2.50/$15 per MTok

About 60% of my workload runs locally on the Mac Mini at $0 per token. No API calls. No rate limits. Just electricity. The other 40% goes to cloud APIs when I need scale or capability my hardware cannot handle.

But there is another cost here that nobody talks about: access. Claude either blocks OpenClaw or severely restricts it on lower tiers. To get reliable API access for an autonomous setup, you are pushed to expensive API billing at $3 to $5 per MTok input. ChatGPT does the same. Their API is $2.50 to $15 per MTok, and their consumer tiers do not support autonomous agent operation at all. Ollama is built for this. Their $20 per month subscription gives me cloud-hosted open-weight models with generous limits and zero per-token cost. That is my primary workhorse.

So the real question is not just API pricing. It is: can you even build this setup? On Claude or ChatGPT alone, the answer is either no or only if you pay 3 to 5 times more. On Ollama plus OpenClaw, the answer is yes, for $20 per month plus electricity.

Layer 5: Applications. This is the lock-in layer. ChatGPT and Claude Code are becoming AI operating systems. Projects, custom GPTs, Claude Artifacts. All designed to keep you inside their garden. Your prompts, your workflows, your data. Non-portable by design. OpenClaw is the opposite. My prompts live in Markdown files. My memory lives in an Obsidian vault. My agent configs are JSON I can edit. I can swap any model underneath without rebuilding my system. I own the application layer. I rent only the model layer.

Never let the model provider own your application.

## The Math

Here is what 6 agents running 24/7 actually costs: 

![](/images/notes/ai-five-layer-cake/img3.jpeg)

The 77% savings against Claude Sonnet is nice. But the real value is not the money. It is the capability. ChatGPT Pro cannot run 6 agents on a schedule. Claude cannot mix GLM and Kimi in the same conversation. Only a composable stack gives you that.

## The Point

Why do platforms want to own the whole stack? Because each layer is a moat. Layer 5 owns the relationship. Switching means rebuilding your workflow. Layer 4 sets the price. No competition if you cannot swap. Layers 1 through 3 are abstracted away so you forget you are paying for them.

The $100 ChatGPT Pro plan illustrates this perfectly. Unlimited GPT-5.3, but limited GPT-5.4. Agent mode, but only in their sandbox. Memory, but only in their format. Every feature deepens the lock-in. This is not evil. It is business. But you should know what you are buying.

Jensen's cake is right. AI is infrastructure. But infrastructure should be composable, not monopolized. You should be able to bake your own slice.

That means owning your application layer. Choosing your models per task. Running local inference when it makes sense. Falling back to cloud APIs when you need scale. And never letting one company own enough layers that you cannot leave.

![](/images/notes/ai-five-layer-cake/img4.jpeg)

The future of personal AI is not a single app. It is a stack you control.