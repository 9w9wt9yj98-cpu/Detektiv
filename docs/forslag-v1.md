# Detektiv – Designförslag v1

> **Status:** Godkänt med ändringar – se [beslut.md](beslut.md). Fall 1 och 3 finns som spelbar prototyp i 3D.
> **Projektledare:** Martin Morén
> **Plattform:** Webb först (HTML/JS), anpassad för mobil i ett senare steg.
> **Målgrupp:** Vuxna. **Ton:** Klassisk deckare i stil med Agatha Christie och Sherlock Holmes, med en oväntad vändning då och då.
> **Längder:** Blandat, med korta fall (2–5 min), medellånga (10–15 min) och några långa (20–30 min).

---

## Innehåll

1. [Spelets struktur](#1-spelets-struktur)
2. [Interaktionsmekaniker](#2-interaktionsmekaniker)
3. [Progression och variation](#3-progression-och-variation)
4. [De första sex fallen](#4-de-första-sex-fallen)
5. [Öppna frågor att besluta](#5-öppna-frågor-att-besluta)

---

## 1. Spelets struktur

### 1.1 Grundprincip

Varje fall ska kunna lösas **enbart med logik och observation**. Allt som behövs för att bevisa vem som är skyldig finns i materialet. Spelaren ska aldrig behöva gissa. I slutet får spelaren se exakt vilken kedja av slutsatser som pekar ut den skyldiga och utesluter alla andra.

### 1.2 Fallets flöde

```
┌──────────────┐   ┌────────────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 1. PRESENTA- │ → │ 2. UTREDNING       │ → │ 3. LEDTRÅDAR │ → │ 4. ANKLAGELSE│ → │ 5. UPPLÖSNING│
│    TION      │   │  (mekaniker, fynd, │   │  (frivilliga │   │  (vem + hur  │   │  (förklaring,│
│              │   │   anteckningsbok)  │   │   3 nivåer)  │   │   + bevis)   │   │   poäng)     │
└──────────────┘   └────────────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
                          ↑_____________________________|
                    (ledtrådar kan tas när som helst under utredningen)
```

**1. Presentation (30–90 sek)**
- En kort inledning med plats, tid, vad som har hänt och vem som kallar in detektiven.
- Ett persongalleri med namn, roll och ett första intryck av varje person.
- Uppdraget i en mening, till exempel *”Vem tog halsbandet?”* eller *”Vem knuffade fyrmästaren?”*.

**2. Utredning**
- Spelaren använder fallets mekaniker (se avsnitt 2) och samlar **fynd** i en **anteckningsbok**.
- Fynd kan kopplas till personer eller till varandra, till exempel ”stämmer inte med” eller ”bekräftar”. Kopplingarna kan senare användas som bevis i anklagelsen.
- Vissa fynd låser upp nya platser, förhör eller dokument. Det ger fallet en naturlig progression.

**3. Ledtrådssystem (3 nivåer per fall, ibland per delmoment)**

| Nivå | Typ | Exempel | Föreslagen poängkostnad |
|---|---|---|---|
| 1 – Riktning | Pekar ut *var* spelaren ska titta | ”Titta närmare på fönsterbrädan.” | −10 % |
| 2 – Fokus | Visar *vilken slutsats* som behövs | ”Om ingen kom in genom fönstret, vilka kunde då öppna dörren?” | −25 % |
| 3 – Nästan svar | Ger kedjan nästan helt och lämnar sista steget till spelaren | ”Bara tre personer har nyckel. Två av dem satt vid bordet hela tiden.” | −50 % |

Ledtrådarna tas fram i ordning och kostnaderna läggs ihop. Ledtrådar ska aldrig ge själva namnet. Det sista steget gör alltid spelaren.

**4. Anklagelse**
Spelaren väljer:
1. **Vem** som är skyldig. Det är obligatoriskt.
2. **Hur eller när** brottet begicks. Det är ett flervalsalternativ eller en tidpunkt och kan vara frivilligt i korta fall.
3. **Bevis** i form av 1–3 fynd ur anteckningsboken som stöder anklagelsen. Det ger bonuspoäng och motverkar gissningar.

Fel anklagelse leder till en kort reaktion i berättelsen, till exempel *”Inspektören höjer ett ögonbryn …”*. Spelaren får ett nytt försök men tappar poäng. Efter två misslyckade försök visas upplösningen.

**5. Upplösning och återkoppling**
- Detektivens förklaring visas steg för steg och markerar fynden i den ordning de används.
- För varje oskyldig person visas *varför* hen kan uteslutas.
- Avledande spår förklaras, alltså varför de såg misstänkta ut men inte var det.
- Resultatet visas med betyg (1–3 förstoringsglas), använda ledtrådar, tid och om bevisen var rätt.

### 1.3 Dataformat för fall (JSON)

Fallen är **datadrivna**. Ett fall är en JSON-fil som motorn läser in. Då kan fall skrivas, genereras med verktyg eller AI, valideras automatiskt och återanvändas. Varje mekanik har ett eget `payload`-block.

**Schema (förkortat, JSON Schema draft 2020-12):**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://detektiv.example/schema/fall-v1.json",
  "title": "Detektivfall",
  "type": "object",
  "required": ["id", "version", "meta", "intro", "personer", "moment", "fynd", "losning", "ledtradar", "aterkoppling"],
  "properties": {
    "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
    "version": { "type": "integer", "minimum": 1 },
    "meta": {
      "type": "object",
      "required": ["titel", "miljo", "epok", "brottstyp", "langd", "svarighet", "karnmekanik"],
      "properties": {
        "titel": { "type": "string" },
        "miljo": { "type": "string" },
        "epok": { "type": "string" },
        "brottstyp": { "enum": ["stold", "mord", "forgiftning", "bedrageri", "forsvinnande", "utpressning", "spionage", "ovrigt"] },
        "langd": { "enum": ["kort", "medel", "lang"] },
        "uppskattad_tid_min": { "type": "array", "items": { "type": "integer" }, "minItems": 2, "maxItems": 2 },
        "svarighet": { "type": "integer", "minimum": 1, "maximum": 5 },
        "karnmekanik": { "type": "string" },
        "bimekaniker": { "type": "array", "items": { "type": "string" } },
        "twist": { "type": ["string", "null"], "description": "t.ex. 'opalitlig-berattare', 'offret-ar-gärningsman', null" },
        "kraver_rang": { "type": "integer", "minimum": 0 }
      }
    },
    "intro": {
      "type": "object",
      "required": ["text", "uppdrag"],
      "properties": { "text": { "type": "string" }, "uppdrag": { "type": "string" }, "bild": { "type": "string" } }
    },
    "personer": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "namn", "roll", "misstankt"],
        "properties": {
          "id": { "type": "string" }, "namn": { "type": "string" }, "roll": { "type": "string" },
          "misstankt": { "type": "boolean" }, "beskrivning": { "type": "string" }, "portratt": { "type": "string" }
        }
      }
    },
    "moment": {
      "type": "array",
      "description": "Utredningsmoment, varje moment använder en mekanik",
      "items": {
        "type": "object",
        "required": ["id", "mekanik", "payload"],
        "properties": {
          "id": { "type": "string" },
          "mekanik": { "enum": ["scen", "forhor", "logikrutnat", "tidslinje", "dokument", "chiffer", "bildjamforelse"] },
          "last_upp_av": { "type": "array", "items": { "type": "string" }, "description": "fynd-id som krävs" },
          "payload": { "type": "object", "description": "mekanikspecifik data, se separata delscheman" }
        }
      }
    },
    "fynd": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "text", "typ"],
        "properties": {
          "id": { "type": "string" }, "text": { "type": "string" },
          "typ": { "enum": ["nyckel", "stod", "avledande", "bakgrund"] },
          "galler": { "type": "array", "items": { "type": "string" }, "description": "person-id" }
        }
      }
    },
    "losning": {
      "type": "object",
      "required": ["skyldig", "bevisgrupper", "uteslutningar"],
      "properties": {
        "skyldig": { "type": "string" },
        "hur": { "type": "string" },
        "bevisgrupper": {
          "type": "array",
          "description": "Godkända kombinationer av bevis (en räcker)",
          "items": { "type": "array", "items": { "type": "string" } }
        },
        "uteslutningar": {
          "type": "object",
          "description": "person-id -> fynd-id som utesluter personen",
          "additionalProperties": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "ledtradar": {
      "type": "array", "minItems": 3, "maxItems": 3,
      "items": { "type": "object", "required": ["niva", "text"], "properties": { "niva": { "type": "integer" }, "text": { "type": "string" }, "moment": { "type": "string" } } }
    },
    "aterkoppling": {
      "type": "object",
      "required": ["ratt", "fel"],
      "properties": {
        "ratt": { "type": "string" },
        "fel": { "type": "object", "additionalProperties": { "type": "string" }, "description": "person-id -> reaktion vid fel anklagelse" },
        "forklaring_steg": { "type": "array", "items": { "type": "string" } }
      }
    }
  }
}
```

**Exempel (förkortat, Fall 1):**

```json
{
  "id": "halsbandet-pa-ekbacka",
  "version": 1,
  "meta": {
    "titel": "Halsbandet på Ekbacka",
    "miljo": "Herrgård i Sörmland", "epok": "1920-tal",
    "brottstyp": "stold", "langd": "kort", "uppskattad_tid_min": [2, 5],
    "svarighet": 1, "karnmekanik": "scen", "bimekaniker": [], "twist": null, "kraver_rang": 0
  },
  "intro": {
    "text": "Under middagen på Ekbacka försvann friherrinnan Wredes pärlhalsband från hennes låsta sovrum.",
    "uppdrag": "Vem tog halsbandet?"
  },
  "personer": [
    { "id": "holm", "namn": "Holm", "roll": "Butler", "misstankt": true },
    { "id": "elsa", "namn": "Elsa Lund", "roll": "Kammarjungfru", "misstankt": true },
    { "id": "gustav", "namn": "Gustav Wrede", "roll": "Brorson", "misstankt": true }
  ],
  "moment": [
    {
      "id": "sovrummet", "mekanik": "scen",
      "payload": {
        "bild": "sovrum.webp",
        "hotspots": [
          { "id": "fonster", "rect": [0.71, 0.12, 0.18, 0.40], "ger_fynd": "f-fonster" },
          { "id": "smyckeskrin", "rect": [0.40, 0.55, 0.10, 0.08], "ger_fynd": "f-handsktrad" },
          { "id": "askkopp", "rect": [0.15, 0.60, 0.06, 0.05], "ger_fynd": "f-pipaska" }
        ]
      }
    }
  ],
  "fynd": [
    { "id": "f-fonster", "text": "Fönstret står öppet, men dammet och frosten på yttre blecket är orörda.", "typ": "nyckel" },
    { "id": "f-handsktrad", "text": "En vit bomullstråd har fastnat i smyckeskrinets lås.", "typ": "stod", "galler": ["holm"] },
    { "id": "f-pipaska", "text": "Pipaska i askkoppen.", "typ": "avledande", "galler": ["gustav"] }
  ],
  "losning": {
    "skyldig": "holm",
    "hur": "Med huvudnyckeln, under sitt påstådda vinkällarbesök 20.30–20.40",
    "bevisgrupper": [["f-fonster", "f-nycklar", "f-vinflaskan"], ["f-nycklar", "f-vinflaskan"]],
    "uteslutningar": { "elsa": ["f-servering"], "gustav": ["f-fonster", "f-nycklar"] }
  },
  "ledtradar": [
    { "niva": 1, "text": "Hur kom tjuven in? Titta noga på fönstret." },
    { "niva": 2, "text": "Om fönstret inte användes måste tjuven ha haft nyckel. Vilka har nyckel, och var var de?" },
    { "niva": 3, "text": "Två av nyckelinnehavarna satt vid bordet hela middagen. Den tredje lämnade rummet med en förklaring som inte håller." }
  ],
  "aterkoppling": {
    "ratt": "Utmärkt! Holm behövde aldrig gå ner i källaren ...",
    "fel": { "gustav": "Gustav rodnar, men hur skulle han ha kommit in utan nyckel?" }
  }
}
```

**Tekniska principer för formatet:**
- **Validering:** Ett skript kontrollerar varje fall mot schemat och kontrollerar logiken, till exempel att varje oskyldig person har minst en uteslutning och att varje bevis finns bland fynden. Logikrutnät och tidslinjer kan dessutom köras genom en lösare som bevisar att lösningen är unik (se `verktyg/verifiera_fall3.py`).
- **Text och logik hålls isär:** Fakta och lösning lagras strukturerat. Prosan kan skrivas om eller översättas utan att logiken går sönder.
- **Fallgenerator (senare):** Mallar som ”miljö × brottstyp × mekanik × twist” fylls i och körs sedan genom samma validering och lösare.

---

## 2. Interaktionsmekaniker

Sex mekaniker föreslås. Varje fall har en **kärnmekanik** och 0–2 **bimekaniker**.

### 2.1 Scenundersökning (klickbara hotspots)
**Så fungerar det:** Spelaren ser en illustrerad scen, zoomar och klickar på föremål. Varje relevant föremål ger ett fynd i anteckningsboken.
**Vad den testar:** Observation och slutsatser om vad *frånvaron* av spår betyder, till exempel att orört damm visar att fönstret inte användes.
**Variation:**
- Antalet hotspots och andelen meningslösa föremål kan varieras.
- Dolda hotspots syns bara när spelaren zoomar eller har ett visst fynd, till exempel UV-lampa eller förstoringsglas.
- I ”före och efter”-läget besöks samma rum vid två tidpunkter.
- Vissa föremål kan kombineras, till exempel en nyckel med ett skrin.

### 2.2 Vittnesförhör och motsägelser
**Så fungerar det:** Vittnesutsagor visas som pratbubblor. Spelaren markerar ett påstående och kopplar det till ett fynd eller ett annat påstående som det **motsäger** (”Invänd!”). En riktig invändning öppnar en följdfråga.
**Vad den testar:** Konsekvenskontroll, alltså att hitta exakt *vilka* två fakta som inte kan vara sanna samtidigt.
**Variation:**
- Lögnare kan ljuga av oskyldiga skäl. Det är ett avledande spår.
- Vittnen kan ha fel utan att ljuga, till exempel med en klocka som går fel.
- Antalet förhörsrundor kan variera.
- Ett vittne kan säga sanningen men ändå vilseleda.

### 2.3 Logikrutnät och deduktionstavla
**Så fungerar det:** Ett klassiskt rutnät (person × plats × attribut) där spelaren markerar ✓ eller ✗ utifrån ledtrådar. Tavlan kan visas som ett bord, ett tåg, en gata eller en karta så att det inte känns som en tabell.
**Vad den testar:** Ren deduktion: eliminering, fall-för-fall-resonemang och motsägelsebevis.
**Variation:**
- Storleken kan vara 3×3 upp till 5×5 med 2–4 kategorier.
- Rumsliga relationer som ”bredvid” och ”mitt emot” kan användas.
- Negativa ledtrådar kan förekomma.
- Ledtrådar kan låsas upp först efter andra moment.
**Garanti:** Varje rutnät verifieras med en lösare som ska hitta exakt en lösning, och alla ledtrådar ska behövas.

### 2.4 Tidslinjerekonstruktion
**Så fungerar det:** Spelaren drar händelsekort till en tidslinje per person. Motorn har en **avståndstabell** (gångtid mellan platser) och markerar rött när en person skulle behöva vara på två ställen eller färdas för snabbt.
**Vad den testar:** Tidsresonemang, alibi och luckor. Frågan är vem som *fysiskt kan* ha varit på platsen.
**Variation:**
- Exakta källor som kvitton och biljetter kan blandas med ungefärliga, som ”strax efter att kyrkklockan slog”.
- Klockor kan gå fel.
- Färdsätten kan variera: till fots, spårvagn eller tåg.
- Spelaren kan behöva fastställa själva brottstidpunkten först.

### 2.5 Dokument- och chifferanalys
**Så fungerar det:** Spelaren läser brev, loggböcker, kvitton och dagböcker. Med verktyg kan hen jämföra handstil eller bläck, lägga dokument bredvid varandra och avkoda chiffer som Caesar, psalmboksnyckel eller nullchiffer.
**Vad den testar:** Närläsning, att se vad som *inte* står och att förstå regler som ”loggboken förs alltid i blyerts”.
**Variation:**
- Dokumenttypen kan variera mellan olika fall.
- Det kan finnas förfalskade dokument.
- Chiffer kan förekomma i olika svårighetsgrad.
- Viktig information kan vara utspridd över flera dokument.
- Berättaren själv kan vara opålitlig.

### 2.6 Bildjämförelse
**Så fungerar det:** Två eller flera foton eller illustrationer med tidsstämplar visas sida vid sida eller med ett skjutreglage. Spelaren markerar skillnader och avgör vilka som är *relevanta*.
**Vad den testar:** Observation under tidspress och förmågan att knyta en skillnad till en tidpunkt, så att den avgör *när* något hände.
**Variation:**
- Antalet skillnader kan variera.
- Vissa skillnader är oviktiga och fungerar som avledande spår.
- Förändringen kan ske i flera steg (A → B → C).
- Bildtyperna kan variera: vykort, polaroid, mobilfoto eller övervakningsbild.

---

## 3. Progression och variation

### 3.1 Svårighetskurva

Svårigheten anges på en skala från 1 till 5 och styrs av fem reglage:

| Reglage | Lätt (1–2) | Svår (4–5) |
|---|---|---|
| Antal misstänkta | 3 | 5–6 |
| Avledande spår | 0–1, tydliga | 2–4, rimliga |
| Slutsatssteg i kedjan | 2–3 | 6–10 |
| Informationen | Direkt given | Utspridd och måste kombineras |
| Mekaniker | 1 | 2–3 i följd |

Svårighetskurvan är en **sågtand**: den stiger stadigt men följs ibland av ett kort och lätt fall som ger andrum. Ett twistfall ligger aldrig direkt efter det svåraste fallet.

### 3.2 Detektivrang och upplåsning

| Rang | Krav (förstoringsglas) | Låser upp |
|---|---|---|
| Aspirant | 0 | Fall 1–3 och grundmekanikerna |
| Konstapel | 5 | Tidslinje och medellånga fall |
| Kriminalassistent | 12 | Dokument och chiffer samt första twistfallet |
| Kommissarie | 22 | Långa fall och svårighet 4 |
| Mästerdetektiv | 35 | Svårighet 5, ”utan ledtrådar”-läge och hemliga fall |

- Ett fall ger 1–3 förstoringsglas beroende på ledtrådar, antal försök och om bevisen var rätt.
- Fallen ordnas i **kapitel** med 4–5 fall vardera. Varje kapitel avslutas med ett twistfall. Det ger rytmen ”switch-up ungefär vart 4–5:e fall”.
- Nästa kapitel kan låsas upp genom att spelaren klarar kapitlet *eller* når rätt rang. På så sätt kan ingen fastna på ett enda fall.

### 3.3 Twisttyper

Twistfallen är ”switch-up”-fallen och visas med en diskret symbol (🜂) först i efterhand, så att överraskningen behålls.

1. **Opålitlig berättare:** Den som berättar är skyldig eller ljuger.
2. **Offret är gärningsmannen:** Bedrägeri eller iscensatt brott.
3. **Omvända roller:** Spelaren är brottslingen och ska hitta detektivens misstag, eller planera ett perfekt alibi som inte håller.
4. **Inget brott:** Allt visar sig ha en oskyldig förklaring som ska bevisas.
5. **Två gärningsmän:** Två oberoende brott sker samma kväll.
6. **Ovanlig miljö:** Rymdstation, ubåt, dataspel i spelet eller ett djur som vittne.
7. **Tidshopp:** Ett gammalt kallt fall utreds med bara dokument.
8. **Detektiven har fel:** En tidigare ”löst” fråga måste omprövas.

### 3.4 Variationsmatris

Varje fall märks i fyra dimensioner. En **regel för nästa fall** förhindrar upprepning:

| Dimension | Värden (exempel) |
|---|---|
| **Miljö** | Herrgård, tåg, villa med middag, stadsbutik (1800-tal), fyr eller ö, modern landsbygd, ångbåt, teater, kloster, hotell, universitet, gruva, jaktstuga, (twist: rymdstation och liknande) |
| **Brottstyp** | Stöld, mord, förgiftning, inbrott, bedrägeri, försvinnande, utpressning, spionage, sabotage |
| **Kärnmekanik** | Scen, förhör, logikrutnät, tidslinje, dokument eller chiffer, bildjämförelse |
| **Twist** | Ingen (cirka 75 %), eller någon av de åtta twisttyperna |

**Regler för variation:**
- Två fall i rad får inte ha samma **kärnmekanik** eller **miljö**.
- Samma **brottstyp** får förekomma högst två gånger på fem fall.
- Samma **twisttyp** får komma tillbaka först efter tio fall.
- En **epok** (1890-, 1920-, 1930-tal eller nutid) får inte dominera ett helt kapitel.
- Den **skyldigas profil** roteras: tjänstefolk, familj, främling, auktoritet och ”den mest sympatiska”. Den mest misstänkta personen i presentationen får vara skyldig högst ungefär var femte gång.
- **Motivet** roteras: pengar, hämnd, kärlek, rädsla, ideologi och misstag.

Kontrollen kan göras automatiskt i fallbiblioteket utifrån `meta`-fälten.

### 3.5 Fler idéer mot upprepning
- **Personlighet hos återkommande figurer,** till exempel en inspektör som ibland har rätt och ibland är ett avledande spår.
- **Dagens fall:** Ett kort fall per dag som genereras från mallar och valideras med lösare. Det kan läggas till senare.
- **Spegelfall:** Samma miljö kommer tillbaka senare med ett helt annat brott.
- **Bonusfrågor** i upplösningen, som *”Varför låg handsken vid dörren?”*, belönar spelare som förstått även de avledande spåren.

---

## 4. De första sex fallen

Fallen är uppställda så att alla fyra dimensionerna varierar:

| # | Titel | Miljö / epok | Brott | Kärnmekanik | Längd | Svårighet | Twist |
|---|---|---|---|---|---|---|---|
| 1 | Halsbandet på Ekbacka | Herrgård, 1920-tal | Stöld | Scenundersökning | Kort (2–5 min) | 1 | – |
| 2 | Nattåget mot Narvik | Sovvagn, 1930-tal | Mord | Förhör och motsägelser | Medel (10–15 min) | 2 | – |
| 3 | Middagen på Solgläntan | Villa, 1950-tal | Förgiftning | Logikrutnät | Kort (4–6 min) | 2 | – |
| 4 | Kvart i elva | Urmakeri i Gamla stan, 1897 | Inbrott och stöld | Tidslinje | Medel–lång (15–20 min) | 3 | – |
| 5 | Fyren på Gråskär | Fyrö i ytterskärgården, 1931 | Mord | Dokumentanalys | Lång (20–30 min) | 4 | **🜂 Opålitlig berättare** |
| 6 | Brudskålen | Dalagård, nutid (midsommar) | Bedrägeri | Bildjämförelse | Medel (8–12 min) | 3 | **🜂 Offret är gärningsmannen** |

*Not: Fall 5 är kapitel 1:s twistfall. Fall 6 inleder kapitel 2 med en mindre twist i en modern miljö, som en signal om att spelet kan överraska. Om Martin hellre vill följa ”twist vart 4–5:e fall” strikt kan fall 6 placeras som fall 9 eller 10 i stället.*

---

### Fall 1 – Halsbandet på Ekbacka

**Miljö:** Ekbacka herrgård i Sörmland, november 1926. Det är middag i stora salen och regnet har just upphört.
**Längd och svårighet:** Kort (2–5 min) · 1/5 · Kärnmekanik: scenundersökning · Fungerar som spelets handledningsfall.

**Premiss:** Friherrinnan Ebba Wrede lade sitt pärlhalsband i smyckeskrinet i sovrummet kl. 19.55 och låste dörren. Kl. 21.00 gick hon upp. Dörren var fortfarande låst, men skrinet var tomt och fönstret stod öppet.

**Personer:**
- **Friherrinnan Ebba Wrede,** ägaren. Hon satt vid bordet hela middagen enligt alla gäster.
- **Holm,** butler. Har huvudnyckel.
- **Elsa Lund,** kammarjungfru. Har nyckel till sovrummet.
- **Gustav Wrede,** brorson med spelskulder. Har ingen nyckel.

**Fynd i sovrummet (hotspots):**
1. 🔑 **Fönstret:** Det står öppet, men på det yttre fönsterblecket är det fuktiga lövskräpet och dammet helt orört. Rabatten nedanför är nykrattad och saknar fotspår. *Slutsats: ingen kom in eller ut genom fönstret. Det öppnades inifrån för att lura.*
2. 🔑 **Dörren:** Låset är oskadat och dörren var låst. *Slutsats: tjuven hade nyckel.*
3. 🔑 **Nyckelskåpet** i köksgången: Det finns tre nycklar till rummet. Friherrinnans, Elsas och Holms huvudnyckel.
4. 🔑 **Gästernas vittnesmål** (en kort lista): Elsa serverade vid bordet hela tiden. Holm lämnade salen 20.30–20.40 ”för att hämta 1919 års Bordeaux i källaren”.
5. 🔑 **Vinflaskan** på serveringsbordet har inget damm och är rumstempererad. **Källarboken** visar att flaskan bars upp till skafferiet redan kl. 15. *Slutsats: Holm behövde aldrig gå till källaren och hans förklaring är falsk.*
6. Stöd: En **vit bomullstråd** sitter i skrinets lås. Butlern bär vita handskar, men det gör även serveringspersonalen. Tråden stöder alltså bara slutsatsen och bevisar den inte ensam.
7. ❌ Avledande spår: **Pipaska** i askkoppen. Gustav röker pipa, men han var i rummet tidigare under eftermiddagen för att låna en bok. Boken finns på hans nattduksbord och friherrinnan bekräftar lånet. Askan bevisar ingenting om kvällen.

**Ledtrådar:**
1. ”Hur kom tjuven in? Titta noga på fönstret.”
2. ”Om fönstret inte användes måste tjuven ha haft nyckel. Vilka har nyckel, och var var de mellan 19.55 och 21.00?”
3. ”Två av nyckelinnehavarna satt eller serverade vid bordet hela tiden. Den tredje lämnade salen. Stämmer hans förklaring med vinflaskan?”

**Lösningsväg (unik):**
1. Fönsterblecket och rabatten är orörda, så tjuven kom inte via fönstret.
2. Låset är oskadat, så tjuven använde en av de tre nycklarna.
3. Friherrinnan och Elsa var i salen hela tiden enligt flera oberoende vittnen och kan uteslutas.
4. Kvar finns Holm. Han var borta 20.30–20.40 och hans förklaring motsägs av källarboken och flaskan.
5. Gustav har ingen nyckel och kunde inte använda fönstret, så han kan uteslutas.
→ **Holm är skyldig.** Halsbandet hittas i hans livréficka i skafferiet.

**Återkoppling:**
- *Rätt:* ”Elementärt! Fönstret var en kuliss. Ingen klättrar genom ett fönster utan att röra lövskräpet. Kvar fanns tre nycklar och bara en nyckelbärare som lämnade bordet. Och vem går till källaren efter en flaska som redan står i skafferiet?”
- *Fel (Gustav):* ”Gustav rodnar, men hur skulle han ha kommit in? Han har ingen nyckel och fönstret är orört.”
- *Fel (Elsa):* ”Elsa har nyckel, men femton gäster såg henne servera soppan.”

---

### Fall 2 – Nattåget mot Narvik

**Miljö:** Sovvagnen på nattåget Stockholm–Narvik, februari 1934. Det är snöstorm.
**Längd och svårighet:** Medel (10–15 min) · 2/5 · Kärnmekanik: förhör och motsägelser · Bimekanik: scen (kupén).

**Premiss:** Grosshandlare Anton Berg hittas död i kupé 3 kl. 06.10. Han har fått ett slag mot tinningen. Konduktören måste använda huvudnyckel, och dörren mot korridoren var dessutom **hakad med säkerhetskedjan inifrån**. Läkaren ombord bedömer att döden inträffade mellan 01.00 och 02.00.

**Personer:**
- **Konduktör Lind.**
- **Fru Margit Ahl,** kupé 2. Änka och tystlåten.
- **Herr Erik Sundin,** kupé 4. Försäljare och kortspelare.
- **Fröken Ingrid Nyqvist,** kupé 5. Lärarinna.
- **Servitör Olsson** i restaurangvagnen.

**Fakta i kupén (scen):**
1. 🔑 Korridordörren var hakad med kedjan inifrån. Den kan inte hakas på utifrån.
2. 🔑 Fönstret är fastfruset. Isen i fogarna är obruten.
3. 🔑 **Mellandörren till kupé 2:** Kupéerna 2 och 3 har en dörr emellan med regel på båda sidor. Regeln på kupé 3:s sida är **öppen**. Väggen mot kupé 4 saknar dörr.
4. ❌ Avledande spår: **Våta fotspår** i korridoren från vagnsdörren fram till kupé 3. Konduktören gick in med snö på stövlarna när han ropade ut Boden och kollade biljetterna.

**Utsagor (förhör):**
- **Fru Ahl:** (a) ”Jag hakade på kedjan och sov oavbrutet hela natten. Jag vaknade inte ens när vi stod i Boden.” (b) ”Mellandörren? Den var reglad från min sida hela natten.” (c) *Följdfråga om stationen:* ”Det var stilla på stationen. Bara stinsens lykta som lyste in genom gardinspringan, ganska länge.”
- **Fröken Nyqvist:** ”Jag var på väg till toaletten. Precis när tåget ryckte igång efter Boden, kl. 01.25, hörde jag en tung duns inifrån kupé 3.”
- **Herr Sundin:** ”Jag spelade kort med konduktören i restaurangvagnen från halv ett till två. Berg? Nej, honom kände jag knappt.” *Senare:* Han medger att han förlorade 300 kronor till Berg i Stockholm.
- **Servitör Olsson:** ”Herr Sundin satt vid bord 4 hela natten. Han lämnade aldrig vagnen, inte ens när konduktören gick ut i Boden.”
- **Konduktör Lind:** ”Jag var ute på perrongen i Boden 01.10–01.25. Jag hoppade på i bakersta vagnen när vi rullade och gick framåt genom tåget. Strax efter halv två var jag tillbaka hos Sundin.” Lind har ingen kupé i sovvagnens del, och hans väg från bakre vagnen till restaurangvagnen går inte genom sovvagnen.
- **Fru Ahls kedja:** Konduktören såg själv kl. 06.15 att fru Ahl hakade av sin egen säkerhetskedja inifrån.

**Motsägelser som spelaren ska hitta:**
- M1: Ahl (a) ”sov oavbrutet” står mot Ahl (c) ”lyktan lyste in ganska länge”. Hon var alltså vaken under stoppet.
- M2: Sundin säger att han ”knappt kände” Berg, men han förlorade 300 kr till honom. Det ger ett motiv, men det är ett **avledande spår** eftersom Olsson ger honom alibi.

**Ledtrådar:**
1. ”Hur kan någon lämna en kupé som är hakad inifrån och har ett fastfruset fönster?”
2. ”Det finns bara en väg kvar: mellandörren. Vart leder den, och vem satt där?”
3. ”Fru Ahl säger att hon sov hela natten, men hon minns ljuset under stoppet. Varför ljuger hon om att hon var vaken?”

**Lösningsväg (unik):**
1. Kedjan inifrån och det fastfrusna fönstret visar att gärningspersonen inte lämnade kupé 3 via korridoren eller fönstret.
2. Den enda andra utgången är mellandörren till kupé 2. Kupé 4 saknar dörr.
3. Kupé 2:s egen korridordörr var också hakad inifrån till morgonen. Den som gick via kupé 2 måste därför ha *stannat* där. Det är kupéns enda passagerare, fru Ahl.
4. Fru Ahls påstådda sömn motsägs av hennes egen utsaga (M1), och Nyqvists duns kl. 01.25 hamnar inom läkarens tidsfönster.
5. Sundin har alibi från Olsson, en oberoende person. Konduktören var på perrongen och därefter i andra vagnar, och han kunde inte heller ha passerat kedjorna. Nyqvist var i korridoren, men korridordörren var hakad inifrån.
→ **Fru Ahl är skyldig.** Berg drev hennes make i konkurs. Hon knackade på mellandörren, Berg öppnade regeln, och efter slaget reglade hon sin egen sida igen.

**Återkoppling:**
- *Rätt:* ”Ett låst rum har alltid en dörr man glömmer. Kedjan och isen stängde två vägar, och mellandörren ledde till en kupé som också var hakad inifrån. Fru Ahl var vaken. Det avslöjade hon själv med stinsens lykta.”
- *Fel (Sundin):* ”Ett motiv är inget bevis. Servitören såg honom hela natten.”
- *Fel (konduktören):* ”Lind var på perrongen och har ingen väg förbi två säkerhetskedjor.”

---

### Fall 3 – Middagen på Solgläntan

**Miljö:** Villa Solgläntan i Saltsjöbaden, augusti 1954. Det är middag för fem.
**Längd och svårighet:** Kort (4–6 min) · 2/5 · Kärnmekanik: logikrutnät (visas som en bordsplacering).

**Premiss:** Överste Carl Rehnskiöld segnar ner vid förrätten. I hans vinglas finns digitalis. Kriminalteknikern konstaterar två saker. Pulverspillet ligger på duken **till vänster om överstens glas**, och glaset stod till vänster om tallriken. Alla vittnen är eniga om att **ingen reste sig under förrätten**. Bara den som satt direkt till överstens vänster kunde nå glaset. Ingen vet säkert vem som satt var, eftersom placeringskorten blåste bort i trädgården. Spelaren ska rekonstruera bordsplaceringen.

**Bordet:** Översten satt vid kortänden. Gästerna satt på plats 1–4 räknat **medsols från överstens högra sida**, alltså i ordningen Översten–1–2–3–4–Översten. Plats 1 och plats 4 sitter bredvid översten. Plats 4 är hans vänstra sida.

**Personer:** Astrid, Bertil, Cecilia och David. Yrken: läkare, advokat, konstnär och pastor. Drycker: sherry, whisky, champagne och te. Astrid och Cecilia är kvinnor och Bertil och David män.

**Ledtrådar ur förhören (alla behövs, verifierat):**
- L1. Astrid drack champagne.
- L2. Läkaren satt inte bredvid översten.
- L3. Advokaten satt bredvid översten men drack inte te.
- L4. Den som drack whisky satt direkt mellan advokaten och konstnären.
- L5. Bertil satt inte bredvid Cecilia.
- L6. David drack inte te.
- L7. Den som drack sherry satt på plats 1.
- L8. Pastorn är en man.
- L9. David satt inte bredvid översten.

❌ Avledande spår: **Läkaren** har tillgång till digitalis och ”visste precis vad det var”. Det är det uppenbara motivet för misstanke, men platsen avgör.

**Ledtrådar (hjälpsystemet):**
1. ”Börja med advokaten. Hen sitter på plats 1 eller 4. Testa båda alternativen.”
2. ”Om advokaten sitter på plats 4 måste whiskyn stå på plats 3 och konstnären sitta på plats 2. Följ det till slutet och se vad som händer med David.”
3. ”Advokaten sitter på plats 1. Då sitter läkaren på plats 2, konstnären på plats 3 och pastorn på plats 4. Vem kan pastorn vara?”

**Lösningsväg (unik, verifierad med lösare):**
1. Enligt L3 sitter advokaten på plats 1 eller 4, och enligt L2 sitter läkaren på plats 2 eller 3.
2. *Antag att advokaten sitter på plats 4.* Whiskyn ligger då bredvid plats 4, alltså på plats 3 (L4). Konstnären sitter bredvid plats 3 men inte på plats 4, alltså på plats 2. Läkaren sitter på plats 3 och pastorn på plats 1. Sherryn står på plats 1 (L7). Advokaten dricker inte te (L3), så plats 4 har champagne och plats 2 te. Astrid drack champagne (L1) och sitter därför på plats 4. Pastorn är en man (L8) och David sitter inte på plats 1 (L9), alltså sitter Bertil på plats 1. Cecilia får inte sitta bredvid Bertil (L5) och kan därför inte sitta på plats 2. Hon hamnar på plats 3, och David hamnar på plats 2, där teet står. Det **strider mot L6**. ✗
3. Advokaten sitter alltså på plats 1 och dricker sherry (L7). Whiskyn står bredvid plats 1 och därmed på plats 2 (L4). Konstnären sitter på plats 3 och läkaren på plats 2 (L2), så whiskyn är läkarens. Pastorn sitter på plats 4.
4. Pastorn är en man (L8) men inte David (L9), alltså **Bertil på plats 4**.
5. Astrid dricker champagne och kan därför varken sitta på plats 1 (sherry) eller 2 (whisky). Plats 4 är upptagen, så hon sitter på plats 3. Cecilia får inte sitta bredvid Bertil (L5) och sitter därför på plats 1. David sitter på plats 2.
6. Facit: 1 Cecilia (advokat, sherry), 2 David (läkare, whisky), 3 Astrid (konstnär, champagne), 4 Bertil (pastor, te).
→ Bara plats 4 kunde nå glaset, alltså är **pastor Bertil skyldig**. Motivet är att översten tänkte avslöja att Bertil förskingrat församlingens fond.

**Återkoppling:**
- *Rätt:* ”Giftet sitter inte i flaskan, det sitter i placeringen. Läkaren hade kunskapen, men det var pastorn som hade armbågen närmast glaset.”
- *Fel (David):* ”Doktorn hade digitalis i väskan, men han satt två stolar bort och reste sig aldrig.”

*Verifiering:* `verktyg/verifiera_fall3.py` testar alla 13 824 kombinationer och hittar exakt en lösning. Tas någon av de nio ledtrådarna bort finns det två eller fler lösningar.

---

### Fall 4 – Kvart i elva

**Miljö:** Fältskogs urmakeri på Österlånggatan i Gamla stan, Stockholm, december 1897. Det är natt och snö ligger på gatorna.
**Längd och svårighet:** Medel–lång (15–20 min) · 3/5 · Kärnmekanik: tidslinje · Bimekaniker: scen (verkstaden) och dokument (liggare och protokoll).

**Premiss:** En kronometer värd en förmögenhet stjäls från montern. Fönsterluckan har brutits upp, men **monterns lås har öppnats med nyckel** utan en enda repa. Ett väggur ligger krossat på golvet och har stannat på **22.47**.

**Brottstidpunkten fastställs först:**
- Nattväktaren gick förbi på sina rundor. Kl. 22.00 och 22.30 var allt i ordning, men kl. 23.00 var luckan uppbruten.
- Grannen fru Ekdahl hörde ”en skräll strax efter att Storkyrkan slagit tre kvart”, alltså strax efter 22.45.
- Den stannade väggklockan visar 22.47 och stämmer med de oberoende källorna.
→ Brottet skedde cirka **22.45–22.50**.

**Vem hade nyckel till montern?** (Fältskogs utsaga, scen)
- **Urmakare Fältskog** själv.
- **Gesällen Karl Ek.**
- **Urmakare Rapp,** Fältskogs före detta kompanjon. ”Låset byttes aldrig efter att vi skildes.”

**Personer, utsagor och källor:**

| Person | Utsaga | Oberoende källa |
|---|---|---|
| Fältskog | ”Jag var på min dotters bröllopsmiddag.” | 40 gäster på Grand Hôtel 19.00–01.00 |
| Karl Ek | ”Jag satt på Den Gyldene Freden 22.00–23.30.” | Krögaren: där 22.00–22.25 och 23.05–23.30. **Pantlånekontoret på Hornsgatan** (kvällsöppet), liggaren: *”22.40 – Karl Ek, ett fickur i silver, 8 kr”* |
| Rapp | ”Gillesmötet slutade halv elva och jag gick raka vägen hem. Jag var hemma kvart i elva.” | Gillets protokoll: mötet avslutades 22.30 och Rapp skrev under. **Rapps hustru:** ”Han kom fem över elva. Köksuret hade just slagit elva.” |
| Fru Lindh (kund) | ”Min handske? Jag var där i eftermiddags.” | Kassaboken: Lindh besökte butiken 17.00. Spårvagnsbiljett stämplad 22.40 vid Slussen |

**Gångtider (avståndstabell i spelet):**

| Från → till | Minuter |
|---|---|
| Gillets hus → urmakeriet | 6 |
| Gillets hus → Rapps hem (Kungsholmen) | 15 |
| Urmakeriet → Rapps hem | 18 |
| Den Gyldene Freden → urmakeriet | 4 |
| Den Gyldene Freden → pantlånekontoret | 16 |
| Pantlånekontoret → urmakeriet | 20 |

❌ Avledande spår:
- **Karl** ljuger om att han satt på krogen hela kvällen. Det ser ut som en alibilucka, men han skäms för att han pantsatte faderns ur.
- **Fru Lindhs handske** vid dörren tappade hon under eftermiddagsbesöket. Hon har dessutom ingen nyckel.

🔑 Stöd: I Rapps rockuppslag finns **eksågspån**. Fältskog strör ekspån på verkstadsgolvet mot halka, och Rapp har inte varit i butiken på flera år.

**Ledtrådar:**
1. ”Fastställ först *när* brottet skedde. Tre oberoende källor pekar på samma tidpunkt.”
2. ”Monterlåset öppnades med nyckel. Lägg bara nyckelinnehavarna på tidslinjen och kontrollera gångtiderna.”
3. ”Karl ljuger, men var var han kl. 22.40? Jämför sedan Rapps raka hemväg med när hans hustru säger att han kom hem.”

**Lösningsväg (unik):**
1. Brottet skedde 22.45–22.50 enligt väktaren, grannen och klockan.
2. Montern öppnades med nyckel, så bara Fältskog, Karl och Rapp är möjliga.
3. Fältskog satt på bröllopsmiddagen med 40 vittnen och kan uteslutas.
4. Karl var på pantlånekontoret kl. 22.40. Därifrån tar det 20 minuter till urmakeriet, så han kunde tidigast vara där 23.00, efter att väktaren redan sett luckan bruten. Han kan **uteslutas** trots att han ljög.
5. Rapp lämnade gillet 22.30. Raka vägen hem tar 15 minuter, så han borde ha varit hemma 22.45, precis som han själv påstår. Hustrun säger däremot 23.05, och det ger **20 oförklarade minuter**. Omvägen via urmakeriet tar 6 + 18 = 24 minuter. Med cirka 10 minuter i butiken (22.36–22.50) kommer han hem ungefär 23.05–23.08. Det stämmer.
6. Fru Lindh har ingen nyckel och satt på spårvagnen från 22.40.
→ **Rapp är skyldig.** Han ville få tillbaka det mästerverk han anser att Fältskog stal från honom när de skildes.

**Återkoppling:**
- *Rätt:* ”Rapp gav sig själv alibit ’kvart i elva’. Men den som går raka vägen kommer inte hem tjugo minuter för sent. De tjugo minuterna räcker precis till en omväg via Österlånggatan.”
- *Fel (Karl):* ”Karl ljög, men om något annat. Pantlånekontoret ligger tjugo minuter bort, och klockan 22.40 stod han vid disken.”

---

### Fall 5 – Fyren på Gråskär 🜂 *(twist: opålitlig berättare)*

**Miljö:** Gråskärs fyrplats i Stockholms ytterskärgård, oktober 1931. En storm har isolerat ön i två dygn.
**Längd och svårighet:** Lång (20–30 min) · 4/5 · Kärnmekanik: dokumentanalys · Bimekaniker: förhör och tidslinje.

**Premiss (berättargreppet):** Fallet presenteras av **fyrbiträdet Elof Granath**. Det är han som har skickat sin dagbok och fyrens papper till detektiven ”för att hjälpa polisen”. Dagboken är spelets berättarröst och en vänlig Watson-figur. Elof står i persongalleriet som alla andra, men utan någon särskild markering. Fyrmästare Holger Wenngren hittades död kl. 06.00 nedanför den smala spiraltrappan.

**Personer på ön:**
- **Elof Granath,** fyrbiträde och berättare. Bor i biträdesstugan.
- **Signe Wenngren,** fyrmästarens hustru. Bor i fyrmästarbostaden.
- **Dr. Arvid Lagerkvist,** meteorolog vid väderstationen. Det tar 10 minuters gång i storm mellan stationen och tornet.
- **Johan Sjöberg,** skeppsbruten fiskare. Han flöt i land kvällen innan med ett brutet ben, som Lagerkvist spjälade. Han ligger på köksbänken i fyrmästarbostaden.

**Dokumenten:**
1. **Fyrinstruktionen** (tryckt): ”Linsens urverk dras upp varannan timme och går högst 2 tim. 15 min. Uppdragningen antecknas i loggboken, **alltid med blyerts**, eftersom bläck fryser i lanternan.”
2. **Fyrens loggbok:** Kl. 00.00 och 02.00 är uppdragningen antecknad i blyerts med Holgers handstil. Kl. 04.00 står ”Uppdragning – H.W.”, skrivet med **blåsvart bläck**. Handstilen liknar Holgers men lutar åt andra hållet.
3. **Elofs dagbok,** skriven i bläck med ”min reservoarpenna, den enda på ön, en present från redaktör Berg”. Kvällen innan står: *”Jag gick till kojs vid elva och sov tungt till sex, då Signes skrik väckte mig. Vid fyratiden vaknade jag kort av att Holger visslade uppe i tornet som han alltid gör vid uppdragningen, och så somnade jag om.”*
4. **Lagerkvists väderjournal och barograf:** Under stormvarning gäller observationer var 15:e minut, och varje observation markeras med ett tidsmärke på barografens pappersrulle. Rullen har obrutna märken 02.00–05.00, bland annat **03.15 och 03.30**. Journalen noterar också: *”Fyren lyser normalt”* varje kvart hela natten.
5. **Lagerkvists anteckning vid fyndet:** ”Kroppen låg tvärs över trappan på nedre avsatsen. Ingen kan passera upp till lanternan utan att kliva över honom. Blåmärken på båda överarmarna efter ett hårt grepp.”
6. **Signes brev** till en man i Norrtälje, ett avledande spår: ”Snart är jag fri.” Hon har alltså ett motiv.

**Förhör:**
- **Signe:** ”Jag vaknade av en duns. Klockan på byrån visade tjugo över tre. Jag gick ut i köket och tittade mot tornet men såg ingenting, så jag gick och lade mig igen.”
- **Johan:** ”Jag låg vaken hela natten av smärta. Ingen gick genom köket mellan midnatt och sex. Det enda var frun, som kom ut efter dunsen, tittade genom fönstret och gick in igen.” Köket är den enda vägen ut ur bostaden.
- **Lagerkvist:** ”Jag hörde en duns från tornet vid tjugo över tre, men trodde att det var stormen.” Han grälade med Holger om väderstationens placering, vilket är ett avledande spår.
- **Elof**, när han konfronteras med bläcket: ”Holger måste ha lånat min penna.” Det är en lögn. Pennan låg i Elofs stuga och Holger skrev alltid i blyerts.

**Ledtrådar:**
1. ”Läs fyrinstruktionen. Vad säger den om urverket och om hur loggboken förs?”
2. ”Fyren lyste hela natten, så någon drog upp urverket kl. 04. Men kroppen låg i vägen redan från 03.20, och ingen kan ta sig upp utan att kliva över den. Vem skrev 04-anteckningen, och med vad?”
3. ”Stäm av alla fyra mot kl. 03.20. Vem saknar alibi? Läs sedan berättarens egen dagbok en gång till: hur kan han veta att Holger visslade kl. 04?”

**Lösningsväg (unik):**
1. Blåmärkena visar ett grepp, så det var inte en olyckshändelse utan ett knuff.
2. **Dödsögonblicket** var 03.20 enligt två oberoende vittnen, Signe och Lagerkvist, som hörde dunsen från olika byggnader.
3. Fyren lyste normalt hela natten enligt journalen, och urverket går högst 2 timmar och 15 minuter efter uppdragningen kl. 02. Alltså drog någon upp det runt 04.00 och klev då över kroppen utan att slå larm.
4. 04-anteckningen är skriven i **bläck**. Holger skrev alltid i blyerts och den enda reservoarpennan på ön tillhör Elof enligt hans egen dagbok. Signaturen ”H.W.” är förfalskad. Syftet var att få det att se ut som att Holger levde kl. 04.
5. Elofs dagbok påstår att Holger visslade kl. 04, en uppdiktad detalj som drar åt samma håll, och att Elof själv sov 23–06. Båda påståendena motsägs av punkt 2–4.
6. **Uteslutningar kl. 03.20:**
   - **Johan** har brutet ben och kan inte gå i en spiraltrappa.
   - **Lagerkvist** har barografmärken 03.15 och 03.30. Med 10 minuters gångväg i varje riktning kan han inte ha varit i tornet kl. 03.20.
   - **Signe** gick aldrig förbi köket enligt Johan, som är en främling utan skäl att skydda henne. Köket är enda utgången.
   - **Elof** har inget alibi, förfalskade loggboken och ljuger i dagboken.
→ **Elof Granath, berättaren, är skyldig.** Holger tänkte anmäla honom för att han sålt fyrens fotogen till smugglare.

**Återkoppling:**
- *Rätt:* ”Ni lät er inte förföras av en vänlig röst. Den som berättar en historia väljer vad som utelämnas. Elof glömde bara att hans egen penna skrev i bläck, och att en fyr med ett lik i trappan inte drar upp sig själv.”
- *Fel (Signe):* ”Brevet ger ett motiv, men Johan låg vaken i köket hela natten. Signe gick aldrig ut.”
- *Fel (Johan):* ”Främlingen är alltid lätt att misstänka, men med ett spjälat ben kommer man inte upp i en spiraltrappa.”
- *Efterord (twistavslöjande):* ”Det här fallet berättades av gärningsmannen. Gå tillbaka och läs dagboken igen. Allt stod där.”

---

### Fall 6 – Brudskålen 🜂 *(twist: offret är gärningsmannen)*

**Miljö:** En släktgård i Leksand, Dalarna, på midsommarafton i nutid.
**Längd och svårighet:** Medel (8–12 min) · 3/5 · Kärnmekanik: bildjämförelse (mobilfoton med tidsstämplar) · Bimekanik: dokument (försäkringsbrev).

**Premiss:** Gunnar Sahlin anmäler att hans 1700-talssilverskål, ”Brudskålen”, har stulits från skänken i salen under midsommarfesten. Han säger: *”Jag såg den 16.30, med sin gamla buckla på kanten. Vid 17.45 var den borta.”* Gästerna lämnar villigt ut sina mobilfoton.

**Personer:**
- **Gunnar Sahlin,** ägaren.
- **Lena Sahlin,** hans fru.
- **Mikael Ström,** antikhandlare och gäst.
- **Olle,** brorson, 19 år.
- Ett 20-tal övriga gäster, inklusive Lenas syster som stod för maten.

**Bildmaterial:**
- **Bild A (Gunnars Instagram, kl. 09.12 samma dag):** ”Putsat brudskålen inför festen! 🌸” Skålen står bredvid dagens Dala-Demokraten med datum. Den har en **tydlig buckla på kanten** och ett ”S” i ena handtaget. **Försäkringsfotot från 2019** visar samma buckla och samma handtag.
- **Bild B (gäst, 15.20):** Skålen syns på skänken. Den har **ingen buckla** och handtagen är släta.
- **Bild C (gäst, 16.05):** Samma skål, utan buckla.
- **Bild D (Olle, 17.05):** Skålen utan buckla står kvar. Olle står bredvid skänken med en tårta.
- **Bild E (gäst, 17.20):** Skålen är borta. Mikael syns i bakgrunden med en tom tårtbricka.
- Oviktiga skillnader att sortera bort, till exempel en flyttad vas, en tänd ljusstake och gardiner som dragits för.

**Dokument och fakta:**
- **Bussbolagets körlogg:** Alla gäster kom samtidigt med en inhyrd buss **kl. 15.15**. Lenas syster och maten fanns med i bussen.
- **Lena** åkte till Arlanda för att hämta sin mor. Parkeringskvittot visar 11.02–12.44 (Arlanda ligger två och en halv timme bort), och i bild B kl. 15.20 syns Lenas bil först köra in på gården. På bild C sitter hon och mamman vid kaffebordet.
- **Försäkringsbrevet:** Gunnar höjde försäkringsvärdet på skålen från 180 000 till 650 000 kr **för tre månader sedan**.
- **Gunnars utsaga:** Han var ensam på gården från morgonen tills bussen kom: ”Jag fixade inför festen.”

❌ Avledande spår:
- **Mikael,** antikhandlaren, går tidigt (16.50) med en stor väska. På bild E syns att väskan innehöll tårtbrickan.
- **Olle** står vid skänken kl. 17.05 på bild D. Skålen står kvar efter att han gått därifrån.

**Ledtrådar:**
1. ”Jämför Gunnars morgonbild med försäkringsfotot. Jämför sedan med eftermiddagens bilder. Titta på kanten.”
2. ”Skålen på festen är inte samma skål. När byttes den ut, och vilka fanns på gården då?”
3. ”Mellan 09.12 och 15.15 var gården tom på alla utom en person. Och vem påstod att han såg *bucklan* kl. 16.30?”

**Lösningsväg (unik):**
1. Bild A och försäkringsfotot visar bucklan och S:et. Skålen var äkta kl. 09.12, vilket tidningens datum bekräftar.
2. Bilderna B–D (15.20–17.05) visar en skål utan buckla och utan S. Det är en **kopia**. Den äkta skålen försvann alltså mellan 09.12 och 15.20.
3. Vem var på gården då? Alla gäster kom 15.15 och Lena kom 15.20 eller senare, enligt parkeringskvittot och bild B. Det var bara Gunnar som var där, och det säger han själv.
4. Gunnar påstår att han såg ”bucklan” kl. 16.30, men alla bilder från eftermiddagen visar en skål utan buckla. Det är en **lögn**, och den visar att han kände till bytet.
5. Kopian försvann 17.05–17.20. Den ”stölden” var alltså iscensatt. Det som togs var en kopia, så den spelar ingen roll för vem som tog den äkta skålen.
6. Försäkringshöjningen för tre månader sedan ger motivet.
→ **Gunnar Sahlin, den som anmälde stölden, är skyldig** till försäkringsbedrägeri. Den äkta skålen hittas inslagen i en sovsäck i båthuset.

**Återkoppling:**
- *Rätt:* ”Den bästa stölden är den som aldrig händer. Gunnar bytte skålen i lugn och ro på morgonen. Sedan lät han en kopia ’försvinna’ inför 25 vittnen. Han glömde bara att han själv hade lagt ut beviset på Instagram.”
- *Fel (Mikael):* ”En antikhandlare med väska ser misstänkt ut, men på bilderna stod skålen kvar när han gick, och det var dessutom inte ens den äkta skålen.”
- *Fel (Olle):* ”Olle stod bredvid skänken med en tårta. Skålen stod kvar när han gick.”

---

### 4.7 Verifiering av unikhet (sammanfattning)

| Fall | Vad som utesluter alla oskyldiga | Status |
|---|---|---|
| 1 | Fönstret är orört, så bara nyckelinnehavare är möjliga. Två har alibi och den tredje ljuger bevisligen. | ✅ Unik |
| 2 | Två kedjor inifrån och ett fastfruset fönster gör kupé 2 till enda vägen. Övriga har alibi. | ✅ Unik |
| 3 | Lösaren hittar exakt en placering, och alla nio ledtrådar behövs. | ✅ Unik (maskinverifierad) |
| 4 | Brottstiden fastställs av tre källor. Av nyckelinnehavarna har en vittnesalibi, en är fysiskt utesluten av gångtiden och en har en lucka som stämmer på minuten. | ✅ Unik |
| 5 | Fyra personer prövas mot 03.20. Tre har oberoende alibi eller kan fysiskt uteslutas. Den fjärde har förfalskat bevis. | ✅ Unik |
| 6 | Bytet skedde 09.12–15.20, och bara en person var på gården. | ✅ Unik |

*Rättningar under arbetet:* Fall 3:s första version hade fem möjliga lösningar. Ledtrådar lades till och tunnades sedan ut tills exakt en lösning återstod och varje ledtråd behövdes. I fall 6 togs en cateringleverans bort ur tidslinjen, eftersom den annars hade gett en andra möjlig person på gården.

---

## 5. Öppna frågor att besluta

Martin behöver godkänna följande. Förslaget anges först.

1. **Grafisk stil.** *Förslag:* Tecknad, något dämpad ”gravyr och akvarell”-stil i sepia med en tydlig accentfärg per fall. Den är tidlös och fungerar för både 1800-tal och nutid. *Alternativ:* noir (svartvitt), platt vektor eller fotomanipulerat.
2. **Berättelse.** Ska det finnas en återkommande huvudperson och en röd tråd mellan kapitlen, till exempel en mystisk motståndare som syns i bakgrunden, eller ska fallen vara helt fristående? *Förslag:* Fristående fall med en lätt ram, där detektiven och en återkommande inspektör ger kontinuitet och varje kapitel har en liten dold tråd.
3. **Detektivens identitet.** Ska spelaren vara en namngiven detektiv eller ”du”? Vilket kön har detektiven, eller kan spelaren välja?
4. **Poäng och ledtrådskostnad.** *Förslag:* 1–3 förstoringsglas. Ledtrådarna kostar −10/−25/−50 %, en fel anklagelse kostar −30 % och rätt bevis ger +1 bonus. Ingen tidtagning som standard, men den kan finnas som tillval. Godkänns det?
5. **Hur många fel anklagelser** tillåts innan facit visas? *Förslag:* 2.
6. **Anklagelsens djup.** Räcker *vem*, eller ska *hur, när och bevis* krävas i medellånga och långa fall? *Förslag:* Bevis krävs från svårighet 3 och uppåt.
7. **Ordning för twistfallen.** Ska twist komma strikt vart 4–5:e fall, eller som i förslaget med fall 6 som en tidig mindre twist? Ska twistfall märkas i förväg?
8. **Teknikval för webben.** *Förslag:* Vanilla TypeScript eller en lätt motor (Vite + Preact) med fallen som JSON, ingen backend i första versionen, och sparat läge i webbläsaren (localStorage). Mobilanpassningen görs responsivt från början.
9. **Språk.** Bara svenska först, men med texter i separata filer så att engelska kan läggas till senare. Godkänns det?
10. **Fallproduktion.** Ska fallen skrivas för hand, med AI-stöd eller genereras? *Förslag:* De första 10–12 fallen handskrivs. Därefter byggs en mallgenerator, och validering och lösare används alltid.
11. **Ljud och musik.** Ska det finnas stämningsljud och musik? Det kan vänta till efter prototypen.
12. **Första prototyp.** *Förslag:* Bygg fall 1 och 3 (scen och logikrutnät) som en vertikal skiva för att testa motor, JSON-format och ledtrådssystem innan resten byggs.

*Monetarisering tas inte upp i det här förslaget.*
