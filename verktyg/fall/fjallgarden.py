# Genererar fall/fjallgarden-1968.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d
# 3D-modeller för den verkliga stilen (se js/tre/modeller.js och modeller/KALLOR.md)
VAGGLAMPA = {"fil": "modeller/industrial_wall_lamp.glb", "passa": "skala", "skala": 0.8, "pos": [0, -0.17, 0.056], "lyser": ["industrial_wall_lamp_glass"]}
S = lambda text, id=None, stil=None: {k: v for k, v in {"id": id, "text": text, "stil": stil}.items() if v}

# Tidslinje lördagen den 17 februari 1968 (kontrolleras mot alla texter):
# 20.00 storm · 21.00 gräl i baren (Per Hjort och Birgit) · 21.30 Sune tar över receptionen, fru Rydén börjar bridge (–23.15)
# 21.45 Per Hjort sätter sig i baren (–23.30) · 21.50 Sune låser skiddörren (kistlås), nyckeln i fickan till 07.00
# 21.50–22.25 direktör Holst i telefon med sin bror i Göteborg · 21.55 Birgit går ner i källaren med sin resväska
# ca 21.57 Claes går ner efter henne · ca 22.05 slaget · varuintagets bom lyfts av, kroppen bärs till forsen i Storån (100 m)
# 22.20 Claes kommer upp, andfådd, med snö i håret · 20/2 panelen i skidrummet spikas på Claes beställning
# 12/5 kroppen hittas i Storån, 2 km nedströms · oktober 2026 hittar snickaren skidor, pjäxor och resväska bakom panelen

fall = {
 "id": "fjallgarden-1968", "version": 1,
 "meta": {"titel": "Fjällgården, 1968", "miljo": "Fjällhotell i Storlien (kallt fall)", "epok": "Nutid", "brottstyp": "försvinnande", "langd": "medel",
   "uppskattad_tid_min": [15, 25], "svarighet": 4, "karnmekanik": "dokument", "bimekaniker": ["scen"], "twist": "tidshopp", "kraver_rang": 0,
   "accentfarg": "#3a5a6a", "omslag": "bilder/fall9/fjallgarden.jpg", "mal": "Ta reda på vad som hände Birgit Hallström 1968", "handledning_mal": "panelen"},
 "intro": {"rubrik": "Fjällgården, Storlien. Oktober 2026.",
   "text": "Fjällgården ska bli hotell igen efter tjugo år med igenspikade fönster. I går bröt snickaren Jonas Ahlqvist loss en gammal panel i skidrummet – och bakom den låg ett par träskidor, ett par pjäxor och en packad resväska.\n\nPå skidorna står det B.H. Birgit Hallström, receptionist på Fjällgården, försvann i en snöstorm den 17 februari 1968. Man trodde att hon hade gett sig ut på skidor; i maj hittades hon i Storån. Fallet lades ned. Utredaren hette Nils Strand, och det var hans sista fall innan han gick i pension.\n\nKriminalinspektör Maja Strand har hans gamla anteckningsbok i fickan. ”Farfars far trodde aldrig på olyckan”, säger hon. ”Nu har vi något han aldrig fick se. Läs den gamla akten igen – och jämför den med det som låg bakom panelen.”",
   "uppdrag": "Vad hände Birgit Hallström natten till den 18 februari 1968 – och vem lät det se ut som en skidtur?", "bild": "bilder/fall9/fjallgarden.jpg", "berattare": "Kriminalinspektör Maja Strand"},
 "personer": [
   {"id": "birgit", "namn": "Birgit Hallström", "roll": "Receptionist 1968, försvunnen", "misstankt": False, "beskrivning": "22 år, från Stockholm. Arbetade sin första säsong på Fjällgården."},
   {"id": "claes", "namn": "Claes Rydén", "roll": "Ägarens son 1968", "misstankt": T, "beskrivning": "24 år 1968, skulle ta över hotellet. Lever i dag, 82 år, i Östersund."},
   {"id": "per", "namn": "Per Hjort", "roll": "Skidlärare 1968", "misstankt": T, "beskrivning": "Norsk skidlärare, säsongsanställd. Avliden 2001."},
   {"id": "holst", "namn": "Ragnar Holst", "roll": "Hotelldirektör 1968", "misstankt": T, "beskrivning": "Skötte hotellet åt familjen Rydén. Avliden 1990."},
   {"id": "ester", "namn": "Ester Rydén", "roll": "Hotellets ägare 1968", "misstankt": T, "beskrivning": "Claes mor. Styrde Fjällgården med fast hand. Avliden 1994."},
   {"id": "sune", "namn": "Sune Lindberg", "roll": "Nattportier 1968, i dag 74 år", "misstankt": False, "beskrivning": "Var sexton år och satt i receptionen natten Birgit försvann."},
   {"id": "linnea", "namn": "Linnea Rydén", "roll": "Hotellets ägare i dag", "misstankt": False, "beskrivning": "Claes barnbarn. Har köpt tillbaka Fjällgården och renoverar det."},
   {"id": "jonas", "namn": "Jonas Ahlqvist", "roll": "Snickare", "misstankt": False, "beskrivning": "Hittade skidorna bakom panelen."}
 ],
 "moment": [], "fynd": [], "slutsatser": [],
}

KALLARE = {"omgivning": "#d8e0e8", "omgivning_styrka": 0.55, "bas": 0.3}

