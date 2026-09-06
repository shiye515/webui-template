import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import os from 'node:os';
import { extname, resolve } from 'node:path';

const app = new Hono();
const api = app.basePath('/api');
const port = Number(process.env.PORT ?? 8872);
const appName = process.env.APP_NAME || 'yourcli';
const appDataDir = process.env.APP_DATA_DIR || resolve(
  process.cwd().includes('node_modules') ? os.homedir() : process.cwd(),
  `.${appName}`
);

mkdirSync(appDataDir, { recursive: true });
const staticRoot = resolve(process.cwd(), 'dist', 'web');

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

api.get('/health', (c) =>
  c.json({
    ok: true,
    service: 'hono',
    port,
    appName,
    dataDir: appDataDir,
    message: 'WebUI template is running.',
    timestamp: new Date().toISOString()
  })
);

api.get('/status', (c) =>
  c.json({
    ok: true,
    mode: 'hono',
    port,
    platform: process.platform,
    nodeVersion: process.version
  })
);

app.get('*', (c) => {
  const pathname = new URL(c.req.url).pathname;
  if (!existsSync(staticRoot)) {
    return c.notFound();
  }

  const target = pathname === '/' ? '/index.html' : pathname;
  const filePath = resolve(staticRoot, `.${target}`);

  if (filePath.startsWith(staticRoot) && existsSync(filePath) && statSync(filePath).isFile()) {
    const buffer = readFileSync(filePath);
    return new Response(buffer, {
      headers: {
        'Content-Type': mimeTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
        'Cache-Control': 'no-store'
      }
    });
  }

  const indexPath = resolve(staticRoot, 'index.html');
  if (existsSync(indexPath)) {
    return new Response(readFileSync(indexPath), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  }

  return c.notFound();
});

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Hono server listening on http://localhost:${info.port}`);
  console.log(`App data directory: ${appDataDir}`);
});
