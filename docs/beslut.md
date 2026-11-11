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

## Fall 6 – Fyren på Gråskär

Fem miljöer: **tornets nedre avsats** (fyrmästaren under en filt tvärs över trappan, Elof), **lanternan** (linsen, urverket, fyrinstruktionen, loggboken, Holgers utkast till Lotsverket), **fyrmästarbostadens kök** (Signe, Johan med spjälat ben på köksbänken, Signes brev), **biträdesstugan** (Elofs dagbok, reservoarpennan, fotogenkannorna) och **väderstationen** (barografen, väderjournalen, doktor Lagerkvist). Lanternan är låst tills spelaren har undersökt kroppen – man måste kliva över honom.

Mekanik **Dokument** (befintliga `jamfor.js` i `visning: "dokument"`): tolv dokument i olika stilar (tryck, loggbok, handskrift, barografens rulle). Spelaren kan **markera** stycken och invänder med två stycken eller ett stycke och ett fynd. 04-raden i loggboken är satt i blått bläck och lutande handstil (`stil: "blacke"`). Sex motsägelser krävs; en sjunde (”Holger lånade min penna”) dyker upp först när bläcket är upptäckt och är frivillig (`kravs: false`, visas som ”+1 extra”).

**Twist – opålitlig berättare:** inledningen är Elofs vänliga brev till detektiven, och hans dagbok är ett av dokumenten. Ingenting markerar honom som särskilt misstänkt. Efterordet visas som ”🜂 Vändningen”.

**Varför lösningen är unik** (bevisas i texten; validatorn kontrollerar att allt går att nå i rätt ordning):
1. Blåmärken på överarmarna – han knuffades.
2. Signe (bostaden) och doktorn (stationen) hör dunsen oberoende av varandra 03.20.
3. Urverket går högst 2 t 15 min; uppdraget 02.00 hade det stannat 04.15, men journalen säger ”fyren lyser normalt” till 06. Alltså drog någon upp det vid fyra – och klev då över kroppen (doktorns anteckning: ingen kan passera utan att kliva över honom).
4. Loggboken förs alltid med blyerts; 04-raden ”H.W.” är skriven med bläck. Holger var död – förfalskning. Den enda reservoarpennan på ön är Elofs (hans egen dagbok).
5. Uteslutningar: Johan kan inte gå. Doktorn slog tidsmärken 03.15 och 03.30 (och 03.45–04.15) med tjugo minuters väg tur och retur. Signe kan bara gå ut genom köket där Johan låg vaken. Kvar blir Elof – som dessutom skriver att han hörde Holger vissla vid fyra.
6. Motiv: Holgers utkast till Lotsverket om sextio liter försvunnen fotogen; kannorna står i Elofs stuga.

**Ordning:** fallet ligger sist (6) i kapitel II. Brudskålen (twist) ligger sist i kapitel I, med Kvart i elva emellan.

**Allmänna förbättringar i samma release:** ledtrådspekaren skriver nu egennamn med versal (”undersök Holger Wenngren”, inte ”holger”); dokument- och förhörsstatus räknar frivilliga motsägelser separat; validatorn förstår dokumentstycken i motsägelsepar.

**Lanternan** byggs med nya prefaben `lanternglas` (järnbröstning med nitar, stora rutor i spröjs mot stormnatten) på alla fyra väggar, räfflad järnplåt som golv (`golv.typ: "jarn"`) och mörkt tak (`takfarg`). **Upplösningen** fick ett valfritt fält `aterkoppling.vandning` (rubrik, citat ur inledningen med kommentar, bekännelse) som visas under ”Vändningen” – i fall 6 läser detektiven Elofs brev en gång till och visar att varje vänlig mening var ett spår.

## Granskning och rättningar (november 2026)

Efter en genomgång av hela spelet rättades fel i fallen och i tekniken. Pusslen och lösningarna är oförändrade; texterna har rättats där tider, platser eller uteslutningar inte gick ihop. 3D-utredningen är kvar som enda sätt att spela.

**Fallen**

| Fall | Rättning |
|---|---|
| 1 Halsbandet | Friherrinnan kunde inte uteslutas efter kl. 21.00 eftersom hon gick upp ensam. Nu följer Elsa med henne upp och höll ljuset när halsbandet lades i skrinet kl. 19.55. Elsa ”lämnade aldrig salen” trots att hon serverade: kokerskan räcker nu in faten genom serveringsluckan. Upplösningen hittade halsbandet i ”hans livrérock” fast spelaren just sett en livrérock med tomma fickor – nu ligger det i rocken Holm bar under middagen. ”pipande” → ”piprökande”. |
| 2 Nattåget | Det var inte visat att kupé 2 saknade andra utgångar. Lind säger nu att fönstret är fastfruset och att väggen mot den tomma kupé 1 saknar dörr (fyndet *Fru Ahls kedja*). Linds väg efter Boden gick genom sovvagnen; nu kliver han på längst fram och går bakåt till restaurangvagnen. Fotspåren förklaras med Linds väg till kupé 3 strax efter sex. ”hen” i Strands replik 1934 är borttaget. |
| 3 Solgläntan | Förklaringen motiverade Cecilias plats med L5; det är L9 (David inte bredvid översten) som avgör. ”hen” 1954 borttaget. |
| 4 Brudskålen | Gunnar säger nu att han var ensam ”hela dagen tills bussen kom” (bytet kan ha skett fram till 15.16). Strand omnämns som ”han”. |
| 5 Kvart i elva | Hilma sa ”August ställer klockan” – Strands förnamn; nu ”Anders”. Fältskog sa att han satt på Grand ”från sju till ett” fast han står i butiken före midnatt; nu ”tills konstapeln hämtade mig vid halv tolv” (tidskortet slutar 23.30). Inledningen sa att väktaren larmade ”strax före midnatt”; nu ”strax efter elva”. |
| 6 Fyren | Johans ”ingen gick genom köket mellan midnatt och sex” krockade med Holgers uppdragningar. Nu berättar Signe att Holger gick upp i tornet vid tio och vakar där hela natten vid storm, och Johan säger att ingen gick ut efter det. Signe ser klockan på byrån i köket (inte i sovrummet). Elofs brev säger att bara fyra är kvar på ön. ”i morse den fjortonde” stämde inte med att det var första båten på två dygn. Loggboken har nu en ny blyertspenna från förrådet – Holgers satt i hans bröstficka, så kl. 04 fanns ingen blyertspenna i lanternan. Spelaren tilltalas ”detektiv”, inte ”herr detektiv”. |

**Tekniken**

- **Laddningen kan inte längre fastna tyst.** `index.html` har en liten reserv som efter 15 sekunder, eller om en modul inte går att läsa, visar *Ladda om* och *Hämta spelet på nytt* (avregistrerar service workern och tömmer cachen; progressionen ligger kvar). Webbläsare utan modulstöd får ett tydligt besked.
- **Service workern** hämtar fortfarande från nätet först, men utan webbläsarens HTTP-cache (så att gamla och nya moduler inte blandas efter en release) och faller tillbaka på cachen om nätet inte svarat inom 4 sekunder.
- **Menyn** hämtar alla fall samtidigt, och ett fall som inte går att läsa visas som ett eget kort i stället för att hela menyn faller.
- **three.js** importeras med relativ sökväg i stället för via en import map, så att 3D fungerar även i Safari före iOS 16.4.
- **3D-minnet** frigörs vid rumsbyte (geometrier och material som inte delas). Tidigare växte minnet för varje rumsbyte.
- **Tappad WebGL-kontext** (t.ex. när telefonen tar tillbaka grafikminne) pausar vyn och fortsätter när kontexten är tillbaka, i stället för att bli svart.
- **Prestanda:** telefoner renderar med högst 1,5 i pixeltäthet, och sjunker bildfrekvensen under 24 bilder/s i tre sekunder sänks den automatiskt.
- **Utan WebGL** visas nu ett läsbart besked mitt på skärmen med råd och *Försök igen* (det hamnade tidigare bakom menyraden).
- **Sparningen** rensar bort fynd och material som inte längre finns i fallet om fallets JSON ändrats sedan utredningen sparades.
- **Tillgänglighet:** synlig fokusmarkering för tangentbord, `prefers-reduced-motion`, inga texter under 11 px, och bokens knappar får plats på 320 px breda skärmar.
- **Verktyg:** `package.json` med `npm test` och `npm run validera`; `test/spela.mjs` startar en egen server; `node verktyg/release.mjs --kontrollera` misslyckas om fillistan i `sw.js` inte stämmer med repot eller versionerna skiljer sig åt.

**Inte ändrat – kräver beslut:** rangerna Kommissarie (22) och Mästerdetektiv (35) går inte att nå med sex fall; `kraver_rang` och kapitellås används inte; Strands återkommande roll går inte ihop i tid (1926, 1934, 1954, nutid, 1897 som *August* Strand); krav på rätt ”hur” i svårare fall; ljud.

## Rang, kapitel, Strand, ljud och föremålsbiblioteket (november 2026)

Beslut av Martin: gör allt utom ändrad svårighet (krav på rätt ”hur”), som får vänta.

