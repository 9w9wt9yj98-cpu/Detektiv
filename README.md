# Detektiv

Ett pusselspel med logik, observation och deduktion i klassisk deckarmiljö i stil med Agatha Christie och Sherlock Holmes. Spelet görs för vuxna. Varje fall utreds i en **gåbar 3D-miljö i förstapersonsvy**: du går runt, undersöker föremål, samlar fynd i anteckningsboken och pekar till sist ut den skyldige.

**Spela:** https://9w9wt9yj98-cpu.github.io/Detektiv/ (fungerar i mobilen och kan läggas på hemskärmen)

**Status:** Fem spelbara fall: 1 *Halsbandet på Ekbacka* (scenundersökning), 2 *Nattåget mot Narvik* (förhör), 3 *Middagen på Solgläntan* (logikrutnät) 4 *Brudskålen* (bildjämförelse) och 5 *Kvart i elva* (tidslinje med gångtider).

## Så spelar du

- **Mobil:** dra med vänster tumme för att gå, dra på höger sida för att se dig omkring, tryck på föremål som glimmar.
- **Dator:** W A S D eller piltangenterna för att gå, dra med musen för att titta, klicka för att undersöka.
- **Anteckningsboken** ligger i rummet. Gå fram och tryck på den för att läsa fynd, koppla fynd till personer, lösa deduktionstavlan, ta ledtrådar och anklaga.
- Tre ledtrådar per fall (−10/−25/−50 poäng), två felaktiga anklagelser (−30 poäng vardera) innan upplösningen visas. Betyg 1–3 förstoringsglas. Allt sparas i webbläsaren.

## Teknik

- Vanlig HTML, CSS och JavaScript-moduler **utan byggsteg**. Det är en medveten avvikelse från designförslagets Vite/TypeScript, så att GitHub Pages kan servera repot direkt.
- 3D med [three.js](https://threejs.org/) r186, **vendrat lokalt** i `vendor/three/` (inget CDN), laddat via en import map.
- Ingen backend. Progression och poäng sparas i `localStorage`. PWA med `manifest.webmanifest` och `sw.js`.
- Kör lokalt med valfri statisk server, till exempel `python3 -m http.server` i repots rot, och öppna `http://localhost:8000/`.

## Struktur

| Sökväg | Innehåll |
|---|---|
| `fall/index.json` | Fallregistret (kapitel och ordning). Nya fall läggs till här – ingen kod behöver ändras. |
| `fall/*.json` | Ett fall per fil enligt schemat i designförslaget, med 3D-rummen i `moment[].payload.rum`. |
| `js/motor/` | Laddning av fall, sparning, poäng och en generisk lösare för logikrutnät. |
| `js/tre/` | 3D-motorn: rum från JSON, föremålsbibliotek (`prefabs.js` … `prefabs4.js`), canvastexturer och kontroller. |
| `js/vyer/` | Meny, presentation, utredning, anteckningsbok, anklagelse och upplösning. |
| `js/mekaniker/` | Mekanikerna i anteckningsboken: logikrutnät (`logikrutnat.js`), förhör/dokument (`jamfor.js`), bildjämförelse (`bildjamforelse.js`) och tidslinje (`tidslinje.js`). |
| `verktyg/fall/*.py` | Källor för fall 2 och senare – genererar `fall/*.json`. |
| `verktyg/` | `validera_fall.mjs` (validerar alla fall, bevisar att rutnät har exakt en lösning och att varje ledtråd behövs) och `verifiera_fall3.py`. |
| `test/spela.mjs` | Playwright-test som spelar båda fallen i iPhone-vy och på dator. |

## Fallformatet – tillägg till schemat

Utöver fälten i [designförslaget](docs/forslag-v1.md#13-dataformat-för-fall-json):

- `moment[].payload.visning: "3d"` och `rum` med `bredd`, `djup`, `hojd`, `miljo` (`inomhus`/`veranda`), `golv`, `tapet`, `panel`, `ljus`, `start` (`pos: [x, z]`, `titta` i grader, 0 = norr) och `objekt`.
- Varje objekt har `typ` (se `prefabs` i `js/tre/prefabs.js`: bl.a. `dorr`, `fonster`, `byra`, `skrin`, `eldstad`, `bokhylla`, `stol`, `langbord`, `vinglas`, `anteckningsbok`), `pos: [x, y, z]`, `rot`, samt valfritt `interaktiv: { namn, text, ger_fynd }`, `gar_till` (dörr till ett annat moment) och `funktion: "anteckningsbok"`.
- Rummet kan också ha `miljo: "ute"` (gård med gräs och himmel), `vagg` (`tapet`, `puts`, `sten`, `trapanel`, `fasad`), `tak: false`, `panel: false` och `sno` (snöfall).
- `moment[].last_upp_av` (fynd som krävs) och `last_text` (vad spelaren får höra innan dess).
- `logikrutnat`-payload: `kategorier`, `grannar`, `ledtradar` med maskinläsbara `regler` (`samma`, `inte_samma`, `en_av`, `bredvid`, `inte_bredvid`, `mellan`), `losning` och `ger_fynd_nar_lost`.
- `anklagelse` (hur/när-alternativ, max antal bevis), `losning.hur`, `losning.uteslutningar_text`, `fynd[].titel/ikon/forklaring` och `aterkoppling.forklaring_steg` som objekt `{ text, fynd }`.

## Testa

```sh
node verktyg/validera_fall.mjs          # validerar fallen
python3 -m http.server 18431 &
node test/spela.mjs                     # alla fall; kräver playwright; skärmbilder hamnar i shots/
node test/spela.mjs fall1               # bara ett fall (fall1, fall2, fall3 …)
node test/rundtur.mjs <fall-id> <prefix> # skärmbilder från alla 3D-rum
node verktyg/release.mjs                # före varje release: höjer service workerns cacheversion
```

## Dokument

- 📄 [Designförslag v1](docs/forslag-v1.md)
- ✅ [Beslut och avvikelser](docs/beslut.md)

## Projektledare

Martin Morén
