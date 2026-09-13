# v3 Roadmap

Working doc for the full redesign. Production (elliottsrosenberg.com) stays on `main` until v3 is deliberately merged.

## Sources of truth
- Design: [Sep26Website Figma](https://www.figma.com/design/gxzhVDM23NYC3VmGvgx0GE/Sep26Website?node-id=0-1) (type, color, layout locked-ish; not fully finished)
- Research: [Sep26 Portfolio Planning board](https://www.figma.com/board/bR7eoGgufkmp7SyZTX3kEM/Sep26-Portfolio-Planning) (Brian Lovin, Emil Kowalski, Jenny Wen, Julius Tarng, Tanner Christensen, Hannah Hearth, Paco Coursey, Rauno Freiberg, Juliette Karapetyan, Allan Grishstein)
- Design principles + animation rules: [DESIGN.md](DESIGN.md)

## Phases

### 0. Planning (current)
- [x] v3 branch + worktree + blank slate + Vercel preview
- [x] Survey Figma design + planning board + animation resources
- [x] Decide tech stack: Astro
- [x] Decide content pipeline: markdown in repo, drafted in Cursor
- [x] Frame-level Figma links collected (home 1:4, project 26:127)
- [x] Page inventory + URL structure agreed (/, /writing/<slug>, /project/<slug>)

### 1. Foundation
- [x] Scaffold project (Astro 5, builds clean, 9 pages)
- [x] Design tokens from Figma (colors sampled from frame renders) in src/styles/tokens.css
- [x] Base templates: home (index.astro), shared Piece layout for project + writing
- [ ] Semantic HTML pass: clean, well-classified markup (this is the AI-redesign canvas)

### 2. Content
- [x] Markdown content pipeline working end to end (content/{projects,writing}/*.md -> pages)
- [ ] Port/draft project write-ups (Claude drafts, Elliott replaces text)
- [ ] Writing pieces: Canvas First!, Onboarding Skeptics, People/Projects/Notes/Tasks/Posts/Docs, Why I Made my Lamps in China
- [ ] Asset system: videos under PNG frames on grey backgrounds (Elliott produces raw video)

### 3. Motion
- [x] Animation inventory: docs/MOTION.md (9 approved with specs, 6 rejected on the record)
- [ ] Implement one at a time, CSS-first; Lottie only where vector illustration motion is needed
- [ ] prefers-reduced-motion pass

### 4. AI redesign console
- [ ] Build console to the Figma design (the "Console ^" pill + panel UI is approved as designed)
- [ ] Rework the redesign engine (v2 was too slow and too inaccurate). Directions to explore:
      - Semantic DOM contract: small, stable, documented styling surface in the prompt (accuracy)
      - Streaming apply: inject CSS progressively as it streams so the design builds up live (perceived speed)
      - Two-phase: instant design-token pass (colors/type applied in ~2s), full stylesheet streams behind it
      - Structured output (tokens JSON + CSS) instead of freeform CSS+JS blob
      - Re-evaluate model choice for the speed/creativity tradeoff
- [ ] Hero image idea (2026-09-13): home DOM could carry a hidden hero image asset that only
      AI redesigns reveal/use, giving redesigns visual material without the default design
      paying for it. Decide during engine design.
- [ ] Console chrome protection pattern carried over from v2
- [ ] Share page: rework (v2 gallery design does not carry over as-is)

### 5. Ship
- [ ] Mobile pass over everything (queued after hover variant is chosen)
- [ ] Accessibility + performance pass
- [ ] Redirects from old URLs if any change
- [ ] Merge v3 -> main

## Decisions log
- 2026-09-13: Same repo, `v3` branch + worktree at `../elliott-rosenberg-v3`; old `alt-site` branch/worktree removed (was fully merged).
- 2026-09-13: Keep the AI-redesign console in v3.
- 2026-09-13: Animation resources adopted as house rules (see DESIGN.md). emilkowalski skills installed at `.agents/skills/`.
- 2026-09-13: Stack is Astro. Content is markdown files in the repo; Elliott drafts/edits in Cursor; publish = git push.
- 2026-09-13: Typeface is GT America, final (licensed files in main branch assets/fonts; numeric weights only, no faux-bold).
- 2026-09-13: No boot intro in v3. The lo-fi computer intro dies with v2.
- 2026-09-13: Writing pieces and case studies share one layout/template.
- 2026-09-13: URLs: `/` home, `/writing/<slug>`, `/project/<slug>`.
- 2026-09-13: Console UI ships as designed in Figma. Share page gets reworked. Redesign backend gets rebuilt for speed + accuracy (v2 engine retired).

## Frame index (Figma)
- Home page: node `1:4`
- Project page (Perennial): node `26:127`
- Note: get_metadata/get_design_context on large nodes crashes the MCP transport; get_screenshot works. Request per-frame or per-element links from Elliott as needed.

## Open questions
1. Redesign engine architecture: pick from the directions listed in phase 4 (decide when we get there).
2. Share page: new design needed (rework, not a port).