# ---------- Rum 1: Skidrummet ----------
skid = {"id": "skidrummet", "namn": "Skidrummet", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 6.0, "djup": 5.0, "hojd": 2.6, "miljo": "inomhus", "bakgrund": "#101418", "dimma": [6, 14, "#14181c"],
  "golv": {"typ": "sten"}, "verklig_golv": "hallar", "vagg": "puts", "putsfarg": "#c8c0b0", "panel": "#6a5a44",
  "ljus": KALLARE,
  "start": {"pos": [0.6, 1.4], "titta": 0},
  "objekt": [
    obj("panelen", "panelhal", [-0.6, 0, -2.5], interaktiv=ia("Den uppbrutna panelen",
        "Snickaren har brutit loss tre brädor i den gamla furupanelen vid norra väggen. Bakom dem finns ett hålrum, och där låg skidorna, pjäxorna och resväskan. Brädorna är gulnade av åren och spikarna rostiga – den här panelen har inte rörts på mycket länge.", "f-fyndet")),
    obj("skidorna", "skidor", [1.0, 0, -2.5], lutad=True),
    obj("pjaxorna", "pjaxor", [0.9, 0, -1.9], rot=-20),
    obj("vaskan", "resvaska", [-2.1, 0, -1.4], rot=20, interaktiv=ia("Resväskan",
        "En brun resväska från sextiotalet. Teknikerna har gått igenom allt som låg bakom panelen och skrivit en förteckning.", material=["dok-fyndrapport"])),
    obj("skidstallet", "skidstall", [2.99, 0, -0.6], rot=-90, antal=6, fylld=True),
    obj("skiddorren", "dorr", [2.99, 0, 1.4], rot=-90, farg="#5a4a3a", interaktiv=ia("Skiddörren",
        "Den tunga dörren ut mot backen har kvar sitt gamla kistlås. Ett kistlås öppnas med nyckel – från båda sidor. Utan nyckel kommer man varken in eller ut.", "f-kistlas")),
    obj("varuintaget", "dorr", [-2.99, 0, 0.4], rot=90, farg="#4a4a4a", interaktiv=ia("Varuintaget",
        "En smal dörr till varuintaget och ut mot Storån, som forsar hundra meter nedanför hotellet och aldrig fryser vid forsen. Insidan har järnkrampor för en bom. Den bommas inifrån varje kväll – utifrån går den inte att öppna, och den som går ut den vägen kan inte bomma igen efter sig.", "f-varuintaget")),
    obj("jonas", "person", [1.6, 0, 0.0], rot=-130, rock="#3a4a5a", byxor="#2a2a2a", hatt="mossa", hattfarg="#c87a2a", har="#6a5a4a", seed=40,
        interaktiv=ia("Snickaren Jonas Ahlqvist", "”Panelen satt löst i ena hörnet, så jag bröt loss den för att se om det fanns mögel bakom. Och så låg de där. Det kändes som att öppna en grav.”")),
    obj("lampa", "arbetslampa", [1.9, 0, -1.4], rot=140, lyser=True),
    obj("plast", "byggplast", [-2.97, 0, -1.6], rot=90, bredd=1.6, hojd=2.4),
    obj("trappan", "dorr", [-1.6, 0, 2.49], rot=180, gar_till="lobbyn", interaktiv=ia("Källartrappan",
        "Den smala trappan upp till lobbyn. Den slutar rakt bakom receptionsdisken – 1968 var det den enda trappan ner till källaren.", "f-trappan")),
    obj("bord", "bord", [1.6, 0, 1.9], storlek=[0.9, 0.76, 0.6], modell={"fil": "modeller/wooden_table_02.glb", "passa": "box"}),
    obj("bok", "anteckningsbok", [1.6, 0.77, 1.9], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
  ]}}}

# ---------- Rum 2: Lobbyn ----------
lobby = {"id": "lobbyn", "namn": "Lobbyn", "mekanik": "scen", "last_upp_av": ["f-fyndet"],
  "last_text": "Maja Strand: ”Titta på fyndet först. Sedan pratar vi med de andra.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 8.0, "djup": 6.0, "hojd": 3.2, "miljo": "inomhus", "bakgrund": "#14100c", "dimma": [8, 18, "#18140f"],
  "golv": "#6a4a30", "verklig_golv": "plankor", "vagg": "trapanel", "panelfarg": "#8a6a48", "panel": False,
  "ljus": {"omgivning": "#ffe2c0", "omgivning_styrka": 0.6, "bas": 0.32},
  "start": {"pos": [0.2, 2.2], "titta": 10},
  "objekt": [
    obj("disken", "bardisk", [1.6, 0, -2.0], storlek=[2.4, 1.05, 0.6]),
    obj("nyckeltavlan", "nyckelskap", [1.6, 1.3, -2.97]),
    obj("klockboken", "liggare", [1.1, 1.06, -2.0], interaktiv=ia("Receptionens klockbok",
        "Linnea har hittat den gamla klockboken i en låda under disken. Varje kontroll av receptionsklockan är införd med datum och signatur.", material=["dok-klockbok"])),
    obj("snickarboken", "liggare", [2.2, 1.06, -2.0], farg="#3a2a1a", interaktiv=ia("Snickarboken 1968",
        "Hotellets snickarbok för 1968, med varje beställt arbete. Den 20 februari: ”Skidrummet, lös panel vid norra väggen spikad. Beställt av herr Claes. /E. Nordh”.", "f-snickarbok")),
    obj("klockan", "vaggur", [3.9, 1.9, -1.0], rot=-90),
    obj("fotot", "tavla", [-3.97, 1.6, -0.6], rot=90, storlek=[0.9, 0.6], seed=41, motiv="foto", interaktiv=ia("Personalfotot 1968",
        "Ett inramat fotografi: Fjällgårdens personal, julen 1967. Längst fram står Birgit Hallström i röd anorak, och bredvid henne Claes Rydén med armen om hennes axlar. Fru Rydén, i mitten, ser åt ett annat håll.", "f-fotot")),
    obj("fatolj1", "fatolj", [-2.4, 0, -1.6], rot=40, modell={"fil": "modeller/arm_chair_01.glb", "passa": "box"}),
    obj("sune", "person", [-2.4, 0, -1.6], rot=40, pose="sitta", rock="#5a5a52", byxor="#3a3a36", har="#d8d8d8", glasogon=True, seed=42,
        interaktiv=ia("Sune Lindberg", "Sune Lindberg, 74 år, sitter i en av de gamla fåtöljerna med käppen över knäna. ”Jag satt bakom den där disken hela natten. Från halv tio till sju gick ingen ner i källaren – utom jag själv när jag låste skiddörren tio i tio, och sedan hon, fem i tio, med resväskan, och strax efter henne unge herr Claes. Han kom upp tjugo över tio, andfådd, med snö i håret.”", "f-bara-claes", ["dok-sune26"])),
    obj("linnea", "person", [0.2, 0, -0.8], rot=170, kon="k", rock="#2a3a4a", byxor="#2a2a2a", har="#8a5a3a", seed=43,
        interaktiv=ia("Linnea Rydén", "Linnea Rydén håller armarna i kors. ”Farfar har alltid sagt att hon gav sig ut på skidor. Det var det alla sa. Jag har aldrig hört något annat.”")),
    obj("plast", "byggplast", [-3.97, 0, 1.8], rot=90, bredd=2.0, hojd=2.6),
    obj("lampa", "arbetslampa", [-3.3, 0, 2.3], rot=-140, lyser=True),
    obj("kallardorr", "dorr", [3.0, 0, -2.99], gar_till="skidrummet", interaktiv=ia("Källartrappan", "Trappan bakom receptionsdisken, ner till skidrummet.")),
    obj("ytterdorr", "dorr", [-1.0, 0, 2.99], rot=180, gar_till="arkivet", interaktiv=ia("Bilen till Östersund", "Maja har ringt polisens arkiv i Östersund. Akten från 1968 ligger framme.")),
    obj("bok", "anteckningsbok", [2.6, 1.06, -2.0], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
  ]}}}

