# v3 Motion Inventory

Every intended animation on the site, gated per the rules in [DESIGN.md](DESIGN.md) and the
`.agents/skills/animate` + `find-animation-opportunities` skills. Each entry names its purpose
(feedback / spatial consistency / state indication / preventing a jarring change / delight)
and carries exact values. Tokens live in `src/styles/tokens.css`
(`--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--dur-fast: 150ms`, `--dur-base: 220ms`).

Status: [ ] proposed, [x] built.

## Approved inventory

| # | Surface | Purpose | Frequency | Motion spec |
| --- | --- | --- | --- | --- |
| 1 | Cross-page transition: clicking a project/writing title morphs it into the destination page's masthead; rest of content crossfades | Spatial consistency | Occasional | Astro `<ClientRouter />` + shared `view-transition-name` per piece title. Morph ~250ms var(--ease-out). The signature move of the site. Needs a prototype + feel check. |
| 2 | Home entrance: masthead, bio, then sections rise in once per visit | Delight (first-impression tier) | Rare per visitor | `opacity 0 -> 1` + `translateY(10px) -> 0`, 400ms var(--ease-out), 50ms stagger between blocks. CSS only, `@starting-style`. Never re-runs on back-navigation (sessionStorage guard or VT integration). |
| 3 | Piece sidebar scrollspy: active section gets the dot + ink color | State indication | Occasional | IntersectionObserver; `color` transition 150ms ease; dot is `opacity 0 -> 1` 150ms. No movement. |
| 4 | Sidebar anchor click: smooth scroll to section | Preventing a jarring change | Occasional | `scroll-behavior: smooth` (CSS only), disabled under prefers-reduced-motion. |
| 5 | Link hovers (bio links, item titles, contact) | Feedback | Tens/day tier: near-imperceptible only | `text-decoration-color` + `color` transition 150ms ease. No movement, no weight change. |
| 6 | Console pill press | Feedback | Occasional | `:active { transform: scale(0.97) }`, `transition: transform 150ms var(--ease-out)`. |
| 7 | Console panel open/close | Spatial consistency (grows from its pill) | Occasional | `transform: translateY(12px) scale(0.98)` + `opacity 0` -> settled, 220ms var(--ease-out); exits the same path. Transitions (not keyframes) so rapid toggling retargets. |
| 8 | AI redesign apply: CSS streams in progressively, page repaints live | Explanation + delight (the product IS the show) | Rare | Engine-phase design. Progressive style injection; loading affordance appears only after 300ms delay, persists min 400ms. |
| 9 | Framed media figures: video plays only in view | Performance hygiene, not animation | n/a | IntersectionObserver play/pause; `muted playsinline loop`. |

## Rejected (on the record)

- Theme toggle transition. House rule: theme switches never animate. Instant swap.
- Hover motion on list items (lift, slide, scale). Frequency tier allows near-imperceptible only; color is enough. Movement here would cheapen the restraint that makes the design.
- Scroll-triggered reveals on body text and case-study content. Function rule: content the user is reading should not move. Entrance animation is for the first paint only (item 2), not per-scroll.
- Animated attention pulse on the console pill (v2 had one). Decoration on a persistent element the user sees every visit; fails frequency. The pill earns attention through placement.
- Parallax, cursor-tracking, marquee anywhere. Function rule; also fights the document-like identity.
- Animated page-load progress/skeletons. Static site loads in one paint; nothing to bridge.

## Elliott's ideas (to be gated + specced together)

- (add here)

## Build order

1. Item 5 + 6 (trivial, pure CSS, land with any commit)
2. Item 2 (home entrance)
3. Item 1 (view transitions, the signature; prototype first, feel-check together)
4. Item 3 + 4 (scrollspy)
5. Items 7 + 8 land with the console phase

Every item ships with its `prefers-reduced-motion` variant (gentler, not zero: keep fades, drop movement) and hover gating via `@media (hover: hover)` where relevant.
