---
title: "Saving with Model Tiering and Token Optimization"
pubDate: 2026-04-17
category: ["AI", "OpenClaw"]
slug: "saving-with-model-tiering"
summary: "How we cut our AI bill without making agents less capable — model tiering, token optimization, and call frequency."
summaryCompact: "How we cut our AI bill without making agents less capable — model tiering, token optimization, and call frequency."
description: "How we cut our AI bill without making agents less capable — model tiering, token optimization, and call frequency."
tldr: "Running six agents with heartbeats every 30 minutes and daily cron jobs hit Anthropic's usage cap twice in one month — the default of 'always use the smartest model' doesn't scale. The fix is three levers: model tiering, where GLM 5.1 handles routine summarization at 3-5x cheaper rates while Sonnet and GPT-5.4 serve as fallbacks for complex reasoning; token optimization, trimming context so you're not paying for 10,000 tokens of workspace files on every single message; and call frequency, questioning whether every agent really needs to check in every 30 minutes. The result was a significantly lower bill with zero loss in actual capability."
---

Most people pick the smartest model and call it a day. When you’re running one chatbot, that works fine.

When you’re running agents that make hundreds of calls a day, it’s a different story. Every call sends your full context through the model. Every call gets billed. The costs compound fast.

The fix isn’t one thing. It’s model tiering (cheaper model for routine work, premium only when it matters), token optimization (trimming what you send), and call frequency (do you really need to check in every 30 minutes?).

We cut our bill significantly without making the agents less capable. Full breakdown in the article.

## Most people overpay for AI without realizing it

When you use ChatGPT, you get GPT. When you use Claude, you get Claude. That is fine for a chatbot. But when you start building agents that run 24/7, making dozens of calls a day, each one carrying the full weight of your instructions, memory, and context, you start paying for capability you do not always need.

I learned this the hard way. Six agents, each checking in every 30 minutes, plus cron jobs for Reddit monitoring, daily reflections, and job scanning. The bills climbed fast. I hit Anthropic's usage cap twice in one month. That is when I started paying attention to which model was doing what.

The good news: you do not have to use the most expensive model for everything. Cloud APIs like OpenAI and Anthropic charge per token but require zero setup. Local models like oMLX run on your own machine with no per-call cost, but need real hardware. The real win is mixing both, and that is exactly what OpenClaw lets you do. You pick the model for the task, not the other way around.

![](/images/notes/token-optimization/img1.jpeg)

## What is model tiering?

Model tiering means you do not use the same model for everything. Instead, you match the model to the task.

Think of it like a company. You do not hire a senior architect to reorder office supplies, and you do not send an intern to present the quarterly strategy. Same principle. The smartest model costs the most, so you reserve it for work where judgment and reasoning quality actually matter. For everything else, you use something cheaper and fast enough.

In an agent setup, the cost benefit is multiplied. You are not paying for one person's usage. You are paying for six agents (in my case) each making dozens of calls per day. A model that costs 3x more per token, used across six agents running heartbeats, crons, and conversations, compounds into real money fast. Model tiering is how you keep that under control without making the whole system dumber.

The other benefit is agent variety. When models are expensive, you think twice before spinning up a new agent. When the default model is cheap, you can afford to experiment. My setup has six agents now, each with a distinct role, because the base cost of running them is low enough to justify it.

![](/images/notes/token-optimization/img2.jpeg)

## Our journey: testing models and landing on GLM 5.1

When I first set up OpenClaw, I defaulted to Claude Sonnet 4.6 as the primary model. It is excellent at reasoning, follows instructions precisely, and is the default most OpenClaw users start with. For a while it worked fine.

But then I added more agents. Six of them, each running heartbeats every 30 minutes, plus daily cron jobs for Reddit monitoring, daily reflections, job scanning, and more. The API bills started climbing. I hit Anthropic's usage limit twice in one month. That was the signal that something needed to change.

I started testing alternatives. GPT-5.4 on Azure was a solid fallback for complex reasoning. But the real discovery was Ollama, a tool that lets you run models through a unified interface, and specifically GLM 5.1, a model from Zhipu AI available through Ollama's cloud service.

GLM 5.1 is not as strong as Sonnet or GPT-5.4 at hard reasoning tasks. But for the majority of what my agents actually do (summarizing Reddit posts, running daily reflections, monitoring email, formatting calendar events) it is more than good enough. And it costs a fraction of the price.

The journey was not about finding the best model. It was about finding the right model for the job, at the right price. And accepting that "good enough" for 80% of tasks is actually the goal.

## Why GLM 5.1 and not Sonnet 4.6 or GPT 5.4?

Simple answer: cost.

Sonnet 4.6 costs $3 per million input tokens and $15 per million output tokens. GPT-5.4 is $2.50 per million input and $15 per million output. GLM 5.1 through Ollama costs $0.95 per million input and $3.15 per million output. That is roughly 3x cheaper on input and 5x cheaper on output compared to Sonnet. When your setup runs hundreds of API calls per day across six agents, the price difference compounds quickly.

The tradeoff is real. GLM 5.1 occasionally struggles with complex multi-step reasoning or very precise instruction following. For those cases, I have Sonnet and GPT-5.4 configured as fallbacks. When GLM cannot handle something, OpenClaw automatically routes to the next model in the chain.

The key insight: most agent work is not hard reasoning. It is summarization, pattern matching, formatting, and alerting. GLM 5.1 handles all of that well. Reserving premium models for the tasks that genuinely need them is what makes the whole setup sustainable.

## What is a token?