- **Rangerna** går nu att nå med sex fall (högst 18 förstoringsglas): Aspirant 0, Konstapel 4, Kriminalassistent 8, Kommissarie 12, Mästerdetektiv 16. Kraven höjs när fler fall kommer till (`RANGER` i `js/motor/poang.js`).
- **Kapitellås:** kapitel II öppnas när alla fall i kapitel I är avslutade – lösta eller med lösningen visad – *eller* när spelaren når rangen Konstapel (`lases_upp_av_rang` i `fall/index.json`). Ingen kan fastna, eftersom ”Visa lösningen” alltid avslutar ett fall. Ett fall som redan är påbörjat stängs aldrig. Låset sitter i menyn; en direktlänk till ett fall fungerar fortfarande.
- **Strand-släkten:** varje tid har sin egen Strand. Överkonstapel *August* Strand (1897) är far till *Nils* Strand – konstapel på Ekbacka 1926, kriminalkonstapel på nattåget 1934 och kommissarie på Solgläntan 1954. I nutid utreder kriminalinspektör *Maja* Strand, Nils barnbarns barn, med hans gamla anteckningsbok i fickan.
- **Ljud:** miljöljud per rum och små effekter (fynd, dörr, bläddring i boken), syntetiserade med Web Audio i `js/ljud.js` – inga ljudfiler, inget extra att ladda ned. Ljudet startar vid första trycket (webbläsarnas krav), tystnar när fliken döljs och kan stängas av med 🔊-knappen i utredningen; valet sparas.
- **Föremålsbiblioteket** är uppdelat efter sort i `js/tre/foremal/` i stället för efter fall (`prefabs.js` … `prefabs4.js`). Färgkonstanterna finns på ett ställe. `dagfonster` och `stormfonster` delar nu stommen `korsfonster`. Övriga fönster- och dörrtyper ser medvetet olika ut och är kvar som egna föremål. Alla 76 kontrollbilder av rummen (fyra riktningar per rum) är identiska före och efter, så när som på en enda bildpunkt.

## Mer detaljerad grafik, steg 1 (november 2026)

Martin vill ha mer detaljerad grafik om det inte blir för mycket arbete. Första steget ger mest effekt för insatsen och behåller stilen, med enkla former och canvastexturer:

- **Skuggor:** rummets starkaste lampa – eller solen utomhus – kastar mjuka skuggor. Rum utan lampa får ett svagt takljus. Lampornas egna delar, glas och självlysande ytor kastar ingen skugga. Eftersom rummen står still räknas skuggkartan bara om när ett rum laddas, inte varje bildruta.
- **Personerna** har fått ansikte (ögon, ögonbryn, näsa, mun, öron), formad överkropp med axlar, armar med armbåge och händer, ben med lår och underben, formade skor, kavajslag och knappar, krage, kjol med fåll, hår vid tinningarna och en mustasch till skägget. Byggstenen `kapsel` finns i `foremal/grund.js`.
- **Färre ritanrop:** varje föremåls ogenomskinliga delar slås ihop till en mesh per material när rummet byggs (`slaIhop`). Trädgården i Brudskålen ritas med 80 anrop i stället för 215.
- **Svagare telefoner:** när bildfrekvensen ligger under 24 bilder/s sänks först pixeltätheten och därefter stängs skuggorna av.

Möjliga nästa steg, var för sig: rikare texturer och detaljer rum för rum (ungefär en halv dag per rum), eller riktiga 3D-modeller (flera veckor, kräver noggrann kontroll av filstorlek och mobilprestanda).

## Utropstecken och kompaktare menyrad (november 2026)

Efter Martins speltest i mobilen, liggande:
- **Utropstecken i stället för glöd.** Det som går att undersöka får en liten mässingsbricka med **!** ovanför sig. Den tonas in när man kommer närmare än cirka fyra meter och försvinner när föremålet är undersökt. Det man tittar på får ett lite större märke som guppar. Anteckningsboken har en bok och dörrar en pil; en undersökt dörr behåller pilen. Brickorna har samma storlek på skärmen oavsett avstånd och syns genom möbler. Guiden och boken säger ”utropstecken” i stället för ”det som glimmar”.
- **Menyraden** ryms på en enda rad när telefonen ligger ned (ca 56 px i stället för ca 110 px), med mindre knappar. Meddelanden, guide och Undersök-knappen flyttas efter.

## Blindtest av alla fall (november 2026)

Sex agenter fick var sitt fall som *spelarvy* – bara det spelaren ser, utan lösning, facit, villospårsmärkning, ledtrådar eller slutsatsfrågor – och skulle lösa fallet och rapportera luckor. Alla sex löste sitt fall rätt och kunde utesluta övriga misstänkta (säkerhet 4–5 av 5). Martins beslut: rätta luckorna, men låt svårighetsgraden vara.

| Fall | Rättning |
|---|---|
| 1 | Elsa bär sin nyckel i ett band runt halsen; gästerna såg Gustav vid bordet hela middagen; golvet vid tjänstetrappan är nyskurat (förklarar de fuktiga avtrycken). |
| 2 | Lind berättar själv att han skottade snö på plattformen strax efter sex och gick in genom bakdörren till kupé 3 (förklarar fotspåren). |
| 3 | Personbeskrivningarna säger ”han”/”hon” (L8 kräver inte längre att man gissar kön av förnamn); tavlan säger att plats 1 och 4 inte är grannar; läkarväskan stod öppen där alla gick förbi. |
| 4 | Bildinformationen visar att Instagrambilden togs 09.10 (Lena hade redan åkt); ”förmiddagen” borttaget där bytet bara kan sägas ha skett ”under dagen”. |
| 5 | Hilma tittade på köksuret när Rapp kom; kassören berättar att fickuret var Karls fars (E.E.); fru Lindh hade bara en handske; gångtiden heter ”Slussen (spårvagnen)”; raden om Strands son flyttad från inledningen till efterordet och rättad i tid (Nils är ännu inte född 1897). |
| 6 | Holgers penna sitter i bröstfickan även i personbeskrivningen; barografens märken går till 06.00 som journalen. |

Kvar till senare (svårighet): fall 6:s hakparentes om bläcket i loggboken avslöjar mycket, och i fall 3 och 5 antyder personbeskrivningar och spår den skyldige tidigt.

## Framkomlighet (november 2026)

Martin kom inte förbi fru Ahl i sovvagnskorridoren. Orsak: de nya, mer detaljerade personerna räknades som hinder över hela armbredden, och tillsammans med det lilla bordet stängde hon korridoren. Personer räknas nu bara som ett smalt fotavtryck (36 cm), och bordet med anteckningsboken står längre bak i korridoren.

Ett nytt test, `test/framkomlighet.mjs` (ingår i `npm test`), fyller i alla platser man kan gå till från rummets start och kräver att varje dörr kan nås inom 1,5 m och varje föremål inom 2,2 m. Det hittade två fel till i fall 6, som också är rättade: startpunkten i lanternan låg inne i bordets hinder, och Johan låg så långt upp på köksbänken att huvudet stack in i väggen.

## Förhandsgranskning: verklig grafik (november 2026) – väntar på beslut

Martin vill att grafiken ska se mer verklig ut. Det går delvis emot beslut 1 (sepia, gravyr och akvarell), så den nya stilen ligger som en **förhandsgranskning** som bara syns för den som slår på den:

- Slå på: `https://9w9wt9yj98-cpu.github.io/Detektiv/?stil=verklig` – valet sparas i webbläsaren, och menyn visar en skylt med länk tillbaka.
- Slå av: `?stil=vanlig`.

Förhandsgranskningen (`js/tre/stil.js`) byter till fysiskt baserade material (mässing glänser som metall, glas blankt, lackat trä halvblankt, tapet matt), relief av texturerna, reflektioner från en förfiltrerad omgivningskarta (varmt rum inomhus, himmel och gräs ute) och filmisk färgåtergivning (AgX). Fyllnadsljuset är något svagare eftersom omgivningskartan ger indirekt ljus. Allt annat – fall, rum, föremål, skuggor och markörer – är detsamma. Utan parametern är spelet oförändrat.

Om Martin väljer den: gör den till standard (och skriv om beslut 1). Om inte: ta bort `stil.js` och grenarna för VERKLIG.

## Förhandsgranskning: riktiga 3D-modeller i sovrummet, fall 1 (november 2026) – väntar på beslut

Martin tyckte att skillnaden med `?stil=verklig` var för liten och ville se riktiga 3D-modeller. Som prov har **sovrummet i Halsbandet på Ekbacka** fått modeller från Poly Haven (CC0) – bara i förhandsgranskningen. Utan `?stil=verklig` är spelet oförändrat (kontrollbilderna i vanlig stil är identiska), och varken modellerna eller GLTFLoader laddas.

