// Liten statisk server för testerna, så att man inte behöver starta en egen.
// Startas bara om ingen server svarar på BAS (t.ex. python3 -m http.server 18431).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROT = new URL('..', import.meta.url).pathname;
const TYPER = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

/** Returnerar en funktion som stänger servern (eller ingenting, om en server redan svarade). */
export async function sakerstallServer(bas) {
  try { const r = await fetch(bas, { signal: AbortSignal.timeout(1500) }); if (r.ok) return () => {}; } catch { /* ingen server – starta en */ }
  const url = new URL(bas);
  if (!['localhost', '127.0.0.1'].includes(url.hostname)) throw new Error(`Ingen server svarar på ${bas}`);
  const server = createServer(async (req, res) => {
    let sokvag = decodeURIComponent(new URL(req.url, bas).pathname);
    if (sokvag.endsWith('/')) sokvag += 'index.html';
    const fil = normalize(join(ROT, sokvag));
    if (!fil.startsWith(ROT)) { res.writeHead(403).end(); return; }
    try {
      const data = await readFile(fil);
      res.writeHead(200, { 'Content-Type': TYPER[extname(fil)] || 'application/octet-stream' }).end(data);
    } catch { res.writeHead(404).end('Hittades inte'); }
  });
  await new Promise((ok, fel) => server.once('error', fel).listen(+url.port || 80, url.hostname, ok));
  console.log(`(startade testserver på ${bas})`);
  return () => new Promise((ok) => server.close(ok));
}
