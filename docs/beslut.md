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

## Vägledning efter första speltestet (oktober 2026)

Martin spelade fall 1 på iPhone och kom inte fram till något svar. Pusslen är oförändrade – samma logik, samma svårighet – men spelet visar nu tydligare vad man ska göra och hur långt man har kommit:

| Problem | Ändring |
|---|---|
| Svårt att komma igång | **Interaktiv guide** första gången: gå (vänster tumme), titta (höger), undersök (en pil visar vägen till fönstret), öppna boken, anklaga. Den kan hoppas över och visas igen från *Platser* i boken. |
| Oklart vad målet är och när man har hittat allt | **Uppdragsrad** i HUD:en (`meta.mal`) och räknaren **Fynd 5/14**. Rumsnamnet visar ”3 kvar här”. Fliken **Platser** i boken visar varje rum med antal fynd kvar, låsta rum och vad som låser upp dem, samt en gratis rad om nästa steg. |
| Svårt att se och träffa föremål | Starkare glöd när man är nära, kraftig glöd på det man tittar mot, och en stor knapp **🔍 Undersök …** längst ned. Tryck som missar föremålet med upp till ca 48 px räknas ändå. |
| Ledtrådarna hjälpte inte | Varje ledtrådsnivå har `kraver` (fynd som behövs). Saknas något pekar ledtråden först ut **var** det finns (rum och föremål, och vad som låser upp ett låst rum). Kostnaderna är oförändrade. |
| Svårt att koppla ihop fynd | Ny flik **Slutsatser** med guidade flervalsfrågor (`slutsatser` i fallets JSON). En fråga öppnas när fynden den bygger på är hittade. Fel svar kostar inget men förklarar varför. |
| Ingen förklaring vid misslyckande | Efter två fel visas **hela lösningen direkt**: den skyldige, hur det gick till, alla steg, uteslutningar och villospår. Under ledtrådarna finns **”Jag ger upp – visa lösningen”** (fallet räknas då som olöst). |

Service workerns cacheversion höjs vid varje release med `node verktyg/release.mjs`, som också listar alla filer och skriver versionsnumret som visas längst ned i menyn.

## Fler fall: ordning och kapitel

| Kapitel | Nr | Fall | Kärnmekanik | Twist |
|---|---|---|---|---|
| I – Aspirant | 1 | Halsbandet på Ekbacka | Scenundersökning | – |
| | 2 | Nattåget mot Narvik | Förhör: hitta motsägelser | – |
| | 3 | Middagen på Solgläntan | Logikrutnät | – |
| | 4 | Brudskålen | Bildjämförelse | **ja** |
| II – Konstapel | 5 | Kvart i elva | Tidslinje med gångtider | – |
| | 6 | Fyren på Gråskär | Dokument: markera motsägelser | **ja** |

De två fallen med twist (4 och 6) ligger sist i var sitt kapitel, med ett vanligt fall emellan, så att spelaren inte börjar vänta sig en vändning i varje fall. Varje fall introducerar en ny mekanik; scenundersökningen i 3D finns i alla.

## Fall 2 – Nattåget mot Narvik

Tre gåbara rum (kupé 3, sovvagnskorridoren, restaurangvagnen) och den nya mekaniken **Förhör** (`mekanik: "forhor"`, kod i `js/mekaniker/jamfor.js`). Personerna står i 3D-rummen; att prata med dem ger *utsagor* (`interaktiv.ger_material`) som hamnar i förhörsprotokollet i boken. Spelaren väljer två utsagor, eller en utsaga och ett fynd, och trycker **Invänd!**. Rätt par ger ett fynd (`motsagelser[].ger_fynd`); fel par kostar inget. Vissa utsagor dyker upp först när spelaren vet mer (`utsagor[].kraver`), t.ex. fru Ahls minne av lyktan när tidtabellen är läst.

**Varför lösningen är unik** (allt finns i materialet):
1. Kupé 3 har fyra möjliga vägar ut: korridordörren (kedjan hakad inifrån), fönstret (fastfruset, obruten is), väggen mot kupé 4 (hel panel) och mellandörren till kupé 2 (regeln på Bergs sida öppen). Bara mellandörren återstår.
2. Kupé 2:s egen dörr var hakad inifrån tills fru Ahl hakade av den kl. 06.15 (Lind såg det). Den som gick via mellandörren kom alltså inte vidare ut; hen stannade i kupé 2, där bara fru Ahl fanns.
3. Det utesluter alla andra oavsett alibi. Alibina (Olsson om Sundin, Lind på perrongen) och fru Ahls lögn om sömnen, avslöjad av lyktan i Boden, bekräftar bilden och pekar ut dunsen kl. 01.25.
4. Villospår: Sundins skuldsedel och lögn (motiv men alibi), de våta fotspåren (Linds stövlar) och Sundins felminne om kortspelet (patiensen).

`node verktyg/validera_fall.mjs` simulerar nu ett helt genomspel: alla fynd, utsagor, motsägelser och slutsatser måste gå att nå i någon ordning från start, och alla id:n måste finnas.

## Fall 4 – Brudskålen

