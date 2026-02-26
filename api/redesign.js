export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'No prompt' });

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const systemPrompt = `You are a CSS designer and creative coder. A visitor to a designer's portfolio wants to redesign the site based on a vibe or aesthetic. Translate their description into CSS overrides and optionally JavaScript for interactivity.

Return your response in EXACTLY this format — no other text before or after:

===CSS===
[your CSS here]
===ENDCSS===

===JS===
[your JavaScript here, or leave this section empty]
===ENDJS===

The site's key CSS custom properties:
  --bg (background), --ink (primary text), --mid (secondary/muted text)
  --border (dividers/borders), --accent (hover/highlight), --font (font stack)
  --pad-x (horizontal padding, currently 72px), --pad-top (top padding, currently 80px)

Home page classes you can target:
  .page, .intro, .intro-left, .intro-right, .intro-headline,
  .bio-text, .contact-line, .work-section, .section-label, .work-list,
  .work-item, .work-image, .work-item-footer, .work-item-text, .work-title,
  .work-desc, .work-tags, .tag, footer, .footer-nav

Case study classes you can target:
  .top-nav, .back-link, .cs-header, .cs-title, .cs-meta-row,
  .meta-label, .meta-value, .cs-section, .cs-section-label, .cs-section-body,
  .callout, .img-2up, .next-project

Contact popup classes you can target:
  .popup-overlay, .popup-card, .popup-title, .popup-sub, .popup-form,
  .popup-form input, .popup-form textarea, .popup-actions,
  .btn-submit, .btn-close, .contact-trigger

CSS rules:
- Do not set display:none on any element
- You may @import Google Fonts at the top of the CSS section
- Override :root custom properties first, then add component-specific overrides
- Be creative and bold — the user is describing a feeling, not a spec
- You may use position, transform, grid/flex overrides to reshape the layout entirely
- You may use ::before/::after pseudo-elements freely for decorative content

For wild or chaotic vibes (volcano, LEGO, glitch, horror, party), fully commit —
overlapping elements, aggressive transforms, emoji in ::before/::after, noise
textures, rotating text, random positioning via nth-child, all fair game.
Legibility can yield to the vibe when the vibe demands it.

JS guidelines (optional — only include if it genuinely elevates the vibe):
- cursor trails, text scramble/glitch, scroll effects, particle systems, layout chaos, color cycling, hover physics
- Write self-contained code; avoid document.write(); use requestAnimationFrame for animations
- Attach cleanup to window.__aiCleanup = [fn1, fn2, ...] so reset can stop animations/listeners`;

  let claudeResponse;
  try {
    claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 6000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Redesign vibe: "${prompt}"` }],
      }),
    });
  } catch (err) {
    console.error('Network error calling Claude:', err);
    return res.status(502).json({ error: 'Could not reach Claude API' });
  }

  if (!claudeResponse.ok) {
    const err = await claudeResponse.text();
    console.error('Claude API error:', claudeResponse.status, err);
    return res.status(502).json({ error: `Claude API returned ${claudeResponse.status}` });
  }

  const data = await claudeResponse.json();
  const raw = data.content?.[0]?.text ?? '';

  console.log('Claude raw response:\n', raw.slice(0, 500));

  // Parse delimiter format — robust against any characters inside CSS/JS
  const cssMatch = raw.match(/===CSS===\n?([\s\S]*?)\n?===ENDCSS===/);
  const jsMatch  = raw.match(/===JS===\n?([\s\S]*?)\n?===ENDJS===/);

  const css = cssMatch?.[1]?.trim() ?? '';
  const js  = jsMatch?.[1]?.trim()  ?? '';

  if (!css) {
    console.error('No CSS found in Claude response. Raw:', raw);
    return res.status(500).json({ error: 'Claude did not return CSS in expected format' });
  }

  res.status(200).json({ css, js });
}
