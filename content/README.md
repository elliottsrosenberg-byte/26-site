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

The video-under-a-PNG-device-frame treatment from the planning session is not built yet; we design it together when the first real video asset exists.
