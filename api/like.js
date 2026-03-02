import { list, put, del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.body ?? {};
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const blobToken = process.env.PUBBLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

  try {
    const { blobs } = await list({ prefix: `gallery/${id}`, token: blobToken });
    const metaBlob = blobs.find(b => b.pathname.endsWith('.json'));
    if (!metaBlob) return res.status(404).json({ error: 'Entry not found' });

    const r = await fetch(metaBlob.url);
    if (!r.ok) return res.status(500).json({ error: 'Could not read entry' });

    const meta = await r.json();
    meta.likes = (meta.likes || 0) + 1;

    const oldUrl = metaBlob.url;
    const newBlob = await put(metaBlob.pathname, JSON.stringify(meta), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      token: blobToken,
    });

    // Delete the old blob if put created a new URL (prevents duplicate accumulation)
    if (newBlob.url !== oldUrl) {
      del(oldUrl, { token: blobToken }).catch(() => {});
    }

    res.status(200).json({ likes: meta.likes });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Failed to update likes' });
  }
}