# ---------- Rum 3: Arkivet ----------
arkiv = {"id": "arkivet", "namn": "Polisens arkiv i Östersund", "mekanik": "scen", "last_upp_av": ["f-fyndet"],
  "last_text": "Maja Strand: ”Titta på fyndet först. Sedan åker vi till arkivet.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 6.0, "djup": 5.0, "hojd": 2.8, "miljo": "inomhus", "bakgrund": "#14161a", "dimma": [6, 14, "#181a1e"],
  "golv": "#5a5a5a", "vagg": "puts", "putsfarg": "#e0ddd4", "panel": False,
  "ljus": {"omgivning": "#eef2ff", "omgivning_styrka": 0.7, "bas": 0.4},
  "start": {"pos": [0, 1.6], "titta": 0},
  "objekt": [
    *[obj(f"hylla{i}", "hylla", [x, 0, -2.2], storlek=[1.6]) for i, x in enumerate([-2.0, 0.0, 2.0])],
    *[obj(f"lada{i}", "arkivlada", [x, 0, z], rot=r, antal=n, text="ÄRENDE\n1968") for i, (x, z, r, n) in enumerate([(-2.5, -1.3, 20, 3), (2.5, -1.3, -15, 2), (2.4, 1.6, -100, 3)])],
    obj("bord", "bord", [0, 0, 0.2], storlek=[1.6, 0.76, 0.8], modell={"fil": "modeller/metal_office_desk.glb", "passa": "box"}),
    obj("akten", "arkivlada", [-0.4, 0.77, 0.2], text="ÄRENDE 1968:47\nFJÄLLGÅRDEN", interaktiv=ia("Akten 1968:47",
        "Arkivkartongen med Nils Strands utredning. Förhörsprotokollen är maskinskrivna på tunt papper, med hans blyertsanteckningar i marginalen.", material=["dok-claes", "dok-sune68", "dok-holst", "dok-per", "dok-ester"])),
    obj("obduktionen", "parm", [0.35, 0.77, 0.25], interaktiv=ia("Obduktionsprotokollet",
        "En blå pärm från rättsläkarstationen i Umeå, maj 1968.", material=["dok-obduktion"])),
    obj("nils", "liggare", [0.6, 0.77, -0.05], storlek=[0.22, 0.16], farg="#1e1a18", interaktiv=ia("Nils Strands anteckningsbok",
        "Maja lägger farfars fars anteckningsbok på bordet, uppslagen vid februari 1968. Handstilen är densamma som i akten.", material=["dok-nils"])),
    obj("notorna", "papper", [-0.7, 0.77, 0.45], antal=3, interaktiv=ia("Barnotorna",
        "Kvitterade notor från baren den kvällen, med klockslag, och bartenderns förhör. Per Hjorts notor är kvitterade 21.50, 22.15 och 22.50 – vid bardisken.", "f-per-alibi", ["dok-bar"])),
    obj("bridge", "papper", [0.1, 0.77, 0.55], interaktiv=ia("Bridgeprotokollet",
        "Ett bridgeprotokoll från salongen: fru Rydén och tre gäster, robbert för robbert med klockslag från 21.30 till 23.15. Alla fyra har signerat. Gästerna intygar att ingen lämnade bordet.", "f-ester-alibi")),
    obj("telefon", "papper", [0.6, 0.77, 0.5], interaktiv=ia("Televerkets samtalsspecifikation",
        "Nils Strand begärde ut samtalslistan: rikssamtal från Fjällgårdens kontor till Göteborg den 17 februari 1968, 21.50–22.25. Telefonisten i Storlien minns att det var direktör Holst som talade – hon kopplade själv.", "f-holst-alibi")),
    obj("dator", "dator", [0.08, 0.77, -0.02], rot=10, skarm="POLISENS ARKIV\nÄrende 1968:47\nFjällgården, Storlien\nNedlagt 1968\nUtlånat till M. Strand"),
    obj("dorr", "dorr", [0, 0, 2.49], rot=180, gar_till="lobbyn", interaktiv=ia("Tillbaka till Fjällgården", "Bilen tillbaka till Storlien.")),
    obj("bok", "anteckningsbok", [-0.7, 0.77, -0.1], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [-2.98, 2.0, 0.6], rot=90, styrka=1.0, rackvidd=5, modell=VAGGLAMPA),
    obj("l2", "vagglampa", [2.98, 2.0, 0.6], rot=-90, styrka=1.0, rackvidd=5, modell=VAGGLAMPA),
  ]}}}

