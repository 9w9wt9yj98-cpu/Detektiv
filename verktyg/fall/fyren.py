# Genererar fall/fyren-pa-graskar.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d

fall = {"id": "fyren-pa-graskar", "version": 1,
 "meta": {"titel": "Fyren på Gråskär", "miljo": "Fyrplats i ytterskärgården", "epok": "1930-tal", "brottstyp": "mord", "langd": "lang",
   "uppskattad_tid_min": [20, 30], "svarighet": 4, "karnmekanik": "dokument", "bimekaniker": ["scen", "forhor", "tidslinje"], "twist": "opalitlig-berattare", "kraver_rang": 0,
   "accentfarg": "#3a4a52", "omslag": "bilder/fall6/fyren.jpg", "mal": "Ta reda på hur fyrmästare Wenngren dog – och vem som ljuger", "handledning_mal": "kroppen"},
 "intro": {"rubrik": "Gråskärs fyrplats, Stockholms ytterskärgård. Oktober 1931.",
   "text": "Bäste herr detektiv,\n\nförlåt min darriga hand – stormen har inte bedarrat förrän i dag, och det är första gången på två dygn som en båt kan lägga till. Fyrmästare Holger Wenngren är död. Fru Signe fann honom klockan sex i morse den fjortonde, nedanför den smala spiraltrappan i tornet. Vi har låtit honom ligga, så som doktorn sade, och klivit över honom sedan dess. Gud förlåte oss.\n\nJag är bara fyrbiträde, men jag har varit tidningsman och vet hur viktigt det är med papper. Därför har jag samlat allt åt er: fyrinstruktionen, loggboken, doktorns anteckningar – och min egen dagbok, om den kan vara till någon hjälp. Allt ligger där ni hittar det.\n\nDet var nog en olyckshändelse. Trappan är brant, och Holger var inte så ung längre. Men ni ska få bedöma själv.\n\nEr tillgivne\nElof Granath, fyrbiträde",
   "uppdrag": "Hur dog fyrmästaren – och vem ljuger?", "bild": "bilder/fall6/fyren.jpg", "berattare": "Elof Granath, fyrbiträde"},
 "personer": [
   {"id": "elof", "namn": "Elof Granath", "roll": "Fyrbiträde", "misstankt": T, "beskrivning": "Vänlig och hjälpsam. Har samlat alla papper åt dig. Bor i biträdesstugan."},
   {"id": "signe", "namn": "Signe Wenngren", "roll": "Fyrmästarens hustru", "misstankt": T, "beskrivning": "Blek och tystlåten. Bor i fyrmästarbostaden."},
   {"id": "lagerkvist", "namn": "Dr. Arvid Lagerkvist", "roll": "Meteorolog vid väderstationen", "misstankt": T, "beskrivning": "Har grälat med fyrmästaren om stationens placering."},
   {"id": "johan", "namn": "Johan Sjöberg", "roll": "Skeppsbruten fiskare", "misstankt": T, "beskrivning": "Flöt i land kvällen innan med ett brutet ben. Ligger på köksbänken."},
   {"id": "holger", "namn": "Holger Wenngren", "roll": "Fyrmästare, död", "misstankt": False, "beskrivning": "Sträng, noggrann, alltid med blyertspennan bakom örat."},
 ]}

# ---------- Tornet ----------
tornet = {"id": "tornet", "namn": "Tornets nedre avsats", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 4.4, "djup": 4.4, "hojd": 4.2, "miljo": "inomhus", "vagg": "sten", "panel": False, "bakgrund": "#0e1216", "dimma": [5, 13, "#12171c"],
  "golv": {"typ": "sten"},
  "ljus": {"omgivning": "#c8d0d8", "omgivning_styrka": 0.45, "bas": 0.25},
  "start": {"pos": [-0.5, 1.5], "titta": 10},
  "objekt": [
    obj("trappan", "spiraltrappa", [0.7, 0, -1.0], radie=1.1, hojd=4.2, steg=18, varv=1.0),
    obj("kroppen", "taeckt", [-0.55, 0, -0.75], rot=75, farg="#5a5448", interaktiv=ia("Holger Wenngren",
        "Fyrmästaren ligger under en grå filt på nedre avsatsen, tvärs över trappans första steg. Nålad på filten sitter doktor Lagerkvists anteckning från fyndet. Du lyfter filten: blåmärken på båda överarmarna, som efter ett hårt grepp. I bröstfickan sitter blyertspennan kvar.", "f-blamarken", ["dok-fyndet"])),
    obj("elof", "person", [1.3, 0, 1.0], rot=-140, rock="#3a4a5a", byxor="#2a2a30", har="#c8a060", glasogon=True, seed=3,
        interaktiv=ia("Elof Granath", "Elof skakar hand med båda händerna. ”Tack för att ni kom! Papperen ligger där de hör hemma – loggboken och instruktionen uppe i lanternan, min dagbok i stugan, doktorns journal på stationen. Fråga mig vad som helst. Jag vill bara att det här ska bli utrett, för Signes skull.”", "f-elof-hjalp")),
    obj("kannor", "fotogen", [-1.6, 0, 1.7], antal=3),
    obj("lampa1", "vagglampa", [-2.18, 2.0, 0.4], rot=90, styrka=1.2, flimrar=True, farg="#ffd08a"),
    obj("lampa2", "vagglampa", [2.18, 2.0, -0.2], rot=-90, styrka=1.0, flimrar=True, farg="#ffd08a"),
    obj("bok", "anteckningsbok", [-1.6, 0.45, 1.7], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr-upp", "dorr", [-1.3, 0, -2.19], farg="#3a3a36", gar_till="lanternan", interaktiv=ia("Uppför trappan till lanternan", "Trappan vindlar upp genom tornet till lanternan. För att komma upp måste du kliva över fyrmästaren.")),
    obj("skylt-upp", "skylt", [-1.3, 2.5, -2.185], text="LANTERNAN ↑", storlek=[0.8, 0.18], textstorlek=40),
    obj("dorr-koket", "dorr", [-2.19, 0, 0.6], rot=90, farg="#4a3a2a", gar_till="koket", interaktiv=ia("Till fyrmästarbostaden", "Över klippan, genom stormen, till fyrmästarbostadens kök.")),
    obj("dorr-stugan", "dorr", [2.19, 0, 1.0], rot=-90, farg="#4a3a2a", gar_till="stugan", interaktiv=ia("Till biträdesstugan", "Elofs stuga ligger i lä bakom tornet.")),
    obj("dorr-station", "dorr", [0.4, 0, 2.19], rot=180, farg="#4a3a2a", gar_till="stationen", interaktiv=ia("Till väderstationen", "Väderstationen ligger på öns norra udde – tio minuters väg i storm, enligt doktorn.")),
  ]}}}