Tre miljöer: **salen** (skänken där skålen stod), **gården** utomhus (midsommarstång, kaffebord, bussen, Lenas Volvo) och **Gunnars kontor** (datorn med Instagram, försäkringspärmen). Kontoret låses upp när Gunnar har berättat om stölden. Ny mekanik **Bildjämförelse** (`mekanik: "bildjamforelse"`, kod i `js/mekaniker/bildjamforelse.js`): bilderna ritas som SVG utifrån fallets data (`bilder[].varden`), så varje skillnad är exakt. Spelaren väljer två bilder och trycker på en detalj. Viktiga skillnader (`upptackter`) ger fynd och ringas in med grönt, oviktiga (vas, ljus, gardin) ringas in streckat och förklaras – fel tryck kostar inget. Bilderna samlas in genom att prata med gästerna och undersöka Gunnars dator. Två upptäckter som ger samma fynd (bucklan eller S:et) räknas som en.

**Placering:** Fall 4, sist i kapitel I. Den ligger alltså inte direkt efter Fyren på Gråskär (fall 6, sist i kapitel II) – de två twistfallen har ett vanligt fall (Kvart i elva) emellan.

**Varför lösningen är unik:**
1. Bild A (09.12, dagens tidning) visar bucklan och S:et precis som försäkringsfotot från 2019: den äkta skålen fanns på gården i morse.
2. Alla bilder från 15.16 visar släta handtag och ingen buckla: en kopia. Bytet skedde 09.12–15.16.
3. Gästerna kom med bussen 15.14 (körloggen). Lena stod på Arlanda till 12.44, två och en halv timme bort, och hennes bil syns köra in 15.16. Gunnar säger själv att han var ensam på gården hela förmiddagen. Bara han kan ha gjort bytet.
4. Gunnar påstår att han såg bucklan 16.30 – då stod kopian där. Han ljuger.
5. Villospår: Olle vid skänken 17.05 (skålen står kvar efter honom), Mikaels väska (en tårtbricka) och själva ”stölden” 17.05–17.20, som bara gällde kopian.

*Rättning:* Parkeringskvittot ändrades från 14.31 till 12.44 – med två och en halv timmes bilväg hade Lena annars inte hunnit hem till 15.16.

## Fall 5 – Kvart i elva

Fyra miljöer: **urmakeriet** (glasmontern, den krossade väggklockan, den uppbrutna luckan, ekspån på golvet), **Österlånggatan** i snöfall med gaslyktor (nattväktaren, grannen, gesällen), **poliskammaren** (liggaren, krögarens intyg, gillets protokoll, spårvagnsbiljetten och kartan med gångtider) och **Rapps kök** på Kungsholmen. Poliskammaren och Rapps kök låses upp när Fältskog har berättat vilka som har nyckel.

Ny mekanik **Tidslinje** (`mekanik: "tidslinje"`, kod i `js/mekaniker/tidslinje.js`), som låses upp av kartan med gångtider:
- Uppgifterna i fallet blir **tidskort** (`kort`). Spelaren trycker på ett kort och lägger det på rätt persons tidslinje. Fel person kostar inget.
- Motorn räknar gångtiden (`gangtider`) mellan varje par av uppgifter och visar rött när det är omöjligt och gult när minst 15 minuter är oförklarade (Rapps tjugo minuter).
- Heldragna kort kommer från oberoende källor, streckade är personens eget påstående. Ett påstående som krockar med en uppgift ger en **⚡ motsägelse** som spelaren kan invända mot (`konflikter`).
- När brottstiden är fastställd (slutsatsen ger fyndet `f-brottstid`) kan varje person **prövas**: motorn lägger in ”vid montern 22.45–22.47” och räknar om. Resultatet ger ett fynd (`prov`).

**Varför lösningen är unik** – `validera_fall.mjs` räknar om alla tidslinjer och kräver att exakt den skyldige klarar prövningen:
1. Väktaren (hel 22.30, bruten 23.00), grannen (skräll strax efter tre kvart) och klockan (22.47) ger brottstiden 22.45–22.47.
2. Montern öppnades med nyckel. Bara Fältskog, Karl Ek och Rapp har nyckel; fru Lindh kan uteslutas redan här (och satt dessutom på spårvagnen 22.40–22.52).
3. Fältskog satt på Grand Hôtel inför fyrtio gäster.
4. Karl ljög om krogen, men stod på pantlånekontoret 22.40 – 20 minuter bort. Tidigast 23.00 i butiken.
5. Rapp: gillet 22.30 → urmakeriet 6 min (22.36) → ut 22.47 → hem 18 min = 23.05, precis när hustrun säger att han kom. Raka vägen (15 min) hade gett 22.45, som han själv påstår.
6. Stöd: färska ekspån i Rapps rock, fast han ”inte varit i butiken på sex år”; ritningen till Polaris ger motivet.

*Rättning mot förslaget:* krögaren säger att Karl gick ”strax efter kvart över tio” (22.20) i stället för 22.25 – med 16 minuters gångväg hade han annars inte hunnit till pantlånekontoret 22.40, och tidslinjen hade visat hans sanna uppgifter som omöjliga. Polaris konstruerades enligt ritningen av Rapp och Fältskog tillsammans.