dokument = {"id": "akten", "namn": "Akten 1968:47", "mekanik": "dokument", "last_upp_av": ["f-fyndet"],
  "last_text": "Titta på fyndet bakom panelen först.",
  "payload": {"visning": "dokument",
  "kort_instruktion": "Läs den gamla akten och fyndrapporten och hitta det som inte kan stämma.",
  "instruktion": "Läs noga – också det som inte står. Tryck på två stycken, eller ett stycke och ett fynd, som inte kan vara sanna samtidigt och tryck Invänd! Med Markera kan du stryka under det du vill komma ihåg. Fel kostar ingenting.",
  "fel_text": "De två kan mycket väl stämma samtidigt. Läs igen – vad säger de om tider, dörrar, kläder och vem som gick vart?",
  "fynd_valbara": ["f-fyndet", "f-kistlas", "f-trappan", "f-varuintaget", "f-snickarbok", "f-fotot", "f-bara-claes", "f-per-alibi", "f-ester-alibi", "f-holst-alibi"],
  "dokument": [
    {"id": "dok-fyndrapport", "titel": "Förteckning över fyndet bakom panelen", "underrubrik": "Polisens tekniker, oktober 2026", "ikon": "🧾", "stil": "maskin", "stycken": [
      S("Ett par träskidor med kabelbindningar, märkta B.H. med vit färg. Två bambustavar.", "fr-skidor"),
      S("Ett par läderpjäxor för dam, storlek 37.", "fr-pjaxor"),
      S("En resväska med kläder för en längre resa. Överst, vikt: en röd anorak.", "fr-anorak"),
      S("En tågbiljett Storlien–Stockholm, söndag 18 februari 1968, tåg 07.12. Oklippt.", "fr-biljett"),
      S("Ett brev i ett oklistrat kuvert: ”Claes – jag åker med morgontåget. Jag kan inte gifta mig med dig när din mor ser på mig som hon gör. Förlåt mig. /Birgit”", "fr-brev")]},
    {"id": "dok-claes", "titel": "Förhör med Claes Rydén", "underrubrik": "Fjällgården, 18 februari 1968. Förhörsledare: N. Strand", "ikon": "📄", "stil": "maskin", "stycken": [
      S("Jag gick ner i källaren strax efter tio för att lägga fram mina pjäxor till morgondagen.", "c-kallare"),
      S("Klockan var tio över tio när jag såg Birgit gå ut genom skiddörren. Hon hade sin röda anorak på sig och skidorna på axeln.", "c-skiddorr"),
      S("Jag öppnade dörren och ropade efter henne, men hon hörde inte i stormen. Sedan gick jag upp och sa till portierpojken.", "c-ropade"),
      S("Fröken Hallström och jag var goda vänner, ingenting mer.", "c-vanner")]},
    {"id": "dok-sune68", "titel": "Förhör med Sune Lindberg, 16 år, nattportier", "underrubrik": "Fjällgården, 18 februari 1968. Förhörsledare: N. Strand", "ikon": "📄", "stil": "maskin", "stycken": [
      S("Jag tog över receptionen halv tio. Tio i tio gick jag ner och låste skiddörren, som man ska när det stormar. Det finns bara en nyckel till den, och den hade jag i fickan till klockan sju.", "s-last"),
      S("Varuintaget bommade jag vid nio, som varje kväll. Då var bommen på.", "s-bom"),
      S("Fem minuter senare gick fröken Hallström ner i källaren med sin resväska. Hon sa att hon skulle ställa den vid skiddörren, så att hon kunde gå direkt till stationen i gryningen. Hon sa god natt.", "s-ner"),
      S("Strax efter gick herr Claes ner samma väg. Han kom upp tjugo över tio. Han var andfådd och hade snö i håret och sa att fröken Hallström gett sig ut på skidor.", "s-upp"),
      S("Ingen annan gick ner eller upp i källartrappan i natt. Den går rakt bakom disken.", "s-ingen")]},
    {"id": "dok-holst", "titel": "Förhör med direktör Ragnar Holst", "underrubrik": "Fjällgården, 18 februari 1968", "ikon": "📄", "stil": "maskin", "stycken": [
      S("Jag talade i telefon med min bror i Göteborg från tio i tio till tjugofem över tio, i kontoret bakom receptionen.", "h-telefon"),
      S("Pojken har säkert läst fel på klockan. Receptionsklockan har gått före hela vintern.", "h-klockan"),
      S("På morgonen var bommen på varuintaget avlyft. Det händer att pojkarna smiter ut och röker där.", "h-bom")]},
    {"id": "dok-per", "titel": "Förhör med skidläraren Per Hjort", "underrubrik": "Fjällgården, 18 februari 1968", "ikon": "📄", "stil": "maskin", "stycken": [
      S("Jag satt i baren från kvart i tio till halv tolv. Fråga bartendern.", "p-bar"),
      S("Fröken Hallström? Jag pratade inte med henne på hela kvällen.", "p-pratade")]},
    {"id": "dok-bar", "titel": "Förhör med bartendern Arne Wikström", "underrubrik": "Fjällgården, 18 februari 1968", "ikon": "📄", "stil": "maskin", "stycken": [
      S("Klockan nio grälade skidläraren och fröken Hallström vid bardisken. Han ville att hon skulle stanna säsongen ut. Hon grät och gick.", "b-gral"),
      S("Hjort satt sedan vid disken från kvart i tio tills vi stängde halv tolv. Jag kvitterade hans notor själv.", "b-per")]},
    {"id": "dok-ester", "titel": "Förhör med fru Ester Rydén", "underrubrik": "Fjällgården, 18 februari 1968", "ikon": "📄", "stil": "maskin", "stycken": [
      S("Jag spelade bridge i salongen från halv tio till kvart över elva. Mina gäster kan intyga det.", "e-bridge"),
      S("Min son och en receptionist? Det var aldrig tal om någonting sådant.", "e-aldrig"),
      S("Portierpojken är sexton år och vill göra sig viktig. Jag ber kommissarien att inte fästa vikt vid hans prat.", "e-pojken")]},
    {"id": "dok-obduktion", "titel": "Obduktionsprotokoll", "underrubrik": "Statens rättsläkarstation i Umeå, maj 1968", "ikon": "🩺", "stil": "maskin", "stycken": [
      S("Kroppen påträffad den 12 maj 1968 i Storån, två kilometer nedströms Fjällgården.", "o-fynd"),
      S("Klädd i kofta, kjol och inomhustofflor. Ingen ytterjacka, inga pjäxor, inga skidor eller stavar har påträffats.", "o-klader"),
      S("Skallfraktur i bakhuvudet. Kan ha uppkommit genom fall i forsen. Döden har sannolikt inträffat kort efter försvinnandet.", "o-skada")]},
    {"id": "dok-nils", "titel": "Nils Strands anteckningsbok", "underrubrik": "Februari–maj 1968", "ikon": "📓", "stil": "hand", "stycken": [
      S("Tofflor! Ingen går ut i snöstorm i tofflor. Men skidorna saknas ju – var är de?", "n-tofflor"),
      S("Holst säger att receptionsklockan går före. Kontrollera klockboken! (Fick inte se den – ”bortslarvad”.)", "n-klocka"),
      S("Pojken säger att bara C. R. gick ner efter henne. Fru Rydén säger att pojken ljuger. Åklagaren lägger ned. Jag går i pension i juni.", "n-lagt")]},
    {"id": "dok-klockbok", "titel": "Receptionens klockbok", "underrubrik": "Fjällgården, vintern 1967–68", "ikon": "🕰️", "stil": "hand", "stycken": [
      S("10/2 1968 kl. 18.00. Receptionsklockan kontrollerad mot Fröken Ur. Går rätt. /R. Holst", "k-10"),
      S("17/2 1968 kl. 18.00. Receptionsklockan kontrollerad mot Fröken Ur. Går rätt. /R. Holst", "k-17")]},
    {"id": "dok-sune26", "titel": "Sune Lindberg i dag", "underrubrik": "Fjällgården, oktober 2026", "ikon": "🗣️", "stil": "hand", "stycken": [
      S("De sa att jag läst fel på klockan, och åklagaren trodde på dem. Men jag låste skiddörren tio i tio som jag skulle, och nyckeln låg i min ficka hela natten.", "su-nyckel"),
      S("Skiddörren har kistlås. Den går inte att öppna inifrån utan nyckel – inte då och inte nu.", "su-kistlas"),
      S("Den enda andra vägen ut från källaren är varuintaget, och det bommas inifrån.", "su-varu")]},
  ],
  "motsagelser": [
    {"id": "m-dorren", "par": [["c-skiddorr", "s-last"], ["c-skiddorr", "su-nyckel"], ["c-ropade", "s-last"], ["c-ropade", "f-kistlas"], ["c-skiddorr", "f-kistlas"]], "ger_fynd": "f-dorren", "text": "Claes säger att Birgit gick ut genom skiddörren 22.10 och att han öppnade den och ropade. Men dörren låstes med kistlås 21.50, och nyckeln låg i Sunes ficka till sju. Utan nyckel öppnas den inte ens inifrån."},
    {"id": "m-anorak", "par": [["c-skiddorr", "fr-anorak"]], "ger_fynd": "f-anoraken", "text": "Claes såg Birgit gå ut i sin röda anorak – men den röda anoraken låg vikt i hennes resväska bakom panelen."},
    {"id": "m-skidor", "par": [["c-skiddorr", "fr-skidor"], ["c-skiddorr", "o-klader"], ["n-tofflor", "fr-skidor"]], "ger_fynd": "f-skidorna", "text": "Skidorna och pjäxorna som hon skulle ha gett sig ut med låg bakom panelen i skidrummet, och hon hittades i tofflor. Birgit gick aldrig ut på skidor."},
    {"id": "m-klockan", "par": [["h-klockan", "k-17"], ["h-klockan", "k-10"]], "ger_fynd": "f-klockan", "text": "Direktören sa att receptionsklockan gick före. Men han hade själv kontrollerat den mot Fröken Ur samma kväll klockan sex: den gick rätt. Sunes tider stämmer."},
    {"id": "m-vanner", "par": [["c-vanner", "fr-brev"], ["c-vanner", "f-fotot"], ["e-aldrig", "fr-brev"]], "ger_fynd": "f-forlovade", "text": "”Goda vänner, ingenting mer”? Birgits brev säger att hon inte kan gifta sig med Claes. De var förlovade i hemlighet – och hon tänkte lämna honom med morgontåget."},
    {"id": "m-per", "par": [["p-pratade", "b-gral"]], "ger_fynd": "f-per-ljog", "text": "Per Hjort sa att han inte pratade med Birgit på hela kvällen – men klockan nio grälade de vid bardisken."},
  ]}}