- **Hur:** ett valfritt fält `modell` på föremålet i rummets JSON (`fil`, `passa`, `rot`, `skala`, `pos`, `glas`, `urtavla`, se `js/tre/modeller.js`). Prefaben byggs alltid först, så id, interaktiv-text, markör, kollision och träffyta är desamma; när modellen har laddats döljs prefabens delar och modellen ställs i dess ställe, anpassad till prefabens mått. Delar som måste synas för fallets skull står kvar (`userData.behall`): friherrinnans sjal på fåtöljen och vattnet och blommorna vid vasen. Pendylens urtavla läggs på av spelet och visar 21.14.
- **Modeller (9):** säng, byrå, fönsterbord, fåtölj, två runda bord, pendyl, oljelampa, vas och tavla. Källor och licenser i `modeller/KALLOR.md`. Dörr, fönster, eldstad, bokhylla (luckan i bokraden är ett fynd), matta, smyckeskrin, askkopp och anteckningsbok är kvar som prefaber – Poly Haven har ingen eldstad eller tidstypisk dörr.
- **Storlek:** 2,5 MB modeller (WebP-texturer, 1k för möbler och 512 för småsaker, förenklade nät) plus 167 kB GLTFLoader. Laddas bara i förhandsgranskningen och cachas av service workern när de har hämtats. Omkring 36 000 trianglar för modellerna i rummet; antalet ritanrop är ungefär detsamma som förut.
- **Personer:** inga ändrade. Det finns inga fria, realistiska personmodeller i 1920-talskläder hos de tillåtna källorna (Quaternius och Kenney har bara lågpolygonfigurer i modern stil).
- **Verktyg:** `vendor/three/addons/` innehåller GLTFLoader med beroenden ur npm-paketet three@0.186.1 (samma version som `three.module.min.js`), med importerna omskrivna till relativa sökvägar. `STIL=verklig node test/spela.mjs fall1` kör speltestet i förhandsgranskningen.

Före- och efterbilder (samma kameravinklar, dator och mobil): `docs/bilder/modeller-sovrum/`.

Avvikelse att ta ställning till: sängen i texten är en *himmelssäng*, men modellen är en sänggavelsäng med fyra höga stolpar utan sänghimmel.

## Verklig grafik: resten av fall 1, riktiga golv och väggar (november 2026)

Martin godkände sovrummet och bad om resten av fall 1, bättre texturer på väggar och golv och att småfel rättas på vägen.

- **Matsalen och köksgången** har fått modeller: skänk, bord, ljuskronor, krukväxt, tavla, pendyl, lampbord och oljelampa, och **stolarna runt långbordet** är nu läderstolar. Stolarna ingår i långbordets prefab; prefaben märker dem (`userData.del = "stol"`) och `modell.delar` byter bara dem. Långbordet med duk och kuvert är kvar. Ljuskronor hänger från taket (`modell.hanger`).
- **Golv, väggar, panel och tak** (`js/tre/ytor.js`, bara i förhandsgranskningen): trägolv blir fotograferade plankor färgade mot rummets golvfärg, eller fiskbensparkett med `rum.verklig_golv: "fiskben"` (matsalen). Stengolv blir rutiga kalkstensplattor. Tapet och puts får putsstruktur och matthetsvariation under mönstret, panelen får ådring och taket putsstruktur. Det gäller alla inomhusrum i förhandsgranskningen. Texturerna är 0,5 MB; källor i `texturer/KALLOR.md`.
- **Småfel:** sängen beskrivs nu som ”sängen med de fyra höga stolparna” i stället för ”himmelssängen”, vilket stämmer med både prefaben och modellen. Pendylen i sovrummet visade fel tid i vanlig stil (timvisaren nära elva, inte nio), fast texten säger 21.14. Nu har pendylen ett fält `tid`, och sovrummet visar 21.14. Matsalens pendyl visar 21.25 – spelaren kommer alltid dit efter sovrummet.

Före- och efterbilder: `docs/bilder/modeller-fall1/`.

## Verklig grafik: fall 2, Nattåget mot Narvik (november 2026)

Förhandsgranskningen i samma stil som fall 1 (`?stil=verklig`; vanlig stil är oförändrad):

- **Väggarna** i kupén, korridoren och restaurangvagnen är fanérad mahogny med lodrät ådring (`rum.verklig_vagg: "tra"`). Det gör störst skillnad i tåget och stämmer med texten om väggen mot kupé 4 (”en hel mahognypanel”), som i vanlig stil är tapetserad.
- **Modeller:** borden i restaurangvagnen och kupén, bordet i korridoren och ljuskronan i restaurangvagnen. Golven har trätextur.
- **Kvar som prefaber:** kojer, kupédörrar, tågfönster, bardisk, bänkar, väggampor och portföljen. Det finns inga fria modeller av tåginredning från 1930-talet. Läderbänken som provades (*sofa_02*) gav fel sitthöjd för personerna som sitter där, och Poly Havens resväskor (två väskor med resetiketter) är inte en portfölj.
- **Granskning av texterna:** tidtabellen, notorna, dunsen kl. 01.25, Linds väg i Boden och säkerhetskedjorna stämmer. Kupé 2 ligger åt samma håll från korridoren och från kupé 3. Inga fel hittades utöver väggen ovan.

Före- och efterbilder: `docs/bilder/modeller-fall2/`.

## Verklig grafik: inga synliga byten, och fall 3–5 (november 2026)

Martin såg att möblerna bytte utseende efter ungefär en sekund och ville att de gamla aldrig skulle synas, och att arbetet fortsatte med alla rum.

- **Laddningen:** i förhandsgranskningen visas rummet först när modeller och texturer är klara och materialen förberedda (`compileAsync`). Duken tonas in på 0,35 s. Dröjer det mer än 1,2 s visas ”Laddar rummet …”, och efter 8 s visas rummet ändå, med de enkla föremålen som reserv. Medan man är i ett rum hämtas modellerna och texturerna för rummen som dörrarna leder till (`Rum3D.forladda`).
- **Fall 3 (verandan):** målat bord och vita stolar. **Duken ligger kvar** på bordet, eftersom pulverspillet ligger ”på duken till vänster om överstens glas”, och **platsnumren** sitter kvar på stolarna. Krukväxter och plankgolv; verandor får nu golvtextur.
- **Fall 4 (salen och kontoret):** vita allmogestolar runt långbordet, tavla och skrivbord. **Skänken, vasen och ljusstaken är kvar som prefaber**, eftersom bildjämförelsen visar foton av skänken – en annan skänk i 3D skulle inte stämma med bilderna. Gården är oförändrad: Poly Haven har inga björkar, granar, gärdsgårdar, midsommarstång, bilar eller bussar, och stolarna där har personer sittande på sig.
- **Fall 5:** butiksdisk, bord och oljelampor, och **gatan** har kullersten (`verklig_golv: "kullersten"`) och gatlyktor vars glas glöder (`modell.lyser`). Fasaderna har fått putsstruktur. Väggur, monter, arbetsbänk, vedspis och pulpet är kvar, eftersom tider och detaljer i texterna hänger på dem.
- **Medan rummet laddas ritas inga bildrutor.** I testmiljön utan grafikkort köades annars de osynliga bildrutorna och betalades på en gång när rummet visades (8 s i köksgången i stället för 1 s). Därefter ritas en förberedande bild innan duken tonas in.
- **Testerna:** `TIDSFAKTOR=6` förlänger tidsgränserna i `test/hjalp.mjs`. Med `STIL=verklig TIDSFAKTOR=6` går fall 1–6 igenom utom handledningen i fall 1, som kräver att spelaren hinner gå under ett kort drag – med 1–2 bildrutor per sekund utan grafikkort hinner man inte (samma på `main`).
- **Rättat på vägen:** gatan i fall 5 hade fått schackrutiga kalkstensplattor i förhandsgranskningen (alla stengolv fick samma textur). Delar som står kvar bredvid en modell (duk, sjal, blommor) räknas inte längre in när modellen passas in, så att de inte göms under den.

Före- och efterbilder: `docs/bilder/modeller-fall3/`, `modeller-fall4/` och `modeller-fall5/`.

## Verklig grafik: fall 6, Fyren på Gråskär (november 2026)

Förhandsgranskningen i samma stil som fall 1 och 2 (`?stil=verklig`; vanlig stil är oförändrad utom småfelen nedan):

- **Golv och väggar** (`js/tre/ytor.js`): tornets stenväggar är natursten med kalkbruk och golvet grova stenhällar (`rum.verklig_golv: "hallar"`). Lanternans järngolv är nitade järnplåtar. Träpanelen i biträdesstugan och väderstationen är liggande panel, färgad mot rummets panelfärg. Stenväggar, träpanel och järngolv får texturerna automatiskt (bara fall 6 har sådana rum). Väggsorterna ligger i en tabell; fanéret i fall 2 är oförändrat. Texturerna är 1,7 MB (stenen har mycket relief); källor i `texturer/KALLOR.md`.
- **Modeller:** borden i lanternan, stugan och stationen, köksbordet (med modellens egen rutiga duk i stället för prefabens vita, `modell.behall: false`), byrån och pendylen i köket, oljelamporna och fotogenkannorna i tornet och stugan (plåtdunkar, en modell per kanna via `modell.delar`). Två nya modeller, 0,5 MB; resten återanvänds från fall 1 och 2.
- **Kvar som prefaber:** spiraltrappan, linsen, urverket, lanternglasen, pulpeten, barografen, loggboken och dagboken, skrivdonen, kojen som Johan ligger på, vedspisen, stormfönstren, dörrarna, väggklockan, vägglamporna och sängen. Det finns inga fria modeller av fyrutrustning eller väderinstrument från 1930-talet. Kökssoffan som provades (*painted_wooden_sofa*) gav fel liggyta för Johan, och sängarna som finns (den gotiska från fall 1, en järnsäng utan madrass) passar inte.
- **Småfel i fallet (rättade i `verktyg/fall/fyren.py`):** Elofs dagbok beskrivs som svart men var rödbrun. Brevet låg ovanpå byrån fast texten sa ”i byrålådan” – texten säger nu att det ligger på byrån och har legat undanstoppat i lådan. Fotogenkannorna i stugan stod inte ”bakom dörren”. Pendylen i köket hade en urtavla utan bestämd tid (omkring 10.15) medan klockan på stationen visar 7.05; den visar nu 7.00. Tiderna, gångvägarna, barografens märken och vem som kan gå var stämmer i övrigt.

