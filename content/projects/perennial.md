---
title: Perennial
description: Studio management software for independent artists and designers.
order: 1
ogImage: /media/perennial/og.jpg
---

<figure class="media is-wide fig-hero">
<span class="media-frame">
<video src="/media/perennial/NorthwindProjectScrimFeatures.mp4" autoplay muted loop playsinline></video>
</span>
<figcaption>The home canvas: sketches, notes, tasks, and live studio objects on one surface, with the assistant anchored below.</figcaption>
</figure>

<dl class="fig-meta">
<div><dt>Role</dt><dd>Founder: research, product design, and engineering</dd></div>
<div><dt>Timeline</dt><dd>April 2026 &ndash; Present</dd></div>
<div><dt>Team</dt><dd>Solo</dd></div>
<div><dt>Status</dt><dd>Live in beta</dd></div>
</dl>

> Try it at [app.perennial.design](https://app.perennial.design) with `demo@perennial.design` and `PerennialDemo1`.

## Problem

After a year consulting for small studios, every engagement ended in the same place: good work and chaotic operations. I interviewed more than a dozen practitioners, from furniture designers to ceramicists to public artists, and heard the same story each time. Plans lived in a notes app, clients in a spreadsheet, and invoicing in a service of its own.

![The research corpus: recorded calls, transcripts, and the working notes behind the product.](/media/perennial/IDIs.png "bare")

The tools that exist sit at two extremes. Salesforce is built for sales teams and feels absurd at studio scale. Notion hands you raw blocks and leaves the system design to you, which is exactly the work a maker wants to hand off.

How might we give a one-person studio the operations of a high functioning business, without asking them to become an operations person?

<section class="band is-inverse">

## Solution

<p class="statement">One connected model.</p>

A client connects to their projects. Projects roll up time and expenses, which become invoice lines, which reconcile against the real bank feed. Every screen reads from that one model, so every screen tells the same story.

### Every record opens onto a canvas

Projects, contacts, and organizations each open onto their own canvas, with the structured fields alongside. Makers think spatially, so the software opens the way a studio table does.

<div class="media-row is-wide" style="--cols:1">
<figure class="media">
<span class="media-frame"><video src="/media/perennial/canvas.mp4" autoplay muted loop playsinline></video></span>
<figcaption>The canvas: sketches, notes, and live studio objects together.</figcaption>
</figure>
<figure class="media">
<span class="media-frame"><video src="/media/perennial/projects.mp4" autoplay muted loop playsinline></video></span>
<figcaption>Projects: cards with status, tasks, and deadlines.</figcaption>
</figure>
<figure class="media">
<span class="media-frame"><video src="/media/perennial/notes.mp4" autoplay muted loop playsinline></video></span>
<figcaption>Notes: asking about a contact from inside a note.</figcaption>
</figure>
</div>

<div class="split is-wide">
<div>
<span class="eyebrow">Money</span>
<h3>From tracked time to money in the bank</h3>
<p>Invoice lines pull from tracked time and expenses, go out as a branded email with a hosted payment page, and get paid through Stripe straight into the studio's own account.</p>
<p>Plaid brings in the real bank feed, and a deposit that matches an open invoice gets proposed as the match.</p>
</div>
<video src="/media/perennial/invoicing.mp4" autoplay muted loop playsinline></video>
</div>

![Banking in dark mode: the real feed, categorized and matched back to the invoices that produced it.](/media/perennial/banking-dark.png "bare")

</section>

<div class="split is-wide is-flipped">
<div>
<span class="eyebrow">Ash</span>
<h3>A pleasant, knowledgeable AI assistant</h3>
<p>Press Space on any line and Ash is there. Factual questions get answers from live data. Judgment calls, like whether a 50 percent gallery split is fair, get the real options and their tradeoffs.</p>
<p>A hand-written knowledge base and a research brief on each user's corner of the market keep the advice local to the practice.</p>
</div>
<video src="/media/perennial/ash.mp4" autoplay muted loop playsinline></video>
</div>

<span class="eyebrow">Outreach and opportunities</span>

Pipelines for press, galleries, and stockists, with a parking lot for conversations that go quiet, beside a hand-curated feed of fairs, open calls, and grants.

<div class="media-row is-wide" style="--cols:2">
<figure class="media">
<span class="media-frame"><video src="/media/perennial/outreach.mp4" autoplay muted loop playsinline></video></span>
<figcaption>Outreach: logging a follow-up straight from the pipeline.</figcaption>
</figure>
<figure class="media">
<span class="media-frame"><video src="/media/perennial/opportunities.mp4" autoplay muted loop playsinline></video></span>
<figcaption>Opportunities: curated fairs, open calls, and grants with real deadlines.</figcaption>
</figure>
</div>

<section class="band is-tint">

## Beta

<div class="fig-stats" style="--cols:3">
<div class="stat"><span class="stat-value">11 weeks</span><span class="stat-label">From first commit to a working beta</span></div>
<div class="stat"><span class="stat-value">462</span><span class="stat-label">Commits, every layer from schema to interface</span></div>
<div class="stat"><span class="stat-value">10</span><span class="stat-label">Working users in beta</span></div>
</div>

The beta ran through a shared Slack. A question in the channel became a conversation about what the person was actually trying to do, then a decision, then a ticket filed straight from the thread.

![The beta Slack: the welcome note, and a real bug report beside the weekly error triage.](/media/perennial/slack-msgs.png "bare")

</section>

## Process

Four moments that set the direction of the app:

### 1. Onboarding

In order to make a custom-feeling application for users, a comprehensive user onboarding experience is important. I weighed the options of including an assisted personal demo, making the process self serve, and how much of the onboarding phase is mandatory before viewing the application.

<figure class="media">
<span class="media-frame">
<span class="media-grid" style="--cols:2;--cols-sm:1">
<img src="/media/perennial/onboarding-name.webp" alt="Onboarding step one: Welcome to Perennial, asking for a name and studio name." width="2000" height="1326" loading="lazy" decoding="async">
<img src="/media/perennial/onboarding-make.webp" alt="Onboarding step two: What do you make?, with discipline pills like furniture, ceramics, and graphic design." width="2000" height="1326" loading="lazy" decoding="async">
</span>
</span>
<figcaption>Key onboarding screens.</figcaption>
</figure>

### 2. Three options for every feature

Before any code, I made 28 standalone HTML wireframes. Every feature started as three directions, annotated red for what was still undesigned and blue for decisions to revisit, and filled with real maker content, since "Walnut slab idea for gallery show" tests line length and tone in ways placeholder text can't.

<figure class="media">
<span class="media-frame">
<span class="media-grid" style="--cols:2;--cols-sm:1">
<img src="/media/perennial/00-claude-grabbed/wireframe-ash.png" alt="Wireframe of the notes surface with the assistant's floating window." width="1600" height="1000" loading="lazy" decoding="async">
<img src="/media/perennial/00-claude-grabbed/wireframe-outreach.png" alt="Wireframe of the outreach pipeline." width="1600" height="1000" loading="lazy" decoding="async">
</span>
</span>
<figcaption>April wireframes. Red marks what was still to be designed.</figcaption>
</figure>

### 3. Modeling the studio as one graph

Building the connected studio graph was iterative. It came together as I built the MVP, and seeing the full graph as one was the largest source of pride for me. Every surface reads from one connected model: an invoice line knows which time entry produced it, and a deposit knows its invoice. Row level security on all 43 tables from day one made the database itself the permission layer, so going from one studio to many is a switch. 

![The data model: clients, projects, time, expenses, invoices, and the bank feed as one connected graph.](/media/perennial/data-model.svg)


### 4. Teaching Ash to act on the user's behalf

Most of the people Perennial serves are skeptical of AI, so the assistant had to earn its place. I shaped Ash's behavior in three layers:

- **Friendly to people who don't use AI.** Ash starts small and grows only when the user asks. Factual questions get a direct answer, and judgment calls get the real options and their tradeoffs, so the person stays the one deciding.
- **Fluent in the studio's data.** Ash reads from the same connected model as every screen, so each date and dollar comes from a fresh read of the database. A hand-written knowledge base covers pricing, contracts, galleries, and cash flow, and a research brief written after onboarding covers the user's own corner of the market.
- **Active, and safe about it.** Ash can take real actions across the app. Its description of what it can do is generated from that live tool registry, so its claims always match its abilities, and it names its limits plainly. Every action comes back with a link to what it created, and when a user states a preference, Ash follows it over general best practice.

Every release is gated by judged evals at 80 percent. The first version graded answers on whether they contained specific numbers and dates, which rewarded exactly the false confidence skeptics spot instantly, so I rewrote the tests to grade the behavior itself.

<section class="band is-inverse">

<span class="eyebrow">The Stack</span>

Designs start in Figma. Beta testers report bugs and ideas in Slack, and I triage every one by hand before it becomes a Linear ticket, since text from users is untrusted input. Conductor runs Claude Code on several tickets at once, each in its own branch, and every pull request on GitHub gets a Vercel preview before it merges. Supabase holds the data, PostHog shows how people actually use the app, and Sentry feeds errors back into the same queue each week.

<figure class="media bare">
<span class="media-frame">
<span class="tools">
<span class="tools-row">
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/figma.svg)" aria-hidden="true"></i><strong>Figma</strong><span>Design</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/slack.svg)" aria-hidden="true"></i><strong>Slack</strong><span>Communication</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/linear.svg)" aria-hidden="true"></i><strong>Linear</strong><span>Issue triaging</span></span>
</span>
<span class="tools-row">
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/conductor.svg)" aria-hidden="true"></i><strong>Conductor</strong><span>Harness</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/claude.svg)" aria-hidden="true"></i><strong>Claude Code</strong><span>Model</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/github.svg)" aria-hidden="true"></i><strong>GitHub</strong><span>Repo</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/vercel.svg)" aria-hidden="true"></i><strong>Vercel</strong><span>Deployment</span></span>
</span>
<span class="tools-row">
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/supabase.svg)" aria-hidden="true"></i><strong>Supabase</strong><span>Database</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/sentry.svg)" aria-hidden="true"></i><strong>Sentry</strong><span>Error tracking</span></span>
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/posthog.svg)" aria-hidden="true"></i><strong>PostHog</strong><span>Analytics</span></span>
</span>
</span>
</span>
</figure>

</section>

## Status

Perennial is live and usable end to end: multi-tenant, documented, and waiting behind its eval gate for the next change. There are hundreds of features I'd like to implement, and am focusing my efforts on fixing bugs and talking with customers as I start to monetize the software. 

Perennial was the tool I originally built for me, but quickly morphed to serve the hundreds of designers and artists I went to college with and met in my early career. I am excited to continue to build and pivot the software as new tooling makes creative development and operations more expansive. 