fall["moment"] = [skid, lobby, arkiv, dokument]

fall["fynd"] = [
  {"id": "f-fyndet", "titel": "Fyndet bakom panelen", "ikon": "🎿", "typ": "nyckel", "text": "Bakom en panel i skidrummet låg Birgit Hallströms skidor, pjäxor och packade resväska – i femtioåtta år."},
  {"id": "f-kistlas", "titel": "Kistlåset", "ikon": "🔑", "typ": "nyckel", "text": "Skiddörren har ett kistlås som kräver nyckel från båda sidor. Utan nyckel kommer man varken in eller ut."},
  {"id": "f-varuintaget", "titel": "Varuintaget", "ikon": "🚪", "typ": "stod", "text": "Varuintaget bommas inifrån varje kväll och leder ut mot forsen i Storån, hundra meter bort. Utifrån går det inte att öppna, och den som går ut kan inte bomma igen efter sig."},
  {"id": "f-trappan", "titel": "Källartrappan", "ikon": "🪜", "typ": "nyckel", "text": "1968 gick den enda trappan ner till källaren rakt bakom receptionsdisken, där nattportiern satt."},
  {"id": "f-snickarbok", "titel": "Snickarboken", "ikon": "🔨", "typ": "nyckel", "galler": ["claes"], "text": "Den 20 februari 1968, tre dagar efter försvinnandet, spikades den lösa panelen i skidrummet – beställt av herr Claes."},
  {"id": "f-fotot", "titel": "Personalfotot", "ikon": "🖼️", "typ": "stod", "galler": ["claes"], "text": "På personalfotot från julen 1967 står Claes Rydén med armen om Birgit Hallström, som har sin röda anorak på sig."},
  {"id": "f-bara-claes", "titel": "Bara Claes gick ner", "ikon": "🛎️", "typ": "nyckel", "galler": ["claes", "per", "holst", "ester"], "text": "Sune satt bakom disken hela natten. Efter Birgit 21.55 gick bara Claes ner i källaren. Han kom upp 22.20, andfådd och med snö i håret – fast skiddörren var låst och varuintaget bommat inifrån."},
  {"id": "f-per-alibi", "titel": "Hjort i baren", "ikon": "🍺", "typ": "nyckel", "galler": ["per"], "text": "Per Hjort satt vid bardisken 21.45–23.30. Hans notor är kvitterade 21.50, 22.15 och 22.50."},
  {"id": "f-ester-alibi", "titel": "Fru Rydéns bridge", "ikon": "🃏", "typ": "nyckel", "galler": ["ester"], "text": "Fru Rydén spelade bridge med tre gäster 21.30–23.15. Protokollet är signerat av alla fyra."},
  {"id": "f-holst-alibi", "titel": "Direktörens telefonsamtal", "ikon": "☎️", "typ": "nyckel", "galler": ["holst"], "text": "Direktör Holst talade i telefon med Göteborg 21.50–22.25. Telefonisten i Storlien kopplade samtalet och minns att det var han."},
  {"id": "f-dorren", "titel": "Ingen gick ut genom skiddörren", "ikon": "🚫", "typ": "nyckel", "galler": ["claes"], "text": "Skiddörren låstes med kistlås 21.50 och nyckeln låg i Sunes ficka. Claes kan inte ha sett Birgit gå ut den vägen 22.10, eller öppnat dörren och ropat."},
  {"id": "f-anoraken", "titel": "Den röda anoraken", "ikon": "🧥", "typ": "nyckel", "galler": ["claes"], "text": "Den röda anorak som Claes såg Birgit gå ut i låg vikt i hennes resväska bakom panelen."},
  {"id": "f-skidorna", "titel": "Hon gick aldrig ut", "ikon": "🎿", "typ": "nyckel", "text": "Skidorna och pjäxorna låg bakom panelen, och Birgit hittades i tofflor. Hon gick aldrig ut på skidor."},
  {"id": "f-klockan", "titel": "Klockan gick rätt", "ikon": "🕰️", "typ": "nyckel", "galler": ["holst"], "text": "Direktören sa att receptionsklockan gick före – men han hade själv kontrollerat den mot Fröken Ur klockan sex samma kväll. Den gick rätt."},
  {"id": "f-forlovade", "titel": "Förlovade i hemlighet", "ikon": "💍", "typ": "stod", "galler": ["claes"], "text": "Birgits brev visar att hon och Claes var förlovade – och att hon tänkte lämna honom med morgontåget.", "forklaring": "Motivet: Birgit tänkte bryta förlovningen och resa sin väg."},
  {"id": "f-per-ljog", "titel": "Grälet i baren", "ikon": "🗯️", "typ": "avledande", "galler": ["per"], "text": "Per Hjort sa att han inte pratade med Birgit, men de grälade vid bardisken klockan nio.", "forklaring": "Hjort ville att hon skulle stanna säsongen ut och skämdes över grälet. Från kvart i tio satt han i baren hela kvällen."},
]