Före- och efterbilder: `docs/bilder/modeller-fall6/`.

## Verklig grafik: fall 7–9 (november 2026) – godkänt av Martin 5 november (#21)

Martins beslut: fall 7 (Sista akten), 8 (Nyårsnatten på Vitanäs) och 9 (Fjällgården, 1968) får modeller i förhandsgranskningen `?stil=verklig`, som fall 1–6. Vanlig stil är oförändrad utom småfelen nedan.

- **Återanvända modeller:** fåtöljerna, borden, krukväxten och ljuskronorna hade redan modeller. Nu också vita allmogestolar för brandmannens stol på scenen och stolen i logerna (fall 7), läderstolar för grevinnans stol i balsalen och stolen i telefonväxeln (fall 8) och gatlyktorna från fall 5 som gaslyktor på terrassen (fall 8, glaset glöder).
- **Nya modeller (2, 0,6 MB):** burlampor (*Industrial Wall Lamp*) som vägglampor i lindraget och undre maskineriet (fall 7) och i polisens arkiv (fall 9), och ett skrivbord i stål (*Metal Office Desk*) som bordet med akten i arkivet. Källor i `modeller/KALLOR.md`.
- **Golv:** terrassen på Vitanäs och skidrummet i källaren på Fjällgården har grova stenhällar (`verklig_golv: "hallar"`) i stället för schackrutiga kalkstensplattor.
- **Kvar som prefaber:** flygeln, biljardbordet, kakelugnarna (Poly Havens enda kakelugn är en grå plåtkamin som inte passar på ett slott), bokhyllorna, eldstaden, rustningarna, gobelängen, porträtten, kandelabrarna, väggklockorna, telefonväxeln, sminkbordet, klädställningen, pulpeten, strålkastarna, nagelbanken, spiraltrappan, bardisken, nyckelskåpet, skidorna, panelen, resväskan och arkivhyllorna. Poly Haven har inga flyglar eller biljardbord, och det mesta i teatern och på fjällgården är spelets egna föremål som texterna hänger på.
- **Småfel i fall 8 (rättade i `verktyg/fall/vitanas.py`):** fönstret i biblioteket visade en grön sommardag, fast det är nyårsnatt och snön ligger på blecket. `dagfonster` har fått ett fält `natt`, och fönstret visar nu mörkret utanför. Grevinnan ”sitter rak på en stol” enligt texten men stod upp inne i stolen; nu sitter hon.

## Blindtest 2 av alla fall (november 2026)

Efter grafikarbetet bad Martin om en blind agent som speltestar logiken och kontrollerar att allt går att lösa. Agenten fick bara spelarvyn, som skrivs av det nya verktyget `verktyg/spelarvy.mjs`: allt spelaren kan se, men ingen lösning, inga rätta svar, motsägelser, prövningar, ledtrådar, villospårsmärkning eller fynd som man bara får genom att lösa något. Först löste den varje fall, och först därefter fick den slutsatsfrågorna (`--slutsatser`). Hela rapporten: `docs/blindtest/rapport-2026-11-04.md`.

**Resultat:** alla sex fall lösta rätt, både skyldig och hur, med säkerhet 4–5 av 5. Alla 36 slutsatsfrågor besvarade rätt, och ingen fråga fick agenten att ändra sig. Inga allvarliga fel hittades. Två påpekanden stämde inte: slutsatsfrågorna om läkaren i fall 3 och om bläcket i fall 6 visas först när rutnätet respektive bläcket är löst. Att Gunnar själv lät kopian försvinna förklaras i upplösningen, som agenten inte såg.

**Rättat** (Martins beslut: allt som är ologiskt eller inte stämmer ska rättas; pusslen och lösningarna är oförändrade):

| Fall | Rättning |
|---|---|
| 1 | Avtrycken går från dörren till byrån, vidare till fönstret och samma väg tillbaka; inget börjar vid fönstret (förut ”de slutar där”, som kunde läsas som att tjuven gick ut genom fönstret). Friherrinnan och Elsa kom uppför huvudtrappan och lämnade torra spår. Holm gick ut genom serveringsdörren, och huset har två källartrappor – den i salen och en från köket – så gästerna hade inget att undra över. ”Flaskan är blank” i stället för ”glaset” (som kunde läsas som ett dricksglas). Slutsatsfrågan gäller vem som lämnade salen ”under middagen”. |
| 2 | Läkaren skriver att slaget kommer från ett tungt föremål, inte från ett fall. Förut uteslöt inget fynd anklagelsens alternativ ”Berg föll och slog sig”. Lind fann Berg på golvet och doktorn lade upp honom på kojen, vilket förklarar dunsen. Fröken Nyqvist stod i korridoren och såg att kedjan satt på när Lind klippte den – det låsta rummet vilar inte längre bara på den misstänkte konduktörens ord. Fyndet om fru Ahls kedja säger att den var hakad inifrån när Lind kom, inte ”hela natten”, som han inte kunde veta. Fru Ahl var vaken *under stoppet*, som slutade med dunsen. Lyktan lyste in ”genom isen på rutan” (fönstret är fastfruset). Sundin säger att konduktören var ute ”när vi stod i Boden” i stället för ”en kvart” (Lind var borta drygt 20 minuter). |
| 3 | Rutnätets instruktion säger att plats 2 och 3 räknas som grannar (närmast den lediga kortänden; i 3D sitter de mitt emot varandra), och att Dryck är vad var och en drack före middagen. Vinflaskan gäller ”vinet till förrätten”. |
| 4 | **Kopian hittas** (Martins beslut): en silverskål med slät kant och släta handtag står högst upp på bokhyllan i Gunnars kontor (nytt fynd *Skålen i kontoret*; fallet har nu 16 fynd). Förut visade inget i spelet vem som tog kopian från skänken, och efterordet sa att den låg i Gunnars bil. Bytet räknas från fotots tid 09.10, inte från inläggets 09.12, i frågor, fynd och bildremsan. Frågan om vem som var på gården gäller fram till bussens ankomst 15.14. Olle bar *in* tårtan och tog bilden ”åt farbror Gunnar” (det fanns ingen faster). Vasen står till höger på skänken och ljusstaken till vänster, som på bilderna efter 16.05. |
| 5 | Väggklockan hänger nu bredvid fönstret med den uppbrutna luckan, som texten säger. Den satt på motsatta väggen, nästan fyra meter bort, fast Rapp enligt lösningen slet ned den när han klättrade ut genom fönstret. Köksuret hos Rapps visar 00.25, inte samma minut som pendylen i urmakeriet (23.52) – man åker droska mellan platserna. Heldragna tidskort kommer från ”andra källor än personen själv – vittnen, papper och klockor”, inte ”oberoende källor” (hustrun vittnar om sin man). |
| 6 | Doktorns anteckning vid kroppen är skriven 06.30, när Elof hade hämtat honom. Förut stod 06.10, fast han satte barografmärket 06.00 på stationen och vägen tar tio minuter. Anteckningen säger att kläderna är torra, vilket utesluter ”föll från galleriet i stormen”, och att döden inträffade ”några timmar” före sex (03.20). Lagerkvist är ”läkare och meteorolog”. |

**Kvar till senare (Martins beslut: svårigheten höjs när spelet är klart i grunden):** flera fynd- och frågetexter drar slutsatsen åt spelaren, till exempel vasen i fall 1, fru Ahls kedja i fall 2, bläckkommentaren i loggboken i fall 6 och personbeskrivningarna som avslöjar yrkena i fall 3. Namnen återkommer mellan fallen (Holm, Berg, Lind/Lindh) – det är inget fel, men kan ses över.

### Andra blindgranskningen (samma dag)

En ny blind agent, som inte visste något om den första rundan, granskade de rättade spelarvyerna och letade bara efter det som är ologiskt eller inte stämmer, inte efter svårighet. Rapport: `docs/blindtest/rapport-2026-11-04-andra.md`. Alla sex fall löstes rätt igen, och varje oskyldig och varje felaktigt hur-alternativ kunde uteslutas. Rättat:

