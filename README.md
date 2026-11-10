# Detektiv

Ett pusselspel med logik, observation och deduktion i klassisk deckarmiljö i stil med Agatha Christie och Sherlock Holmes. Spelet görs för vuxna. Varje fall utreds i en **gåbar 3D-miljö i förstapersonsvy**: du går runt, undersöker föremål, samlar fynd i anteckningsboken och pekar till sist ut den skyldige.

**Spela:** https://9w9wt9yj98-cpu.github.io/Detektiv/ (fungerar i mobilen och kan läggas på hemskärmen)

**Status:** Sex spelbara fall: 1 *Halsbandet på Ekbacka* (scenundersökning), 2 *Nattåget mot Narvik* (förhör), 3 *Middagen på Solgläntan* (logikrutnät), 4 *Brudskålen* (bildjämförelse), 5 *Kvart i elva* (tidslinje med gångtider) och 6 *Fyren på Gråskär* (dokumentanalys, opålitlig berättare).

## Så spelar du

- **Mobil:** dra med vänster tumme för att gå, dra på höger sida för att se dig omkring, tryck på föremål med utropstecken (de syns när du kommer nära).
- **Dator:** W A S D eller piltangenterna för att gå, dra med musen för att titta, klicka för att undersöka.
- **Anteckningsboken** ligger i rummet. Gå fram och tryck på den för att läsa fynd, koppla fynd till personer, lösa deduktionstavlan, ta ledtrådar och anklaga.
- **Fastnat?** Lampan ger först ett gratis tips om nästa steg, sedan tre ledtrådar (−10/−25/−50 poäng) och sist lösningen. Står du still i fyra minuter börjar lampan glöda. Två felaktiga anklagelser (−30 poäng vardera) innan upplösningen visas. Betyg 1–3 förstoringsglas. Allt sparas i webbläsaren.

## Teknik