# ---------- Lanternan ----------
lanternan = {"id": "lanternan", "namn": "Lanternan", "mekanik": "scen", "last_upp_av": ["f-blamarken"],
  "last_text": "Fyrmästaren ligger tvärs över trappan. Undersök honom först.",
  "payload": {"visning": "3d", "rum": {
  "bredd": 3.6, "djup": 3.6, "hojd": 3.0, "miljo": "inomhus", "vagg": "puts", "putsfarg": "#2e3236", "panel": False, "takfarg": "#202428", "bakgrund": "#0a0e12", "dimma": [5, 12, "#0e1318"],
  "golv": {"typ": "jarn"},
  "ljus": {"omgivning": "#a8b8c8", "omgivning_styrka": 0.5, "bas": 0.24},
  "start": {"pos": [-1.2, 1.5], "titta": -25},
  "objekt": [
    obj("lins", "lins", [0.3, 0, -0.6], skala=1.25, styrka=3.6),
    obj("urverk", "urverk", [1.25, 0, -0.4], rot=-90, interaktiv=ia("Urverket", "Urverket som vrider linsen tickar tungt. Det är fullt uppdraget nu – Elof har skött fyren sedan olyckan. En mässingsplåt på huset: ”Gångtid fullt uppdraget: 2 t. 15 m.”")),
    obj("glas-n", "lanternglas", [0, 0, -1.79], langd=3.6),
    obj("glas-o", "lanternglas", [1.79, 0, 0], rot=-90, langd=3.6),
    obj("glas-v", "lanternglas", [-1.79, 0, 0.9], rot=90, langd=1.8),
    obj("glas-s", "lanternglas", [-0.95, 0, 1.79], rot=180, langd=1.7),
    obj("instruktion", "tavelkarta", [-1.785, 1.6, -0.8], rot=90, storlek=[0.7, 0.9], textstorlek=20,
        text="KUNGL. LOTSVERKET\nFYRINSTRUKTION\nGråskär 1924\n\n§ 7. Urverket drages upp\nvarannan timme ...\n\n§ 9. Loggboken föres\nalltid med blyerts ...",
        interaktiv=ia("Fyrinstruktionen", "Den tryckta instruktionen hänger i ram på väggen. Du skriver av paragraferna om urverket och loggboken.", material=["dok-instruktion"])),
    obj("bord", "bord", [-0.9, 0, 1.1], storlek=[0.9, 0.75, 0.6], farg="#5a4a3a"),
    obj("loggboken", "liggare", [-0.9, 0.75, 1.1], storlek=[0.46, 0.32], farg="#2a3a4a", interaktiv=ia("Loggboken", "Fyrens loggbok ligger uppslagen vid natten mellan den 13 och 14 oktober. Blyertspennan ligger i falsen.", material=["dok-loggbok"])),
    obj("bok", "anteckningsbok", [-0.6, 0.75, 1.25], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("pulpet", "pulpet", [1.2, 0, 1.2], rot=-130, interaktiv=ia("Fyrmästarens pulpet", "I pulpetens lock ligger ett utkast i Holgers kantiga blyertsstil, adresserat till Kungl. Lotsverket. Han hann aldrig skicka det.", "f-anmalan", ["dok-anmalan"])),
    obj("dorr-ned", "dorr", [0.7, 0, 1.79], rot=180, farg="#3a3a36", gar_till="tornet", interaktiv=ia("Nedför trappan", "Ned till tornets nedre avsats.")),
  ]}}}

# ---------- Köket ----------
koket = {"id": "koket", "namn": "Fyrmästarbostadens kök", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 4.2, "djup": 3.8, "hojd": 2.5, "miljo": "inomhus", "vagg": "puts", "putsfarg": "#e2d6bc", "panel": "#5a6a5a", "bakgrund": "#140e08", "dimma": [6, 14, "#1a120a"],
  "golv": "#7a5a3a",
  "ljus": {"omgivning": "#ffd9a8", "omgivning_styrka": 0.55, "bas": 0.3},
  "start": {"pos": [0.4, 1.3], "titta": 0},
  "objekt": [
    obj("spis", "vedspis", [-1.5, 0, -1.55], styrka=1.6),
    obj("bank", "koj", [1.65, 0, -0.5], bredd=0.8, langd=1.9, overkoj=False, tyg="#6a5a4a"),
    obj("johan", "person", [1.65, 0, -1.25], pose="ligga", lagHojd=0.62, rock="#3a4a6a", byxor="#4a4a50", har="#4a3a2a", skagg=True, seed=1,
        interaktiv=ia("Johan Sjöberg", "Fiskaren ligger på köksbänken med vänsterbenet spjälat mellan två brädor. Doktorn spjälade det kvällen före olyckan. Johan kan inte ens sätta ned foten.", ["f-johan-ben", "f-johan-koket"], ["dok-johan"])),
    obj("signe", "person", [-0.4, 0, -0.5], rot=25, kon="k", rock="#2a2a30", har="#8a6a4a", hatt="sjalett", hattfarg="#1a1a1e", seed=0,
        interaktiv=ia("Signe Wenngren", "Signe står vid spisen och vrider en handduk mellan händerna. Hon talar lågt och ser mot fönstret.", "f-duns-signe", ["dok-signe"])),
    obj("byra", "byra", [-1.89, 0, 0.6], rot=90, storlek=[1.0, 0.85, 0.45]),
    obj("klockan", "pendyl", [-1.89, 0.85, 0.3], rot=90),
    obj("brevet", "papper", [-1.85, 0.85, 0.85], rot=90, interaktiv=ia("Ett brev i byrålådan", "Halvt undanstoppat i byrålådan ligger ett oavsänt brev i Signes handstil, adresserat till en man i Norrtälje.", "f-signe-brev", ["dok-brevet"])),
    obj("fonster", "stormfonster", [0.3, 0, -1.89], bredd=0.9, hojd=1.0, y0=1.0, ram="#e8e2d2"),
    obj("bord", "bord", [0.3, 0, 0.5], storlek=[1.0, 0.75, 0.7], farg="#8a6a44", duk=True),
    obj("lampa", "oljelampa", [0.5, 0.75, 0.4], ljus=True, styrka=2.0),
    obj("bok", "anteckningsbok", [0.1, 0.75, 0.6], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [0.9, 0, 1.89], rot=180, farg="#4a3a2a", gar_till="tornet", interaktiv=ia("Köksdörren", "Den enda dörren ut ur bostaden – genom köket. Tillbaka till tornet.")),
  ]}}}