| Fall | Rättning |
|---|---|
| 1 | Sovrummets pendyl visade 21.14, bara fjorton minuter efter upptäckten, fast Strand hunnit förhöra gästerna och detektiven hunnit fram. Nu visar den 22.41 och salens 22.55. Middagen började klockan åtta (pendylen slog åtta när friherrinnan satte sig, och Elsa serverade förrätten, soppan och steken), så att tiden 19.55–20.30 också täcks. Friherrinnan och Elsa gick upp *klockan* nio, inte ”strax efter nio”, eftersom dörren var låst kl. 21.00. Sovrummets dörr leder till övre hallen, dit både huvudtrappan och tjänstetrappan kommer. Golvet vid tjänstetrappan skurades vid åttatiden, före Holms tur. Långbordet har sexton kuvert – femton gäster och friherrinnan – med friherrinnan och Gustav vid var sin kortände; de två platserna finns nu också i 3D. Slutsatsfrågan gäller vem som var borta från salen *innan friherrinnan gick upp klockan nio*. |
| 2 | Dörren till kupé 2: kedjan satt på ”när han knackade kl. 06.15”, inte ”i natt”. |
| 3 | Digitalis verkar inte på sekunden: översten drack sitt vin till förrätten och segnade ner en halvtimme senare, när varmrätten bars in. Placeringskorten blåste ut över verandan, där de ligger, inte ”bort i trädgården”. |
| 4 | **Skänken och fönstret bakom den sitter nu på salens södra vägg, mot gården.** Förut vette fönstret bort från gården, fast bilderna visar Lenas bil och kaffebordet genom det. Salen är speglad, så allt annat står som förut i förhållande till skänken. Mikael hade lånat ut ett kakfat till kaffet, inte en tårtbricka – tårtan bars in först efter att han gått. Lenas syster heter Birgitta Nordin, inte Sahlin. Slutsatsfrågan om kopian frågar om brudskålen stals då, eftersom den som tog kopian ju var Gunnar. |
| 5 | Spånen ligger från arbetsbänken fram till montern och fönstret, alltså där tjuven gick. ”Ekspån luktar gott” i stället för ”Ek luktar gott”, som kunde läsas som gesällen Karl Ek. Fru Lindh hämtades av en konstapel – hon kunde inte veta att handsken hittats. Spårvagnsbiljetten ligger på bordet, inte i luften. Rapp ”står bland de närvarande” i protokollet. |
| 6 | Stormen har ”mojnat så pass” att en båt kan lägga till – rummen visar fortfarande blåsten. Väderstationen ligger på öns *södra* udde, åt samma håll som dörren, och tvärs över viken – fågelvägen knappt hundra meter – så att doktorn kan höra dunsen. Signe såg att fyren blinkade som vanligt (förut ”såg ingenting”, som kunde läsas som att fyren var släckt). Kläderna är torra ”de sista timmarna” (Holger gick till tornet genom stormen vid tio). Elof har *lagt fram* papperen. Signe gick inte ut ”förrän vid sex”, i stället för ”aldrig”. Köksklockan visar 6.45, tjugo minuter före stationens klocka – det tar mer än tio minuter att gå mellan dem. |

**Inte ändrat:** vagnens mått i fall 2 (kupé och korridor bredare än en verklig vagn) och att utredningen i fall 5 går fort – det är förenklingar i spelet, inte motsägelser i fallet. Att samma namn återkommer mellan fallen (Holm, Berg, Anton, Lind/Lindh/Lund) och vem spelaren är i nutid (Maja Strand) får vänta på Martin.

## Vägledning: så löser du ett fall, hjälpen i lampan och signal när man fastnat (november 2026)

Martin frågade efter ett enkelt sätt att hjälpa den som fastnat, tydligare ledtrådar och en bättre förklaring av vad spelet går ut på, och bad om alla fyra delarna i förslaget. Inga pussel eller lösningar ändras, och poängen är densamma som förut.

1. **”Så löser du ett fall”** – fyra steg (Undersök, Läs fynden, Tänk i boken, Anklaga) och en rad om lampan. Rutan är utfälld på fallets första sida tills man har startat ett fall en gång, och sedan ihopfälld. Kortet kan också öppnas från hjälpen i lampan. Handledningens sista steg nämner det gratis tipset.
2. **Lampan är en hjälpstege.** Först ett **gratis tips** om nästa steg, som räknas fram ur hur långt spelaren har kommit: en ny fråga under Slutsatser, rummet man står i eller ett annat rum med mer att hitta, en mekanik i boken som inte är klar (hur många motsägelser, upptäckter eller steg som återstår, och hur man gör), ett låst moment och vägen dit, eller till sist att det är dags att anklaga. Tipset pekar på *var* och *hur*, aldrig på vem. Därefter de tre ledtrådarna som förut (−10/−25/−50 poäng) och sist ”Jag ger upp – visa lösningen”. Platser-fliken i boken visar samma tips.
3. **Fastnat-signal.** Har spelaren inte hittat, löst eller besvarat något på fyra minuter (tiden i anteckningsboken räknas med, men signalen väntar tills boken och korten är stängda) börjar lampan glöda och ett meddelande säger ”Fastnat? Tryck på lampan – första tipset är gratis.” Signalen ges en gång per stopp och slutar när lampan öppnas eller spelaren kommer vidare. Med ”minska rörelser” i systemet lyser lampan i stället för att pulsera.
4. **Jämnare ledtrådar i alla sex fall.** De tre ledtrådarna har nu fasta roller och rubriker: *1 · Var du ska titta*, *2 · Frågan att ställa* och *3 · Nästan svaret*. Tipset säger var i spelet (rum, flik, fråga), ledtrådarna vad i logiken – de upprepar inte varandra. Ingen ledtråd nämner den skyldiges namn eller roll. Borta är bland annat ”Den som reste i kupé 2” (fall 2), ”hen” och ”pastorn” (fall 3), ”berättarens dagbok” (fall 6) och påståendet i fall 5 att ”varje nyckelinnehavare” gick hem. Nivå, kostnad och pussel är oförändrade; bara ledtrådarnas text och `kraver` har ändrats. Ledtråd 3 i fall 3 räknar upp hela kedjan i rutnätet utom det sista steget.

Pekaren (”Du har inte hittat allt som behövs …”) har också förbättrats: den följer nu följdfrågor som låses upp av fynd och slutsatsfrågor som saknar underlag, i stället för att stanna vid ”arbeta under Slutsatser”. Den nämner inte personer vid namn längre (”prata med personerna där”), så att den aldrig råkar peka ut den skyldige.

Rättat på vägen:
- Bekräftelsen för ledtråd 2 och 3 sa att den kostade 10 poäng, fast knappen (och poängräkningen) sa 25 och 50.
- Fall 1: fyndet om middagen säger att friherrinnan och Elsa gick upp *klockan nio*, inte ”strax efter nio” (dörren var låst kl. 21.00).
- ”Hen” är ett nutida ord och passar inte 1897 och 1934. Fall 2: slutsatsens alternativ säger ”Den kunde …”/”Den måste …”. Fall 5: uppdraget är ”hur hann tjuven?”, och tidslinjens kort och prövningar talar om ”personen”. I förhören står personens namn (”Kanske har fru Ahl mer att säga”).
- Arbete i rutnätet och i anteckningarna räknas som framsteg, så att fastnat-signalen inte kommer mitt i arbetet.

Agenten som skrev ledtrådarna granskade också texterna i del 1–3, och de flesta förslagen är med: stegen nämner personer och räknaren, steg 3 heter ”Koppla ihop i boken” och gäller bara fall som har ett pussel, anklagelsen nämner de två försöken och att rätt bevis ger ett extra förstoringsglas, meddelandet säger ”ett gratis tips om vad du kan göra härnäst” (förut ”första tipset är gratis”, som kunde läsas som att ledtråd 1 var gratis), och det heter ”lampan” överallt.

`verktyg/spelarvy.mjs --ledtradar` skriver ut ledtrådarna i lampan för ett blindtest av att de hjälper stegvis.

### Blindtest av ledtrådarna (samma dag)

En ny blind agent fick bara spelarvyn och ledtrådarna (`verktyg/spelarvy.mjs --ledtradar`) och prövade dem som en spelare som har fastnat: vad säger varje ledtråd, vem pekar den ut om man bara läser ledtrådarna, och stämmer den med fallet? Rapport: `docs/blindtest/rapport-2026-11-04-ledtradar.md`. Ingen ledtråd nämnde den skyldiges namn, och alla tider och platser stämde – utom en. Rättat:

| Fall | Rättning |
|---|---|
| 3 | **Sakfel i ledtråd 2:** den sa att man med advokaten på plats 4 skulle se ”vad som blir kvar för David att dricka”, men David får whisky utan problem – motsägelsen kommer först när de två sista ska placeras (uppgift L5). Texten säger nu det. Ledtrådarna skriver ”uppgift L3 i rutnätet” så att L1–L9 inte blandas ihop med ledtråd 1–3. |
| 2 | Ledtråd 2 nämnde kupé 2 tre gånger och pekade därmed ut den som reste där redan på nivå 2. Nu: ”ta reda på hur det såg ut på andra sidan dörren”. Ledtråd 3 drar inte längre slutsatsen själv, utan frågar vems berättelse om natten som inte går ihop. |
| 4 | Ledtråd 1 säger inte längre exakt vad på skålen man ska titta på. Ledtråd 3 citerade den skyldiges egna ord två gånger och utelämnade att Lena åkte halv nio, före morgonbilden. Nu: skålen byttes mellan 09.10 och 15.14, Lena var borta hela tiden, och frågan är vem som var kvar och vems berättelse inte stämmer med bilderna. |
| 6 | Ledtråd 2 frågade ”med vilken penna?”, som ledde rakt till den enda reservoarpennan. Pennan kommer nu först i ledtråd 3. |

