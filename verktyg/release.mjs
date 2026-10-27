// Förbereder en release: listar alla filer som service workern ska cacha och höjer cacheversionen,
// så att iPhone (hemskärms-PWA) hämtar den nya versionen. Kör: node verktyg/release.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const rot = new URL('..', import.meta.url).pathname;
const lista = (dir, filter) => {
  const ut = [];
  const gå = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) gå(p); else if (filter.test(n)) ut.push('./' + relative(rot, p)); } };
  gå(join(rot, dir));
  return ut.sort();
};
const sw0 = readFileSync(join(rot, 'sw.js'), 'utf8');
const v0 = +(/detektiv-v(\d+)/.exec(sw0)?.[1] || 1);
writeFileSync(join(rot, 'js/version.js'), `// Skrivs av verktyg/release.mjs\nexport const VERSION = ${v0 + 1};\n`);
const filer = ['./', './index.html', './manifest.webmanifest', ...lista('css', /\.css$/), ...lista('js', /\.js$/),
  './vendor/three/three.module.min.js', ...lista('fall', /\.json$/), ...lista('bilder', /\.(jpg|png|webp)$/), ...lista('ikoner', /\.png$/)];
const sw = readFileSync(join(rot, 'sw.js'), 'utf8');
const gammal = +(/detektiv-v(\d+)/.exec(sw)?.[1] || 1);
const ny = sw
  .replace(/const VERSION = 'detektiv-v\d+';/, `const VERSION = 'detektiv-v${gammal + 1}';`)
  .replace(/const FILER = \[[\s\S]*?\];/, `const FILER = [\n${filer.map((f) => `  '${f}',`).join('\n')}\n];`);
writeFileSync(join(rot, 'sw.js'), ny);
console.log(`sw.js: detektiv-v${gammal} → detektiv-v${gammal + 1}, ${filer.length} filer`);