fall["slutsatser"] = [
  {"id": "s-gickut", "kraver": ["f-skidorna", "f-anoraken"], "fraga": "Gav sig Birgit ut i stormen på skidor, som man trodde 1968?", "alternativ": [
    {"text": "Ja – skidorna saknades i skidstället.", "svar": "De saknades i stället – men nu har de hittats bakom panelen."},
    {"text": "Nej – skidorna, pjäxorna och anoraken låg bakom panelen, och hon hittades i tofflor.", "ratt": True},
    {"text": "Ja – men hon vände och kom in igen.", "svar": "I tofflor och kofta, utan anorak? Hon gick aldrig ut på skidor."}],
   "slutsats": "Birgit gick aldrig ut på skidor. Någon gömde hennes skidor, pjäxor och väska för att det skulle se ut som en skidtur."},
  {"id": "s-dorren", "kraver": ["f-dorren"], "fraga": "Kunde Birgit ha gått ut genom skiddörren klockan tio över tio?", "alternativ": [
    {"text": "Ja – den kan ha stått olåst.", "svar": "Sune låste den med kistlås tio i tio och hade nyckeln i fickan."},
    {"text": "Nej – den var låst med kistlås från 21.50, och nyckeln låg i Sunes ficka.", "ratt": True}],
   "slutsats": "Ingen gick ut genom skiddörren efter 21.50. Den som sa sig ha sett det ljög."},
  {"id": "s-klockan", "kraver": ["f-klockan"], "fraga": "Direktören sa 1968 att portierpojken hade läst fel på klockan. Stämmer det?", "alternativ": [
    {"text": "Ja – receptionsklockan gick före hela vintern.", "svar": "Holst kontrollerade den själv mot Fröken Ur klockan sex samma kväll."},
    {"text": "Nej – klockan gick rätt. Sunes tider håller.", "ratt": True}],
   "slutsats": "Receptionsklockan gick rätt. Sunes tider från 1968 stämmer."},
  {"id": "s-kallaren", "kraver": ["f-bara-claes", "f-trappan"], "efter": ["s-gickut"], "fraga": "Birgit gick ner i källaren 21.55 och kom aldrig ut på skidor. Vem kan ha varit där nere med henne?", "alternativ": [
    {"text": "Vem som helst på hotellet.", "svar": "Källartrappan gick rakt bakom receptionen, och skiddörren var låst."},
    {"text": "Bara Claes Rydén – han gick ner strax efter henne och kom upp 22.20 med snö i håret.", "ratt": True},
    {"text": "Någon som kom in utifrån genom varuintaget.", "svar": "Sune bommade varuintaget vid nio, och utifrån går det inte att öppna."}],
   "slutsats": "Bara Claes Rydén var i källaren med Birgit. Snön i hans hår kom inte från skiddörren – den var låst. Han hade varit ute genom varuintaget, vars bom var avlyft på morgonen."},
  {"id": "s-per", "kraver": ["f-per-ljog", "f-per-alibi"], "efter": ["s-kallaren"], "fraga": "Per Hjort ljög om grälet. Kan han ha något med försvinnandet att göra?", "alternativ": [
    {"text": "Ja – han grälade med henne och ljög om det.", "svar": "Grälet var klockan nio. Var satt han efter kvart i tio?"},
    {"text": "Nej – han satt i baren 21.45–23.30, och han gick aldrig ner i källaren.", "ratt": True}],
   "slutsats": "Hjort ljög om grälet av skam. Han satt vid bardisken hela kvällen."},
  {"id": "s-ovriga", "kraver": ["f-holst-alibi", "f-ester-alibi"], "efter": ["s-kallaren"], "fraga": "Direktören och fru Rydén försvarade Claes 1968. Kan någon av dem ha gjort det?", "alternativ": [
    {"text": "Ja – de ljög båda för att skydda Claes.", "svar": "Att skydda någon är inte att ha gjort det. Var var de när Birgit och Claes var i källaren?"},
    {"text": "Nej – direktören talade i telefon 21.50–22.25 och fru Rydén spelade bridge 21.30–23.15. Ingen av dem gick ner i källaren.", "ratt": True}],
   "slutsats": "Holst och fru Rydén skyddade Claes, men ingen av dem var i källaren."},
  {"id": "s-panelen", "kraver": ["f-snickarbok", "f-fyndet"], "fraga": "Vem lät spika igen panelen som skidorna låg bakom?", "alternativ": [
    {"text": "Snickaren, på eget initiativ.", "svar": "Snickarboken säger vem som beställde arbetet."},
    {"text": "Claes Rydén – tre dagar efter försvinnandet.", "ratt": True}],
   "slutsats": "Den 20 februari 1968 lät Claes spika igen panelen i skidrummet, med Birgits skidor och väska bakom."},
]

