import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { screenshot, vibe, css } = req.body ?? {};
  if (!screenshot || !vibe) {
    return res.status(400).json({ error: 'Missing screenshot or vibe' });
  }

  // Decode base64 image (data URI → Buffer)
  const matches = screenshot.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) return res.status(400).json({ error: 'Invalid image format' });
  const [, mimeType, base64Data] = matches;
  const ext = mimeType.split('/')[1] || 'png';
  const imageBuffer = Buffer.from(base64Data, 'base64');

  const id        = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const imagePath = `gallery/${id}.${ext}`;
  const metaPath  = `gallery/${id}.json`;

  try {
    const { url: imageUrl } = await put(imagePath, imageBuffer, {
      access: 'public',
      contentType: mimeType,
    });

    const meta = { id, vibe, imageUrl, css, timestamp: Date.now() };
    await put(metaPath, JSON.stringify(meta), {
      access: 'public',
      contentType: 'application/json',
    });

    res.status(200).json({ id, imageUrl });
  } catch (err) {
    console.error('Share upload error:', err);
    const msg = err.message || '';
    if (msg.includes('private store') || msg.includes('public access')) {
      return res.status(500).json({
        error: 'Blob store is set to private. In your Vercel dashboard, delete the current Blob store and create a new one with "Public" access.',
      });
    }
    res.status(500).json({ error: 'Upload failed' });
  }
}