**Kvar för Martin:** i alla sex fall beskriver ledtråd 3 den skyldige med något bara den personen har, så det sista steget blir att slå upp vem det är. Det är tänkt som ”Nästan svaret”, men nivån kan sänkas om ledtrådarna känns för givmilda.

## Fall 7 – Sista akten (november 2026)

Martin bad om en fortsättning: fall 7 först, sedan fall 8 och vidare. En extra agent byggde teaterföremålen medan fallet skrevs.

**Fallet:** Teater Lyran i Göteborg, oktober 1952. Mitt i premiärens andra akt faller en sandsäck från lindraget och landar på kritkrysset en meter från stjärnan Viveka Sterner. Fyra rum – scenen, lindraget, undre maskineriet och logekorridoren – och förhör som kärnmekanik. Källa: `verktyg/fall/sista_akten.py`.

| Dimension | Fall 7 | Variationsreglerna |
|---|---|---|
| Miljö / epok | Teater, 1950-tal | Ny miljö. Kapitel II har nu 1890-, 1930- och 1950-tal. |
| Brott | Sabotage (mordförsök) | Ny brottstyp. Stöld och mord förekommer redan två gånger var bland de fem senaste. |
| Kärnmekanik | Förhör och motsägelser | Fall 6 hade dokument; förhör användes senast i fall 2. |
| Skyldig / motiv | Den mest sympatiska (sufflösen) / rädsla | Profilen och motivet är nya i rotationen. |
| Twist | Ingen | Fall 6 hade en vändning. |

**Lösningen i korthet:** linan har lyfts av nageln, så någon stod på lindraget kl. 21.32. Brandvakten såg att ingen gick uppför järnstegen; den andra vägen är spiraltrappan från undre maskineriet, dit man bara kommer med nyckel (Kalle och fru Wall) eller genom sufflörluckan. Kalle stod vid regnmaskinen under inspicientens ögon, Märta i kulissen bredvid brandvakten och Wern på rad 7 framför spelaren. Fru Wall säger att hon inte lämnade luckan – men när Ågren tappade repliken kl. 21.30 var den tom. Sandsäcken föll på kritkrysset, fru Sterners plats före generalrepetitionen som bara fru Wall missade, och hennes manus säger fortfarande ”V. vid krysset”.

**Nya föremål** (`js/tre/foremal/teater.js`): ridå, sufflörlucka, nagelbänk, sandsäck, järnstege, golvmärke (kryss/tejp), sminkbord, kuliss, klädställning och strålkastare. Omslaget `bilder/fall7/teatern.jpg` är tills vidare en sepiatonad bild ur 3D-scenen – de andra omslagen är tecknade, och ett tecknat omslag får Martin ta ställning till.

**Blindtest:** en blind agent löste fallet rätt (säkerhet 4/5) med bara spelarvyn. Rapport: `docs/blindtest/rapport-2026-11-04-fall7.md`. Rättat efter den: Märtas alibi gäller till ridån; scenen har två luckor och båda är fastskruvade; sufflörluckan sitter i rampljuset, så ingen kommer ner i den från scenen utan att publiken ser det; slutsatsfrågan om krysset frågar vem som fortfarande trodde att fru Sterner stod där (förut kunde ”hon ville bara skrämma” inte uteslutas); fru Sterner sa ut sitt krav i korridoren så att alla hörde; fru Wall har låga skor; ”belagd lina”.

## Fall 8 – Nyårsnatten på Vitanäs (november 2026)

Martin ville att fall 8 skulle utspela sig i ett ganska stort slott. En extra agent byggde slottsföremålen medan fallet skrevs.

**Fallet:** Vitanäs slott i Skåne, nyårsafton 1912. Under nyårsbalen dödas greve Edvard Vinge i biblioteket, mitt i ett telefonsamtal till överste Rehnberg. Sex rum – biblioteket, porträttgalleriet, balsalen, rökrummet, telefonväxeln och terrassen i snön – och tidslinje som kärnmekanik. Källa: `verktyg/fall/vitanas.py`.

| Dimension | Fall 8 | Variationsreglerna |
|---|---|---|
| Miljö / epok | Slott, 1910-tal | Ny miljö och ny epok. |
| Brott | Mord | Mord förekommer en gång bland de fem senaste (fall 6). |
| Kärnmekanik | Tidslinje | Fall 7 hade förhör; tidslinje användes senast i fall 5. |
| Skyldig / motiv | Auktoritet (ryttmästaren) / pengar och rädsla | Följer rotationen efter fall 7:s sympatiska sufflös. |
| Twist | Ingen | Senaste vändningen var fall 6. |

**Lösningen i korthet:** växeljournalen och telefonisten ger brottstiden 23.16. Fönstret är haspat och snön orörd, så gärningspersonen kom inifrån. Axel dansade kadriljen 23.14–23.22, fröken Sand låg i gästflygeln 23.10 (åtta minuter bort) och Lunde stod vid fyrverkeriet med trädgårdsmästaren. Ryttmästare Ekwall satt ensam i rökrummet från 23.05, säger att han satt kvar till halv tolv men dansade valsen 23.24 – och östra trappan till biblioteket tar tre minuter. I rökrummets spis ligger den brända växeln med grevens förfalskade namnteckning, och under skrivbordet en vit herrhandske; ryttmästaren dansade valsen utan handskar.

**Nya föremål** (`js/tre/foremal/slott.js`): biljardbord, väggtelefon, telefonväxel, rustning, flygel, notställ, kakelugn, pelare, gobeläng, balustrad, slottsfasad, fyrverkeri och kandelaber. Omslaget `bilder/fall8/vitanas.jpg` är, som för fall 7, en sepiatonad bild ur 3D-scenen tills Martin bestämt om de ska vara tecknade.

**Blindtest:** en blind agent löste fallet rätt (säkerhet 5/5) med bara spelarvyn. Rapport: `docs/blindtest/rapport-2026-11-04-fall8.md`. Rättat efter den: en slutsats sa ”åtta minuter” till biblioteket och tillbaka (det är sex); gångtiden terrassen–biblioteket är 5 minuter, som via balsalen eller rökrummet; kaptensgraden i kavalleriet hette ryttmästare 1912; hovmästaren fick telefonistens besked tjugo i tolv och gick upp kvart i tolv; biblioteket och galleriet ligger en trappa upp; växeln som greven hade framför sig finns inte kvar på skrivbordet; Lunde stod vid orkestern från kvart i elva; en ny slutsatsfråga utesluter fröken Sand; språkliga rättelser.

## Buggfixar får slås ihop direkt (november 2026)

Martin har bestämt att Claude själv får slå ihop rena buggfixar – sådant som redan är fel – när alla tester är gröna, eftersom han inte alltid hinner testa direkt. Varje sådan fix skrivs in här. Nya fall och förbättringar som ändrar hur något fungerar eller ser ut lämnas som pull request till Martin. Regeln står också i `CLAUDE.md`.

### Buggfix: rummen i löptext (november 2026)

Det gratis tipset, pekaren och slutsatsvyn skrev rummen med stor bokstav och alltid med ”i”: ”här i Scenen”, ”i Gården”, ”Gå till Sovrummet”. Varje rum har nu fältet `text_i` (”på scenen”, ”i sovrummet”, ”på Österlånggatan”), och texterna blir ”Det finns mer att hitta här på scenen” och ”Gå till sovrummet och undersök fönstret”. Gäller alla åtta fall.

### Buggfix: fall 8 efter andra blindgranskningen (november 2026)

En ny blind agent granskade fall 7 och 8 med nya ögon (rapport: `docs/blindtest/rapport-2026-11-05-fall7-8.md`). Fall 7 hade inga fel; sufflörluckan beskrivs nu som ”alldeles innanför ridån”. I fall 8 rättat:
- **Vägen gick inte att bevisa.** Gärningsmannen hann lika gärna genom galleriet som uppför östra trappan. Nu stod hovmästaren i dörrarna mellan balsalen och galleriet från 23.10 (nytt fynd *Ingen genom galleriet*), och en ny slutsatsfråga leder till östra trappan.
- **Telefonsamtalet höll inte ihop.** Telefonisten kunde inte både ”ligga kvar en stund” och höra dörren och dunsen fyra minuter senare. Nu lägger hon ifrån sig hörtelefonen som hon ska, ser klaffen falla 23.16 och skriver ner vad överste Rehnberg hörde när Strand ringer honom tio över tolv. Greven hann aldrig säga namnet.
- Greven ligger under väggtelefonen bakom skrivbordet (förut tre meter bort), handsken ligger under skrivbordet, kammarjungfrun ser på korridorsklockan (ett tornur slår inte ”tio över”), trädgårdsmästaren motsäger inte sig själv, hovmästaren går upp tjugo i tolv och finner greven kvart i tolv, gångtiderna gäller ”även med brådska”, och den brända växeln är från Ystads Sparbank i stället för den påhittade ”Skånska Banken”.