# ---------- Biträdesstugan ----------
stugan = {"id": "stugan", "namn": "Biträdesstugan", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 3.6, "djup": 3.4, "hojd": 2.4, "miljo": "inomhus", "vagg": "trapanel", "panelfarg": "#8a6a48", "panel": False, "bakgrund": "#140e08", "dimma": [6, 14, "#1a120a"],
  "golv": "#6a4a2c",
  "ljus": {"omgivning": "#ffd9a8", "omgivning_styrka": 0.5, "bas": 0.28},
  "start": {"pos": [-0.6, 1.1], "titta": 10},
  "objekt": [
    obj("sang", "sang", [1.0, 0, -0.6]),
    obj("bord", "bord", [-0.9, 0, -1.2], storlek=[0.9, 0.75, 0.6], farg="#6a4a2c"),
    obj("dagboken", "liggare", [-1.05, 0.75, -1.2], storlek=[0.34, 0.24], farg="#5a2a1a", interaktiv=ia("Elofs dagbok", "En svart dagbok, prydligt förd med reservoarpenna. Ett bokmärke ligger vid natten mot den fjortonde.", material=["dok-dagbok"])),
    obj("pennan", "skrivdon", [-0.65, 0.75, -1.25], interaktiv=ia("Reservoarpennan", "En fin reservoarpenna med guldnäbb och ett bläckhorn med blåsvart bläck. På pennan är ingraverat: ”Till E.G. från redaktionen, 1928”.", "f-pennan")),
    obj("lampa", "oljelampa", [-1.25, 0.75, -1.3], ljus=True, styrka=2.0),
    obj("kannor", "fotogen", [1.0, 0, 1.2], antal=2, interaktiv=ia("Fotogenkannor", "Två fotogenkannor med Kungl. Lotsverkets stämpel står bakom dörren – i biträdets egen stuga, inte i fyrens förråd. Båda är tomma.", "f-fotogen-stuga")),
    obj("fonster", "stormfonster", [0.0, 0, -1.69], bredd=0.8, hojd=0.9, y0=1.0, ram="#d8ccb0"),
    obj("bok", "anteckningsbok", [-0.6, 0.75, -1.05], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [-0.8, 0, 1.69], rot=180, farg="#4a3a2a", gar_till="tornet", interaktiv=ia("Ut", "Tillbaka till tornet.")),
  ]}}}

# ---------- Väderstationen ----------
stationen = {"id": "stationen", "namn": "Väderstationen", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 3.6, "djup": 3.4, "hojd": 2.4, "miljo": "inomhus", "vagg": "trapanel", "panelfarg": "#7a6a50", "panel": False, "bakgrund": "#140e08", "dimma": [6, 14, "#1a120a"],
  "golv": "#5a4a34",
  "ljus": {"omgivning": "#ffe2b8", "omgivning_styrka": 0.55, "bas": 0.3},
  "start": {"pos": [-0.4, 1.1], "titta": 0},
  "objekt": [
    obj("bord", "bord", [0.0, 0, -1.2], storlek=[1.4, 0.78, 0.6], farg="#6a5a40"),
    obj("barografen", "barograf", [0.35, 0.78, -1.25], interaktiv=ia("Barografen", "Barografens trumma vrids av ett urverk. Rullen från natten mot den fjortonde sitter kvar. Vid varje observation har doktorn tryckt ned tidsmärkespaken, som slår ett litet hack i kurvan.", "f-barograf", ["dok-barograf"])),
    obj("journalen", "liggare", [-0.35, 0.78, -1.2], storlek=[0.42, 0.3], farg="#3a3a2a", interaktiv=ia("Väderjournalen", "Doktorns journal, förd med vetenskaplig noggrannhet.", "f-gangvag", ["dok-journal"])),
    obj("lagerkvist", "person", [1.0, 0, 0.1], rot=-120, rock="#4a4a3a", byxor="#2a2a24", har="#c8c4b8", glasogon=True, skagg=True, seed=2,
        interaktiv=ia("Dr. Lagerkvist", "Doktorn putsar sina glasögon. ”Ni har väl läst min anteckning vid kroppen? Jag skrev den klockan tio över sex. Och nej, jag lämnade inte stationen den natten – stormvarning betyder observation var femtonde minut, och det har jag gjort i tjugo år.”", ["f-duns-lagerkvist", "f-grall"], ["dok-lagerkvist"])),
    obj("barometer", "vaggur", [1.79, 1.1, -0.6], rot=-90, tid=[7, 5], farg="#5a3a1a"),
    obj("lampa", "oljelampa", [-0.6, 0.78, -1.3], ljus=True, styrka=2.0),
    obj("fonster", "stormfonster", [-1.79, 0, -0.3], rot=90, bredd=0.8, hojd=0.9, y0=1.0, ram="#d8ccb0"),
    obj("bok", "anteckningsbok", [0.0, 0.78, -1.05], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [-0.6, 0, 1.69], rot=180, farg="#4a3a2a", gar_till="tornet", interaktiv=ia("Ut i stormen", "Tio minuter tillbaka till tornet.")),
  ]}}}

