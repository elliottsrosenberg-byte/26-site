# Writing content

Everything on the site is a markdown file in this folder. Edit in Cursor, commit, push `v3`; the preview URL updates in ~30 seconds. No em dashes.

## Files

- `content/projects/<slug>.md` publishes at `/project/<slug>/`
- `content/writing/<slug>.md` publishes at `/writing/<slug>/`

## Frontmatter

```yaml
---
title: Perennial
description: Studio management SaaS tool for artists.   # subtitle on home + the page
order: 1        # position in the home list
draft: true     # optional: hides from production, still on the preview URL
---
```

## Sections

`## Heading` makes a section: the faint outdented label, the left sidebar entry, and the scrollspy stop. Everything under it is regular paragraphs.

## Images

Put files in `public/media/<slug>/` (1600px wide is plenty; JPG for photos, PNG for UI). Then:

```markdown
![Home Page](/media/perennial/home.png)
```

That renders the default setting from the Figma: the image with rounded corners and a light shadow, sitting on a grey surface block, with the alt text as the small centered caption. An image with empty alt `![](...)` gets no caption.

Variant, no frame (plain image, no grey block, no shadow):

```markdown
![Caption](/media/perennial/home.png "bare")
```

## Callouts and code

A markdown blockquote renders as a callout: a quiet grey block for asides, demo links, and notes that sit outside the main flow.

```markdown
> Perennial is live in beta at [app.perennial.design](https://app.perennial.design).
```

Inline `code` renders as a small chip, good for credentials, filenames, and terms. Fenced code blocks (triple backticks) render as a grey surface block that scrolls horizontally when long.

## Videos

Markdown has no video syntax, so use the figure directly:

```html
<figure class="media">
  <span class="media-frame">
    <video src="/media/perennial/flow.mp4" autoplay muted loop playsinline></video>
  </span>
  <figcaption>Task sync across views</figcaption>
</figure>
```

`autoplay muted loop playsinline` is the standard combo (muted + playsinline are required for iPhone autoplay). Looping videos pause automatically while off screen. Add `class="media bare"` on the figure for the unframed variant. Keep videos short, compressed (H.264 MP4, ~5MB or less), and 1600px wide or less.

Phone-shaped video (reels, stories) goes in the phone frame below.

## Figure patterns

Reusable blocks for any project or writing page. Styles live in `src/styles/figures.css`, behavior in `src/scripts/figures.ts`; both load on every page. `content/projects/oneg-home.md` uses every one of them, so copy from there.

Rules that apply to all of them:

- Raw HTML in markdown must have **no blank lines inside a block**, or markdown breaks it apart.
- Images are never cropped. Always give `width` and `height` (the real pixel size) so the layout holds while images load.
- Grey surface (`figure class="media"`) is for UI, documents, and diagrams. Photos go bare (`figure class="media bare"`).

### Scrollshot: a tall page scrolled inside a pinned browser window

For long pages (a homepage, a landing page). The window pins mid-screen, caption included, and the page inside moves with the reader's scroll. With reduced motion on, it becomes a window you scroll by hand.

```html
<div class="scrollshot">
<figure class="scrollshot-stage">
<span class="media-frame">
<span class="browser"><span class="browser-bar">example.com</span><span class="scrollshot-window" tabindex="0" role="region" aria-label="Page name, scrollable"><img src="/media/slug/page.webp" alt="..." width="1400" height="5800" decoding="async"></span></span>
<span class="scrollshot-progress" aria-hidden="true"><span></span></span>
</span>
<figcaption>Caption shows for the whole scroll.</figcaption>
</figure>
</div>
```

Optional `data-speed="0.55"` on the outer div: lower means the page inside moves faster per scroll.

### Filmstrip: a sideways row of tall artifacts

For email series, catalog pages, reports. Each item shows whole; arrows and an `n / N` counter below. `--card` sets item width (desktop), `--card-sm` on phones.

