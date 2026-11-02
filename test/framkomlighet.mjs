// Framkomlighet: går det att GÅ fram till varje dörr och varje föremål som ska undersökas?
// De andra testerna flyttar spelaren direkt till föremålen; det här testet fyller i alla platser
// man kan nå från rummets startpunkt (samma kollisionskontroll som spelet) och kontrollerar att
// varje interaktivt föremål kan nås inom sitt undersökningsavstånd.
// Kör: node test/framkomlighet.mjs   (startar en egen server om ingen svarar på BAS)
import { startaWebblasare, BAS } from './hjalp.mjs';
import { sakerstallServer } from './server.mjs';

const stoppa = await sakerstallServer(BAS);
const b = await startaWebblasare();
const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => localStorage.setItem('detektiv:v1', JSON.stringify({ fall: {}, installningar: { handledningKlar: true, settBokBanner: true, ljud: false } })));
const index = await (await fetch(BAS + 'fall/index.json')).json();
let fel = 0;
try {
  for (const id of index.kapitel.flatMap((k) => k.fall.map((f) => f.id))) {
    const p = await ctx.newPage();
    await p.goto(BAS + '?nosw#/fall/' + id + '/utred');
    await p.waitForFunction(() => window.__detektiv?.motor);
    const resultat = await p.evaluate(() => {
      const d = window.__detektiv, m = d.motor, ut = [];
      for (const mom of d.f.moment.filter((x) => x.payload?.visning === '3d')) {
        d.byt(mom.id); m.pausa();
        const rum = mom.payload.rum, steg = 0.05;
        const W = rum.bredd / 2, D = rum.djup / 2;
        const nyckel = (i, j) => i + ',' + j;
        const [sx, sz] = rum.start.pos;
        const start = [Math.round(sx / steg), Math.round(sz / steg)];
        const nadd = new Set([nyckel(...start)]), ko = [start];
        if (m.kolliderar(sx, sz)) { ut.push(`${mom.id}: startpunkten (${sx}, ${sz}) ligger i ett hinder`); continue; }
        while (ko.length) {
          const [i, j] = ko.pop();
          for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const ni = i + di, nj = j + dj, k = nyckel(ni, nj);
            if (nadd.has(k) || Math.abs(ni * steg) > W || Math.abs(nj * steg) > D || m.kolliderar(ni * steg, nj * steg)) continue;
            nadd.add(k); ko.push([ni, nj]);
          }
        }
        const punkter = [...nadd].map((k) => k.split(',').map((v) => +v * steg));
        for (const [oid, post] of m.interaktiva) {
          // Man ska kunna gå fram till saker, inte bara nå dem på max avstånd över ett hinder.
          const c = post.halo.position, max = post.def.gar_till ? 1.5 : Math.min(2.2, m.maxAvstand(post.def));
          const narmast = Math.min(...punkter.map(([x, z]) => Math.hypot(x - c.x, z - c.z)));
          if (narmast > max) ut.push(`${mom.id}: ”${post.def.interaktiv?.namn || oid}” går inte att nå (närmast ${narmast.toFixed(2)} m, gräns ${max} m)`);
        }
      }
      return ut;
    });
    if (resultat.length) { fel += resultat.length; console.log(`✗ ${id}\n  ` + resultat.join('\n  ')); }
    else console.log(`${id}: alla dörrar och föremål går att gå fram till ✓`);
    await p.close();
  }
} finally { await b.close(); await stoppa(); }
process.exit(fel ? 1 : 0);