S = lambda text, id=None, stil=None: {k: v for k, v in {"id": id, "text": text, "stil": stil}.items() if v}
dokument = {"id": "dokumenten", "namn": "Dokumenten", "mekanik": "dokument", "payload": {"visning": "dokument",
  "kort_instruktion": "Läs dokumenten och hitta det som inte kan stämma.",
  "instruktion": "Läs noga – också det som inte står. Tryck på två stycken, eller ett stycke och ett fynd, som inte kan vara sanna samtidigt och tryck Invänd! Med Markera kan du stryka under det du vill komma ihåg. Fel kostar ingenting.",
  "fel_text": "De två kan mycket väl stämma samtidigt. Läs igen – vad säger de om tid, om penna, om vem som kan gå var?",
  "fynd_valbara": ["f-dodstid", "f-uppdragen", "f-forfalskad", "f-blamarken", "f-pennan", "f-barograf", "f-johan-ben", "f-signe-brev", "f-anmalan", "f-04-black"],
  "dokument": [
    {"id": "dok-instruktion", "titel": "Fyrinstruktion för Gråskär", "underrubrik": "Kungl. Lotsverket 1924 (tryck)", "ikon": "📕", "stil": "tryck", "stycken": [
      S("§ 7. Linsapparatens urverk."),
      S("Urverket drages upp varannan timme. Fullt uppdraget går det högst 2 timmar och 15 minuter; därefter stannar linsen och fyren slutar blinka.", "i-urverk"),
      S("§ 9. Loggboken."),
      S("Varje uppdragning antecknas genast i loggboken med klockslag och signatur. Anteckningarna föras alltid med blyerts, emedan bläck fryser i lanternan.", "i-blyerts"),
      S("§ 12. Vid storm skall fyrvaktaren hålla lanternans fönster fria från is och snö.")]},
    {"id": "dok-loggbok", "titel": "Gråskärs fyrloggbok", "underrubrik": "Natten mellan den 13 och 14 oktober 1931", "ikon": "📓", "stil": "logg", "stycken": [
      S("22.00  Uppdragning. Storm SV 9, sikt dålig.  – H.W.", "l-2200", "blyerts"),
      S("00.00  Uppdragning. Storm tilltagande.  – H.W.", "l-0000", "blyerts"),
      S("02.00  Uppdragning.  – H.W.", "l-0200", "blyerts"),
      S("04.00  Uppdragning  – H.W.   [blåsvart bläck; handstilen liknar Holgers men lutar åt andra hållet]", "l-0400", "blacke"),
      S("06.00  Fyrmästaren funnen död i trappan. Uppdragning.  – E.G.", "l-0600", "blyerts")]},
    {"id": "dok-dagbok", "titel": "Elof Granaths dagbok", "underrubrik": "13–14 oktober 1931", "ikon": "📔", "stil": "hand", "stycken": [
      S("Jag skriver detta med min reservoarpenna, den enda på ön – en present från redaktionen när jag slutade på tidningen.", "d-penna"),
      S("Doktorn och Holger grälade igen vid middagen, om var väderstationen skulle stå. Holger kan vara hård.", "d-grall"),
      S("Jag gick till kojs vid elva och sov tungt till sex, då Signes skrik väckte mig.", "d-sov"),
      S("Vid fyratiden vaknade jag kort av att Holger visslade uppe i tornet, som han alltid gör vid uppdragningen, och så somnade jag om.", "d-visslade"),
      S("Stackars Holger. Trappan är brant, och han var inte så ung längre.", "d-olycka")]},
    {"id": "dok-fyndet", "titel": "Dr. Lagerkvists anteckning vid fyndet", "underrubrik": "14 oktober, kl. 06.10", "ikon": "🩺", "stil": "hand", "stycken": [
      S("Kroppen låg tvärs över trappan på nedre avsatsen. Ingen kan passera upp till lanternan utan att kliva över honom.", "n-trappa"),
      S("Blåmärken på båda överarmarna efter ett hårt grepp. Nacken bruten. Kroppen kall – döden inträffade flera timmar före sex.", "n-grepp")]},
    {"id": "dok-journal", "titel": "Väderjournal, Gråskärs station", "underrubrik": "13–14 oktober 1931", "ikon": "📒", "stil": "logg", "stycken": [
      S("Stormvarning från kl. 21. Observation var 15:e minut enligt instruktion; varje avläsning märks med tidsmärke på barografens rulle.", "j-storm"),
      S("02.00–06.00: vid varje observation antecknat ”Fyren lyser normalt”.", "j-fyr"),
      S("Gångväg stationen–fyrtornet i storm: 10 minuter (uppmätt i september).", "j-vag")]},
    {"id": "dok-barograf", "titel": "Barografens pappersrulle", "underrubrik": "Tidsmärken, natten mot den 14 oktober", "ikon": "📈", "stil": "maskin", "stycken": [
      S("Obrutna tidsmärken: 02.00 · 02.15 · 02.30 · 02.45 · 03.00 · 03.15 · 03.30 · 03.45 · 04.00 · 04.15 · 04.30 · 04.45 · 05.00", "b-marken"),
      S("Märkena slås för hand av observatören vid instrumentet.")]},
    {"id": "dok-signe", "titel": "Signe Wenngrens berättelse", "ikon": "🗣️", "stil": "hand", "stycken": [
      S("Jag vaknade av en duns. Klockan på byrån visade tjugo över tre.", "s-duns"),
      S("Jag gick ut i köket och tittade mot tornet men såg ingenting, så jag gick och lade mig igen. Holger brukade inte vilja bli störd i tornet.", "s-koket")]},
    {"id": "dok-johan", "titel": "Johan Sjöbergs berättelse", "ikon": "🗣️", "stil": "hand", "stycken": [
      S("Jag låg vaken hela natten av smärta på köksbänken. Ingen gick genom köket mellan midnatt och sex.", "jo-vaken"),
      S("Det enda var frun, som kom ut efter dunsen, tittade genom fönstret och gick in igen.", "jo-frun"),
      S("(Köket är den enda vägen ut ur fyrmästarbostaden.)")]},
    {"id": "dok-lagerkvist", "titel": "Dr. Lagerkvists berättelse", "ikon": "🗣️", "stil": "hand", "stycken": [
      S("Jag hörde en duns från tornet vid tjugo över tre, men trodde att det var stormen som slet i något.", "la-duns"),
      S("Ja, vi grälade om stationen. Men man dödar inte en man för en mätplats.", "la-grall")]},
    {"id": "dok-brevet", "titel": "Signes brev (oavsänt)", "ikon": "✉️", "stil": "hand", "stycken": [
      S("Käre Anton, snart är jag fri. Holger vet ingenting ännu, och jag ska säga det själv när båten går.", "br-fri")]},
    {"id": "dok-anmalan", "titel": "Holgers utkast till Lotsverket", "ikon": "📝", "stil": "hand", "stycken": [
      S("Förrådet saknar sextio liter fotogen sedan augusti. Jag har anledning att misstänka mitt biträde och avser att anmäla saken när båten går.", "a-fotogen")]},
    {"id": "dok-elof2", "titel": "Elof, konfronterad med bläcket", "ikon": "🗣️", "stil": "hand", "kraver": ["f-04-black"], "stycken": [
      S("Bläck? Då måste Holger ha lånat min penna. Det gjorde han ibland.", "e-lanat")]},
  ],
  "motsagelser": [
    {"id": "m-urverk", "par": [["i-urverk", "j-fyr"]], "ger_fynd": "f-uppdragen", "text": "Urverket går högst 2 timmar och 15 minuter. Uppdraget kl. 02 hade det stannat 04.15 – men doktorn såg fyren lysa normalt hela natten. Någon drog upp urverket vid fyra."},
    {"id": "m-klev", "par": [["n-trappa", "f-uppdragen"], ["n-trappa", "l-0400"]], "ger_fynd": "f-klev-over", "text": "Den som drog upp urverket vid fyra gick uppför trappan – och klev över fyrmästaren utan att slå larm."},
    {"id": "m-blyerts", "par": [["i-blyerts", "l-0400"]], "ger_fynd": "f-04-black", "text": "Loggboken förs alltid med blyerts, eftersom bläck fryser. 04-anteckningen är skriven med blåsvart bläck – och handstilen lutar åt fel håll."},
    {"id": "m-forfalskad", "par": [["l-0400", "f-dodstid"], ["l-0400", "s-duns"], ["l-0400", "la-duns"]], "ger_fynd": "f-forfalskad", "text": "”04.00 Uppdragning – H.W.” Men Holger föll 03.20. Han kan inte ha skrivit raden. Signaturen är förfalskad."},
    {"id": "m-penna", "par": [["d-penna", "l-0400"], ["d-penna", "f-04-black"]], "ger_fynd": "f-elofs-penna", "text": "Den enda reservoarpennan på ön är Elofs – det skriver han själv. 04-anteckningen är skriven med bläck."},
    {"id": "m-visslade", "par": [["d-visslade", "f-dodstid"], ["d-visslade", "s-duns"], ["d-visslade", "la-duns"]], "ger_fynd": "f-dagbok-logn", "text": "Elof skriver att han hörde Holger vissla i tornet vid fyra. Men Holger låg död i trappan sedan 03.20. Det har Elof hittat på."},
    {"id": "m-lanat", "kravs": False, "par": [["e-lanat", "f-dodstid"], ["e-lanat", "f-forfalskad"], ["e-lanat", "i-blyerts"]], "ger_fynd": "f-elof-ljuger", "text": "En död man lånar ingen penna – och Holger skrev alltid med blyerts. Elof ljuger."},
  ]}}

