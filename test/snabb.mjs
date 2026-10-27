// Snabb rökning: öppna ett fall i iPhone-vy och ta skärmbilder. node test/snabb.mjs <fall-id> [prefix]
import { chromium } from 'playwright';
const id = process.argv[2] || 'halsbandet-pa-ekbacka', pre = process.argv[3] || 'snabb';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const fel = [];
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fel.push(m.type() + ': ' + m.text()); });
p.on('pageerror', (e) => fel.push('pageerror: ' + e.message));
await p.goto('http://localhost:18431/?nosw#/fall/' + id); await p.waitForTimeout(500);
await p.screenshot({ path: `shots/${pre}-intro.png` });
await p.click('#start'); await p.waitForTimeout(2500);
await p.screenshot({ path: `shots/${pre}-3d.png` });
console.log('fps', await p.evaluate(() => window.__fps));
console.log(fel.join('\n') || 'inga fel');
await b.close();
