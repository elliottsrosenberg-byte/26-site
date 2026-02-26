import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { blobs } = await list({ prefix: 'gallery/', token: process.env.BLOB_READ_WRITE_TOKEN });

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

    const sorted = entries
      .filter(Boolean)
      .sort((a, b) => b.timestamp - a.timestamp);

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    res.status(200).json(sorted);
  } catch (err) {
    console.error('Gallery fetch error:', err);
    res.status(500).json({ error: 'Could not load gallery' });
  }
}
