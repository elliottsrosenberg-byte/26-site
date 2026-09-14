---
title: Perennial
description: Studio management SaaS tool for artists.
order: 1
---

## Mission

Perennial helps artists and designers turn their craft into a business, so they can spend more time making the work because it finally pays for itself. It gives an independent practice the tangible pieces it actually needs, without assuming you speak the language of operations.

Historically, artists and designers have been alienated from modern management tools because of the lack of education and accessibility. Now, there is a tool that exists that helps to guide the way towards financial independence and creative freedom, all in one place.

After a year of consulting for independent artists and small design studios, I realized the potential of a comprehensive software tool that provides education and a platform for business infrastructure.

## Research

The idea did not start as software. It started in my consulting work, where every engagement ended in the same place: the work was good, and the operations around it were chaos. A notes app holding project plans, a spreadsheet acting as a CRM, email carrying everything else, and an invoicing service that knew about none of it.

I recorded interviews with more than a dozen independent practitioners: furniture and lighting designers, ceramicists, textile designers, public artists, people running one and two person studios. The pattern held across every conversation. The craft is the easy part. The week quietly disappears into administration spread across tools that do not talk to each other.

![Interview recordings from the research phase.](/media/perennial/research-interviews.svg "bare")

The existing options split into two camps. Tools like Salesforce are built for sales organizations and feel absurd at studio scale. Tools like Notion hand you a blank canvas and make you build the system yourself, which is exactly the work a maker does not want. Nothing was shaped for how a small studio actually runs: a few clients, a couple of projects at a time, invoices that need to go out, and a reputation to keep building.

The research never really stopped. Onboarding in the finished product is a nine step structured interview that asks, in the user's own words, what is broken right now and what is urgent on their plate. Those answers configure the project board, seed the outreach pipelines, and brief the assistant before the first conversation.

## System

The core decision was to model the studio once instead of bolting four apps together. A client connects to their projects. Projects roll up time and expenses. Time and expenses become invoice line items. Invoices get paid through Stripe and reconcile against the real bank feed. One graph, so the dashboard can show one true picture instead of four pictures that disagree.

![Home. Every card is a live snapshot of another module. No data lives on the dashboard itself.](/media/perennial/home.png)

The data layer is Postgres on Supabase: 43 tables, with row level security on every one from day one. Each row is scoped to its owner at the database level, which means the database itself is the authorization layer and most features talk to it directly, with no API middle layer to drift out of sync. It also means going from one studio to many is a switch, not a rewrite. That cost extra work up front for a product with a handful of users, and it was the right trade.

The linking philosophy is provenance, not duplication. An invoice line item knows which time entry or expense produced it. A bank transaction links back to the invoice that generated the deposit. The Resources module indexes files where they already live across the app instead of copying them into a second store. Tasks and notes attach to any parent, whether that is a project, a person, an organization, an outreach target, or an opportunity, so nothing has to be entered twice to show up where it matters.

## Interface

I wireframed before I wrote code: 28 standalone HTML wireframes, built desktop first. Every feature started as three options, I picked a direction, then iterated. The wireframes carried their own annotation system, red for areas not yet designed, blue for decisions to revisit, and used realistic maker content instead of lorem ipsum, because "Walnut slab idea for gallery show" tells you things about line length and tone that placeholder text never will.

