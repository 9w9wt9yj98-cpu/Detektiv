# Beslut efter designförslag v1

Godkända av Martin Morén, oktober 2026. Kompletterar [forslag-v1.md](forslag-v1.md).

| # | Fråga | Beslut |
|---|---|---|
| 1 | Grafisk stil | Sepia, gravyr och akvarell på åldrat papper: varma bruna toner, mässingsknappar, serifftypsnitt (systemets egna, inga externa typsnitt). |
| 2 | Berättelse | Fristående fall med en lätt röd tråd. Prototypen använder Nils Strand som återkommande polis: ung konstapel på Ekbacka 1926, grånad kommissarie på Solgläntan 1954. |
| 3 | Detektiven | Spelaren är ”du”. |
| 4–5 | Poäng | Ledtrådar kostar −10/−25/−50 poäng (summeras), fel anklagelse −30. Två fel anklagelser tillåts, sedan visas upplösningen. 1–3 förstoringsglas: 1 för löst fall, +1 om minst 75 poäng återstår, +1 för bevis som håller (och rätt hur/när om det angavs). |
| 8 | Teknik | Bara frontend, ingen backend, progression i `localStorage`. **Avvikelse från förslaget:** vanlig HTML/CSS och JavaScript-moduler **utan byggsteg** (inte Vite/TypeScript), så att GitHub Pages kan servera repot direkt. |
| – | **3D-utredning** | **Varje fall har en gåbar förstapersonsmiljö i 3D** (three.js, vendrat lokalt i `vendor/three/`). Rummen beskrivs helt i fallets JSON (`moment[].payload.rum`) med föremål ur ett bibliotek av enkla primitiver och canvasgenererade texturer. Anteckningsboken är ett föremål i rummet som spelaren går fram till och trycker på; deduktionstavlan (logikrutnätet) och anklagelsen nås från boken och visas som 2D-lager. En liten bokikon i menyraden finns kvar som reserv. |
| – | Plattform | Mobil först (porträtt, iPhone Safari), fungerar även på dator. PWA med manifest och service worker så att spelet kan läggas på hemskärmen. |
| 12 | Första prototyp | Fall 1 (scenundersökning) och fall 3 (logikrutnät). |

## Avvikelser och tolkningar i prototypen

- **Fall 1** utreds i tre 3D-rum: sovrummet, köksgången och stora salen. Köksgången låses upp av fyndet *oskadat lås*, stora salen av *tre nycklar*. Två stödfynd har lagts till i sovrummet för 3D-scenen – avtryck på mattan och en vältad vas – och båda pekar, liksom fönsterblecket, på att fönstret öppnades inifrån. Lösningen är oförändrad.
- **Fall 3**: förslagets text säger att platserna räknas *medsols* från överstens högra sida. Sett ovanifrån leder medsols från en person som sitter vänd mot bordet alltid först till personens *vänstra* sida, så formuleringen har ändrats till ”räknat runt bordet från överstens högra sida”. Logiken (plats 1 och 4 bredvid översten, plats 4 = vänster sida) är oförändrad och fortfarande unik enligt lösaren.
- Förhörsuppgifterna L1–L9 i fall 3 låses upp när spelaren hittar förhörsprotokollen på verandan.