fall["losning"] = {"skyldig": "claes", "hur": "panelen",
  "hur_text": "Birgit gick aldrig ut. Claes följde efter henne ner i källaren, där hon tänkte gå till morgontåget med sin väska och sitt brev. Han slog henne, bar ut henne genom varuintaget till forsen i Storån och gömde hennes skidor, pjäxor och väska bakom en lös panel i skidrummet, som han lät spika igen tre dagar senare. Sedan påstod han att han sett henne ge sig ut på skidor.",
  "bevisgrupper": [["f-dorren", "f-bara-claes"], ["f-anoraken", "f-bara-claes"], ["f-dorren", "f-anoraken"], ["f-snickarbok", "f-skidorna"], ["f-bara-claes", "f-skidorna", "f-snickarbok"], ["f-dorren", "f-snickarbok"]],
  "uteslutningar": {"per": ["f-per-alibi", "f-bara-claes"], "holst": ["f-holst-alibi", "f-bara-claes"], "ester": ["f-ester-alibi", "f-bara-claes"]},
  "uteslutningar_text": {
    "per": "Satt vid bardisken 21.45–23.30 – notorna är kvitterade 21.50, 22.15 och 22.50 – och gick aldrig ner i källaren.",
    "holst": "Talade i telefon med Göteborg 21.50–22.25. Han ljög om klockan för att skydda ägarens son, men han var aldrig i källaren.",
    "ester": "Spelade bridge med tre gäster 21.30–23.15. Hon skyddade sin son, men gick aldrig ner i källaren."}}