## Fall 9 – Fjällgården, 1968 (november 2026) – ihopslaget 5 november på Martins begäran efter blindtest

Martin gav friare tyglar över natten och bad om fortsättning med fall 8, 9 och vidare. Fall 9 är spelets första **tidshopp** (twisttyp 7 i `docs/forslag-v1.md` 3.3: ”ett gammalt kallt fall utreds med bara dokument”). Ingen ny mekanik – kärnan är dokumentmekaniken från fall 6.

**Fallet:** Oktober 2026. Fjällgården i Storlien renoveras, och bakom en panel i skidrummet hittar snickaren Birgit Hallströms skidor, pjäxor och packade resväska. Hon försvann i en snöstorm 1968, man trodde att hon gett sig ut på skidor, och fallet – Nils Strands sista – lades ned. Kriminalinspektör Maja Strand, hans barnbarns barn, läser den gamla akten igen. Tre rum: skidrummet, lobbyn och polisens arkiv i Östersund. Källa: `verktyg/fall/fjallgarden.py`. Ligger sist i kapitel II, som de andra twistfallen ligger sist i sina kapitel.

| Dimension | Fall 9 | Variationsreglerna |
|---|---|---|
| Miljö / epok | Fjällhotell, nutid (fallet från 1968) | Kapitel II hade ingen nutid. |
| Brott | Försvinnande | Ny brottstyp; mord finns två gånger bland de fem senaste. |
| Kärnmekanik | Dokument | Fall 8 hade tidslinje; dokument senast i fall 6. |
| Skyldig / motiv | Familj (ägarens son) / kärlek | Följer rotationen efter fall 8:s auktoritet och pengar. |
| Twist | Tidshopp | Senaste vändningen var fall 6 (opålitlig berättare). |

**Lösningen i korthet:** skidorna, pjäxorna och den röda anoraken låg bakom panelen, och Birgit hittades i tofflor – hon gick aldrig ut på skidor. Claes Rydén sa 1968 att han såg henne gå ut genom skiddörren 22.10 i röd anorak, men dörren låstes med kistlås 21.50 och nyckeln låg i portierns ficka. Direktören avfärdade portierns tider med att klockan gick fel – men hans egen signatur i klockboken säger att den gick rätt. Bara Claes gick ner i källaren efter Birgit, och han kom upp med snö i håret. Han lät spika igen panelen tre dagar senare. Hjort satt i baren, Holst talade i telefon och fru Rydén spelade bridge.

**Nya föremål** (`js/tre/foremal/fjall.js`, byggda av en extra agent): skidor, pjäxor, uppbruten panel, arkivlåda, byggarbetslampa, byggplast och skidställ. Omslaget är som för fall 7 och 8 en sepiatonad bild ur 3D-scenen.

**Blindtest:** en blind agent löste fallet rätt (säkerhet 5/5) med bara spelarvyn. Rapport: `docs/blindtest/rapport-2026-11-05-fall9.md`. Rättat efter den: biljetten gäller söndag 18 februari (förut ”lördag–söndag”) och är oklippt; Sune bommade varuintaget vid nio och det går inte att öppna utifrån (förut var det inte stängt som väg in); det finns bara en nyckel till skiddörren; ån forsar hundra meter bort och fryser inte vid forsen; Birgit tänkte ställa väskan vid skiddörren för att gå direkt till stationen i gryningen; Sune nämner att han själv gick ner och låste; panelens ålder bevisas av snickarboken, inte av trådspiken; ledtråd 3 frågar hur Claes kom ut med snö i håret; en slutsatsfrågas felsvar gäller nu både direktören och fru Rydén.

## Martins beslut 5 november 2026

- **Rangkraven** höjs inte.
- **Ledtråd 3** behåller sin nivå (”Nästan svaret”) så länge fallen inte blir för svåra.
- **Omslagen** till fall 7 och framåt får vara sepiatonade bilder ur 3D-scenerna – ”gammaldags är okej”.
- **Kapitel III** börjar med fall 10 (`fall/index.json`, låses upp när kapitel II är avslutat eller vid rangen Kriminalassistent).
- **Riktiga 3D-modeller** (verklig grafik) ska läggas in även i fall 7–9 – det görs på en egen gren av en extra agent.

## Fall 10 – Grönt bläck (november 2026) – ihopslaget 5 november på Martins begäran efter blindtest

**Fallet:** S/S Vätterstjärnan på Göta kanal, juli 1925. Under natten har någon skjutit in ett utpressningsbrev i grönt bläck under konsul Wahlgrens hyttdörr. Konstapel Nils Strand är på semester ombord. Tre rum – hyttkorridoren, salongen och promenaddäcket – och logikrutnät som kärnmekanik: purserns hyttlista är bortriven, och spelaren pusslar ihop vem som bor i vilken hytt, vilket yrke var och en har och vad var och en skriver med. Källa: `verktyg/fall/gront_black.py`. Första fallet i kapitel III.

| Dimension | Fall 10 | Variationsreglerna |
|---|---|---|
| Miljö / epok | Kanalångare, 1920-tal | Ny miljö; kapitel III börjar i 1920-talet. |
| Brott | Utpressning | Ny brottstyp; mord finns två gånger bland de fem senaste. |
| Kärnmekanik | Logikrutnät | Fall 9 hade dokument; rutnätet användes senast i fall 3. |
| Skyldig / motiv | Främling (en tystlåten medpassagerare) / hämnd för en dödsolycka | Följer rotationen efter fall 9:s familj och kärlek. |
| Twist | Ingen | Fall 9 hade tidshopp. |

**Lösningen i korthet:** stewarden satt vid trappan mellan hytt 2 och 3 hela natten och akterdörren var låst, så brevet kom från hytt 3 eller 4. Brevet är skrivet med grönt bläck – det finns bara en flaska ombord – på ett blad ur ritblocket på däcket. Rutnätet (sju uppgifter, exakt en lösning, ingen överflödig) ger hytt 3: journalisten Rut Malm, som skriver allt på maskin, och hytt 4: ingenjören Oskar Ring med det gröna bläcket.

**Kodändringar (små, för att rutnätet ska kunna gälla något annat än ett middagsbord):** `js/mekaniker/logikrutnat.js` kan rita en korridor med hytter i rad (`bord.typ: 'korridor'`, med vakt och sista hytt), och rubriken över uppgifterna (`ledtrad_rubrik`) och texten när rutnätet är löst (`lost_text`) kan sättas per fall. Fall 3 ser ut och fungerar som förut. Ny föremålsfil `js/tre/foremal/skepp.js` med en livbåt. Omslaget är en sepiatonad bild ur 3D-scenen.

**Blindtest:** en blind agent löste fallet rätt (säkerhet 5/5) och bekräftade att rutnätet har exakt en lösning; svårigheten kändes som 2 av 5. Rapport: `docs/blindtest/rapport-2026-11-05-fall10.md`. Rättat efter den: den gröna bläckflaskan står i hytt 4, som är låst när passageraren inte är där (förut kunde Rut i teorin ha lånat bläcket); ledtråd 3 ger nu en startpunkt i rutnätet i stället för att bygga på det lösta rutnätet; konsuln säger när han hittade brevet; stewarden säger att korridoren var tom när han satte sig; språkrättelser. Martin bad 5 november att fallet skulle läggas in i spelet om blindtestet gick bra.

## Buggfix: halvladdade omslag i menyn (november 2026)

Martin såg i mobilen att omslagen till fall 5 och 6 bara visade de översta raderna och grått under. Bildfilerna är hela; det var så iOS visar en JPEG som bara hunnit laddas ner delvis, troligen medan den nya versionen cachades. Menyn hämtar nu omslagen själv och visar dem först när filen är hel (en JPEG ska sluta med slutmarkören FF D9). Fattas något görs två nya försök; under tiden syns en mörk ruta i stället för en halv bild. Färdiga omslag sparas i minnet så att menyn inte laddar om dem. Ändrat: `js/vyer/meny.js`, `css/stil.css`. Slogs ihop som buggfix enligt regeln ovan.

## Buggfix: den första bilden i bildjämförelsen syntes inte (november 2026)

I fall 4 säger Olle ”det syns ju på bilden” och visar sin mobil, och anteckningsboken säger ”Nytt: Bild: Olle med tårtan” – men fliken Bilderna visade bara en knapp och texten ”Du behöver minst två bilder”, så bilden gick inte att se förrän man hade hittat en till. Nu visas den enda bilden direkt, med texten ”Du behöver en bild till för att kunna jämföra”. Att trycka i den gör ingenting förrän det finns två. Ändrat: `js/mekaniker/bildjamforelse.js`. Slogs ihop som buggfix.

## Buggfix: granskning av fall 1–10 (november 2026)

På Martins begäran gick två granskare igenom alla tio fall: text, logik och hur rummen ser ut i båda stilarna. Lösningarna, de skyldiga, mekanikerna och svårigheten är oförändrade. Varje fall går fortfarande att lösa med logik, med exakt en bevisbar skyldig. Det som rättades var motsägelser mellan text och 3D, språk och några fel i rummen. Rapporterna med före/efter per fall finns i `docs/granskning/2026-11-fall1-5.md` och `docs/granskning/2026-11-fall6-10.md`.

