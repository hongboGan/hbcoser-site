// Zero-dependency static server for dist/ with SPA fallback.
// Used instead of `vite preview`, which needs esbuild and hits spawn EPERM here.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('dist');
const PORT = Number(process.argv[2] || 4173);
const HOST = '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(ROOT, url);

    // Keep every request inside dist/.
    if (!path.resolve(file).startsWith(ROOT)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    if (url.endsWith('/')) file = path.join(file, 'index.html');
    // Mirror Vercel's resolution: /blog is served from blog.html before any SPA
    // rewrite applies, so local checks see the prerendered page rather than the shell.
    let status = 200;
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const asHtml = `${file}.html`;
      if (fs.existsSync(asHtml) && fs.statSync(asHtml).isFile()) {
        file = asHtml;
      } else {
        // Vercel answers an unmatched path with 404.html and a real 404 status. A local
        // server that returns the home page with 200 hides that, and any check written
        // against it will pass here and fail in production.
        file = path.join(ROOT, '404.html');
        status = 404;
      }
    }

    const body = fs.readFileSync(file);
    res.writeHead(status, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  })
  .listen(PORT, HOST, () => console.log(`serving ${ROOT} at http://${HOST}:${PORT}`));
