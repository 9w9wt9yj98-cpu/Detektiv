# Detektiv – arbetsregler för Claude

## Projektet
Ett 3D-deckarspel för vuxna i klassisk stil (Agatha Christie, Sherlock Holmes) med en oväntad vändning då och då. Spelaren går runt i förstapersonsvy, samlar fynd i anteckningsboken och pekar ut den skyldige.
- Vanlig HTML, CSS och JavaScript-moduler **utan byggsteg**. three.js ligger lokalt i `vendor/three/`.
- Ingen backend: progression sparas i `localStorage`. Spelas på GitHub Pages (`main`), fungerar i mobilen och som PWA (`sw.js`, `manifest.webmanifest`).
- Bakgrund och beslut: `README.md`, `docs/forslag-v1.md` (designförslag och fallschema), `docs/beslut.md` (godkända beslut och avvikelser – gäller före förslaget).

## Samarbete
- Svara och skriv alla speltexter på svenska.
- Martin är projektledare. **Större beslut** – ny mekanik, ändrad svårighetsgrad, nytt övergripande tema, större designändringar, monetisering, omskrivning av motorn – ska föreslås och vänta på hans godkännande innan de genomförs.
- Gör små, tydliga ändringar åt gången. Arbeta på en egen gren och öppna en pull request. **Pusha aldrig direkt till `main`.**
- **Buggfixar** (sådant som redan är fel: motsägelser i fall, trasiga knappar, föremål som inte går att nå o.d.) får Claude slå ihop själv när alla tester är gröna, och skriva in i `docs/beslut.md`. Allt nytt – nya fall, förbättringar som ändrar hur något fungerar eller ser ut – lämnas som pull request till Martin.
- Skriv in godkända beslut och avvikelser i `docs/beslut.md`.

## Fallen (`fall/*.json`)
- Varje fall ska gå att lösa med enbart logik och observation. Spelaren ska aldrig behöva gissa.
- Exakt en skyldig ska kunna bevisas, och varje oskyldig ska kunna uteslutas.
- Alla tider, gångtider, alibin, bilder och dokument ska stämma med varandra. Kontrollera detta särskilt noga efter varje ändring – även text som inte validatorn läser (repliker, inledning, upplösning).
- Variera miljö, brottstyp, kärnmekanik och epok mellan fallen. Undvik upprepning (variationsreglerna i `docs/forslag-v1.md` 3.4).
- Fallen följer schemat i `docs/forslag-v1.md` 1.3 med tilläggen i `README.md`. Ledtrådarna ska vara tre och stegvisa och får aldrig ge själva namnet på den skyldige.
- Fall 2 och senare genereras från `verktyg/fall/*.py`: ändra i `.py`-filen och kör den (`python3 verktyg/fall/<namn>.py`). Fall 1 och 3 saknar källa och redigeras direkt i JSON.
- Nya fall läggs till i `fall/index.json` – ingen kod behöver ändras.

## Kommandon
```sh
node verktyg/validera_fall.mjs          # validera alla fall (logik, nåbarhet, id:n)
python3 -m http.server 18431 &          # valfritt: test/spela.mjs startar annars en egen server
node test/spela.mjs                     # spela alla fall i iPhone-vy och på dator (ca 9 min); fall1 … fall6 för ett fall
node verktyg/release.mjs                # före varje release: höjer service workerns cacheversion och fillista
node verktyg/release.mjs --kontrollera  # kontrollerar att sw.js stämmer med filerna
npm test                                # validering + sw-kontroll + alla speltester
```
Testerna kräver Playwright (`npm install`, `npx playwright install chromium`). Kör validatorn och testerna före varje commit och rapportera resultatet.

## Kod
- Håll dig till nuvarande struktur: `js/motor` (fall, sparning, poäng, lösare), `js/tre` (3D-motor, föremål, texturer, kontroller), `js/vyer` (skärmar) och `js/mekaniker` (anteckningsbokens mekaniker). Verktyg i `verktyg/`, tester i `test/`.
- 3D-rummen beskrivs helt i fallets JSON (`moment[].payload.rum`) med föremål ur biblioteket i `js/tre`.
- Lägg aldrig till externa CDN-beroenden. Allt som spelet laddar ska ligga i repot.
- Nya eller borttagna filer som spelet laddar kräver `node verktyg/release.mjs`, annars fungerar inte offline-cachen.

## Underhåll
Uppdatera den här filen när Martin ändrar reglerna.