![An April wireframe of the notes surface with Ash's floating window. The red sidebar marks what was not designed yet.](/media/perennial/wireframe-ash.png "bare")

The interface principle that survived every iteration: a record opens to a page, not a form. The first tab on every project, contact, organization, and outreach target is a freeform writing canvas, with the structured fields sitting quietly to the side. Makers think in notes and fragments, not database fields, so the software leads with the surface they already trust. The canvas is shared rather than copied: an outreach target is a thin wrapper around a contact, and writing on one writes on the other.

![A project opens as a panel over the board: canvas first, then tasks, contacts, notes, files, and a finance roll up.](/media/perennial/project-scrim-tasks.png)

The visual system is charcoal, sage, and warm white, with Newsreader for display type and Albert Sans for the interface, set on a deliberately small and dense scale. User facing labels draw from a fixed palette of ten colors, assigned by hashing the tag's name, so the same tag is always the same color without anyone managing color assignments. The design tokens are enforced mechanically: a repo hook rejects any edit that introduces a raw hex value instead of a token.

![Network. Contacts and leads are two views of one record, so converting a lead keeps its whole history.](/media/perennial/network-full.png)

## Money

Invoicing runs on Stripe Connect with direct charges, which means payments land in the studio's own Stripe account and Perennial takes no cut in the middle. An invoice moves from draft to sent to paid, its line items pull from tracked time and expenses with provenance intact, and every invoice gets a public payment page at a tokenized link, plus a printable version and a branded email with a live preview before sending.

![Invoices. Every line item knows the time entry or expense that produced it.](/media/perennial/invoices-full.png)

Banking connects through Plaid. Real transactions flow in, get auto categorized, and can carry receipts. When a credit lands that matches an outstanding invoice within a dollar, Perennial proposes the match, which closes the loop from work to time to invoice to actual money in the account. The Stripe webhook is idempotent and returns an error on database failure so Stripe retries, because the money path is the one place events must never silently drop.

![Banking. The real feed, categorized and matched back to the invoices that produced it.](/media/perennial/banking.png)

## Ash

The assistant is named Ash: one syllable, gender neutral, does not try too hard. The icon is a small sapling, deliberately not sparkles, not a robot, not a wand. It rests in the bottom right corner and grows through three states, from icon to floating window to full surface. It is also woven into the writing canvas itself: press Space at the start of any line and Ash is there, and what comes back is either prose inserted into the page or a real action with a link to what it created.

![Ash. An assistant that already has full context on the studio's own data.](/media/perennial/ash.png)

The governing rule is educate, then act. Ash splits questions into two kinds. Black and white questions get a direct answer pulled from live data, never a date or dollar amount from memory. Nuanced questions, like whether a 50 percent gallery split is fair, get the real options and tradeoffs rather than a verdict, because the goal is an informed maker making their own call. A preference memory learns each user's stated positions across conversations, and when their preference conflicts with general best practice, their preference wins for them.

Ash's expertise is built, not assumed. A hand written knowledge base covers pricing, contracts, galleries, press, sales channels, and cash flow, deliberately written as frameworks rather than verdicts, then embedded for retrieval. Right after onboarding, a background researcher browses the web for that specific user's corner of the market, the galleries, fairs, publications, and norms that fit their medium, price point, and region, and writes a private brief that gets retrieved alongside the general knowledge. Advice from Ash is local, not generic.

Two pieces of honesty engineering I care about. Ash's sense of what it can do is generated from the live tool registry, all 18 tools of it, so it can never claim an ability it does not have, and it states plainly that it cannot send email or move money. And its behavior is tested by LLM judged evals that gate releases at 80 percent. An earlier eval rewarded answers containing specific numbers and dates, which rewarded exactly the false confidence the product exists to avoid, so I replaced it.

## Reach

Outreach is kanban pipelines for the campaigns a studio actually runs: press, galleries, stockists, new business, seeded from the onboarding answers. The distinctive piece is the Ether, a parking lot attached to every pipeline, because most outreach is not dead, it is dormant, and a good system holds a paused conversation without letting it rot on the active board.

![Outreach. Pipelines for press and galleries, with the Ether holding paused targets.](/media/perennial/outreach.png)

Presence gathers the outward facing picture: website analytics, socials, newsletter performance, and a press log. Alongside it sits a curated opportunities feed of fairs, open calls, grants, and residencies, reviewed by hand and matched to each user's discipline, with deadlines flowing onto the same calendar as everything else.

![The opportunities feed: curated fairs, open calls, grants, and residencies with real deadlines.](/media/perennial/presence-opps.png)

## Development

The first commit is April 17, 2026. The last of 462 is July 4. Eleven weeks, solo, every layer from the Postgres schema to the interface. Ash is in the very first build commit, because the assistant was the thesis, not a feature bolted on when the app was done.

The build ran on a pipeline I would use again anywhere. Slack is intake, where bugs and ideas land. Linear is the queue and the brain. Claude Code is the hands, working each ticket into a branch and a pull request, with a Vercel preview before anything merges to main. A human triage gate sits between intake and the agent on purpose: untrusted text from users should never flow straight into a code writing agent, because that is a prompt injection path. Sentry triages errors into the same queue weekly, and a changelog agent posts every merge back to Slack.

Midway through, I wrote an honest document I think about a lot: a duplication registry cataloguing every place the codebase had grown by cloning instead of sharing, down to the four detail panels rebuilding the same scaffold and a Badge component with zero importers. That document drove a consolidation wave, shared shells, adopted primitives, tokenized colors, and finally the hook that enforces the design system on every future edit. Writing down where the codebase was bad made it better faster than pretending it was fine.

## Beta

About ten working designers and artists used Perennial in private beta, coordinated through a Slack where we workshopped the product together. The loop was simple: a user asks a question, I ask what they are actually trying to do, the thread becomes a decision, and the decision becomes a ticket filed straight from the channel.

![The beta Slack, where a feature question turned into a sharper definition than either request alone.](/media/perennial/beta-slack.svg "bare")

My favorite example is task deletion. One tester wanted to delete tasks, for the ones created by mistake. Another pushed back on their own behalf: they wanted an archive, because a few weeks later you do not care about a task, but you might want to know if and when it happened. Two asks that sound like one feature request are actually the full definition of the feature: deletion is for mistakes, archival is for history, and a system that conflates them loses one or the other.

## Status

Perennial is live at app.perennial.design and usable end to end: onboarding, projects, network, outreach, notes, calendar, scheduling, invoicing, banking, presence, and Ash. I paused active development in August 2026 after a hard look at the market landscape. The beta cohort knows I intend to pick it back up, and the system was built for that moment: multi tenant from day one, documented end to end, with an eval gate waiting for the next change.

What it demonstrates is the way I like to work. Find the disconnected mess, design the system that joins it, and build the whole thing end to end, with the honesty to write down what is rough and the discipline to fix it.
