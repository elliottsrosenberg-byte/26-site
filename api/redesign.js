import { systemPrompt } from '../lib/prompt.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt?.trim()) return res.status(400).json({ error: 'No prompt' });

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured' });
  }

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
        max_tokens: 8000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `Redesign vibe: "${prompt}"` },
        ],
      }),
    });
  } catch (err) {
    console.error('Network error calling Claude:', err);
    return res.status(502).json({ error: 'Could not reach Claude API' });
  }

  if (!claudeResponse.ok) {
    const errText = await claudeResponse.text();
    let detail = '';
    try { detail = JSON.parse(errText)?.error?.message ?? ''; } catch {}
    console.error('Claude API error:', claudeResponse.status, errText);
    return res.status(502).json({ error: detail || `Claude API returned ${claudeResponse.status}` });
  }

  const data = await claudeResponse.json();
  const raw = data.content?.[0]?.text ?? '';

  console.log('Claude raw response:\n', raw.slice(0, 500));

  // Flexible whitespace around delimiter words handles any spacing variation.
  const cssMatch = raw.match(/===\s*CSS\s*===\s*([\s\S]*?)\s*===\s*ENDCSS\s*===/);
  const jsMatch  = raw.match(/===\s*JS\s*===\s*([\s\S]*?)\s*===\s*ENDJS\s*===/);

  let css = cssMatch?.[1]?.trim() ?? '';
  const js  = jsMatch?.[1]?.trim()  ?? '';

  // Fallback 1: strip any preamble Claude added before the delimiter.
  if (!css) {
    const stripped = raw.replace(/^[\s\S]*?(===\s*CSS\s*===)/, '$1');
    css = stripped.match(/===\s*CSS\s*===\s*([\s\S]*?)\s*===\s*ENDCSS\s*===/)?.[1]?.trim() ?? '';
  }

  // Fallback 2: ENDCSS missing (truncated response) — grab up to the JS block.
  if (!css) {
    const cssStart = raw.search(/===\s*CSS\s*===/);
    const jsStart  = raw.search(/===\s*JS\s*===/);
    if (cssStart !== -1 && jsStart > cssStart) {
      css = raw.slice(cssStart).replace(/^===\s*CSS\s*===\s*/, '').slice(0, jsStart - cssStart).trim();
    } else if (cssStart !== -1) {
      css = raw.slice(cssStart).replace(/^===\s*CSS\s*===\s*/, '').trim();
    }
  }

  if (!css) {
    console.error('No CSS found in Claude response. Raw:', raw);
    return res.status(500).json({ error: 'Claude did not return CSS in expected format' });
  }

  res.status(200).json({ css, js });
}
