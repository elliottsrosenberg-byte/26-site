export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'No prompt' });

  const systemPrompt = `You are a CSS designer and creative coder. A visitor to a designer's portfolio wants to redesign the site based on a vibe or aesthetic. Translate their description into CSS overrides and optionally JavaScript for interactivity.

Return a JSON object with two keys:
- "css": a string of raw CSS (no markdown fences, no comments) to inject into a <style> tag
- "js": a string of JavaScript (no markdown fences) to run in a <script> tag, or an empty string if no JS is needed

The site's key CSS custom properties:
  --bg (background), --ink (primary text), --mid (secondary/muted text)
  --border (dividers/borders), --accent (hover/highlight), --font (font stack)
  --pad-x (horizontal padding, currently 72px), --pad-top (top padding, currently 80px)

CSS rules:
- Keep all text legible (maintain sufficient contrast)
- Do not set display:none on any element
- You may @import Google Fonts at the top of the CSS string
- Override :root custom properties first, then add component-specific overrides
- Be creative and bold — the user is describing a feeling, not a spec

JS guidelines (optional — only include if it genuinely elevates the vibe):
- cursor trails, text scramble/glitch, scroll effects, particle systems, layout chaos, color cycling, hover physics
- Write self-contained code; avoid document.write(); use requestAnimationFrame for animations
- Clean up any event listeners or intervals by attaching them to window.__aiCleanup = [/* abort controllers, intervals, etc */] so reset can clear them
- The script runs after CSS injection, so DOM is available`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Redesign vibe: "${prompt}"` }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Claude API error:', err);
    return res.status(502).json({ error: 'Upstream API error' });
  }

  const data = await response.json();
  const raw = data.content?.[0]?.text ?? '';

  // Claude returns JSON — parse it, falling back to treating the whole thing as CSS
  let css = '';
  let js = '';
  try {
    // Strip markdown fences if Claude wrapped in ```json
    const cleaned = raw.replace(/^```[a-z]*\n?/gm, '').replace(/```$/gm, '').trim();
    const parsed = JSON.parse(cleaned);
    css = parsed.css ?? '';
    js = parsed.js ?? '';
  } catch {
    // Fallback: treat entire response as CSS
    css = raw;
  }

  res.status(200).json({ css, js });
}
