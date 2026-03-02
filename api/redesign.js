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
          // Prefill forces the model to begin outputting CSS immediately —
          // no preamble, no markdown fences, correct delimiter guaranteed.
          { role: 'assistant', content: '===CSS===' },
        ],
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
  // The model continues from the prefilled "===CSS===", so restore it before parsing.
  const raw = '===CSS===\n' + (data.content?.[0]?.text ?? '');

  console.log('Claude raw response:\n', raw.slice(0, 500));

  // Flexible whitespace around delimiter words handles any spacing variation.
  const cssMatch = raw.match(/===\s*CSS\s*===\s*([\s\S]*?)\s*===\s*ENDCSS\s*===/);
  const jsMatch  = raw.match(/===\s*JS\s*===\s*([\s\S]*?)\s*===\s*ENDJS\s*===/);

  let css = cssMatch?.[1]?.trim() ?? '';
  const js  = jsMatch?.[1]?.trim()  ?? '';

  // Fallback: if ===ENDCSS=== is missing (response truncated), grab everything
  // up to the JS section so we still get usable CSS.
  if (!css) {
    const cssStart = raw.indexOf('===CSS===');
    const jsStart  = raw.indexOf('===JS===');
    if (cssStart !== -1 && jsStart > cssStart) {
      css = raw.slice(cssStart + '===CSS==='.length, jsStart).trim();
    } else if (cssStart !== -1) {
      css = raw.slice(cssStart + '===CSS==='.length).trim();
    }
  }

  if (!css) {
    console.error('No CSS found in Claude response. Raw:', raw);
    return res.status(500).json({ error: 'Claude did not return CSS in expected format' });
  }

  res.status(200).json({ css, js });
}