fall["moment"] = [tornet, lanternan, koket, stugan, stationen, dokument]

fall["fynd"] = [
  {"id": "f-blamarken", "titel": "Blåmärken efter grepp", "ikon": "✋", "typ": "nyckel", "text": "Holger har blåmärken på båda överarmarna efter ett hårt grepp. Han föll inte av sig själv."},
  {"id": "f-elof-hjalp", "titel": "Elof har samlat papperen", "ikon": "📦", "typ": "bakgrund", "galler": ["elof"], "text": "Elof har lagt fram alla papper åt dig – och sin egen dagbok."},
  {"id": "f-anmalan", "titel": "Holgers anmälan", "ikon": "📝", "typ": "stod", "galler": ["elof"], "text": "Holger tänkte anmäla sitt biträde för att sextio liter fotogen saknades."},
  {"id": "f-johan-ben", "titel": "Johans brutna ben", "ikon": "🦴", "typ": "nyckel", "galler": ["johan"], "text": "Johan har ett spjälat, brutet ben. Han kan inte stödja på det – än mindre gå i en spiraltrappa."},
  {"id": "f-johan-koket", "titel": "Ingen gick genom köket", "ikon": "🚪", "typ": "nyckel", "galler": ["signe"], "text": "Johan låg vaken i köket, den enda vägen ut ur bostaden. Ingen gick ut mellan midnatt och sex – Signe kom bara ut och tittade efter dunsen."},
  {"id": "f-duns-signe", "titel": "Signe hörde dunsen 03.20", "ikon": "🔊", "typ": "nyckel", "text": "Signe vaknade av en duns. Klockan på byrån visade 03.20."},
  {"id": "f-signe-brev", "titel": "”Snart är jag fri”", "ikon": "✉️", "typ": "avledande", "galler": ["signe"], "text": "Ett oavsänt brev från Signe till en man i Norrtälje.", "forklaring": "Signe tänkte lämna Holger – ett motiv, men hon gick aldrig ut genom köket den natten."},
  {"id": "f-pennan", "titel": "Elofs reservoarpenna", "ikon": "🖋️", "typ": "stod", "galler": ["elof"], "text": "En reservoarpenna och ett bläckhorn med blåsvart bläck på Elofs bord."},
  {"id": "f-fotogen-stuga", "titel": "Fotogen i stugan", "ikon": "🛢️", "typ": "stod", "galler": ["elof"], "text": "Två tomma fotogenkannor med Lotsverkets stämpel står i Elofs stuga."},
  {"id": "f-barograf", "titel": "Barografens märken", "ikon": "📈", "typ": "nyckel", "galler": ["lagerkvist"], "text": "Doktorn slog tidsmärken för hand var femtonde minut 02.00–05.00, bland annat 03.15 och 03.30."},
  {"id": "f-gangvag", "titel": "Tio minuter i storm", "ikon": "🌬️", "typ": "bakgrund", "galler": ["lagerkvist"], "text": "Gångvägen mellan väderstationen och tornet tar tio minuter i storm."},
  {"id": "f-duns-lagerkvist", "titel": "Doktorn hörde dunsen 03.20", "ikon": "🔊", "typ": "nyckel", "text": "Lagerkvist hörde en duns från tornet vid 03.20, från en annan byggnad än Signe."},
  {"id": "f-grall", "titel": "Grälet om stationen", "ikon": "💢", "typ": "avledande", "galler": ["lagerkvist"], "text": "Lagerkvist och Holger grälade om väderstationens placering.", "forklaring": "Ett gräl om en mätplats – och doktorn slog tidsmärken på barografen var femtonde minut hela natten."},
  {"id": "f-dodstid", "titel": "Holger föll 03.20", "ikon": "🕞", "typ": "nyckel", "text": "Två vittnen i två olika byggnader hörde dunsen 03.20. Då föll Holger."},
  {"id": "f-uppdragen", "titel": "Någon drog upp urverket vid fyra", "ikon": "⚙️", "typ": "nyckel", "text": "Urverket går högst 2 t 15 min, men fyren lyste hela natten. Någon drog upp det vid fyra – efter 03.20."},
  {"id": "f-klev-over", "titel": "Klev över honom", "ikon": "🪜", "typ": "nyckel", "text": "Den som drog upp urverket vid fyra klev över den döde fyrmästaren – och slog inte larm."},
  {"id": "f-04-black", "titel": "04-raden är skriven med bläck", "ikon": "🖋️", "typ": "nyckel", "text": "Loggboken förs alltid med blyerts. 04-anteckningen är skriven med blåsvart bläck."},
  {"id": "f-forfalskad", "titel": "Signaturen är förfalskad", "ikon": "✒️", "typ": "nyckel", "text": "Holger var död kl. 04. ”Uppdragning – H.W.” skrevs av någon annan för att han skulle verka leva."},
  {"id": "f-elofs-penna", "titel": "Elofs penna", "ikon": "🖋️", "typ": "nyckel", "galler": ["elof"], "text": "Den enda reservoarpennan på ön är Elofs, enligt hans egen dagbok. 04-raden är skriven med bläck."},
  {"id": "f-dagbok-logn", "titel": "Visslingen som aldrig hördes", "ikon": "📔", "typ": "nyckel", "galler": ["elof"], "text": "Elof skriver att Holger visslade i tornet vid fyra. Holger var död sedan 03.20."},
  {"id": "f-elof-ljuger", "titel": "”Holger lånade pennan”", "ikon": "🗣️", "typ": "stod", "galler": ["elof"], "text": "Elof påstår att Holger lånade hans penna. En död man lånar ingen penna."},
  {"id": "f-lagerkvist-alibi", "titel": "Doktorn kunde inte gå ifrån", "ikon": "⏱️", "typ": "nyckel", "galler": ["lagerkvist"], "text": "Märkena 03.15 och 03.30: fram och tillbaka till tornet tar 20 minuter. Doktorn kan inte ha varit i tornet 03.20."},
  {"id": "f-signe-alibi", "titel": "Signe gick aldrig ut", "ikon": "🚪", "typ": "nyckel", "galler": ["signe"], "text": "Johan, en främling utan skäl att skydda henne, låg vaken i köket. Signe gick aldrig ut."},
]

