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
- [ ] Frame-level Figma links collected (workaround for page-size MCP bug)
- [ ] Page inventory + URL structure agreed

### 1. Foundation
- [ ] Scaffold project (build tool, folder structure, deploy check on preview URL)
- [ ] Design tokens from Figma (type scale, colors, spacing) as CSS custom properties
- [ ] Base templates: home, project page, writing piece
- [ ] Semantic HTML pass: clean, well-classified markup (this is the AI-redesign canvas)

### 2. Content
- [ ] Markdown content pipeline working end to end (draft -> push -> live)
- [ ] Port/draft project write-ups (Claude drafts, Elliott replaces text)
- [ ] Writing pieces: Canvas First!, Onboarding Skeptics, People/Projects/Notes/Tasks/Posts/Docs, Why I Made my Lamps in China
- [ ] Asset system: videos under PNG frames on grey backgrounds (Elliott produces raw video)

### 3. Motion
- [ ] Animation inventory: list every intended animation, per DESIGN.md rules
- [ ] Implement one at a time, CSS-first; Lottie only where vector illustration motion is needed
- [ ] prefers-reduced-motion pass

### 4. AI redesign console
- [ ] Port console from v2, restyled to new design
- [ ] Rewrite lib/prompt.js for the v3 DOM (document the semantic structure as the AI's API)
- [ ] Carry over: console chrome protection, presets, share gallery, boot intro decision TBD

### 5. Ship
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

## Open questions
1. Frame-level Figma links needed (page-level metadata dump crashes the MCP transport; per-frame links work).
2. AI-redesign scope in v3: keep share gallery + presets as-is, or trim? (Console itself is confirmed kept.)
3. URL structure: keep single-page home like v2 with writing/projects as subpages? Propose: `/` home, `/writing/<slug>`, `/work/<slug>` or unified `/p/<slug>` given shared layout.