```html
<figure class="media filmstrip" style="--card:220px;--card-sm:200px">
<span class="media-frame">
<span class="filmstrip-track" tabindex="0" role="region" aria-label="Emails">
<img src="..." alt="..." width="700" height="3000" loading="lazy">
<img src="..." alt="..." width="700" height="2400" loading="lazy">
</span>
</span>
<span class="filmstrip-nav"><button type="button" data-dir="-1" aria-label="Previous">&larr;</button><span class="filmstrip-count" aria-live="polite">1 / 2</span><button type="button" data-dir="1" aria-label="Next">&rarr;</button></span>
<figcaption>Caption</figcaption>
</figure>
```

Panning variant: add `is-pan` to the figure and wrap each image in a card. Every card gets the same window (`--card` wide, `--box` times as tall) and the full-length image pans top to bottom inside it; `--r` is the image's height divided by its width, `--i` staggers the start. A text block under each is optional.

```html
<figure class="media filmstrip is-pan" style="--card:220px;--card-sm:190px;--box:1.6">
<span class="media-frame">
<span class="filmstrip-track" tabindex="0" role="region" aria-label="Emails">
<span class="pan-card" style="--r:4.403;--i:0"><span class="pan-window"><img src="..." alt="..." width="700" height="3082" loading="lazy"></span><span class="pan-text"><span class="pan-date">Aug 10</span><span class="pan-title">Founder letter</span><span class="pan-note">One line.</span></span></span>
</span>
</span>
<span class="filmstrip-nav">...same as above...</span>
</figure>
```

### Media grid: several images side by side

`--cols` on desktop, `--cols-sm` on phones. Wrap an image in `media-cell` to add a small label under it.

Add `is-zoomable` to the figure to make every image in it (grid images, or the pages of a filmstrip) open full size on click: `<figure class="media is-zoomable">`. The image grows out of the grid to the middle of the screen, and a click anywhere (or Esc) puts it back. There is no other chrome by design. The image never scales past its own pixel size, so the source file is the ceiling on how much more you actually see.

```html
<figure class="media bare">
<span class="media-frame">
<span class="media-grid" style="--cols:3;--cols-sm:1">
<span class="media-cell"><img src="..." alt="..." width="900" height="675" loading="lazy"><span class="media-cell-label">Label</span></span>
<img src="..." alt="..." width="900" height="675" loading="lazy">
</span>
</span>
<figcaption>Caption</figcaption>
</figure>
```

### Phones: screenshots and reels in an iPhone frame

The screen is iPhone-shaped (1179 x 2556). Full-screen phone screenshots fill it exactly; video fills the screen edge to edge (a 9:16 reel loses a sliver of each side).

```html
<figure class="media">
<span class="media-frame">
<span class="phones" style="--cols:4;--cols-sm:2">
<span class="media-cell"><span class="phone"><span class="phone-screen"><img src="..." alt="..." width="600" height="1300" loading="lazy"></span></span><span class="phone-label">Post</span></span>
<span class="media-cell"><span class="phone"><span class="phone-screen"><video src="....mp4" poster="....webp" autoplay muted loop playsinline></video></span></span><span class="phone-label">Reel</span></span>
</span>
</span>
</figure>
```

### Hero, meta, and stats

Hero: `figure class="media bare fig-hero"` as the first thing in the file (use `fetchpriority="high"`, no lazy loading). Meta: a `<dl class="fig-meta">` of `<div><dt>Role</dt><dd>...</dd></div>` pairs. Stats: `<div class="fig-stats">` of `<div class="stat"><span class="stat-value">20%</span><span class="stat-label">...</span></div>`. `--cols` sets the column count (default 4); set it to match the number of stats.

### Diagrams

Built in HTML so numbers stay sharp and follow the theme. Put them in a grey `figure class="media"` wrapping `<span class="diagram">`, with an optional `diagram-title` and `diagram-foot`.

