// Förbereder en release: listar alla filer som service workern ska cacha och höjer cacheversionen,
// så att iPhone (hemskärms-PWA) hämtar den nya versionen.
//   node verktyg/release.mjs               höjer versionen och skriver om sw.js och js/version.js
//   node verktyg/release.mjs --kontrollera  ändrar ingenting; misslyckas om fillistan i sw.js inte
//                                           stämmer med filerna i repot eller versionerna skiljer sig åt
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const rot = new URL('..', import.meta.url).pathname;
const lista = (dir, filter) => {
  const ut = [];
  const ga = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) ga(p); else if (filter.test(n)) ut.push('./' + relative(rot, p)); } };
  ga(join(rot, dir));
  return ut.sort();
};
const filer = ['./', './index.html', './manifest.webmanifest', ...lista('css', /\.css$/), ...lista('js', /\.js$/),
  './vendor/three/three.module.min.js', ...lista('fall', /\.json$/), ...lista('bilder', /\.(jpg|png|webp)$/), ...lista('ikoner', /\.png$/)];

const sw = readFileSync(join(rot, 'sw.js'), 'utf8');
const version = +(/detektiv-v(\d+)/.exec(sw)?.[1] || 1);

if (process.argv.includes('--kontrollera')) {
  const iSw = [...(/const FILER = \[([\s\S]*?)\];/.exec(sw)?.[1] || '').matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const saknas = filer.filter((f) => !iSw.includes(f));
  const finnsInte = iSw.filter((f) => !filer.includes(f));
  const visad = +(/VERSION = (\d+)/.exec(readFileSync(join(rot, 'js/version.js'), 'utf8'))?.[1] || 0);
  const fel = [];
  if (saknas.length) fel.push(`Saknas i sw.js: ${saknas.join(', ')}`);
  if (finnsInte.length) fel.push(`Finns i sw.js men inte i repot (då misslyckas hela offline-cachen): ${finnsInte.join(', ')}`);
  if (visad !== version) fel.push(`js/version.js säger ${visad} men sw.js säger detektiv-v${version}`);
  if (fel.length) { console.log('✗ ' + fel.join('\n✗ ') + '\nKör node verktyg/release.mjs'); process.exit(1); }
  console.log(`sw.js stämmer: detektiv-v${version}, ${filer.length} filer ✓`);
  process.exit(0);
}

const ny = sw
  .replace(/const VERSION = 'detektiv-v\d+';/, `const VERSION = 'detektiv-v${version + 1}';`)
  .replace(/const FILER = \[[\s\S]*?\];/, `const FILER = [\n${filer.map((f) => `  '${f}',`).join('\n')}\n];`);
writeFileSync(join(rot, 'sw.js'), ny);
writeFileSync(join(rot, 'js/version.js'), `// Skrivs av verktyg/release.mjs\nexport const VERSION = ${version + 1};\n`);
console.log(`sw.js: detektiv-v${version} → detektiv-v${version + 1}, ${filer.length} filer`);