fall["slutsatser"] = [
  {"id": "s-knuff", "kraver": ["f-blamarken"], "fraga": "Föll fyrmästaren av sig själv?", "alternativ": [
    {"text": "Ja – trappan är brant och han var inte ung, som Elof skriver.", "svar": "Blåmärken på båda överarmarna efter ett hårt grepp? Någon höll i honom."},
    {"text": "Nej – blåmärkena visar ett hårt grepp. Någon knuffade honom.", "ratt": True}],
   "slutsats": "Holger föll inte. Någon grep tag i honom och knuffade honom i trappan."},
  {"id": "s-dodstid", "kraver": ["f-duns-signe", "f-duns-lagerkvist"], "ger_fynd": "f-dodstid", "fraga": "När föll Holger?", "alternativ": [
    {"text": "Kl. 03.20.", "ratt": True},
    {"text": "Efter 04.00 – loggboken visar ju att han drog upp urverket då.", "svar": "Loggboken är ett papper. Två människor i två olika hus hörde dunsen tjugo över tre."},
    {"text": "Strax före sex, då Signe hittade honom.", "svar": "Doktorn skriver att kroppen var kall och att döden inträffat flera timmar före sex."}],
   "slutsats": "Signe i bostaden och doktorn på stationen hörde dunsen, oberoende av varandra, 03.20. Då föll Holger."},
  {"id": "s-lagerkvist", "kraver": ["f-barograf", "f-gangvag"], "ger_fynd": "f-lagerkvist-alibi", "fraga": "Kan doktor Lagerkvist ha varit i tornet 03.20?", "alternativ": [
    {"text": "Ja – han hade ett motiv och hörde dunsen.", "svar": "Räkna: märken 03.15 och 03.30, tio minuter dit och tio tillbaka."},
    {"text": "Nej – han slog märken 03.15 och 03.30. Tornet och tillbaka tar 20 minuter.", "ratt": True}],
   "slutsats": "Doktorn kan inte ha varit i tornet 03.20 – och inte heller vid fyra (märken 03.45, 04.00 och 04.15)."},
  {"id": "s-signe", "kraver": ["f-johan-koket", "f-signe-brev"], "ger_fynd": "f-signe-alibi", "fraga": "Signe ville bli fri. Kan hon ha gjort det?", "alternativ": [
    {"text": "Ja – brevet ger henne motiv.", "svar": "Motiv, ja. Men hur kom hon ut? Köket är enda vägen, och där låg Johan vaken."},
    {"text": "Nej – Johan låg vaken i köket, den enda vägen ut, och hon gick aldrig ut.", "ratt": True}],
   "slutsats": "Signe har motiv men gick aldrig ut. Johan är en främling utan skäl att ljuga för henne."},
  {"id": "s-johan", "kraver": ["f-johan-ben"], "fraga": "Johan är en främling som flöt i land. Kan han ha gjort det?", "alternativ": [
    {"text": "Ja – ingen vet vem han egentligen är.", "svar": "Med ett spjälat ben tar man sig inte upp i en spiraltrappa."},
    {"text": "Nej – med ett brutet ben kommer han inte upp i trappan.", "ratt": True}],
   "slutsats": "Johan kan inte gå. Han kan uteslutas."},
  {"id": "s-vem", "kraver": ["f-uppdragen", "f-klev-over", "f-04-black", "f-elofs-penna", "f-dodstid"], "efter": ["s-dodstid"], "fraga": "Vem drog upp urverket vid fyra och skrev ”H.W.” i loggboken med bläck?", "alternativ": [
    {"text": "Holger själv.", "svar": "Holger låg död i trappan sedan 03.20."},
    {"text": "Signe.", "svar": "Signe gick aldrig ut genom köket."},
    {"text": "Doktor Lagerkvist.", "svar": "Doktorn slog tidsmärken 03.45, 04.00 och 04.15. Han lämnade aldrig stationen."},
    {"text": "Elof – med sin egen reservoarpenna.", "ratt": True}],
   "slutsats": "Den som drog upp urverket vid fyra klev över Holger, slog inte larm och skrev hans signatur med den enda reservoarpennan på ön – Elofs."},
  {"id": "s-berattare", "kraver": ["f-dagbok-logn", "f-forfalskad"], "efter": ["s-vem"], "fraga": "Varför skriver Elof i sin dagbok att Holger visslade i tornet vid fyra?", "alternativ": [
    {"text": "Han drömde det.", "svar": "En dröm som råkar passa exakt med en förfalskad rad i loggboken?"},
    {"text": "För att Holger ska verka leva efter 03.20 – samma lögn som i loggboken.", "ratt": True}],
   "slutsats": "Dagboken och loggboken berättar samma lögn. Den som skickade dig papperen är den som skrev dem."},
]

