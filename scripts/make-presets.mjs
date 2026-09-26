// Pre-renders the console's quick-start chips so they apply instantly:
// `node --env-file=.env.local scripts/make-presets.mjs [slug ...]`
// Same prompt and model as /api/redesign; writes public/presets/<slug>.css.
import Anthropic from '@anthropic-ai/sdk';
import { mkdir, writeFile } from 'node:fs/promises';
import { SYSTEM_PROMPT } from '../lib/redesign-prompt.mjs';

export const PRESETS = {
  'b2b-saas': 'B2B SaaS',
  'lo-fi-computer': 'lo-fi computer',
  y2k: 'y2k',
  emo: 'emo',
};

const only = process.argv.slice(2);
const client = new Anthropic();
await mkdir('public/presets', { recursive: true });

await Promise.all(
  Object.entries(PRESETS)
    .filter(([slug]) => !only.length || only.includes(slug))
    .map(async ([slug, vibe]) => {
      const stream = client.messages.stream({
        model: 'claude-opus-5',
        max_tokens: 16000,
        output_config: { effort: 'medium' },
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Vibe: ${vibe}` }],
      });
      const msg = await stream.finalMessage();
      const css = msg.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .replace(/^\s*```(?:css)?\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();
      await writeFile(`public/presets/${slug}.css`, css + '\n');
      console.log(`${slug}: ${(css.length / 1024).toFixed(1)}kb (${msg.stop_reason})`);
    }),
);
