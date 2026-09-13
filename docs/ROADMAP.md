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
- [ ] Decide tech stack (see Open Questions)
- [ ] Decide content pipeline (see Open Questions)
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

## Open questions
1. Tech stack: Astro (recommended) vs 11ty vs hand-rolled static like v2. Driven by the markdown pipeline.
2. Drafting tool: Obsidian vault on the repo content folder (recommended) vs Notion-as-CMS sync.
3. Typeface in the new design: confirm what the Figma uses (board notes say "lots of Inter"; v2 used licensed GT America).
4. Does the boot intro (lo-fi computer) survive into v3, die, or get redesigned?
5. Writing pieces and case studies: same template or two different layouts?
