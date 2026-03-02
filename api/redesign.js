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
