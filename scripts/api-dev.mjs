// Local stand-in for the Vercel function: `node scripts/api-dev.mjs`
// serves /api/redesign on :8787; astro dev proxies /api there.
import http from 'node:http';
import handler from '../api/redesign.mjs';

http
  .createServer((req, res) => {
    if (req.url?.startsWith('/api/redesign')) return handler(req, res);
    res.statusCode = 404;
    res.end('not found');
  })
  .listen(8787, () => console.log('api-dev on http://localhost:8787'));
