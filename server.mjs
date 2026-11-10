import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
};
const files = new Set([
  '/index.html', '/src/app.js', '/src/data.js', '/src/styles.css',
  '/assets/toner.svg', '/assets/cream.svg', '/assets/skin.svg',
]);
const port = Number(process.env.PORT ?? 4173);

createServer(async (req, res) => {
  const path = (req.url ?? '/').split('?')[0];
  const file = path === '/' ? '/index.html' : path;
  const headers = { 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' };
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }).end();
    return;
  }
  if (!files.has(file)) {
    res.writeHead(404, headers).end();
    return;
  }
  try {
    const body = await readFile(new URL('.' + file, import.meta.url));
    res.writeHead(200, { ...headers, 'Content-Type': types[extname(file)] })
      .end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500, headers).end();
  }
}).listen(port, '127.0.0.1', function () {
  console.log('护肤内容工作台：http://127.0.0.1:' + this.address().port);
});