fall["anklagelse"] = {"hur_fraga": "Vad hände Birgit Hallström?", "hur_alternativ": [
    {"id": "olycka", "text": "Hon gav sig ut på skidor i stormen och gick vilse"},
    {"id": "motte", "text": "Hon gick ut genom skiddörren och mötte någon där ute"},
    {"id": "panelen", "text": "Hon kom aldrig ut på skidor – hennes skidor och väska gömdes bakom panelen för att det skulle se ut som en skidtur"},
    {"id": "rymde", "text": "Hon rymde till Stockholm med morgontåget"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["f-fyndet", "dok-fyndrapport", "dok-claes", "dok-obduktion"], "text": "Börja med att jämföra fyndet bakom panelen med det som sades 1968. Hur skulle Birgit ha gett sig ut i stormen – och i vad? Läs förteckningen, förhören och obduktionen bredvid varandra."},
  {"niva": 2, "kostnad": 25, "kraver": ["dok-sune68", "dok-sune26", "dok-holst", "dok-klockbok"], "text": "Om hon aldrig gick ut på skidor: vem påstod 1968 att han såg henne gå, och kunde det stämma med skiddörren? Varför trodde ingen på portierpojkens tider – och höll invändningen?"},
  {"niva": 3, "kostnad": 50, "kraver": ["f-bara-claes", "f-snickarbok", "f-per-alibi", "f-holst-alibi", "f-ester-alibi"], "text": "Tre av de misstänkta har bridgeprotokoll, notor och en telefonlista som håller dem borta från källaren. Den fjärde gick ner efter henne och kom upp med snö i håret, fast skiddörren var låst – vilken väg tog han ut? Och vem beställde att panelen skulle spikas igen?"}]
fall["aterkoppling"] = {
  "ratt": "Det tog femtioåtta år och en lös panel. Birgit gick aldrig ut i stormen: hennes skidor, pjäxor och röda anorak låg kvar bakom brädorna i skidrummet. Skiddörren var låst, receptionsklockan gick rätt, och den enda som gick ner i källaren efter henne var Claes Rydén – som hon tänkte lämna med morgontåget. Nils Strand hade rätt om tofflorna. Han fick bara aldrig se vad som låg bakom panelen.",
  "efterord": "Det här fallet utreddes två gånger. 1968 hade Nils Strand nästan allt – utom det som låg bakom panelen, och en åklagare som hellre trodde ägarfamiljen än en sextonårig portier. 2026 avgjordes det av samma papper, lästa med nya ögon. Claes Rydén, 82 år, erkände när Maja Strand lade fram förteckningen och Birgits brev. Brottet är preskriberat sedan länge, men Birgits syster fick till slut veta sanningen.",
  "vandning": {"rubrik": "Nils Strands anteckningar, lästa en gång till", "rader": [
    {"citat": "Tofflor! Ingen går ut i snöstorm i tofflor. Men skidorna saknas ju – var är de?", "kommentar": "Han hade rätt redan i februari 1968. Skidorna saknades bara för att någon hade gömt dem tre meter bort."},
    {"citat": "Kontrollera klockboken! (Fick inte se den – ”bortslarvad”.)", "kommentar": "Klockboken låg kvar i en låda under receptionsdisken – med direktörens egen signatur på att klockan gick rätt."},
    {"citat": "Pojken säger att bara C. R. gick ner efter henne. Fru Rydén säger att pojken ljuger.", "kommentar": "Pojken talade sanning. Det enda som saknades var ett bevis som ingen kunde vifta bort."}],
   "bekannelse": "”Jag ville bara att hon skulle stanna”, sa Claes Rydén. ”Jag har hört stormen varje vinter sedan dess.”"},
  "fel": {
    "per": "Hjort ljög om grälet, men han satt vid bardisken hela kvällen och gick aldrig ner i källaren.",
    "holst": "Direktören ljög om klockan för att skydda ägarens son – men han talade i telefon med Göteborg när Birgit försvann.",
    "ester": "Fru Rydén skyddade sin son, men hon spelade bridge med tre gäster hela kvällen."},
  "fel_allman": "Maja Strand bläddrar i farfars fars anteckningsbok och skakar på huvudet …",
  "forklaring_steg": [
    {"text": "Bakom panelen låg Birgits skidor, pjäxor och resväska med den röda anoraken. Hon hittades i tofflor. Hon gick aldrig ut på skidor.", "fynd": ["f-fyndet", "f-skidorna", "f-anoraken"]},
    {"text": "Claes sa att han såg henne gå ut genom skiddörren 22.10 och att han ropade efter henne. Men dörren var låst med kistlås från 21.50, och nyckeln låg i Sunes ficka.", "fynd": ["f-dorren", "f-kistlas"]},
    {"text": "1968 sa direktören att pojken läst fel på klockan. Men Holst hade själv kontrollerat klockan mot Fröken Ur samma kväll.", "fynd": ["f-klockan"]},
    {"text": "Källartrappan gick bakom receptionen. Efter Birgit gick bara Claes ner, och han kom upp med snö i håret – ute hade han varit genom varuintaget, vars bom var avlyft på morgonen.", "fynd": ["f-bara-claes", "f-trappan", "f-varuintaget"]},
    {"text": "Hjort satt i baren, Holst talade i telefon och fru Rydén spelade bridge. Ingen av dem var i källaren.", "fynd": ["f-per-alibi", "f-holst-alibi", "f-ester-alibi"]},
    {"text": "Birgit tänkte bryta förlovningen och åka med morgontåget. Tre dagar efter försvinnandet lät Claes spika igen panelen.", "fynd": ["f-forlovade", "f-snickarbok"]}]}

# Miljöljud per rum (se js/ljud.js)
LJUD = {"skidrummet": [{"typ": "dropp", "styrka": 0.5}, {"typ": "vind", "styrka": 0.3}], "lobbyn": [{"typ": "tick", "styrka": 0.5}, {"typ": "vind", "styrka": 0.4}], "arkivet": [{"typ": "tick", "styrka": 0.4}]}
for m in fall["moment"]:
  if m["id"] in LJUD: m["payload"]["rum"]["ljud"] = LJUD[m["id"]]

TEXT_I = {"skidrummet": "i skidrummet", "lobbyn": "i lobbyn", "arkivet": "i polisens arkiv i Östersund"}
for m in fall["moment"]:
  if m["id"] in TEXT_I: m["text_i"] = TEXT_I[m["id"]]

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'fjallgarden-1968.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
