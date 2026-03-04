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
        max_tokens: 4000,
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

  const body = await claudeResponse.json();
  const fullText = body.content?.[0]?.text ?? '';

  console.log('Claude response (first 500):\n', fullText.slice(0, 500));

  const cssMatch = fullText.match(/===\s*CSS\s*===\s*([\s\S]*?)\s*===\s*ENDCSS\s*===/);
  const jsMatch  = fullText.match(/===\s*JS\s*===\s*([\s\S]*?)\s*===\s*ENDJS\s*===/);

  let css = cssMatch?.[1]?.trim() ?? '';
  const js  = jsMatch?.[1]?.trim()  ?? '';

  // Fallback 1: strip any preamble Claude added before the delimiter.
  if (!css) {
    const stripped = fullText.replace(/^[\s\S]*?(===\s*CSS\s*===)/, '$1');
    css = stripped.match(/===\s*CSS\s*===\s*([\s\S]*?)\s*===\s*ENDCSS\s*===/)?.[1]?.trim() ?? '';
  }

  // Fallback 2: ENDCSS missing (truncated response) — grab up to the JS block.
  if (!css) {
    const cssStart = fullText.search(/===\s*CSS\s*===/);
    const jsStart  = fullText.search(/===\s*JS\s*===/);
    if (cssStart !== -1 && jsStart > cssStart) {
      css = fullText.slice(cssStart).replace(/^===\s*CSS\s*===\s*/, '').slice(0, jsStart - cssStart).trim();
    } else if (cssStart !== -1) {
      css = fullText.slice(cssStart).replace(/^===\s*CSS\s*===\s*/, '').trim();
    }
  }

  if (!css) {
    console.error('No CSS found in Claude response. Raw:', fullText.slice(0, 500));
    return res.status(502).json({ error: 'Claude did not return CSS in expected format' });
  }

  return res.status(200).json({ css, js });
}