- **Bars** (`.bars` with `--max`): each `.bar-row` has a `.bar-label` and a `.bar-track` holding `.bar-fill` (`--v`, optional `--from`; variants `is-muted`, `is-accent`, `is-gap`) and a `.bar-value` (`--v`; `is-inside` puts it inside the bar end). Add `has-marker` and a `<span class="bars-marker" style="--at:25"><span>Goal</span></span>` for a dashed reference line.
- **Year** (`.year`): twelve month labels over a `.year-track` of weekly ticks, with `.year-event` markers at `--at` (percent of the year). `--row:1` drops a label to a second line; `data-row-sm="1"` does it only on phones.
- **Key figures** (`.metrics`, `--cols` for the column count): each `.metric` holds a `.metric-value` (`is-accent` for the one that matters), a `.metric-label`, and an optional smaller `.metric-note`. Use it when two or three numbers say it better than a chart.
- **Grouped bars** (`.bar-groups`): one `.bar-group` per measure, each carrying its own `--max` so measures in different units sit together. A `.bar-group-label` names the measure, then the same `.bar-row`s as above. Keep the baseline bar `is-muted` and the bar that matters `is-accent`, and use `is-inside` on the longer bar's value so it stays inside the track.
- **Timeline** (`.timeline`, height via `--h`): items with `is-email` get small square marks; `data-tier="1"` moves a crowded label one row further out. `.timeline-phase` bands (`--from`, `--to`) and `.timeline-item` milestones at `--at`, labels below by default or `data-side="above"`; `data-align="start"`/`"end"` for the first and last. Stacks into a vertical list on phones.

The warm accent (`--figure-accent`) is for the one thing a diagram is about. Everything else stays in the grey steps.

### Bands: full-width light and dark sections

Wrap any run of markdown in a band to switch that stretch of the page to the opposite theme, like cutting to a dark slide. Keep a blank line after the opening tag and before the closing one so the markdown inside renders. The breadcrumb and sidebar links flip colors as a band passes behind them.

```html
<section class="band is-inverse">

## Solution

Regular markdown here.

</section>
```

`is-tint` is the quieter version: the warm grey surface, good for a single image block. Use inverse bands sparingly (two or three a page) so each one reads as a moment.

### Statements, sub-heads, eyebrows, quotes

- `<p class="statement">Big line.</p>` for the one sentence a section is about (`is-wide` allows a longer line). Put `<span class="eyebrow">Label</span>` at the start of it for a small label above.
- `### Heading` for a sub-section inside an `##` section.
- A pull quote:

```html
<figure class="fig-quote">
<blockquote>The line.</blockquote>
<figcaption>Who said it, or why it matters.</figcaption>
</figure>
```

### Split: short text beside media

```html
<div class="split">
<div>
<span class="eyebrow">Label</span>
<h3>Title</h3>
<p>One or two short paragraphs.</p>
</div>
<video src="..." autoplay muted loop playsinline></video>
</div>
```

Add `is-flipped` to put the media on the left. Stacks on phones.

### Flow: a chain of steps

`<span class="flow">` of `<span class="flow-step"><strong>Step</strong><span>What happens</span></span>`, inside a diagram figure. Arrows run left to right, and top to bottom on phones.

### Wide: break out of the text column

Add `is-wide` to a `figure class="media"`, a `split`, or a `media-row` to make it wider than the text (up to 1120px, always clear of the sidebar). Good for a hero, a two-column split, or a row of media.

### Media row: separate frames side by side

Each item gets its own grey frame and caption. `--cols` sets how many; phones stack them.

```html
<div class="media-row is-wide" style="--cols:3">
<figure class="media">
<span class="media-frame"><video src="..." autoplay muted loop playsinline></video></span>
<figcaption>Caption</figcaption>
</figure>
</div>
```

### Question and logos

- `<p class="statement is-question">How might we ...?</p>` sets a question in bold italics.
- `<i class="logo-mark" style="--logo:url(/media/logos/slack.svg)" aria-hidden="true"></i>` is a logo that takes the text color. Use it in a flow step before the `<strong>`, or in a tools grid. Logos live in `public/media/logos/` as single-color SVGs (Simple Icons is a good source).
- A tools grid, one `tools-row` per row, centered:

```html
<figure class="media bare">
<span class="media-frame">
<span class="tools">
<span class="tools-row">
<span class="tool"><i class="logo-mark" style="--logo:url(/media/logos/figma.svg)" aria-hidden="true"></i><strong>Figma</strong><span>Design</span></span>
</span>
</span>
</span>
</figure>
```