Rättelser i urval:
- **Fall 1:** fönstret är öppet överallt (inte ”på glänt” på ett ställe), och förklaringen av kulissen är rättad.
- **Fall 2:** Strand reser till Narvik i stället för Kiruna. Tåget hade redan passerat Kiruna när han står i kupédörren. Tidtabellen före Boden är nu realistisk (Vännäs, Bastuträsk). Tiderna i Boden är oförändrade.
- **Fall 3:** läkarväskan står vid verandadörren, eftersom det inte finns någon trappa. Utsikten tar inte längre slut i en rak kant.
- **Fall 4:** gästernas bilder visar samma vas och ljusstake som salen. S:et på försäkringsfotot syns.
- **Fall 5:** den hela fönsterluckan mot gatan är borttagen. Höstlöven på fönsterblecken är borta, eftersom det är december. Kusken tilltalar inte längre spelaren som ”herrn”.
- **Fall 6:** tilltalet i upplösningen är enhetligt, och motivet påstår inte längre något spelaren aldrig ser.
- **Fall 7:** repliker som angav fel plats är rättade.
- **Fall 8:** journalen och anteckningsboken svävade inte längre. De står på ett sidobord. Galleriets tavlor är porträtt. Dörrarna kallas inte längre glasdörrar.
- **Fall 9:** datorn i arkivet står på bordet och visar ärendet. Personalfotot är ett foto.
- **Fall 10:** skrivbordet blockerade inte längre dörren till däcket.
- **Tidslinjen:** prövningen skrev ”vid montern” i alla fall. Nu används fallets egen plats, till exempel ”i biblioteket”.

Små kodändringar, alla bakåtkompatibla:
- `tavla` har fått fältet `motiv` (`portratt`/`foto`).
- `fonster` har fått fältet `lov: false`.
- Verandans panorama i `motor3d.js` går nu tre kvarts varv runt.
- S:et på försäkringsfotot har fått kontur i `bildjamforelse.js`.
- Prövningstexten i `tidslinje.js` hämtar fallets plats.

Förslag som kräver Martins beslut (snö på terrassen och i urmakeriet, nytt omslag till fall 3, motivet i fall 3, rummens lägen i fall 7 med mera) står sist i respektive rapport.

## ”Rätta till allt”: förslagen från granskningen genomförda (november 2026)

Efter överblicken och granskningen bad Martin den 10 november att allt på listorna skulle rättas. Lösningarna, de skyldiga, mekanikerna och svårigheten är oförändrade.

**Startvyer och sidhuvud**
- **Fall 8:** biblioteket var nästan svart i startvyn. Det har fått en fotogenlampa på skrivbordet och en vägglampa.
- **Fall 7:** startvyn visar nu sandsäcken, inte en skådespelare på en halvmeters håll.
- **Fall 6:** startvyn visar kroppen vid trappans fot.
- **Rumsnamnet i sidhuvudet** bryts aldrig på flera rader. Ett långt namn kortas med … och räknaren (”3 kvar här”) syns alltid.

**Snö**
- Ny golvtyp `golv.typ: "sno"` och två föremål, `trampad_sno` och `snodriva`.
- **Fall 8:** terrassen är snötäckt. Snön är nertrampad runt fyrverkerilådorna och i en stig från dörren, och orörd i övrigt, som texterna säger.
- **Fall 5:** Österlånggatan är snötäckt, och innanför den uppbrutna luckan ligger en liten driva av insnöad snö. Gatan har inga fotspår, så att ingen tror att de är ett bevis.

**Fall 3**
- Översten är vänsterhänt och ville alltid ha glaset till vänster. Det står i personbeskrivningen och vid glaset.
- Motivet antyds nu i spelet: enligt protokollen hade översten ”en tråkig sak om pengar” att ta upp efter kaffet. Upplösningen knyter an till det.
- **Nytt omslag (11 november):** den tecknade bilden visade ett runt bord, men pusslet har ett avlångt. Martin bad att det skulle rättas, så omslaget är nu en sepiatonad bild ur 3D-verandan, som i fall 7–10: avlångt bord, fem kuvert och fjärden bakom. Det är det enda omslaget i kapitel I som inte är tecknat. En tecknad bild kan ersätta det senare utan andra ändringar (`bilder/fall3/verandan.jpg`).

**Fall 6**
- Kroppen ligger nu tvärs över trappans första steg, som texten säger.
- Johans spjälkade ben syns (nytt tillval `spjalk` på personer).
- Loggboken och väderjournalen visas som handskrivna. 04-raden, som är skriven med bläck, lutar åt andra hållet.

**Fall 7**
- Rummen har samma väderstreck och hänger ihop. Järnstegen kommer upp i lindraget på samma ställe som den står på scenen, genom en lucka i golvet.
- Spiraltrappan går i ett eget trapphus bakom fondväggen, utan dörr mot scenen. Därför kan brandvakten inte se den, vilket lösningen förutsätter. Texterna säger det nu.
- Undre maskineriet är hela utrymmet under scenen: stegen står under sufflörluckan i scenkanten och spiraltrappan i trapphuset. Skylten om scenluckorna sitter på en stolpe under luckorna.
- Regnmaskinen som Kalles alibi bygger på står nu bakom högra kulissen, en meter från inspicientens pulpet.
- Dörren till undre maskineriet i logekorridoren sitter intill scendörren.

**Fall 8–10**
- **Fall 8:** dörren till östra trappan sitter på bibliotekets östra vägg.
- **Fall 9:** texten om den uppbrutna panelen stämmer med hur den ser ut (furupanel, inte ”pärlspont … som resten av rummets panel”).
- **Fall 10:** kaffekanna, koppar och Teodors tidning står på salongens bord, och däcket har riktiga däcksstolar.

**Fall 2:** Strand reser till Narvik, som granskningen ändrade till. Kiruna-alternativet valdes bort.

Nya föremål och fält står i `README.md`.

## Fall 11 – Låda sju (november 2026) – väntar på Martin

Martin bad den 11 november att det som var kvar skulle göras: omslaget till fall 3 (ovan) och ett fall till i kapitel III, som bara hade ett. Fallet ligger som pull request tills Martin har sagt ja, enligt regeln om nya fall.

**Fallet:** Storbergets gruva i Bergslagen, måndagen den 8 mars 1943. Den hemliga transportplanen för malmtågen ligger i ritkontorets förseglade låda sju. På eftermiddagen hittas förseglingsremsan avsliten; ingenting är stulet, men bladen ligger i fel ordning. Kommissarie Nils Strand och spelaren kommer från Örebro på kvällen. Tre rum – ritkontoret, disponentens rum och gruvbacken i snön – och bildjämförelse som kärnmekanik: jubileumsfotografen har tagit fyra bilder av ritkontoret under dagen. Källa: `verktyg/fall/lada_sju.py`.

| Dimension | Fall 11 | Variationsreglerna |
|---|---|---|
| Miljö / epok | Gruvkontor, 1940-tal (beredskapstid) | Ny miljö och ny epok. Fall 10 var en kanalångare 1925. |
| Brott | Spionage | Ny brottstyp. |
| Kärnmekanik | Bildjämförelse | Fall 10 hade logikrutnät; bildjämförelse användes senast i fall 4. |
| Skyldig / motiv | Den mest sympatiska (ritaren) / ideologi | Fall 9 familj och kärlek, fall 10 främling och hämnd. |
| Twist | Ingen | Fall 9 hade tidshopp. |

**Lösningen i korthet:** Ingenjör Falk förseglar alltid med remsan till vänster om handtaget. På bilden 09.15 sitter den där, på bilden 11.40 sitter en remsa till höger: lådan öppnades och förseglades om på förmiddagen. Remsan som slets av på eftermiddagen – när den tyske inköparen herr Kessler satt ensam i rummet – var en kuliss. Planen fotograferades med kontorets reprokamera (räkneverket har gått från 12 till 20, planen har åtta blad), och bara Falk och ritaren Maj Lindgren har nyckel till kameraskåpet. Falk och fotografen var nere i gruvan 09.30–11.30 (nedfartsboken), Kessler och disponenten kom med tåget 12.52, och vaktmästare Storm bar bara in ved. Maj Lindgren säger själv att hon satt i rummet hela förmiddagen och att ingen rörde skåpet.

**Kodändringar:**
- `js/mekaniker/bildjamforelse.js` har ett nytt motiv, `ritkontor`, med detaljerna förseglingsremsa, vedlår, gardin, lampa, väggklocka, utsikt och person. Fall 4 ritas som förut.
- Nytt i samma fil: `regioner.<detalj>.narmare`. En detalj som alltid är viktig (remsan) sorteras aldrig bort som oviktig. Jämför man två bilder som ligger för långt isär får man rådet att jämföra närmare i tid.
- Ny föremålsfil `js/tre/foremal/gruva.js`: ritbord, ritningsskåp, kameraskåp med reprokamera, kamin, vedlår, gruvlave och malmvagn.
- Omslaget är en sepiatonad bild ur 3D-scenen, som för fall 7–10.

**Inte gjort:** fallet är inte blindtestat av en fristående agent, som fall 7–10 blev. Det är genomläst i spelarvyn och spelat av testet, men ett blindtest bör göras innan eller strax efter att det släpps.
