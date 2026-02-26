# Elliott Rosenberg — Portfolio

Static HTML/CSS/JS site. No build tools, no framework, no dependencies.

---

## File Structure

```
elliott-rosenberg/
├── index.html                  ← Home page
├── work/
│   ├── sedum-lamp.html         ← Case study 01 (complete)
│   ├── waiting-magazine.html   ← Case study 02 (stub)
│   ├── perennial.html          ← Case study 03 (stub)
│   └── subscription-ux.html   ← Case study 04 (stub)
├── assets/
│   ├── style.css               ← Global tokens, cursor, footer, popup
│   ├── home.css                ← Home page styles
│   ├── case-study.css          ← Shared case study styles
│   ├── main.js                 ← Cursor, theme toggle, popup logic
│   ├── fonts/                  ← Drop GT America woff2 files here
│   └── images/                 ← Project photos go here
└── README.md
```

---

## Step 1: Font

**Option A — Adobe Fonts (recommended)**
1. Go to fonts.adobe.com and search GT America
2. Create a web project and add GT America Regular + Light
3. Copy the kit `<link>` tag
4. In each HTML file, uncomment the Adobe Fonts line in `<head>` and replace `YOUR_KIT_ID`

**Option B — Self-host (if you have a desktop license)**
1. Export GT America Regular and Light as woff2 from FontSquirrel or your license
2. Drop files into `/assets/fonts/`
3. Uncomment the `@font-face` block at the top of `style.css`

---

## Step 2: Fill in your links

In every HTML file, replace:
- `YOUR_HANDLE` in the LinkedIn, Instagram, Are.na footer links
- `YOUR_SUBSTACK` in the Substack footer link

---

## Step 3: Form backend

1. Sign up at formspree.io (free tier is fine)
2. Create a new form, copy your form ID
3. In `index.html`, replace `YOUR_FORM_ID` in the form action:
   `action="https://formspree.io/f/YOUR_FORM_ID"`

---

## Step 4: Run locally

No build step needed. Just open with a local server so the `/assets/` paths resolve.

**With VS Code:** Install the Live Server extension, right-click `index.html`, Open with Live Server.

**With terminal:**
```bash
cd elliott-rosenberg
npx serve .
# or
python3 -m http.server 8080
```

Then open http://localhost:8080

---

## Step 5: Write the case studies

The stub pages (`waiting-magazine.html`, `perennial.html`, `subscription-ux.html`) follow the same structure as `sedum-lamp.html`. For each one:

1. Replace the title, index, year, role, and scope tags in the header
2. Add your SVG line drawing in the `.cs-drawing` block
3. Fill in the four sections: Overview, Problem, Process, Outcome
4. Replace `.img-placeholder` divs with real `<img>` tags pointing to `/assets/images/`
5. Update the `.next-project` link at the bottom

---

## Step 6: Images

Name your images descriptively and drop them in `/assets/images/`. Replace each placeholder like this:

```html
<!-- Before -->
<div class="img-placeholder" style="aspect-ratio: 3/2;">
  <span class="img-placeholder-label">Final product photograph</span>
</div>

<!-- After -->
<img src="/assets/images/sedum-lamp-final.jpg" alt="Sedum Table Lamp, edition of twelve, 2023"/>
```

Recommended: export all photos as jpg at 2x the display size, then run them through squoosh.app and save as webp for performance.

---

## Step 7: Deploy

**Vercel (recommended)**
1. Push the folder to a GitHub repo
2. Go to vercel.com, import the repo
3. Deploy — it will detect static HTML automatically
4. Add your custom domain in Vercel's dashboard, then point your DNS:
   - Add a CNAME record: `www` → `cname.vercel-dns.com`
   - Add an A record: `@` → `76.76.21.21`

**Netlify (alternative)**
1. Drag the project folder onto netlify.com/drop
2. Get a live URL instantly
3. Connect a GitHub repo for automatic deploys on push

---

## Claude Code tips

When working with Claude Code in Cursor, useful prompts:

- "Add a photo at the top of the process section in sedum-lamp.html, full width, with a caption below"
- "The case study body text feels too small on mobile, adjust the clamp values in case-study.css"
- "Write the Overview and Problem sections for waiting-magazine.html based on this context: [paste your notes]"
- "Add an og:image meta tag to each HTML file pointing to /assets/images/og-preview.jpg"

---

## What's already done

- Light and dark mode with localStorage persistence (no flash on load)
- Custom cursor: dot at rest, vertical line on hover, compresses on click
- Contact popup slides up from bottom, closes on overlay click or Escape key
- Theme preference persists across all pages
- All responsive breakpoints handled
- SVG line drawings for all four projects
- Full case study template with callout quote style and image grid

---

## What's left

- [ ] Add GT America font
- [ ] Fill in social links
- [ ] Connect Formspree form
- [ ] Write 3 remaining case studies
- [ ] Swap placeholder divs for real photos
- [ ] Add favicon (32x32 png, drop in root, add `<link rel="icon">` to each `<head>`)
- [ ] Deploy to Vercel + connect domain
