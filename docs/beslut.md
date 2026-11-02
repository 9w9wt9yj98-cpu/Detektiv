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