fall["losning"] = {"skyldig": "elof", "hur": "knuff-0320",
  "hur_text": "Holger hade upptäckt att fotogenet försvann och tänkte anmäla Elof. Kl. 03.20 grep Elof tag i honom i trappan och knuffade honom. Vid fyra klev han över kroppen, drog upp urverket och skrev ”Uppdragning – H.W.” i loggboken med sin egen reservoarpenna – för att Holger skulle verka leva. Sedan skrev han samma lögn i sin dagbok och skickade alltihop till dig.",
  "bevisgrupper": [["f-forfalskad", "f-elofs-penna"], ["f-04-black", "f-elofs-penna"], ["f-klev-over", "f-elofs-penna"], ["f-dagbok-logn", "f-forfalskad"], ["f-dagbok-logn", "f-elofs-penna"], ["f-elof-ljuger", "f-forfalskad"]],
  "uteslutningar": {"signe": ["f-signe-alibi", "f-johan-koket"], "johan": ["f-johan-ben"], "lagerkvist": ["f-lagerkvist-alibi", "f-barograf"]},
  "uteslutningar_text": {
    "signe": "Motiv i brevet – men Johan låg vaken i köket, den enda vägen ut, och hon gick aldrig förbi honom.",
    "johan": "Ett spjälat, brutet ben. Ingen tar sig upp i en spiraltrappa så.",
    "lagerkvist": "Tidsmärken 03.15 och 03.30, och tjugo minuter fram och tillbaka till tornet. Han var vid barografen hela natten."}}
