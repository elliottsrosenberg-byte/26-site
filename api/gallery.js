import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const blobToken = process.env.PUBBLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
    const { blobs } = await list({ prefix: 'gallery/', token: blobToken });

    // Only process JSON metadata files
    const metaBlobs = blobs.filter(b => b.pathname.endsWith('.json'));

    const entries = await Promise.all(
      metaBlobs.map(async (blob) => {
        try {
          const r = await fetch(blob.url);
          return await r.json();
        } catch {
          return null;
        }
      })
    );

    // Deduplicate by ID — keep highest-likes version (put() creates new blob each time)
    const byId = new Map();
    for (const entry of entries.filter(Boolean)) {
      const existing = byId.get(entry.id);
      if (!existing || (entry.likes || 0) >= (existing.likes || 0)) {
        byId.set(entry.id, entry);
      }
    }

    const sorted = [...byId.values()].sort((a, b) => {
      const likesDiff = (b.likes || 0) - (a.likes || 0);
      return likesDiff !== 0 ? likesDiff : b.timestamp - a.timestamp;
    });

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    res.status(200).json(sorted);
  } catch (err) {
    console.error('Gallery fetch error:', err);
    res.status(500).json({ error: 'Could not load gallery' });
  }
}