- Vanlig HTML, CSS och JavaScript-moduler **utan byggsteg**. Det är en medveten avvikelse från designförslagets Vite/TypeScript, så att GitHub Pages kan servera repot direkt.
- 3D med [three.js](https://threejs.org/) r186, **vendrat lokalt** i `vendor/three/` (inget CDN), laddat via en import map.
- Ingen backend. Progression och poäng sparas i `localStorage`. PWA med `manifest.webmanifest` och `sw.js`.
- Kör lokalt med valfri statisk server, till exempel `python3 -m http.server` i repots rot, och öppna `http://localhost:8000/`.

## Struktur

| Sökväg | Innehåll |
|---|---|
| `fall/index.json` | Fallregistret (kapitel och ordning). Nya fall läggs till här – ingen kod behöver ändras. Ett kapitel kan ha `lases_upp_av_rang`; det öppnas när kapitlet före är avslutat eller när spelaren når rangen. |
| `fall/*.json` | Ett fall per fil enligt schemat i designförslaget, med 3D-rummen i `moment[].payload.rum`. |
| `js/motor/` | Laddning av fall, sparning, poäng och en generisk lösare för logikrutnät. |
| `js/tre/` | 3D-motorn: rum från JSON (`motor3d.js`), canvastexturer och kontroller. |
| `js/tre/foremal/` | Föremålsbiblioteket, en fil per sort: `byggdelar`, `mobler`, `belysning`, `smasaker`, `personer`, `ute`. `grund.js` har registret, delade geometrier/material och färger. |
| `js/tre/modeller.js` | Förhandsgranskningen `?stil=verklig`: ersätter ett föremåls utseende med en glTF-modell ur `modeller/` (fältet `objekt.modell`). Källor och licenser i `modeller/KALLOR.md`. |
| `js/ljud.js` | Miljöljud och effekter, syntetiserade med Web Audio (inga ljudfiler). |
| `js/vyer/` | Meny, presentation, utredning, anteckningsbok, anklagelse och upplösning. |
| `js/mekaniker/` | Mekanikerna i anteckningsboken: logikrutnät (`logikrutnat.js`), förhör/dokument (`jamfor.js`), bildjämförelse (`bildjamforelse.js`) och tidslinje (`tidslinje.js`). |
| `verktyg/fall/*.py` | Källor för fall 2 och senare – genererar `fall/*.json`. Ändra i `.py`-filen och kör den; ändras bara JSON-filen skrivs ändringen över nästa gång. Fall 1 och 3 saknar källa och redigeras direkt i JSON. |
| `verktyg/` | `validera_fall.mjs` (validerar alla fall, bevisar att rutnät har exakt en lösning och att varje ledtråd behövs), `release.mjs` (service workerns cacheversion och fillista) och `verifiera_fall3.py`. |
| `verktyg/spelarvy.mjs` | Spelarvy för blindtest: `node verktyg/spelarvy.mjs <fall-id>` skriver allt spelaren kan se i ett fall, utan facit (lösning, rätta svar, motsägelser, ledtrådar, villospårsmärkning); `--slutsatser` ger slutsatsfrågorna utan svar och `--ledtradar` ledtrådarna i lampan. |
| `test/spela.mjs` | Playwright-test som spelar alla fall (rätt och fel väg) i iPhone-vy och på dator. |

## Fallformatet – tillägg till schemat

Utöver fälten i [designförslaget](docs/forslag-v1.md#13-dataformat-för-fall-json):

- `moment[].payload.visning: "3d"` och `rum` med `bredd`, `djup`, `hojd`, `miljo` (`inomhus`/`veranda`), `golv`, `tapet`, `panel`, `ljus`, `start` (`pos: [x, z]`, `titta` i grader, 0 = norr) och `objekt`.
- Varje objekt har `typ` (se `js/tre/foremal/`: bl.a. `dorr`, `fonster`, `byra`, `skrin`, `eldstad`, `bokhylla`, `stol`, `langbord`, `vinglas`, `anteckningsbok`), `pos: [x, y, z]`, `rot`, samt valfritt `interaktiv: { namn, text, ger_fynd }`, `gar_till` (dörr till ett annat moment) och `funktion: "anteckningsbok"`.
- `golv` är en färg (trägolv) eller `{ "typ": "sten" | "jarn" | "sno" }`. `sno` ger snötäckt mark; på den kan man lägga `trampad_sno` (nertrampad fläck med stövelavtryck) och `snodriva` (en låg hög, t.ex. innanför ett uppbrutet fönster).
- En `person` kan ha `spjalk: "v"` eller `"h"` (spjälat ben). En `stege` med `topp: true` är stegens övre ände, med en lucka i golvet.
- Fler föremål: `regnmaskin` och `stolpe` (teatern), `kaffekopp`, `kaffekanna` och `tidning` (dukade bord), `dacksstol` (fartygsdäck).
- En `tavla` visar en målning; med `motiv: "portratt"` ett oljeporträtt och med `motiv: "foto"` ett inramat gruppfotografi.
- Rummet kan också ha `miljo: "ute"` (gård med gräs och himmel), `vagg` (`tapet`, `puts`, `sten`, `trapanel`, `fasad`), `tak: false`, `panel: false` och `sno` (snöfall).
- `rum.ljud`: miljöljud, t.ex. `["tag", {"typ": "vind", "styrka": 0.6}]`. Typer: `vind`, `storm`, `tag`, `tick`, `brasa`, `dropp`, `hav`, `faglar`, `syrsor` (se `js/ljud.js`; validatorn kontrollerar namnen).
- `objekt.modell` (valfritt, bara i förhandsgranskningen `?stil=verklig`): en 3D-modell som ersätter prefabens utseende, t.ex. `{ "fil": "modeller/gothic_bed_01.glb", "passa": "golv" }`. Se `js/tre/modeller.js`.
- `moment[].last_upp_av` (fynd som krävs) och `last_text` (vad spelaren får höra innan dess).
- `logikrutnat`-payload: `kategorier`, `grannar`, `ledtradar` med maskinläsbara `regler` (`samma`, `inte_samma`, `en_av`, `bredvid`, `inte_bredvid`, `mellan`), `losning` och `ger_fynd_nar_lost`.
- `anklagelse` (hur/när-alternativ, max antal bevis), `losning.hur`, `losning.uteslutningar_text`, `fynd[].titel/ikon/forklaring` och `aterkoppling.forklaring_steg` som objekt `{ text, fynd }`.

## Testa

Första gången: `npm install` och `npx playwright install chromium`.

```sh
npm run validera                        # validerar fallen och kontrollerar fillistan i sw.js
npm test                                # samma sak + spelar alla fall (ca 9 min); skärmbilder hamnar i shots/
node test/spela.mjs fall1               # bara ett fall (fall1, fall2, fall3 …)
STIL=verklig TIDSFAKTOR=6 node test/spela.mjs fall1  # samma test i förhandsgranskningen ?stil=verklig (längre tidsgränser utan grafikkort)
node test/framkomlighet.mjs             # går det att gå fram till varje dörr och föremål i alla rum?
node test/rundtur.mjs <fall-id> <prefix> # skärmbilder från alla 3D-rum (kräver en server, t.ex. python3 -m http.server 18431)
npm run release                         # före varje release: höjer service workerns cacheversion
```

`test/spela.mjs` startar en egen server på port 18431 om ingen redan svarar där.

## Dokument

- 📄 [Designförslag v1](docs/forslag-v1.md)
- ✅ [Beslut och avvikelser](docs/beslut.md)
- 🕵️ Blindtest av alla fall, november 2026: [första](docs/blindtest/rapport-2026-11-04.md) och [andra granskningen](docs/blindtest/rapport-2026-11-04-andra.md)

## Projektledare

Martin Morén
