import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../lib/redesign-prompt.mjs';

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }

  let vibe;
  try {
    const body = await readBody(req);
    vibe = String(body.vibe ?? '').trim().slice(0, 300);
  } catch {
    res.statusCode = 400;
    return res.end('Bad request');
  }
  if (!vibe) {
    res.statusCode = 400;
    return res.end('Give me a vibe');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Accel-Buffering', 'no');

  const client = new Anthropic();
  try {
    const stream = client.messages.stream({
      model: 'claude-opus-5',
      max_tokens: 16000,
      output_config: { effort: 'medium' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Vibe: ${vibe}` }],
    });
    stream.on('text', (text) => res.write(text));
    await stream.finalMessage();
    res.end();
  } catch (err) {
    console.error('redesign error:', err?.message ?? err);
    if (!res.headersSent) res.statusCode = 500;
    res.end('\n/* The redesign engine hit an error. Try again. */');
  }
}