fall["anklagelse"] = {"hur_fraga": "Vad hände i tornet?", "hur_alternativ": [
    {"id": "olycka", "text": "Holger föll av sig själv i trappan – en olycka"},
    {"id": "knuff-04", "text": "Holger knuffades vid uppdragningen kl. 04"},
    {"id": "knuff-0320", "text": "Holger knuffades kl. 03.20 – loggboken förfalskades efteråt"},
    {"id": "galleri", "text": "Holger föll från galleriet i stormen och bars in"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["dok-instruktion", "dok-loggbok"], "text": "Läs fyrinstruktionen. Vad säger den om urverket – och om hur loggboken förs?"},
  {"niva": 2, "kostnad": 25, "kraver": ["f-uppdragen", "dok-fyndet", "f-dodstid"], "text": "Fyren lyste hela natten, så någon drog upp urverket kl. 04. Men kroppen låg i vägen redan från 03.20, och ingen kan ta sig upp utan att kliva över den. Vem skrev 04-anteckningen – och med vad?"},
  {"niva": 3, "kostnad": 50, "kraver": ["dok-dagbok", "f-04-black"], "text": "Stäm av alla fyra mot 03.20. Vem saknar alibi? Läs sedan berättarens egen dagbok en gång till: hur kan han veta att Holger visslade kl. 04?"}]
fall["aterkoppling"] = {
  "ratt": "Ni lät er inte förföras av en vänlig röst. Den som berättar en historia väljer vad som utelämnas. Elof glömde bara att hans egen penna skrev i bläck – och att en fyr med ett lik i trappan inte drar upp sig själv.",
  "efterord": "Det här fallet berättades av gärningsmannen. Brevet du fick, papperen som låg så prydligt framlagda, dagboken med visslingen vid fyra – allt var Elofs. Läs hans brev en gång till. Allt stod där.",
  "vandning": {"rubrik": "Elofs brev, läst en gång till", "rader": [
    {"citat": "Vi har låtit honom ligga, så som doktorn sade, och klivit över honom sedan dess.", "kommentar": "Han skriver det själv. Den som drog upp urverket vid fyra måste ha klivit över en död man – och Elof var den som skötte fyren."},
    {"citat": "Jag är bara fyrbiträde, men jag har varit tidningsman och vet hur viktigt det är med papper.", "kommentar": "En tidningsman skriver med reservoarpenna. Det fanns en enda på ön, och 04-raden i loggboken är skriven med bläck."},
    {"citat": "…och min egen dagbok, om den kan vara till någon hjälp.", "kommentar": "Dagboken var ingen hjälp. Den var hans alibi: visslingen vid fyra skulle låta Holger leva en timme till."},
    {"citat": "Allt ligger där ni hittar det.", "kommentar": "Han valde vad du skulle läsa. Men han letade aldrig i Holgers pulpet, där utkastet till Lotsverket låg kvar."},
    {"citat": "Det var nog en olyckshändelse.", "kommentar": "Den enda meningen i brevet som var en ren lögn."}],
   "bekannelse": "När båten från Sandhamn lägger till sitter Elof redan på bryggan med mössan i händerna. ”Sextio liter fotogen, herr detektiv. Han skulle ha fått mig avskedad och utskämd för sextio liter. Jag ville bara att han skulle släppa mig – och sedan låg han där.” Han ser upp mot lanternan. ”Fyren slocknade i alla fall inte. Det såg jag till.”"},
  "fel": {
    "signe": "Brevet ger ett motiv, men Johan låg vaken i köket hela natten. Signe gick aldrig ut.",
    "johan": "Främlingen är alltid lätt att misstänka, men med ett spjälat ben kommer man inte upp i en spiraltrappa.",
    "lagerkvist": "Ett gräl är inget mord. Barografen fick ett tidsmärke var femtonde minut, och tornet ligger tio minuter bort.",
    "elof": ""},
  "fel_allman": "Elof ser bekymrat på dig. ”Är ni säker, herr detektiv?” …",
  "forklaring_steg": [
    {"text": "Blåmärkena på överarmarna visar ett hårt grepp. Holger föll inte – han knuffades.", "fynd": ["f-blamarken"]},
    {"text": "Signe och doktorn hörde dunsen, oberoende av varandra, 03.20. Då dog Holger.", "fynd": ["f-duns-signe", "f-duns-lagerkvist", "f-dodstid"]},
    {"text": "Urverket går högst 2 t 15 min, men fyren lyste hela natten. Någon drog upp det vid fyra – och klev då över kroppen utan att slå larm.", "fynd": ["f-uppdragen", "f-klev-over"]},
    {"text": "04-raden är skriven med bläck, fast loggboken alltid förs med blyerts. Holger var död; signaturen är förfalskad. Den enda reservoarpennan på ön är Elofs – det skriver han själv.", "fynd": ["f-04-black", "f-forfalskad", "f-elofs-penna"]},
    {"text": "Elofs dagbok påstår att Holger visslade vid fyra och att Elof sov 23–06. Båda påståendena faller.", "fynd": ["f-dagbok-logn", "f-elof-ljuger"]},
    {"text": "Johan kan inte gå. Doktorn slog tidsmärken var femtonde minut. Signe gick aldrig förbi Johan i köket. Kvar blir Elof.", "fynd": ["f-johan-ben", "f-lagerkvist-alibi", "f-signe-alibi"]},
    {"text": "Motivet: Holger tänkte anmäla Elof för att han sålt fyrens fotogen. Kannorna står i hans stuga.", "fynd": ["f-anmalan", "f-fotogen-stuga"]}]}

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'fyren-pa-graskar.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