If you are going to manage LLM costs, you need to understand tokens.

A token is a chunk of text that an LLM uses as its basic unit of processing. It is not exactly a word. Common words like "the" or "and" are usually one token. Longer or unusual words get split. "Hamburger" might be three tokens: ham + bur + ger.

When you send a prompt to an LLM, the model breaks your entire input (your question, the system instructions, any attached files or memory) into tokens. It processes those tokens, generates a response, and that response is also measured in tokens.

The business model is simple: providers charge you per token. Input tokens are what you send. Output tokens are what the model generates back. Output tokens typically cost 3-5x more than input tokens because generating text is more computationally expensive than reading it.

Here is the part that surprises people: every call sends the full context every time. Your system prompt, workspace files, conversation history, memory notes. All of it gets tokenized and sent on every single message. If your workspace files are 10,000 tokens, you pay for those 10,000 tokens on every back-and-forth in a conversation. That is why context size matters so much for cost.

![](/images/notes/token-optimization/img3.jpeg)

## When you realize how costly it gets

Once your agents are good, you want to use them more. That is the trap.

You add a cron job to check Reddit daily. Another to scan for jobs. A heartbeat every 30 minutes to check email and calendar. Each of these triggers a full API call with the complete context window. Six agents, 48 heartbeats per day each, plus a handful of cron jobs. The math starts looking uncomfortable fast.

This is especially true for coding tasks. Code agents tend to generate long responses with code blocks, explanations, and test outputs. Output tokens are the expensive ones. A single coding session can burn through more tokens than a full day of routine agent activity.

The problem is invisible until it is not. You get a bill, or you hit a usage limit, and then you start asking questions. Better to ask the questions early.

## Token optimization: beyond just picking a cheaper model

Switching to a cheaper model is the most obvious cost reduction. But there is a whole layer of optimization that happens before the model is even called.

Token optimization means reducing the size of what you send to the model on every call. Less context in means fewer tokens billed, faster responses, and a system that scales better.

Cost is the obvious reason. But there are others:

- Speed. Smaller prompts get processed faster. Your agents respond more quickly.

- Reliability. Longer contexts increase the chance the model loses track or makes mistakes. Tighter prompts mean better focus.

- Scalability. If you want to add more agents without spiraling costs, you need a lean baseline.

## What we actually did

Here are the specific changes we made to our setup, and the impact of each.

### 1. Reduced heartbeat frequency

Heartbeats are periodic check-ins where each agent wakes up, looks for new emails, calendar events, or tasks, and either acts or goes back to sleep. We moved from every 30 minutes to every 55 minutes. That cut about 45% of heartbeat API calls. The agents still check in frequently enough to catch anything urgent, and the cache stays warm under our 2-hour TTL (time-to-live, meaning how long cached content is reused before being refreshed).

### 2. Maximized prompt caching

Prompt caching is a feature where the model provider recognizes that part of your prompt is identical to a previous call and reuses the processed result instead of computing it again. Anthropic offers up to 90% cost savings on cached content. We switched our cache retention setting from "short" to "long" to maximize this. Since our workspace files are the same on every call, caching them makes a huge difference.

### 3. Trimmed workspace files

This was the biggest single improvement. Every agent has workspace files (personality, instructions, memory, tools) that get injected into every API call. We audited all six agents and cut the fat:

- Removed verbose examples and template filler, kept only the rules that actually change behavior

- Deleted leftover bootstrap files that were supposed to be removed on day one

- Cleaned up agent identity files that had unfilled template placeholders being sent as real tokens on every call

- Distilled memory files to current, relevant content instead of full history

The main agent's workspace shrank from ~26KB to ~15KB per call. Across all six agents, we saved roughly 57KB total. That is 57KB that was being sent and billed for on every single API call, day and night, whether it was useful or not.

### 4. Extended context pruning TTL

Context pruning decides how long a session's history is kept before it gets compacted (summarized to save space). We extended the TTL from 1 hour to 2 hours. This keeps the cache warm longer during idle stretches between messages, so more calls hit the cache instead of reprocessing the full context.

### 5. Switched the compaction model

When conversations get long, OpenClaw uses a compaction model to summarize the history and save tokens. We switched the compaction model from Sonnet (expensive) to GLM 5.1 (cheap). Summarization does not require frontier-level reasoning. Using a premium model for it was quiet money down the drain.

## General improvements for token optimization

Whether you use OpenClaw or another agent framework, these principles apply:

1. Audit what you are sending. Read your workspace files and agent prompts. Anything that does not directly change agent behavior is costing you money for no return.

1. Match the model to the task. Use the cheapest model that does the job well enough for routine work. Reserve premium models for tasks where reasoning quality actually matters.

1. Reduce call frequency. Ask whether your heartbeats, crons, and checks actually need to run that often. Spacing them out usually does not degrade the experience.

1. Use prompt caching. If your provider supports it, turn it on and configure it for maximum reuse. It is the closest thing to free money in LLM costs.

1. Clean up after yourself. Delete bootstrap files, remove stale memory entries, trim agent files that grew over time. The cost of carrying unused context is ongoing.

![](/images/notes/token-optimization/img4.jpeg)

## Closing

The real value of systems like OpenClaw over ChatGPT or Claude is not that they are smarter. It is that you can dial into different models and control costs intentionally. You decide which model handles which task. You decide how often agents wake up. You decide what context is worth carrying and what can be dropped.

Model tiering, token optimization, and cost control are not afterthoughts. They are part of the design. And when you treat them that way, you get a system that is both capable and sustainable. One that you can actually afford to keep running.