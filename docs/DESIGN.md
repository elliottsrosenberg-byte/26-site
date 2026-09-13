# v3 Design Principles

The contract for how this site looks, moves, and is coded. Update as decisions land.

## Direction (from Figma + planning board)
- One column, text-first, generous whitespace. Reads like a well-set document, not a "website".
- Near-monochrome palette: white page, warm grey steps, near-black ink. Small accent chips exist in the Figma palette frame (confirm usage).
- Structure per Figma: name + "Designer" masthead, bio paragraphs, Projects list (Perennial, Oneg Home, Waiting Magazine, Siegel), Writing list, Get in Touch. Project pages get a small sidebar nav and framed imagery.
- Imagery: screenshots/videos sit inside device PNG frames over grey blocks. Video plays under a transparent PNG frame (muted, playsinline, loop, paused offscreen via IntersectionObserver).
- Influences: Lovin/Kowalski/Coursey one-column restraint, Rauno's craft mantra ("Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful."), "slides style navigation and then custom pages" pattern for projects.
- NO em dashes anywhere in site copy.

## Animation house rules
Distilled from emilkowal.ski, interfaces.rauno.me, vercel.com/design/guidelines. The emilkowalski skills in `.agents/skills/` (animations, review-animations) apply when implementing.

1. Every animation needs a reason: feedback, spatial continuity, or explanation. Decoration only in rarely-seen moments. Sometimes the best animation is no animation.
2. Frequency test: the more often an interaction happens, the less it should animate. Never animate keyboard-driven or repeated actions.
3. Durations: UI transitions under 300ms, most under 200ms. Enter animations ease-out. No bounce on functional UI.
4. Only animate transform and opacity. Never `transition: all`. No layout-property animation.
5. Scale from ~0.96-0.8, never from 0. Dialogs fade+scale from ~0.98; pressed buttons ~0.97.
6. Honor `prefers-reduced-motion` on everything; animations are interruptible by input.
7. Theme switches never trigger transitions.
8. Pause looping media offscreen.
9. CSS first, then Web Animations API, then JS. Lottie reserved for illustrative vector motion that CSS cannot do.
10. Loading states: show only after a delay, then persist 300-500ms minimum to avoid flicker. Optimistic UI where success is likely.

## Interface craft rules
- Semantic HTML before ARIA. All flows keyboard-operable, `:focus-visible` rings.
- Hit targets at least 24px desktop / 44px touch. `@media (hover: hover)` for hover states.
- Inputs: font-size at least 16px (iOS zoom), labels focus their input, forms wrapped in `<form>` so Enter submits.
- Fluid type with `clamp()`. `font-variant-numeric: tabular-nums` where numbers align. No font-weight changes on hover.
- Persist meaningful state in the URL.

## HTML as the AI-redesign API
The redesign feature reads and restyles the live DOM, so markup is the contract:
- Semantic elements everywhere (`header`, `main`, `article`, `section`, `nav`, `figure`).
- Stable, descriptive class names and data attributes; documented in `lib/prompt.js` so the model knows exactly what it is styling.
- Console chrome keeps hardcoded colors (v2 pattern) so redesigns cannot break the controls; the AI owns everything else.
- Simple layout = wilder redesigns land cleanly. Resist wrapper divs.
